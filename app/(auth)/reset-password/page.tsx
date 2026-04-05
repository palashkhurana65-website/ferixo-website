"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, CheckCircle } from "lucide-react";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const otp = searchParams.get("otp");

  const [formData, setFormData] = useState({ newPassword: "", confirmPassword: "" });
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // State for our new premium success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword: formData.newPassword }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to reset password");
      }

      // Trigger the beautiful UI modal instead of the browser alert
      setLoading(false);
      setShowSuccessModal(true);
      
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center bg-transparent p-4">
      <div className="w-full max-w-md bg-white p-8 shadow-2xl rounded-2xl border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#0A1A2F]/5 text-[#0A1A2F] rounded-full flex items-center justify-center mx-auto mb-4">
            <LockKeyhole size={32} />
          </div>
          <h2 className="text-3xl font-bold text-[#0A1A2F]">Create New Password</h2>
          <p className="mt-2 text-sm text-gray-500">Your new password must be different from previous used passwords.</p>
        </div>

        {error && <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-lg text-center border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* NEW PASSWORD */}
          <div>
            <label className="block text-sm font-bold text-[#0A1A2F] mb-1.5">New Password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                required
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[#0A1A2F] focus:ring-2 focus:ring-[#0A1A2F] outline-none pr-12"
                placeholder="••••••••••••••••"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0A1A2F]">
                {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* CONFIRM NEW PASSWORD */}
          <div>
            <label className="block text-sm font-bold text-[#0A1A2F] mb-1.5">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[#0A1A2F] focus:ring-2 focus:ring-[#0A1A2F] outline-none pr-12"
                placeholder="••••••••••••••••"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0A1A2F]">
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-white bg-[#0A1A2F] hover:bg-[#0A1A2F]/90 transition-all shadow-lg shadow-[#0A1A2F]/20 disabled:opacity-70 mt-2"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>

      {/* --- SUCCESS POPUP MODAL --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={24} />
            </div>
            
            <h3 className="text-xl font-bold text-[#0A1A2F] text-center mb-2">
              Password Reset!
            </h3>
            <p className="text-gray-500 text-center text-sm mb-6">
              Your password has been successfully updated. You can now sign in securely with your new credentials.
            </p>
            
            <button 
              onClick={() => router.push('/sign-in')}
              className="w-full py-3 rounded-xl bg-[#0A1A2F] text-white font-bold hover:bg-[#0A1A2F]/90 transition-colors"
            >
              Sign In Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Loading...</div>}><ResetPasswordContent /></Suspense>;
}