import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Razorpay from "razorpay";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // 1. Initialize Razorpay (RUNTIME CHECK)
    // We do this inside the function so the build doesn't crash if keys are missing
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("ERROR: Razorpay keys are missing in .env file");
      return NextResponse.json({ error: "Server payment configuration missing" }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const body = await req.json();
    const { email, name, phone, shippingAddress, cartItems, couponCode, saveToProfile } = body;

    // 2. Find or Create User
    let user = await prisma.user.findUnique({ where: { email } });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      user = await prisma.user.create({
        data: { email, name, phone, role: "CUSTOMER" }
      });
    }

    // 3. Address Saving Logic (Robust)
    // Only save if it's a new user OR they explicitly asked to save it
    if (isNewUser || saveToProfile) {
      try {
        await prisma.address.create({
          data: {
            userId: user.id,
            // explicitly map fields to ensure safety
            type: "SHIPPING", 
            country: "India", 
            street: shippingAddress.street,
            city: shippingAddress.city,
            state: shippingAddress.state,
            pincode: shippingAddress.pincode
          }
        });
      } catch (addrError) {
        // Log error but DO NOT stop the order. 
        // This prevents the "Order creation failed" error if the DB schema is mismatched.
        console.error("Address Save Warning (Check Schema):", addrError);
      }
    }

// 4. Calculate Totals (Inclusive Logic)
    const subtotal = cartItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    
    // Extract Tax (Do not add it)
    const taxAmount = subtotal - (subtotal / 1.18);
    
    let discountAmount = 0;
    if (couponCode) {
        const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
        const now = new Date();
        
        // Check if coupon exists, is active, and is within the start & end dates
        if (coupon && coupon.isActive && now >= coupon.startDate && now <= coupon.endDate) {
            // maxAmount was removed from schema, just apply the percentage discount
            discountAmount = (subtotal * coupon.discount) / 100;
        }
    }

    const shippingAmount = subtotal > 5000 ? 0 : 0;
    const finalAmount = Math.round(subtotal + shippingAmount - discountAmount);

    // --- NEW: CUSTOM ORDER ID GENERATION ---
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(`${currentYear}-01-01T00:00:00.000Z`);

    // Count how many orders exist this year to determine the next number
    const yearlyOrderCount = await prisma.order.count({
      where: {
        createdAt: {
          gte: startOfYear,
        },
      },
    });

    // Format: "FER-001-2026"
    const sequenceString = (yearlyOrderCount + 1).toString().padStart(3, '0');
    const customOrderId = `FER-${sequenceString}-${currentYear}`;

    // 5. Create Order on Razorpay
    const razorpayOrder = await razorpay.orders.create({
      amount: finalAmount * 100,
      currency: "INR",
      receipt: customOrderId, // Attach custom ID to Razorpay receipt
    });

    // 6. Save Order to Database
    const newOrder = await prisma.order.create({
      data: {
        id: customOrderId, // <-- OVERRIDES PRISMA'S DEFAULT RANDOM ID
        userId: user.id,
        items: {
          cart: cartItems,
          shippingSnapshot: shippingAddress
        },
        totalAmount: subtotal,
        taxAmount,
        shippingAmount,
        discountAmount,
        finalAmount,
        status: "PENDING",
        paymentId: razorpayOrder.id,
      }
    });

    return NextResponse.json({ 
      orderId: newOrder.id, 
      razorpayOrderId: razorpayOrder.id, 
      amount: finalAmount * 100,
      currency: "INR",
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID 
    });

  } catch (error) {
    // This logs the specific error to your terminal so you can fix it
    console.error("CRITICAL ORDER ERROR:", error);
    return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
  }
}