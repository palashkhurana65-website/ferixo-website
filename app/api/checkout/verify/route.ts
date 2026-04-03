import { NextResponse } from "next/server";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import { sendOrderConfirmations } from "@/lib/emails"; // The email file we created earlier

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // 1. Verify the Razorpay Signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Razorpay secret is missing" }, { status: 500 });
    }

    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isAuthentic = generatedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // ... (Keep Step 1: Verify the Razorpay Signature exactly as it is) ...

    // 2. Safely Find the Order and the User
    const existingOrder = await prisma.order.findFirst({
      where: { paymentId: razorpay_order_id },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found in database" }, { status: 404 });
    }

    // Fetch the user separately to avoid relational TypeScript errors
    const orderUser = await prisma.user.findUnique({
      where: { id: existingOrder.userId },
    });

    if (!orderUser) {
      return NextResponse.json({ error: "Customer details not found" }, { status: 404 });
    }

    // 3. Update the Order using its true unique ID
    const updatedOrder = await prisma.order.update({
      where: { id: existingOrder.id },
      data: {
        status: "PAID",
        paymentId: razorpay_payment_id,
      },
    });

    // 4. Trigger the Confirmation Emails via Resend
    try {
      // Parse the JSON items safely
      const parsedItems = typeof updatedOrder.items === 'string' 
        ? JSON.parse(updatedOrder.items) 
        : updatedOrder.items;

      await sendOrderConfirmations({
        orderId: updatedOrder.id,
        customerName: orderUser.name || "Ferixo Customer",
        customerEmail: orderUser.email || "guest@ferixo.in",
        totalAmount: updatedOrder.finalAmount,
        items: parsedItems.cart || [],
      });
    } catch (emailError) {
      console.error("Email send failed, but order was saved:", emailError);
    }

    // 5. Return success to the frontend
    return NextResponse.json({ success: true, orderId: updatedOrder.id });

  } catch (error) {
    console.error("PAYMENT VERIFICATION ERROR:", error);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
  }
}