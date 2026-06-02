"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaArrowLeft,
  FaGlobe,
  FaCodeBranch,
} from "react-icons/fa";
import Link from "next/link";
import type { Project } from "@/types";

interface Props {
  project: Project;
  iconRegistry?: Record<string, string>;
}

export default function ProjectDetailClient({ project, iconRegistry }: Props) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden font-sans">
      {/* Background Noise & Vibrant Radial Mesh Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[140px]" />
      </div>

      <section className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 mt-10 py-20 relative z-10 space-y-8">
        {/* Top Header Bar */}
        <div className="flex justify-between items-center">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 px-4 py-2 bg-slate-900/80 hover:bg-slate-800/80 backdrop-blur-md text-slate-400 hover:text-white text-xs font-bold uppercase tracking-widest rounded-full border border-white/5 transition-all shadow-lg"
          >
            <FaArrowLeft className="text-[10px] group-hover:-translate-x-1 transition-transform" />
            Back to Archive
          </Link>
          <div className="flex gap-2">
            {Array.isArray(project.category)
              ? project.category.map((cat) => (
                  <span
                    key={cat}
                    className="px-3.5 py-1.5 bg-emerald-500/10 text-emerald-400 font-black text-[10px] rounded-full uppercase tracking-widest border border-emerald-500/20 shadow-md shadow-emerald-500/5"
                  >
                    {cat}
                  </span>
                ))
              : project.category && (
                  <span className="px-3.5 py-1.5 bg-emerald-500/10 text-emerald-400 font-black text-[10px] rounded-full uppercase tracking-widest border border-emerald-500/20 shadow-md shadow-emerald-500/5">
                    {project.category}
                  </span>
                )}
          </div>
        </div>

        {/* Cinematic Title Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-transparent bg-clip-text bg-linear-to-r from-white via-slate-100 to-slate-500">
            {project.title}
          </h1>
        </motion.div>

        {/* Master Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* COLUMN 1-8: Left Side Content (Showcase, Story, Gallery) */}
          <div className="lg:col-span-8 space-y-8">
            {/* CARD 1: Main High-Fi Showcase Screen */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 group"
            >
              {/* Subtle ambient light behind screen */}
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/40 via-transparent to-slate-950/20 z-10" />
              <Image
                src={project.image || "/images/placeholder.png"}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-[1.01] transition-transform duration-700 ease-out z-0"
                sizes="(max-width: 1200px) 100vw, 80vw"
                priority
              />
            </motion.div>

            {/* CARD 4: The Story Case Study */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 md:p-12 rounded-xl bg-slate-900/30 backdrop-blur-2xl border border-white/5 shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-24 h-0.5 bg-linear-to-r from-emerald-500 to-blue-500" />
              <div className="space-y-4">
                <h2 className="text-xs font-black tracking-[0.2em] text-emerald-400 uppercase">
                  Project Case Study
                </h2>
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider">
                  The Story
                </h3>
                <p className="text-slate-300 text-lg leading-relaxed font-medium">
                  {project.description}
                </p>
              </div>
            </motion.div>

            {/* CARD 5: Execution & Outcomes */}
            {project.improvements && project.improvements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="p-8 md:p-12 rounded-xl bg-slate-900/30 backdrop-blur-2xl border border-white/5 shadow-xl space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-xs font-black tracking-[0.2em] text-emerald-400 uppercase">
                    Execution Details
                  </h2>
                  <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider">
                    Outcomes & Improvements
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {project.improvements.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-5 rounded-lg bg-slate-900/50 border border-white/5 shadow-md hover:border-emerald-500/20 transition-all duration-300 group"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                      </div>
                      <span className="text-slate-300 font-bold text-sm leading-relaxed">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* COLUMN 9-12: Right Side Sidebar Bento Cards (Links, Tech Stack) */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-32">
            {/* CARD 2: High-End Launchpad Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-8 rounded-xl bg-slate-900/40 backdrop-blur-2xl border border-white/5 shadow-xl relative overflow-hidden group space-y-6"
            >
              <div className="space-y-1">
                <h2 className="text-xs font-black tracking-[0.2em] text-emerald-400 uppercase">
                  Launchpad
                </h2>
                <h3 className="text-2xl font-black text-white uppercase tracking-wider">
                  Interactive Links
                </h3>
              </div>

              <div className="flex flex-col gap-4">
                {/* Live Link Render */}
                {project.live &&
                  project.live.map((live, idx) => (
                    <a
                      key={`live-${idx}`}
                      href={live.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 rounded-lg bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-lg shadow-emerald-950/40 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-0.5 group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="p-2.5 bg-white/10 rounded-md">
                          <FaGlobe className="text-base" />
                        </div>
                        <div className="flex flex-col items-start gap-0.5">
                          <span className="text-sm font-black">
                            {live.label || "Live Deployment"}
                          </span>
                          <span className="text-[10px] text-white/70 font-semibold tracking-wider uppercase">
                            Open Project
                          </span>
                        </div>
                      </div>
                      <FaExternalLinkAlt className="text-xs opacity-80 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  ))}

                {/* GitHub Link Render */}
                {project.github &&
                  project.github.map((gh, idx) => (
                    <a
                      key={`gh-${idx}`}
                      href={gh.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 rounded-lg bg-slate-900 hover:bg-slate-850 text-white font-black text-sm border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-0.5 group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="p-2.5 bg-slate-800 rounded-md border border-white/5">
                          <FaGithub className="text-base" />
                        </div>
                        <div className="flex flex-col items-start gap-0.5">
                          <span className="text-sm font-black">
                            {gh.label || "Source Code"}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                            Git Repository
                          </span>
                        </div>
                      </div>
                      <FaCodeBranch className="text-xs text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  ))}
              </div>
            </motion.div>

            {/* CARD 3: Tech Stack Matrix Grid */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-8 rounded-xl bg-slate-900/40 backdrop-blur-2xl border border-white/5 shadow-xl space-y-6"
            >
              <div className="space-y-1">
                <h2 className="text-xs font-black tracking-[0.2em] text-emerald-400 uppercase">
                  Tech Matrix
                </h2>
                <h3 className="text-2xl font-black text-white uppercase tracking-wider">
                  Technology Stack
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                {project.techNames.map((name) => {
                  const iconUrl = iconRegistry?.[name];
                  return (
                    <div
                      key={name}
                      className="flex flex-col items-center justify-center p-4 bg-slate-950/40 border border-white/5 hover:border-emerald-500/20 rounded-lg text-center shadow-sm hover:shadow-md hover:shadow-emerald-500/5 transition-all duration-300 group"
                    >
                      {iconUrl ? (
                        <Image
                          src={iconUrl}
                          alt={name}
                          width={32}
                          height={32}
                          className="object-contain mb-2 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                        />
                      ) : (
                        <div className="w-8 h-8 mb-2 shrink-0 flex items-center justify-center rounded bg-slate-800 text-slate-500 text-xs font-bold">
                          {name[0]}
                        </div>
                      )}
                      <span className="text-[11px] text-slate-400 group-hover:text-slate-200 font-bold transition-colors tracking-wide">
                        {name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* BOTTOM SECTION: Full Width Gallery */}
        {project.media && project.media.length > 0 && (
          <div className="space-y-8 pt-8">
            <div className="space-y-2 text-center">
              <h2 className="text-xs font-black tracking-[0.2em] text-emerald-400 uppercase">
                Visual Showcase
              </h2>
              <h3 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-widest">
                Project Gallery
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {project.media.map((m, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="relative aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10 group bg-slate-900"
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
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  )}
                  {m.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-slate-950/85 backdrop-blur-md p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-20">
                      <p className="text-white text-xs font-bold text-center tracking-wide">
                        {m.caption}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
