import { FadeIn } from "@/components/ui/Motion";

export default function LegalLayout({ title, date, children }: { title: string, date: string, children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A1A2F] text-white pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <FadeIn>
          <div className="mb-12 border-b border-white/10 pb-8">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{title}</h1>
            <p className="text-white/40 font-mono text-sm">Last Updated: {date}</p>
          </div>
          
          <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-blue-400 prose-strong:text-white text-[#C9D1D9]">
            {children}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}