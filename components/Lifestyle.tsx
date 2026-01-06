"use client";
import { FadeIn } from "@/components/ui/Motion";

export default function Lifestyle() {
  return (
    <section className="py-20 px-6 bg-ferixo-main">
       {/* Using Secondary Color for this section card */}
       <div className="rounded-2xl overflow-hidden bg-ferixo-surface relative h-[60vh] flex items-center justify-center border border-ferixo-secondary/5">
          <FadeIn>
             <h3 className="text-4xl md:text-6xl font-bold text-ferixo-white text-center">
               Built for <span className="italic font-serif text-ferixo-secondary">Movement</span>.
             </h3>
          </FadeIn>
       </div>
    </section>
  );
}