"use client";
import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  FaPlus,
  FaTimes,
  FaCheck,
  FaSave,
  FaCode,
  FaGripVertical,
  FaEdit,
  FaTrash,
  FaLaptopCode,
  FaInfoCircle,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { AdminDialogShell } from "../components/AdminDialogShell";
import { AdminField, AdminInput } from "../components/AdminFields";

const ICON_OPTIONS = [
  "SiReact",
  "SiNodedotjs",
  "FaDatabase",
  "FaCloud",
  "SiTensorflow",
  "FaRobot",
  "FaCode",
];

const iconMap: Record<string, any> = {
  SiReact: SiReact,
  SiNodedotjs: SiNodedotjs,
  FaDatabase: FaCode,
  FaCloud: FaCode,
  SiTensorflow: SiTensorflow,
  FaRobot: FaCode,
  FaCode: FaCode,
};

const iconOptionsMap: Record<string, React.ReactNode> = {
  SiReact: <SiReact size={16} />,
  SiNodedotjs: <SiNodedotjs size={16} />,
  FaDatabase: <FaCode size={16} />,
  FaCloud: <FaCode size={16} />,
  SiTensorflow: <SiTensorflow size={16} />,
  FaRobot: <FaCode size={16} />,
  FaCode: <FaCode size={16} />,
};

interface Skill {
  _id?: string;
  name: string;
  tech: string;
  level: number;
  iconName: string;
}

