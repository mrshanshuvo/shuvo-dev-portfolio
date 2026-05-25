"use client";

import { FaBars, FaTimes } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface AdminMobileHeaderProps {
  onMenuClick: () => void;
  isOpen: boolean;
}

export default function AdminMobileHeader({
  onMenuClick,
  isOpen,
}: AdminMobileHeaderProps) {
  return (
    <header className="lg:hidden sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg flex items-center justify-center">
          <span className="text-slate-900 dark:text-white font-black text-sm tracking-tighter">
            A
          </span>
        </div>
        <p className="text-slate-900 dark:text-white font-bold text-sm tracking-tight">
          Admin <span className="text-emerald-400">Panel</span>
        </p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </Button>
    </header>
  );
}
