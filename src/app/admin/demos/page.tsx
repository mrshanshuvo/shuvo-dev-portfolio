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
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Demo {
  title: string;
  description: string;
  url: string;
  tech: string[];
}

export default function AdminDemosPage() {
  const [data, setData] = useState<Demo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [techInput, setTechInput] = useState<Record<number, string>>({});
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
    if (res.ok) showToast("Demos saved!");
    else showToast("Failed to save.", "error");
  }

  function addDemo() {
    setData((prev) => [
      ...prev,
      { title: "New Demo", description: "", url: "", tech: [] },
    ]);
  }

  function updateDemo(i: number, field: keyof Demo, val: any) {
    setData((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: val };
      return next;
    });
  }

  function addTech(i: number) {
    const tech = techInput[i]?.trim();
    if (!tech) return;
    const currentTech = data[i].tech;
    if (currentTech.includes(tech)) return;
    updateDemo(i, "tech", [...currentTech, tech]);
    setTechInput(prev => ({ ...prev, [i]: "" }));
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
              Interactive Playground
            </h1>
            <p className="text-slate-400">
              Manage your live demos and experimental projects.
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold px-8 shadow-lg shadow-purple-600/20"
          >
            <FaSave className={cn("mr-2", saving && "animate-spin")} />
            {saving ? "Saving..." : "Save Demos"}
          </Button>
        </header>

        <Card className="rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-white">
                Active Demos
              </CardTitle>
              <Button
                variant="outline"
                onClick={addDemo}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-white/5 rounded-xl"
              >
                <FaPlus size={12} className="mr-2" /> Add Demo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <AnimatePresence mode="popLayout">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <motion.div
                    key={`skeleton-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="p-6 bg-slate-950/20 rounded-2xl border border-white/5 space-y-6 animate-pulse mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="h-10 bg-slate-800/40 rounded-xl w-full" />
                        <div className="h-10 bg-slate-800/40 rounded-xl w-full" />
                      </div>
                      <div className="h-20 bg-slate-800/20 rounded-xl w-full" />
                      <div className="h-24 bg-slate-800/30 rounded-xl w-full" />
                    </div>
                  </motion.div>
                ))
              ) : (
                data.map((item, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={i}
                    className="p-6 bg-slate-950/40 rounded-2xl border border-white/5 relative group space-y-4 mb-4"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setData((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      className="absolute top-4 right-4 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl"
                    >
                      <FaTimes size={14} />
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                          Demo Title
                        </label>
                        <div className="relative">
                          <FaFlask className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                          <Input
                            className="bg-slate-900/50 border-white/10 text-white rounded-xl pl-10"
                            value={item.title}
                            onChange={(e) =>
                              updateDemo(i, "title", e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                          Demo URL
                        </label>
                        <div className="relative">
                          <FaLink className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                          <Input
                            className="bg-slate-900/50 border-white/10 text-white rounded-xl pl-10"
                            value={item.url}
                            onChange={(e) =>
                              updateDemo(i, "url", e.target.value)
                            }
                            placeholder="https://playground.shuvo.com/..."
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                        Tech Stack
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <FaCode className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                          <Input
                            className="bg-slate-900/50 border-white/10 text-white rounded-xl pl-10"
                            value={techInput[i] || ""}
                            onChange={(e) =>
                              setTechInput((prev) => ({
                                ...prev,
                                [i]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) =>
                              e.key === "Enter" &&
                              (e.preventDefault(), addTech(i))
                            }
                            placeholder="Add tech (e.g. TensorFlow)..."
                          />
                        </div>
                        <Button
                          onClick={() => addTech(i)}
                          variant="outline"
                          className="rounded-xl border-white/10"
                        >
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.tech.map((t, tIdx) => (
                          <Badge
                            key={tIdx}
                            variant="secondary"
                            className="bg-white/5 text-slate-300 border-white/10 gap-2 pl-3"
                          >
                            {t}
                            <button
                              onClick={() =>
                                updateDemo(
                                  i,
                                  "tech",
                                  item.tech.filter((_, idx) => idx !== tIdx),
                                )
                              }
                              className="hover:text-red-400"
                            >
                              <FaTimes size={10} />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                        Description
                      </label>
                      <Textarea
                        className="bg-slate-900/50 border-white/10 text-white rounded-xl min-h-[80px]"
                        value={item.description}
                        onChange={(e) =>
                          updateDemo(i, "description", e.target.value)
                        }
                      />
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
