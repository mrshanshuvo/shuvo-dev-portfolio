"use client";
import { useState, useEffect } from "react";
import type { Education } from "@/types";
import {
  FaPlus,
  FaTimes,
  FaCheck,
  FaSave,
  FaGraduationCap,
  FaUniversity,
  FaCalendarAlt,
  FaInfoCircle,
  FaTrash,
  FaArrowUp,
  FaArrowDown,
  FaMapMarkerAlt,
  FaLink,
  FaAward,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ImageUpload from "../components/ImageUpload";

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
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

export default function AdminEducationPage() {
  const [education, setEducation] = useState<Education[]>([]);
  const [newDetailInputs, setNewDetailInputs] = useState<
    Record<number, string>
  >({});
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
    if (res.ok) showToast("Education records synchronized!");
    else showToast("Failed to save records.", "error");
  }

  function addEdu() {
    setEducation((prev) => [
      ...prev,
      {
        degree: "New Degree",
        institution: "Institution Name",
        location: "",
        logo: "",
        period: "2020 - 2024",
        gpa: "",
        details: [],
        link: "",
        order: prev.length,
      },
    ]);
  }

  function updateEdu(i: number, field: keyof Education, val: any) {
    setEducation((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: val };
      return next;
    });
  }

  function addDetail(i: number) {
    const val = newDetailInputs[i]?.trim();
    if (!val) return;
    setEducation((prev) => {
      const next = [...prev];
      next[i] = {
        ...next[i],
        details: [...(next[i].details || []), val],
      };
      return next;
    });
    setNewDetailInputs((prev) => ({ ...prev, [i]: "" }));
  }

  function removeDetail(eduIdx: number, detailIdx: number) {
    setEducation((prev) => {
      const next = [...prev];
      next[eduIdx].details = next[eduIdx].details.filter(
        (_, idx) => idx !== detailIdx,
      );
      return next;
    });
  }

  function move(i: number, dir: "up" | "down") {
    setEducation((prev) => {
      const next = [...prev];
      const j = dir === "up" ? i - 1 : i + 1;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-10 space-y-10">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 ${
              toast.type === "success"
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                : "bg-red-500/20 border-red-500/50 text-red-400"
            }`}
          >
            <div
              className={`p-2 rounded-full ${toast.type === "success" ? "bg-emerald-500/20" : "bg-red-500/20"}`}
            >
              {toast.type === "success" ? <FaCheck /> : <FaTimes />}
            </div>
            <span className="font-semibold">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full space-y-8">
        {/* Unified Header Section - Sticky for better UX */}
        <header className="sticky top-6 z-40 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900/60 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-full blur-sm" />
              <h1 className="text-3xl font-black text-white tracking-tight">
                Academic <span className="text-blue-400">Excellence</span>
              </h1>
            </div>
            <Badge
              variant="outline"
              className="hidden md:flex bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-1 rounded-full font-bold uppercase tracking-widest text-[10px]"
            >
              {education.length} Institutions
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              onClick={addEdu}
              className="bg-slate-800 hover:bg-slate-700 text-white border-white/10 rounded-xl h-11 px-5 active:scale-95 transition-all text-xs font-bold"
            >
              <FaPlus size={12} className="mr-2 text-blue-400" /> Add
              Institution
            </Button>
            <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block" />
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold px-6 h-11 shadow-lg shadow-blue-600/20 active:scale-95 transition-all group text-xs"
            >
              <FaSave
                className={cn(
                  "mr-2 transition-transform duration-500",
                  saving ? "animate-spin" : "group-hover:rotate-12",
                )}
              />
              {saving ? "Syncing..." : "Save Changes"}
            </Button>
          </div>
        </header>

        <Card className="bg-slate-900/20 backdrop-blur-xl overflow-hidden shadow-2xl">
          <CardContent>
            <AnimatePresence mode="popLayout">
              {loading ? (
                /* Premium Skeleton Loader */
                Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-4 md:p-8 bg-slate-950/20 space-y-6 animate-pulse mb-8"
                  >
                    <div className="flex gap-8">
                      <div className="w-32 h-32 bg-slate-800/40 rounded-3xl" />
                      <div className="flex-1 space-y-4">
                        <div className="h-10 w-full bg-slate-800/30 rounded-xl" />
                        <div className="h-10 w-1/2 bg-slate-800/30 rounded-xl" />
                      </div>
                    </div>
                  </div>
                ))
              ) : education.length === 0 ? (
                <div className="p-4 md:p-8 text-center py-24">
                  <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-700">
                    <FaGraduationCap size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Build Your Foundation
                  </h3>
                  <p className="text-slate-500 mb-10 max-w-sm mx-auto">
                    Display your academic background with the detail it
                    deserves.
                  </p>
                  <Button
                    onClick={addEdu}
                    className="bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 border border-blue-500/20 rounded-2xl px-10 h-14 font-bold text-lg"
                  >
                    Add Your First Degree
                  </Button>
                </div>
              ) : (
                education.map((edu, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group relative p-4 md:p-8 bg-slate-950/20 transition-all  overflow-hidden"
                  >
                    {/* Background Accent */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none" />

                    <div className="flex flex-col lg:flex-row gap-8">
                      {/* Logo Section */}
                      <div className="w-full lg:w-40 shrink-0 space-y-3">
                        <ImageUpload
                          label="Univ. Logo"
                          value={edu.logo || ""}
                          onChange={(url) => updateEdu(i, "logo", url)}
                        />
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => move(i, "up")}
                            disabled={i === 0}
                            className="h-8 w-8 rounded-lg bg-slate-900 border border-white/5 text-slate-500 hover:text-white disabled:opacity-20"
                          >
                            <FaArrowUp size={10} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => move(i, "down")}
                            disabled={i === education.length - 1}
                            className="h-8 w-8 rounded-lg bg-slate-900 border border-white/5 text-slate-500 hover:text-white disabled:opacity-20"
                          >
                            <FaArrowDown size={10} />
                          </Button>
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-4 relative z-10">
                        {/* Degree Name */}
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Degree / Program Name
                          </label>
                          <div className="relative group/input">
                            <FaGraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-blue-400 transition-colors" />
                            <Input
                              className="bg-slate-900/50 border-white/10 text-white rounded-xl pl-12 h-11 focus-visible:ring-blue-500/50 focus-visible:bg-slate-900 transition-all font-bold text-sm"
                              value={edu.degree}
                              onChange={(e) =>
                                updateEdu(i, "degree", e.target.value)
                              }
                              placeholder="e.g. Bachelor of Science in CSE"
                            />
                          </div>
                        </div>

                        {/* Institution */}
                        <div className="space-y-1.5 md:col-span-2 lg:col-span-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Institution
                          </label>
                          <div className="relative group/input">
                            <FaUniversity className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-blue-400 transition-colors" />
                            <Input
                              className="bg-slate-900/50 border-white/10 text-white rounded-xl pl-12 h-11 focus-visible:ring-blue-500/50 focus-visible:bg-slate-900 transition-all font-bold text-sm"
                              value={edu.institution}
                              onChange={(e) =>
                                updateEdu(i, "institution", e.target.value)
                              }
                              placeholder="e.g. Green University of Bangladesh"
                            />
                          </div>
                        </div>

                        {/* Period */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Duration / Period
                          </label>
                          <div className="relative group/input">
                            <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-blue-400 transition-colors" />
                            <Input
                              className="bg-slate-900/50 border-white/10 text-white rounded-xl pl-12 h-11 focus-visible:ring-blue-500/50 focus-visible:bg-slate-900 transition-all font-medium text-sm"
                              value={edu.period}
                              onChange={(e) =>
                                updateEdu(i, "period", e.target.value)
                              }
                              placeholder="e.g. 2021 - 2024"
                            />
                          </div>
                        </div>

                        {/* GPA */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            GPA / Grade
                          </label>
                          <div className="relative group/input">
                            <FaAward className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-blue-400 transition-colors" />
                            <Input
                              className="bg-slate-900/50 border-white/10 text-white rounded-xl pl-12 h-11 focus-visible:ring-blue-500/50 focus-visible:bg-slate-900 transition-all font-bold text-sm"
                              value={edu.gpa || ""}
                              onChange={(e) =>
                                updateEdu(i, "gpa", e.target.value)
                              }
                              placeholder="e.g. 3.92 / 4.0"
                            />
                          </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-2.5 md:col-span-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Location
                          </label>
                          <div className="relative group/input">
                            <FaMapMarkerAlt className="absolute left-4 top-5 text-slate-600 group-focus-within/input:text-blue-400 transition-colors" />
                            <Textarea
                              className="bg-slate-900/50 border-white/10 text-white rounded-2xl pl-12 h-fit w-full focus-visible:ring-blue-500/50 focus-visible:bg-slate-900 transition-all font-medium"
                              value={edu.location || ""}
                              onChange={(e) =>
                                updateEdu(i, "location", e.target.value)
                              }
                              placeholder="e.g. Dhaka, Bangladesh"
                            />
                          </div>
                        </div>

                        {/* Details Manager */}
                        <div className="space-y-4 md:col-span-2 lg:col-span-3 xl:col-span-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Highlights & Key Achievements
                          </label>
                          <div className="flex gap-2">
                            <div className="relative group/input flex-1">
                              <FaInfoCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-blue-400 transition-colors" />
                              <Input
                                className="bg-slate-900/50 border-white/10 text-white rounded-2xl pl-12 h-14 focus-visible:ring-blue-500/50 focus-visible:bg-slate-900 transition-all font-medium"
                                value={newDetailInputs[i] || ""}
                                onChange={(e) =>
                                  setNewDetailInputs((prev) => ({
                                    ...prev,
                                    [i]: e.target.value,
                                  }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    addDetail(i);
                                  }
                                }}
                                placeholder="Add an achievement..."
                              />
                            </div>
                            <Button
                              type="button"
                              onClick={() => addDetail(i)}
                              className="bg-slate-800 hover:bg-slate-700 text-white rounded-2xl h-14 w-14 p-0 shrink-0 border border-white/5"
                            >
                              <FaPlus size={16} />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                            <AnimatePresence mode="popLayout">
                              {edu.details?.map((d, dIdx) => (
                                <motion.div
                                  key={dIdx}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  className="flex items-center gap-3 bg-slate-950/40 border border-white/5 rounded-2xl p-3 group/detail"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                  <span className="text-sm text-slate-300 flex-1 leading-relaxed font-medium">
                                    {d}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeDetail(i, dIdx)}
                                    className="h-8 w-8 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                  >
                                    <FaTimes size={14} />
                                  </Button>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                            {(!edu.details || edu.details.length === 0) && (
                              <p className="text-center py-4 text-slate-600 text-[10px] uppercase tracking-widest font-black opacity-30 italic md:col-span-2 xl:col-span-3">
                                No highlights added yet.
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Link */}
                        <div className="space-y-1.5 md:col-span-2 lg:col-span-3 xl:col-span-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Credential / Verification Link
                          </label>
                          <div className="relative group/input">
                            <FaLink className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-blue-400 transition-colors" />
                            <Input
                              className="bg-slate-900/50 border-white/10 text-white rounded-xl pl-12 h-11 focus-visible:ring-blue-500/50 focus-visible:bg-slate-900 transition-all font-medium text-sm"
                              value={edu.link || ""}
                              onChange={(e) =>
                                updateEdu(i, "link", e.target.value)
                              }
                              placeholder="https://verify.university.edu/..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions Area */}
                    <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />{" "}
                        Ranked Position #{i + 1}
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() =>
                          setEducation((prev) =>
                            prev.filter((_, idx) => idx !== i),
                          )
                        }
                        className="text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl px-6 h-12 font-bold transition-all flex items-center gap-2 group"
                      >
                        <FaTrash
                          size={14}
                          className="group-hover:animate-bounce"
                        />{" "}
                        Delete Record
                      </Button>
                    </div>
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
