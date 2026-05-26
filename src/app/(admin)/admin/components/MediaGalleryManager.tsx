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
import { motion, Reorder, AnimatePresence } from "framer-motion";
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

export default function MediaGalleryManager({
  media = [],
  onChange,
  label,
}: MediaGalleryManagerProps) {
  const [embedInput, setEmbedInput] = useState<string | null>(null);

  const updateItem = (i: number, field: keyof MediaItem, val: any) => {
    const next = [...media];
    next[i] = { ...next[i], [field]: val };
    onChange(next);
  };

  const addItem = (type: MediaItem["type"]) => {
    onChange([...media, { type, url: "", caption: "" }]);
  };

  const removeItem = (i: number) => {
    onChange(media.filter((_, idx) => idx !== i));
  };

  const addEmbed = () => {
    if (!embedInput) return;
    onChange([...media, { type: "embed", url: embedInput, caption: "" }]);
    setEmbedInput(null);
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

      <Reorder.Group
        axis="y"
        values={media}
        onReorder={onChange}
        className="space-y-4"
      >
        {media.map((item, i) => (
          <Reorder.Item
            key={item.url || i}
            value={item}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="group relative bg-slate-950/60 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 flex flex-col md:flex-row gap-8 hover:border-white/10 hover:bg-slate-900/80 transition-all duration-500 shadow-2xl"
          >
            <div className="w-full md:w-56 shrink-0">
              {item.type === "embed" ? (
                <div className="aspect-square bg-slate-900 rounded-3xl flex flex-col items-center justify-center border border-white/5 gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <FaLink size={24} />
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]"
                  >
                    EMBED
                  </Badge>
                </div>
              ) : (
                <ImageUpload
                  value={item.url}
                  onChange={(url) => updateItem(i, "url", url)}
                  accept={item.type === "video" ? "video/*" : "image/*"}
                />
              )}
            </div>

            <div className="flex-1 space-y-4 pt-2">
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
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-300 transition-colors">
                    Asset #{i + 1}{" "}
                    <span className="mx-2 text-slate-800">/</span>{" "}
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-md text-[10px]",
                        item.type === "image"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : item.type === "video"
                            ? "bg-purple-500/10 text-purple-400"
                            : "bg-blue-500/10 text-blue-400",
                      )}
                    >
                      {item.type}
                    </span>
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(i)}
                  className="h-8 w-8 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                >
                  <FaTrash size={12} />
                </Button>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                  URL / Source
                </label>
                <div className="relative group/input">
                  <FaLink className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/input:text-slate-400 transition-colors" />
                  <Input
                    className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/5 rounded-xl pl-12 h-11 focus-visible:ring-emerald-500/10 text-slate-900 dark:text-white shadow-inner dark:shadow-none"
                    value={item.url}
                    onChange={(e) => updateItem(i, "url", e.target.value)}
                    placeholder="Source URL..."
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                  Caption (Optional)
                </label>
                <div className="relative group/input">
                  <FaInfoCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/input:text-slate-400 transition-colors" />
                  <Input
                    className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/5 rounded-xl pl-12 h-11 focus-visible:ring-emerald-500/10 text-slate-900 dark:text-white shadow-inner dark:shadow-none"
                    value={item.caption || ""}
                    onChange={(e) => updateItem(i, "caption", e.target.value)}
                    placeholder="Describe this media..."
                  />
                </div>
              </div>
            </div>

            <div className="absolute -left-10 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="cursor-grab active:cursor-grabbing p-2 text-slate-600 hover:text-white transition-colors">
                <svg
                  width="12"
                  height="20"
                  viewBox="0 0 12 20"
                  fill="currentColor"
                >
                  <circle cx="2" cy="2" r="2" />
                  <circle cx="2" cy="10" r="2" />
                  <circle cx="2" cy="18" r="2" />
                  <circle cx="10" cy="2" r="2" />
                  <circle cx="10" cy="10" r="2" />
                  <circle cx="10" cy="18" r="2" />
                </svg>
              </div>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {media.length === 0 && (
        <div className="group/empty relative py-16 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[2.5rem] bg-white dark:bg-slate-950/20 flex flex-col items-center justify-center gap-6 overflow-hidden transition-all hover:border-emerald-500/20 hover:bg-emerald-500/5 shadow-sm dark:shadow-none">
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
