"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/types";
import ProjectCard from "@/app/components/Projects/ProjectCard";
import { Button } from "@/components/ui/button";
import { FaArchive } from "react-icons/fa";

interface Props {
  projects: Project[];
}

export default function ProjectsArchiveClient({ projects }: Props) {
  const [activeCategory, setActiveCategory] = useState("All");

  const allCats = projects.flatMap((p) =>
    Array.isArray(p.category) ? p.category : p.category ? [p.category] : [],
  );
  const categories = ["All", ...Array.from(new Set(allCats))];

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) =>
          Array.isArray(p.category)
            ? p.category.includes(activeCategory)
            : p.category === activeCategory,
        );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8"
        >
          <div className="text-left">
            <motion.h2
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 text-emerald-500 font-black uppercase tracking-[0.3em] text-sm md:text-base mx-6"
            >
              <FaArchive />{" "}
              {projects.length > 0 ? "All Projects" : "No Projects"}
            </motion.h2>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setActiveCategory(category)}
              variant={activeCategory === category ? "default" : "outline"}
              className={`rounded-full px-6 py-2 text-sm font-bold transition-all ${
                activeCategory === category
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:border-emerald-500"
              }`}
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project._id || project.slug}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProjectCard project={project} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-slate-500 text-xl font-medium">
              No projects found in this category.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
