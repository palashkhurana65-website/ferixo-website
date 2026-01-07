import { products, seriesList } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import { FadeIn } from "@/components/ui/Motion";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";

// Types for Next.js 15+ (Params are Promises)
interface PageProps {
  params: Promise<{ seriesName: string }>;
}

export default async function SeriesPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.seriesName;

  // Find the series (Case insensitive matching)
  const seriesInfo = seriesList.find(
    (s) => s.id.toLowerCase() === slug.toLowerCase()
  );

  if (!seriesInfo) {
    return notFound();
  }

  // Filter products for this series
  const seriesProducts = products.filter(
    (p) => p.series === seriesInfo.id
  );

  return (
    <main className="min-h-screen bg-[#0A1A2F] pt-32 pb-20 px-6">
      <div className="max-w-[1440px] mx-auto">
        
        {/* 1. BREADCRUMBS */}
        <Breadcrumbs 
          items={[
            { label: "Shop", href: "/shop" },
            { label: seriesInfo.id, href: "#" },
          ]} 
        />

        {/* 2. HEADER */}
        <FadeIn delay={0.1} className="mb-16 border-b border-white/5 pb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {seriesInfo.id}
          </h1>
          <p className="text-[#C9D1D9] text-lg max-w-2xl">
            {seriesInfo.tagline}
          </p>
        </FadeIn>

        {/* 3. PRODUCT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {seriesProducts.length > 0 ? (
            seriesProducts.map((p, index) => (
              <FadeIn key={p.id} delay={0.1 + index * 0.05}>
                <ProductCard product={p} />
              </FadeIn>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-[#C9D1D9] opacity-50 bg-[#133159]/20 rounded-2xl border border-white/5">
              <p>New arrivals coming soon to the {seriesInfo.id} collection.</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}