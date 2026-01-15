import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// 1. GET ALL PRODUCTS (For Admin Inventory)
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,
        variants: true,
        features: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

// 2. CREATE PRODUCT (Protected)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  // 🔒 SECURITY: Only allow your email
  if (session?.user?.email !== "palashkhurana65@gmail.com") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { 
      name, series, description, basePrice, stock, capacity, 
      images,    // Received as: ["url1", "url2"]
      features,  // Received as: ["feat1", "feat2"]
      variants   // Received as: [{ name, stock, capacity }]
    } = body;

    const product = await prisma.product.create({
      data: {
        name,
        series,
        description,
        basePrice: Number(basePrice),
        stock: Number(stock),
        capacity,
        // MAGIC: Transform simple arrays into Database Relations
        images: {
          create: images.map((url: string) => ({ url }))
        },
        features: {
          create: features.map((text: string) => ({ text }))
        },
        variants: {
          create: variants.map((v: any) => ({
            name: v.name,
            capacity: v.capacity,
            stock: Number(v.stock)
          }))
        }
      },
      include: { images: true, variants: true }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Create Error:", error);
    return NextResponse.json({ error: "Database creation failed" }, { status: 500 });
  }
}