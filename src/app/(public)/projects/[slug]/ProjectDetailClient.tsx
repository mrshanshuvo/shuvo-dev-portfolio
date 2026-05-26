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
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[140px] dark:opacity-40" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[140px] dark:opacity-40" />
      </div>

      <section className="max-w-7xl mx-auto py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Sticky Sidebar */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-8">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 text-xs font-bold uppercase tracking-widest transition-colors"
            >
              <FaArrowLeft className="text-[10px] group-hover:-translate-x-1 transition-transform" />
              Back to Archive
            </Link>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="p-8 md:p-10 rounded-[2.5rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200/50 dark:border-white/10 shadow-2xl relative overflow-hidden group"
            >
              {/* Decorative subtle background gradient */}
              <div className="absolute -inset-px bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="relative space-y-8">
                {/* Categories */}
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(project.category)
                    ? project.category.map((cat) => (
                        <span
                          key={cat}
                          className="px-3 py-1 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black text-[9px] rounded-full uppercase tracking-widest border border-emerald-500/20"
                        >
                          {cat}
                        </span>
                      ))
                    : project.category && (
                        <span className="px-3 py-1 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black text-[9px] rounded-full uppercase tracking-widest border border-emerald-500/20">
                          {project.category}
                        </span>
                      )}
                </div>

                {/* Title */}
                <div>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                    {project.title}
                  </h1>
                </div>

                {/* Tech Stack */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                    Built With
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {project.techNames.map((name) => {
                      const Icon = getIcon(name);
                      return (
                        <div
                          key={name}
                          className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-white/5 rounded-xl text-xs text-slate-700 dark:text-slate-300 font-bold shadow-sm"
                        >
                          <Icon className="text-emerald-500 text-sm shrink-0" />
                          <span>{name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action CTA Buttons */}
                <div className="pt-6 border-t border-slate-200/50 dark:border-white/10 space-y-3.5">
                  {project.live &&
                    project.live.map((live, idx) => (
                      <a
                        key={`live-${idx}`}
                        href={live.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30"
                      >
                        <FaExternalLinkAlt className="text-xs shrink-0" />
                        <span>{live.label || "Visit Live Demo"}</span>
                      </a>
                    ))}
                  {project.github &&
                    project.github.map((gh, idx) => (
                      <a
                        key={`gh-${idx}`}
                        href={gh.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 px-6 py-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 rounded-2xl font-black text-sm transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                      >
                        <FaGithub className="text-sm shrink-0" />
                        <span>{gh.label || "View Code"}</span>
                      </a>
                    ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Scrollable Bento Case Study */}
          <div className="lg:col-span-7 space-y-12 lg:space-y-16">
            {/* Main Showcase Image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-2xl border border-slate-200/50 dark:border-white/10 group"
            >
              <Image
                src={project.image || "/images/placeholder.png"}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, 60vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" />
            </motion.div>

            {/* Content Bento Grid */}
            <div className="space-y-8">
              
              {/* Bento Block 1: The Story */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="p-8 md:p-10 rounded-[2rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 shadow-xl space-y-4"
              >
                <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  The Story
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed font-medium">
                  {project.description}
                </p>
              </motion.div>

              {/* Bento Block 2: Execution & Outcomes */}
              {project.improvements && project.improvements.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="p-8 md:p-10 rounded-[2rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 shadow-xl space-y-6"
                >
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Execution & Outcomes
                  </h2>
                  <div className="grid md:grid-cols-2 gap-5">
                    {project.improvements.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/80 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 shadow-sm"
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        </div>
                        <span className="text-slate-600 dark:text-slate-300 font-bold text-sm leading-relaxed">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Bento Block 3: Media Gallery */}
              {project.media && project.media.length > 0 && (
                <div className="space-y-6 pt-4">
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider px-2">
                    Project Gallery
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {project.media.map((m, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className="relative aspect-video rounded-3xl overflow-hidden shadow-xl border border-slate-200/50 dark:border-white/10 group bg-slate-100 dark:bg-slate-900"
                      >
                        {m.type === "video" ? (
                          <video
                            src={m.url}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="object-cover w-full h-full group-hover:scale-102 transition-transform duration-700 ease-out"
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
                            className="object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
                            sizes="(max-width: 768px) 100vw, 30vw"
                          />
                        )}
                        {m.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xs p-3.5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                            <p className="text-white text-xs font-bold text-center">
                              {m.caption}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
