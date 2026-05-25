"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Demo } from "@/types";
import PlaygroundCard from "@/app/components/Playground/PlaygroundCard";
import { Button } from "@/components/ui/button";
import { FaFlask } from "react-icons/fa";

interface Props {
  demos: Demo[];
}

export default function PlaygroundArchiveClient({ demos }: Props) {
  const [activeTech, setActiveTech] = useState("All");

  const allTech = ["All", ...Array.from(new Set(demos.flatMap((d) => d.tech)))];

  const filteredDemos = activeTech === "All"
    ? demos
    : demos.filter((demo) => demo.tech.includes(activeTech));

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-32 pb-24 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-3 text-purple-500 font-black uppercase tracking-[0.3em] text-sm mb-6"
          >
            <FaFlask /> The Technical Lab
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight"
          >
            Interactive <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-500">Playground</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium"
          >
            Where ideas take shape. A collection of experiments, prototypes, and technical explorations.
          </motion.p>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {allTech.map((tech) => (
            <Button
              key={tech}
              onClick={() => setActiveTech(tech)}
              variant={activeTech === tech ? "default" : "outline"}
              className={`rounded-full px-5 py-2 text-xs font-black transition-all ${
                activeTech === tech
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:border-purple-500 border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5"
              }`}
            >
              {tech}
            </Button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-2 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredDemos.map((demo, i) => (
              <motion.div
                key={demo._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <PlaygroundCard demo={demo} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredDemos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-slate-500 text-xl font-medium">No experiments found with this technology.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
