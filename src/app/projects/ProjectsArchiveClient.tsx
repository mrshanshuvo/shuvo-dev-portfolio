"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/types";
import ProjectCard from "@/app/components/Projects/ProjectCard";
import { Button } from "@/components/ui/button";

interface Props {
  projects: Project[];
}

export default function ProjectsArchiveClient({ projects }: Props) {
  const [activeCategory, setActiveCategory] = useState("All");

  const allCats = projects.flatMap(p => Array.isArray(p.category) ? p.category : p.category ? [p.category] : []);
  const categories = ["All", ...Array.from(new Set(allCats))];

  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter((p) => Array.isArray(p.category) ? p.category.includes(activeCategory) : p.category === activeCategory);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight"
          >
            Project <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-blue-500">Archive</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
          >
            A comprehensive collection of my technical work, from experimental prototypes to full-scale applications.
          </motion.p>
        </div>

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
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
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
            <p className="text-slate-500 text-xl font-medium">No projects found in this category.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
