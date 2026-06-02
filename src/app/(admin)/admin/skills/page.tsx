"use client";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  FaCode,
  FaGripVertical,
  FaEdit,
  FaTrash,
  FaLaptopCode,
  FaInfoCircle,
  FaPalette,
} from "react-icons/fa";
import { SiReact, SiNodedotjs, SiTensorflow } from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";
import { AdminDialogShell } from "../components/AdminDialogShell";
import { AdminField, AdminInput, AdminSelect } from "../components/AdminFields";

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
  iconSlug?: string;
  brandColor?: string;
  isTechnology?: boolean;
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
        "group flex items-center gap-4 bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 rounded-2xl p-2 transition-all duration-300 shadow-sm dark:shadow-none",
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
        <div className="flex items-center gap-2 min-w-30 justify-end">
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
  const queryClient = useQueryClient();
  const [skills, setSkills] = useState<Skill[]>([]);
  const expertises = skills.filter((s) => !s.isTechnology);
  const technologies = skills.filter((s) => !!s.isTechnology);
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

  const { data, isLoading: loading } = useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const r = await fetch("/api/admin/skills");
      if (!r.ok) throw new Error("Failed to fetch skills");
      return r.json();
    },
  });

  useEffect(() => {
    if (data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSkills(Array.isArray(data.skills) ? data.skills : []);
    }
  }, [data]);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/skills?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      return id;
    },
    onSuccess: (id) => {
      setSkills((prev) => prev.filter((s) => s._id !== id));
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      showToast("Skill deleted.");
      setDeletingId(null);
    },
    onError: () => {
      showToast("Failed to delete.", "error");
      setDeletingId(null);
    },
  });

  async function handleDelete(id: string) {
    setDeletingId(id);
    deleteMutation.mutate(id);
  }

  const saveMutation = useMutation({
    mutationFn: async (skill: Skill) => {
      const isEdit = !!skill._id;
      const url = isEdit
        ? `/api/admin/skills?id=${skill._id}`
        : "/api/admin/skills";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skill),
      });
      if (!res.ok) throw new Error("Failed to save");
      return { isEdit };
    },
    onSuccess: ({ isEdit }) => {
      setIsDialogOpen(false);
      showToast(isEdit ? "Skill updated!" : "Skill added!");
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
    onError: () => {
      showToast("Failed to save.", "error");
    },
  });

  async function handleAddOrUpdate() {
    if (!currentSkill?.name) return;
    saveMutation.mutate(currentSkill);
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
      iconName: "FaCode",
      iconSlug: "",
      brandColor: "",
      isTechnology: false,
    });
    setIsDialogOpen(true);
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      // Operate only on the expertises sub-array
      const oldIndex = expertises.findIndex((i) => i._id === active.id);
      const newIndex = expertises.findIndex((i) => i._id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;
      const reorderedExpertises = arrayMove(expertises, oldIndex, newIndex);
      // Merge back: keep technologies in their positions, replace expertise slots
      const updatedSkills = skills.map((s) =>
        s.isTechnology ? s : reorderedExpertises.shift()!,
      );
      setSkills(updatedSkills);
      // Auto save order using PATCH
      fetch("/api/admin/skills", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSkills),
      }).then(() => queryClient.invalidateQueries({ queryKey: ["skills"] }));
    }
    setActiveId(null);
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

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl p-4 shadow-sm dark:shadow-none">
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest text-[10px]"
            >
              {expertises.length} Expertise Areas
            </Badge>
            <Badge
              variant="outline"
              className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest text-[10px]"
            >
              {technologies.length} Brand Techs
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-700">
          <Card className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-sm dark:shadow-none">
            <CardHeader className="p-4 pb-1">
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                Skill Expertise
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-16 bg-slate-100 dark:bg-slate-800/20 rounded-2xl animate-pulse"
                    />
                  ))}
                </div>
              ) : expertises.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-slate-950/20 rounded-3xl border border-dashed border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                  <FaLaptopCode
                    className="mx-auto text-slate-200 dark:text-slate-800 mb-4"
                    size={40}
                  />
                  <p className="text-slate-400 dark:text-slate-500 font-medium">
                    No expertises found. Add your expertise above.
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
                    items={expertises.map((s) => s._id!)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      <AnimatePresence mode="popLayout">
                        {expertises.map((skill) => (
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

              {!loading && expertises.length > 0 && (
                <p className="text-center text-[10px] text-slate-400 dark:text-slate-700 mt-8 font-bold uppercase tracking-widest">
                  Drag rows to reorder • Changes save automatically
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-sm dark:shadow-none">
            <CardHeader className="p-4 pb-1">
              <div className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl">
                    <FaCode size={20} />
                  </div>
                  <div>
                    <CardTitle className="text-slate-900 dark:text-white">
                      Brand Tech Registry ({technologies.length})
                    </CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-500">
                      Technologies with custom colors & icons selectable in
                      Projects.
                    </CardDescription>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setCurrentSkill({
                      name: "",
                      tech: "Technology",
                      level: 80,
                      iconName: "FaCode",
                      iconSlug: "",
                      brandColor: "#10B981",
                      isTechnology: true,
                    });
                    setIsDialogOpen(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold px-4 h-9 shadow-lg shadow-blue-600/20 text-xs active:scale-95 transition-all cursor-pointer"
                >
                  <FaPlus className="mr-1.5" size={10} /> Add Tech
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
              <div className="flex flex-wrap gap-2.5 min-h-20 p-4 bg-slate-50 dark:bg-slate-950/20 rounded-2xl border border-slate-200 dark:border-white/5">
                {technologies.map((t) => (
                  <Badge
                    key={t._id}
                    variant="outline"
                    className="pl-3 pr-2 py-2 gap-2 bg-white dark:bg-slate-950 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 rounded-xl group shadow-sm dark:shadow-none hover:scale-102 transition-transform cursor-default"
                    style={{
                      borderLeft: `3px solid ${t.brandColor || "#10B981"}`,
                    }}
                  >
                    <span className="text-xs font-black">{t.name}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(t)}
                        className="h-5 w-5 rounded-full hover:bg-blue-500/10 dark:hover:bg-blue-500/20 hover:text-blue-500 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <FaEdit size={10} />
                      </button>
                      <button
                        onClick={() => handleDelete(t._id!)}
                        className="h-5 w-5 rounded-full hover:bg-red-500/10 dark:hover:bg-red-500/20 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <FaTrash size={9} />
                      </button>
                    </div>
                  </Badge>
                ))}
                {technologies.length === 0 && (
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold m-auto py-6">
                    No brand technologies registered
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
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
        saving={saveMutation.isPending}
        saveLabel={currentSkill?._id ? "Update Skill" : "Enshrine Expertise"}
        savingLabel="Processing..."
        maxWidth="5xl"
      >
        {" "}
        {currentSkill && (
          <div className="px-1">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10">
              {/* Left Column: Visuals & Classification */}
              <div className="space-y-8">
                <AdminField label="Skill Classification">
                  <div className="flex items-center h-12 px-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-xl">
                    <label className="flex items-center gap-3 cursor-pointer w-full select-none">
                      <input
                        type="checkbox"
                        checked={!!currentSkill.isTechnology}
                        onChange={(e) => {
                          const isTech = e.target.checked;
                          setCurrentSkill((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  isTechnology: isTech,
                                  tech: isTech ? "Technology" : "",
                                  iconName: isTech ? "FaCode" : "SiReact",
                                }
                              : null,
                          );
                        }}
                        className="size-4 accent-purple-500 rounded border-slate-300 dark:border-white/10 dark:bg-slate-950 focus:ring-purple-500 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Is Technology Logo / Brand
                      </span>
                    </label>
                  </div>
                </AdminField>

                {!currentSkill.isTechnology ? (
                  <>
                    <AdminField label="Visual Icon">
                      <AdminSelect
                        value={currentSkill.iconName}
                        onValueChange={(val) => {
                          if (val) {
                            setCurrentSkill((prev) =>
                              prev ? { ...prev, iconName: val } : null,
                            );
                          }
                        }}
                        options={ICON_OPTIONS.map((p) => ({
                          label: p,
                          value: p,
                          icon: iconOptionsMap[p] || <FaCode size={10} />,
                        }))}
                        placeholder="Select icon"
                      />
                    </AdminField>

                    <AdminField
                      label={`Expertise Mastery: ${currentSkill.level}%`}
                    >
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
                  </>
                ) : (
                  <>
                    <AdminField label="Simple Icon Slug">
                      <AdminInput
                        icon={FaLaptopCode}
                        value={currentSkill.iconSlug || ""}
                        onChange={(e) =>
                          setCurrentSkill((prev) =>
                            prev ? { ...prev, iconSlug: e.target.value } : null,
                          )
                        }
                        placeholder="e.g. react (see simpleicons.org)"
                      />
                    </AdminField>

                    <AdminField label="Brand Color (Hex)">
                      <div className="flex gap-3 items-center">
                        <AdminInput
                          icon={FaPalette}
                          value={currentSkill.brandColor || ""}
                          onChange={(e) =>
                            setCurrentSkill((prev) =>
                              prev
                                ? { ...prev, brandColor: e.target.value }
                                : null,
                            )
                          }
                          placeholder="e.g. #61DAFB"
                          className="flex-1"
                        />
                        <div
                          className="w-10 h-10 rounded-xl border border-slate-200 dark:border-white/10 shrink-0 shadow-sm"
                          style={{
                            backgroundColor:
                              currentSkill.brandColor || "#10B981",
                          }}
                        />
                      </div>
                    </AdminField>
                  </>
                )}

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
                      {currentSkill.isTechnology
                        ? "Define the SimpleIcons slug and brand color. Your icon will display in the scrolling tech marquee and as selectable tags."
                        : "Select an icon that best represents this technology. Mastery levels help visitors understand your depth of knowledge."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Skill Identity */}
              <div className="space-y-6">
                <AdminField
                  label={
                    currentSkill.isTechnology
                      ? "Technology Brand Name"
                      : "Expertise Title"
                  }
                >
                  <AdminInput
                    icon={FaLaptopCode}
                    value={currentSkill.name}
                    onChange={(e) =>
                      setCurrentSkill((prev) =>
                        prev ? { ...prev, name: e.target.value } : null,
                      )
                    }
                    placeholder={
                      currentSkill.isTechnology
                        ? "e.g. React"
                        : "e.g. Full Stack Development"
                    }
                  />
                </AdminField>

                {!currentSkill.isTechnology && (
                  <AdminField label="Stack / Technologies">
                    <AdminInput
                      icon={FaCode}
                      className="font-medium text-sm"
                      value={currentSkill.tech}
                      onChange={(e) =>
                        setCurrentSkill((prev) =>
                          prev ? { ...prev, tech: e.target.value } : null,
                        )
                      }
                      placeholder="e.g. React, Next.js, TypeScript"
                    />
                  </AdminField>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl flex flex-col gap-1 shadow-sm dark:shadow-none">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
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
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
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
