"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FaChevronDown,
  FaSearch,
  FaPlus,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Category {
  name: string;
  slug: string;
  order: number;
}

interface CategoryComboboxProps {
  value: string[];
  onChange: (val: string[]) => void;
  categories: Category[];
  refreshCategories: () => Promise<void>;
}

export default function CategoryCombobox({
  value = [],
  onChange,
  categories,
  refreshCategories,
}: CategoryComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleCategory = (name: string) => {
    const newValue = value.includes(name)
      ? value.filter((v) => v !== name)
      : [...value, name];
    onChange(newValue);
  };

  const handleCreate = async () => {
    if (!search.trim()) return;
    setCreating(true);

    const newCat = {
      name: search.trim(),
      slug: search
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-"),
      order: categories.length,
    };

    const nextCategories = [...categories, newCat];

    try {
      await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextCategories),
      });
      await refreshCategories();
      toggleCategory(newCat.name);
      setSearch("");
    } catch (err) {
      console.error("Failed to create category", err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="relative w-full flex-1" ref={ref}>
      <div
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full flex flex-wrap gap-2 p-2 min-h-[56px] bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 rounded-2xl transition-all cursor-pointer outline-none",
          open
            ? "border-emerald-500/50 ring-2 ring-emerald-500/20"
            : "border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10",
        )}
      >
        {value.length === 0 && (
          <div className="flex items-center h-10 px-3 text-slate-500 text-sm font-bold">
            Select Categories
          </div>
        )}
        <AnimatePresence mode="popLayout">
          {value.map((val) => (
            <motion.div
              key={val}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold"
            >
              <span>{val}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCategory(val);
                }}
                className="p-1 hover:bg-emerald-500/20 rounded-md transition-colors"
              >
                <FaTimes size={10} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="flex-1" />
        <div className="flex items-center px-3">
          <FaChevronDown
            className={cn(
              "text-slate-500 text-xs transition-transform",
              open && "rotate-180",
            )}
          />
        </div>
      </div>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[1.5rem] shadow-2xl z-50 overflow-hidden flex flex-col p-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2.5 mb-2 focus-within:border-emerald-500/50 transition-colors">
            <FaSearch className="text-slate-500 mr-2 shrink-0" size={12} />
            <input
              autoFocus
              className="bg-transparent border-none focus:ring-0 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-600 w-full outline-none font-medium h-9"
              placeholder="Search or create..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  search.trim() &&
                  filtered.length === 0
                ) {
                  e.preventDefault();
                  handleCreate();
                }
              }}
            />
          </div>

          <div className="max-h-60 overflow-y-auto custom-scrollbar flex flex-col gap-1 pr-1">
            {filtered.length > 0 ? (
              filtered.map((c) => {
                const isActive = value.includes(c.name);
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => toggleCategory(c.name)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors text-left w-full",
                      isActive
                        ? "bg-emerald-500/10 text-emerald-400 font-bold"
                        : "text-slate-300 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    <span className="truncate">{c.name}</span>
                    {isActive && (
                      <FaCheck size={10} className="shrink-0 ml-2" />
                    )}
                  </button>
                );
              })
            ) : search.trim() ? (
              <button
                type="button"
                onClick={handleCreate}
                disabled={creating}
                className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors text-left font-bold w-full"
              >
                {creating ? (
                  <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin shrink-0" />
                ) : (
                  <FaPlus size={10} className="shrink-0" />
                )}
                <span className="truncate">Create "{search}"</span>
              </button>
            ) : (
              <div className="px-3 py-6 text-center text-xs font-bold uppercase tracking-widest text-slate-600">
                No categories found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