function SortableSkillRow({
  skill,
  onEdit,
  onDelete,
  isDeleting,
}: {
  skill: Skill;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: skill._id! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const Icon = iconMap[skill.iconName] || FaCode;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-4 bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 rounded-2xl p-4 transition-all duration-300 shadow-sm dark:shadow-none",
        isDragging &&
          "z-50 border-purple-500/50 shadow-2xl shadow-purple-500/10",
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-purple-500 transition-colors"
      >
        <FaGripVertical size={14} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg">
            <Icon size={14} />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-white truncate text-sm">
              {skill.name}
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-widest font-medium">
              {skill.tech}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 min-w-[120px] justify-end">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
            {skill.level}%
          </span>
          <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full"
              style={{ width: `${skill.level}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-8 w-8 rounded-lg text-slate-400 hover:text-purple-400 hover:bg-purple-400/10"
          >
            <FaEdit size={12} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            disabled={isDeleting}
            className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10"
          >
            {isDeleting ? (
              <div className="h-3 w-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <FaTrash size={12} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [techList, setTechList] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Skill | null>(null);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    fetchSkills();
  }, []);

  async function fetchSkills() {
    setLoading(true);
    const r = await fetch("/api/admin/skills");
    const d = await r.json();
    setSkills(Array.isArray(d.skills) ? d.skills : []);
    setTechList(Array.isArray(d.techList) ? d.techList : []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this skill expertise?"))
      return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/skills?id=${id}`, {
      method: "DELETE",
    });
    setDeletingId(null);
    if (res.ok) {
      setSkills((prev) => prev.filter((s) => s._id !== id));
      showToast("Skill deleted.");
    } else {
      showToast("Failed to delete.", "error");
    }
  }

  async function handleAddOrUpdate() {
    if (!currentSkill?.name) return;
    setSaving(true);

    const isEdit = !!currentSkill._id;
    const url = isEdit
      ? `/api/admin/skills?id=${currentSkill._id}`
      : "/api/admin/skills";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentSkill),
    });

    setSaving(false);
    if (res.ok) {
      setIsDialogOpen(false);
      showToast(isEdit ? "Skill updated!" : "Skill added!");
      fetchSkills();
    } else {
      showToast("Failed to save.", "error");
    }
  }

  function openEdit(skill: Skill) {
    setCurrentSkill({ ...skill });
    setIsDialogOpen(true);
  }

  function openNew() {
    setCurrentSkill({
      name: "",
      tech: "",
      level: 80,
      iconName: "SiReact",
    });
    setIsDialogOpen(true);
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = skills.findIndex((i) => i._id === active.id);
      const newIndex = skills.findIndex((i) => i._id === over.id);
      const updatedSkills = arrayMove(skills, oldIndex, newIndex);
      setSkills(updatedSkills);
      // Auto save order using PATCH
      setTimeout(() => {
        fetch("/api/admin/skills", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedSkills),
        });
      }, 0);
    }
    setActiveId(null);
  }

  async function addTech() {
    if (!techInput.trim()) return;
    const newList = [...techList, techInput.trim()];
    setTechList(newList);
    setTechInput("");
    await fetch("/api/admin/skills?type=banner", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ techList: newList }),
    });
  }

  async function removeTech(idx: number) {
    const newList = techList.filter((_, i) => i !== idx);
    setTechList(newList);
    await fetch("/api/admin/skills?type=banner", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ techList: newList }),
    });
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
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
            <span className="font-bold text-sm tracking-tight">
              {toast.msg}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl p-4 shadow-sm dark:shadow-none">
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest text-[9px]"
            >
              {skills.length} Expertise Areas
            </Badge>
          </div>
          <Button
            onClick={openNew}
            className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold px-6 h-10 shadow-lg shadow-purple-600/20 active:scale-95 transition-all group text-xs"
          >
            <FaPlus className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Add Expertise
          </Button>
        </div>

        <Card className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-sm dark:shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
              Skill Expertise
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-slate-100 dark:bg-slate-800/20 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : skills.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-950/20 rounded-3xl border border-dashed border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                <FaLaptopCode
                  className="mx-auto text-slate-200 dark:text-slate-800 mb-4"
                  size={40}
                />
                <p className="text-slate-400 dark:text-slate-500 font-medium">
                  No skills found. Add your expertise above.
                </p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={(e) => setActiveId(e.active.id as string)}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={skills.map((s) => s._id!)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {skills.map((skill) => (
                        <SortableSkillRow
                          key={skill._id}
                          skill={skill}
                          onEdit={() => openEdit(skill)}
                          onDelete={() => handleDelete(skill._id!)}
                          isDeleting={deletingId === skill._id}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </SortableContext>

                <DragOverlay dropAnimation={null}>
                  {activeId ? (
                    <div className="flex items-center gap-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4 shadow-2xl opacity-90 scale-105">
                      <FaGripVertical className="text-purple-500" size={14} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-white truncate text-sm">
                          {skills.find((s) => s._id === activeId)?.name}
                        </h3>
                      </div>
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}

            {!loading && skills.length > 0 && (
              <p className="text-center text-[10px] text-slate-400 dark:text-slate-700 mt-8 font-bold uppercase tracking-widest">
                Drag rows to reorder • Changes save automatically
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-sm dark:shadow-none">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl">
                <FaCode size={20} />
              </div>
              <div>
                <CardTitle className="text-slate-900 dark:text-white">
                  Tech Stack List
                </CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-500">
                  Technologies displayed in the scrolling banner.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-slate-50 dark:bg-slate-950/20 rounded-2xl border border-slate-200 dark:border-white/5">
              {techList.map((t, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="pl-3 pr-1 py-1 gap-1 bg-white dark:bg-slate-950 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 rounded-lg group shadow-sm dark:shadow-none"
                >
                  {t}
                  <button
                    onClick={() => removeTech(i)}
                    className="h-5 w-5 rounded-full hover:bg-red-500/10 dark:hover:bg-red-500/20 hover:text-red-500 dark:hover:text-red-400 flex items-center justify-center transition-colors"
                  >
                    <FaTimes size={10} />
                  </button>
                </Badge>
              ))}
              {techList.length === 0 && (
                <p className="text-[10px] text-slate-700 uppercase tracking-widest font-bold m-auto">
                  List is empty
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Input
                className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-white/5 rounded-xl focus-visible:ring-purple-500/30 h-11 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTech()}
                placeholder="Add technology (e.g. Docker)..."
              />
              <Button
                onClick={addTech}
                className="bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl px-6 h-11 font-bold shrink-0 transition-all active:scale-95"
              >
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AdminDialogShell
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={currentSkill?._id ? "Refine Expertise" : "Forge New Skill"}
        subtitle="Define your expertise level and tech stack"
        icon={FaCode}
        iconColor="text-purple-400"
        accentColor="from-purple-500/5 to-pink-500/5"
        onSave={handleAddOrUpdate}
        saving={saving}
        saveLabel={currentSkill?._id ? "Update Skill" : "Enshrine Expertise"}
        savingLabel="Processing..."
        maxWidth="5xl"
      >
        {currentSkill && (
          <div className="px-1">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10">
              {/* Left Column: Visuals & Mastery */}
              <div className="space-y-8">
                <AdminField label="Visual Icon">
                  <Select
                    value={currentSkill.iconName}
                    onValueChange={(val) => {
                      if (val) {
                        setCurrentSkill((prev) =>
                          prev ? { ...prev, iconName: val } : null,
                        );
                      }
                    }}
                  >
                    <SelectTrigger className="bg-slate-950/40 border-white/5 rounded-xl h-12 font-bold shadow-inner shadow-black/20 focus:ring-4 focus:ring-emerald-500/5 transition-all">
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-white rounded-xl shadow-2xl">
                      {ICON_OPTIONS.map((p) => (
                        <SelectItem
                          key={p}
                          value={p}
                          className="rounded-lg py-2.5 focus:bg-purple-500/10 focus:text-purple-400"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded bg-white/5 flex items-center justify-center">
                              {iconOptionsMap[p] || <FaCode size={10} />}
                            </div>
                            <span className="text-xs">{p}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </AdminField>

                <AdminField label={`Expertise Mastery: ${currentSkill.level}%`}>
                  <div className="pt-4 px-2">
                    <Slider
                      value={[currentSkill.level]}
                      max={100}
                      step={1}
                      onValueChange={(val: number | readonly number[]) => {
                        const level = Array.isArray(val) ? val[0] : val;
                        setCurrentSkill((prev) =>
                          prev ? { ...prev, level } : null,
                        );
                      }}
                      className="cursor-pointer"
                    />
                  </div>
                </AdminField>

                <div className="p-6 bg-purple-500/5 border border-purple-500/10 dark:border-purple-500/20 rounded-3xl flex items-start gap-4 shadow-sm dark:shadow-none">
                  <FaInfoCircle
                    className="text-purple-600 dark:text-purple-400 shrink-0 mt-1"
                    size={16}
                  />
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400/90">
                      Technical Branding
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                      Select an icon that best represents this technology.
                      Mastery levels help visitors understand your depth of
                      knowledge.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Skill Identity */}
              <div className="space-y-6">
                <AdminField label="Expertise Title">
                  <AdminInput
                    icon={FaLaptopCode}
                    value={currentSkill.name}
                    onChange={(e) =>
                      setCurrentSkill({
                        ...currentSkill,
                        name: e.target.value,
                      })
                    }
                    placeholder="e.g. Full Stack Development"
                  />
                </AdminField>

                <AdminField label="Stack / Technologies">
                  <AdminInput
                    icon={FaCode}
                    className="font-medium text-sm"
                    value={currentSkill.tech}
                    onChange={(e) =>
                      setCurrentSkill({
                        ...currentSkill,
                        tech: e.target.value,
                      })
                    }
                    placeholder="e.g. React, Next.js, TypeScript"
                  />
                </AdminField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl flex flex-col gap-1 shadow-sm dark:shadow-none">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      Mastery Status
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {currentSkill.level >= 80
                        ? "Specialist"
                        : currentSkill.level >= 50
                          ? "Advanced"
                          : "Proficient"}
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl flex flex-col gap-1 shadow-sm dark:shadow-none">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      Last Calibrated
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      Today
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </AdminDialogShell>
    </div>
  );
}
