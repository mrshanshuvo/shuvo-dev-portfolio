"use client";

import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaSearch, FaCheck, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface TechItem {
  name: string;
  iconUrl?: string;
  isTechnology?: boolean;
}

interface TechComboboxProps {
  value: string[];
  onChange: (val: string[]) => void;
  technologies: TechItem[];
}

export default function TechCombobox({
  value = [],
  onChange,
  technologies = [],
}: TechComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
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

  const filtered = technologies.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleTech = (name: string) => {
    const newValue = value.includes(name)
      ? value.filter((v) => v !== name)
      : [...value, name];
    onChange(newValue);
  };

  const getTechIcon = (name: string) => {
    const item = technologies.find((t) => t.name === name);
    return item?.iconUrl || null;
  };

  return (
    <div className="relative w-full flex-1" ref={ref}>
      <div
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full flex flex-wrap gap-2.5 p-2.5 min-h-14 bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 rounded-2xl transition-all cursor-pointer outline-none",
          open
            ? "border-emerald-500/50 ring-2 ring-emerald-500/20"
            : "border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10",
        )}
      >
        {value.length === 0 && (
          <div className="flex items-center h-10 px-3 text-slate-500 text-sm font-bold">
            Select Technologies
          </div>
        )}
        <AnimatePresence mode="popLayout">
          {value.map((val) => {
            const iconUrl = getTechIcon(val);
            return (
              <motion.div
                key={val}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-1.5 pl-3.5 pr-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm"
              >
                {iconUrl && (
                  <Image
                    src={iconUrl}
                    alt={val}
                    width={14}
                    height={14}
                    className="object-contain"
                  />
                )}
                <span>{val}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTech(val);
                  }}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                >
                  <FaTimes size={10} />
                </button>
              </motion.div>
            );
          })}
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
        <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col p-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2.5 mb-2 focus-within:border-emerald-500/50 transition-colors">
            <FaSearch className="text-slate-500 mr-2 shrink-0" size={12} />
            <input
              autoFocus
              className="bg-transparent border-none focus:ring-0 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-600 w-full outline-none font-medium h-9"
              placeholder="Search technologies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="max-h-60 overflow-y-auto custom-scrollbar flex flex-col gap-1 pr-1">
            {filtered.length > 0 ? (
              filtered.map((t) => {
                const isActive = value.includes(t.name);
                return (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => toggleTech(t.name)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors text-left w-full cursor-pointer",
                      isActive
                        ? "bg-slate-50 dark:bg-white/5 text-emerald-400 font-bold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white",
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      {t.iconUrl ? (
                        <Image
                          src={t.iconUrl}
                          alt={t.name}
                          width={14}
                          height={14}
                          className="object-contain shrink-0"
                        />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full shrink-0 bg-slate-200 dark:bg-slate-800" />
                      )}
                      <span className="truncate">{t.name}</span>
                    </div>
                    {isActive && (
                      <FaCheck
                        size={10}
                        className="shrink-0 ml-2 text-emerald-500"
                      />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-6 text-center text-xs font-bold uppercase tracking-widest text-slate-600">
                No tools found. Add them in Skill section first.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
