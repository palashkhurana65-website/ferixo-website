import { prisma } from "@/lib/db"; 
import { notFound } from "next/navigation";
import ProductView from "@/components/ProductView";
import React from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

import { Metadata } from "next";

// ... your existing imports and `export const dynamic = "force-dynamic";`

// --- NEW: DYNAMIC SEO METADATA ---
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id },
    include: { images: true }
  });

  if (!product) {
    return { title: 'Product Not Found | Ferixo' };
  }

  return {
    title: `${product.name} | Ferixo Premium Gear`,
    description: product.description.substring(0, 160), // Google prefers ~160 characters
    openGraph: {
      title: `${product.name} | Ferixo`,
      description: product.description.substring(0, 160),
      images: [
        {
          url: product.images[0]?.url || '/placeholder.jpg',
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Ferixo`,
      description: product.description.substring(0, 160),
      images: [product.images[0]?.url || '/placeholder.jpg'],
    },
  };
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

  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#0A1A2F]" />}>
      <ProductView product={serializableProduct} />
    </React.Suspense>
  );
}