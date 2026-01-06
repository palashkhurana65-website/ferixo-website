"use client";
import Link from "next/link";
import { FadeIn } from "@/components/ui/Motion";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/data"; // Ensure you have your data file

export default function FeaturedGrid() {
  const featured = products.slice(0, 3);

  return (
    <section className="py-32 px-6 container mx-auto bg-ferixo-main">
      <FadeIn className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-ferixo-white mb-2">The Collection</h2>
          <p className="text-ferixo-secondary">Meticulously crafted.</p>
        </div>
        <Link href="/shop" className="text-sm font-bold text-ferixo-secondary border-b border-transparent hover:border-ferixo-white hover:text-ferixo-white transition-all pb-1">
          VIEW ALL
        </Link>
      </FadeIn>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
        {featured.map((p, i) => (
          <FadeIn key={p.id} delay={i * 0.1}>
            <ProductCard product={p} />
          </FadeIn>
        ))}
      </div>
    </section>
  );
}