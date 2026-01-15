import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Razorpay from "razorpay";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, shippingAddress, cartItems, couponCode } = body;

    // 1. AUTO-ACCOUNT: Find or Create User
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: { email, name, role: "CUSTOMER" }
      });
    }

    // 2. SAVE ADDRESS (Upsert logic could be added, creating new for now)
    await prisma.address.create({
      data: {
        userId: user.id,
        type: "SHIPPING",
        ...shippingAddress
      }
    });

    // 3. CALCULATE TOTALS
    const subtotal = cartItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    
    // --- TAX LOGIC (Punjab) ---
    // If Punjab -> CGST (9%) + SGST (9%) = 18%
    // If Other -> IGST (18%)
    // Assuming prices are inclusive, we extract tax. If exclusive, we add it. 
    // Let's assume PRICES ARE EXCLUSIVE of tax for this calculation:
    const taxRate = 0.18;
    const taxAmount = subtotal * taxRate;
    
    let discountAmount = 0;

    // 4. VERIFY COUPON (Double check server side)
    if (couponCode) {
       const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
       if (coupon && coupon.isActive && new Date() < coupon.expiryDate) {
          const rawDiscount = (subtotal * coupon.discount) / 100;
          discountAmount = coupon.maxAmount ? Math.min(rawDiscount, coupon.maxAmount) : rawDiscount;
       }
    }

    const shippingAmount = subtotal > 500 ? 0 : 99; // Free shipping over 500
    const finalAmount = Math.round(subtotal + taxAmount + shippingAmount - discountAmount);

    // 5. CREATE RAZORPAY ORDER
    const razorpayOrder = await razorpay.orders.create({
      amount: finalAmount * 100, // Amount in paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    // 6. SAVE ORDER TO DB (Pending state)
    const newOrder = await prisma.order.create({
      data: {
        userId: user.id,
        items: cartItems,
        totalAmount: subtotal,
        taxAmount,
        shippingAmount,
        discountAmount,
        finalAmount,
        status: "PENDING",
        paymentId: razorpayOrder.id, // Store Rz order ID initially
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
    console.error(error);
    return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
  }
}