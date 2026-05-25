"use client";
import { FaBriefcase, FaGraduationCap, FaAward } from "react-icons/fa";
import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import type { Experience } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Props {
  experiences: Experience[];
}

const typeIconMap: Record<string, IconType> = {
  work: FaBriefcase,
  education: FaGraduationCap,
  certification: FaAward,
};

const colorMap: Record<string, { bg: string; text: string }> = {
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-600 dark:text-amber-400",
  },
};

export default function ExperienceClient({ experiences }: Props) {
  return (
    <section id="experience" className="py-24 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
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
              <FaBriefcase /> The Journey
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
              Professional{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-500 to-blue-500">
                History
              </span>
            </h2>
          </div>
        </motion.div>

        {experiences.length === 0 ? (
          <p className="text-center text-slate-400">No entries yet.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {experiences.map((exp, i) => {
              const colors = colorMap[exp.color] ?? colorMap.emerald;
              const Icon = typeIconMap[exp.type] ?? FaBriefcase;
              return (
                <motion.div
                  key={exp._id ?? i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="h-full"
                >
                  <Card className="h-full group bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/30 dark:hover:border-emerald-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 overflow-hidden">
                    <CardHeader className="p-0 mb-4">
                      <div
                        className={`inline-flex p-3 rounded-lg mb-4 ${colors.bg}`}
                      >
                        <Icon className={`text-2xl ${colors.text}`} />
                      </div>
                      <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                        {exp.title}
                      </CardTitle>
                      <p className="text-emerald-600 dark:text-emerald-400 font-medium text-sm mb-1">
                        {exp.org}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">
                        {exp.duration}
                      </p>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ul className="space-y-2">
                        {exp.details.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm"
                          >
                            <span className="text-emerald-600 dark:text-emerald-400 mt-1">
                              •
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
