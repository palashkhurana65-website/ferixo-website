"use client";

import Link from "next/link";
import Image from "next/image";

// FIX: Update interface to accept string[] OR { url: string }[]
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    series: string;
    basePrice: number;
    // This Union Type allows both Static Data and DB Data
    images: string[] | { url: string }[]; 
    // Allow loose typing for other optional fields like stock/sales
    [key: string]: any; 
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  
  // FIX: Helper logic to extract URL safely from either format
  const getMainImage = () => {
    if (!product.images || product.images.length === 0) return "/placeholder.jpg";
    
    const firstImage = product.images[0];
    
    // 1. If it's a simple string (Static Data)
    if (typeof firstImage === "string") {
      return firstImage;
    } 
    // 2. If it's an object (Database Data)
    else {
      return firstImage.url || "/placeholder.jpg";
    }
  };

  const mainImage = getMainImage();

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative aspect-square bg-[#133159] rounded-xl overflow-hidden mb-4 border border-white/5 group-hover:border-white/20 transition-colors">
        {/* Product Image */}
        <Image
          src={mainImage}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="space-y-1">
        <h3 className="text-white font-bold text-lg group-hover:text-[#C9D1D9] transition-colors">
          {product.name}
        </h3>
        <p className="text-[#C9D1D9] opacity-70 text-sm">{product.series}</p>
        <p className="text-white font-mono">₹{product.basePrice.toLocaleString()}</p>
      </div>
    </Link>
  );
}