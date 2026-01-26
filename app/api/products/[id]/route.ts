import { NextResponse } from "next/server";
import { prisma } from "@/lib/db"; // FIX: Use the singleton instance
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Helper for Admin Check
async function checkAdmin() {
  const session = await getServerSession(authOptions);
  // You can also check session?.user?.role === "ADMIN" if you set that up
  if (session?.user?.email !== "palashkhurana65@gmail.com") {
    return false;
  }
  return true;
}

// 1. GET SINGLE PRODUCT
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Optional: Add Admin Check to GET if you want to hide products from public API calls
    // const isAdmin = await checkAdmin();
    // if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

    // TRANSFORMATION: Match the structure expected by the Frontend Editor
    const formattedProduct = {
      ...product,
      images: product.images.map((img) => img.url),      // [{url: "a"}] -> ["a"]
      features: product.features.map((f) => f.text),     // [{text: "b"}] -> ["b"]
      // Variants are passed as-is (Array of objects), Frontend handles grouping
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
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    
    // Destructure to separate relations from base data
    const { images, features, variants, ...basicInfo } = body;

    // Transaction: Delete old relations -> Update base info -> Create new relations
    await prisma.$transaction(async (tx) => {
      // A. Clean up old related data
      await tx.image.deleteMany({ where: { productId: id } });
      await tx.feature.deleteMany({ where: { productId: id } });
      await tx.variant.deleteMany({ where: { productId: id } });

      // B. Update Product & Re-create relations
      await tx.product.update({
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
                stock: Number(v.stock),
                images: v.images || []
             }))
          }
        }
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// 3. DELETE PRODUCT
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) {
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