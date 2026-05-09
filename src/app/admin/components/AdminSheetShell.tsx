"use client";

import React from "react";
import { FaTimes, FaSave, FaCircle } from "react-icons/fa";
import { IconType } from "react-icons";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminSheetShellProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  icon?: IconType;
  iconColor?: string;
  accentColor?: string;
  children: React.ReactNode;
  onSave?: () => void;
  saving?: boolean;
  saveLabel?: string;
  savingLabel?: string;
  cancelLabel?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
  showFooter?: boolean;
}

export function AdminSheetShell({
  open,
  onOpenChange,
  title,
  subtitle,
  icon: Icon,
  iconColor = "text-emerald-400",
  accentColor = "from-emerald-500/5 to-cyan-500/5",
  children,
  onSave,
  saving = false,
  saveLabel = "Save Changes",
  savingLabel = "Saving...",
  cancelLabel = "Cancel",
  maxWidth = "2xl",
  showFooter = true,
}: AdminSheetShellProps) {
  // Map maxWidth to sheet specific classes if needed,
  // but Shadcn Sheet usually handles width via side or className.
  const widthClasses = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
    "3xl": "sm:max-w-3xl",
    "4xl": "sm:max-w-4xl",
    "5xl": "sm:max-w-5xl",
    full: "sm:max-w-full",
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          "bg-slate-900/98 border-l border-white/10 text-white p-0 gap-0 flex flex-col backdrop-blur-3xl shadow-[-20px_0_80px_rgba(0,0,0,0.6)]",
          widthClasses[maxWidth] || widthClasses["2xl"],
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-linear-to-br pointer-events-none",
            accentColor,
          )}
        />

        <SheetHeader className="p-8 pb-6 relative z-10 border-b border-white/5 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              {Icon && (
                <div
                  className={cn(
                    "w-12 h-12 rounded-[1rem] bg-white/5 flex items-center justify-center border border-white/10 shadow-xl",
                    iconColor,
                  )}
                >
                  <Icon size={24} />
                </div>
              )}
              <div>
                <SheetTitle className="text-xl font-black tracking-tight text-white">
                  {title}
                </SheetTitle>
                {subtitle && (
                  <SheetDescription className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mt-1">
                    {subtitle}
                  </SheetDescription>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="rounded-xl h-10 w-10 text-slate-500 hover:text-white hover:bg-white/5"
            >
              <FaTimes size={16} />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 relative z-10">
          {children}
        </div>

        {showFooter && (
          <SheetFooter className="p-8 bg-slate-950/50 border-t border-white/5 backdrop-blur-xl gap-3 shrink-0 sm:flex-row sm:justify-end sm:space-x-0">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-[1rem] h-12 px-6 font-bold text-slate-500 hover:text-white hover:bg-white/5"
            >
              {cancelLabel}
            </Button>
            {onSave && (
              <Button
                onClick={onSave}
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-[1rem] px-8 h-12 font-black shadow-xl shadow-emerald-600/20 active:scale-[0.98] transition-all min-w-[140px]"
              >
                {saving ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>{savingLabel}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <FaSave size={14} />
                    <span>{saveLabel}</span>
                  </div>
                )}
              </Button>
            )}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
