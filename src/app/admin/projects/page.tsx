"use client";
import { useState, useEffect } from "react";
import {
  FaPlus,
  FaTimes,
  FaCheck,
  FaSave,
  FaSearch,
  FaFilter,
  FaGithub,
  FaExternalLinkAlt,
  FaStar,
  FaRegStar,
  FaArrowUp,
  FaArrowDown,
  FaTrash,
  FaCode,
  FaLayerGroup,
  FaInfoCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ImageUpload from "../components/ImageUpload";
import MediaGalleryManager from "../components/MediaGalleryManager";
import MultiLinkManager from "../components/MultiLinkManager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import type { Project } from "@/types";

const CATEGORY_OPTIONS = [
  "Full Stack",
  "Frontend",
  "Backend",
  "ML/AI",
  "Mobile",
  "Other",
];

export default function AdminProjectsPage() {
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [newImprovementInputs, setNewImprovementInputs] = useState<{ [key: number]: string }>({});
  const [newTechInputs, setNewTechInputs] = useState<{ [key: number]: string }>({});
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    fetch("/api/admin/projects")
      .then((r) => r.json())
      .then((d) => {
        setData(Array.isArray(d) ? d : []);
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/admin/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    if (res.ok) showToast("Portfolio synchronized!");
    else showToast("Failed to save records.", "error");
  }

  function addProject() {
    setData((prev) => [
      ...prev,
      {
        title: "New Project",
        slug: "new-project-" + Date.now(),
        description: "Showcase your work here...",
        image: "",
        techNames: ["React", "Next.js"],
        github: [],
        live: [],
        featured: false,
        category: "Full Stack",
        improvements: [],
        media: [],
        order: prev.length,
      },
    ]);
  }

  function updateProject(i: number, field: keyof Project, val: any) {
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

  function addImprovement(i: number) {
    const val = newImprovementInputs[i]?.trim();
    if (!val) return;
    const current = data[i].improvements || [];
    updateProject(i, "improvements", [...current, val]);
    setNewImprovementInputs(prev => ({ ...prev, [i]: "" }));
  }

  function removeImprovement(i: number, impIdx: number) {
    updateProject(i, "improvements", data[i].improvements.filter((_, idx) => idx !== impIdx));
  }

  function addTech(i: number) {
    const val = newTechInputs[i]?.trim();
    if (!val) return;
    const current = data[i].techNames || [];
    if (current.includes(val)) return;
    updateProject(i, "techNames", [...current, val]);
    setNewTechInputs(prev => ({ ...prev, [i]: "" }));
  }

  function removeTech(i: number, tIdx: number) {
    updateProject(i, "techNames", data[i].techNames.filter((_, idx) => idx !== tIdx));
  }

  const filtered = data.filter((p) => {
    const mSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                   p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const mCat = filterCategory === "All" || p.category === filterCategory;
    return mSearch && mCat;
  });

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
                Project <span className="text-emerald-400">Portfolio</span>
              </h1>
            </div>
            <div className="hidden xl:flex items-center gap-4 ml-4">
               <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <Input 
                    placeholder="Search..." 
                    className="bg-slate-950/50 border-white/10 rounded-xl pl-12 w-64 h-11 focus-visible:ring-emerald-500/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
               <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v || "All")}>
                  <SelectTrigger className="bg-slate-950/50 border-white/10 rounded-xl w-44 h-11 text-slate-300">
                     <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-white">
                     <SelectItem value="All">All Categories</SelectItem>
                     {CATEGORY_OPTIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
               </Select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              onClick={addProject}
              className="bg-slate-800 hover:bg-slate-700 text-white border-white/10 rounded-xl h-11 px-5 active:scale-95 transition-all text-xs font-bold"
            >
              <FaPlus size={12} className="mr-2 text-emerald-400" /> New Project
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
              {saving ? "Syncing..." : "Save Portfolio"}
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
                      <div className="w-48 h-48 bg-slate-800/40 rounded-3xl" />
                      <div className="flex-1 space-y-4">
                        <div className="h-10 w-full bg-slate-800/30 rounded-xl" />
                        <div className="h-10 w-1/2 bg-slate-800/30 rounded-xl" />
                      </div>
                    </div>
                  </div>
                ))
              ) : filtered.length === 0 ? (
                <div className="p-24 text-center">
                   <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-700">
                    <FaCode size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Your Digital Legacy</h3>
                  <p className="text-slate-500 mb-10 max-w-sm mx-auto">
                    Manage your full-stack projects, AI experiments, and mobile applications.
                  </p>
                  <Button
                    onClick={addProject}
                    className="bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600/20 border border-emerald-500/20 rounded-2xl px-10 h-14 font-bold text-lg"
                  >
                    Add First Project
                  </Button>
                </div>
              ) : (
                filtered.map((proj, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group relative p-6 md:p-8 bg-slate-950/20 transition-all border-b border-white/5 last:border-0"
                  >
                    <div className="flex flex-col xl:flex-row gap-8">
                      {/* Media Gallery */}
                      <div className="w-full xl:w-140 shrink-0 space-y-6">
                        <MediaGalleryManager
                          media={proj.media || []}
                          onChange={(m) => updateProject(i, "media", m)}
                          label="Project Showcase Gallery"
                        />
                        <div className="flex items-center justify-between gap-4 px-2">
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
                           <Button
                              onClick={() => updateProject(i, "featured", !proj.featured)}
                              className={cn(
                                "h-10 px-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border duration-500",
                                proj.featured 
                                  ? "bg-linear-to-r from-amber-500 to-orange-500 border-amber-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] active:scale-95" 
                                  : "bg-slate-900/50 border-white/5 text-slate-500 hover:text-slate-300 hover:border-white/10"
                              )}
                           >
                              {proj.featured ? <FaStar className="inline mr-2 animate-pulse" /> : <FaRegStar className="inline mr-2" />}
                              {proj.featured ? "Featured Hero" : "Set Featured"}
                           </Button>
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 relative z-10">
                        {/* Title & Slug */}
                        <div className="space-y-4 md:col-span-2">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                                  Project Title
                                </label>
                                <div className="relative group/input">
                                  <FaCode className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-emerald-400 transition-colors" />
                                  <Input
                                    className="bg-slate-900/50 border-white/10 text-white rounded-xl pl-12 h-11 focus-visible:ring-emerald-500/50 focus-visible:bg-slate-900 transition-all font-bold text-sm"
                                    value={proj.title}
                                    onChange={(e) => updateProject(i, "title", e.target.value)}
                                    placeholder="e.g. Nexus Dashboard"
                                  />
                                </div>
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                                  URL Slug
                                </label>
                                <Input
                                  className="bg-slate-900/50 border-white/10 text-white rounded-xl h-11 focus-visible:ring-emerald-500/50 focus-visible:bg-slate-900 transition-all font-medium text-sm"
                                  value={proj.slug}
                                  onChange={(e) => updateProject(i, "slug", e.target.value)}
                                  placeholder="nexus-dashboard"
                                />
                              </div>
                           </div>
                        </div>

                        {/* Category */}
                        <div className="space-y-1.5 lg:col-span-1">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Primary Category
                          </label>
                          <div className="relative group/input">
                            <FaLayerGroup className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-emerald-400 transition-colors z-10 pointer-events-none" />
                            <Select value={proj.category} onValueChange={(v) => updateProject(i, "category", v)}>
                               <SelectTrigger className="bg-slate-900/50 border-white/10 text-white rounded-xl pl-12 h-11 focus-visible:ring-emerald-500/50 focus-visible:bg-slate-900 transition-all font-medium text-sm">
                                  <SelectValue placeholder="Category" />
                               </SelectTrigger>
                               <SelectContent className="bg-slate-900 border-white/10 text-white rounded-xl">
                                  {CATEGORY_OPTIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                               </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Links Section */}
                        <section className="space-y-8 bg-slate-950/20 p-6 rounded-[2rem] border border-white/5 md:col-span-3">
                          <MultiLinkManager
                            label="Repositories & Codebases"
                            iconType="github"
                            links={proj.github || []}
                            onChange={(l) => updateProject(i, "github", l)}
                          />
                          <MultiLinkManager
                            label="Live Deployments & Sites"
                            iconType="live"
                            links={proj.live || []}
                            onChange={(l) => updateProject(i, "live", l)}
                          />
                        </section>

                        {/* Tech Stack Manager */}
                        <div className="space-y-4 md:col-span-2 lg:col-span-1">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Tech Stack
                          </label>
                          <div className="flex gap-2">
                             <div className="relative group/input flex-1">
                                <FaCode className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-emerald-400 transition-colors" />
                                <Input
                                  className="bg-slate-900/50 border-white/10 text-white rounded-xl pl-12 h-11 focus-visible:ring-emerald-500/50 focus-visible:bg-slate-900 transition-all font-medium text-sm"
                                  value={newTechInputs[i] || ""}
                                  onChange={(e) => setNewTechInputs(prev => ({...prev, [i]: e.target.value}))}
                                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech(i))}
                                  placeholder="Add tech..."
                                />
                             </div>
                             <Button onClick={() => addTech(i)} className="bg-slate-800 hover:bg-slate-700 rounded-xl h-11 w-11 p-0 border border-white/5"><FaPlus size={12} /></Button>
                          </div>
                          <div className="flex flex-wrap gap-1">
                             {proj.techNames?.map((t, tIdx) => (
                               <Badge key={tIdx} className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px] uppercase font-black px-2 py-0.5 rounded-md gap-1">
                                 {t}
                                 <button onClick={() => removeTech(i, tIdx)} className="hover:text-red-400"><FaTimes size={8} /></button>
                               </Badge>
                             ))}
                          </div>
                        </div>

                        {/* Improvements Manager */}
                        <div className="space-y-4 md:col-span-2 lg:col-span-3">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Key Features & Technical Improvements
                          </label>
                          <div className="flex gap-2">
                             <div className="relative group/input flex-1">
                                <FaInfoCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-emerald-400 transition-colors" />
                                <Input
                                  className="bg-slate-900/50 border-white/10 text-white rounded-xl pl-12 h-11 focus-visible:ring-emerald-500/50 focus-visible:bg-slate-900 transition-all font-medium text-sm"
                                  value={newImprovementInputs[i] || ""}
                                  onChange={(e) => setNewImprovementInputs(prev => ({...prev, [i]: e.target.value}))}
                                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImprovement(i))}
                                  placeholder="Optimized bundle size by 40%..."
                                />
                             </div>
                             <Button onClick={() => addImprovement(i)} className="bg-slate-800 hover:bg-slate-700 rounded-xl h-11 w-11 p-0 border border-white/5"><FaPlus size={12} /></Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
                             {proj.improvements?.map((imp, impIdx) => (
                               <motion.div 
                                 key={impIdx} 
                                 layout
                                 className="flex items-center gap-4 bg-slate-950/60 border border-white/5 rounded-2xl p-4 group/detail hover:border-emerald-500/30 hover:bg-slate-900/80 transition-all duration-300"
                               >
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                  <span className="text-[11px] text-slate-300 flex-1 leading-relaxed">{imp}</span>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => removeImprovement(i, impIdx)} 
                                    className="h-8 w-8 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all opacity-0 group-hover/detail:opacity-100"
                                  >
                                    <FaTimes size={12} />
                                  </Button>
                               </motion.div>
                             ))}
                          </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5 md:col-span-3">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Project Narrative / Overview
                          </label>
                          <Textarea
                            className="bg-slate-900/50 border-white/10 text-white rounded-xl min-h-[100px] focus-visible:ring-emerald-500/50 focus-visible:bg-slate-900 transition-all font-medium leading-relaxed"
                            value={proj.description}
                            onChange={(e) => updateProject(i, "description", e.target.value)}
                            placeholder="Tell the story of this project..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Actions Area */}
                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Project #{i + 1}
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() => setData((prev) => prev.filter((_, idx) => idx !== i))}
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
