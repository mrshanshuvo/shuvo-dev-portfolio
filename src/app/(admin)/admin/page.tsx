import { connectDB } from "@/lib/mongodb";
import VisitorChart from "./components/VisitorChart";

import Project from "@/models/Project";
import Experience from "@/models/Experience";
import Link from "next/link";
import {
  FaProjectDiagram,
  FaBriefcase,
  FaUser,
  FaHome,
  FaRocket,
  FaChartLine,
  FaChartBar,
  FaEnvelope,
  FaQuoteLeft,
  FaAward,
  FaServicestack,
  FaFlask,
  FaPenNib,
  FaChevronRight,
  FaCog,
} from "react-icons/fa";
import Message from "@/models/Message";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import Blog from "@/models/Blog";
import Service from "@/models/Service";
import Testimonial from "@/models/Testimonial";
import Certification from "@/models/Certification";

import Visitor from "@/models/Visitor";

async function getStats() {
  await connectDB();
  const [
    projectCount,
    expCount,
    msgCount,
    blogCount,
    serviceCount,
    testimonialCount,
    certCount,
    visitorStats,
    visitorTrend,
  ] = await Promise.all([
    Project.countDocuments(),
    Experience.countDocuments(),
    Message.countDocuments({ status: "unread" }),
    Blog.countDocuments(),
    Service.countDocuments(),
    Testimonial.countDocuments(),
    Certification.countDocuments(),
    Visitor.aggregate([{ $group: { _id: null, total: { $sum: "$count" } } }]),
    Visitor.find().sort({ date: -1 }).limit(7).lean(),
  ]);

  return {
    projectCount,
    expCount,
    msgCount,
    blogCount,
    serviceCount,
    testimonialCount,
    certCount,
    visitorCount: visitorStats[0]?.total || 0,
    visitorTrend: visitorTrend.reverse().map((v: any) => ({
      date: v.date,
      count: v.count,
    })),
  };
}

