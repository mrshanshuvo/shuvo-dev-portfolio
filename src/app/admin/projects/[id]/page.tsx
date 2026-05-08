"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  FaCheck,
  FaTimes,
  FaSave,
  FaArrowLeft,
  FaStar,
  FaRegStar,
  FaGithub,
  FaExternalLinkAlt,
  FaCode,
  FaInfoCircle,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ImageUpload from "../../components/ImageUpload";
import MediaGalleryManager from "../../components/MediaGalleryManager";
import MultiLinkManager from "../../components/MultiLinkManager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type {
  Project,
  MediaItem,
  Category as ICategory,
  LinkItem,
} from "@/types";

const EMPTY_PROJECT: Omit<Project, "_id"> = {
  title: "",
  slug: "",
  description: "",
  image: "",
  techNames: [],
  github: [],
  live: [],
  featured: false,
  category: "",
  improvements: [],
  media: [],
  order: 0,
};

export default function ProjectEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";

  const [form, setForm] = useState<Omit<Project, "_id">>(EMPTY_PROJECT);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [techInput, setTechInput] = useState("");
  const [impInput, setImpInput] = useState("");
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function update<K extends keyof Project>(field: K, val: Project[K]) {
    setForm((prev) => ({ ...prev, [field]: val }));
  }

  useEffect(() => {
    const fetches: Promise<any>[] = [
      fetch("/api/admin/categories").then((r) => r.json()),
    ];
    if (!isNew) {
      fetches.push(fetch(`/api/admin/projects/${id}`).then((r) => r.json()));
    }
    Promise.all(fetches).then(([cats, project]) => {
      setCategories(Array.isArray(cats) ? cats : []);
      if (project) {
        // Coerce nullable fields to safe defaults
        setForm({
          ...project,
          title: project.title || "",
          slug: project.slug || "",
          description: project.description || "",
          image: project.image || "",
          category: project.category || "",
          techNames: Array.isArray(project.techNames) ? project.techNames : [],
          github: Array.isArray(project.github) ? project.github : [],
          live: Array.isArray(project.live) ? project.live : [],
          improvements: Array.isArray(project.improvements)
            ? project.improvements
            : [],
          media: Array.isArray(project.media) ? project.media : [],
          featured: !!project.featured,
        });
      }
      setLoading(false);
    });
  }, [id, isNew]);

  async function handleSave() {
    if (!form.title.trim()) {
      showToast("Title is required.", "error");
      return;
    }
    setSaving(true);
    let res: Response;
    if (isNew) {
      // For new: use bulk PUT with a single item (existing API)
      const allRes = await fetch("/api/admin/projects").then((r) => r.json());
      const all = Array.isArray(allRes) ? allRes : [];
      res = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([...all, { ...form, order: all.length }]),
      });
    } else {
      res = await fetch(`/api/admin/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setSaving(false);
    if (res.ok) {
      showToast(isNew ? "Project created!" : "Project saved!");
      setTimeout(() => router.push("/admin/projects"), 800);
    } else {
      showToast("Failed to save.", "error");
    }
  }

  function addTech() {
    const val = techInput.trim();
    if (!val || form.techNames.includes(val)) return;
    update("techNames", [...form.techNames, val]);
    setTechInput("");
  }

  function addImprovement() {
    const val = impInput.trim();
    if (!val) return;
    update("improvements", [...(form.improvements ?? []), val]);
    setImpInput("");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className={cn(
              "fixed top-8 left-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl",
              toast.type === "success"
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                : "bg-red-500/20 border-red-500/50 text-red-400",
            )}
          >
            <div
              className={cn(
                "p-1.5 rounded-full",
                toast.type === "success"
                  ? "bg-emerald-500/20"
                  : "bg-red-500/20",
              )}
            >
              {toast.type === "success" ? (
                <FaCheck size={10} />
              ) : (
                <FaTimes size={10} />
              )}
            </div>
            <span className="font-bold text-sm">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 px-6 md:px-12 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/admin/projects")}
              className="text-slate-500 hover:text-white rounded-xl h-10 px-4"
            >
              <FaArrowLeft className="mr-2" size={12} /> Projects
            </Button>
            <div className="w-px h-5 bg-white/10" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                {isNew ? "New Project" : "Editing"}
              </span>
              {!isNew && (
                <p className="text-sm font-bold text-white truncate max-w-xs">
                  {form.title}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => router.push("/admin/projects")}
              className="text-slate-500 hover:text-white rounded-xl h-10 px-4 text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-10 px-6 font-black shadow-lg shadow-emerald-600/20 text-sm"
            >
              {saving ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border-2 border-white/50 border-t-white animate-spin" />
                  Saving...
                </div>
              ) : (
                <>
                  <FaSave className="mr-2" size={12} />{" "}
                  {isNew ? "Create Project" : "Save Changes"}
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="p-6 md:p-12 max-w-7xl mx-auto space-y-10">
        {/* Row 1: Media + Core Info */}
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Left: Media Gallery */}
          <div className="w-full xl:w-140 shrink-0 space-y-6">
            <MediaGalleryManager
              media={(form.media as MediaItem[]) || []}
              onChange={(m) => update("media", m as any)}
              label="Project Media Showcase"
            />
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                Cover / Thumbnail
              </label>
              <ImageUpload
                value={form.image}
                onChange={(v) => update("image", v)}
              />
            </div>
          </div>

          {/* Right: Core Fields */}
          <div className="flex-1 space-y-6">
            {/* Title + Featured */}
            <div className="flex gap-4 items-start">
              <div className="flex-1 space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                  Project Title
                </label>
                <Input
                  className="bg-slate-900/50 border-white/10 text-white rounded-xl h-12 focus-visible:ring-emerald-500/50 font-bold text-base"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="e.g. AI-Powered Dashboard"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                  Featured
                </label>
                <Button
                  variant="ghost"
                  onClick={() => update("featured", !form.featured)}
                  className={cn(
                    "h-12 w-12 rounded-xl border transition-all",
                    form.featured
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                      : "bg-slate-900/50 border-white/10 text-slate-600 hover:text-amber-400",
                  )}
                >
                  {form.featured ? (
                    <FaStar size={18} />
                  ) : (
                    <FaRegStar size={18} />
                  )}
                </Button>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                Category
              </label>
              <Select
                value={form.category ?? ""}
                onValueChange={(v) => update("category", v || "")}
              >
                <SelectTrigger className="bg-slate-900/50 border-white/10 text-white rounded-xl h-11">
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10 text-white">
                  {categories.map((c) => (
                    <SelectItem key={c.name} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                Description
              </label>
              <Textarea
                className="bg-slate-900/50 border-white/10 text-white rounded-xl min-h-[130px] focus-visible:ring-emerald-500/50 font-medium leading-relaxed"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="What does this project do? What problem does it solve?"
              />
            </div>

            {/* Tech Stack */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                Tech Stack
              </label>
              <div className="flex gap-2">
                <div className="relative group/input flex-1">
                  <FaCode
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-emerald-400 transition-colors"
                    size={12}
                  />
                  <Input
                    className="bg-slate-900/50 border-white/10 text-white rounded-xl pl-10 h-11 focus-visible:ring-emerald-500/50"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTech())
                    }
                    placeholder="Add technology..."
                  />
                </div>
                <Button
                  onClick={addTech}
                  className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl h-11 w-11 p-0 border border-white/5"
                >
                  <FaPlus size={12} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <AnimatePresence mode="popLayout">
                  {form.techNames.map((t) => (
                    <motion.div
                      key={t}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Badge className="bg-slate-800 border-white/5 text-slate-300 flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs group/badge cursor-default">
                        {t}
                        <FaTimes
                          size={9}
                          className="text-slate-600 group-hover/badge:text-red-400 cursor-pointer transition-colors"
                          onClick={() =>
                            update(
                              "techNames",
                              form.techNames.filter((x) => x !== t),
                            )
                          }
                        />
                      </Badge>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Links */}
        <div className="bg-slate-900/20 p-6 rounded-[2rem] border border-white/5 space-y-8">
          <MultiLinkManager
            label="Repositories & Codebases"
            iconType="github"
            links={(form.github as LinkItem[]) || []}
            onChange={(l) => update("github", l as any)}
          />
          <MultiLinkManager
            label="Live Deployments & Sites"
            iconType="live"
            links={(form.live as LinkItem[]) || []}
            onChange={(l) => update("live", l as any)}
          />
        </div>

        {/* Row 3: Improvements */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
            Key Improvements & Highlights
          </label>
          <div className="flex gap-2">
            <div className="relative group/input flex-1">
              <FaInfoCircle
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-emerald-400 transition-colors"
                size={12}
              />
              <Input
                className="bg-slate-900/50 border-white/10 text-white rounded-xl pl-10 h-11 focus-visible:ring-emerald-500/50"
                value={impInput}
                onChange={(e) => setImpInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addImprovement())
                }
                placeholder="e.g. Reduced load time by 60%..."
              />
            </div>
            <Button
              onClick={addImprovement}
              className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl h-11 w-11 p-0 border border-white/5"
            >
              <FaPlus size={12} />
            </Button>
          </div>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {(form.improvements ?? []).map((imp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-3 bg-slate-900/30 border border-white/5 rounded-xl px-4 py-3 group/imp"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-sm text-slate-300 flex-1">{imp}</span>
                  <FaTrash
                    size={10}
                    className="text-slate-700 group-hover/imp:text-red-400 cursor-pointer transition-colors shrink-0"
                    onClick={() =>
                      update(
                        "improvements",
                        (form.improvements ?? []).filter((_, idx) => idx !== i),
                      )
                    }
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Save */}
        <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/projects")}
            className="text-slate-500 hover:text-white rounded-xl h-12 px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-12 px-10 font-black shadow-lg shadow-emerald-600/20"
          >
            {saving ? "Saving..." : isNew ? "Create Project" : "Save Changes"}
          </Button>
        </div>
      </main>
    </div>
  );
}
