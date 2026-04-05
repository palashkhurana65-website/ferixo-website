"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // State to control our new popup
  const [showUnregisteredModal, setShowUnregisteredModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShowUnregisteredModal(false);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      // Explicitly check for the 404 status we set in the backend
      if (res.status === 404) {
        setShowUnregisteredModal(true);
        setLoading(false);
        return;
      }

      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        throw new Error("Network error. Please try again.");
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }
      
      // Push to dedicated OTP page
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center bg-transparent p-4">
      {/* Main Form Box */}
      <div className="w-full max-w-md bg-white p-8 shadow-2xl rounded-2xl border border-gray-100">
        <Link href="/sign-in" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#0A1A2F] mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Sign In
        </Link>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail size={32} />
          </div>
          <h2 className="text-3xl font-bold text-[#0A1A2F]">Forgot Password?</h2>
          <p className="mt-2 text-sm text-gray-500">No worries, we'll send you reset instructions.</p>
        </div>

        {error && <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-lg text-center border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-[#0A1A2F] mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[#0A1A2F] placeholder-[#133159]/60 focus:ring-2 focus:ring-[#0A1A2F] outline-none"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-white bg-[#0A1A2F] hover:bg-[#0A1A2F]/90 transition-all shadow-lg shadow-[#0A1A2F]/20 disabled:opacity-70"
          >
            {loading ? "Sending OTP..." : "Reset Password"}
          </button>
        </form>
      </div>

      {/* --- UNREGISTERED EMAIL POPUP MODAL --- */}
      {showUnregisteredModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
              <AlertCircle size={24} />
            </div>
            
            <h3 className="text-xl font-bold text-[#0A1A2F] text-center mb-2">
              Email Not Registered
            </h3>
            <p className="text-gray-500 text-center text-sm mb-6">
              We couldn't find an account associated with <span className="font-bold text-[#0A1A2F]">{email}</span>. Would you like to create one or continue browsing?
            </p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => router.push('/sign-up')}
                className="w-full py-3 rounded-xl bg-[#0A1A2F] text-white font-bold hover:bg-[#0A1A2F]/90 transition-colors"
              >
                Register Now
              </button>
              
              <button 
                onClick={() => router.push('/')}
                className="w-full py-3 rounded-xl border border-gray-200 text-[#0A1A2F] font-bold hover:bg-gray-50 transition-colors"
              >
                Continue as Guest
              </button>
              
              <button 
                onClick={() => setShowUnregisteredModal(false)}
                className="w-full py-2 text-sm text-gray-400 hover:text-[#0A1A2F] underline mt-1 transition-colors"
              >
                Try a different email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}