"use client";

import { useState, useEffect } from "react";
import type { Experience } from "@/types";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheck,
  FaBriefcase,
  FaGraduationCap,
  FaAward,
  FaSave,
  FaListUl,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const EMPTY: Omit<Experience, "_id"> = {
  title: "",
  org: "",
  duration: "",
  details: [],
  color: "emerald",
  type: "work",
  order: 0,
};

const TYPE_ICONS = {
  work: FaBriefcase,
  education: FaGraduationCap,
  certification: FaAward,
};

const COLOR_MAP = {
  emerald: {
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    hover: "hover:border-emerald-500/40",
    icon: "bg-emerald-500/20 text-emerald-400",
  },
  blue: {
    text: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    hover: "hover:border-blue-500/40",
    icon: "bg-blue-500/20 text-blue-400",
  },
  amber: {
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    hover: "hover:border-amber-500/40",
    icon: "bg-amber-500/20 text-amber-400",
  },
};

export default function AdminExperiencePage() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState<Omit<Experience, "_id">>(EMPTY);
  const [detailInput, setDetailInput] = useState("");
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const [saving, setSaving] = useState(false);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function load() {
    try {
      const res = await fetch("/api/admin/experience");
      const data = await res.json();
      setItems(
        data.sort(
          (a: Experience, b: Experience) => (a.order || 0) - (b.order || 0),
        ),
      );
    } catch (error) {
      showToast("Failed to load experience data", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY);
    setDetailInput("");
    setShowForm(true);
  }

  function openEdit(e: Experience) {
    setEditing(e);
    setForm({ ...e });
    setDetailInput("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY);
  }

  async function handleSave() {
    if (!form.title || !form.org)
      return showToast("Title and Organization are required", "error");

    setSaving(true);
    const url = editing
      ? `/api/admin/experience/${editing._id}`
      : "/api/admin/experience";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);

    if (res.ok) {
      showToast(
        editing ? "Entry updated successfully!" : "Entry created successfully!",
      );
      closeForm();
      load();
    } else {
      showToast("Failed to save entry.", "error");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    await fetch(`/api/admin/experience/${id}`, { method: "DELETE" });
    showToast("Entry deleted.");
    load();
  }

  function addDetail() {
    if (!detailInput.trim()) return;
    setForm((f) => ({ ...f, details: [...f.details, detailInput.trim()] }));
    setDetailInput("");
  }

  function removeDetail(i: number) {
    setForm((f) => ({
      ...f,
      details: f.details.filter((_, idx) => idx !== i),
    }));
  }

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

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
              Experience & Education
            </h1>
            <p className="text-slate-400">
              Manage your professional journey and academic background.
            </p>
          </div>
          <Button
            onClick={openAdd}
            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold px-6 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
          >
            <FaPlus className="mr-2" /> Add Entry
          </Button>
        </header>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {loading ? (
              /* Skeleton List */
              Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="rounded-3xl border border-white/5 bg-slate-900/20 backdrop-blur-sm overflow-hidden animate-pulse">
                    <CardContent className="p-6 flex flex-col md:flex-row items-start gap-6">
                      <div className="p-4 rounded-2xl border bg-slate-800/40 w-12 h-12 shrink-0 border-white/5" />
                      <div className="flex-1 space-y-4 w-full">
                        <div className="h-6 w-1/3 bg-slate-800 rounded-lg" />
                        <div className="h-4 w-1/4 bg-slate-800/50 rounded" />
                        <div className="space-y-2 pt-2">
                          <div className="h-3 w-full bg-slate-800/20 rounded" />
                          <div className="h-3 w-5/6 bg-slate-800/20 rounded" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : items.length === 0 ? (
              <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-white/5">
                <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                  <FaListUl size={24} />
                </div>
                <p className="text-slate-400 font-medium">
                  No experience entries found. Add your first one!
                </p>
              </div>
            ) : (
              items.map((item, idx) => {
                const Icon = TYPE_ICONS[item.type] || FaBriefcase;
                const colors = COLOR_MAP[item.color] || COLOR_MAP.emerald;

                return (
                  <motion.div
                    key={item._id || idx}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card
                      className={cn(
                        "rounded-3xl border bg-slate-900/40 backdrop-blur-xl transition-all group overflow-hidden",
                        colors.border,
                        colors.hover,
                      )}
                    >
                      <CardContent className="p-6 flex flex-col md:flex-row items-start gap-6">
                        {/* Icon */}
                        <div
                          className={cn(
                            "p-4 rounded-2xl border shrink-0 transition-transform group-hover:scale-110",
                            colors.icon,
                            colors.border,
                          )}
                        >
                          <Icon size={24} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                            <div>
                              <h3 className="text-xl font-bold text-white">
                                {item.title}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span
                                  className={cn(
                                    "font-semibold text-sm",
                                    colors.text,
                                  )}
                                >
                                  {item.org}
                                </span>
                                <span className="text-slate-700">•</span>
                                <span className="text-slate-500 text-xs font-medium">
                                  {item.duration}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "capitalize px-3 py-1 rounded-lg border",
                                  colors.bg,
                                  colors.text,
                                  colors.border,
                                )}
                              >
                                {item.type}
                              </Badge>
                              {item.order !== undefined && (
                                <Badge
                                  variant="outline"
                                  className="bg-slate-950/50 text-slate-500 border-white/5"
                                >
                                  #{item.order}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <ul className="space-y-2 mt-4">
                            {item.details.map((d, i) => (
                              <li
                                key={i}
                                className="text-slate-400 text-sm flex gap-3 items-start leading-relaxed"
                              >
                                <div
                                  className={cn(
                                    "w-1.5 h-1.5 rounded-full mt-2 shrink-0",
                                    colors.text,
                                    colors.bg,
                                  )}
                                />
                                {d}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-row md:flex-col items-center gap-2 md:pl-6 md:border-l md:border-white/10 shrink-0 w-full md:w-auto justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(item)}
                            className="w-10 h-10 rounded-xl bg-slate-950/30 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                          >
                            <FaEdit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item._id!)}
                            className="w-10 h-10 rounded-xl bg-slate-950/30 text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                          >
                            <FaTrash size={16} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
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
              className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
              <Card className="rounded-[2.5rem] border border-white/10 bg-slate-900 shadow-2xl flex flex-col h-full overflow-hidden">
                <CardHeader className="p-8 border-b border-white/5 shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500/20 text-blue-400 rounded-2xl">
                        <FaEdit size={24} />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-white">
                          {editing ? "Edit Entry" : "New Entry"}
                        </CardTitle>
                        <CardDescription>
                          Update your professional or academic details.
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
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400 ml-1">
                          Title
                        </label>
                        <Input
                          className="bg-slate-950/50 border-white/10 text-white rounded-xl focus-visible:ring-emerald-500/50"
                          value={form.title}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, title: e.target.value }))
                          }
                          placeholder="Senior Software Engineer / Bachelor of Science"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-400 ml-1">
                            Organization
                          </label>
                          <Input
                            className="bg-slate-950/50 border-white/10 text-white rounded-xl focus-visible:ring-emerald-500/50"
                            value={form.org}
                            onChange={(e) =>
                              setForm((f) => ({ ...f, org: e.target.value }))
                            }
                            placeholder="Tech Solutions Inc. / MIT"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-400 ml-1">
                            Duration
                          </label>
                          <Input
                            className="bg-slate-950/50 border-white/10 text-white rounded-xl focus-visible:ring-emerald-500/50"
                            value={form.duration}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                duration: e.target.value,
                              }))
                            }
                            placeholder="Jan 2022 - Present"
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Classification */}
                  <section className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />{" "}
                      Classification
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400 ml-1">
                          Type
                        </label>
                        <Select
                          value={form.type}
                          onValueChange={(val) =>
                            val &&
                            setForm((f) => ({
                              ...f,
                              type: val as Experience["type"],
                            }))
                          }
                        >
                          <SelectTrigger className="bg-slate-950/50 border-white/10 text-slate-200 rounded-xl">
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-white/10 text-slate-200">
                            <SelectItem value="work">Work</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="certification">
                              Certification
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400 ml-1">
                          Color Theme
                        </label>
                        <Select
                          value={form.color}
                          onValueChange={(val) =>
                            val &&
                            setForm((f) => ({
                              ...f,
                              color: val as Experience["color"],
                            }))
                          }
                        >
                          <SelectTrigger className="bg-slate-950/50 border-white/10 text-slate-200 rounded-xl">
                            <SelectValue placeholder="Select Color" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-white/10 text-slate-200">
                            <SelectItem value="emerald">Emerald</SelectItem>
                            <SelectItem value="blue">Blue</SelectItem>
                            <SelectItem value="amber">Amber</SelectItem>
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
                    </div>
                  </section>

                  {/* Details */}
                  <section className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />{" "}
                      Details & Achievements
                    </h4>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          className="bg-slate-950/50 border-white/10 text-white rounded-xl focus-visible:ring-pink-500/50"
                          value={detailInput}
                          onChange={(e) => setDetailInput(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), addDetail())
                          }
                          placeholder="Led a team of 5 developers to deliver..."
                        />
                        <Button
                          onClick={addDetail}
                          className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl h-10 w-10 p-0"
                        >
                          <FaPlus />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        <AnimatePresence>
                          {form.details.map((d, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="flex items-center gap-3 bg-slate-950/40 border border-white/5 rounded-xl p-3 group"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-blue-500 transition-colors" />
                              <span className="text-sm text-slate-300 flex-1 leading-relaxed">
                                {d}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeDetail(i)}
                                className="h-7 w-7 text-slate-600 hover:text-red-400"
                              >
                                <FaTimes size={12} />
                              </Button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        {form.details.length === 0 && (
                          <p className="text-center py-4 text-slate-600 text-xs italic">
                            No details added yet.
                          </p>
                        )}
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
                          ? "Update Entry"
                          : "Create Entry"}
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
