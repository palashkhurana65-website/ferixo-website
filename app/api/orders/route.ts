import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // 1. Fetch orders with user details
    const orders = await prisma.order.findMany({
      include: {
        user: true, // Join to get customer name/email
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit to recent 50 transactions for the dashboard
    });

    // 2. Transform data for the Dashboard UI
    const formattedSales = orders.map((order) => {
      // Determine if it's Money IN or Money OUT
      const isRefund = order.status === "REFUNDED" || order.status === "CANCELLED";
      
      return {
        id: order.id,
        // Fallback to "Guest" if name is missing
        customer: order.user?.name || order.user?.email || "Guest Customer", 
        // Use finalAmount (which includes tax/shipping/discounts)
        total: order.finalAmount || order.totalAmount || 0, 
        status: order.status,
        type: isRefund ? "REFUND_OUT" : "SALE_IN",
        date: new Date(order.createdAt).toLocaleDateString("en-IN", {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
      };
    });

    return NextResponse.json(formattedSales);
  } catch (error) {
    console.error("Orders API Error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}