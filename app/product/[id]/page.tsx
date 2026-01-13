import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import ProductView from "@/components/ProductView"; // Import the component we just made

const prisma = new PrismaClient();

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const resolvedParams = await params;
  
  // FETCH REAL DATA
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id },
    include: {
      images: true,
      variants: true,
      features: true
    }
  });

  if (!product) return notFound();

  // Pass data to the Client Component
  return <ProductView product={product} />;
}