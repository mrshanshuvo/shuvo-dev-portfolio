"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FaPlus,
  FaTimes,
  FaCheck,
  FaCode,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
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
import { AdminField, AdminInput } from "../components/AdminFields";
import ImageUpload from "../components/ImageUpload";
import type { Technology } from "@/types";

export default function AdminTechnologiesPage() {
  const queryClient = useQueryClient();
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [prevData, setPrevData] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTech, setCurrentTech] = useState<Technology | null>(null);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  const { data, isLoading: loading } = useQuery({
    queryKey: ["technologies"],
    queryFn: async () => {
      const r = await fetch("/api/admin/technologies");
      if (!r.ok) throw new Error("Failed to fetch technologies");
      return r.json();
    },
  });

  if (data !== prevData) {
    setPrevData(data);
    if (data) {
      setTechnologies(Array.isArray(data) ? data : []);
    }
  }

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/technologies?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      return id;
    },
    onSuccess: (id) => {
      setTechnologies((prev) => prev.filter((t) => t._id !== id));
      queryClient.invalidateQueries({ queryKey: ["technologies"] });
      showToast("Technology deleted.");
    },
    onError: () => {
      showToast("Failed to delete.", "error");
    },
  });

  async function handleDelete(id: string) {
    deleteMutation.mutate(id);
  }

  const saveMutation = useMutation({
    mutationFn: async (tech: Technology) => {
      const isEdit = !!tech._id;
      const url = isEdit
        ? `/api/admin/technologies?id=${tech._id}`
        : "/api/admin/technologies";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tech),
      });
      if (!res.ok) throw new Error("Failed to save");
      return { isEdit };
    },
    onSuccess: ({ isEdit }) => {
      setIsDialogOpen(false);
      showToast(isEdit ? "Technology updated!" : "Technology added!");
      queryClient.invalidateQueries({ queryKey: ["technologies"] });
    },
    onError: () => {
      showToast("Failed to save.", "error");
    },
  });

  async function handleAddOrUpdate() {
    if (!currentTech?.name || !currentTech?.iconUrl) {
      showToast("Name and Icon are required", "error");
      return;
    }
    saveMutation.mutate(currentTech);
  }

  function openEdit(tech: Technology) {
    setCurrentTech({ ...tech });
    setIsDialogOpen(true);
  }

  function openNew() {
    setCurrentTech({ name: "", iconUrl: "" });
    setIsDialogOpen(true);
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
        <Card className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-sm dark:shadow-none animate-in fade-in duration-700">
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
                onClick={openNew}
                className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold px-4 h-9 shadow-lg shadow-blue-600/20 text-xs active:scale-95 transition-all cursor-pointer"
              >
                <FaPlus className="mr-1.5" size={10} /> Add Tech
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            {loading ? (
              <div className="flex gap-2 p-4">
                <div className="h-10 w-24 bg-slate-100 dark:bg-slate-800/20 rounded-xl animate-pulse" />
                <div className="h-10 w-24 bg-slate-100 dark:bg-slate-800/20 rounded-xl animate-pulse" />
              </div>
            ) : (
              <div className="flex flex-wrap gap-2.5 min-h-20 p-4 bg-slate-50 dark:bg-slate-950/20 rounded-2xl border border-slate-200 dark:border-white/5">
                {technologies.map((t) => (
                  <Badge
                    key={t._id}
                    variant="outline"
                    className="pl-3 pr-2 py-2 gap-2 bg-white dark:bg-slate-950 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 rounded-xl group shadow-sm dark:shadow-none hover:scale-102 transition-transform cursor-default"
                    style={{ borderLeft: `3px solid #10B981` }}
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
            )}
          </CardContent>
        </Card>
      </div>

      <AdminDialogShell
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={currentTech?._id ? "Edit Technology" : "Add Technology"}
        subtitle="Upload a tech brand logo"
        icon={FaCode}
        iconColor="text-blue-400"
        accentColor="from-blue-500/5 to-cyan-500/5"
        onSave={handleAddOrUpdate}
        saving={saveMutation.isPending}
        saveLabel={currentTech?._id ? "Update Tech" : "Save Tech"}
        savingLabel="Processing..."
        maxWidth="3xl"
      >
        {currentTech && (
          <div className="px-1 space-y-6">
            <AdminField label="Technology Name">
              <AdminInput
                icon={FaCode}
                value={currentTech.name}
                onChange={(e) =>
                  setCurrentTech((prev) =>
                    prev ? { ...prev, name: e.target.value } : null,
                  )
                }
                placeholder="e.g. React"
              />
            </AdminField>
            <AdminField label="Logo (SVG/PNG)">
              <ImageUpload
                value={currentTech.iconUrl || ""}
                onChange={(val) =>
                  setCurrentTech((prev) =>
                    prev ? { ...prev, iconUrl: val } : null,
                  )
                }
              />
            </AdminField>
          </div>
        )}
      </AdminDialogShell>
    </div>
  );
}
