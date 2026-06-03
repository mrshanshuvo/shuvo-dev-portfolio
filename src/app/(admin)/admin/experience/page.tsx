"use client";
import { useState } from "react";
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
  FaBriefcase,
  FaGripVertical,
  FaEdit,
  FaTrash,
  FaUniversity,
  FaCalendarAlt,
  FaInfoCircle,
  FaLink,
  FaRocket,
  FaPenNib,
} from "react-icons/fa";
import { AdminDialogShell } from "../components/AdminDialogShell";
import { AdminField, AdminInput } from "../components/AdminFields";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Experience {
  _id?: string;
  title: string;
  org: string;
  duration: string;
  details: string[];
  order: number;
  url?: string;
  previousTitles?: string[];
  links?: { label?: string; url: string }[];
  technologies?: string[];
}

import { forwardRef } from "react";

const ExpRow = forwardRef<HTMLDivElement, any>(
  (
    {
      exp,
      isOverlay,
      isDragging,
      isDeleting,
      onEdit,
      onDelete,
      attributes,
      listeners,
      style,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        style={style}
        {...props}
        className={cn(
          "group flex items-center gap-4 bg-white dark:bg-slate-900 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl p-2 shadow-sm dark:shadow-none w-full",
          !isOverlay &&
            "transition-colors duration-300 hover:border-slate-300 dark:hover:border-white/10 dark:bg-slate-900/40",
          isDragging && !isOverlay && "opacity-50",
          isOverlay &&
            "z-99999 border-emerald-500/50 shadow-2xl shadow-emerald-500/20 scale-[1.02] cursor-grabbing",
        )}
      >
        <div
          {...attributes}
          {...listeners}
          className={cn(
            "text-slate-300 dark:text-slate-600 transition-colors",
            isOverlay
              ? "cursor-grabbing"
              : "cursor-grab hover:text-emerald-500 dark:hover:text-emerald-400",
          )}
        >
          <FaGripVertical size={14} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
              <FaBriefcase size={14} />
            </div>
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

          <div
            className={cn(
              "flex items-center gap-2 transition-opacity",
              isOverlay ? "opacity-0" : "",
            )}
          >
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
  },
);
ExpRow.displayName = "ExpRow";

function SortableExpRow({ exp, onEdit, onDelete, isDeleting }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exp._id! });
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };
  return (
    <ExpRow
      ref={setNodeRef}
      style={style}
      exp={exp}
      isDragging={isDragging}
      attributes={attributes}
      listeners={listeners}
      onEdit={onEdit}
      onDelete={onDelete}
      isDeleting={isDeleting}
    />
  );
}

