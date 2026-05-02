"use client";
import { useState, useEffect } from "react";
import type { Education } from "@/types";
import {
  FaPlus,
  FaTimes,
  FaCheck,
  FaSave,
  FaGraduationCap,
} from "react-icons/fa";
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

export default function AdminEducationPage() {
  const [education, setEducation] = useState<Education[]>([]);
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
    fetch("/api/admin/education")
      .then((r) => r.json())
      .then((d) => {
        setEducation(Array.isArray(d) ? d : []);
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/admin/education", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(education),
    });
    setSaving(false);
    if (res.ok) showToast("Education saved!");
    else showToast("Failed to save.", "error");
  }

  function addEdu() {
    setEducation((prev) => [
      ...prev,
      {
        degree: "New Degree",
        institution: "University",
        period: "2020-2024",
        details: "",
      },
    ]);
  }

  function updateEdu(i: number, field: keyof Education, val: string) {
    setEducation((prev) => {
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

      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
              Education
            </h1>
            <p className="text-slate-400">
              Manage your academic qualifications and degrees.
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold px-8 shadow-lg shadow-emerald-600/20"
          >
            <FaSave className={cn("mr-2", saving && "animate-spin")} />
            {saving ? "Saving..." : "Save Education"}
          </Button>
        </header>

        <Card className="rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-white">
                Academic Background
              </CardTitle>
              <Button
                variant="outline"
                onClick={addEdu}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-white/5 rounded-xl"
              >
                <FaPlus size={12} className="mr-2" /> Add Entry
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <AnimatePresence mode="popLayout">
              {loading ? (
                /* Skeleton Loader List */
                Array.from({ length: 3 }).map((_, i) => (
                  <motion.div
                    key={`skeleton-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="p-5 bg-slate-950/20 rounded-2xl border border-white/5 space-y-4 animate-pulse mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="h-10 bg-slate-800/40 rounded-xl w-full" />
                        <div className="h-10 bg-slate-800/40 rounded-xl w-full" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="h-10 bg-slate-800/20 rounded-xl w-full" />
                        <div className="h-10 bg-slate-800/20 rounded-xl w-full" />
                      </div>
                      <div className="h-10 bg-red-400/10 rounded-xl w-full" />
                    </div>
                  </motion.div>
                ))
              ) : (
                education.map((edu, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={i}
                    className="p-5 bg-slate-950/40 rounded-2xl border border-white/5 space-y-4 mb-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          Degree
                        </label>
                        <Input
                          className="bg-slate-900/50 border-white/10 text-white rounded-xl"
                          value={edu.degree}
                          onChange={(e) =>
                            updateEdu(i, "degree", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          Institution
                        </label>
                        <Input
                          className="bg-slate-900/50 border-white/10 text-white rounded-xl"
                          value={edu.institution}
                          onChange={(e) =>
                            updateEdu(i, "institution", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          Period
                        </label>
                        <Input
                          className="bg-slate-900/50 border-white/10 text-white rounded-xl"
                          value={edu.period}
                          onChange={(e) =>
                            updateEdu(i, "period", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          Details
                        </label>
                        <Input
                          className="bg-slate-900/50 border-white/10 text-white rounded-xl"
                          value={edu.details}
                          onChange={(e) =>
                            updateEdu(i, "details", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setEducation((prev) =>
                          prev.filter((_, idx) => idx !== i),
                        )
                      }
                      className="text-red-400 hover:bg-red-400/10 w-full rounded-xl mt-2"
                    >
                      Remove Entry
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
