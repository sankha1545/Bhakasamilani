// app/admin/login/AdminLoginForm.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // in case your login sets an httpOnly cookie:
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // After successful login, go to dashboard
      router.replace("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6">
        <h1 className="mb-1 text-xl font-semibold text-slate-900">
          Admin Login
        </h1>
        <p className="text-xs text-slate-500">
          Secure access for authorized trust administrators only.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-4 shadow-sm transition-shadow duration-200 hover:shadow-md"
      >
        {/* Email */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            Email
          </label>
          <input
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
            placeholder="admin@trust.org"
          />
        </div>

        {/* Password + Eye Toggle */}
        <div className="relative">
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 pr-10 text-sm text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
            placeholder="••••••••"
          />

          {/* Eye Button */}
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            className="absolute right-3 top-[34px] text-slate-500 transition hover:text-slate-700"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        {error && (
          <p className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </p>
        )}

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full transform rounded-full bg-gradient-to-r from-orange-600 to-amber-600 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-[1px] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login as Admin"}
        </button>

        <p className="mt-1 text-center text-[11px] text-slate-500">
          For security, access is logged and monitored. Use strong passwords and
          never share your credentials.
        </p>
      </form>

      {/* Back to donor site */}
      <div className="mt-4 text-center">
        <Link
          href="/"
          className="text-xs font-medium text-orange-600 hover:text-orange-700 hover:underline"
        >
          ← Return to Donors Page
        </Link>
      </div>
    </div>
  );
}
