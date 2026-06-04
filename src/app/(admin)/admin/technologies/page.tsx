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
import Image from "next/image";

import { Button } from "@/components/ui/button";
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 min-h-20 p-2">
                {technologies.map((t) => (
                  <div
                    key={t._id}
                    className="relative group bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-2xl cursor-default"
                  >
                    {/* Dynamic Brand Glow */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                      style={{ backgroundColor: t.brandColor || "#3b82f6" }}
                    />

                    {/* Top border accent */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1 opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ backgroundColor: t.brandColor || "#3b82f6" }}
                    />

                    {/* Icon */}
                    <div className="relative w-12 h-12 flex items-center justify-center bg-white rounded-xl border border-slate-200 shadow-sm group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                      {t.iconUrl ? (
                        <Image
                          src={t.iconUrl}
                          alt={t.name}
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      ) : (
                        <FaCode className="text-slate-400" size={20} />
                      )}
                    </div>

                    {/* Name */}
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 text-center truncate w-full z-10">
                      {t.name}
                    </span>

                    {/* Action Buttons Overlay */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-80 transition-all duration-300 flex items-center justify-center gap-3 z-20">
                      <button
                        onClick={() => openEdit(t)}
                        className="h-8 w-8 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                      >
                        <FaEdit size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(t._id!)}
                        className="h-8 w-8 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                ))}
                {technologies.length === 0 && (
                  <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400">
                    <FaCode size={32} className="mb-4 opacity-20" />
                    <p className="text-xs uppercase tracking-widest font-bold">
                      No technologies registered
                    </p>
                  </div>
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
        subtitle=""
        icon={FaCode}
        iconColor="text-blue-400"
        accentColor="from-blue-500/5 to-cyan-500/5"
        onSave={handleAddOrUpdate}
        saving={saveMutation.isPending}
        saveLabel={currentTech?._id ? "Update Tech" : "Save Tech"}
        savingLabel="Processing..."
        maxWidth="xl"
      >
        {currentTech && (
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-40 shrink-0">
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
            <div className="flex-1 w-full">
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
            </div>
          </div>
        )}
      </AdminDialogShell>
    </div>
  );
}
