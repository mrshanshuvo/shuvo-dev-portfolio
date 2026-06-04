"use client";
import { useState } from "react";
import {
  FaPlus,
  FaTimes,
  FaImage,
  FaLink,
  FaTrash,
  FaInfoCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
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
import ImageUpload from "./ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MediaItem } from "@/types";

interface MediaGalleryManagerProps {
  media: MediaItem[];
  onChange: (media: MediaItem[]) => void;
  label?: string;
}

interface SortableMediaItemProps {
  item: MediaItem;
  index: number;
  updateItem: (i: number, field: keyof MediaItem, val: any) => void;
  removeItem: (i: number) => void;
}

function SortableMediaItem({
  item,
  index,
  updateItem,
  removeItem,
}: SortableMediaItemProps) {
  const stableId =
    item.id || item._id || `legacy-${index}-${item.type}-${item.url}`;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stableId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : transition,
    opacity: isDragging ? 0.35 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative bg-white dark:bg-slate-950/60 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-[1rem] p-6 flex flex-col md:flex-row gap-8 hover:border-slate-300 dark:hover:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-900/80 transition-[background-color,border-color,box-shadow,opacity] duration-500 shadow-lg dark:shadow-2xl",
        isDragging &&
          "z-50 border-emerald-500/50 shadow-2xl shadow-emerald-500/10",
      )}
    >
      {/* Drag Handle - Always visible, inline on mobile/tablet, absolute on xl screens */}
      <div
        {...attributes}
        {...listeners}
        className="flex xl:absolute xl:-left-10 xl:top-1/2 xl:-translate-y-1/2 flex-col items-center justify-center p-2 text-slate-400 dark:text-slate-600 hover:text-slate-650 dark:hover:text-slate-350 transition-colors cursor-grab active:cursor-grabbing shrink-0 self-center xl:self-auto"
      >
        <svg width="12" height="20" viewBox="0 0 12 20" fill="currentColor">
          <circle cx="2" cy="2" r="2" />
          <circle cx="2" cy="10" r="2" />
          <circle cx="2" cy="18" r="2" />
          <circle cx="10" cy="2" r="2" />
          <circle cx="10" cy="10" r="2" />
          <circle cx="10" cy="18" r="2" />
        </svg>
      </div>

      <div className="w-full md:w-56 shrink-0">
        {item.type === "embed" ? (
          <div className="aspect-video bg-slate-50 dark:bg-slate-900 rounded-2xl flex flex-col items-center justify-center border border-slate-200 dark:border-white/5 gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <FaLink size={18} />
            </div>
            <Badge
              variant="outline"
              className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-[9px] font-black tracking-widest"
            >
              EMBED
            </Badge>
          </div>
        ) : (
          <ImageUpload
            value={item.url}
            onChange={(url) => updateItem(index, "url", url)}
            accept={item.type === "video" ? "video/*" : "image/*"}
            aspect="video"
          />
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between py-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-2.5 h-2.5 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]",
                item.type === "image"
                  ? "bg-emerald-500 shadow-emerald-500/20"
                  : item.type === "video"
                    ? "bg-purple-500 shadow-purple-500/20"
                    : "bg-blue-500 shadow-blue-500/20",
              )}
            />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
              #{index + 1}{" "}
              <span className="mx-2 text-slate-300 dark:text-slate-700">/</span>{" "}
              <span
                className={cn(
                  "px-2 py-0.5 rounded-md text-[10px] font-black",
                  item.type === "image"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : item.type === "video"
                      ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                      : "bg-blue-500/10 text-blue-600 dark:text-blue-400",
                )}
              >
                {item.type}
              </span>
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeItem(index)}
            className="h-8 w-8 text-slate-400 dark:text-slate-600 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
          >
            <FaTrash size={12} />
          </Button>
        </div>

        <div className="space-y-4">
          {item.type === "embed" && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                URL / Source
              </label>
              <div className="relative group/input">
                <FaLink className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within/input:text-emerald-600 dark:group-focus-within/input:text-emerald-400 transition-colors" />
                <Input
                  className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/5 rounded-xl pl-12 h-11 focus-visible:ring-emerald-500/10 text-slate-900 dark:text-white shadow-inner dark:shadow-none"
                  value={item.url}
                  onChange={(e) => updateItem(index, "url", e.target.value)}
                  placeholder="Source URL..."
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
              Caption (Optional)
            </label>
            <div className="relative group/input">
              <FaInfoCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within/input:text-emerald-600 dark:group-focus-within/input:text-emerald-400 transition-colors" />
              <Input
                className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/5 rounded-xl pl-12 h-11 focus-visible:ring-emerald-500/10 text-slate-900 dark:text-white shadow-inner dark:shadow-none"
                value={item.caption || ""}
                onChange={(e) => updateItem(index, "caption", e.target.value)}
                placeholder="Describe this media..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MediaGalleryManager({
  media = [],
  onChange,
  label,
}: MediaGalleryManagerProps) {
  const [embedInput, setEmbedInput] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const updateItem = (i: number, field: keyof MediaItem, val: any) => {
    const next = [...media];
    next[i] = { ...next[i], [field]: val };
    onChange(next);
  };

  const addItem = (type: MediaItem["type"]) => {
    const newId = `temp-${Math.random().toString(36).substring(2, 9)}`;
    onChange([...media, { id: newId, type, url: "", caption: "" }]);
  };

  const removeItem = (i: number) => {
    onChange(media.filter((_, idx) => idx !== i));
  };

  const addEmbed = () => {
    if (!embedInput) return;
    const newId = `temp-${Math.random().toString(36).substring(2, 9)}`;
    onChange([
      ...media,
      { id: newId, type: "embed", url: embedInput, caption: "" },
    ]);
    setEmbedInput(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = media.findIndex((item, index) => {
      const stableId =
        item.id || item._id || `legacy-${index}-${item.type}-${item.url}`;
      return stableId === active.id;
    });

    const newIndex = media.findIndex((item, index) => {
      const stableId =
        item.id || item._id || `legacy-${index}-${item.type}-${item.url}`;
      return stableId === over.id;
    });

    if (oldIndex !== -1 && newIndex !== -1) {
      onChange(arrayMove(media, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {label && (
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-1">
            {label}
          </label>
        )}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900/50 p-1 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => addItem("image")}
            className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 h-7 px-3 rounded-lg transition-all"
          >
            <FaPlus className="mr-1.5" /> Image
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => addItem("video")}
            className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-500/10 h-7 px-3 rounded-lg transition-all"
          >
            <FaPlus className="mr-1.5" /> Video
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setEmbedInput("")}
            className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 h-7 px-3 rounded-lg transition-all"
          >
            <FaPlus className="mr-1.5" /> Embed
          </Button>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {embedInput !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-slate-900/50 border border-white/10 rounded-2xl flex gap-3 mb-4">
              <div className="relative flex-1">
                <FaLink className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <Input
                  className="bg-slate-950/50 border-white/5 pl-10 h-10"
                  placeholder="YouTube/Vimeo URL..."
                  value={embedInput}
                  onChange={(e) => setEmbedInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addEmbed())
                  }
                />
              </div>
              <Button
                onClick={addEmbed}
                className="bg-blue-600 hover:bg-blue-500 h-10"
              >
                Add Embed
              </Button>
              <Button
                variant="ghost"
                onClick={() => setEmbedInput(null)}
                className="h-10 px-3"
              >
                <FaTimes />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={media.map(
            (item, index) =>
              item.id || item._id || `legacy-${index}-${item.type}-${item.url}`,
          )}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {media.map((item, index) => (
              <SortableMediaItem
                key={
                  item.id ||
                  item._id ||
                  `legacy-${index}-${item.type}-${item.url}`
                }
                item={item}
                index={index}
                updateItem={updateItem}
                removeItem={removeItem}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {media.length === 0 && (
        <div className="group/empty relative py-16 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl bg-white dark:bg-slate-950/20 flex flex-col items-center justify-center gap-6 overflow-hidden transition-all hover:border-emerald-500/20 hover:bg-emerald-500/5 shadow-sm dark:shadow-none">
          <div className="absolute inset-0 bg-linear-to-b from-emerald-500/0 to-emerald-500/5 opacity-0 group-hover/empty:opacity-100 transition-opacity" />
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center text-slate-400 dark:text-slate-700 group-hover/empty:scale-110 group-hover/empty:text-emerald-600 dark:group-hover/empty:text-emerald-400 transition-all duration-500 shadow-sm dark:shadow-2xl">
            <FaImage size={32} />
          </div>
          <div className="text-center space-y-1 relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-500 group-hover/empty:text-slate-900 dark:group-hover/empty:text-slate-300 transition-colors">
              Showcase is Empty
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-600 font-medium">
              Add images, videos or interactive embeds
            </p>
          </div>
          <div className="flex gap-2 relative z-10">
            <Button
              variant="outline"
              size="sm"
              onClick={() => addItem("image")}
              className="bg-white dark:bg-slate-900/50 hover:bg-emerald-500 hover:text-white border-slate-200 dark:border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest h-9 px-4 transition-all"
            >
              + Image
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addItem("video")}
              className="bg-white dark:bg-slate-900/50 hover:bg-purple-500 hover:text-white border-slate-200 dark:border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest h-9 px-4 transition-all"
            >
              + Video
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
