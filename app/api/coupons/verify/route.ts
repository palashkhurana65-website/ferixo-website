import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    // 1. Find Coupon (Case Insensitive)
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    // 2. Check Validity
    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
    }

    // 3. Check Date Range (Start & End)
    const now = new Date();
    if (now < new Date(coupon.startDate) || now > new Date(coupon.endDate)) {
       return NextResponse.json({ error: "Coupon is expired or not active yet" }, { status: 400 });
    }

    // 4. Return Discount Info
    return NextResponse.json({ 
        code: coupon.code, 
        discount: coupon.discount // e.g., 10 (for 10%)
    });

  } catch (error) {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}