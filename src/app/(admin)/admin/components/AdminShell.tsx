"use client";

import { useState, ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminMobileHeader from "./AdminMobileHeader";
import AdminTopbar from "./AdminTopbar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AdminShell({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.05),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.05),transparent_50%)]" />
      </div>

      <AdminMobileHeader
        isOpen={isSidebarOpen}
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main
        className="flex-1 z-10 overflow-auto custom-scrollbar lg:h-screen sticky top-0"
        data-lenis-prevent
      >
        <div className="hidden lg:block sticky top-0 z-50">
          <AdminTopbar />
        </div>
        {children}
      </main>
    </div>
  );
}
