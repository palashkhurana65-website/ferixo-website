import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

// 1. GET SINGLE PRODUCT (This was missing!)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Updated for Next.js 15
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        features: true,
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // TRANSFORMATION: Convert Prisma objects back to simple arrays for the Frontend
    const formattedProduct = {
      ...product,
      images: product.images.map((img) => img.url),      // [{url: "a"}] -> ["a"]
      features: product.features.map((f) => f.text),     // [{text: "b"}] -> ["b"]
    };

    return NextResponse.json(formattedProduct);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

// 2. UPDATE PRODUCT
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Updated for Next.js 15
) {
  const session = await getServerSession(authOptions);
  if (session?.user?.email !== "palashkhurana65@gmail.com") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    
    // Destructure to separate relations from base data
    const { images, features, variants, ...basicInfo } = body;

    // Transaction: Delete old relations -> Update base info -> Create new relations
    await prisma.$transaction([
      // A. Clean up old related data
      prisma.image.deleteMany({ where: { productId: id } }),
      prisma.feature.deleteMany({ where: { productId: id } }),
      prisma.variant.deleteMany({ where: { productId: id } }),

      // B. Update Product & Re-create relations
      prisma.product.update({
        where: { id },
        data: {
          name: basicInfo.name,
          series: basicInfo.series,
          description: basicInfo.description,
          basePrice: Number(basicInfo.basePrice),
          stock: Number(basicInfo.stock),
          capacity: basicInfo.capacity,
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
        }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// 3. DELETE PRODUCT
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Updated for Next.js 15
) {
  const session = await getServerSession(authOptions);
  if (session?.user?.email !== "palashkhurana65@gmail.com") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}