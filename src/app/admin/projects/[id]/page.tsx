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
import { Badge } from "@/components/ui/badge";
import {
  AdminField,
  AdminInput,
  AdminTextarea,
} from "../../components/AdminFields";
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
      <main className="p-6 md:p-12 max-w-5xl mx-auto space-y-12 pb-32">
        {/* Row 1: Media + Core Info */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10">
          {/* Left: Media Gallery */}
          <div className="space-y-8">
            <MediaGalleryManager
              media={(form.media as MediaItem[]) || []}
              onChange={(m) => update("media", m as any)}
              label="Project Showcase"
            />
            <AdminField label="Thumbnail / Cover">
              <ImageUpload
                value={form.image}
                onChange={(v) => update("image", v)}
              />
            </AdminField>
          </div>

          {/* Right: Core Fields */}
          <div className="space-y-8">
            <div className="flex gap-4 items-start">
              <AdminField label="Project Title" className="flex-1">
                <AdminInput
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="e.g. AI-Powered Dashboard"
                />
              </AdminField>
              <div className="pt-2">
                <Button
                  variant="ghost"
                  onClick={() => update("featured", !form.featured)}
                  className={cn(
                    "h-14 w-14 rounded-2xl border transition-all",
                    form.featured
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                      : "bg-slate-950/50 border-white/5 text-slate-600 hover:text-amber-400",
                  )}
                >
                  {form.featured ? (
                    <FaStar size={20} />
                  ) : (
                    <FaRegStar size={20} />
                  )}
                </Button>
              </div>
            </div>

            <AdminField label="Category">
              <Select
                value={form.category ?? ""}
                onValueChange={(v) => update("category", v || "")}
              >
                <SelectTrigger className="bg-slate-950/50 border-white/5 rounded-2xl h-14 font-bold">
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10 text-white rounded-2xl">
                  {categories.map((c) => (
                    <SelectItem key={c.name} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AdminField>

            <AdminField label="Value Proposition (Description)">
              <AdminTextarea
                className="min-h-[160px]"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="What problem does this project solve?"
              />
            </AdminField>

            <AdminField label="Tech Stack">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <AdminInput
                    icon={FaCode}
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTech())
                    }
                    placeholder="Add technology..."
                  />
                  <Button
                    onClick={addTech}
                    className="bg-slate-800 hover:bg-slate-700 text-white rounded-2xl h-14 w-14 shrink-0 border border-white/5"
                  >
                    <FaPlus size={14} />
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
                        <Badge className="bg-slate-900 border-white/5 text-slate-300 flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs group/badge cursor-default">
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
            </AdminField>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-slate-950/40 rounded-[2.5rem] border border-white/5 space-y-8">
            <MultiLinkManager
              label="Repositories"
              iconType="github"
              links={(form.github as LinkItem[]) || []}
              onChange={(l) => update("github", l as any)}
            />
          </div>
          <div className="p-8 bg-slate-950/40 rounded-[2.5rem] border border-white/5 space-y-8">
            <MultiLinkManager
              label="Live Deployments"
              iconType="live"
              links={(form.live as LinkItem[]) || []}
              onChange={(l) => update("live", l as any)}
            />
          </div>
        </div>

        <AdminField label="Key Improvements & Impacts">
          <div className="space-y-6">
            <div className="flex gap-3">
              <AdminInput
                icon={FaInfoCircle}
                value={impInput}
                onChange={(e) => setImpInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addImprovement())
                }
                placeholder="What was the key outcome or technical hurdle you solved?"
              />
              <Button
                onClick={addImprovement}
                className="bg-slate-800 hover:bg-slate-700 text-white rounded-2xl h-14 w-14 shrink-0 border border-white/5"
              >
                <FaPlus size={14} />
              </Button>
            </div>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {(form.improvements ?? []).map((imp, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-4 bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-4 group/imp"
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-500/40 shrink-0" />
                    <span className="text-sm text-slate-300 flex-1 font-medium leading-relaxed">
                      {imp}
                    </span>
                    <button
                      onClick={() =>
                        update(
                          "improvements",
                          (form.improvements ?? []).filter(
                            (_, idx) => idx !== i,
                          ),
                        )
                      }
                      className="text-slate-600 hover:text-red-400 transition-colors p-2 hover:bg-red-400/10 rounded-lg"
                    >
                      <FaTrash size={12} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </AdminField>
      </main>
    </div>
  );
}
