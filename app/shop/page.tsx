"use client";

import { FadeIn, HoverCard } from "@/components/ui/Motion";
import { seriesList } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/data";

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-[#0A1A2F] pt-32 pb-20 px-6">
      <div className="max-w-[1440px] mx-auto">

        {/* 1. HEADER */}
        <FadeIn className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Shop Collections
          </h1>
          <p className="text-[#C9D1D9] max-w-xl mx-auto">
            Explore our specialized series. Select a collection below to view products.
          </p>
        </FadeIn>

        {/* 2. SERIES CARDS GRID */}
        {/* Changed grid to 3 columns to make cards bigger and "image-ready" */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {seriesList.map((series, i) => (
            <FadeIn key={series.id} delay={i * 0.05}>
              <HoverCard className="h-full">
                <Link
                  href={`/shop/${series.id.toLowerCase()}`}
                  className="group relative block w-full h-[300px] rounded-2xl overflow-hidden bg-[#133159] border border-white/5 transition-all duration-300 hover:border-white/20"
                >
                  
                  {/* IMAGE PLACEHOLDER AREA */}
                  {/* Currently a gradient/solid color. Later, replace this div with <Image fill ... /> */}
                  {/* 1. THE IMAGE */}
                  {/* Ensure you import Image from "next/image" at the top! */}
                  <Image 
                     src={series.image} 
                     alt={series.id}
                     fill
                     className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

{/* 2. DARK OVERLAY (Keeps text readable) */}
<div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
                  
                  {/* CENTER CONTENT (Initials for now) */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl font-bold text-white/10 select-none group-hover:text-white/20 transition-colors">
                      {series.id.substring(0, 2).toUpperCase()}
                    </span>
                  </div>

                  {/* BOTTOM LABEL */}
                  <div className="absolute bottom-0 left-0 w-full p-8">
                    <h2 className="text-2xl font-bold text-white mb-1 group-hover:translate-x-2 transition-transform duration-300">
                      {series.id}
                    </h2>
                    <p className="text-[#C9D1D9] text-sm opacity-80 group-hover:translate-x-2 transition-transform duration-300 delay-75">
                      {series.tagline}
                    </p>
                  </div>

                </Link>
              </HoverCard>
            </FadeIn>
          ))}
        </div>

        {/* 3. TOP SELLERS (Dynamic) */}
        <div className="border-t border-white/5 pt-16">
          <FadeIn>
             <div className="text-center mb-12">
                <h3 className="text-2xl font-bold text-white mb-4">Best Sellers</h3>
                <p className="text-[#C9D1D9] opacity-50">Our most popular premium gear, loved by thousands.</p>
             </div>
             
             {/* DYNAMIC TOP 3 GRID */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {products
                  .sort((a, b) => b.sales - a.sales) // Sort by sales
                  .slice(0, 3) // Take top 3
                  .map((p) => (
                    <ProductCard key={p.id} product={p} />
                ))}
             </div>
          </FadeIn>
        </div>

      </div>
    </main>
  );
}