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
  FaChartBar,
  FaGripVertical,
  FaEdit,
  FaTrash,
  FaHashtag,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AdminDialogShell } from "../components/AdminDialogShell";
import { AdminField, AdminInput } from "../components/AdminFields";

interface Stat {
  _id?: string;
  number: string;
  label: string;
  order: number;
}

function SortableStatRow({
  item,
  onEdit,
  onDelete,
  isDeleting,
}: {
  item: Stat;
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
        isDragging && "z-50 border-rose-500/50 shadow-2xl shadow-rose-500/10",
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-rose-500 transition-colors"
      >
        <FaGripVertical size={14} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg">
            <FaHashtag size={14} />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-white truncate text-sm">
              {item.label}
            </h3>
            <p className="text-xs text-rose-600 dark:text-rose-400 font-bold tracking-tight">
              {item.number}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-400/10"
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

export default function AdminStatsPage() {
  const [data, setData] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStat, setCurrentStat] = useState<Stat | null>(null);
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
    fetchStats();
  }, []);

  async function fetchStats() {
    setLoading(true);
    const r = await fetch("/api/admin/stats");
    const d = await r.json();
    setData(Array.isArray(d) ? d : []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this stat?")) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/stats?id=${id}`, {
      method: "DELETE",
    });
    setDeletingId(null);
    if (res.ok) {
      setData((prev) => prev.filter((s) => s._id !== id));
      showToast("Stat deleted.");
    } else {
      showToast("Failed to delete.", "error");
    }
  }

  async function handleAddOrUpdate() {
    if (!currentStat?.label || !currentStat?.number) return;
    setSaving(true);

    const isEdit = !!currentStat._id;
    const url = isEdit
      ? `/api/admin/stats?id=${currentStat._id}`
      : "/api/admin/stats";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentStat),
    });

    setSaving(false);
    if (res.ok) {
      setIsDialogOpen(false);
      showToast(isEdit ? "Stat updated!" : "Stat added!");
      fetchStats();
    } else {
      showToast("Failed to save.", "error");
    }
  }

  function openEdit(item: Stat) {
    setCurrentStat({ ...item });
    setIsDialogOpen(true);
  }

  function openNew() {
    setCurrentStat({
      label: "",
      number: "",
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
        fetch("/api/admin/stats", {
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
              className="bg-rose-500/10 text-rose-400 border-rose-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest text-[9px]"
            >
              {data.length} Portfolio Stats
            </Badge>
          </div>
          <Button
            onClick={openNew}
            className="bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold px-6 h-10 shadow-lg shadow-rose-600/20 active:scale-95 transition-all group text-xs"
          >
            <FaPlus className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Add Stat
          </Button>
        </div>

        <Card className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-sm dark:shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Platform Metrics
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
            ) : data.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-950/20 rounded-3xl border border-dashed border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                <FaChartBar
                  className="mx-auto text-slate-200 dark:text-slate-800 mb-4"
                  size={40}
                />
                <p className="text-slate-400 dark:text-slate-500 font-medium">
                  No stats found. Show off your numbers above.
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
                        <SortableStatRow
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
                    <div className="flex items-center gap-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-rose-500/30 rounded-2xl p-4 shadow-2xl opacity-90 scale-105">
                      <FaGripVertical className="text-rose-500" size={14} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-white truncate text-sm">
                          {data.find((s) => s._id === activeId)?.label}
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
        title={currentStat?._id ? "Adjust Metric" : "Forge New Milestone"}
        subtitle="Quantify your professional achievements"
        icon={FaChartBar}
        iconColor="text-rose-400"
        accentColor="from-rose-500/5 to-pink-500/5"
        onSave={handleAddOrUpdate}
        saving={saving}
        saveLabel={currentStat?._id ? "Update Metric" : "Establish Milestone"}
        savingLabel="Calibrating..."
        maxWidth="md"
      >
        {currentStat && (
          <div className="space-y-6">
            <AdminField label="Metric Description">
              <AdminInput
                icon={FaChartBar}
                value={currentStat.label}
                onChange={(e) =>
                  setCurrentStat({ ...currentStat, label: e.target.value })
                }
                placeholder="e.g. Years of Experience"
              />
            </AdminField>

            <AdminField label="Quantitative Value">
              <AdminInput
                className="font-black text-xl tracking-wider"
                value={currentStat.number}
                onChange={(e) =>
                  setCurrentStat({ ...currentStat, number: e.target.value })
                }
                placeholder="e.g. 5+, 100+, etc."
              />
            </AdminField>
          </div>
        )}
      </AdminDialogShell>
    </div>
  );
}
