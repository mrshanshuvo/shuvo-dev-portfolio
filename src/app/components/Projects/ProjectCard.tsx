"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FaExternalLinkAlt, FaStar } from "react-icons/fa";
import type { Project } from "@/types";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProjectCard({
  project,
  index,
  iconRegistry,
}: {
  project: Project;
  index: number;
  iconRegistry?: Record<string, string>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative h-100 sm:h-112.5 w-full"
    >
      <div className="group relative bg-slate-900 rounded-xl border border-white/10 overflow-hidden flex flex-col h-full w-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:border-emerald-500/30 hover:shadow-[0_20px_50px_rgba(16,185,129,0.15)]">
        <Link
          href={`/projects/${project.slug}`}
          className="absolute inset-0 z-20"
        >
          <span className="sr-only">View Project Details</span>
        </Link>

        {/* Full Card Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={project.image || "/images/placeholder.png"}
            alt={project.title}
            fill
            priority={index < 4}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Gradients for text readability */}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/60 to-slate-900/10 opacity-90 transition-opacity duration-500 group-hover:opacity-85" />
        </div>

        {/* Top Section: Badges & Live Button */}
        <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-30 pointer-events-none">
          {/* Left: Featured Icon & Categories */}
          <div className="flex flex-wrap gap-2 max-w-[calc(100%-60px)] pointer-events-auto">
            {project.featured && (
              <div
                className="flex items-center justify-center px-3 py-1.5 bg-linear-to-r from-amber-500 to-orange-500 text-white text-xs font-bold tracking-widest uppercase rounded-full shadow-lg shrink-0"
                title="Featured Project"
              >
                <FaStar className="text-xs" />
              </div>
            )}
            {Array.isArray(project.category)
              ? project.category.map((cat) => (
                  <div
                    key={cat}
                    className="px-3 py-1.5 bg-white/10 dark:bg-black/40 text-white font-bold text-[10px] rounded-full backdrop-blur-md tracking-widest uppercase border border-white/20 shadow-lg whitespace-nowrap"
                  >
                    {cat}
                  </div>
                ))
              : project.category && (
                  <div className="px-3 py-1.5 bg-white/10 dark:bg-black/40 text-white font-bold text-[10px] rounded-full backdrop-blur-md tracking-widest uppercase border border-white/20 shadow-lg whitespace-nowrap">
                    {project.category}
                  </div>
                )}
          </div>

          <div className="shrink-0 pointer-events-auto">
            {project.live && project.live.length > 0 && (
              <Button
                variant="outline"
                size="icon"
                nativeButton={false}
                render={
                  <a
                    href={project.live[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
                className="rounded-full p-7 text-white bg-white/10 border border-white/20 backdrop-blur-md hover:text-emerald-400 hover:bg-white/10 hover:border-emerald-400/50 transition-colors shadow-lg"
                title="Live Demo"
              >
                <FaExternalLinkAlt className="size-6 drop-shadow-sm" />
              </Button>
            )}
          </div>
        </div>

        {/* Floating Content at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col z-30 pointer-events-none">
          <div className="mb-3">
            <h3 className="font-display text-2xl font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300 line-clamp-1 drop-shadow-md flex items-center gap-1.5">
              <span>{project.title}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="inline-block h-5 w-5 shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transition-none opacity-60 group-hover:opacity-100"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </h3>
          </div>

          <p className="text-slate-300 group-hover:text-slate-100 transition-colors duration-300 text-sm leading-relaxed mb-6 line-clamp-2 font-medium drop-shadow-sm">
            {project.description}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2 pointer-events-auto">
            {(project.techNames || []).slice(0, 4).map((name) => {
              const iconUrl = iconRegistry?.[name];
              return (
                <Badge
                  key={name}
                  variant="outline"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 rounded-xl text-[10px] font-bold shadow-sm backdrop-blur-md transition-all duration-300 group-hover:border-emerald-400/40 group-hover:bg-emerald-500/20 group-hover:text-emerald-200"
                  title={name}
                >
                  {iconUrl && (
                    <Image
                      src={iconUrl}
                      alt={name}
                      width={14}
                      height={14}
                      className="object-contain w-auto h-auto"
                    />
                  )}
                  {name}
                </Badge>
              );
            })}
            {(project.techNames || []).length > 4 && (
              <Badge
                variant="outline"
                className="flex items-center justify-center px-2 py-1.5 bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 rounded-xl text-[10px] font-bold shadow-sm backdrop-blur-md transition-all duration-300 group-hover:border-emerald-400/40 group-hover:bg-emerald-500/20 group-hover:text-emerald-200"
              >
                +{(project.techNames?.length || 0) - 4}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
