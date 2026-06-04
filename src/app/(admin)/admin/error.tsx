"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { FaExclamationCircle, FaSyncAlt, FaArrowLeft } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin Module Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <Card className="bg-slate-900/40 border-red-500/20 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl shadow-red-500/5">
          <CardContent className="p-8 md:p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-2xl mb-6">
              <FaExclamationCircle className="text-red-500 text-2xl" />
            </div>

            <h2 className="text-2xl font-black text-white mb-3 tracking-tight">
              Module <span className="text-red-500">Failed</span> to Load
            </h2>

            <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">
              We encountered a runtime error while synchronizing this module.
              This is usually temporary and can be resolved by re-attempting the
              data fetch.
            </p>

            <div className="space-y-4">
              <Button
                onClick={() => reset()}
                className="w-full bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold py-6 shadow-lg shadow-red-600/20"
              >
                <FaSyncAlt className="mr-2 text-xs" />
                Retry Module Initialization
              </Button>

              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="w-full text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl py-6"
              >
                <FaArrowLeft className="mr-2 text-xs" />
                Return to Previous Section
              </Button>
            </div>

            {error.digest && (
              <p className="mt-8 text-[10px] font-mono text-slate-700 uppercase tracking-widest">
                ID: {error.digest}
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
