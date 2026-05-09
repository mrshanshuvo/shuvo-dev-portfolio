"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChevronRight, FaHome } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import AdminThemeToggle from "@/app/admin/components/AdminThemeToggle";

// Mirror the nav items — label only, no icons needed here
const PAGE_MAP: Record<string, { label: string; parent?: string }> = {
  "/admin": { label: "Dashboard" },
  "/admin/hero": { label: "Identity", parent: "Identity & Social" },
  "/admin/socials": { label: "Social Links", parent: "Identity & Social" },
  "/admin/about": { label: "Biography", parent: "Identity & Social" },
  "/admin/stats": { label: "Stats & Milestones", parent: "Identity & Social" },
  "/admin/skills": { label: "Skills & Tech", parent: "Professional" },
  "/admin/services": { label: "Services", parent: "Professional" },
  "/admin/workflow": { label: "Methodology", parent: "Professional" },
  "/admin/projects": { label: "Projects", parent: "Portfolio" },
  "/admin/demos": { label: "Playground", parent: "Portfolio" },
  "/admin/blogs": { label: "Blog & Writing", parent: "Portfolio" },
  "/admin/testimonials": { label: "Testimonials", parent: "Portfolio" },
  "/admin/experience": { label: "Experience", parent: "Timeline" },
  "/admin/education": { label: "Education", parent: "Timeline" },
  "/admin/certifications": { label: "Certifications", parent: "Timeline" },
  "/admin/messages": { label: "Messages" },
  "/admin/settings": { label: "Settings", parent: "Management" },
};

export default function AdminTopbar() {
  const pathname = usePathname();

  // Match longest prefix (handles dynamic sub-routes like /admin/projects/[id])
  const matched =
    Object.keys(PAGE_MAP)
      .filter((k) => pathname === k || pathname.startsWith(k + "/"))
      .sort((a, b) => b.length - a.length)[0] ?? "/admin";

  const page = PAGE_MAP[matched];
  const isDashboard = matched === "/admin";
  const subRoute = pathname.replace(matched, "").split("/").filter(Boolean);

  return (
    <div className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 h-14 flex items-center justify-between px-6 gap-3">
      {/* Left: Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-sm min-w-0"
      >
        {/* Admin root */}
        <Link
          href="/admin"
          className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 transition-colors shrink-0 font-medium"
        >
          <MdDashboard size={14} />
          <span className="hidden sm:inline">Admin</span>
        </Link>

        {!isDashboard && (
          <>
            <FaChevronRight
              size={9}
              className="text-slate-400 dark:text-slate-700 shrink-0"
            />
            <Link
              href={matched}
              className={`tracking-tight truncate ${
                subRoute.length > 0
                  ? "text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 font-medium transition-colors"
                  : "text-slate-900 dark:text-white font-bold text-base"
              }`}
            >
              {page?.label ?? "Page"}
            </Link>
          </>
        )}

        {subRoute.length > 0 && (
          <>
            <FaChevronRight
              size={9}
              className="text-slate-400 dark:text-slate-700 shrink-0"
            />
            <span className="text-slate-900 dark:text-white font-bold text-base tracking-tight truncate">
              {subRoute[0] === "new" ? "New" : "Edit"}
            </span>
          </>
        )}
      </nav>

      {/* Right: Theme Toggle */}
      <div className="flex items-center gap-3">
        <AdminThemeToggle />
      </div>
    </div>
  );
}
