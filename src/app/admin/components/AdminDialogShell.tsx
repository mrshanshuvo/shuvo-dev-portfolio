"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
  maxWidth = "lg",
}: AdminDialogShellProps) {
  const widthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "bg-slate-900/98 border-white/10 text-white rounded-[2.5rem] backdrop-blur-3xl shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden p-0 gap-0",
          widthClasses[maxWidth],
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-linear-to-br via-transparent pointer-events-none",
            accentColor,
          )}
        />

        <DialogHeader className="p-10 pb-6 relative z-10 border-b border-white/5">
          <div className="flex items-center gap-5">
            <div
              className={cn(
                "w-14 h-14 rounded-[1.25rem] bg-white/5 flex items-center justify-center border border-white/10 shadow-xl shadow-black/20",
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
        </DialogHeader>

        <div className="p-10 pt-8 relative z-10 max-h-[65vh] overflow-y-auto custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>

        <DialogFooter className="p-10 bg-slate-950/50 border-t border-white/5 backdrop-blur-xl gap-4">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="rounded-[1.25rem] h-14 px-8 font-bold text-slate-500 hover:text-white hover:bg-white/5"
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={onSave}
            disabled={saving}
            className="bg-white text-black hover:bg-slate-200 rounded-[1.25rem] px-12 h-14 font-black shadow-xl shadow-white/5 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {saving ? savingLabel : saveLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
