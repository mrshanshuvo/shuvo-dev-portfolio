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
  FaNewspaper,
  FaGripVertical,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaLink,
  FaTag,
  FaBookOpen,
  FaInfoCircle,
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

interface Blog {
  _id?: string;
  title: string;
  description: string;
  link: string;
  date: string;
  tags: string[];
  image: string;
  order: number;
}

function SortableBlogRow({
  item,
  onEdit,
  onDelete,
  isDeleting,
}: {
  item: Blog;
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
        isDragging &&
          "z-50 border-orange-500/50 shadow-2xl shadow-orange-500/10",
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-orange-500 transition-colors"
      >
        <FaGripVertical size={14} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="w-12 h-8 rounded-lg object-cover border border-white/10"
            />
          ) : (
            <div className="p-2 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-lg">
              <FaNewspaper size={14} />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-white truncate text-sm">
              {item.title}
            </h3>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                <FaCalendarAlt size={8} /> {item.date}
              </span>
              <div className="flex gap-1">
                {item.tags.slice(0, 2).map((tag, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="bg-white/5 text-[8px] text-slate-400 h-4 px-1.5 border-white/5 uppercase tracking-tighter"
                  >
                    {tag}
                  </Badge>
                ))}
                {item.tags.length > 2 && (
                  <span className="text-[8px] text-slate-600">
                    +{item.tags.length - 2}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="h-8 w-8 rounded-lg text-slate-400 hover:text-orange-400 hover:bg-orange-400/10"
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

export default function AdminBlogsPage() {
  const [data, setData] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);
  const [tagInput, setTagInput] = useState("");
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
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    setLoading(true);
    const r = await fetch("/api/admin/blogs");
    const d = await r.json();
    setData(Array.isArray(d) ? d : []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/blogs?id=${id}`, {
      method: "DELETE",
    });
    setDeletingId(null);
    if (res.ok) {
      setData((prev) => prev.filter((s) => s._id !== id));
      showToast("Post deleted.");
    } else {
      showToast("Failed to delete.", "error");
    }
  }

  async function handleAddOrUpdate() {
    if (!currentBlog?.title || !currentBlog?.link) return;
    setSaving(true);

    const isEdit = !!currentBlog._id;
    const url = isEdit
      ? `/api/admin/blogs?id=${currentBlog._id}`
      : "/api/admin/blogs";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentBlog),
    });

    setSaving(false);
    if (res.ok) {
      setIsDialogOpen(false);
      showToast(isEdit ? "Post updated!" : "Post added!");
      fetchBlogs();
    } else {
      showToast("Failed to save.", "error");
    }
  }

  function openEdit(item: Blog) {
    setCurrentBlog({ ...item });
    setIsDialogOpen(true);
  }

  function openNew() {
    setCurrentBlog({
      title: "",
      description: "",
      link: "",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      tags: [],
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
      setTimeout(() => {
        fetch("/api/admin/blogs", {
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
              className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest text-[9px]"
            >
              {data.length} Blog Posts
            </Badge>
          </div>
          <Button
            onClick={openNew}
            className="bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold px-6 h-10 shadow-lg shadow-orange-600/20 active:scale-95 transition-all group text-xs"
          >
            <FaPlus className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
            New Post
          </Button>
        </div>

        <Card className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-sm dark:shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Article Management
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
                <FaNewspaper
                  className="mx-auto text-slate-200 dark:text-slate-800 mb-4"
                  size={40}
                />
                <p className="text-slate-400 dark:text-slate-500 font-medium">
                  No blog posts found. Share your first story above.
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
                        <SortableBlogRow
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
                    <div className="flex items-center gap-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-orange-500/30 rounded-2xl p-4 shadow-2xl opacity-90 scale-105">
                      <FaGripVertical className="text-orange-500" size={14} />
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
        title={currentBlog?._id ? "Refine Article" : "Draft New Insight"}
        subtitle="Share your knowledge and technical insights"
        icon={FaBookOpen}
        iconColor="text-orange-400"
        accentColor="from-orange-500/5 to-red-500/5"
        onSave={handleAddOrUpdate}
        saving={saving}
        saveLabel={currentBlog?._id ? "Update Article" : "Publish Insight"}
        savingLabel="Publishing..."
        maxWidth="5xl"
      >
        {currentBlog && (
          <div className="px-1">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10">
              {/* Left Column: Visuals & Branding */}
              <div className="space-y-6">
                <AdminField label="Cover Narrative Image">
                  <ImageUpload
                    value={currentBlog.image}
                    onChange={(url) =>
                      setCurrentBlog({ ...currentBlog, image: url })
                    }
                  />
                </AdminField>

                <div className="p-6 bg-orange-500/5 border border-orange-500/10 rounded-3xl flex items-start gap-4">
                  <FaInfoCircle
                    className="text-orange-400 shrink-0 mt-1"
                    size={16}
                  />
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-wider text-orange-400/90">
                      Visual Engagement
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                      A high-quality cover image significantly increases
                      click-through rates. Choose an image that visually
                      summarizes your article's core topic.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Article Details */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <AdminField label="Article Title">
                    <AdminInput
                      icon={FaBookOpen}
                      value={currentBlog.title}
                      onChange={(e) =>
                        setCurrentBlog({
                          ...currentBlog,
                          title: e.target.value,
                        })
                      }
                      placeholder="e.g. Master Next.js 14 Server Actions"
                    />
                  </AdminField>
                  <AdminField label="Publish Date">
                    <AdminInput
                      icon={FaCalendarAlt}
                      value={currentBlog.date}
                      onChange={(e) =>
                        setCurrentBlog({ ...currentBlog, date: e.target.value })
                      }
                      placeholder="e.g. May 15, 2024"
                    />
                  </AdminField>
                </div>

                <AdminField label="Article Source URL">
                  <AdminInput
                    icon={FaLink}
                    value={currentBlog.link}
                    onChange={(e) =>
                      setCurrentBlog({ ...currentBlog, link: e.target.value })
                    }
                    placeholder="https://medium.com/your-article"
                  />
                </AdminField>

                <AdminField label="Synopsis">
                  <AdminTextarea
                    value={currentBlog.description}
                    onChange={(e) =>
                      setCurrentBlog({
                        ...currentBlog,
                        description: e.target.value,
                      })
                    }
                    placeholder="A compelling summary of the article..."
                    className="min-h-[120px]"
                  />
                </AdminField>

                <AdminField label="Taxonomy / Tags">
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <AdminInput
                        icon={FaTag}
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (tagInput.trim()) {
                              setCurrentBlog({
                                ...currentBlog,
                                tags: [...currentBlog.tags, tagInput.trim()],
                              });
                              setTagInput("");
                            }
                          }
                        }}
                        placeholder="e.g. Next.js"
                        className="h-12 text-sm"
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          if (tagInput.trim()) {
                            setCurrentBlog({
                              ...currentBlog,
                              tags: [...currentBlog.tags, tagInput.trim()],
                            });
                            setTagInput("");
                          }
                        }}
                        className="h-12 px-6 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold border border-white/5 shadow-inner shadow-black/20"
                      >
                        <FaPlus size={14} />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <AnimatePresence>
                        {currentBlog.tags.map((tag, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                          >
                            <Badge
                              variant="secondary"
                              className="bg-slate-950/40 text-orange-400 border-white/5 shadow-inner shadow-black/10 px-3 py-2 gap-2 rounded-xl group transition-all"
                            >
                              <span className="text-xs font-bold">{tag}</span>
                              <button
                                onClick={() =>
                                  setCurrentBlog({
                                    ...currentBlog,
                                    tags: currentBlog.tags.filter(
                                      (_, idx) => idx !== i,
                                    ),
                                  })
                                }
                                className="text-slate-500 hover:text-red-400 transition-colors p-1"
                              >
                                <FaTimes size={10} />
                              </button>
                            </Badge>
                          </motion.div>
                        ))}
                      </AnimatePresence>
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
