"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, MapPin, LogOut, User, Settings, Loader2 } from "lucide-react";
import { FadeIn } from "@/components/ui/Motion"; // Assuming you have this from previous steps

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 1. PROTECT THE ROUTE
  // If user is not logged in, force them to Sign In page
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  // 2. LOADING STATE
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0A1A2F] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C9D1D9] animate-spin" />
      </div>
    );
  }

  // 3. AUTHENTICATED VIEW
  if (session) {
    return (
      <main className="min-h-screen bg-[#0A1A2F] pt-32 pb-20 px-6">
        <div className="max-w-[1440px] mx-auto">
          
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-[#C9D1D9]/10 pb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">My Account</h1>
              <p className="text-[#C9D1D9]/60">Welcome back, {session.user?.name || "Member"}</p>
            </div>
            
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-2 px-6 py-3 border border-[#C9D1D9]/20 rounded-lg text-[#C9D1D9] hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* CARD 1: PROFILE INFO */}
            <FadeIn delay={0.1} className="lg:col-span-1">
              <div className="bg-[#133159]/10 border border-[#C9D1D9]/10 rounded-2xl p-8 h-full">
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden bg-[#0A1A2F] border-2 border-[#C9D1D9]/20">
                    {session.user?.image ? (
                      <Image 
                        src={session.user.image} 
                        fill 
                        alt="Profile" 
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#C9D1D9]">
                        <User className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{session.user?.name}</h2>
                    <p className="text-sm text-[#C9D1D9]/60">{session.user?.email}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/20">
                      ACTIVE MEMBER
                    </span>
                  </div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#C9D1D9]/5 hover:bg-[#C9D1D9]/10 text-[#C9D1D9] rounded-lg transition-colors text-sm font-medium tracking-wide">
                  <Settings className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>
            </FadeIn>

            {/* CARD 2: RECENT ORDERS */}
            <FadeIn delay={0.2} className="lg:col-span-2">
              <div className="bg-[#133159]/10 border border-[#C9D1D9]/10 rounded-2xl p-8 min-h-[400px]">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Recent Orders
                  </h3>
                  <Link href="/shop" className="text-sm text-[#C9D1D9] underline hover:text-white">
                    Start Shopping
                  </Link>
                </div>

                {/* EMPTY STATE (For now) */}
                <div className="flex flex-col items-center justify-center h-[200px] text-center border-2 border-dashed border-[#C9D1D9]/10 rounded-lg">
                  <p className="text-[#C9D1D9]/40 mb-2">No orders found</p>
                  <p className="text-sm text-[#C9D1D9]/20">When you buy something, it will appear here.</p>
                </div>
              </div>
            </FadeIn>

            {/* CARD 3: ADDRESS BOOK (Placeholder) */}
            <FadeIn delay={0.3} className="lg:col-span-3">
              <div className="bg-[#133159]/10 border border-[#C9D1D9]/10 rounded-2xl p-8">
                 <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                    <MapPin className="w-5 h-5" />
                    Saved Addresses
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="h-32 border-2 border-dashed border-[#C9D1D9]/20 rounded-xl flex flex-col items-center justify-center text-[#C9D1D9]/40 hover:text-[#C9D1D9] hover:border-[#C9D1D9]/40 transition-all">
                      <span className="text-2xl mb-1">+</span>
                      <span className="text-sm uppercase tracking-widest font-bold">Add New Address</span>
                    </button>
                  </div>
              </div>
            </FadeIn>

          </div>
        </div>
      </main>
    );
  }

  // Fallback (Should be caught by useEffect, but good for safety)
  return null;
}