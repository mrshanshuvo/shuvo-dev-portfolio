"use client";
import { useState, useEffect } from "react";
import {
  FaPlus,
  FaTimes,
  FaCheck,
  FaSave,
  FaBriefcase,
  FaCalendarAlt,
  FaBuilding,
  FaMapMarkerAlt,
  FaArrowUp,
  FaArrowDown,
  FaTrash,
  FaInfoCircle,
  FaPalette,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ImageUpload from "../components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Experience } from "@/types";

export default function AdminExperiencePage() {
  const [items, setItems] = useState<Experience[]>([]);
  const [newDetailInputs, setNewDetailInputs] = useState<{ [key: number]: string }>(
    {}
  );
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
    fetch("/api/admin/experience")
      .then((r) => r.json())
      .then((d) => {
        setItems(Array.isArray(d) ? d : []);
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/admin/experience", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items),
    });
    setSaving(false);
    if (res.ok) showToast("Experience timeline synchronized!");
    else showToast("Failed to save records.", "error");
  }

  function addExp() {
    setItems((prev) => [
      ...prev,
      {
        title: "Software Engineer",
        org: "Company Name",
        location: "City, Country",
        duration: "Jan 2024 - Present",
        details: [],
        logo: "",
        color: "emerald",
        type: "work",
      },
    ]);
  }

  function updateExp(i: number, field: keyof Experience, val: any) {
    setItems((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: val };
      return next;
    });
  }

  function move(i: number, dir: "up" | "down") {
    setItems((prev) => {
      const next = [...prev];
      const j = dir === "up" ? i - 1 : i + 1;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function addDetail(i: number) {
    const val = newDetailInputs[i]?.trim();
    if (!val) return;
    setItems((prev) => {
      const next = [...prev];
      next[i] = {
        ...next[i],
        details: [...(next[i].details || []), val],
      };
      return next;
    });
    setNewDetailInputs((prev) => ({ ...prev, [i]: "" }));
  }

  function removeDetail(i: number, dIdx: number) {
    setItems((prev) => {
      const next = [...prev];
      next[i] = {
        ...next[i],
        details: next[i].details.filter((_, idx) => idx !== dIdx),
      };
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-10 space-y-10">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 ${
              toast.type === "success"
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                : "bg-red-500/20 border-red-500/50 text-red-400"
            }`}
          >
            <div className={`p-2 rounded-full ${toast.type === "success" ? "bg-emerald-500/20" : "bg-red-500/20"}`}>
              {toast.type === "success" ? <FaCheck /> : <FaTimes />}
            </div>
            <span className="font-semibold">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full space-y-8">
        {/* Unified Header Section */}
        <header className="sticky top-6 z-40 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900/60 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-500 rounded-full blur-sm" />
              <h1 className="text-3xl font-black text-white tracking-tight">
                Professional <span className="text-emerald-400">Journey</span>
              </h1>
            </div>
            <Badge
              variant="outline"
              className="hidden md:flex bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1 rounded-full font-bold uppercase tracking-widest text-[10px]"
            >
              {items.length} Positions
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              onClick={addExp}
              className="bg-slate-800 hover:bg-slate-700 text-white border-white/10 rounded-xl h-11 px-5 active:scale-95 transition-all text-xs font-bold"
            >
              <FaPlus size={12} className="mr-2 text-emerald-400" /> Add Experience
            </Button>
            <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block" />
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold px-6 h-11 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all group text-xs"
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

        <Card className="bg-slate-900/20 backdrop-blur-xl overflow-hidden shadow-2xl border border-white/5 rounded-[2.5rem]">
          <CardContent className="p-0">
            <AnimatePresence mode="popLayout">
              {loading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="p-8 bg-slate-950/20 space-y-6 animate-pulse border-b border-white/5">
                    <div className="flex gap-8">
                      <div className="w-32 h-32 bg-slate-800/40 rounded-3xl" />
                      <div className="flex-1 space-y-4">
                        <div className="h-10 w-full bg-slate-800/30 rounded-xl" />
                        <div className="h-10 w-1/2 bg-slate-800/30 rounded-xl" />
                      </div>
                    </div>
                  </div>
                ))
              ) : items.length === 0 ? (
                <div className="p-24 text-center">
                  <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-700">
                    <FaBriefcase size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Your Career Path</h3>
                  <p className="text-slate-500 mb-10 max-w-sm mx-auto">
                    Document your professional experience to build trust with recruiters.
                  </p>
                  <Button
                    onClick={addExp}
                    className="bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600/20 border border-emerald-500/20 rounded-2xl px-10 h-14 font-bold text-lg"
                  >
                    Add Your First Job
                  </Button>
                </div>
              ) : (
                items.map((exp, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group relative p-6 md:p-8 bg-slate-950/20 transition-all border-b border-white/5 last:border-0"
                  >
                    <div className="flex flex-col lg:flex-row gap-8">
                      {/* Logo Section */}
                      <div className="w-full lg:w-40 shrink-0 space-y-3">
                        <ImageUpload
                          label="Org. Logo"
                          value={exp.logo || ""}
                          onChange={(url) => updateExp(i, "logo", url)}
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
                            disabled={i === items.length - 1}
                            className="h-8 w-8 rounded-lg bg-slate-900 border border-white/5 text-slate-500 hover:text-white disabled:opacity-20"
                          >
                            <FaArrowDown size={10} />
                          </Button>
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-4 relative z-10">
                        {/* Title */}
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Job Title / Role
                          </label>
                          <div className="relative group/input">
                            <FaBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-emerald-400 transition-colors" />
                            <Input
                              className="bg-slate-900/50 border-white/10 text-white rounded-xl pl-12 h-11 focus-visible:ring-emerald-500/50 focus-visible:bg-slate-900 transition-all font-bold text-sm"
                              value={exp.title}
                              onChange={(e) => updateExp(i, "title", e.target.value)}
                              placeholder="e.g. Senior Frontend Developer"
                            />
                          </div>
                        </div>

                        {/* Org */}
                        <div className="space-y-1.5 md:col-span-2 lg:col-span-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Organization / Company
                          </label>
                          <div className="relative group/input">
                            <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-emerald-400 transition-colors" />
                            <Input
                              className="bg-slate-900/50 border-white/10 text-white rounded-xl pl-12 h-11 focus-visible:ring-emerald-500/50 focus-visible:bg-slate-900 transition-all font-bold text-sm"
                              value={exp.org}
                              onChange={(e) => updateExp(i, "org", e.target.value)}
                              placeholder="e.g. Google"
                            />
                          </div>
                        </div>

                        {/* Duration */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Duration / Period
                          </label>
                          <div className="relative group/input">
                            <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-emerald-400 transition-colors" />
                            <Input
                              className="bg-slate-900/50 border-white/10 text-white rounded-xl pl-12 h-11 focus-visible:ring-emerald-500/50 focus-visible:bg-slate-900 transition-all font-medium text-sm"
                              value={exp.duration}
                              onChange={(e) => updateExp(i, "duration", e.target.value)}
                              placeholder="e.g. 2021 - Present"
                            />
                          </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Location
                          </label>
                          <div className="relative group/input">
                            <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-emerald-400 transition-colors" />
                            <Input
                              className="bg-slate-900/50 border-white/10 text-white rounded-xl pl-12 h-11 focus-visible:ring-emerald-500/50 focus-visible:bg-slate-900 transition-all font-medium text-sm"
                              value={exp.location || ""}
                              onChange={(e) => updateExp(i, "location", e.target.value)}
                              placeholder="e.g. Mountain View, CA"
                            />
                          </div>
                        </div>

                        {/* Color Selection */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Brand Accent
                          </label>
                          <div className="relative group/input">
                            <FaPalette className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-emerald-400 transition-colors z-10 pointer-events-none" />
                            <Select
                              value={exp.color}
                              onValueChange={(val) => updateExp(i, "color", val)}
                            >
                              <SelectTrigger className="bg-slate-900/50 border-white/10 text-white rounded-xl pl-12 h-11 focus-visible:ring-emerald-500/50 focus-visible:bg-slate-900 transition-all font-medium text-sm">
                                <SelectValue placeholder="Color" />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-900 border-white/10 text-white rounded-xl">
                                <SelectItem value="emerald" className="focus:bg-emerald-500/10 focus:text-emerald-400">Emerald</SelectItem>
                                <SelectItem value="blue" className="focus:bg-blue-500/10 focus:text-blue-400">Blue</SelectItem>
                                <SelectItem value="amber" className="focus:bg-amber-500/10 focus:text-amber-400">Amber</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Details Manager */}
                        <div className="space-y-4 md:col-span-2 lg:col-span-3 xl:col-span-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Key Responsibilities & Achievements
                          </label>
                          <div className="flex gap-2">
                             <div className="relative group/input flex-1">
                                <FaInfoCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-emerald-400 transition-colors" />
                                <Input
                                  className="bg-slate-900/50 border-white/10 text-white rounded-xl pl-12 h-11 focus-visible:ring-emerald-500/50 focus-visible:bg-slate-900 transition-all font-medium text-sm"
                                  value={newDetailInputs[i] || ""}
                                  onChange={(e) => setNewDetailInputs(prev => ({...prev, [i]: e.target.value}))}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      addDetail(i);
                                    }
                                  }}
                                  placeholder="Add a bullet point..."
                                />
                             </div>
                             <Button
                              type="button"
                              onClick={() => addDetail(i)}
                              className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl h-11 w-11 p-0 shrink-0 border border-white/5"
                             >
                              <FaPlus size={14} />
                             </Button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                            <AnimatePresence mode="popLayout">
                              {exp.details?.map((d, dIdx) => (
                                <motion.div
                                  key={dIdx}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  className="flex items-center gap-3 bg-slate-950/40 border border-white/5 rounded-xl p-3 group/detail"
                                >
                                  <div className={cn(
                                    "w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]",
                                    exp.color === "emerald" ? "bg-emerald-500" : 
                                    exp.color === "blue" ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" : 
                                    "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                                  )} />
                                  <span className="text-xs text-slate-300 flex-1 leading-relaxed font-medium line-clamp-2">
                                    {d}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeDetail(i, dIdx)}
                                    className="h-7 w-7 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                  >
                                    <FaTimes size={12} />
                                  </Button>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions Area */}
                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                        <div className={cn(
                          "w-2 h-2 rounded-full animate-pulse",
                          exp.color === "emerald" ? "bg-emerald-500" : 
                          exp.color === "blue" ? "bg-blue-500" : "bg-amber-500"
                        )} /> Position #{i + 1}
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
                        className="text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl px-5 h-10 font-bold transition-all flex items-center gap-2 group text-xs"
                      >
                        <FaTrash size={12} className="group-hover:animate-bounce" /> Remove
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
