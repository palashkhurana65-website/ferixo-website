"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Register the user in the database
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Registration failed");
      }

      // 2. Automatically sign them in
      const signInResult = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (signInResult?.error) {
        throw new Error("Account created, but auto-login failed. Please sign in manually.");
      }

      // 3. Redirect to dashboard
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

          <div>
            <label className="block text-sm font-bold text-[#0A1A2F] mb-1.5">Password</label>
            <input
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[#0A1A2F] placeholder-[#133159]/60 focus:ring-2 focus:ring-[#0A1A2F] outline-none"
              placeholder="••••••••••••••••"
            />
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