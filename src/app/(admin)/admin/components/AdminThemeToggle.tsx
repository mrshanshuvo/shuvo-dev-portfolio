"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaSun, FaMoon, FaDesktop } from "react-icons/fa";
import { cn } from "@/lib/utils";

export default function AdminThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  const themes = [
    { name: "light", icon: FaSun, label: "Light" },
    { name: "dark", icon: FaMoon, label: "Dark" },
    { name: "system", icon: FaDesktop, label: "System" },
  ];

  return (
    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-full p-1 shadow-sm">
      {themes.map((t) => {
        const Icon = t.icon;
        const isActive = theme === t.name;
        return (
          <button
            key={t.name}
            onClick={() => setTheme(t.name)}
            className={cn(
              "relative p-1.5 rounded-full transition-all duration-300 group",
              isActive
                ? "bg-white dark:bg-slate-800 text-emerald-500 shadow-sm"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200",
            )}
            title={`Switch to ${t.label} mode`}
          >
            <Icon size={13} className="relative z-10" />
            {!isActive && (
              <span className="absolute inset-0 bg-slate-200 dark:bg-white/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
            )}
          </button>
        );
      })}
    </div>
  );
}
