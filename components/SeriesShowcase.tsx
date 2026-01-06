"use client";

import Link from "next/link";
import { FadeIn, HoverCard } from "@/components/ui/Motion";
import { ArrowRight } from "lucide-react";

// Data Structure for Series
const seriesData = [
  {
    id: "hydropro",
    name: "HydroPro",
    tagline: "Active Performance",
    cols: "col-span-1",
  },
  {
    id: "thermosmart",
    name: "ThermoSmart",
    tagline: "Digital Temperature",
    cols: "col-span-1",
  },
  {
    id: "allure",
    name: "Allure",
    tagline: "Aesthetic & Style",
    cols: "col-span-1",
  },
  {
    id: "brewmaster",
    name: "BrewMaster",
    tagline: "Coffee & Tea",
    cols: "col-span-1 md:col-span-2 lg:col-span-1", // Flexible sizing
  },
  {
    id: "minisip",
    name: "MiniSip",
    tagline: "Kids & Compact",
    cols: "col-span-1",
  },
  {
    id: "flexhandle",
    name: "FlexHandle",
    tagline: "Utility & Carry",
    cols: "col-span-1",
  },
  // Home Living spans 2 columns to denote a Department shift
  {
    id: "shoeracks",
    name: "Home Living",
    tagline: "Premium Organizers & Racks",
    cols: "col-span-1 md:col-span-2 lg:col-span-2", 
    isSpecial: true,
  },
];

export default function SeriesShowcase() {
  return (
    <section className="py-24 px-6 bg-[#0A1A2F]">
      <div className="container mx-auto">
        
        {/* Section Header */}
        <FadeIn className="mb-16 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Curated Series
          </h2>
          <p className="text-[#C9D1D9]">
            Explore our specialized collections, engineered for every part of your day.
          </p>
        </FadeIn>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {seriesData.map((series, index) => (
            <FadeIn 
              key={series.id} 
              delay={index * 0.05} 
              className={series.cols}
            >
              <HoverCard className="h-full">
                <Link href={`/shop/${series.id.toLowerCase()}`} className="block h-full">
                  <div 
                    className={`relative h-[280px] rounded-2xl overflow-hidden border border-white/5 p-8 flex flex-col justify-between transition-colors duration-300 group
                      ${series.isSpecial ? 'bg-[#133159]' : 'bg-[#133159]/40 hover:bg-[#133159]'}
                    `}
                  >
                    
                    {/* Background Pattern / Image Placeholder */}
                    <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                    
                    {/* Top Content */}
                    <div className="relative z-10">
                      <h3 className={`font-bold text-2xl tracking-tight mb-1 ${series.isSpecial ? 'text-white' : 'text-white'}`}>
                        {series.name}
                      </h3>
                      <p className="text-sm text-[#C9D1D9] font-medium tracking-wide opacity-80">
                        {series.tagline}
                      </p>
                    </div>

                    {/* Bottom Action */}
                    <div className="relative z-10 flex items-center gap-2 text-[#C9D1D9] group-hover:text-white transition-colors">
                      <span className="text-xs font-bold uppercase tracking-widest">Shop Series</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>

                    {/* Visual Decorator (Circle) */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />

                  </div>
                </Link>
              </HoverCard>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
}