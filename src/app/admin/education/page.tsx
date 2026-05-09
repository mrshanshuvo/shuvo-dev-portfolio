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
  FaGraduationCap,
  FaGripVertical,
  FaEdit,
  FaTrash,
  FaUniversity,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaLink,
  FaAward,
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
import { cn } from "@/lib/utils";
import ImageUpload from "../components/ImageUpload";

interface Education {
  _id?: string;
  degree: string;
  institution: string;
  location: string;
  logo: string;
  period: string;
  gpa: string;
  details: string[];
  link: string;
  order: number;
}

function SortableEduRow({
  edu,
  onEdit,
  onDelete,
  isDeleting,
}: {
  edu: Education;
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
  } = useSortable({ id: edu._id! });

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
        "group flex items-center gap-4 bg-slate-900/40 backdrop-blur-xl border border-white/5 hover:border-white/10 rounded-2xl p-4 transition-all duration-300",
        isDragging && "z-50 border-blue-500/50 shadow-2xl shadow-blue-500/10",
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-600 hover:text-blue-400 transition-colors"
      >
        <FaGripVertical size={14} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          {edu.logo ? (
            <img
              src={edu.logo}
              alt={edu.institution}
              className="w-8 h-8 rounded-lg object-contain bg-white/5 p-1"
            />
          ) : (
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <FaGraduationCap size={14} />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-bold text-white truncate text-sm">
              {edu.degree}
            </h3>
            <p className="text-xs text-slate-400 truncate">{edu.institution}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 pr-2">
        <div className="hidden md:flex items-center gap-2 text-slate-500">
          <FaCalendarAlt size={10} />
          <span className="text-[10px] font-medium">{edu.period}</span>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-8 w-8 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-400/10"
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

export default function AdminEducationPage() {
  const [data, setData] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEdu, setCurrentEdu] = useState<Education | null>(null);
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
    fetchEducation();
  }, []);

  async function fetchEducation() {
    setLoading(true);
    const r = await fetch("/api/admin/education");
    const d = await r.json();
    setData(Array.isArray(d) ? d : []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this education record?"))
      return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/education?id=${id}`, {
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
    if (!currentEdu?.degree || !currentEdu?.institution) return;
    setSaving(true);

    const isEdit = !!currentEdu._id;
    const url = isEdit
      ? `/api/admin/education?id=${currentEdu._id}`
      : "/api/admin/education";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentEdu),
    });

    setSaving(false);
    if (res.ok) {
      setIsDialogOpen(false);
      showToast(isEdit ? "Education updated!" : "Education added!");
      fetchEducation();
    } else {
      showToast("Failed to save.", "error");
    }
  }

  function openEdit(edu: Education) {
    setCurrentEdu({ ...edu });
    setIsDialogOpen(true);
  }

  function openNew() {
    setCurrentEdu({
      degree: "",
      institution: "",
      location: "",
      logo: "",
      period: "",
      gpa: "",
      details: [],
      link: "",
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
        fetch("/api/admin/education", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newData),
        });
      }, 0);
    }
    setActiveId(null);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 space-y-6">
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
        <div className="flex items-center justify-between bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest text-[9px]"
            >
              {data.length} Records
            </Badge>
          </div>
          <Button
            onClick={openNew}
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold px-6 h-10 shadow-lg shadow-blue-600/20 active:scale-95 transition-all group text-xs"
          >
            <FaPlus className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Add Education
          </Button>
        </div>

        <Card className="rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-white">
              Academic Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-20 bg-slate-800/20 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : data.length === 0 ? (
              <div className="text-center py-20 bg-slate-950/20 rounded-3xl border border-dashed border-white/5">
                <FaGraduationCap
                  className="mx-auto text-slate-800 mb-4"
                  size={40}
                />
                <p className="text-slate-500 font-medium">
                  No education history found. Add your first record above.
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
                      {data.map((edu) => (
                        <SortableEduRow
                          key={edu._id}
                          edu={edu}
                          onEdit={() => openEdit(edu)}
                          onDelete={() => handleDelete(edu._id!)}
                          isDeleting={deletingId === edu._id}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </SortableContext>

                <DragOverlay dropAnimation={null}>
                  {activeId ? (
                    <div className="flex items-center gap-4 bg-slate-800/90 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-4 shadow-2xl opacity-90 scale-105">
                      <FaGripVertical className="text-blue-400" size={14} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white truncate text-sm">
                          {data.find((s) => s._id === activeId)?.degree}
                        </h3>
                      </div>
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}

            {!loading && data.length > 0 && (
              <p className="text-center text-[10px] text-slate-700 mt-8 font-bold uppercase tracking-widest">
                Drag rows to reorder • Changes save automatically
              </p>
            )}
          </CardContent>
        </Card>
      </div>{" "}
      <AdminDialogShell
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={currentEdu?._id ? "Edit Academic Record" : "Add New Education"}
        subtitle="Chronicle your academic journey and achievements"
        icon={FaGraduationCap}
        iconColor="text-blue-400"
        accentColor="from-blue-500/5 to-indigo-500/5"
        onSave={handleAddOrUpdate}
        saving={saving}
        saveLabel={
          currentEdu?._id ? "Update Academic File" : "Finalize Admission"
        }
        savingLabel="Recording..."
        maxWidth="5xl"
      >
        {currentEdu && (
          <div className="px-1">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10">
              {/* Left Column: Branding */}
              <div className="space-y-6">
                <AdminField label="Institution Logo">
                  <ImageUpload
                    value={currentEdu.logo}
                    onChange={(url) =>
                      setCurrentEdu({ ...currentEdu, logo: url })
                    }
                  />
                </AdminField>

                <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl flex items-start gap-4">
                  <FaInfoCircle
                    className="text-blue-400 shrink-0 mt-1"
                    size={16}
                  />
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-wider text-blue-400/90">
                      Academic Credibility
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                      Connecting your academic background with official
                      institutions adds credibility to your profile.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Academic Details */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <AdminField label="Degree / Course">
                    <AdminInput
                      icon={FaGraduationCap}
                      value={currentEdu.degree}
                      onChange={(e) =>
                        setCurrentEdu({ ...currentEdu, degree: e.target.value })
                      }
                      placeholder="e.g. B.Sc in Computer Science"
                    />
                  </AdminField>
                  <AdminField label="Institution">
                    <AdminInput
                      icon={FaUniversity}
                      value={currentEdu.institution}
                      onChange={(e) =>
                        setCurrentEdu({
                          ...currentEdu,
                          institution: e.target.value,
                        })
                      }
                      placeholder="e.g. Stanford University"
                    />
                  </AdminField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <AdminField label="Location">
                    <AdminInput
                      icon={FaMapMarkerAlt}
                      value={currentEdu.location}
                      onChange={(e) =>
                        setCurrentEdu({
                          ...currentEdu,
                          location: e.target.value,
                        })
                      }
                      placeholder="e.g. California, USA"
                    />
                  </AdminField>
                  <AdminField label="Period">
                    <AdminInput
                      icon={FaCalendarAlt}
                      value={currentEdu.period}
                      onChange={(e) =>
                        setCurrentEdu({ ...currentEdu, period: e.target.value })
                      }
                      placeholder="e.g. 2020 - 2024"
                    />
                  </AdminField>
                  <AdminField label="Grade / GPA">
                    <AdminInput
                      icon={FaAward}
                      value={currentEdu.gpa}
                      onChange={(e) =>
                        setCurrentEdu({ ...currentEdu, gpa: e.target.value })
                      }
                      placeholder="e.g. 3.9 / 4.0"
                    />
                  </AdminField>
                </div>

                <AdminField label="Official Website">
                  <AdminInput
                    icon={FaLink}
                    value={currentEdu.link}
                    onChange={(e) =>
                      setCurrentEdu({ ...currentEdu, link: e.target.value })
                    }
                    placeholder="https://university.edu"
                  />
                </AdminField>

                <AdminField label="Academic Highlights">
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
                              setCurrentEdu({
                                ...currentEdu,
                                details: [
                                  ...currentEdu.details,
                                  detailInput.trim(),
                                ],
                              });
                              setDetailInput("");
                            }
                          }
                        }}
                        placeholder="e.g. Dean's List, Research in AI, etc."
                        className="h-12"
                      />
                      <Button
                        onClick={() => {
                          if (detailInput.trim()) {
                            setCurrentEdu({
                              ...currentEdu,
                              details: [
                                ...currentEdu.details,
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
                        {currentEdu.details.map((detail, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, x: 20 }}
                            className="flex items-center gap-4 p-4 bg-slate-950/40 border border-white/5 rounded-2xl group/item shadow-inner shadow-black/10"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 shrink-0 group-hover/item:scale-150 transition-transform" />
                            <span className="text-sm text-slate-300 flex-1 font-medium">
                              {detail}
                            </span>
                            <button
                              onClick={() =>
                                setCurrentEdu({
                                  ...currentEdu,
                                  details: currentEdu.details.filter(
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
