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
  FaGripVertical,
  FaEdit,
  FaTrash,
  FaServicestack,
  FaBriefcase,
  FaMagic,
} from "react-icons/fa";
import { AdminDialogShell } from "../components/AdminDialogShell";
import {
  AdminField,
  AdminInput,
  AdminTextarea,
} from "../components/AdminFields";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Service {
  _id?: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  order: number;
}

function SortableServiceRow({
  service,
  onEdit,
  onDelete,
  isDeleting,
}: {
  service: Service;
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
  } = useSortable({ id: service._id! });

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
          "z-50 border-emerald-500/50 shadow-2xl shadow-emerald-500/10",
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-emerald-500 transition-colors"
      >
        <FaGripVertical size={14} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <FaServicestack size={14} />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-white truncate text-sm">
              {service.title}
            </h3>
          </div>
          <Badge
            variant="secondary"
            className="bg-slate-100 dark:bg-white/5 text-[10px] text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none"
          >
            {service.features.length} Features
          </Badge>
        </div>
        <p className="text-xs text-slate-500 mt-1 truncate max-w-md">
          {service.description}
        </p>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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

export default function AdminServicesPage() {
  const [data, setData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [featureInput, setFeatureInput] = useState("");
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
    fetchServices();
  }, []);

  async function fetchServices() {
    setLoading(true);
    const r = await fetch("/api/admin/services");
    const d = await r.json();
    setData(Array.isArray(d) ? d : []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this service?")) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/services?id=${id}`, {
      method: "DELETE",
    });
    setDeletingId(null);
    if (res.ok) {
      setData((prev) => prev.filter((s) => s._id !== id));
      showToast("Service deleted.");
    } else {
      showToast("Failed to delete.", "error");
    }
  }

  async function handleAddOrUpdate() {
    if (!currentService?.title) return;
    setSaving(true);

    const isEdit = !!currentService._id;
    const url = isEdit
      ? `/api/admin/services?id=${currentService._id}`
      : "/api/admin/services";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentService),
    });

    setSaving(false);
    if (res.ok) {
      setIsDialogOpen(false);
      showToast(isEdit ? "Service updated!" : "Service added!");
      fetchServices();
    } else {
      showToast("Failed to save.", "error");
    }
  }

  function openEdit(service: Service) {
    setCurrentService({ ...service });
    setIsDialogOpen(true);
  }

  function openNew() {
    setCurrentService({
      title: "",
      description: "",
      icon: "FaCode",
      features: [],
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
        fetch("/api/admin/services", {
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
              className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest text-[9px]"
            >
              {data.length} Services
            </Badge>
          </div>
          <Button
            onClick={openNew}
            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold px-6 h-10 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all group text-xs"
          >
            <FaPlus className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Add Service
          </Button>
        </div>

        <Card className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-sm dark:shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Service Portfolio
            </CardTitle>
          </CardHeader>
          <CardContent>
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
              <div className="text-center py-20 bg-white dark:bg-slate-950/20 rounded-3xl border border-dashed border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                <FaServicestack
                  className="mx-auto text-slate-200 dark:text-slate-800 mb-4"
                  size={40}
                />
                <p className="text-slate-400 dark:text-slate-500 font-medium">
                  No services found. Add your first service above.
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
                      {data.map((service) => (
                        <SortableServiceRow
                          key={service._id}
                          service={service}
                          onEdit={() => openEdit(service)}
                          onDelete={() => handleDelete(service._id!)}
                          isDeleting={deletingId === service._id}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </SortableContext>

                <DragOverlay dropAnimation={null}>
                  {activeId ? (
                    <div className="flex items-center gap-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-4 shadow-2xl opacity-90 scale-105">
                      <FaGripVertical className="text-emerald-500" size={14} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-white truncate">
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
      </div>{" "}
      <AdminDialogShell
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={currentService?._id ? "Refine Solution" : "New Service Offering"}
        subtitle="Define high-impact solutions for your clients"
        icon={FaBriefcase}
        iconColor="text-emerald-400"
        accentColor="from-emerald-500/5 to-cyan-500/5"
        onSave={handleAddOrUpdate}
        saving={saving}
        saveLabel={
          currentService?._id ? "Update Solution" : "Finalize Offering"
        }
        savingLabel="Engineering..."
        maxWidth="2xl"
      >
        {currentService && (
          <div className="space-y-8 max-h-[60vh] overflow-y-auto px-1 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AdminField label="Service Title">
                <AdminInput
                  icon={FaBriefcase}
                  value={currentService.title}
                  onChange={(e) =>
                    setCurrentService({
                      ...currentService,
                      title: e.target.value,
                    })
                  }
                  placeholder="e.g. Web Development"
                />
              </AdminField>
              <AdminField label="Visual Identifier (Icon)">
                <AdminInput
                  icon={FaMagic}
                  value={currentService.icon}
                  onChange={(e) =>
                    setCurrentService({
                      ...currentService,
                      icon: e.target.value,
                    })
                  }
                  placeholder="FaCode, FaDatabase..."
                />
              </AdminField>
            </div>

            <AdminField label="Service Value Proposition">
              <AdminTextarea
                className="min-h-[120px]"
                value={currentService.description}
                onChange={(e) =>
                  setCurrentService({
                    ...currentService,
                    description: e.target.value,
                  })
                }
                placeholder="Describe the unique value you provide..."
              />
            </AdminField>

            <AdminField label="Core Capabilities">
              <div className="space-y-6">
                <div className="flex gap-3">
                  <AdminInput
                    icon={FaMagic}
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (featureInput.trim()) {
                          setCurrentService({
                            ...currentService,
                            features: [
                              ...currentService.features,
                              featureInput.trim(),
                            ],
                          });
                          setFeatureInput("");
                        }
                      }
                    }}
                    placeholder="e.g. Responsive UI Design..."
                    className="h-14"
                  />
                  <Button
                    onClick={() => {
                      if (featureInput.trim()) {
                        setCurrentService({
                          ...currentService,
                          features: [
                            ...currentService.features,
                            featureInput.trim(),
                          ],
                        });
                        setFeatureInput("");
                      }
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-white rounded-2xl h-14 px-6 border border-white/5 font-bold"
                  >
                    Add
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <AnimatePresence mode="popLayout">
                    {currentService.features.map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, x: 20 }}
                        className="flex items-center gap-4 p-4 bg-slate-950/50 border border-white/5 rounded-2xl group/item"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 shrink-0" />
                        <span className="text-sm text-slate-300 flex-1 font-medium">
                          {feature}
                        </span>
                        <button
                          onClick={() =>
                            setCurrentService({
                              ...currentService,
                              features: currentService.features.filter(
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
    </div>
  );
}
