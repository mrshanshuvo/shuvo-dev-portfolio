import React from "react";

export default function AdminLoading() {
  return (
    <div className="w-full h-full min-h-[60vh] flex flex-col items-center justify-center gap-6 p-8">
      {/* Premium Gradient Spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-slate-800" />
        <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-emerald-500 animate-spin shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
      </div>

      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-500 animate-pulse">
          Synchronizing
        </h3>
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
          Securing Admin Session...
        </p>
      </div>
    </div>
  );
}
