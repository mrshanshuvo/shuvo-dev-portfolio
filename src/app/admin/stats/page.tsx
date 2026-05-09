"use client";
import { useState, useEffect, useCallback } from "react";
import type { Stat } from "@/types";
import { FaPlus, FaTimes, FaCheck, FaSave, FaGripLines } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ─── Sortable row (each stat) ────────────────────────────────────────────────
interface RowProps {
  id: string;
  stat: Stat;
  index: number;
  onUpdate: (i: number, field: keyof Stat, val: string) => void;
  onRemove: (i: number) => void;
}

function SortableStatItem({ id, stat, index, onUpdate, onRemove }: RowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex gap-3 items-center p-4 bg-slate-950/40 rounded-2xl border border-white/5 mb-3 group"
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-400 transition-colors p-1 rounded-lg hover:bg-slate-800/60 shrink-0 touch-none"
        aria-label="Drag to reorder"
        type="button"
      >
        <FaGripLines size={14} />
      </button>

      {/* Order badge */}
      <span className="text-[10px] font-bold text-slate-600 w-5 text-center shrink-0">
        {index + 1}
      </span>

      {/* Number field */}
      <div className="w-24">
        <Input
          className="bg-slate-900/50 border-white/10 text-amber-400 font-black text-center rounded-xl"
          value={stat.number}
          onChange={(e) => onUpdate(index, "number", e.target.value)}
          placeholder="20+"
        />
      </div>

      {/* Label field */}
      <div className="flex-1">
        <Input
          className="bg-slate-900/50 border-white/10 text-white rounded-xl"
          value={stat.label}
          onChange={(e) => onUpdate(index, "label", e.target.value)}
          placeholder="Projects Finished"
        />
      </div>

      {/* Remove button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(index)}
        className="text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        type="button"
      >
        <FaTimes size={14} />
      </Button>
    </div>
  );
}

// ─── Drag Overlay card ───────────────────────────────────────────────────────
function StatOverlay({ stat }: { stat: Stat }) {
  return (
    <div className="w-full flex gap-3 items-center p-4 bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/10 ring-1 ring-amber-400/20">
      <FaGripLines size={14} className="text-amber-400/70 shrink-0" />
      <span className="w-5" />
      <div className="w-24">
        <div className="bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-amber-400 font-black text-center text-sm">
          {stat.number}
        </div>
      </div>
      <div className="flex-1">
        <div className="bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-white text-sm">
          {stat.label}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function AdminStatsPage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<number>(0);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        const loaded = Array.isArray(d) ? d : [];
        // Ensure each stat has an order field
        setStats(
          loaded.map((s: Stat, i: number) => ({ ...s, order: s.order ?? i })),
        );
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    const payload = stats.map((s, i) => ({ ...s, order: i }));
    const res = await fetch("/api/admin/stats", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      setLastSavedAt(Date.now());
      showToast("Stats saved!");
    } else {
      showToast("Failed to save.", "error");
    }
  }

  function addStat() {
    setStats((prev) => [
      ...prev,
      { number: "0", label: "New Stat", order: prev.length },
    ]);
  }

  const updateStat = useCallback(
    (i: number, field: keyof Stat, val: string) => {
      setStats((prev) => {
        const next = [...prev];
        next[i] = { ...next[i], [field]: val };
        return next;
      });
    },
    [],
  );

  const removeStat = useCallback((i: number) => {
    setStats((prev) => prev.filter((_, idx) => idx !== i));
  }, []);

  function handleDragStart(e: DragStartEvent) {
    setActiveId(e.active.id as string);
  }

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      setStats((prev) => {
        const oldIndex = prev.findIndex((_, i) => i.toString() === active.id);
        const newIndex = prev.findIndex((_, i) => i.toString() === over.id);
        return arrayMove(prev, oldIndex, newIndex).map((s, i) => ({
          ...s,
          order: i,
        }));
      });
    }
    setActiveId(null);
  }

  const activeStat = activeId !== null ? stats[Number(activeId)] : null;

  // Most recent updatedAt: prefer the local save timestamp (instant feedback),
  // falling back to the server's updatedAt on initial load.
  const serverUpdatedAt = stats
    .map((s) => (s.updatedAt ? new Date(s.updatedAt).getTime() : 0))
    .reduce((a, b) => Math.max(a, b), 0);
  const lastUpdated = Math.max(lastSavedAt, serverUpdatedAt);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
        {/* Toast notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3",
                toast.type === "success"
                  ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                  : "bg-red-500/20 border-red-500/50 text-red-400",
              )}
            >
              {toast.type === "success" ? <FaCheck /> : <FaTimes />}
              <span className="font-semibold">{toast.msg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-3xl mx-auto">
          {/* Page Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
                Stats
              </h1>
              <p className="text-slate-400">
                Showcase your growth and achievements in numbers.
              </p>
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold px-8 shadow-lg shadow-emerald-600/20"
            >
              <FaSave className={cn("mr-2", saving && "animate-spin")} />
              {saving ? "Saving..." : "Save Stats"}
            </Button>
          </header>

          <Card className="rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-white">
                    Milestones
                  </CardTitle>
                  {lastUpdated > 0 && (
                    <p className="text-[12px] text-slate-600 mt-0.5">
                      Last updated {new Date(lastUpdated).toLocaleString()}
                    </p>
                  )}
                </div>
                <Button
                  variant="outline"
                  onClick={addStat}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-white/5 rounded-xl"
                >
                  <FaPlus size={12} className="mr-2" /> Add Stat
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {/* Column labels */}
              {!loading && stats.length > 0 && (
                <div className="flex gap-3 items-center px-1 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                  <span className="w-5" />
                  <span className="w-5" />
                  <span className="w-24 text-center">Number</span>
                  <span className="flex-1">Label</span>
                  <span className="w-9" />
                </div>
              )}

              {/* Skeleton */}
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <motion.div
                      key={`skeleton-${i}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex gap-3 items-center p-4 bg-slate-950/20 rounded-2xl border border-white/5 animate-pulse"
                    >
                      <div className="w-6 h-4 bg-slate-800/60 rounded" />
                      <div className="w-24 h-9 bg-slate-800/40 rounded-xl" />
                      <div className="flex-1 h-9 bg-slate-800/20 rounded-xl" />
                      <div className="w-9 h-9 bg-slate-800/10 rounded-xl" />
                    </motion.div>
                  ))}
                </div>
              ) : (
                /* Sortable list – DndContext is at the top level */
                <SortableContext
                  items={stats.map((_, i) => i.toString())}
                  strategy={verticalListSortingStrategy}
                >
                  <AnimatePresence mode="popLayout">
                    {stats.map((stat, i) => (
                      <motion.div
                        key={stat._id ?? `stat-${i}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.18 }}
                      >
                        <SortableStatItem
                          id={i.toString()}
                          stat={stat}
                          index={i}
                          onUpdate={updateStat}
                          onRemove={removeStat}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </SortableContext>
              )}

              {!loading && stats.length === 0 && (
                <div className="text-center py-16 text-slate-600">
                  <p className="text-lg font-medium">No stats yet</p>
                  <p className="text-sm mt-1">
                    Click &ldquo;Add Stat&rdquo; to get started.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* DragOverlay lives outside all backdrop-blur/overflow containers so
          dnd-kit's fixed-position coordinate system is unaffected */}
      <DragOverlay dropAnimation={null}>
        {activeStat ? <StatOverlay stat={activeStat} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
