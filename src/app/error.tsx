"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { FaExclamationTriangle, FaRedo, FaHome } from "react-icons/fa";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full bg-white dark:bg-slate-900/50 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative z-10 text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/10 rounded-3xl mb-8">
          <FaExclamationTriangle className="text-red-500 text-3xl" />
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
          System <span className="text-red-500">Anomaly</span>
        </h1>

        <p className="text-slate-600 dark:text-slate-400 text-lg font-medium mb-8 leading-relaxed">
          The application encountered an unexpected runtime exception. Our
          systems have been alerted, but you can try to recover the session.
        </p>

        {error.digest && (
          <div className="mb-8 p-3 bg-slate-100 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-white/5">
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              Error Digest: {error.digest}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold transition-all hover:scale-105 shadow-lg shadow-red-600/20"
          >
            <FaRedo className="text-sm" />
            Retry System
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-2xl font-bold transition-all border border-slate-200 dark:border-white/10"
          >
            <FaHome className="text-sm" />
            Back to Safety
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
