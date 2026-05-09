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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import MediaGalleryManager from "../components/MediaGalleryManager";

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
        "group flex items-center gap-4 bg-slate-900/40 backdrop-blur-xl border border-white/5 hover:border-white/10 rounded-2xl p-4 transition-all duration-300",
        isDragging && "z-50 border-indigo-500/50 shadow-2xl shadow-indigo-500/10",
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-600 hover:text-indigo-400 transition-colors"
      >
        <FaGripVertical size={14} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <FaFlask size={14} />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-white truncate text-sm">{item.title}</h3>
            <div className="flex gap-1 mt-0.5">
              {item.tech.slice(0, 3).map((t, i) => (
                <span key={i} className="text-[9px] text-slate-500 font-medium px-1.5 py-0.5 bg-white/5 rounded border border-white/5">
                  {t}
                </span>
              ))}
              {item.tech.length > 3 && <span className="text-[9px] text-slate-600">+{item.tech.length - 3}</span>}
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
            <div className={cn("p-1.5 rounded-full", toast.type === "success" ? "bg-emerald-500/20" : "bg-red-500/20")}>
              {toast.type === "success" ? <FaCheck size={10} /> : <FaTimes size={10} />}
            </div>
            <span className="font-bold text-sm tracking-tight">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest text-[9px]">
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

        <Card className="rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-white">
              Experimental Playground
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 bg-slate-800/20 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : data.length === 0 ? (
              <div className="text-center py-20 bg-slate-950/20 rounded-3xl border border-dashed border-white/5">
                <FaFlask className="mx-auto text-slate-800 mb-4" size={40} />
                <p className="text-slate-500 font-medium">No demos yet. Share your experiments above.</p>
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
                    <div className="flex items-center gap-4 bg-slate-800/90 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-4 shadow-2xl opacity-90 scale-105">
                      <FaGripVertical className="text-indigo-400" size={14} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white truncate text-sm">
                          {data.find(s => s._id === activeId)?.title}
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
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-3xl rounded-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {currentDemo?._id ? "Edit Playground Demo" : "Create New Demo"}
            </DialogTitle>
          </DialogHeader>
          
          {currentDemo && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                    Demo Title
                  </label>
                  <Input
                    className="bg-slate-950 border-white/5 rounded-xl focus:border-indigo-500/50"
                    value={currentDemo.title}
                    onChange={(e) => setCurrentDemo({...currentDemo, title: e.target.value})}
                    placeholder="e.g. AI-Powered Chatbot"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                    Live URL
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">
                      <FaLink size={14} />
                    </div>
                    <Input
                      className="bg-slate-950 border-white/5 rounded-xl focus:border-indigo-500/50 pl-11"
                      value={currentDemo.url}
                      onChange={(e) => setCurrentDemo({...currentDemo, url: e.target.value})}
                      placeholder="https://playground..."
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                  Description
                </label>
                <Textarea
                  className="bg-slate-950 border-white/5 rounded-xl min-h-[100px] focus:border-indigo-500/50"
                  value={currentDemo.description}
                  onChange={(e) => setCurrentDemo({...currentDemo, description: e.target.value})}
                  placeholder="What is this experiment about?..."
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                  Technologies Used
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">
                      <FaCode size={14} />
                    </div>
                    <Input
                      className="bg-slate-950 border-white/5 rounded-xl focus:border-indigo-500/50 pl-11"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (techInput.trim()) {
                            setCurrentDemo({
                              ...currentDemo,
                              tech: [...currentDemo.tech, techInput.trim()]
                            });
                            setTechInput("");
                          }
                        }
                      }}
                      placeholder="Add tech and press Enter..."
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-xl border-white/10"
                    onClick={() => {
                      if (techInput.trim()) {
                        setCurrentDemo({
                          ...currentDemo,
                          tech: [...currentDemo.tech, techInput.trim()]
                        });
                        setTechInput("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {currentDemo.tech.map((t, i) => (
                    <Badge key={i} variant="secondary" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 pr-1 py-1 gap-2">
                      {t}
                      <button
                        onClick={() => setCurrentDemo({
                          ...currentDemo,
                          tech: currentDemo.tech.filter((_, idx) => idx !== i)
                        })}
                        className="hover:text-red-400 p-0.5"
                      >
                        <FaTimes size={10} />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                  Media Gallery
                </label>
                <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex items-start gap-3 mb-4">
                  <FaInfoCircle className="text-indigo-400 shrink-0 mt-0.5" size={14} />
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    You can add multiple images or videos to showcase your experiment.
                  </p>
                </div>
                <MediaGalleryManager
                  media={currentDemo.media}
                  onChange={(newMedia) => setCurrentDemo({...currentDemo, media: newMedia})}
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setIsDialogOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddOrUpdate}
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-8 font-bold"
            >
              {saving ? "Saving..." : currentDemo?._id ? "Update Demo" : "Create Demo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
