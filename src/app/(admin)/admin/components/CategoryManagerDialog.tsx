"use client";
import { useState, useEffect } from "react";
import {
  FaPlus,
  FaTrash,
  FaArrowUp,
  FaArrowDown,
  FaLayerGroup,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface CategoryManagerDialogProps {
  onUpdate?: () => void;
}

export default function CategoryManagerDialog({
  onUpdate,
}: CategoryManagerDialogProps) {
  const [data, setData] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  const fetchCats = () => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => {
        setData(Array.isArray(d) ? d : []);
      });
  };

  useEffect(() => {
    fetchCats();
  }, []);

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/admin/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    if (res.ok) {
      showToast("Taxonomy synchronized!");
      if (onUpdate) onUpdate();
    } else {
      showToast("Failed to save records.", "error");
    }
  }

  function addCategory() {
    setData((prev) => [
      ...prev,
      { name: "New Category", slug: "", order: prev.length },
    ]);
  }

  function updateCategory(i: number, field: keyof Category, val: any) {
    setData((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: val };
      return next;
    });
  }

  function move(i: number, dir: "up" | "down") {
    const next = [...data];
    const target = dir === "up" ? i - 1 : i + 1;
    if (target < 0 || target >= next.length) return;
    [next[i], next[target]] = [next[target], next[i]];
    setData(next);
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="h-10 px-4 text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 hover:bg-emerald-500/10 rounded-xl transition-all border border-emerald-500/20 dark:border-emerald-500/30"
          >
            <FaPlus className="mr-2" /> Manage Categories
          </Button>
        }
      />
      <DialogContent className="max-w-2xl bg-white dark:bg-slate-950 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-2xl p-8 max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <DialogHeader className="mb-6">
          <div className="flex items-center gap-3 text-emerald-400 mb-2">
            <FaLayerGroup size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              System Taxonomy
            </span>
          </div>
          <DialogTitle className="text-3xl font-black tracking-tight flex items-center justify-between">
            Categories
            <Button
              onClick={addCategory}
              variant="outline"
              size="sm"
              className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/5 rounded-xl h-9 px-4 font-bold text-slate-700 dark:text-slate-200"
            >
              <FaPlus className="mr-2" /> Add
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {data.map((cat, i) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 p-4 rounded-2xl flex items-center gap-4 hover:border-slate-300 dark:hover:border-white/10 transition-all"
              >
                <div className="flex-1">
                  <Input
                    className="bg-transparent border-none p-0 h-7 text-sm font-bold text-slate-900 dark:text-white focus-visible:ring-0"
                    value={cat.name}
                    onChange={(e) => updateCategory(i, "name", e.target.value)}
                    placeholder="Category Name..."
                  />
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => move(i, "up")}
                    disabled={i === 0}
                    className="h-8 w-8 text-slate-600 hover:text-white"
                  >
                    <FaArrowUp size={10} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => move(i, "down")}
                    disabled={i === data.length - 1}
                    className="h-8 w-8 text-slate-600 hover:text-white"
                  >
                    <FaArrowDown size={10} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setData((prev) => prev.filter((_, idx) => idx !== i))
                    }
                    className="h-8 w-8 text-slate-600 hover:text-red-400 hover:bg-red-400/10"
                  >
                    <FaTrash size={10} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {data.length === 0 && (
            <div className="py-12 text-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl bg-slate-50/50 dark:bg-transparent">
              <p className="text-slate-500 text-sm">No categories defined.</p>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            {data.length} Total Categories
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-11 px-6 font-black shadow-lg shadow-emerald-600/20"
          >
            {saving ? "Syncing..." : "Apply Changes"}
          </Button>
        </div>

        {/* Toast Overlay */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg border text-xs font-bold backdrop-blur-xl shadow-xl",
                toast.type === "success"
                  ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                  : "bg-red-500/20 border-red-500/50 text-red-400",
              )}
            >
              {toast.msg}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