export default function AdminExperiencePage() {
  const queryClient = useQueryClient();
  const [data, setData] = useState<Experience[]>([]);
  const [prevFetchedData, setPrevFetchedData] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentExp, setCurrentExp] = useState<Experience | null>(null);
  const [detailInput, setDetailInput] = useState("");
  const [techInput, setTechInput] = useState("");
  const [prevTitleInput, setPrevTitleInput] = useState("");
  const [linkLabelInput, setLinkLabelInput] = useState("");
  const [linkUrlInput, setLinkUrlInput] = useState("");
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

  const { data: fetchedData, isLoading: loading } = useQuery({
    queryKey: ["experience"],
    queryFn: async () => {
      const r = await fetch("/api/admin/experience");
      if (!r.ok) throw new Error("Failed to fetch experience");
      return r.json();
    },
  });

  if (fetchedData !== prevFetchedData) {
    setPrevFetchedData(fetchedData);
    if (fetchedData) {
      setData(Array.isArray(fetchedData) ? fetchedData : []);
    }
  }

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/experience?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      return id;
    },
    onSuccess: (id) => {
      setData((prev) => prev.filter((s) => s._id !== id));
      queryClient.invalidateQueries({ queryKey: ["experience"] });
      showToast("Record deleted.");
      setDeletingId(null);
    },
    onError: () => {
      showToast("Failed to delete.", "error");
      setDeletingId(null);
    },
  });

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this experience record?"))
      return;
    setDeletingId(id);
    deleteMutation.mutate(id);
  }

  const saveMutation = useMutation({
    mutationFn: async (exp: Experience) => {
      const isEdit = !!exp._id;
      const url = isEdit
        ? `/api/admin/experience?id=${exp._id}`
        : "/api/admin/experience";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exp),
      });
      if (!res.ok) throw new Error("Failed to save");
      return { isEdit };
    },
    onSuccess: ({ isEdit }) => {
      setIsDialogOpen(false);
      showToast(isEdit ? "Experience updated!" : "Experience added!");
      queryClient.invalidateQueries({ queryKey: ["experience"] });
    },
    onError: () => {
      showToast("Failed to save.", "error");
    },
  });

  async function handleAddOrUpdate() {
    if (!currentExp?.title || !currentExp?.org) return;
    saveMutation.mutate(currentExp);
  }

  function openEdit(item: Experience) {
    setCurrentExp({
      ...item,
      details: item.details || [],
      previousTitles: item.previousTitles || [],
      technologies: item.technologies || [],
      links: item.links || [],
    });
    setIsDialogOpen(true);
  }

  function openNew() {
    setCurrentExp({
      title: "",
      org: "",
      duration: "",
      details: [],
      url: "",
      previousTitles: [],
      links: [],
      technologies: [],
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
      fetch("/api/admin/experience", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      }).then(() =>
        queryClient.invalidateQueries({ queryKey: ["experience"] }),
      );
    }
    setActiveId(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={(e) => setActiveId(e.active.id as string)}
      onDragEnd={handleDragEnd}
    >
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
                className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest text-[10px]"
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
            <CardHeader className="p-4 pb-1">
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                Professional Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
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
                <div className="text-center py-16 bg-white dark:bg-slate-950/20 rounded-3xl border border-dashed border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                  <FaBriefcase
                    className="mx-auto text-slate-200 dark:text-slate-800 mb-4"
                    size={40}
                  />
                  <p className="text-slate-400 dark:text-slate-500 font-medium">
                    No experience records found. Add your first job above.
                  </p>
                </div>
              ) : (
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
          title={
            currentExp?._id ? "Refine Work History" : "New Career Milestone"
          }
          subtitle="Document your professional evolution and impact"
          icon={FaBriefcase}
          iconColor="text-emerald-400"
          accentColor="from-emerald-500/5 to-teal-500/5"
          onSave={handleAddOrUpdate}
          saving={saveMutation.isPending}
          saveLabel={currentExp?._id ? "Update Chronicle" : "Save Experience"}
          savingLabel="Archiving..."
          maxWidth="5xl"
        >
          {currentExp && (
            <div className="px-1 space-y-8">
              {/* Top Info Grid */}
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
                <AdminField label="Duration">
                  <AdminInput
                    icon={FaCalendarAlt}
                    value={currentExp.duration}
                    onChange={(e) =>
                      setCurrentExp({ ...currentExp, duration: e.target.value })
                    }
                    placeholder="e.g. Jan 2022 - Present"
                  />
                </AdminField>
                <AdminField label="Website URL">
                  <AdminInput
                    icon={FaLink}
                    value={currentExp.url || ""}
                    onChange={(e) =>
                      setCurrentExp({ ...currentExp, url: e.target.value })
                    }
                    placeholder="e.g. https://google.com"
                  />
                </AdminField>
              </div>

              {/* Arrays Section in Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Previous Titles */}
                <AdminField label="Previous Titles (Optional)">
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <AdminInput
                        icon={FaBriefcase}
                        value={prevTitleInput}
                        onChange={(e) => setPrevTitleInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (prevTitleInput.trim()) {
                              setCurrentExp({
                                ...currentExp,
                                previousTitles: [
                                  ...(currentExp.previousTitles || []),
                                  prevTitleInput.trim(),
                                ],
                              });
                              setPrevTitleInput("");
                            }
                          }
                        }}
                        placeholder="e.g. Software Engineer II"
                      />
                      <Button
                        onClick={() => {
                          if (prevTitleInput.trim()) {
                            setCurrentExp({
                              ...currentExp,
                              previousTitles: [
                                ...(currentExp.previousTitles || []),
                                prevTitleInput.trim(),
                              ],
                            });
                            setPrevTitleInput("");
                          }
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(currentExp.previousTitles || []).map((t, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="pl-3 pr-2 py-1.5 gap-2"
                        >
                          {t}
                          <button
                            onClick={() =>
                              setCurrentExp({
                                ...currentExp,
                                previousTitles: (
                                  currentExp.previousTitles || []
                                ).filter((_, idx) => idx !== i),
                              })
                            }
                            className="hover:text-red-500"
                          >
                            <FaTimes size={12} />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </AdminField>

                {/* Technologies */}
                <AdminField label="Technologies Used">
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <AdminInput
                        icon={FaRocket}
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (techInput.trim()) {
                              setCurrentExp({
                                ...currentExp,
                                technologies: [
                                  ...(currentExp.technologies || []),
                                  techInput.trim(),
                                ],
                              });
                              setTechInput("");
                            }
                          }
                        }}
                        placeholder="e.g. React"
                      />
                      <Button
                        onClick={() => {
                          if (techInput.trim()) {
                            setCurrentExp({
                              ...currentExp,
                              technologies: [
                                ...(currentExp.technologies || []),
                                techInput.trim(),
                              ],
                            });
                            setTechInput("");
                          }
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(currentExp.technologies || []).map((t, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="pl-3 pr-2 py-1.5 gap-2 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                        >
                          {t}
                          <button
                            onClick={() =>
                              setCurrentExp({
                                ...currentExp,
                                technologies: (
                                  currentExp.technologies || []
                                ).filter((_, idx) => idx !== i),
                              })
                            }
                            className="hover:text-red-500"
                          >
                            <FaTimes size={12} />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </AdminField>
              </div>

              {/* Custom Links */}
              <AdminField label="Custom Links (e.g., Company Post, Project)">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <AdminInput
                      icon={FaPenNib}
                      value={linkLabelInput}
                      onChange={(e) => setLinkLabelInput(e.target.value)}
                      placeholder="Label (e.g. Blog Post)"
                    />
                    <AdminInput
                      icon={FaLink}
                      value={linkUrlInput}
                      onChange={(e) => setLinkUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (linkUrlInput.trim()) {
                            setCurrentExp({
                              ...currentExp,
                              links: [
                                ...(currentExp.links || []),
                                {
                                  label: linkLabelInput.trim() || undefined,
                                  url: linkUrlInput.trim(),
                                },
                              ],
                            });
                            setLinkLabelInput("");
                            setLinkUrlInput("");
                          }
                        }
                      }}
                      placeholder="URL (https://...)"
                    />
                    <Button
                      onClick={() => {
                        if (linkUrlInput.trim()) {
                          setCurrentExp({
                            ...currentExp,
                            links: [
                              ...(currentExp.links || []),
                              {
                                label: linkLabelInput.trim() || undefined,
                                url: linkUrlInput.trim(),
                              },
                            ],
                          });
                          setLinkLabelInput("");
                          setLinkUrlInput("");
                        }
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <AnimatePresence>
                      {(currentExp.links || []).map((link, i) => (
                        <motion.div
                          key={i}
                          layout
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <FaLink className="text-slate-400" />
                            <div>
                              <span className="text-sm font-bold block">
                                {link.label || "Link"}
                              </span>
                              <span className="text-xs text-slate-500">
                                {link.url}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              setCurrentExp({
                                ...currentExp,
                                links: (currentExp.links || []).filter(
                                  (_, idx) => idx !== i,
                                ),
                              })
                            }
                            className="text-slate-400 hover:text-red-500 p-2"
                          >
                            <FaTimes />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </AdminField>

              {/* Impact & Details */}
              <AdminField label="Impact & Responsibilities">
                <div className="space-y-4">
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
                      className="bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl h-12 px-6"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <AnimatePresence mode="popLayout">
                      {(currentExp.details || []).map((detail, i) => (
                        <motion.div
                          key={i}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl group/item shadow-inner shadow-black/5 dark:shadow-black/10"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span className="text-sm text-slate-700 dark:text-slate-300 flex-1 font-medium">
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
          )}
        </AdminDialogShell>

        <DragOverlay zIndex={99999} dropAnimation={null}>
          {activeId ? (
            <ExpRow exp={data.find((s) => s._id === activeId)!} isOverlay />
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
