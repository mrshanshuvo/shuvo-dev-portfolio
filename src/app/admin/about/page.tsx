"use client";
import { useState, useEffect } from "react";
import type { About, Skill, Stat, Education } from "@/types";
import {
  FaPlus,
  FaTimes,
  FaCheck,
  FaSave,
  FaUser,
  FaChartBar,
  FaGraduationCap,
  FaCode,
  FaLayerGroup,
  FaLightbulb,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const ICON_OPTIONS = [
  "SiReact",
  "SiNodedotjs",
  "FaDatabase",
  "FaCloud",
  "SiTensorflow",
  "FaRobot",
];

const DEFAULT: About = {
  title: "Hello! I'm Shuvo",
  bio1: "",
  bio2: "",
  highlights: [],
  stats: [],
  skills: [],
  education: [],
};

export default function AdminAboutPage() {
  const [data, setData] = useState<About>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  // Temp input states
  const [highlightInput, setHighlightInput] = useState("");
  const [techInput, setTechInput] = useState("");

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    fetch("/api/admin/about")
      .then((r) => r.json())
      .then((d) => {
        setData({ ...DEFAULT, ...d });
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/admin/about", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    if (res.ok) showToast("About section saved!");
    else showToast("Failed to save.", "error");
  }

  function addHighlight() {
    if (!highlightInput.trim()) return;
    setData((d) => ({
      ...d,
      highlights: [...d.highlights, highlightInput.trim()],
    }));
    setHighlightInput("");
  }



  function addStat() {
    setData((d) => ({
      ...d,
      stats: [...d.stats, { number: "0", label: "New Stat" }],
    }));
  }

  function updateStat(i: number, field: keyof Stat, val: string) {
    setData((d) => {
      const stats = [...d.stats];
      stats[i] = { ...stats[i], [field]: val };
      return { ...d, stats };
    });
  }

  function addSkill() {
    setData((d) => ({
      ...d,
      skills: [
        ...d.skills,
        { name: "New Skill", tech: "", level: 80, iconName: "FaDatabase" },
      ],
    }));
  }

  function updateSkill(i: number, field: keyof Skill, val: string | number) {
    setData((d) => {
      const skills = [...d.skills];
      skills[i] = { ...skills[i], [field]: val };
      return { ...d, skills };
    });
  }

  function addEducation() {
    setData((d) => ({
      ...d,
      education: [
        ...d.education,
        {
          degree: "New Degree",
          institution: "University",
          period: "2020-2024",
          details: [],
        },
      ],
    }));
  }

  function updateEducation(i: number, field: keyof Education, val: any) {
    setData((d) => {
      const edu = [...d.education];
      edu[i] = { ...edu[i], [field]: val };
      return { ...d, education: edu };
    });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
      {/* Toast Notification */}
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
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
              About Section
            </h1>
            <p className="text-slate-400">
              Manage your skills, biography, and professional milestones.
            </p>
          </div>
          <Button
            id="save-about-btn"
            onClick={handleSave}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold px-8 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all group"
          >
            <FaSave
              className={cn(
                "mr-2 transition-transform duration-500",
                saving ? "animate-spin" : "group-hover:rotate-12",
              )}
            />
            {saving ? "Saving Changes..." : "Save Changes"}
          </Button>
        </header>

        <div className="space-y-8">
          {loading ? (
            /* Skeleton State */
            Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="rounded-3xl border border-white/5 bg-slate-900/20 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-slate-800/40 rounded-xl w-10 h-10 animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-5 w-32 bg-slate-800/60 rounded-lg animate-pulse" />
                        <div className="h-3 w-48 bg-slate-800/30 rounded-lg animate-pulse" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="h-24 bg-slate-800/20 rounded-2xl animate-pulse" />
                    <div className="h-24 bg-slate-800/20 rounded-2xl animate-pulse" />
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="space-y-8 animate-in fade-in duration-700">
              <Card className="rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl">
                      <FaUser size={20} />
                    </div>
                    <div>
                      <CardTitle className="text-white">
                        Professional Bio
                      </CardTitle>
                      <CardDescription>
                        Two paragraphs that tell your story.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                      Section Title
                    </label>
                    <Input
                      className="bg-slate-950/50 border-white/10 text-white rounded-2xl focus-visible:ring-blue-500/50"
                      value={data.title}
                      onChange={(e) =>
                        setData((d) => ({ ...d, title: e.target.value }))
                      }
                      placeholder="e.g. Hello! I'm Shuvo"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                      Paragraph 1
                    </label>
                    <Textarea
                      className="bg-slate-950/50 border-white/10 text-white rounded-2xl min-h-[120px] focus-visible:ring-blue-500/50"
                      value={data.bio1}
                      onChange={(e) =>
                        setData((d) => ({ ...d, bio1: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                      Paragraph 2
                    </label>
                    <Textarea
                      className="bg-slate-950/50 border-white/10 text-white rounded-2xl min-h-[120px] focus-visible:ring-blue-500/50"
                      value={data.bio2}
                      onChange={(e) =>
                        setData((d) => ({ ...d, bio2: e.target.value }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-pink-500/20 text-pink-400 rounded-xl">
                      <FaLightbulb size={20} />
                    </div>
                    <div>
                      <CardTitle className="text-white">
                        Key Highlights
                      </CardTitle>
                      <CardDescription>
                        Short bullet points of what you bring to the table.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                      {data.highlights.map((h, i) => (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          key={i}
                        >
                          <Badge
                            variant="secondary"
                            className="pl-3 pr-1 py-1 gap-1 bg-slate-800 text-slate-200 border-white/5 rounded-full"
                          >
                            {h}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setData((d) => ({
                                  ...d,
                                  highlights: d.highlights.filter(
                                    (_, idx) => idx !== i,
                                  ),
                                }))
                              }
                              className="h-5 w-5 rounded-full hover:bg-red-500/20 hover:text-red-400"
                            >
                              <FaTimes size={10} />
                            </Button>
                          </Badge>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      className="bg-slate-950/50 border-white/10 text-white rounded-xl focus-visible:ring-pink-500/50"
                      value={highlightInput}
                      onChange={(e) => setHighlightInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addHighlight())
                      }
                      placeholder="e.g. Expert in modern React..."
                    />
                    <Button
                      onClick={addHighlight}
                      size="icon"
                      className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl shrink-0"
                    >
                      <FaPlus size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
