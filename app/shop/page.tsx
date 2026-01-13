import { FadeIn, HoverCard } from "@/components/ui/Motion";
import { seriesList } from "@/lib/data"; // Keep series definitions static
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 1. Fetch Real "Best Sellers" from Database
async function getBestSellers() {
  const products = await prisma.product.findMany({
    take: 3, // Top 3
    orderBy: { sales: 'desc' }, // Sorted by sales
    include: { images: true, variants: true } // Get images & prices
  });
  return products;
}

export default async function ShopPage() {
  const bestSellers = await getBestSellers();

  return (
    <main className="min-h-screen bg-[#0A1A2F] pt-32 pb-20 px-6">
      <div className="max-w-[1440px] mx-auto">

        {/* HEADER */}
        <FadeIn className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Shop Collections
          </h1>
          <p className="text-[#C9D1D9] max-w-xl mx-auto">
            Explore our specialized series. Select a collection below to view products.
          </p>
        </FadeIn>

        {/* SERIES GRID (Static Categories) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {seriesList.map((series, i) => (
            <FadeIn key={series.id} delay={i * 0.05}>
              <HoverCard className="h-full">
                <Link
                  href={`/shop/${series.id.toLowerCase()}`}
                  className="group relative block w-full h-[300px] rounded-2xl overflow-hidden bg-[#133159] border border-white/5 transition-all duration-300 hover:border-white/20"
                >
                   {/* Series Image */}
                   <div className="absolute inset-0">
                      <Image 
                        src={series.image} 
                        alt={series.id}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
                   </div>
                  
                  {/* Text Overlay */}
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

        {/* BEST SELLERS (Dynamic) */}
        <div className="border-t border-white/5 pt-16">
          <FadeIn>
             <div className="text-center mb-12">
                <h3 className="text-2xl font-bold text-white mb-4">Best Sellers</h3>
                <p className="text-[#C9D1D9] opacity-50">Our most popular premium gear.</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {bestSellers.map((p) => (
                  // Now we can just pass the product directly!
                 // We only cast 'series' because of the string vs Enum strictness
                      <ProductCard 
                         key={p.id} 
                         product={{
                           ...p,
                         series: p.series as any 
                    }} 
                    />
                 ))}
            </div>
          </FadeIn>
        </div>

      </div>
    </main>
  );
}