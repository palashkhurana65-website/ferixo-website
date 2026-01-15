import { prisma } from "@/lib/db"; // Use Singleton
import { notFound } from "next/navigation";
import ProductView from "@/components/ProductView";

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

  // SERIALIZATION: Convert Date objects to strings for the Client Component
  // This fixes the "Only plain objects can be passed to Client Components" error
  const serializableProduct = {
    ...product,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    // Ensure relations are plain arrays
    variants: product.variants.map(v => ({...v})),
    features: product.features.map(f => ({...f})),
    images: product.images.map(i => ({...i}))
  };

  return <ProductView product={serializableProduct} />;
}