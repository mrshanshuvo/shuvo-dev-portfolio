"use client";
import { useState, useEffect } from "react";
import {
  FaPlus,
  FaTimes,
  FaCheck,
  FaSave,
  FaPenNib,
  FaLink,
  FaCalendarAlt,
  FaTags,
  FaArrowUp,
  FaArrowDown,
  FaTrash,
  FaInfoCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ImageUpload from "../components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Blog {
  title: string;
  description: string;
  link: string;
  date: string;
  tags: string[];
  image?: string;
}

export default function AdminBlogsPage() {
  const [data, setData] = useState<Blog[]>([]);
  const [tagInputs, setTagInputs] = useState<{ [key: number]: string }>({});
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
    fetch("/api/admin/blogs")
      .then((r) => r.json())
      .then((d) => {
        setData(Array.isArray(d) ? d : []);
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/admin/blogs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    if (res.ok) showToast("Articles synchronized!");
    else showToast("Failed to save records.", "error");
  }

  function addBlog() {
    setData((prev) => [
      ...prev,
      {
        title: "New Technical Article",
        description: "A brief summary of your writing...",
        link: "https://medium.com/...",
        date: new Date().getFullYear().toString(),
        tags: ["Tech"],
        image: "",
      },
    ]);
  }

  function updateBlog(i: number, field: keyof Blog, val: any) {
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

  function addTag(i: number) {
    const val = tagInputs[i]?.trim();
    if (!val) return;
    const current = data[i].tags || [];
    if (current.includes(val)) return;
    updateBlog(i, "tags", [...current, val]);
    setTagInputs((prev) => ({ ...prev, [i]: "" }));
  }

  function removeTag(i: number, tagIdx: number) {
    updateBlog(i, "tags", data[i].tags.filter((_, idx) => idx !== tagIdx));
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
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-full blur-sm" />
              <h1 className="text-3xl font-black text-white tracking-tight">
                Blog & <span className="text-blue-400">Writing</span>
              </h1>
            </div>
            <Badge
              variant="outline"
              className="hidden md:flex bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-1 rounded-full font-bold uppercase tracking-widest text-[10px]"
            >
              {data.length} Articles
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              onClick={addBlog}
              className="bg-slate-800 hover:bg-slate-700 text-white border-white/10 rounded-xl h-11 px-5 active:scale-95 transition-all text-xs font-bold"
            >
              <FaPlus size={12} className="mr-2 text-blue-400" /> New Article
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
              {saving ? "Syncing..." : "Save Writing"}
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
              ) : data.length === 0 ? (
                <div className="p-24 text-center">
                  <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-700">
                    <FaPenNib size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Share Your Insights</h3>
                  <p className="text-slate-500 mb-10 max-w-sm mx-auto">
                    Publish technical articles and build your authority as an expert.
                  </p>
                  <Button
                    onClick={addBlog}
                    className="bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 border border-blue-500/20 rounded-2xl px-10 h-14 font-bold text-lg"
                  >
                    Start Writing
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
                      {/* Cover Section */}
                      <div className="w-full lg:w-40 shrink-0 space-y-3">
                        <ImageUpload
                          label="Cover Image"
                          value={item.image || ""}
                          onChange={(url) => updateBlog(i, "image", url)}
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
                            disabled={i === data.length - 1}
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
                            Article Title
                          </label>
                          <div className="relative group/input">
                            <FaPenNib className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-blue-400 transition-colors" />
                            <Input
                              className="bg-slate-900/50 border-white/10 text-white rounded-xl pl-12 h-11 focus-visible:ring-blue-500/50 focus-visible:bg-slate-900 transition-all font-bold text-sm"
                              value={item.title}
                              onChange={(e) => updateBlog(i, "title", e.target.value)}
                              placeholder="e.g. Master Next.js 15 Server Actions"
                            />
                          </div>
                        </div>

                        {/* External Link */}
                        <div className="space-y-1.5 md:col-span-2 lg:col-span-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            External Link / URL
                          </label>
                          <div className="relative group/input">
                            <FaLink className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-blue-400 transition-colors" />
                            <Input
                              className="bg-slate-900/50 border-white/10 text-white rounded-xl pl-12 h-11 focus-visible:ring-blue-500/50 focus-visible:bg-slate-900 transition-all font-medium text-sm"
                              value={item.link}
                              onChange={(e) => updateBlog(i, "link", e.target.value)}
                              placeholder="https://medium.com/@your-profile/..."
                            />
                          </div>
                        </div>

                        {/* Date */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Publication Date
                          </label>
                          <div className="relative group/input">
                            <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-blue-400 transition-colors" />
                            <Input
                              className="bg-slate-900/50 border-white/10 text-white rounded-xl pl-12 h-11 focus-visible:ring-blue-500/50 focus-visible:bg-slate-900 transition-all font-medium text-sm"
                              value={item.date}
                              onChange={(e) => updateBlog(i, "date", e.target.value)}
                              placeholder="e.g. May 2024"
                            />
                          </div>
                        </div>

                        {/* Tags Manager */}
                        <div className="space-y-4 md:col-span-2 lg:col-span-3 xl:col-span-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Topics & Tags
                          </label>
                          <div className="flex gap-2">
                             <div className="relative group/input flex-1">
                                <FaTags className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-blue-400 transition-colors" />
                                <Input
                                  className="bg-slate-900/50 border-white/10 text-white rounded-xl pl-12 h-11 focus-visible:ring-blue-500/50 focus-visible:bg-slate-900 transition-all font-medium text-sm"
                                  value={tagInputs[i] || ""}
                                  onChange={(e) => setTagInputs(prev => ({...prev, [i]: e.target.value}))}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      addTag(i);
                                    }
                                  }}
                                  placeholder="Add a tag (e.g. Next.js)..."
                                />
                             </div>
                             <Button
                              type="button"
                              onClick={() => addTag(i)}
                              className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl h-11 w-11 p-0 shrink-0 border border-white/5"
                             >
                              <FaPlus size={14} />
                             </Button>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <AnimatePresence mode="popLayout">
                              {item.tags?.map((tag, tIdx) => (
                                <motion.div
                                  key={tIdx}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                >
                                  <Badge
                                    variant="secondary"
                                    className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 py-1 rounded-lg gap-2"
                                  >
                                    {tag}
                                    <button
                                      onClick={() => removeTag(i, tIdx)}
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
                        <div className="space-y-1.5 md:col-span-2 lg:col-span-3 xl:col-span-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Article Summary / Description
                          </label>
                          <div className="relative group/input">
                            <FaInfoCircle className="absolute left-4 top-4 text-slate-700 group-focus-within/input:text-blue-400 transition-colors" />
                            <Textarea
                              className="bg-slate-900/50 border-white/10 text-white rounded-xl pl-12 min-h-[80px] focus-visible:ring-blue-500/50 focus-visible:bg-slate-900 transition-all font-medium leading-relaxed"
                              value={item.description}
                              onChange={(e) => updateBlog(i, "description", e.target.value)}
                              placeholder="Write a catchy summary for this article..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions Area */}
                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> Article #{i + 1}
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
