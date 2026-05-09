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
    <div className={cn("space-y-2.5", className)}>
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 opacity-80 group-focus-within:text-white transition-colors">
        {label}
      </label>
      <div className="relative group">
        {children}
      </div>
      {error && (
        <p className="text-[10px] text-red-500 font-bold ml-1 animate-in slide-in-from-top-1">{error}</p>
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
          "bg-slate-950/50 border-white/5 rounded-2xl h-14 focus:border-white/20 focus:ring-white/5 transition-all font-bold text-base",
          Icon && "pl-12",
          className,
        )}
        {...props}
      />
    </div>
  );
}

interface AdminTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  icon?: IconType;
}

export function AdminTextarea({ icon: Icon, className, ...props }: AdminTextareaProps) {
  return (
    <div className="relative group/input w-full">
      {Icon && (
        <div className="absolute left-4 top-5 text-slate-600 group-focus-within/input:text-white transition-colors z-10 pointer-events-none">
          <Icon size={16} />
        </div>
      )}
      <Textarea
        className={cn(
          "bg-slate-950/50 border-white/5 rounded-2xl min-h-[120px] focus:border-white/20 focus:ring-white/5 transition-all p-4 leading-relaxed",
          Icon && "pl-12",
          className,
        )}
        {...props}
      />
    </div>
  );
}
