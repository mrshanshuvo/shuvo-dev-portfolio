"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaExternalLinkAlt, FaCode } from "react-icons/fa";
import type { Project } from "@/types";

import ProjectCard from "./ProjectCard";

interface Props {
  projects: Project[];
}

export default function ProjectsClient({ projects }: Props) {
  return (
    <section
      id="projects"
      className="scroll-mt-28 py-16 bg-white dark:bg-slate-950"
    >
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-left"
          >
            <motion.h2
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 text-emerald-500 font-black uppercase tracking-[0.2em] text-sm md:text-lg"
            >
              <FaCode /> Featured Projects
            </motion.h2>
          </motion.div>

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex shrink-0"
          >
            <Link
              href="/projects"
              className="group px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 rounded-xl text-sm font-bold transition-all hover:scale-105 shadow-md flex items-center gap-2 cursor-pointer"
            >
              View All Projects
              <FaExternalLinkAlt
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                size={12}
              />
            </Link>
          </motion.div>
        </div>

        {/* Featured grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {projects.map((project, i) => (
            <ProjectCard
              key={project._id ?? project.slug}
              project={project}
              index={i}
            />
          ))}
        </div>

        {projects.length === 0 && (
          <p className="text-center text-slate-400 py-20">
            No featured projects yet.
          </p>
        )}
      </div>
    </section>
  );
}
