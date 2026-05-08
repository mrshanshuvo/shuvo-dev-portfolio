"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FaRobot, FaCheckCircle } from "react-icons/fa";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { About } from "@/types";

interface Props {
  about: About;
}

export default function AboutClient({ about }: Props) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-24 bg-linear-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 overflow-hidden"
    >
      <div className="absolute top-20 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12"
        >
          <div className="text-left">
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-3 text-emerald-500 font-black uppercase tracking-[0.3em] text-sm mb-4"
            >
              <FaRobot /> The Identity
            </motion.div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
              Cinematic{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-500">
                Profile
              </span>
            </h2>
          </div>
          <p className="text-md md:text-lg text-slate-600 dark:text-slate-400 max-w-xl md:text-right font-medium leading-relaxed line-clamp-2">
            Architecting high-performance digital experiences powered by modern
            software engineering and intelligent systems.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
        >
          {about.stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative group h-full"
            >
              <Card className="h-full text-center p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-white/10 hover:border-emerald-500/50 transition-all duration-300 shadow-xl overflow-hidden">
                <div className="font-display text-5xl font-black bg-linear-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-500 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-sm font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">
                  {stat.label}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Bio - Spans 2 columns */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="md:col-span-2 h-full"
          >
            <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-[2rem] p-10 border border-slate-200/50 dark:border-white/10 shadow-xl hover:shadow-2xl transition-shadow h-full overflow-hidden">
              <div className="flex items-center gap-4">
                <CardTitle className="font-display text-3xl font-bold text-slate-900 dark:text-white">
                  {about.title}
                </CardTitle>
              </div>
              <CardContent className="p-0">
                {about.bio1 && (
                  <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed font-medium">
                    {about.bio1}
                  </p>
                )}
                {about.bio2 && (
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {about.bio2}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Highlights */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="h-full"
          >
            <Card className="bg-linear-to-br from-emerald-500/10 to-blue-500/10 backdrop-blur-xl rounded-[2rem] p-8 border border-emerald-500/20 shadow-xl h-full overflow-hidden">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="font-display text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FaCheckCircle className="text-emerald-500" /> What I Bring
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                {about.highlights.map((highlight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={
                      isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                    }
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                    <span className="text-slate-700 dark:text-slate-300 font-medium text-sm lg:text-base">
                      {highlight}
                    </span>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
