"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setError("Invalid email or password.");
        setLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    // Outer container fills screen and centers content properly
    <div className="flex min-h-[80vh] w-full items-center justify-center bg-transparent p-4">
      <div className="w-full max-w-md bg-white p-8 shadow-2xl rounded-2xl border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#0A1A2F]">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to manage your Ferixo account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-lg text-center border border-red-100">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-[#0A1A2F] mb-1.5">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[#0A1A2F] placeholder-[#133159]/60 focus:ring-2 focus:ring-[#0A1A2F] focus:border-transparent outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>

<div>
            <label className="block text-sm font-bold text-[#0A1A2F] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                // This toggles the type based on state
                type={showPassword ? "text" : "password"} 
                required
                value={formData.password}
                onChange={handleChange}
                // Added 'pr-12' to make room for the icon
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[#0A1A2F] placeholder-[#133159]/60 focus:ring-2 focus:ring-[#0A1A2F] focus:border-transparent outline-none transition-all pr-12"
                placeholder="••••••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0A1A2F] transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-white bg-[#0A1A2F] hover:bg-[#0A1A2F]/90 transition-all shadow-lg shadow-[#0A1A2F]/20 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="px-4 text-xs text-gray-400 uppercase tracking-wide">Or</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Google Button */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full flex items-center justify-center py-3.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium text-[#0A1A2F]"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5 mr-2" alt="Google" />
          Continue with Google
        </button>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-500">
          New to Ferixo?{" "}
          <Link href="/sign-up" className="font-bold text-[#0A1A2F] hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}