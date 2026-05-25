"use client";
import { useState } from "react";
import { FaEnvelope, FaLock, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || "An error occurred");
      } else {
        setMessage("Password reset link sent! Please check your email.");
        setEmail("");
      }
    } catch (err) {
      setError("An error occurred while sending the email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-2xl">
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-emerald-600/10 dark:bg-emerald-600/20 border border-emerald-500/20 dark:border-emerald-500/30 rounded-2xl flex items-center justify-center mb-4">
              <FaLock className="text-emerald-600 dark:text-emerald-400 text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Forgot Password
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 text-center">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-6 p-3 bg-emerald-900/30 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm text-center">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm mt-2"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-500 transition-colors font-medium"
            >
              <FaArrowLeft /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
