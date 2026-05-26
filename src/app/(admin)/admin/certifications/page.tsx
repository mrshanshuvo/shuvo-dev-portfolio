"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
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
  FaCheck,
  FaTimes,
  FaAward,
  FaGripVertical,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaLink,
  FaInfoCircle,
  FaCertificate,
  FaUniversity,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ImageUpload from "../components/ImageUpload";
import { AdminDialogShell } from "../components/AdminDialogShell";
import { AdminField, AdminInput } from "../components/AdminFields";

interface Certification {
  _id?: string;
  title: string;
  issuer: string;
  date: string;
  link?: string;
  image?: string;
  details: string[];
  order: number;
}

function SortableCertRow({
  item,
  onEdit,
  onDelete,
  isDeleting,
}: {
  item: Certification;
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
        "group flex items-center gap-4 bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 rounded-2xl p-2 transition-all duration-300 shadow-sm dark:shadow-none",
        isDragging && "z-50 border-amber-500/50 shadow-2xl shadow-amber-500/10",
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
      >
        <FaGripVertical size={14} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          {item.image ? (
            <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-white/5 shrink-0">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-contain p-1"
              />
            </div>
          ) : (
            <div className="p-2 bg-yellow-500/10 text-yellow-400 rounded-lg">
              <FaAward size={14} />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-white truncate text-sm">
              {item.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {item.issuer}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 pr-2">
        <div className="hidden md:flex items-center gap-2 text-slate-500">
          <FaCalendarAlt size={10} />
          <span className="text-[10px] font-medium">{item.date}</span>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-8 w-8 rounded-lg text-slate-400 hover:text-yellow-400 hover:bg-yellow-400/10"
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
}

export default function AdminCertificationsPage() {
  const queryClient = useQueryClient();
  const [data, setData] = useState<Certification[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCert, setCurrentCert] = useState<Certification | null>(null);
  const [skillInput, setSkillInput] = useState("");
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
    queryKey: ["certifications"],
    queryFn: async () => {
      const r = await fetch("/api/admin/certifications");
      if (!r.ok) throw new Error("Failed to fetch certifications");
      return r.json();
    },
  });

  useEffect(() => {
    if (fetchedData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setData(Array.isArray(fetchedData) ? fetchedData : []);
    }
  }, [fetchedData]);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/certifications?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      return id;
    },
    onSuccess: (id) => {
      setData((prev) => prev.filter((s) => s._id !== id));
      queryClient.invalidateQueries({ queryKey: ["certifications"] });
      showToast("Certification deleted.");
      setDeletingId(null);
    },
    onError: () => {
      showToast("Failed to delete.", "error");
      setDeletingId(null);
    },
  });

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this certification?")) return;
    setDeletingId(id);
    deleteMutation.mutate(id);
  }

  const saveMutation = useMutation({
    mutationFn: async (cert: Certification) => {
      const isEdit = !!cert._id;
      const url = isEdit
        ? `/api/admin/certifications?id=${cert._id}`
        : "/api/admin/certifications";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cert),
      });
      if (!res.ok) throw new Error("Failed to save");
      return { isEdit };
    },
    onSuccess: ({ isEdit }) => {
      setIsDialogOpen(false);
      showToast(isEdit ? "Certification updated!" : "Certification added!");
      queryClient.invalidateQueries({ queryKey: ["certifications"] });
    },
    onError: () => {
      showToast("Failed to save.", "error");
    },
  });

  async function handleAddOrUpdate() {
    if (!currentCert?.title || !currentCert?.issuer) return;
    saveMutation.mutate(currentCert);
  }

  function openEdit(item: Certification) {
    setCurrentCert({
      ...item,
      details: item.details || [],
    });
    setIsDialogOpen(true);
  }

  function openNew() {
    setCurrentCert({
      title: "",
      issuer: "",
      date: "",
      link: "",
      details: [],
      image: "",
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
      fetch("/api/admin/certifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      }).then(() =>
        queryClient.invalidateQueries({ queryKey: ["certifications"] }),
      );
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
              {data.length} Certifications
            </Badge>
          </div>
          <Button
            onClick={openNew}
            className="bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl font-bold px-6 h-10 shadow-lg shadow-yellow-600/20 active:scale-95 transition-all group text-xs"
          >
            <FaPlus className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Add Certification
          </Button>
        </div>

        <Card className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-sm dark:shadow-none">
          <CardHeader className="p-4 pb-1">
            <CardTitle className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Professional Credentials
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
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
                <FaAward
                  className="mx-auto text-slate-200 dark:text-slate-800 mb-4"
                  size={40}
                />
                <p className="text-slate-400 dark:text-slate-500 font-medium">
                  No certifications found. Add your achievements above.
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
                        <SortableCertRow
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
        title={
          currentCert?._id ? "Refine Credential" : "New Professional Honor"
        }
        subtitle="Validate your expertise with verified certifications"
        icon={FaAward}
        iconColor="text-yellow-400"
        accentColor="from-yellow-500/5 to-amber-500/5"
        onSave={handleAddOrUpdate}
        saving={saveMutation.isPending}
        saveLabel={currentCert?._id ? "Update Credential" : "Establish Honor"}
        savingLabel="Processing..."
        maxWidth="5xl"
      >
        {currentCert && (
          <div className="px-1">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10">
              {/* Left Column: Image/Badge */}
              <div className="space-y-6">
                <AdminField label="Certificate Badge">
                  <ImageUpload
                    value={currentCert.image || ""}
                    onChange={(url) =>
                      setCurrentCert({ ...currentCert, image: url })
                    }
                  />
                </AdminField>
              </div>

              {/* Right Column: Information Fields */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <AdminField label="Certification Title">
                    <AdminInput
                      icon={FaCertificate}
                      value={currentCert.title}
                      onChange={(e) =>
                        setCurrentCert({
                          ...currentCert,
                          title: e.target.value,
                        })
                      }
                      placeholder="e.g. AWS Solutions Architect"
                    />
                  </AdminField>
                  <AdminField label="Issuing Authority">
                    <AdminInput
                      icon={FaUniversity}
                      value={currentCert.issuer}
                      onChange={(e) =>
                        setCurrentCert({
                          ...currentCert,
                          issuer: e.target.value,
                        })
                      }
                      placeholder="e.g. Amazon Web Services"
                    />
                  </AdminField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <AdminField label="Date Issued">
                    <AdminInput
                      icon={FaCalendarAlt}
                      value={currentCert.date}
                      onChange={(e) =>
                        setCurrentCert({ ...currentCert, date: e.target.value })
                      }
                      placeholder="e.g. June 2023"
                    />
                  </AdminField>
                  <AdminField label="Credential URL">
                    <AdminInput
                      icon={FaLink}
                      value={currentCert.link}
                      onChange={(e) =>
                        setCurrentCert({ ...currentCert, link: e.target.value })
                      }
                      placeholder="https://verify.certification.com"
                    />
                  </AdminField>
                </div>

                <AdminField label="Key Skills & Competencies">
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <AdminInput
                        icon={FaInfoCircle}
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (skillInput.trim()) {
                              setCurrentCert({
                                ...currentCert,
                                details: [
                                  ...currentCert.details,
                                  skillInput.trim(),
                                ],
                              });
                              setSkillInput("");
                            }
                          }
                        }}
                        placeholder="e.g. Cloud Computing..."
                        className="h-11 text-sm"
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          if (skillInput.trim()) {
                            setCurrentCert({
                              ...currentCert,
                              details: [
                                ...currentCert.details,
                                skillInput.trim(),
                              ],
                            });
                            setSkillInput("");
                          }
                        }}
                        className="h-12 px-4 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl font-bold border border-slate-200 dark:border-white/5 shadow-inner shadow-black/5 dark:shadow-black/20"
                      >
                        <FaPlus size={12} />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(currentCert.details || []).map((detail, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20 px-3 py-1.5 gap-2 rounded-xl group transition-all shadow-sm dark:shadow-none"
                        >
                          <span className="text-xs">{detail}</span>
                          <button
                            onClick={() =>
                              setCurrentCert({
                                ...currentCert,
                                details: currentCert.details.filter(
                                  (_, idx) => idx !== i,
                                ),
                              })
                            }
                            className="hover:text-red-400 transition-colors"
                          >
                            <FaTimes size={10} />
                          </button>
                        </Badge>
                      ))}
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
