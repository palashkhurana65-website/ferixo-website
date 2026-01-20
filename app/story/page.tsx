"use client";

import { FadeIn } from "@/components/ui/Motion";
import { Gem, ShieldCheck, Zap, Heart } from "lucide-react";

export default function StoryPage() {
  const values = [
    { icon: Gem, title: "Uncompromised Quality", desc: "We don't cut corners. Every material is premium grade." },
    { icon: Zap, title: "Innovation First", desc: "Pushing the boundaries of thermal engineering." },
    { icon: ShieldCheck, title: "Lifetime Promise", desc: "We stand behind our craftsmanship forever." },
    { icon: Heart, title: "Customer Centric", desc: "Designed for you, improved by your feedback." },
  ];

  return (
    <div className="min-h-screen bg-[#0A1A2F] text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* HERO */}
        <FadeIn className="text-center mb-20">
          <span className="text-blue-400 font-bold tracking-[0.2em] text-sm uppercase">The Ferixo Origin</span>
          <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-6">Engineering meets <br /> <span className="text-white/50">Aesthetics.</span></h1>
          <p className="text-xl text-[#C9D1D9] max-w-2xl mx-auto leading-relaxed">
            Ferixo wasn't born in a boardroom. It started with a simple frustration: why do durable things look ugly, and beautiful things break?
          </p>
        </FadeIn>

        {/* NARRATIVE SECTION */}
        <div className="space-y-8 relative border-l border-white/10 ml-4 md:ml-0 pl-8 md:pl-0">
          {[ 
            { year: "2023", title: "The Inception", text: "We realized the market was flooded with cheap plastics and heavy metals. We wanted something that felt like a premium accessory, not just a utility item." },
            { year: "2024", title: "The Prototype", text: "After 40+ failed iterations, we finally cracked the code on our 'HydroPro' insulation layer—keeping drinks cold for 24 hours without the bulk." },
            { year: "2025", title: "Global Launch", text: "Ferixo launched worldwide. We sold out our initial batch in 48 hours. The feedback was clear: you wanted more." },
            { year: "Now", title: "The Future", text: "We are expanding into home living, smart hydration, and beyond. This is just the beginning." }
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 0.1} className="relative md:grid md:grid-cols-5 md:gap-10 group">
              <div className="hidden md:block col-span-1 text-right pt-1">
                <span className="text-2xl font-bold text-white/20 group-hover:text-blue-400 transition-colors">{item.year}</span>
              </div>
              
              {/* Timeline Dot */}
              <div className="absolute -left-[39px] md:left-auto md:right-0 md:relative w-5 h-5 rounded-full bg-[#0A1A2F] border-4 border-blue-500/50 group-hover:border-blue-400 transition-all z-10 mt-2 md:mt-1 md:mx-auto col-span-1 flex justify-center" />

              <div className="md:col-span-3 bg-[#133159]/30 p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                 <span className="md:hidden text-sm font-bold text-blue-400 mb-2 block">{item.year}</span>
                 <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                 <p className="text-[#C9D1D9] leading-relaxed">{item.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* VALUES GRID */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-6">
           {values.map((v, i) => (
             <FadeIn key={i} delay={0.4 + (i * 0.1)} className="p-8 bg-[#133159]/20 border border-white/5 rounded-2xl flex items-start gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                   <v.icon size={24} />
                </div>
                <div>
                   <h4 className="font-bold text-lg mb-2">{v.title}</h4>
                   <p className="text-sm text-[#C9D1D9]">{v.desc}</p>
                </div>
             </FadeIn>
           ))}
        </div>

      </div>
    </div>
  );
}