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
  FaBriefcase,
  FaGripVertical,
  FaEdit,
  FaTrash,
  FaUniversity,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { AdminDialogShell } from "../components/AdminDialogShell";
import {
  AdminField,
  AdminInput,
  AdminTextarea,
} from "../components/AdminFields";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import ImageUpload from "../components/ImageUpload";

interface Experience {
  _id?: string;
  title: string;
  org: string;
  location: string;
  duration: string;
  logo: string;
  details: string[];
  color: string;
  order: number;
}

function SortableExpRow({
  exp,
  onEdit,
  onDelete,
  isDeleting,
}: {
  exp: Experience;
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
  } = useSortable({ id: exp._id! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-4 bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 rounded-2xl p-4 transition-all duration-300 shadow-sm dark:shadow-none",
        isDragging &&
          "z-50 border-emerald-500/50 shadow-2xl shadow-emerald-500/10",
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
      >
        <FaGripVertical size={14} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          {exp.logo ? (
            <img
              src={exp.logo}
              alt={exp.org}
              className="w-8 h-8 rounded-lg object-contain bg-white/5 p-1"
            />
          ) : (
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <FaBriefcase size={14} />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-white truncate text-sm">
              {exp.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {exp.org}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 pr-2">
        <div className="hidden md:flex items-center gap-2 text-slate-500">
          <FaCalendarAlt size={10} />
          <span className="text-[10px] font-medium">{exp.duration}</span>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-8 w-8 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10"
          >
            <FaEdit size={12} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            disabled={isDeleting}
            className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10"
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

export default function AdminExperiencePage() {
  const [data, setData] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentExp, setCurrentExp] = useState<Experience | null>(null);
  const [detailInput, setDetailInput] = useState("");
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
    fetchExperience();
  }, []);

  async function fetchExperience() {
    setLoading(true);
    const r = await fetch("/api/admin/experience");
    const d = await r.json();
    setData(Array.isArray(d) ? d : []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this experience record?"))
      return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/experience?id=${id}`, {
      method: "DELETE",
    });
    setDeletingId(null);
    if (res.ok) {
      setData((prev) => prev.filter((s) => s._id !== id));
      showToast("Record deleted.");
    } else {
      showToast("Failed to delete.", "error");
    }
  }

  async function handleAddOrUpdate() {
    if (!currentExp?.title || !currentExp?.org) return;
    setSaving(true);

    const isEdit = !!currentExp._id;
    const url = isEdit
      ? `/api/admin/experience?id=${currentExp._id}`
      : "/api/admin/experience";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentExp),
    });

    setSaving(false);
    if (res.ok) {
      setIsDialogOpen(false);
      showToast(isEdit ? "Experience updated!" : "Experience added!");
      fetchExperience();
    } else {
      showToast("Failed to save.", "error");
    }
  }

  function openEdit(item: Experience) {
    setCurrentExp({
      ...item,
      details: item.details || [],
    });
    setIsDialogOpen(true);
  }

  function openNew() {
    setCurrentExp({
      title: "",
      org: "",
      location: "",
      duration: "",
      logo: "",
      details: [],
      color: "emerald",
      order: data.length,
    });
    setIsDialogOpen(true);
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = data.findIndex((i) => i._id === active.id);
      const newIndex = data.findIndex((i) => i._id === over.id);
      const newData = arrayMove(data, oldIndex, newIndex);
      setData(newData);
      // Auto save order using PATCH
      setTimeout(() => {
        fetch("/api/admin/experience", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newData),
        });
      }, 0);
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

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl p-4 shadow-sm dark:shadow-none">
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest text-[9px]"
            >
              {data.length} Work Experience
            </Badge>
          </div>
          <Button
            onClick={openNew}
            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold px-6 h-10 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all group text-xs"
          >
            <FaPlus className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Add Experience
          </Button>
        </div>

        <Card className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-sm dark:shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
              Professional Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-20 bg-slate-100 dark:bg-slate-800/20 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : data.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-950/20 rounded-3xl border border-dashed border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                <FaBriefcase
                  className="mx-auto text-slate-200 dark:text-slate-800 mb-4"
                  size={40}
                />
                <p className="text-slate-400 dark:text-slate-500 font-medium">
                  No experience records found. Add your first job above.
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
                  items={data.map((s) => s._id!)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {data.map((exp) => (
                        <SortableExpRow
                          key={exp._id}
                          exp={exp}
                          onEdit={() => openEdit(exp)}
                          onDelete={() => handleDelete(exp._id!)}
                          isDeleting={deletingId === exp._id}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </SortableContext>

                <DragOverlay dropAnimation={null}>
                  {activeId ? (
                    <div className="flex items-center gap-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-4 shadow-2xl opacity-90 scale-105">
                      <FaGripVertical className="text-emerald-500" size={14} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-white truncate text-sm">
                          {data.find((s) => s._id === activeId)?.title}
                        </h3>
                      </div>
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}

            {!loading && data.length > 0 && (
              <p className="text-center text-[10px] text-slate-400 dark:text-slate-700 mt-8 font-bold uppercase tracking-widest">
                Drag rows to reorder • Changes save automatically
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <AdminDialogShell
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={currentExp?._id ? "Refine Work History" : "New Career Milestone"}
        subtitle="Document your professional evolution and impact"
        icon={FaBriefcase}
        iconColor="text-emerald-400"
        accentColor="from-emerald-500/5 to-teal-500/5"
        onSave={handleAddOrUpdate}
        saving={saving}
        saveLabel={currentExp?._id ? "Update Chronicle" : "Save Experience"}
        savingLabel="Archiving..."
        maxWidth="5xl"
      >
        {currentExp && (
          <div className="px-1">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10">
              {/* Left Column: Branding */}
              <div className="space-y-6">
                <AdminField label="Organization Logo">
                  <ImageUpload
                    value={currentExp.logo}
                    onChange={(url) =>
                      setCurrentExp({ ...currentExp, logo: url })
                    }
                  />
                </AdminField>

                <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl flex items-start gap-4">
                  <FaInfoCircle
                    className="text-emerald-400 shrink-0 mt-1"
                    size={18}
                  />
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-wider text-emerald-400/90">
                      Visual Branding
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                      Company logos enhance the timeline visually. Use PNGs with
                      transparent backgrounds for the cleanest look.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Experience Details */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <AdminField label="Job Title">
                    <AdminInput
                      icon={FaBriefcase}
                      value={currentExp.title}
                      onChange={(e) =>
                        setCurrentExp({ ...currentExp, title: e.target.value })
                      }
                      placeholder="e.g. Senior Software Engineer"
                    />
                  </AdminField>
                  <AdminField label="Organization">
                    <AdminInput
                      icon={FaUniversity}
                      value={currentExp.org}
                      onChange={(e) =>
                        setCurrentExp({ ...currentExp, org: e.target.value })
                      }
                      placeholder="e.g. Google"
                    />
                  </AdminField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <AdminField label="Location">
                    <AdminInput
                      icon={FaMapMarkerAlt}
                      value={currentExp.location}
                      onChange={(e) =>
                        setCurrentExp({
                          ...currentExp,
                          location: e.target.value,
                        })
                      }
                      placeholder="e.g. London, UK"
                    />
                  </AdminField>
                  <AdminField label="Duration">
                    <AdminInput
                      icon={FaCalendarAlt}
                      value={currentExp.duration}
                      onChange={(e) =>
                        setCurrentExp({
                          ...currentExp,
                          duration: e.target.value,
                        })
                      }
                      placeholder="e.g. Jan 2022 - Present"
                    />
                  </AdminField>
                  <AdminField label="Theme Color">
                    <Select
                      value={currentExp.color}
                      onValueChange={(val: string | null) => {
                        if (val) {
                          setCurrentExp((prev) =>
                            prev ? { ...prev, color: val } : null,
                          );
                        }
                      }}
                    >
                      <SelectTrigger className="bg-slate-950/40 border-white/5 rounded-xl h-12 font-bold shadow-inner shadow-black/20 focus:ring-4 focus:ring-emerald-500/5 transition-all">
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 text-white rounded-xl">
                        {[
                          "emerald",
                          "blue",
                          "purple",
                          "rose",
                          "amber",
                          "cyan",
                        ].map((c) => (
                          <SelectItem key={c} value={c} className="capitalize">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-3 h-3 rounded-full bg-${c}-500`}
                              />
                              {c}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </AdminField>
                </div>

                <AdminField label="Impact & Responsibilities">
                  <div className="space-y-6">
                    <div className="flex gap-3">
                      <AdminInput
                        icon={FaInfoCircle}
                        value={detailInput}
                        onChange={(e) => setDetailInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (detailInput.trim()) {
                              setCurrentExp({
                                ...currentExp,
                                details: [
                                  ...currentExp.details,
                                  detailInput.trim(),
                                ],
                              });
                              setDetailInput("");
                            }
                          }
                        }}
                        placeholder="e.g. Spearheaded the migration to microservices architecture..."
                        className="h-12"
                      />
                      <Button
                        onClick={() => {
                          if (detailInput.trim()) {
                            setCurrentExp({
                              ...currentExp,
                              details: [
                                ...currentExp.details,
                                detailInput.trim(),
                              ],
                            });
                            setDetailInput("");
                          }
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl h-12 px-6 border border-white/5 font-bold"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <AnimatePresence mode="popLayout">
                        {(currentExp.details || []).map((detail, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, x: 20 }}
                            className="flex items-center gap-4 p-4 bg-slate-950/40 border border-white/5 rounded-2xl group/item shadow-inner shadow-black/10"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 shrink-0" />
                            <span className="text-sm text-slate-300 flex-1 font-medium">
                              {detail}
                            </span>
                            <button
                              onClick={() =>
                                setCurrentExp({
                                  ...currentExp,
                                  details: currentExp.details.filter(
                                    (_, idx) => idx !== i,
                                  ),
                                })
                              }
                              className="text-slate-600 hover:text-red-400 transition-colors p-2 hover:bg-red-400/10 rounded-lg"
                            >
                              <FaTimes size={14} />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </AdminField>
              </div>
            </div>
          </div>
        )}
      </AdminDialogShell>
    </div>
  );
}
