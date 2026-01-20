import { prisma } from "@/lib/db"; 
import { notFound } from "next/navigation";
import ProductView from "@/components/ProductView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const resolvedParams = await params;
  
  // 1. FETCH REAL DATA (Now including Reviews)
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id },
    include: {
      images: true,
      variants: true,
      features: true,
      reviews: {              // <--- CONNECTED REVIEWS
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!product) return notFound();

  // 2. SERIALIZATION
  // Convert all Date objects to strings to prevent "Objects cannot be passed" error
  const serializableProduct = {
    ...product,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    
    // Relations to plain arrays
    variants: product.variants.map(v => ({...v})),
    features: product.features.map(f => ({...f})),
    images: product.images.map(i => ({...i})),
    
    // Serialize Reviews (Convert Date to String)
    reviews: product.reviews ? product.reviews.map(r => ({
      ...r,
      createdAt: r.createdAt.toISOString()
    })) : []
  };

  return <ProductView product={serializableProduct} />;
}