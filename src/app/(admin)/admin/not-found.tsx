"use client";

import { motion } from "framer-motion";
import { FaSearch, FaArrowRight, FaHome } from "react-icons/fa";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl"
      >
        <Card className="bg-slate-900/40 border-white/5 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl">
          <CardContent className="p-10 md:p-14 text-center">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-150" />
              <div className="relative w-20 h-20 bg-slate-950 border border-white/10 rounded-3xl flex items-center justify-center text-blue-400">
                <FaSearch size={32} />
              </div>
            </div>

            <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
              Route <span className="text-blue-400">Not Found</span>
            </h2>

            <p className="text-slate-400 text-lg font-medium mb-10 leading-relaxed">
              The administrative module you are looking for does not exist or
              has been relocated within the system.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/admin" className="w-full sm:w-auto">
                <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold py-6 px-8 shadow-lg shadow-blue-600/20 transition-all hover:scale-105">
                  <FaHome className="mr-2 text-xs" />
                  Admin Overview
                </Button>
              </Link>

              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="w-full sm:w-auto text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl py-6 px-8"
              >
                Go Back
                <FaArrowRight className="ml-2 text-xs" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
