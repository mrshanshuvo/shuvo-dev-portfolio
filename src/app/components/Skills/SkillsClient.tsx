"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FaCode, FaDatabase, FaCloud, FaRobot } from "react-icons/fa";
import { SiTensorflow, SiReact, SiNodedotjs } from "react-icons/si";
import { Badge } from "@/components/ui/badge";
import type { IconType } from "react-icons";
import type { Skill } from "@/types";

interface Props {
  skills: Skill[];
  techList: string[];
}

const iconMap: Record<string, IconType> = {
  SiReact,
  SiNodedotjs,
  FaDatabase,
  FaCloud,
  SiTensorflow,
  FaRobot,
};

function getSkillIcon(iconName: string): IconType {
  return iconMap[iconName] ?? FaDatabase;
}

export default function SkillsClient({ skills, techList }: Props) {
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
      id="skills"
      ref={ref}
      className="relative py-24 bg-white dark:bg-slate-950 overflow-hidden"
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
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 text-emerald-500 font-black uppercase tracking-[0.3em] text-sm mb-4"
            >
              <FaCode /> Technical Stack
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
              Technical{" "}
              <span className="text-emerald-400">
                Mastery
              </span>
            </h2>
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
              className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-[2rem] p-10 border border-slate-200/50 dark:border-white/10 shadow-xl"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                {skills.map((skill, index) => {
                  const Icon = getSkillIcon(skill.iconName);
                  return (
                    <motion.div key={skill.name} variants={itemVariants}>
                      <div className="flex items-start gap-5">
                        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-md group-hover:scale-110 transition-transform">
                          <Icon
                            className="text-emerald-500 text-3xl"
                            aria-label={skill.name}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-lg text-slate-900 dark:text-white">
                              {skill.name}
                            </span>
                            <span className="font-mono text-sm font-bold text-emerald-500">
                              {skill.level}%
                            </span>
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400 mb-3 font-medium">
                            {skill.tech}
                          </div>
                          <div
                            className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden"
                            role="progressbar"
                          >
                            <motion.div
                              initial={{ width: 0 }}
                              animate={
                                isInView
                                  ? { width: `${skill.level}%` }
                                  : { width: 0 }
                              }
                              transition={{
                                duration: 1.5,
                                delay: index * 0.15,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              className="bg-emerald-500 h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                            />
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
              <motion.div
                className="flex space-x-12 px-6"
                animate={{ x: [0, -1000] }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 25,
                    ease: "linear",
                  },
                }}
              >
                {techList.map((tech, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="flex items-center gap-2 px-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap"
                  >
                    <FaCode className="text-emerald-600 dark:text-emerald-400" />
                    <span className="text-lg">{tech}</span>
                  </Badge>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
