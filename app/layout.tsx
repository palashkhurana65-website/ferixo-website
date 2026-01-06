import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { StoreProvider } from "@/context/StoreContext"; // <--- IMPORT THIS

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Ferixo | Premium Hydration",
  description: "Designed for Everyday. Premium bottles and tumblers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${montserrat.className} bg-[#0A1A2F] text-[#C9D1D9] antialiased selection:bg-[#C9D1D9] selection:text-[#0A1A2F]`}>
        {/* WRAP EVERYTHING INSIDE STOREPROVIDER */}
        <StoreProvider>
          <Navbar />
          {children}
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}