"use client";
import { useState } from "react";
import { FaPlus, FaTrash, FaLink, FaExternalLinkAlt, FaGithub } from "react-icons/fa";
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
  const [newLabel, setNewLabel] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const addLink = () => {
    if (!newUrl) return;
    onChange([...links, { label: newLabel || (iconType === "github" ? "Repository" : "Live Demo"), url: newUrl }]);
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
    <div className="space-y-4">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-1">
        {label}
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <AnimatePresence mode="popLayout">
          {safeLinks.map((link, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group relative bg-slate-900/50 border border-white/5 p-3 rounded-2xl space-y-2 hover:border-white/10 transition-all"
            >
              <div className="flex items-center gap-2">
                <Icon className={iconType === "github" ? "text-slate-400" : "text-emerald-400"} size={12} />
                <Input
                  className="bg-transparent border-none p-0 h-6 text-[11px] font-bold text-white focus-visible:ring-0"
                  value={link.label}
                  onChange={(e) => updateLink(i, "label", e.target.value)}
                  placeholder="Label..."
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLink(i)}
                  className="h-6 w-6 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaTrash size={10} />
                </Button>
              </div>
              <Input
                className="bg-slate-950/50 border-white/5 h-8 text-[10px] text-slate-400 rounded-lg focus-visible:ring-white/10"
                value={link.url}
                onChange={(e) => updateLink(i, "url", e.target.value)}
                placeholder="URL..."
              />
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="bg-slate-950/20 border-2 border-dashed border-white/5 p-3 rounded-2xl space-y-2">
          <div className="flex items-center gap-2">
            <FaPlus className="text-slate-600" size={10} />
            <Input
              className="bg-transparent border-none p-0 h-6 text-[11px] font-bold text-slate-400 focus-visible:ring-0"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Add Label..."
              onKeyDown={(e) => e.key === "Enter" && addLink()}
            />
          </div>
          <div className="flex gap-2">
            <Input
              className="bg-slate-950/50 border-white/5 h-8 text-[10px] text-slate-400 rounded-lg focus-visible:ring-white/10"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="Add URL..."
              onKeyDown={(e) => e.key === "Enter" && addLink()}
            />
            <Button onClick={addLink} variant="outline" className="h-8 w-8 p-0 border-white/10 rounded-lg">+</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
