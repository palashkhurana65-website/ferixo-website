"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  
  // State for Form Data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "", // Added confirm password
  });

  // State for UI handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State for Visibility Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 1. Client-side Validation: Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      // Create a copy of data without 'confirmPassword' to send to API
      const { confirmPassword, ...registerData } = formData;

      // 2. Register the user in the database
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Registration failed");
      }

      // 3. Automatically sign them in
      const signInResult = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (signInResult?.error) {
        throw new Error("Account created, but auto-login failed. Please sign in manually.");
      }

      // 4. Redirect to dashboard
      router.push("/dashboard");
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Outer container fills screen and centers content
    <div className="flex min-h-[80vh] w-full items-center justify-center bg-transparent p-4">
      <div className="w-full max-w-md bg-white p-8 shadow-2xl rounded-2xl border border-gray-100">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#0A1A2F]">Create Account</h2>
          <p className="mt-2 text-sm text-gray-500">Join the Ferixo Exclusive Club</p>
        </div>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-lg text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* NAME */}
          <div>
            <label className="block text-sm font-bold text-[#0A1A2F] mb-1.5">Full Name</label>
            <input
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[#0A1A2F] placeholder-[#133159]/60 focus:ring-2 focus:ring-[#0A1A2F] focus:border-transparent outline-none transition-all"
              placeholder="Your Name"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-bold text-[#0A1A2F] mb-1.5">Email Address</label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[#0A1A2F] placeholder-[#133159]/60 focus:ring-2 focus:ring-[#0A1A2F] outline-none"
              placeholder="you@example.com"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-sm font-bold text-[#0A1A2F] mb-1.5">Mobile Number</label>
            <input
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[#0A1A2F] placeholder-[#133159]/60 focus:ring-2 focus:ring-[#0A1A2F] outline-none"
              placeholder="+91 98765 43210"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-bold text-[#0A1A2F] mb-1.5">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
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

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="block text-sm font-bold text-[#0A1A2F] mb-1.5">Confirm Password</label>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[#0A1A2F] placeholder-[#133159]/60 focus:ring-2 focus:ring-[#0A1A2F] focus:border-transparent outline-none transition-all pr-12"
                placeholder="••••••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0A1A2F] transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-white bg-[#0A1A2F] hover:bg-[#0A1A2F]/90 transition-all shadow-lg shadow-[#0A1A2F]/20 disabled:opacity-70 mt-2"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-bold text-[#0A1A2F] hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}