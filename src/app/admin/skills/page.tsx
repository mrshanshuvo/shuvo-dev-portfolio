"use client";
import { useState, useEffect } from "react";
import type { Skill } from "@/types";
import {
  FaPlus,
  FaTimes,
  FaCheck,
  FaSave,
  FaCode,
  FaDatabase,
  FaCloud,
  FaRobot,
} from "react-icons/fa";
import { SiReact, SiNodedotjs, SiTensorflow } from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";

const ICON_OPTIONS = [
  "SiReact",
  "SiNodedotjs",
  "FaDatabase",
  "FaCloud",
  "SiTensorflow",
  "FaRobot",
];

const iconMap: Record<string, any> = {
  SiReact: SiReact,
  SiNodedotjs: SiNodedotjs,
  FaDatabase: FaDatabase,
  FaCloud: FaCloud,
  SiTensorflow: SiTensorflow,
  FaRobot: FaRobot,
};

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [techList, setTechList] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
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
    fetch("/api/admin/skills")
      .then((r) => r.json())
      .then((d) => {
        setSkills(Array.isArray(d.skills) ? d.skills : []);
        setTechList(Array.isArray(d.techList) ? d.techList : []);
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/admin/skills", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skills, techList }),
    });
    setSaving(false);
    if (res.ok) showToast("Skills saved!");
    else showToast("Failed to save.", "error");
  }

  function addSkill() {
    setSkills((prev) => [
      ...prev,
      { name: "New Skill", tech: "", level: 80, iconName: "SiReact" },
    ]);
  }

  function updateSkill(i: number, field: keyof Skill, val: string | number) {
    setSkills((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: val };
      return next;
    });
  }

  function addTech() {
    if (!techInput.trim()) return;
    setTechList((prev) => [...prev, techInput.trim()]);
    setTechInput("");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 space-y-6">
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

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Action bar — title is already shown in the AdminTopbar breadcrumb */}
        <div className="flex items-center justify-end gap-4">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold px-8 h-10 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all group text-xs"
          >
            <FaSave
              className={cn(
                "mr-2 transition-transform duration-500",
                saving ? "animate-spin" : "group-hover:rotate-12",
              )}
            />
            {saving ? "Saving..." : "Save Skills"}
          </Button>
        </div>

        <Card className="rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-white">
                Expertise
              </CardTitle>
              <Button
                variant="outline"
                onClick={addSkill}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-white/5 rounded-xl"
              >
                <FaPlus size={12} className="mr-2" /> Add Skill
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <AnimatePresence mode="popLayout">
              {loading
                ? /* Skeleton Loader List */
                  Array.from({ length: 4 }).map((_, i) => (
                    <motion.div
                      key={`skeleton-${i}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="p-5 bg-slate-950/20 rounded-2xl border border-white/5 space-y-4 animate-pulse">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="h-10 bg-slate-800/40 rounded-xl" />
                          <div className="h-10 bg-slate-800/40 rounded-xl" />
                        </div>
                        <div className="h-4 bg-slate-800/20 rounded-full w-full" />
                      </div>
                    </motion.div>
                  ))
                : skills.map((skill, i) => {
                    const Icon = iconMap[skill.iconName] || FaCode;
                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={i}
                        className="p-5 bg-slate-950/40 rounded-2xl border border-white/5 space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                              Category
                            </label>
                            <Input
                              className="bg-slate-900/50 border-white/10 text-white rounded-xl"
                              value={skill.name}
                              onChange={(e) =>
                                updateSkill(i, "name", e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                              Icon & Tech
                            </label>
                            <div className="flex gap-2">
                              <Select
                                value={skill.iconName}
                                onValueChange={(val) =>
                                  val && updateSkill(i, "iconName", val)
                                }
                              >
                                <SelectTrigger className="w-[120px] bg-slate-900/50 border-white/10 text-white rounded-xl">
                                  <Icon size={16} className="text-purple-400" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-white/10 text-white">
                                  {ICON_OPTIONS.map((ic) => (
                                    <SelectItem key={ic} value={ic}>
                                      {ic}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Input
                                className="bg-slate-900/50 border-white/10 text-white rounded-xl flex-1"
                                value={skill.tech}
                                onChange={(e) =>
                                  updateSkill(i, "tech", e.target.value)
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                              Proficiency
                            </label>
                            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                              {skill.level}%
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4">
                            <Slider
                              value={[skill.level]}
                              onValueChange={(vals) =>
                                updateSkill(
                                  i,
                                  "level",
                                  Array.isArray(vals) ? vals[0] : vals,
                                )
                              }
                              max={100}
                              step={1}
                              className="flex-1"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setSkills((prev) =>
                                  prev.filter((_, idx) => idx !== i),
                                )
                              }
                              className="text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl"
                            >
                              <FaTimes size={16} />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
            </AnimatePresence>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden mt-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl">
                <FaCode size={20} />
              </div>
              <div>
                <CardTitle className="text-white">Tech Stack List</CardTitle>
                <CardDescription>
                  Technologies displayed in the scrolling banner.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {techList.map((t, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="pl-3 pr-1 py-1 gap-1 bg-slate-950/50 text-slate-300 border-white/5 rounded-lg"
                >
                  {t}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setTechList((prev) => prev.filter((_, idx) => idx !== i))
                    }
                    className="h-5 w-5 rounded-full hover:bg-red-500/20 hover:text-red-400"
                  >
                    <FaTimes size={10} />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                className="bg-slate-950/50 border-white/10 text-white rounded-xl focus-visible:ring-blue-500/50"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTech())
                }
                placeholder="Add technology (e.g. Docker)..."
              />
              <Button
                onClick={addTech}
                size="icon"
                className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl shrink-0"
              >
                <FaPlus size={14} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
