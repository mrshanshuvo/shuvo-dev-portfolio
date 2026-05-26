"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaGithub, FaExternalLinkAlt, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { getIcon } from "@/lib/techIconMap";
import type { Project } from "@/types";

interface Props {
  project: Project;
}

export default function ProjectDetailClient({ project }: Props) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Cinematic Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] dark:opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] dark:opacity-50" />
      </div>

      <section className="max-w-5xl mx-auto py-32 px-6 relative z-10">
        <Link
          href="/projects"
          className="group inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 text-sm mb-12 transition-all font-bold uppercase tracking-widest"
        >
          <FaArrowLeft className="text-xs group-hover:-translate-x-1 transition-transform" />{" "}
          Back to Project Archive
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-12">
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
              {project.title}
            </h1>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex flex-wrap gap-3">
                {Array.isArray(project.category)
                  ? project.category.map((cat) => (
                      <span
                        key={cat}
                        className="px-4 py-1.5 bg-emerald-500 text-white font-black text-[10px] rounded-full uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20"
                      >
                        {cat}
                      </span>
                    ))
                  : project.category && (
                      <span className="px-4 py-1.5 bg-emerald-500 text-white font-black text-[10px] rounded-full uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20">
                        {project.category}
                      </span>
                    )}
              </div>
              <div className="h-px flex-1 bg-slate-200 dark:bg-white/10 min-w-8" />
            </div>
          </div>

          <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden mb-16 bg-slate-100 dark:bg-slate-900 shadow-2xl border border-white/10 group">
            <Image
              src={project.image || "/images/placeholder.png"}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 80vw"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/40 to-transparent" />
          </div>

          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider">
                  The Story
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-xl leading-relaxed font-medium">
                  {project.description}
                </p>
              </div>

              {project.improvements && project.improvements.length > 0 && (
                <div className="p-10 rounded-[2.5rem] bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-xl">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 uppercase tracking-wider">
                    Execution & Outcomes
                  </h2>
                  <ul className="grid sm:grid-cols-2 gap-6">
                    {project.improvements.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-4 text-slate-600 dark:text-slate-400 font-medium"
                      >
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 mt-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-10">
              <div>
                <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-6">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-3">
                  {project.techNames.map((name) => {
                    const Icon = getIcon(name);
                    return (
                      <div
                        key={name}
                        className="flex items-center gap-3 px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-slate-700 dark:text-slate-300 font-bold shadow-sm hover:border-emerald-500/50 transition-colors"
                      >
                        <Icon className="text-emerald-500" />
                        <span>{name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-10 border-t border-slate-200 dark:border-white/10 space-y-4">
                <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-6">
                  Links
                </h3>
                <div className="flex flex-col gap-4">
                  {project.github &&
                    project.github.map((gh, idx) => (
                      <a
                        key={`gh-${idx}`}
                        href={gh.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black transition-all hover:scale-105 shadow-xl"
                      >
                        <FaGithub size={20} /> {gh.label || "View Source Code"}
                      </a>
                    ))}
                  {project.live &&
                    project.live.map((live, idx) => (
                      <a
                        key={`live-${idx}`}
                        href={live.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black transition-all hover:scale-105 shadow-xl shadow-emerald-500/20"
                      >
                        <FaExternalLinkAlt size={18} />{" "}
                        {live.label || "Visit Live Project"}
                      </a>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Media Gallery */}
          {project.media && project.media.length > 0 && (
            <div className="mt-24 space-y-12">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-widest text-center">
                Project Gallery
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {project.media.map((m, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 group bg-slate-100 dark:bg-slate-900"
                  >
                    {m.type === "video" ? (
                      <video
                        src={m.url}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : m.type === "embed" ? (
                      <iframe
                        src={m.url}
                        className="w-full h-full border-0"
                        allowFullScreen
                      />
                    ) : (
                      <Image
                        src={m.url}
                        alt={
                          m.caption || `${project.title} screenshot ${idx + 1}`
                        }
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    )}
                    {m.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-sm p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <p className="text-white text-sm font-bold text-center">
                          {m.caption}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
}
