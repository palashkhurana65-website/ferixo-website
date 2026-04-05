"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck } from "lucide-react";

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Move to next step (passing OTP in URL securely for final reset)
    router.push(`/reset-password?email=${encodeURIComponent(email || '')}&otp=${otp}`);
  };

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center bg-transparent p-4">
      <div className="w-full max-w-md bg-white p-8 shadow-2xl rounded-2xl border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-3xl font-bold text-[#0A1A2F]">Check Your Email</h2>
          <p className="mt-2 text-sm text-gray-500">
            We sent a 6-digit security code to <br/><span className="font-bold text-[#0A1A2F]">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-[#0A1A2F] mb-1.5 text-center">Enter 6-Digit OTP</label>
            <input
              type="text"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-4 text-center tracking-[0.5em] text-2xl font-bold border border-gray-200 rounded-xl text-[#0A1A2F] focus:ring-2 focus:ring-[#0A1A2F] outline-none"
              placeholder="••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full py-3.5 rounded-xl font-bold text-white bg-[#0A1A2F] hover:bg-[#0A1A2F]/90 transition-all shadow-lg shadow-[#0A1A2F]/20 disabled:opacity-70"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Loading...</div>}><VerifyOTPContent /></Suspense>;
}