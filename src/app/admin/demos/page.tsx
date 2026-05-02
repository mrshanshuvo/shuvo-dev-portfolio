"use client";
import { useState, useEffect } from "react";
import {
  FaPlus,
  FaTimes,
  FaCheck,
  FaSave,
  FaFlask,
  FaLink,
  FaCode,
  FaArrowUp,
  FaArrowDown,
  FaTrash,
  FaInfoCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import MediaGalleryManager from "../components/MediaGalleryManager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Demo } from "@/types";

export default function AdminDemosPage() {
  const [data, setData] = useState<Demo[]>([]);
  const [techInputs, setTechInputs] = useState<{ [key: number]: string }>({});
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
    fetch("/api/admin/demos")
      .then((r) => r.json())
      .then((d) => {
        setData(Array.isArray(d) ? d : []);
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/admin/demos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    if (res.ok) showToast("Playground synchronized!");
    else showToast("Failed to save records.", "error");
  }

  function addDemo() {
    setData((prev) => [
      ...prev,
      {
        title: "New Experimental Demo",
        description: "A quick summary of this playground project...",
        url: "https://playground.yourdomain.com/...",
        tech: ["React"],
        media: [],
        order: prev.length,
      },
    ]);
  }

  function updateDemo(i: number, field: keyof Demo, val: any) {
    setData((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: val };
      return next;
    });
  }

  function move(i: number, dir: "up" | "down") {
    setData((prev) => {
      const next = [...prev];
      const j = dir === "up" ? i - 1 : i + 1;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function addTech(i: number) {
    const val = techInputs[i]?.trim();
    if (!val) return;
    const current = data[i].tech || [];
    if (current.includes(val)) return;
    updateDemo(i, "tech", [...current, val]);
    setTechInputs((prev) => ({ ...prev, [i]: "" }));
  }

  function removeTech(i: number, tIdx: number) {
    updateDemo(
      i,
      "tech",
      data[i].tech.filter((_, idx) => idx !== tIdx),
    );
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
        {/* Unified Header Section */}
        <header className="sticky top-6 z-40 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900/60 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-500 rounded-full blur-sm" />
              <h1 className="text-3xl font-black text-white tracking-tight">
                Interactive <span className="text-purple-400">Playground</span>
              </h1>
            </div>
            <Badge
              variant="outline"
              className="hidden md:flex bg-purple-500/10 text-purple-400 border-purple-500/20 px-4 py-1 rounded-full font-bold uppercase tracking-widest text-[10px]"
            >
              {data.length} Experiments
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              onClick={addDemo}
              className="bg-slate-800 hover:bg-slate-700 text-white border-white/10 rounded-xl h-11 px-5 active:scale-95 transition-all text-xs font-bold"
            >
              <FaPlus size={12} className="mr-2 text-purple-400" /> New
              Experiment
            </Button>
            <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block" />
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold px-6 h-11 shadow-lg shadow-purple-600/20 active:scale-95 transition-all group text-xs"
            >
              <FaSave
                className={cn(
                  "mr-2 transition-transform duration-500",
                  saving ? "animate-spin" : "group-hover:rotate-12",
                )}
              />
              {saving ? "Syncing..." : "Save Playground"}
            </Button>
          </div>
        </header>

        <Card className="bg-slate-900/20 backdrop-blur-xl overflow-hidden shadow-2xl border border-white/5 rounded-[2.5rem]">
          <CardContent className="p-0">
            <AnimatePresence mode="popLayout">
              {loading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-8 bg-slate-950/20 space-y-6 animate-pulse border-b border-white/5"
                  >
                    <div className="h-10 w-full bg-slate-800/30 rounded-xl" />
                    <div className="h-10 w-1/2 bg-slate-800/30 rounded-xl" />
                    <div className="h-24 w-full bg-slate-800/10 rounded-xl" />
                  </div>
                ))
              ) : data.length === 0 ? (
                <div className="p-24 text-center">
                  <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-700">
                    <FaFlask size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Unleash Creativity
                  </h3>
                  <p className="text-slate-500 mb-10 max-w-sm mx-auto">
                    Showcase your live demos, side projects, and interactive
                    experiments.
                  </p>
                  <Button
                    onClick={addDemo}
                    className="bg-purple-600/10 text-purple-400 hover:bg-purple-600/20 border border-purple-500/20 rounded-2xl px-10 h-14 font-bold text-lg"
                  >
                    Create First Demo
                  </Button>
                </div>
              ) : (
                data.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group relative p-6 md:p-8 bg-slate-950/20 transition-all border-b border-white/5 last:border-0"
                  >
                    <div className="flex flex-col lg:flex-row gap-8">
                      {/* Left: Media Gallery */}
                      <div className="w-full lg:w-140 shrink-0 space-y-6">
                        <MediaGalleryManager
                          media={item.media || []}
                          onChange={(m) => updateDemo(i, "media", m)}
                          label="Demo Media Showcase"
                        />
                        <div className="flex items-center justify-center gap-4">
                          <div className="flex gap-2 p-1 bg-slate-900/50 rounded-xl border border-white/5">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => move(i, "up")}
                              disabled={i === 0}
                              className="h-9 w-9 rounded-lg bg-slate-950 border border-white/5 text-slate-500 hover:text-white hover:bg-slate-800 disabled:opacity-20 transition-all"
                            >
                              <FaArrowUp size={12} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => move(i, "down")}
                              disabled={i === data.length - 1}
                              className="h-9 w-9 rounded-lg bg-slate-950 border border-white/5 text-slate-500 hover:text-white hover:bg-slate-800 disabled:opacity-20 transition-all"
                            >
                              <FaArrowDown size={12} />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Right: Form Grid */}
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 relative z-10">
                        {/* Title */}
                        <div className="space-y-1.5 md:col-span-2 lg:col-span-1">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Demo Title
                          </label>
                          <div className="relative group/input">
                            <FaFlask className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-purple-400 transition-colors" />
                            <Input
                              className="bg-slate-900/50 border-white/10 text-white rounded-xl pl-12 h-11 focus-visible:ring-purple-500/50 focus-visible:bg-slate-900 transition-all font-bold text-sm"
                              value={item.title}
                              onChange={(e) =>
                                updateDemo(i, "title", e.target.value)
                              }
                              placeholder="e.g. AI Text Summarizer"
                            />
                          </div>
                        </div>

                        {/* URL */}
                        <div className="space-y-1.5 md:col-span-2 lg:col-span-1">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Live Demo URL
                          </label>
                          <div className="relative group/input">
                            <FaLink className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-purple-400 transition-colors" />
                            <Input
                              className="bg-slate-900/50 border-white/10 text-white rounded-xl pl-12 h-11 focus-visible:ring-purple-500/50 focus-visible:bg-slate-900 transition-all font-medium text-sm"
                              value={item.url}
                              onChange={(e) =>
                                updateDemo(i, "url", e.target.value)
                              }
                              placeholder="https://lab.yourdomain.com/demo"
                            />
                          </div>
                        </div>

                        {/* Tech Tags Manager */}
                        <div className="space-y-4 md:col-span-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Tech Stack & Core Technologies
                          </label>
                          <div className="flex gap-2">
                            <div className="relative group/input flex-1">
                              <FaCode className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-purple-400 transition-colors" />
                              <Input
                                className="bg-slate-900/50 border-white/10 text-white rounded-xl pl-12 h-11 focus-visible:ring-purple-500/50 focus-visible:bg-slate-900 transition-all font-medium text-sm"
                                value={techInputs[i] || ""}
                                onChange={(e) =>
                                  setTechInputs((prev) => ({
                                    ...prev,
                                    [i]: e.target.value,
                                  }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    addTech(i);
                                  }
                                }}
                                placeholder="Add tech (e.g. PyTorch)..."
                              />
                            </div>
                            <Button
                              type="button"
                              onClick={() => addTech(i)}
                              className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl h-11 w-11 p-0 shrink-0 border border-white/5"
                            >
                              <FaPlus size={14} />
                            </Button>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <AnimatePresence mode="popLayout">
                              {item.tech?.map((t, tIdx) => (
                                <motion.div
                                  key={tIdx}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                >
                                  <Badge
                                    variant="secondary"
                                    className="bg-purple-500/10 text-purple-400 border-purple-500/20 px-3 py-1 rounded-lg gap-2"
                                  >
                                    {t}
                                    <button
                                      onClick={() => removeTech(i, tIdx)}
                                      className="hover:text-red-400 transition-colors"
                                    >
                                      <FaTimes size={10} />
                                    </button>
                                  </Badge>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Demo Description
                          </label>
                          <div className="relative group/input">
                            <FaInfoCircle className="absolute left-4 top-4 text-slate-700 group-focus-within/input:text-purple-400 transition-colors" />
                            <Textarea
                              className="bg-slate-900/50 border-white/10 text-white rounded-xl pl-12 min-h-[100px] focus-visible:ring-purple-500/50 focus-visible:bg-slate-900 transition-all font-medium leading-relaxed"
                              value={item.description}
                              onChange={(e) =>
                                updateDemo(i, "description", e.target.value)
                              }
                              placeholder="What is this experiment about? What are the key features?"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions Area */}
                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />{" "}
                        Experiment #{i + 1}
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() =>
                          setData((prev) => prev.filter((_, idx) => idx !== i))
                        }
                        className="text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl px-5 h-10 font-bold transition-all flex items-center gap-2 group text-xs"
                      >
                        <FaTrash
                          size={12}
                          className="group-hover:animate-bounce"
                        />{" "}
                        Remove
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
