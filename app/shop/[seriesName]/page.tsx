import { products, seriesList } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import { FadeIn } from "@/components/ui/Motion";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Types for Next.js 15+ (Params are Promises)
interface PageProps {
  params: Promise<{ seriesName: string }>;
}

export default async function SeriesPage({ params }: PageProps) {
  // 1. Await params (Next.js 15+ requirement)
  const resolvedParams = await params;
  const slug = resolvedParams.seriesName;

  // 2. Find the series (Case insensitive matching)
  const seriesInfo = seriesList.find(
    (s) => s.id.toLowerCase() === slug.toLowerCase()
  );

  // 3. 404 if series doesn't exist
  if (!seriesInfo) {
    return notFound();
  }

  // 4. Filter products for this series
  const seriesProducts = products.filter(
    (p) => p.series === seriesInfo.id
  );

  return (
    <main className="min-h-screen bg-[#0A1A2F] pt-32 pb-20 px-6">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Breadcrumb / Back Link */}
        <FadeIn>
          <Link 
            href="/shop" 
            className="inline-flex items-center gap-2 text-[#C9D1D9] hover:text-white transition-colors mb-8 text-sm font-medium uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Collections
          </Link>
        </FadeIn>

        {/* Series Header */}
        <FadeIn delay={0.1} className="mb-16 border-b border-white/5 pb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {seriesInfo.id}
          </h1>
          <p className="text-[#C9D1D9] text-lg max-w-2xl">
            {seriesInfo.tagline}
          </p>
        </FadeIn>

        {/* Product Grid */}
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