"use client";

import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut } from "lucide-react";
import Image from "next/image";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0A1A2F]">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-white/5 bg-[#0A1A2F] flex flex-col fixed h-full z-50">
        <div className="p-8">
          <Image 
            src="/logo/1.svg" 
            alt="Ferixo Admin" 
            width={120} 
            height={30} 
            className="brightness-0 invert opacity-50"
          />
          <p className="text-[10px] text-[#C9D1D9] mt-2 uppercase tracking-widest">Admin Console</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-[#C9D1D9] hover:bg-white/5 rounded-lg transition-colors">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 text-[#C9D1D9] hover:bg-white/5 rounded-lg transition-colors">
            <Package size={18} /> Inventory
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-[#C9D1D9] hover:bg-white/5 rounded-lg transition-colors">
            <ShoppingCart size={18} /> Sales & Orders
          </Link>
        </nav>

        <div className="p-4 border-t border-white/5">
           <button className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 w-full rounded-lg transition-colors">
             <LogOut size={18} /> Logout
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}