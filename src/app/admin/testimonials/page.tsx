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
  FaCheck,
  FaTimes,
  FaQuoteLeft,
  FaGripVertical,
  FaEdit,
  FaTrash,
  FaUser,
  FaBriefcase,
  FaBuilding,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ImageUpload from "../components/ImageUpload";
import { AdminDialogShell } from "../components/AdminDialogShell";
import {
  AdminField,
  AdminInput,
  AdminTextarea,
} from "../components/AdminFields";

interface Testimonial {
  _id?: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  order: number;
}

function SortableTestimonialRow({
  item,
  onEdit,
  onDelete,
  isDeleting,
}: {
  item: Testimonial;
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
        isDragging && "z-50 border-amber-500/50 shadow-2xl shadow-amber-500/10",
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-amber-500 transition-colors"
      >
        <FaGripVertical size={14} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          {item.avatar ? (
            <img
              src={item.avatar}
              alt={item.name}
              className="w-8 h-8 rounded-full object-cover border border-white/10"
            />
          ) : (
            <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full">
              <FaUser size={12} />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-white truncate text-sm">
              {item.name}
            </h3>
            <p className="text-[10px] text-slate-500 truncate uppercase tracking-widest">
              {item.role} {item.company && `at ${item.company}`}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="h-8 w-8 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-400/10"
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

export default function AdminTestimonialsPage() {
  const [data, setData] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] =
    useState<Testimonial | null>(null);
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
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    setLoading(true);
    const r = await fetch("/api/admin/testimonials");
    const d = await r.json();
    setData(Array.isArray(d) ? d : []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/testimonials?id=${id}`, {
      method: "DELETE",
    });
    setDeletingId(null);
    if (res.ok) {
      setData((prev) => prev.filter((s) => s._id !== id));
      showToast("Testimonial deleted.");
    } else {
      showToast("Failed to delete.", "error");
    }
  }

  async function handleAddOrUpdate() {
    if (!currentTestimonial?.name || !currentTestimonial?.content) return;
    setSaving(true);

    const isEdit = !!currentTestimonial._id;
    const url = isEdit
      ? `/api/admin/testimonials?id=${currentTestimonial._id}`
      : "/api/admin/testimonials";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentTestimonial),
    });

    setSaving(false);
    if (res.ok) {
      setIsDialogOpen(false);
      showToast(isEdit ? "Testimonial updated!" : "Testimonial added!");
      fetchTestimonials();
    } else {
      showToast("Failed to save.", "error");
    }
  }

  function openEdit(item: Testimonial) {
    setCurrentTestimonial({ ...item });
    setIsDialogOpen(true);
  }

  function openNew() {
    setCurrentTestimonial({
      name: "",
      role: "",
      company: "",
      content: "",
      avatar: "",
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
        fetch("/api/admin/testimonials", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newData),
        });
      }, 0);
    }
    setActiveId(null);
  }

  return (
    <div className="p-4 md:p-8 space-y-6 font-sans">
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
              className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest text-[10px]"
            >
              {data.length} Testimonials
            </Badge>
          </div>
          <Button
            onClick={openNew}
            className="bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold px-6 h-10 shadow-lg shadow-amber-600/20 active:scale-95 transition-all group text-xs"
          >
            <FaPlus className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Add Testimonial
          </Button>
        </div>

        <Card className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-sm dark:shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Client Feedback
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
                <FaQuoteLeft
                  className="mx-auto text-slate-200 dark:text-slate-800 mb-4"
                  size={40}
                />
                <p className="text-slate-400 dark:text-slate-500 font-medium">
                  No testimonials yet. Add your first client feedback above.
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
                        <SortableTestimonialRow
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
                    <div className="flex items-center gap-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-4 shadow-2xl opacity-90 scale-105">
                      <FaGripVertical className="text-amber-500" size={14} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-white truncate text-sm">
                          {data.find((s) => s._id === activeId)?.name}
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
        title={
          currentTestimonial?._id ? "Refine Feedback" : "Add Client Praise"
        }
        subtitle="Capture and showcase client satisfaction"
        icon={FaQuoteLeft}
        iconColor="text-amber-400"
        accentColor="from-amber-500/5 to-orange-500/5"
        onSave={handleAddOrUpdate}
        saving={saving}
        saveLabel={currentTestimonial?._id ? "Update Feedback" : "Add Praise"}
        savingLabel="Processing..."
        maxWidth="5xl"
      >
        {currentTestimonial && (
          <div className="px-1">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10">
              {/* Left Column: Client Identity */}
              <div className="space-y-6">
                <AdminField label="Client Avatar">
                  <ImageUpload
                    value={currentTestimonial.avatar}
                    onChange={(url) =>
                      setCurrentTestimonial({
                        ...currentTestimonial,
                        avatar: url,
                      })
                    }
                  />
                </AdminField>

                <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-3xl flex items-start gap-4">
                  <FaQuoteLeft
                    className="text-amber-400 shrink-0 mt-1"
                    size={16}
                  />
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-wider text-amber-400/90">
                      Client Feedback
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                      Adding a client photo increases the authenticity and trust
                      of the feedback. Use professional headshots for best
                      results.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Testimony Details */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <AdminField label="Client Name">
                    <AdminInput
                      icon={FaUser}
                      value={currentTestimonial.name}
                      onChange={(e) =>
                        setCurrentTestimonial({
                          ...currentTestimonial,
                          name: e.target.value,
                        })
                      }
                      placeholder="e.g. John Doe"
                    />
                  </AdminField>
                  <AdminField label="Job Role">
                    <AdminInput
                      icon={FaBriefcase}
                      value={currentTestimonial.role}
                      onChange={(e) =>
                        setCurrentTestimonial({
                          ...currentTestimonial,
                          role: e.target.value,
                        })
                      }
                      placeholder="e.g. CEO"
                    />
                  </AdminField>
                </div>

                <AdminField label="Company / Organization">
                  <AdminInput
                    icon={FaBuilding}
                    value={currentTestimonial.company}
                    onChange={(e) =>
                      setCurrentTestimonial({
                        ...currentTestimonial,
                        company: e.target.value,
                      })
                    }
                    placeholder="e.g. Future Labs Inc."
                  />
                </AdminField>

                <AdminField label="Testimonial Narrative">
                  <AdminTextarea
                    value={currentTestimonial.content}
                    onChange={(e) =>
                      setCurrentTestimonial({
                        ...currentTestimonial,
                        content: e.target.value,
                      })
                    }
                    placeholder="What they said about your work..."
                    className="min-h-[160px]"
                  />
                </AdminField>
              </div>
            </div>
          </div>
        )}
      </AdminDialogShell>
    </div>
  );
}
