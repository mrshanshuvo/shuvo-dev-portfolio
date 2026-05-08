"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FaGithub, FaExternalLinkAlt, FaStar } from "react-icons/fa";
import type { Project } from "@/types";
import { getIcon } from "@/lib/techIconMap";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import ProjectCard from "./ProjectCard";

interface Props {
  projects: Project[];
}

export default function ProjectsClient({ projects }: Props) {
  return (
    <section id="projects" className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
        >
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 text-emerald-500 font-black uppercase tracking-[0.3em] text-sm mb-4"
            >
              <FaStar /> The Showcase
            </motion.div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
              Featured{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-500 to-blue-500">
                Projects
              </span>
            </h2>
          </div>
          <p className="text-md md:text-lg text-slate-600 dark:text-slate-400 max-w-xl md:text-right font-medium leading-relaxed line-clamp-2">
            A curated selection of my most impactful work, demonstrating
            technical depth and user-centric engineering solutions.
          </p>
        </motion.div>

        {/* Featured grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {projects.map((project, i) => (
            <ProjectCard
              key={project._id ?? project.slug}
              project={project}
              index={i}
            />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <Link
            href="/projects"
            className="group px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-2xl text-lg font-black transition-all hover:scale-105 shadow-xl hover:shadow-emerald-500/20 flex items-center gap-3"
          >
            View All Projects
            <FaExternalLinkAlt
              className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              size={16}
            />
          </Link>
        </motion.div>

        {projects.length === 0 && (
          <p className="text-center text-slate-400 py-20">
            No featured projects yet.
          </p>
        )}
      </div>
    </section>
  );
}
