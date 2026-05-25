"use client";
import { FaBriefcase } from "react-icons/fa";
import { motion } from "framer-motion";
import type { Experience } from "@/types";

interface Props {
  experiences: Experience[];
}

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
            <motion.h2
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 text-emerald-500 font-black uppercase tracking-[0.3em] text-sm md:text-base mb-4"
            >
              <FaBriefcase /> Professional History
            </motion.h2>
          </div>
        </motion.div>

        {experiences.length === 0 ? (
          <p className="text-center text-slate-400">No entries yet.</p>
        ) : (
          <div className="flex flex-col gap-12 lg:gap-8 group/list">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp._id ?? i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50"
              >
                {/* Hover Background */}
                <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-xl transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-200/50 dark:lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg" />
                
                {/* Date Column */}
                <header
                  className="z-10 mb-2 mt-1 text-xs font-bold uppercase tracking-widest text-slate-500 sm:col-span-2"
                  aria-label={exp.duration}
                >
                  {exp.duration}
                </header>
                
                {/* Content Column */}
                <div className="z-10 sm:col-span-6">
                  <h3 className="font-medium leading-snug text-slate-900 dark:text-slate-200">
                    <div className="inline-flex items-baseline font-bold leading-tight text-slate-900 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 text-lg md:text-xl transition-colors">
                      <span>
                        {exp.title} · <span className="inline-block">{exp.org}</span>
                      </span>
                    </div>
                  </h3>
                  
                  <ul className="mt-4 text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-400 space-y-3">
                    {exp.details.map((item, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="text-emerald-500 mt-1.5 text-xs">▹</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
