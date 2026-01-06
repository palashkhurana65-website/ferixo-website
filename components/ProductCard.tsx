"use client";

import Link from "next/link";
import { Product } from "@/lib/data";
import { HoverCard } from "@/components/ui/Motion";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <HoverCard className="group relative cursor-pointer h-full">
      <Link href={`/shop/${product.series.toLowerCase()}/${product.id}`}>
        {/* CARD BACKGROUND: Secondary Color #133159 */}
        <div className="aspect-[3/4] bg-[#133159] rounded-2xl overflow-hidden relative mb-5 border border-white/5">
          
          {/* Placeholder for Image (Replace with <Image> tag when you have real files) */}
          <div className="absolute inset-0 flex items-center justify-center text-[#C9D1D9]/20 font-bold text-4xl uppercase select-none">
            {product.series.substring(0, 3)}
          </div>
          
          {/* Add to Cart Button (Appears on Hover) */}
          <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <button className="bg-[#C9D1D9] text-[#0A1A2F] w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform font-bold text-xl pb-1 shadow-lg">
               +
             </button>
          </div>
        </div>
        
        {/* TEXT CONTENT */}
        <h3 className="font-semibold text-white tracking-wide text-lg mb-1">{product.name}</h3>
        <div className="flex justify-between items-center">
          <p className="text-sm text-[#C9D1D9] opacity-80">{product.series}</p>
          <p className="text-sm font-bold text-white">₹{product.basePrice.toLocaleString()}</p>
        </div>
      </Link>
    </HoverCard>
  );
}