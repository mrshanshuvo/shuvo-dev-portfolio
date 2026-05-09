"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  FaHome,
  FaProjectDiagram,
  FaBriefcase,
  FaUser,
  FaEnvelope,
  FaSignOutAlt,
  FaExternalLinkAlt,
  FaChevronRight,
  FaRocket,
  FaChartLine,
  FaChartBar,
  FaGraduationCap,
  FaLink,
  FaQuoteLeft,
  FaAward,
  FaPenNib,
  FaServicestack,
  FaFlask,
  FaProjectDiagram as FaWorkflow,
  FaCog,
  FaLayerGroup,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: MdDashboard,
    color: "text-blue-400",
  },
  {
    href: "/admin/messages",
    label: "Messages",
    icon: FaEnvelope,
    color: "text-blue-500",
  },
  {
    type: "label",
    label: "Identity & Social",
  },
  {
    href: "/admin/hero",
    label: "Identity",
    icon: FaHome,
    color: "text-purple-400",
  },
  {
    href: "/admin/socials",
    label: "Social Links",
    icon: FaLink,
    color: "text-blue-400",
  },
  {
    href: "/admin/about",
    label: "Biography",
    icon: FaUser,
    color: "text-pink-400",
  },
  {
    href: "/admin/stats",
    label: "Stats & Milestones",
    icon: FaChartBar,
    color: "text-amber-400",
  },
  {
    type: "label",
    label: "Professional",
  },
  {
    href: "/admin/skills",
    label: "Skills & Tech",
    icon: FaRocket,
    color: "text-purple-500",
  },
  {
    href: "/admin/services",
    label: "Services",
    icon: FaServicestack,
    color: "text-emerald-400",
  },
  {
    href: "/admin/workflow",
    label: "Methodology",
    icon: FaWorkflow,
    color: "text-amber-400",
  },
  {
    type: "label",
    label: "Portfolio",
  },
  {
    href: "/admin/projects",
    label: "Projects",
    icon: FaProjectDiagram,
    color: "text-emerald-400",
  },
  {
    href: "/admin/demos",
    label: "Playground",
    icon: FaFlask,
    color: "text-purple-400",
  },
  {
    href: "/admin/blogs",
    label: "Blog & Writing",
    icon: FaPenNib,
    color: "text-blue-400",
  },
  {
    href: "/admin/testimonials",
    label: "Testimonials",
    icon: FaQuoteLeft,
    color: "text-blue-500",
  },
  {
    type: "label",
    label: "Timeline",
  },
  {
    href: "/admin/experience",
    label: "Experience",
    icon: FaBriefcase,
    color: "text-amber-500",
  },
  {
    href: "/admin/education",
    label: "Education",
    icon: FaGraduationCap,
    color: "text-emerald-500",
  },
  {
    href: "/admin/certifications",
    label: "Certifications",
    icon: FaAward,
    color: "text-amber-400",
  },
  {
    type: "label",
    label: "Management",
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: FaCog,
    color: "text-slate-400",
  },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 border-r border-white/5 flex flex-col h-screen transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Brand */}
        <div className="p-8">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-linear-to-tr from-emerald-600 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative w-11 h-11 bg-slate-900 border border-white/10 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-lg tracking-tighter">
                  A
                </span>
              </div>
            </div>
            <div>
              <p className="text-white font-bold text-base tracking-tight">
                Admin <span className="text-emerald-400">Panel</span>
              </p>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                Portfolio v2.0
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav
          className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto custom-scrollbar min-h-0"
          data-lenis-prevent
        >
          <div className="px-4 mb-4">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
              Management
            </p>
          </div>
          {navItems.map((item, idx) => {
            if (item.type === "label") {
              return (
                <div key={`label-${idx}`} className="px-4 pt-6 pb-2">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                    {item.label}
                  </p>
                </div>
              );
            }

            const isActive = pathname === item.href;
            const Icon = item.icon!;
            return (
              <Link
                key={item.href}
                href={item.href!}
                onClick={onClose}
                className={cn(
                  "group relative flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300",
                  isActive
                    ? "bg-white/5 text-white shadow-[0_0_20px_rgba(255,255,255,0.02)] border border-white/10"
                    : "text-slate-500 hover:text-slate-200 hover:bg-white/2",
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-5 bg-emerald-500 rounded-r-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  />
                )}
                <Icon
                  className={cn(
                    "text-lg transition-colors",
                    isActive ? item.color : "group-hover:text-slate-300",
                  )}
                />
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <FaChevronRight size={10} className="text-slate-600" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-white/5 bg-slate-950/20 space-y-3">
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-normal font-bold text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/10 transition-all group"
          >
            <div className="p-2 rounded-lg bg-slate-900 group-hover:bg-red-500/20 transition-colors">
              <FaSignOutAlt size={16} />
            </div>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
