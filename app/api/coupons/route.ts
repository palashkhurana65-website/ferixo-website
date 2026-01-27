import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// 1. GET: List all coupons
export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(coupons);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

// 2. POST: Create a new coupon
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, discount, startDate, endDate } = body;

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discount: Number(discount),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      }
    });

    return NextResponse.json(coupon);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}

// 3. DELETE: Remove a coupon
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await prisma.coupon.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}