"use client";
import { useState, useEffect } from "react";
import {
  FaPlus,
  FaTimes,
  FaCheck,
  FaSave,
  FaProjectDiagram,
  FaLayerGroup,
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
import { cn } from "@/lib/utils";

interface WorkflowStep {
  title: string;
  description: string;
  icon: string;
  order: number;
}

export default function AdminWorkflowPage() {
  const [data, setData] = useState<WorkflowStep[]>([]);
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
    fetch("/api/admin/workflow")
      .then((r) => r.json())
      .then((d) => {
        setData(Array.isArray(d) ? d : []);
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/admin/workflow", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    if (res.ok) showToast("Workflow saved!");
    else showToast("Failed to save.", "error");
  }

  function addStep() {
    setData((prev) => [
      ...prev,
      {
        title: "New Step",
        description: "",
        icon: "FaSearch",
        order: prev.length,
      },
    ]);
  }

  function updateStep(i: number, field: keyof WorkflowStep, val: string) {
    setData((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: val };
      return next;
    });
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
              Workflow & Methodology
            </h1>
            <p className="text-slate-400">
              Showcase your development process (The &quot;How&quot;).
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold px-8 shadow-lg shadow-emerald-600/20"
          >
            <FaSave className={cn("mr-2", saving && "animate-spin")} />
            {saving ? "Saving..." : "Save Workflow"}
          </Button>
        </header>

        <Card className="rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-white">
                Process Steps
              </CardTitle>
              <Button
                variant="outline"
                onClick={addStep}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-white/5 rounded-xl"
              >
                <FaPlus size={12} className="mr-2" /> Add Step
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
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
                      <div className="p-6 bg-slate-950/20 rounded-2xl border border-white/5 space-y-6 animate-pulse mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="h-10 bg-slate-800/40 rounded-xl w-full" />
                          <div className="h-10 bg-slate-800/40 rounded-xl w-full" />
                        </div>
                        <div className="h-20 bg-slate-800/20 rounded-xl w-full" />
                      </div>
                    </motion.div>
                  ))
                : data.map((item, i) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={i}
                      className="p-6 bg-slate-950/40 rounded-2xl border border-white/5 relative group mb-4"
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
                            Step Title
                          </label>
                          <Input
                            className="bg-slate-900/50 border-white/10 text-white rounded-xl"
                            value={item.title}
                            onChange={(e) =>
                              updateStep(i, "title", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                            Icon Name
                          </label>
                          <Input
                            className="bg-slate-900/50 border-white/10 text-white rounded-xl"
                            value={item.icon}
                            onChange={(e) =>
                              updateStep(i, "icon", e.target.value)
                            }
                            placeholder="FaCode, FaSearch..."
                          />
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
                            updateStep(i, "description", e.target.value)
                          }
                        />
                      </div>
                    </motion.div>
                  ))}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
