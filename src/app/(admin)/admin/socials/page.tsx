"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  type DragStartEvent,
  type DragEndEvent,
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
  FaLink,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";

import { AdminDialogShell } from "../components/AdminDialogShell";
import { AdminField, AdminInput } from "../components/AdminFields";
import ImageUpload from "../components/ImageUpload";
import Image from "next/image";

interface SocialLink {
  _id?: string;
  href: string;
  label: string;
  iconUrl?: string;
  brandColor?: string;
  invertDark?: boolean;
  order: number;
}

// ─── Drag Overlay ghost card ──────────────────────────────────────────────────
function SocialOverlay({ item }: { item: SocialLink }) {
  return (
    <div className="flex items-center gap-4 bg-white dark:bg-slate-800 border border-cyan-500/30 rounded-2xl p-4 shadow-2xl scale-105 ring-1 ring-cyan-400/20 min-w-[320px]">
      <FaGripVertical className="text-cyan-500" size={14} />
      <div className="p-2 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-lg">
        {item.iconUrl ? (
          <Image
            src={item.iconUrl}
            alt={item.label}
            width={14}
            height={14}
            className="object-contain"
          />
        ) : (
          <FaLink size={14} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-slate-900 dark:text-white truncate text-sm">
          {item.label}
        </h3>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
          {item.href}
        </p>
      </div>
    </div>
  );
}

function SortableSocialRow({
  item,
  onEdit,
  onDelete,
  isDeleting,
}: {
  item: SocialLink;
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
    opacity: isDragging ? 0.35 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-4 bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 rounded-2xl p-2 transition-all duration-300 shadow-sm dark:shadow-none",
        isDragging && "z-50 border-cyan-500/50 shadow-2xl shadow-cyan-500/10",
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-cyan-500 transition-colors"
      >
        <FaGripVertical size={14} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-lg">
            {item.iconUrl ? (
              <Image
                src={item.iconUrl}
                alt={item.label}
                width={14}
                height={14}
                className="object-contain"
              />
            ) : (
              <FaLink size={14} />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-white truncate text-sm">
              {item.label}
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-medium">
              {item.href}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="h-8 w-8 rounded-lg text-slate-400 hover:text-cyan-500 hover:bg-cyan-500/10"
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

export default function AdminSocialsPage() {
  const queryClient = useQueryClient();
  const [data, setData] = useState<SocialLink[]>([]);
  const [prevFetchedData, setPrevFetchedData] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSocial, setCurrentSocial] = useState<SocialLink | null>(null);
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
    queryKey: ["socials"],
    queryFn: async () => {
      const r = await fetch("/api/admin/socials");
      if (!r.ok) throw new Error("Failed to fetch socials");
      return r.json();
    },
  });

  if (fetchedData !== prevFetchedData) {
    setPrevFetchedData(fetchedData);
    if (fetchedData) {
      setData(Array.isArray(fetchedData) ? fetchedData : []);
    }
  }

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/socials?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      return id;
    },
    onSuccess: (id) => {
      setData((prev) => prev.filter((s) => s._id !== id));
      queryClient.invalidateQueries({ queryKey: ["socials"] });
      showToast("Link deleted.");
      setDeletingId(null);
    },
    onError: () => {
      showToast("Failed to delete.", "error");
      setDeletingId(null);
    },
  });

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this social link?")) return;
    setDeletingId(id);
    deleteMutation.mutate(id);
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const oldIndex = data.findIndex((s) => s._id === active.id);
    const newIndex = data.findIndex((s) => s._id === over.id);

    const newData = arrayMove(data, oldIndex, newIndex);
    setData(newData);

    await fetch("/api/admin/socials", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newData),
    }).then(() => queryClient.invalidateQueries({ queryKey: ["socials"] }));
  };

  const saveMutation = useMutation({
    mutationFn: async (social: SocialLink) => {
      const isEdit = !!social._id;
      const url = isEdit
        ? `/api/admin/socials?id=${social._id}`
        : "/api/admin/socials";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(social),
      });
      if (!res.ok) throw new Error("Failed to save");
      return { isEdit };
    },
    onSuccess: ({ isEdit }) => {
      setIsDialogOpen(false);
      showToast(isEdit ? "Link updated!" : "Link added!");
      queryClient.invalidateQueries({ queryKey: ["socials"] });
    },
    onError: () => {
      showToast("Failed to save.", "error");
    },
  });

  async function handleAddOrUpdate() {
    if (!currentSocial?.label || !currentSocial?.href) return;
    saveMutation.mutate(currentSocial);
  }

  function openEdit(item?: SocialLink) {
    if (item) {
      setCurrentSocial({ ...item });
    } else {
      setCurrentSocial({
        href: "",
        label: "",
        invertDark: false,
        order: data.length,
      });
    }
    setIsDialogOpen(true);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
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
                className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest text-[10px]"
              >
                {data.length} Social Links
              </Badge>
            </div>
            <Button
              onClick={() => openEdit()}
              className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold px-6 h-10 shadow-lg shadow-cyan-600/20 active:scale-95 transition-all group text-xs"
            >
              <FaPlus className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Add Link
            </Button>
          </div>

          <Card className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-sm dark:shadow-none">
            <CardHeader className="p-4 pb-1">
              <CardTitle className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Social Connection
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-16 bg-slate-800/20 rounded-2xl animate-pulse"
                    />
                  ))}
                </div>
              ) : data.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-slate-950/20 rounded-3xl border border-dashed border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                  <FaLink
                    className="mx-auto text-slate-200 dark:text-slate-800 mb-4"
                    size={40}
                  />
                  <p className="text-slate-400 dark:text-slate-500 font-medium">
                    No social links found. Add your profiles above.
                  </p>
                </div>
              ) : (
                <SortableContext
                  items={data.map((s) => s._id!)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {data.map((item) => (
                        <SortableSocialRow
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
              )}

              {!loading && data.length > 0 && (
                <p className="text-center text-[10px] text-slate-400 dark:text-slate-700 mt-8 font-bold uppercase tracking-widest">
                  Drag rows to reorder • Changes save automatically
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <DragOverlay dropAnimation={null}>
          {activeId ? (
            <SocialOverlay item={data.find((s) => s._id === activeId)!} />
          ) : null}
        </DragOverlay>

        <AdminDialogShell
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title={currentSocial?._id ? "Update Link" : "Add Digital Node"}
          subtitle=""
          icon={FaLink}
          iconColor="text-cyan-400"
          accentColor="from-cyan-500/5 to-blue-500/5"
          onSave={handleAddOrUpdate}
          saving={saveMutation.isPending}
          saveLabel={currentSocial?._id ? "Update Link" : "Add Link"}
          savingLabel="Propagating..."
        >
          {currentSocial && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-6">
                <AdminField label="Display Label">
                  <AdminInput
                    value={currentSocial.label}
                    onChange={(e) =>
                      setCurrentSocial((prev) =>
                        prev ? { ...prev, label: e.target.value } : null,
                      )
                    }
                    placeholder="e.g. GitHub Profile"
                  />
                </AdminField>
              </div>

              <AdminField label="Destination URL">
                <AdminInput
                  icon={FaLink}
                  className="font-medium text-sm"
                  value={currentSocial.href}
                  onChange={(e) =>
                    setCurrentSocial((prev) =>
                      prev ? { ...prev, href: e.target.value } : null,
                    )
                  }
                  placeholder="https://social.network/profile"
                />
              </AdminField>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <ImageUpload
                    label="Custom Icon"
                    value={currentSocial.iconUrl || ""}
                    onChange={(url) =>
                      setCurrentSocial((prev) =>
                        prev ? { ...prev, iconUrl: url } : null,
                      )
                    }
                  />
                </div>
                <div className="space-y-4">
                  <AdminField label="Brand Color">
                    <AdminInput
                      value={currentSocial.brandColor || ""}
                      onChange={(e) =>
                        setCurrentSocial((prev) =>
                          prev ? { ...prev, brandColor: e.target.value } : null,
                        )
                      }
                      placeholder="e.g. hover:text-emerald-500"
                    />
                  </AdminField>

                  <div className="pt-2">
                    <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500"
                        checked={currentSocial.invertDark || false}
                        onChange={(e) =>
                          setCurrentSocial((prev) =>
                            prev ? { ...prev, invertDark: e.target.checked } : null,
                          )
                        }
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Invert in Dark Mode
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Turns black logos white in dark mode.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </AdminDialogShell>
      </div>
    </DndContext>
  );
}
