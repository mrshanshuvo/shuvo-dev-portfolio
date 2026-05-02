"use client";

import { useState, useEffect, useRef } from "react";
import type { Project } from "@/types";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaStar,
  FaRegStar,
  FaTimes,
  FaCheck,
  FaSearch,
  FaFilter,
  FaGithub,
  FaExternalLinkAlt,
  FaImage,
  FaListUl,
  FaSave,
  FaArrowLeft,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ImageUpload from "../components/ImageUpload";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TECH_OPTIONS = [
  "React",
  "Next.js",
  "Node.js",
  "MongoDB",
  "Tailwind CSS",
  "Express.js",
  "Firebase",
  "Leaflet",
  "TensorFlow",
  "Django",
  "Docker",
  "Python",
  "TypeScript",
  "PostgreSQL",
  "Redis",
  "GraphQL",
  "Prisma",
];

const CATEGORY_OPTIONS = [
  "Full Stack",
  "Frontend",
  "Backend",
  "ML/AI",
  "Mobile",
  "Other",
];

const EMPTY_PROJECT: Omit<Project, "_id"> = {
  title: "",
  slug: "",
  description: "",
  image: "",
  techNames: [],
  github: "",
  live: "",
  featured: false,
  category: "Full Stack",
  improvements: [],
  order: 0,
};

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<Omit<Project, "_id">>(EMPTY_PROJECT);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const [improvementInput, setImprovementInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function loadProjects() {
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      showToast("Failed to load projects", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_PROJECT);
    setImprovementInput("");
    setShowForm(true);
  }

  function openEdit(p: Project) {
    setEditing(p);
    setForm({ ...p });
    setImprovementInput("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY_PROJECT);
  }

  async function handleSave() {
    if (!form.title) return showToast("Title is required", "error");

    setSaving(true);
    const url = editing
      ? `/api/admin/projects/${editing._id}`
      : "/api/admin/projects";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);

    if (res.ok) {
      showToast(
        editing
          ? "Project updated successfully!"
          : "Project created successfully!",
      );
      closeForm();
      loadProjects();
    } else {
      showToast("Failed to save project.", "error");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    showToast("Project deleted.");
    loadProjects();
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const d = await res.json();
      if (d.url) {
        setForm((prev) => ({ ...prev, image: d.url }));
        showToast("Image uploaded successfully!");
      } else {
        showToast(d.error || "Upload failed", "error");
      }
    } catch (err) {
      showToast("Upload failed", "error");
    } finally {
      setUploading(false);
    }
  }

  function toggleTech(tech: string) {
    setForm((f) => ({
      ...f,
      techNames: f.techNames.includes(tech)
        ? f.techNames.filter((t) => t !== tech)
        : [...f.techNames, tech],
    }));
  }

  function addImprovement() {
    if (!improvementInput.trim()) return;
    setForm((f) => ({
      ...f,
      improvements: [...f.improvements, improvementInput.trim()],
    }));
    setImprovementInput("");
  }

  function removeImprovement(i: number) {
    setForm((f) => ({
      ...f,
      improvements: f.improvements.filter((_, idx) => idx !== i),
    }));
  }

  const filteredProjects = projects
    .filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        filterCategory === "All" || p.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
      {/* Toast */}
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

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
              Projects
            </h1>
            <p className="text-slate-400">
              Manage your portfolio projects and case studies.
            </p>
          </div>
          <Button
            onClick={openAdd}
            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold px-6 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
          >
            <FaPlus className="mr-2" /> Add Project
          </Button>
        </header>

        {/* Search & Filters */}
        <Card className="rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl mb-8 overflow-hidden">
          <CardContent className="p-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <Input
                placeholder="Search projects by title or description..."
                className="pl-11 bg-slate-950/50 border-white/10 text-white rounded-2xl h-12 focus-visible:ring-emerald-500/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <div className="w-48 shrink-0">
                <Select
                  value={filterCategory}
                  onValueChange={(val) => val && setFilterCategory(val)}
                >
                  <SelectTrigger className="bg-slate-950/50 border-white/10 text-slate-200 rounded-2xl h-12">
                    <div className="flex items-center gap-2">
                      <FaFilter size={14} className="text-emerald-400" />
                      <SelectValue placeholder="Category" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-slate-200">
                    <SelectItem value="All">All Categories</SelectItem>
                    {CATEGORY_OPTIONS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project List */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-white/5">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
              <FaListUl size={24} />
            </div>
            <p className="text-slate-400 font-medium">
              No projects found matching your criteria.
            </p>
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery("");
                setFilterCategory("All");
              }}
              className="mt-2 text-emerald-400"
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="popLayout">
              {loading
                ? /* Skeleton Loader List */
                  Array.from({ length: 3 }).map((_, i) => (
                    <motion.div
                      key={`skeleton-${i}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card className="rounded-3xl border border-white/5 bg-slate-900/20 backdrop-blur-sm overflow-hidden">
                        <CardContent className="p-4 md:p-6 flex flex-col md:flex-row items-center gap-6">
                          <div className="w-full md:w-32 h-32 rounded-2xl bg-slate-800/30 animate-pulse shrink-0" />
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="h-6 w-1/3 bg-slate-800/40 rounded-lg animate-pulse" />
                              <div className="h-5 w-16 bg-slate-800/20 rounded-full animate-pulse" />
                            </div>
                            <div className="h-4 w-full bg-slate-800/10 rounded animate-pulse" />
                            <div className="flex gap-2 pt-2">
                              <div className="h-5 w-12 bg-slate-800/20 rounded-lg animate-pulse" />
                              <div className="h-5 w-12 bg-slate-800/20 rounded-lg animate-pulse" />
                              <div className="h-5 w-12 bg-slate-800/20 rounded-lg animate-pulse" />
                            </div>
                          </div>
                          <div className="flex gap-2 shrink-0 md:pl-6 md:border-l md:border-white/5">
                            <div className="w-10 h-10 bg-slate-800/30 rounded-xl animate-pulse" />
                            <div className="w-10 h-10 bg-slate-800/30 rounded-xl animate-pulse" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                : filteredProjects.map((p, idx) => (
                    <motion.div
                      key={p._id || idx}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Card className="rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:border-emerald-500/30 transition-all group overflow-hidden">
                        <CardContent className="p-4 md:p-6 flex flex-col md:flex-row items-center gap-6">
                          {/* Image Preview */}
                          <div className="w-full md:w-32 h-32 rounded-2xl bg-slate-950/50 overflow-hidden shrink-0 border border-white/5 relative group/img">
                            <Image
                              src={p.image || "/images/placeholder.png"}
                              alt={p.title}
                              fill
                              className="object-cover transition-transform group-hover/img:scale-110"
                              onError={(e) => {
                                (e.target as any).src =
                                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Crect width='128' height='128' fill='%231e293b'/%3E%3C/svg%3E";
                              }}
                              unoptimized
                            />
                            {p.featured && (
                              <div className="absolute top-2 left-2 p-1.5 bg-amber-500 text-white rounded-lg shadow-lg">
                                <FaStar size={10} />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                              <h3 className="text-xl font-bold text-white truncate">
                                {p.title}
                              </h3>
                              <div className="flex justify-center md:justify-start gap-2">
                                <Badge
                                  variant="outline"
                                  className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                >
                                  {p.category}
                                </Badge>
                                {p.order !== undefined && (
                                  <Badge
                                    variant="outline"
                                    className="bg-blue-500/10 text-blue-400 border-blue-500/20"
                                  >
                                    Order: {p.order}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                              {p.description}
                            </p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-2">
                              {p.techNames.map((t) => (
                                <span
                                  key={t}
                                  className="px-2 py-1 bg-slate-950/50 text-slate-500 border border-white/5 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 md:pl-6 md:border-l md:border-white/10 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEdit(p)}
                              className="w-10 h-10 rounded-xl bg-slate-950/30 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                            >
                              <FaEdit size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(p._id!)}
                              className="w-10 h-10 rounded-xl bg-slate-950/30 text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                            >
                              <FaTrash size={16} />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeForm}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden"
            >
              <Card className="rounded-[2.5rem] border border-white/10 bg-slate-900 shadow-2xl flex flex-col h-full overflow-hidden">
                <CardHeader className="p-8 border-b border-white/5 shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl">
                        <FaEdit size={24} />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-white">
                          {editing ? "Edit Project" : "New Project"}
                        </CardTitle>
                        <CardDescription>
                          Fill in the details for your project showcase.
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={closeForm}
                      className="rounded-full text-slate-500"
                    >
                      <FaTimes size={20} />
                    </Button>
                  </div>
                </CardHeader>

                <div className="p-8 overflow-y-auto space-y-8 custom-scrollbar">
                  {/* Basic Info */}
                  <section className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{" "}
                      Basics
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400 ml-1">
                          Title
                        </label>
                        <Input
                          className="bg-slate-950/50 border-white/10 text-white rounded-xl focus-visible:ring-emerald-500/50"
                          value={form.title}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              title: e.target.value,
                              slug: slugify(e.target.value),
                            }))
                          }
                          placeholder="Modern Portfolio Website"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400 ml-1">
                          Slug
                        </label>
                        <Input
                          className="bg-slate-950/50 border-white/10 text-white rounded-xl focus-visible:ring-emerald-500/50"
                          value={form.slug}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, slug: e.target.value }))
                          }
                          placeholder="modern-portfolio"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400 ml-1">
                        Description
                      </label>
                      <Textarea
                        className="bg-slate-950/50 border-white/10 text-white rounded-xl min-h-[100px] resize-none focus-visible:ring-emerald-500/50"
                        value={form.description}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            description: e.target.value,
                          }))
                        }
                        placeholder="A detailed description of the project, goals, and results..."
                      />
                    </div>
                  </section>

                  {/* Media & Links */}
                  <section className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />{" "}
                      Media & Links
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                      <div className="space-y-4">
                        <ImageUpload
                          label="Project Image"
                          value={form.image}
                          onChange={(url) =>
                            setForm((f) => ({ ...f, image: url }))
                          }
                        />
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-400 ml-1">
                            GitHub URL
                          </label>
                          <div className="relative">
                            <FaGithub className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                            <Input
                              className="pl-10 bg-slate-950/50 border-white/10 text-white rounded-xl focus-visible:ring-emerald-500/50"
                              value={form.github}
                              onChange={(e) =>
                                setForm((f) => ({
                                  ...f,
                                  github: e.target.value,
                                }))
                              }
                              placeholder="https://github.com/..."
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-400 ml-1">
                            Live Demo URL
                          </label>
                          <div className="relative">
                            <FaExternalLinkAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                            <Input
                              className="pl-10 bg-slate-950/50 border-white/10 text-white rounded-xl focus-visible:ring-emerald-500/50"
                              value={form.live}
                              onChange={(e) =>
                                setForm((f) => ({ ...f, live: e.target.value }))
                              }
                              placeholder="https://project-demo.com"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Attributes */}
                  <section className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />{" "}
                      Attributes
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400 ml-1">
                          Category
                        </label>
                        <Select
                          value={form.category}
                          onValueChange={(val) =>
                            val && setForm((f) => ({ ...f, category: val }))
                          }
                        >
                          <SelectTrigger className="bg-slate-950/50 border-white/10 text-slate-200 rounded-xl">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-white/10 text-slate-200">
                            {CATEGORY_OPTIONS.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400 ml-1">
                          Display Order
                        </label>
                        <Input
                          type="number"
                          className="bg-slate-950/50 border-white/10 text-white rounded-xl focus-visible:ring-emerald-500/50"
                          value={form.order ?? 0}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, order: +e.target.value }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400 ml-1">
                          Feature Project
                        </label>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            setForm((f) => ({ ...f, featured: !f.featured }))
                          }
                          className={cn(
                            "w-full rounded-xl border transition-all h-10",
                            form.featured
                              ? "bg-amber-500/20 border-amber-500/50 text-amber-400 hover:bg-amber-500/30"
                              : "bg-slate-950/50 border-white/10 text-slate-500 hover:bg-slate-900",
                          )}
                        >
                          {form.featured ? (
                            <FaStar className="mr-2" />
                          ) : (
                            <FaRegStar className="mr-2" />
                          )}
                          {form.featured ? "Featured" : "Regular"}
                        </Button>
                      </div>
                    </div>
                  </section>

                  {/* Tech Stack */}
                  <section className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />{" "}
                      Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2 p-4 bg-slate-950/30 rounded-2xl border border-white/5">
                      {TECH_OPTIONS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => toggleTech(t)}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-xs font-bold transition-all border",
                            form.techNames.includes(t)
                              ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20"
                              : "bg-slate-950/50 border-white/5 text-slate-500 hover:border-white/20",
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* Improvements */}
                  <section className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />{" "}
                      Key Points & Features
                    </h4>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          className="bg-slate-950/50 border-white/10 text-white rounded-xl focus-visible:ring-pink-500/50"
                          value={improvementInput}
                          onChange={(e) => setImprovementInput(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), addImprovement())
                          }
                          placeholder="Implemented dark mode with system preference..."
                        />
                        <Button
                          onClick={addImprovement}
                          className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl h-10 w-10 p-0"
                        >
                          <FaPlus />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        <AnimatePresence>
                          {form.improvements.map((imp, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="flex items-center gap-3 bg-slate-950/40 border border-white/5 rounded-xl p-3 group"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-pink-500 transition-colors" />
                              <span className="text-sm text-slate-300 flex-1">
                                {imp}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeImprovement(i)}
                                className="h-7 w-7 text-slate-600 hover:text-red-400"
                              >
                                <FaTimes size={12} />
                              </Button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  </section>
                </div>

                <CardHeader className="p-8 border-t border-white/5 shrink-0 bg-slate-900/50">
                  <div className="flex justify-end gap-4">
                    <Button
                      variant="ghost"
                      onClick={closeForm}
                      className="text-slate-400 hover:text-white rounded-xl px-6 h-12"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold px-10 h-12 shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
                    >
                      <FaSave
                        className={cn("mr-2", saving && "animate-spin")}
                      />
                      {saving
                        ? "Saving..."
                        : editing
                          ? "Update Project"
                          : "Create Project"}
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
