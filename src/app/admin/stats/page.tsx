"use client";
import { useState, useEffect } from "react";
import type { Stat } from "@/types";
import { FaPlus, FaTimes, FaCheck, FaSave, FaChartBar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        setStats(Array.isArray(d) ? d : []);
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/admin/stats", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stats),
    });
    setSaving(false);
    if (res.ok) showToast("Stats updated!");
    else showToast("Failed to save.", "error");
  }

  function addStat() {
    setStats((prev) => [...prev, { number: "0", label: "New Stat" }]);
  }

  function updateStat(i: number, field: keyof Stat, val: string) {
    setStats((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: val };
      return next;
    });
  }



  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 ${
              toast.type === "success"
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                : "bg-red-500/20 border-red-500/50 text-red-400"
            }`}
          >
            {toast.type === "success" ? <FaCheck /> : <FaTimes />}
            <span className="font-semibold">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
              Stats
            </h1>
            <p className="text-slate-400">
              Showcase your growth and achievements in numbers.
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold px-8 shadow-lg shadow-emerald-600/20"
          >
            <FaSave className={cn("mr-2", saving && "animate-spin")} />
            {saving ? "Saving..." : "Save Stats"}
          </Button>
        </header>

        <Card className="rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-white">
                Milestones
              </CardTitle>
              <Button
                variant="outline"
                onClick={addStat}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-white/5 rounded-xl"
              >
                <FaPlus size={12} className="mr-2" /> Add Stat
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <AnimatePresence mode="popLayout">
              {loading ? (
                /* Skeleton Loader List */
                Array.from({ length: 4 }).map((_, i) => (
                  <motion.div
                    key={`skeleton-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4 items-center p-4 bg-slate-950/20 rounded-2xl border border-white/5 animate-pulse mb-4"
                  >
                    <div className="w-24 h-10 bg-slate-800/40 rounded-xl" />
                    <div className="flex-1 h-10 bg-slate-800/20 rounded-xl" />
                    <div className="w-10 h-10 bg-slate-800/10 rounded-xl" />
                  </motion.div>
                ))
              ) : (
                stats.map((stat, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={i}
                    className="flex gap-4 items-center p-4 bg-slate-950/40 rounded-2xl border border-white/5 mb-4"
                  >
                    <div className="w-24">
                      <Input
                        className="bg-slate-900/50 border-white/10 text-amber-400 font-black text-center rounded-xl"
                        value={stat.number}
                        onChange={(e) => updateStat(i, "number", e.target.value)}
                        placeholder="20+"
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        className="bg-slate-900/50 border-white/10 text-white rounded-xl"
                        value={stat.label}
                        onChange={(e) => updateStat(i, "label", e.target.value)}
                        placeholder="Projects Finished"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setStats((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      className="text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl"
                    >
                      <FaTimes size={16} />
                    </Button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
