"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FaLayerGroup, FaCode } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import type { Skill, Technology } from "@/types";

interface Props {
  expertises: Skill[];
  brandTechs: Technology[];
  techList: string[];
}

export default function SkillsClient({
  expertises,
  brandTechs,
  techList,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Fall back to legacy techList strings if no brandTechs exist yet
  const marqueeItems =
    brandTechs.length > 0
      ? brandTechs.map((t) => ({ name: t.name, iconUrl: t.iconUrl }))
      : techList.map((name) => ({ name, iconUrl: undefined }));
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
      id="skills"
      ref={ref}
      className="scroll-mt-28 relative py-16 bg-white dark:bg-slate-950 overflow-hidden"
    >
      <div className="absolute top-20 left-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20"
        >
          <div className="text-left">
            <motion.h2
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 text-emerald-500 font-black uppercase tracking-[0.2em] text-sm md:text-lg mb-4"
            >
              <FaLayerGroup /> Technical Mastery
            </motion.h2>
          </div>
        </motion.div>
        <div className="space-y-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.div
              variants={itemVariants}
              className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-[1rem] p-10 border border-slate-200/50 dark:border-white/10 shadow-xl"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                {expertises.map((skill) => {
                  return (
                    <motion.div key={skill.name} variants={itemVariants}>
                      <div className="flex items-start gap-5">
                        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-md group-hover:scale-110 transition-transform">
                          {skill.iconUrl ? (
                            <Image
                              src={skill.iconUrl}
                              alt={skill.name}
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                          ) : (
                            <FaCode className="text-emerald-500 text-3xl" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-lg text-slate-900 dark:text-white">
                              {skill.name}
                            </span>
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400 mb-3 font-medium">
                            {skill.tech}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          {/* Tech banner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-center mb-8">
              <h4 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                Technologies I Work With
              </h4>
            </div>
            <div className="overflow-hidden relative py-6">
              {/* Premium Gradient Edge Fade Overlays */}
              <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-linear-to-r from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-linear-to-l from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />

              <motion.div
                className="flex flex-nowrap w-max"
                animate={{ x: ["0%", "-33.3333%"] }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 30,
                    ease: "linear",
                  },
                }}
              >
                {/* Triple the list inside identical tracks to guarantee mathematically perfect seamless looping on any screen size */}
                {[0, 1, 2].map((trackIndex) => (
                  <div key={trackIndex} className="flex gap-12 shrink-0 pr-12">
                    {marqueeItems.map((tech, techIndex) => {
                      return (
                        <Badge
                          key={`${trackIndex}-${techIndex}`}
                          variant="outline"
                          className="flex items-center gap-3 px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap shadow-sm hover:border-emerald-500/30 dark:hover:border-emerald-400/30 hover:text-emerald-500 dark:hover:text-emerald-400 hover:scale-102 transition-all cursor-default"
                        >
                          {tech.iconUrl ? (
                            <Image
                              src={tech.iconUrl}
                              alt={tech.name}
                              width={20}
                              height={20}
                              className="object-contain"
                            />
                          ) : (
                            <FaCode className="text-xl text-slate-400" />
                          )}
                          <span className="text-lg font-bold">{tech.name}</span>
                        </Badge>
                      );
                    })}
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
