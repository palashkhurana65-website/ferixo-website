"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/' })}
      className="flex items-center gap-2 px-6 py-3 border border-[#C9D1D9]/20 rounded-lg text-[#C9D1D9] hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition-all"
    >
      <LogOut className="w-4 h-4" />
      <span>Sign Out</span>
    </button>
  );
}