"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IconType } from "react-icons";
import { cn } from "@/lib/utils";

interface AdminFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function AdminField({
  label,
  error,
  children,
  className,
}: AdminFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="text-[11px] font-black text-slate-400/80 uppercase tracking-[0.2em] ml-1.5 group-focus-within:text-emerald-400 transition-all duration-300">
        {label}
      </label>
      <div className="relative group mt-2">{children}</div>
      {error && (
        <p className="text-[10px] text-red-500 font-bold ml-1 animate-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: IconType;
}

export function AdminInput({
  icon: Icon,
  className,
  ...props
}: AdminInputProps) {
  return (
    <div className="relative group/input w-full">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-white transition-colors z-10 pointer-events-none">
          <Icon size={16} />
        </div>
      )}
      <Input
        className={cn(
          "bg-white dark:bg-slate-950/40 border-slate-200 dark:border-white/5 rounded-xl h-12 focus:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/5 transition-all duration-300 font-bold text-sm text-slate-900 dark:text-slate-200 placeholder:text-slate-500 dark:placeholder:text-slate-600 shadow-inner dark:shadow-black/20",
          Icon && "pl-11",
          className,
        )}
        {...props}
      />
    </div>
  );
}

interface AdminTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  icon?: IconType;
}

export function AdminTextarea({
  icon: Icon,
  className,
  ...props
}: AdminTextareaProps) {
  return (
    <div className="relative group/input w-full">
      {Icon && (
        <div className="absolute left-4 top-5 text-slate-600 group-focus-within/input:text-white transition-colors z-10 pointer-events-none">
          <Icon size={16} />
        </div>
      )}
      <Textarea
        className={cn(
          "bg-white dark:bg-slate-950/40 border-slate-200 dark:border-white/5 rounded-xl min-h-[100px] focus:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/5 transition-all duration-300 p-4 leading-relaxed text-sm text-slate-900 dark:text-slate-200 placeholder:text-slate-500 dark:placeholder:text-slate-600 shadow-inner dark:shadow-black/20",
          Icon && "pl-11",
          className,
        )}
        {...props}
      />
    </div>
  );
}
