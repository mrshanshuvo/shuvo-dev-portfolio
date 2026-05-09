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
  FaFlask,
  FaGripVertical,
  FaEdit,
  FaTrash,
  FaLink,
  FaCode,
  FaInfoCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import MediaGalleryManager from "../components/MediaGalleryManager";
import { AdminDialogShell } from "../components/AdminDialogShell";
import {
  AdminField,
  AdminInput,
  AdminTextarea,
} from "../components/AdminFields";

interface Demo {
  _id?: string;
  title: string;
  description: string;
  url: string;
  tech: string[];
  media: any[];
  order: number;
}

function SortableDemoRow({
  item,
  onEdit,
  onDelete,
  isDeleting,
}: {
  item: Demo;
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
  } = useSortable({ id: item._id! });

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
          "z-50 border-indigo-500/50 shadow-2xl shadow-indigo-500/10",
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-indigo-500 transition-colors"
      >
        <FaGripVertical size={14} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <FaFlask size={14} />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-white truncate text-sm">
              {item.title}
            </h3>
            <div className="flex gap-1 mt-0.5">
              {item.tech.slice(0, 3).map((t, i) => (
                <span
                  key={i}
                  className="text-[9px] text-slate-500 font-medium px-1.5 py-0.5 bg-white/5 rounded border border-white/5"
                >
                  {t}
                </span>
              ))}
              {item.tech.length > 3 && (
                <span className="text-[9px] text-slate-600">
                  +{item.tech.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="h-8 w-8 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10"
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
  );
}

export default function AdminDemosPage() {
  const [data, setData] = useState<Demo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDemo, setCurrentDemo] = useState<Demo | null>(null);
  const [techInput, setTechInput] = useState("");
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
    fetchDemos();
  }, []);

  async function fetchDemos() {
    setLoading(true);
    const r = await fetch("/api/admin/demos");
    const d = await r.json();
    setData(Array.isArray(d) ? d : []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this demo?")) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/demos?id=${id}`, {
      method: "DELETE",
    });
    setDeletingId(null);
    if (res.ok) {
      setData((prev) => prev.filter((s) => s._id !== id));
      showToast("Demo deleted.");
    } else {
      showToast("Failed to delete.", "error");
    }
  }

  async function handleAddOrUpdate() {
    if (!currentDemo?.title || !currentDemo?.url) return;
    setSaving(true);

    const isEdit = !!currentDemo._id;
    const url = isEdit
      ? `/api/admin/demos?id=${currentDemo._id}`
      : "/api/admin/demos";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentDemo),
    });

    setSaving(false);
    if (res.ok) {
      setIsDialogOpen(false);
      showToast(isEdit ? "Demo updated!" : "Demo added!");
      fetchDemos();
    } else {
      showToast("Failed to save.", "error");
    }
  }

  function openEdit(item: Demo) {
    setCurrentDemo({ ...item });
    setIsDialogOpen(true);
  }

  function openNew() {
    setCurrentDemo({
      title: "",
      description: "",
      url: "",
      tech: [],
      media: [],
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
        fetch("/api/admin/demos", {
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
              className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest text-[9px]"
            >
              {data.length} Playground Projects
            </Badge>
          </div>
          <Button
            onClick={openNew}
            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold px-6 h-10 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all group text-xs"
          >
            <FaPlus className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Add Demo
          </Button>
        </div>

        <Card className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-sm dark:shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
              Experimental Playground
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-slate-100 dark:bg-slate-800/20 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : data.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-950/20 rounded-3xl border border-dashed border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                <FaFlask
                  className="mx-auto text-slate-200 dark:text-slate-800 mb-4"
                  size={40}
                />
                <p className="text-slate-400 dark:text-slate-500 font-medium">
                  No demos yet. Share your experiments above.
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
                      {data.map((item) => (
                        <SortableDemoRow
                          key={item._id}
                          item={item}
                          onEdit={() => openEdit(item)}
                          onDelete={() => handleDelete(item._id!)}
                          isDeleting={deletingId === item._id}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </SortableContext>

                <DragOverlay dropAnimation={null}>
                  {activeId ? (
                    <div className="flex items-center gap-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-4 shadow-2xl opacity-90 scale-105">
                      <FaGripVertical className="text-indigo-500" size={14} />
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
        title={currentDemo?._id ? "Refine Experiment" : "New Playground Demo"}
        subtitle="Curate and showcase your interactive experiments"
        icon={FaFlask}
        iconColor="text-indigo-400"
        accentColor="from-indigo-500/5 to-purple-500/5"
        onSave={handleAddOrUpdate}
        saving={saving}
        saveLabel={currentDemo?._id ? "Update Demo" : "Publish Demo"}
        savingLabel="Processing..."
        maxWidth="5xl"
      >
        {currentDemo && (
          <div className="px-1">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10">
              {/* Left Column: Visuals */}
              <div className="space-y-6">
                <AdminField label="Media Gallery">
                  <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 dark:border-indigo-500/20 rounded-3xl flex items-start gap-4 mb-4 shadow-sm dark:shadow-none">
                    <FaInfoCircle
                      className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-1"
                      size={16}
                    />
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400/90">
                        Visual Engagement
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                        Showcase your work visually. You can add multiple images
                        or videos to document your experiment.
                      </p>
                    </div>
                  </div>
                  <MediaGalleryManager
                    media={currentDemo.media}
                    onChange={(newMedia) =>
                      setCurrentDemo({ ...currentDemo, media: newMedia })
                    }
                  />
                </AdminField>
              </div>

              {/* Right Column: Information */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <AdminField label="Demo Title">
                    <AdminInput
                      icon={FaFlask}
                      value={currentDemo.title}
                      onChange={(e) =>
                        setCurrentDemo({
                          ...currentDemo,
                          title: e.target.value,
                        })
                      }
                      placeholder="e.g. AI-Powered Chatbot"
                    />
                  </AdminField>
                  <AdminField label="Live URL">
                    <AdminInput
                      icon={FaLink}
                      value={currentDemo.url}
                      onChange={(e) =>
                        setCurrentDemo({ ...currentDemo, url: e.target.value })
                      }
                      placeholder="https://playground..."
                    />
                  </AdminField>
                </div>

                <AdminField label="Description">
                  <AdminTextarea
                    value={currentDemo.description}
                    onChange={(e) =>
                      setCurrentDemo({
                        ...currentDemo,
                        description: e.target.value,
                      })
                    }
                    placeholder="What is this experiment about?..."
                    className="min-h-[120px]"
                  />
                </AdminField>

                <AdminField label="Technologies Used">
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <AdminInput
                        icon={FaCode}
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (techInput.trim()) {
                              setCurrentDemo({
                                ...currentDemo,
                                tech: [...currentDemo.tech, techInput.trim()],
                              });
                              setTechInput("");
                            }
                          }
                        }}
                        placeholder="Add tech..."
                        className="h-12 text-sm"
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          if (techInput.trim()) {
                            setCurrentDemo({
                              ...currentDemo,
                              tech: [...currentDemo.tech, techInput.trim()],
                            });
                            setTechInput("");
                          }
                        }}
                        className="h-12 px-6 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold border border-white/5 shadow-inner shadow-black/20"
                      >
                        <FaPlus size={14} />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <AnimatePresence>
                        {currentDemo.tech.map((t, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                          >
                            <Badge
                              variant="secondary"
                              className="bg-slate-950/40 text-indigo-400 border-white/5 shadow-inner shadow-black/10 px-3 py-2 gap-2 rounded-xl group transition-all"
                            >
                              <span className="text-xs font-bold">{t}</span>
                              <button
                                onClick={() =>
                                  setCurrentDemo({
                                    ...currentDemo,
                                    tech: currentDemo.tech.filter(
                                      (_, idx) => idx !== i,
                                    ),
                                  })
                                }
                                className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                              >
                                <FaTimes size={10} />
                              </button>
                            </Badge>
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
