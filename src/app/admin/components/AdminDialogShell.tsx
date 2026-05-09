"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconType } from "react-icons";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AdminDialogShellProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  icon: IconType;
  iconColor?: string;
  accentColor?: string;
  children: React.ReactNode;
  onSave: () => void;
  saving?: boolean;
  saveLabel?: string;
  savingLabel?: string;
  cancelLabel?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
}

export function AdminDialogShell({
  open,
  onOpenChange,
  title,
  subtitle,
  icon: Icon,
  iconColor = "text-blue-400",
  accentColor = "from-blue-500/5 to-indigo-500/5",
  children,
  onSave,
  saving = false,
  saveLabel = "Save Changes",
  savingLabel = "Saving...",
  cancelLabel = "Cancel",
  maxWidth = "xl",
}: AdminDialogShellProps) {
  const widthClasses = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
    "3xl": "sm:max-w-3xl",
    "4xl": "sm:max-w-4xl",
    "5xl": "sm:max-w-5xl",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "bg-slate-900/98 border-white/10 text-white rounded-3xl backdrop-blur-3xl shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden p-0 gap-0",
          widthClasses[maxWidth],
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-linear-to-br via-transparent pointer-events-none",
            accentColor,
          )}
        />

        <DialogHeader className="p-8 pb-4 relative z-10 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-xl shadow-black/20",
                  iconColor,
                )}
              >
                <Icon size={28} />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black tracking-tight">
                  {title}
                </DialogTitle>
                {subtitle && (
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="rounded-xl h-10 px-5 font-bold text-slate-500 hover:text-white hover:bg-white/5 transition-all text-[10px] uppercase tracking-[0.15em] border border-transparent hover:border-white/10"
              >
                {cancelLabel}
              </Button>
              <Button
                onClick={onSave}
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-8 h-10 font-black shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] active:scale-[0.98] transition-all disabled:opacity-50 text-[10px] uppercase tracking-[0.15em] border border-emerald-400/20"
              >
                {saving ? savingLabel : saveLabel}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="p-8 pt-6 relative z-10 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
