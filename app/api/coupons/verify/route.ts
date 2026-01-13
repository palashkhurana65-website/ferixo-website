import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    
    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ error: "Invalid or inactive coupon" }, { status: 400 });
    }

    if (new Date() > coupon.expiryDate) {
      return NextResponse.json({ error: "Coupon expired" }, { status: 400 });
    }

    return NextResponse.json({ 
      discount: coupon.discount, 
      maxAmount: coupon.maxAmount 
    });
  } catch (error) {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}