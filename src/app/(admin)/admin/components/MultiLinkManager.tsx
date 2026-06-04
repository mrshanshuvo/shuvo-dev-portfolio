"use client";
import { useState } from "react";
import { FaPlus, FaTrash, FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import type { LinkItem } from "@/types";

interface MultiLinkManagerProps {
  links: LinkItem[];
  onChange: (links: LinkItem[]) => void;
  label: string;
  iconType: "github" | "live";
}

export default function MultiLinkManager({
  links = [],
  onChange,
  label,
  iconType,
}: MultiLinkManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const addLink = () => {
    if (!newUrl) return;
    onChange([
      ...links,
      {
        label: newLabel || (iconType === "github" ? "Repository" : "Live Demo"),
        url: newUrl,
      },
    ]);
    setNewLabel("");
    setNewUrl("");
  };

  const removeLink = (i: number) => {
    onChange(links.filter((_, idx) => idx !== i));
  };

  const updateLink = (i: number, field: keyof LinkItem, val: string) => {
    const next = [...links];
    next[i] = { ...next[i], [field]: val };
    onChange(next);
  };

  const safeLinks = Array.isArray(links) ? links : [];
  const Icon = iconType === "github" ? FaGithub : FaExternalLinkAlt;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon
            className={
              iconType === "github"
                ? "text-slate-450 dark:text-slate-500"
                : "text-emerald-500 dark:text-emerald-400"
            }
            size={14}
          />
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-1">
            {label}
          </label>
        </div>
        {!isAdding && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsAdding(true)}
            className="h-7 w-7 rounded-lg text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/5 transition-all flex items-center justify-center cursor-pointer"
          >
            <FaPlus size={10} />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3">
        <AnimatePresence mode="popLayout">
          {safeLinks.map((link, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group relative bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 p-4 rounded-sm space-y-3 hover:border-slate-300 dark:hover:border-white/10 hover:shadow-md transition-all shadow-sm dark:shadow-none"
            >
              <div className="flex items-center gap-2">
                <Input
                  className="bg-white font-medium dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-sm h-9 px-3 text-xs text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-655 focus-visible:ring-emerald-500/20 shadow-inner dark:shadow-none"
                  value={link.label}
                  onChange={(e) => updateLink(i, "label", e.target.value)}
                  placeholder="Label"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLink(i)}
                  className="h-6 w-6 text-slate-400 dark:text-slate-650 hover:text-red-500 dark:hover:text-red-400 transition-opacity"
                >
                  <FaTrash size={10} />
                </Button>
              </div>
              <Input
                className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 h-9 text-xs text-slate-700 dark:text-slate-350 rounded-sm px-3 focus-visible:ring-emerald-500/20 shadow-inner dark:shadow-none"
                value={link.url}
                onChange={(e) => updateLink(i, "url", e.target.value)}
                placeholder="URL"
              />
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence mode="popLayout">
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-white/5 rounded-2xl space-y-3 overflow-hidden"
            >
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-wider text-slate-500 pl-1">
                  Link Details
                </label>
                <div className="relative">
                  <Input
                    className="bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-sm h-10 px-3 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-655 focus-visible:ring-emerald-500/20 shadow-inner dark:shadow-none"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="Title (e.g. Frontend Repo)"
                  />
                </div>
                <div className="relative">
                  <Input
                    className="bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-sm h-10 px-3 text-xs text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-655 focus-visible:ring-emerald-500/20 shadow-inner dark:shadow-none"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="URL (https://...)"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsAdding(false);
                    setNewLabel("");
                    setNewUrl("");
                  }}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 h-8 rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    if (newUrl) {
                      addLink();
                      setIsAdding(false);
                    }
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest h-8 px-4 rounded-lg shadow-sm"
                >
                  Add Link
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