async function getRecentActivity() {
  await connectDB();

  const [
    recentProjects,
    recentMsgs,
    recentBlogs,
    recentExp,
    recentCerts,
    recentTestimonials,
  ] = await Promise.all([
    Project.find().sort({ updatedAt: -1 }).limit(3).lean(),
    Message.find().sort({ createdAt: -1 }).limit(3).lean(),
    Blog.find().sort({ updatedAt: -1 }).limit(2).lean(),
    Experience.find().sort({ updatedAt: -1 }).limit(2).lean(),
    Certification.find().sort({ updatedAt: -1 }).limit(2).lean(),
    Testimonial.find().sort({ updatedAt: -1 }).limit(2).lean(),
  ]);

  const activities = [
    ...recentProjects.map((p: any) => ({
      type: "Project",
      title: p.title,
      time: p.updatedAt,
      action: "Updated",
    })),
    ...recentMsgs.map((m: any) => ({
      type: "Message",
      title: `From: ${m.name}`,
      time: m.createdAt,
      action: "Received",
    })),
    ...recentBlogs.map((b: any) => ({
      type: "Blog",
      title: b.title,
      time: b.updatedAt,
      action: "Published",
    })),
    ...recentExp.map((e: any) => ({
      type: e.type === "education" ? "Education" : "Experience",
      title: e.title,
      time: e.updatedAt,
      action: "Updated",
    })),
    ...recentCerts.map((c: any) => ({
      type: "Certification",
      title: c.title,
      time: c.updatedAt,
      action: "Added",
    })),
    ...recentTestimonials.map((t: any) => ({
      type: "Testimonial",
      title: t.name,
      time: t.updatedAt,
      action: "Updated",
    })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 6);

  return JSON.parse(JSON.stringify(activities));
}

const sections = [
  {
    href: "/admin/messages",
    label: "Messages",
    desc: "View and manage incoming contact form submissions",
    icon: FaEnvelope,
    color: "blue",
    gradient: "from-blue-500/20 to-blue-600/5 border-blue-500/20",
    iconColor: "text-blue-400",
  },
  {
    href: "/admin/hero",
    label: "Identity",
    desc: "Update your name, profile picture, resume & typing sequences",
    icon: FaHome,
    color: "emerald",
    gradient: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20",
    iconColor: "text-emerald-400",
  },
  {
    href: "/admin/socials",
    label: "Social Links",
    desc: "Manage your GitHub, LinkedIn, and other professional links",
    icon: FaRocket,
    color: "blue",
    gradient: "from-blue-500/20 to-blue-600/5 border-blue-500/20",
    iconColor: "text-blue-400",
  },
  {
    href: "/admin/about",
    label: "Biography",
    desc: "Edit your professional bio, highlights & tech list",
    icon: FaUser,
    color: "purple",
    gradient: "from-purple-500/20 to-purple-600/5 border-purple-500/20",
    iconColor: "text-purple-400",
  },
  {
    href: "/admin/stats",
    label: "Stats & Milestones",
    desc: "Showcase your achievements in numbers (projects, years, etc.)",
    icon: FaChartBar,
    color: "amber",
    gradient: "from-amber-500/20 to-amber-600/5 border-amber-500/20",
    iconColor: "text-amber-400",
  },
  {
    href: "/admin/skills",
    label: "Skills & Tech",
    desc: "Manage your technical expertise and proficiency levels",
    icon: FaRocket,
    color: "pink",
    gradient: "from-pink-500/20 to-pink-600/5 border-pink-500/20",
    iconColor: "text-pink-400",
  },
  {
    href: "/admin/services",
    label: "Services",
    desc: "Define your professional offerings for clients",
    icon: FaServicestack,
    color: "emerald",
    gradient: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20",
    iconColor: "text-emerald-400",
  },
  {
    href: "/admin/workflow",
    label: "Methodology",
    desc: "Showcase your development and engineering process",
    icon: FaProjectDiagram,
    color: "amber",
    gradient: "from-amber-500/20 to-amber-600/5 border-amber-500/20",
    iconColor: "text-amber-400",
  },
  {
    href: "/admin/projects",
    label: "Projects",
    desc: "Add, edit, or delete portfolio projects",
    icon: FaProjectDiagram,
    color: "blue",
    gradient: "from-blue-500/20 to-blue-600/5 border-blue-500/20",
    iconColor: "text-blue-400",
  },
  {
    href: "/admin/demos",
    label: "Playground",
    desc: "Manage live interactive demos and experiments",
    icon: FaFlask,
    color: "purple",
    gradient: "from-purple-500/20 to-purple-600/5 border-purple-500/20",
    iconColor: "text-purple-400",
  },
  {
    href: "/admin/blogs",
    label: "Blog & Writing",
    desc: "Manage your articles, posts and technical writing",
    icon: FaPenNib,
    color: "blue",
    gradient: "from-blue-500/20 to-blue-600/5 border-blue-500/20",
    iconColor: "text-blue-400",
  },
  {
    href: "/admin/experience",
    label: "Experience",
    desc: "Manage work experience and professional timeline",
    icon: FaBriefcase,
    color: "amber",
    gradient: "from-amber-500/20 to-amber-600/5 border-amber-500/20",
    iconColor: "text-amber-400",
  },
  {
    href: "/admin/education",
    label: "Education",
    desc: "Manage academic qualifications and degrees",
    icon: FaRocket,
    color: "emerald",
    gradient: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20",
    iconColor: "text-emerald-400",
  },
  {
    href: "/admin/certifications",
    label: "Certifications",
    desc: "Manage professional certifications and awards",
    icon: FaAward,
    color: "amber",
    gradient: "from-amber-500/20 to-amber-600/5 border-amber-500/20",
    iconColor: "text-amber-400",
  },
  {
    href: "/admin/testimonials",
    label: "Testimonials",
    desc: "Manage client feedback and social proof",
    icon: FaQuoteLeft,
    color: "blue",
    gradient: "from-blue-500/20 to-blue-600/5 border-blue-500/20",
    iconColor: "text-blue-400",
  },
  {
    href: "/admin/settings",
    label: "Settings",
    desc: "Manage global SEO, communication, and visual DNA",
    icon: FaCog,
    color: "slate",
    gradient: "from-slate-500/20 to-slate-600/5 border-slate-500/20",
    iconColor: "text-slate-400",
  },
];

export default async function AdminDashboard() {
  const [statsData, activities] = await Promise.all([
    getStats(),
    getRecentActivity(),
  ]);

  const topStats = [
    {
      label: "Unread Messages",
      value: statsData.msgCount,
      icon: FaEnvelope,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Portfolio Projects",
      value: statsData.projectCount,
      icon: FaProjectDiagram,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Blog Articles",
      value: statsData.blogCount,
      icon: FaPenNib,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      label: "Portfolio Visits",
      value: statsData.visitorCount,
      icon: FaChartLine,
      color: "text-pink-400",
      bg: "bg-pink-500/10",
    },
  ];

  const groupedSections = [
    {
      label: "Professional Identity",
      items: sections.filter((s) =>
        [
          "Identity",
          "Social Links",
          "Biography",
          "Stats & Milestones",
          "Skills & Tech",
        ].includes(s.label),
      ),
    },
    {
      label: "Professional Offerings",
      items: sections.filter((s) =>
        ["Services", "Methodology"].includes(s.label),
      ),
    },
    {
      label: "Portfolio & Writing",
      items: sections.filter((s) =>
        ["Projects", "Playground", "Blog & Writing", "Testimonials"].includes(
          s.label,
        ),
      ),
    },
    {
      label: "Experience & Education",
      items: sections.filter((s) =>
        ["Experience", "Education", "Certifications"].includes(s.label),
      ),
    },
    {
      label: "System Management",
      items: sections.filter((s) => ["Settings"].includes(s.label)),
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Action bar — title is already shown in the AdminTopbar breadcrumb */}
      <div className="flex items-center justify-end gap-3">
        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/20 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[10px]">
          System Online
        </Badge>
        <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 dark:border-blue-500/20 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[10px]">
          v2.4.0
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {topStats.map((s) => (
          <Card
            key={s.label}
            className="bg-white dark:bg-slate-900/40 border-slate-200 dark:border-white/5 backdrop-blur-xl rounded-3xl overflow-hidden group hover:border-emerald-500/20 dark:hover:border-white/10 transition-all shadow-sm dark:shadow-none"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${s.bg} ${s.color}`}>
                  <s.icon size={20} />
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-black text-slate-900 dark:text-white group-hover:scale-110 origin-left transition-transform duration-500">
                  {s.value}
                </p>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                  {s.label}
                </p>
              </div>
              {s.label === "Portfolio Visits" && (
                <VisitorChart data={statsData.visitorTrend} />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Management Sections */}
        <div className="lg:col-span-2 space-y-12">
          {groupedSections.map((group) => (
            <div key={group.label} className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] whitespace-nowrap">
                  {group.label}
                </h2>
                <div className="h-px w-full bg-slate-200 dark:bg-white/5" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {group.items.map((section) => (
                  <Link
                    key={section.href}
                    href={section.href}
                    className="group"
                  >
                    <Card className="h-full bg-white dark:bg-slate-900/40 border-slate-200 dark:border-white/5 backdrop-blur-xl rounded-3xl overflow-hidden hover:border-emerald-500/20 dark:hover:border-white/20 transition-all duration-500 shadow-sm dark:shadow-none">
                      <CardContent className="p-4 flex items-start gap-5">
                        <div
                          className={`p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 ${section.iconColor} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                        >
                          <section.icon size={22} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {section.label}
                            </h3>
                            <FaChevronRight
                              size={10}
                              className="text-slate-700 group-hover:text-white group-hover:translate-x-1 transition-all"
                            />
                          </div>
                          <p className="text-slate-500 text-xs leading-relaxed line-clamp-1 group-hover:text-slate-400 transition-colors">
                            {section.desc}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar / Recent Activity */}
        <div className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">
              Recent Activity
            </h2>
            <Card className="bg-white dark:bg-slate-900/40 border-slate-200 dark:border-white/5 backdrop-blur-xl rounded-3xl overflow-hidden shadow-sm dark:shadow-none">
              <CardContent className="p-4 space-y-6">
                {activities.length > 0 ? (
                  activities.map((act: any, idx: number) => (
                    <div key={idx} className="flex gap-4 group">
                      <div className="relative flex flex-col items-center">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:border-emerald-500/30 transition-colors">
                          {act.type === "Project" && (
                            <FaProjectDiagram size={16} />
                          )}
                          {act.type === "Message" && <FaEnvelope size={16} />}
                          {act.type === "Blog" && <FaPenNib size={16} />}
                          {(act.type === "Experience" ||
                            act.type === "Education") && (
                            <FaBriefcase size={16} />
                          )}
                          {act.type === "Certification" && (
                            <FaAward size={16} />
                          )}
                          {act.type === "Testimonial" && (
                            <FaQuoteLeft size={16} />
                          )}
                        </div>
                        {idx !== activities.length - 1 && (
                          <div className="w-px h-full bg-slate-200 dark:bg-white/5 mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-xs font-black text-slate-900 dark:text-white">
                            {act.type} {act.action}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600">
                            {new Date(act.time).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-slate-400 text-sm font-medium line-clamp-1">
                          {act.title}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-600 text-center text-sm py-4">
                    No recent activity found.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/20 rounded-3xl p-6 shadow-sm dark:shadow-none">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <FaRocket size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Quick Preview
                </h3>
                <p className="text-emerald-600/60 dark:text-emerald-400/60 text-xs leading-relaxed">
                  View your changes live on the public-facing portfolio.
                </p>
              </div>
              <Link href="/" target="_blank" className="block">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20 py-6">
                  Launch Site
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
