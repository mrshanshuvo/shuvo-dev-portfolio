"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaPlus,
  FaCheck,
  FaTimes,
  FaSearch,
  FaFilter,
  FaStar,
  FaRegStar,
  FaTrash,
  FaEdit,
  FaGithub,
  FaExternalLinkAlt,
  FaImage,
  FaVideo,
  FaGripVertical,
  FaCode,
  FaInfoCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type {
  Project,
  Category as ICategory,
  MediaItem,
  LinkItem,
} from "@/types";
import CategoryManagerDialog from "../components/CategoryManagerDialog";

// ─── Sortable Row ───────────────────────────────────────────────────────────
function SortableProjectCard({
  project,
  onEdit,
  onDelete,
  deleting,
}: {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project._id! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const thumb =
    project.media?.find((m) => m.type === "image")?.url || project.image || "";
  const mediaCount = project.media?.length ?? 0;
  const imgCount = project.media?.filter((m) => m.type === "image").length ?? 0;
  const vidCount = project.media?.filter((m) => m.type === "video").length ?? 0;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="group relative flex items-center gap-4 bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 rounded-[1.5rem] p-2 transition-all duration-300 shadow-sm dark:shadow-none"
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-700 hover:text-slate-400 transition-colors shrink-0 touch-none"
      >
        <FaGripVertical size={14} />
      </div>

      {/* Thumbnail */}
      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-white/5">
        {thumb ? (
          <div className="relative w-full h-full">
            <Image
              src={thumb}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-700">
            <FaImage size={20} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-2">
          {project.featured && (
            <FaStar className="text-amber-400 shrink-0" size={11} />
          )}
          <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate">
            {project.title}
          </h3>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {Array.isArray(project.category)
            ? project.category.map((cat) => (
                <Badge
                  key={cat}
                  className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-black rounded-lg px-2 py-0.5 shadow-sm dark:shadow-none"
                >
                  {cat}
                </Badge>
              ))
            : project.category && (
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-black rounded-lg px-2 py-0.5">
                  {project.category}
                </Badge>
              )}
          {(project.techNames ?? []).slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-[10px] text-slate-500 bg-slate-800/50 px-1.5 py-0.5 rounded-md font-medium"
            >
              {t}
            </span>
          ))}
          {(project.techNames?.length ?? 0) > 3 && (
            <span className="text-[10px] text-slate-600">
              +{(project.techNames?.length ?? 0) - 3}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-[10px] text-slate-600">
          {mediaCount > 0 && (
            <span className="flex items-center gap-1">
              {imgCount > 0 && (
                <>
                  <FaImage size={9} /> {imgCount}
                </>
              )}
              {vidCount > 0 && (
                <>
                  <FaVideo size={9} className="ml-1" /> {vidCount}
                </>
              )}
            </span>
          )}
          {(project.github?.length ?? 0) > 0 && (
            <span className="flex items-center gap-1">
              <FaGithub size={9} /> {project.github!.length}
            </span>
          )}
          {(project.live?.length ?? 0) > 0 && (
            <span className="flex items-center gap-1">
              <FaExternalLinkAlt size={9} /> {project.live!.length}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <Button
          onClick={onEdit}
          size="icon"
          variant="ghost"
          className="h-9 w-9 rounded-xl bg-slate-800 border border-white/5 text-slate-400 hover:text-white hover:bg-slate-700"
        >
          <FaEdit size={12} />
        </Button>
        <Button
          onClick={onDelete}
          disabled={deleting}
          size="icon"
          variant="ghost"
          className="h-9 w-9 rounded-xl bg-slate-800 border border-white/5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 disabled:opacity-40"
        >
          <FaTrash size={12} />
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Drag Overlay Card (floats under cursor) ────────────────────────────────
function DragOverlayCard({ project }: { project: Project }) {
  const thumb =
    project.media?.find((m) => m.type === "image")?.url || project.image || "";
  const mediaCount = project.media?.length ?? 0;
  const imgCount = project.media?.filter((m) => m.type === "image").length ?? 0;
  const vidCount = project.media?.filter((m) => m.type === "video").length ?? 0;

  return (
    <div className="flex items-center gap-4 bg-slate-800/90 backdrop-blur-xl border border-emerald-500/30 rounded-[1.5rem] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.6)] ring-1 ring-emerald-500/20 rotate-1 scale-105">
      <div className="cursor-grabbing text-emerald-400 shrink-0">
        <FaGripVertical size={14} />
      </div>
      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-700 shrink-0 border border-white/10">
        {thumb ? (
          <div className="relative w-full h-full">
            <Image
              src={thumb}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600">
            <FaImage size={20} />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-2">
          {project.featured && (
            <FaStar className="text-amber-400 shrink-0" size={11} />
          )}
          <h3 className="font-bold text-white text-sm truncate">
            {project.title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {Array.isArray(project.category)
            ? project.category.map((cat) => (
                <Badge
                  key={cat}
                  className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-black rounded-lg px-2 py-0.5"
                >
                  {cat}
                </Badge>
              ))
            : project.category && (
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-black rounded-lg px-2 py-0.5">
                  {project.category}
                </Badge>
              )}
        </div>
        <div className="flex items-center gap-3 text-[10px] text-slate-500">
          {mediaCount > 0 && (
            <span className="flex items-center gap-1">
              {imgCount > 0 && (
                <>
                  <FaImage size={9} /> {imgCount}
                </>
              )}
              {vidCount > 0 && (
                <>
                  <FaVideo size={9} className="ml-1" /> {vidCount}
                </>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function AdminProjectsListPage() {
  const router = useRouter();
  const [data, setData] = useState<Project[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  const fetchAll = () => {
    Promise.all([
      fetch("/api/admin/projects").then((r) => r.json()),
      fetch("/api/admin/categories").then((r) => r.json()),
    ]).then(([projects, cats]) => {
      setData(Array.isArray(projects) ? projects : []);
      setCategories(Array.isArray(cats) ? cats : []);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const refreshCategories = () => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((cats) => setCategories(Array.isArray(cats) ? cats : []));
  };

  function openEdit(project: Project) {
    router.push(`/admin/projects/${project._id}`);
  }

  function openNew() {
    router.push("/admin/projects/new");
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const oldIndex = data.findIndex((p) => p._id === active.id);
    const newIndex = data.findIndex((p) => p._id === over.id);

    const newData = arrayMove(data, oldIndex, newIndex).map((p, i) => ({
      ...p,
      order: i,
    }));

    setData(newData);

    try {
      await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
    } catch (err) {
      console.error("Failed to reorder:", err);
      showToast("Failed to sync order.", "error");
      fetchAll();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (res.ok) {
      setData((prev) => prev.filter((p) => p._id !== id));
      showToast("Project deleted.");
    } else {
      showToast("Failed to delete.", "error");
    }
  }

  const filtered = data.filter((p) => {
    const mSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const mCat =
      filterCategory === "All" ||
      (Array.isArray(p.category)
        ? p.category.includes(filterCategory)
        : p.category === filterCategory);
    return mSearch && mCat;
  });

  const isFiltered = searchQuery || filterCategory !== "All";

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Toast */}
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

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl p-4 shadow-sm dark:shadow-none">
        <div className="flex items-center gap-4 flex-wrap flex-1">
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest text-[10px]"
          >
            {data.length} {data.length === 1 ? "Project" : "Projects"}
          </Badge>

          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <FaSearch
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
              size={12}
            />
            <Input
              className="bg-white dark:bg-slate-950 border-slate-200 dark:border-white/5 rounded-xl pl-9 h-10 text-xs focus-visible:ring-emerald-500/30 text-slate-900 dark:text-white shadow-sm dark:shadow-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
            />
          </div>

          <Select
            value={filterCategory}
            onValueChange={(v) => setFilterCategory(v || "All")}
          >
            <SelectTrigger className="bg-white dark:bg-slate-950 border-slate-200 dark:border-white/5 rounded-xl h-10 w-[150px] text-xs text-slate-900 dark:text-white shadow-sm dark:shadow-none">
              <FaFilter className="mr-2 text-slate-600" size={10} />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl shadow-2xl">
              <SelectItem value="All">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.name} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <CategoryManagerDialog onUpdate={refreshCategories} />
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={openNew}
            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-10 px-6 font-black shadow-lg shadow-emerald-600/20 text-xs"
          >
            <FaPlus className="mr-2" size={12} /> Add Project
          </Button>
        </div>
      </div>

      <div className="w-full">
        {/* List Content */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-24 bg-slate-900/30 rounded-[1.5rem] animate-pulse border border-white/5"
              />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
            <FaCode size={48} className="mx-auto text-slate-800 mb-4" />
            <h3 className="text-xl font-bold text-slate-400 mb-2">
              No projects yet
            </h3>
            <p className="text-slate-600 text-sm mb-8">
              Start building your portfolio by adding your first project.
            </p>
            <Button
              onClick={openNew}
              className="bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600/20 border border-emerald-500/20 px-8 h-12 rounded-xl font-bold"
            >
              <FaPlus className="mr-2" /> Add First Project
            </Button>
          </div>
        ) : (
          <>
            {isFiltered ? (
              // Non-DnD view when filtering (can't reorder filtered subset)
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {filtered.map((project) => (
                    <SortableProjectCard
                      key={project._id}
                      project={project}
                      onEdit={() => openEdit(project)}
                      onDelete={() => handleDelete(project._id!)}
                      deleting={deletingId === project._id}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              // DnD-enabled full list
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={data.map((p) => p._id!)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {data.map((project) => (
                        <SortableProjectCard
                          key={project._id}
                          project={project}
                          onEdit={() => openEdit(project)}
                          onDelete={() => handleDelete(project._id!)}
                          deleting={deletingId === project._id}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </SortableContext>
                <DragOverlay dropAnimation={null}>
                  {activeId ? (
                    <DragOverlayCard
                      project={data.find((p) => p._id === activeId)!}
                    />
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}

            <p className="text-center text-[10px] text-slate-700 mt-8 font-bold uppercase tracking-widest">
              {isFiltered
                ? `Showing ${filtered.length} of ${data.length} projects`
                : "Drag rows to reorder • Changes save automatically"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
