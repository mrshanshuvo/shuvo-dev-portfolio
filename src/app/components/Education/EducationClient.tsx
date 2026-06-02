"use client";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import {
  FaGraduationCap,
  FaMapMarkerAlt,
  FaExternalLinkAlt,
  FaPlus,
  FaMinus,
  FaCalendarAlt,
} from "react-icons/fa";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import type { Education } from "@/types";

interface Props {
  education: Education[];
}

export default function EducationClient({ education }: Props) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <section
      id="education"
      ref={ref}
      className="relative py-24 bg-white dark:bg-slate-950 overflow-hidden"
    >
      <div className="absolute top-20 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />

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
              <FaGraduationCap /> Academic Background
            </motion.h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="h-full"
            >
              <Card className="group h-full relative bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl rounded-2xl p-1 border border-slate-200/50 dark:border-white/5 shadow-2xl hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)] transition-all duration-700 overflow-hidden flex flex-col">
                {/* Decorative Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-500/10 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative p-6 flex-1 flex flex-col">
                  <CardHeader className="p-0 mb-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        {/* Institution Badge */}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/10 rounded-full">
                          <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
                          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-600 dark:text-blue-400">
                            {edu.institution}
                          </span>
                        </div>

                        <h3 className="font-display text-lg md:text-xl font-semibold text-slate-900 dark:text-white leading-[1.2] tracking-tight group-hover:text-blue-500 transition-colors duration-300">
                          {edu.degree}
                        </h3>
                      </div>

                      {/* Logo Container */}
                      <div className="relative w-20 h-20 shrink-0 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-700 shadow-lg group-hover:scale-105 transition-all duration-500">
                        {edu.logo ? (
                          <Image
                            src={edu.logo}
                            alt={edu.institution}
                            fill
                            className="object-contain p-2 transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="text-slate-200 dark:text-slate-600 text-3xl font-black uppercase">
                            {edu.institution.charAt(0)}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-tr from-blue-500/5 to-transparent pointer-events-none" />
                      </div>
                    </div>

                    {/* Meta Info Bar */}
                    <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                        <FaCalendarAlt className="text-blue-500/50" size={10} />
                        {edu.period}
                      </div>
                      {edu.location && (
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                          <FaMapMarkerAlt
                            className="text-blue-500/50"
                            size={10}
                          />
                          {edu.location}
                        </div>
                      )}
                      {edu.gpa && (
                        <Badge className="bg-blue-500 text-white border-none font-black px-1.5 py-0.5 text-[10px] rounded shadow-md shadow-blue-500/10">
                          GPA {edu.gpa}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 flex-1 flex flex-col">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                          Academic Details
                        </span>
                        <button
                          onClick={() =>
                            setExpandedIndex(
                              expandedIndex === index ? null : index,
                            )
                          }
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500 shadow-md ${
                            expandedIndex === index
                              ? "bg-blue-500 text-white shadow-blue-500/30"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-blue-500 hover:text-white hover:shadow-blue-500/10"
                          }`}
                        >
                          {expandedIndex === index ? (
                            <FaMinus size={12} />
                          ) : (
                            <FaPlus size={12} />
                          )}
                        </button>
                      </div>

                      <AnimatePresence initial={false}>
                        {expandedIndex === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: 0.5,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-3 pt-3 pb-5 border-l border-blue-500/20 pl-4">
                              {Array.isArray(edu.details) ? (
                                edu.details.map((detail, dIdx) => (
                                  <motion.p
                                    key={dIdx}
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: dIdx * 0.05 }}
                                    className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium flex gap-2.5 items-start"
                                  >
                                    <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 shrink-0" />
                                    {detail}
                                  </motion.p>
                                ))
                              ) : (
                                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium">
                                  {edu.details}
                                </p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {edu.link && (
                      <motion.a
                        href={edu.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-4 inline-flex items-center justify-center gap-2 w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-blue-600 dark:hover:bg-blue-50 transition-all rounded-xl text-[11px] font-black uppercase tracking-[0.15em] shadow-lg group/btn"
                      >
                        <FaExternalLinkAlt
                          size={11}
                          className="group-hover/btn:rotate-12 transition-transform"
                        />
                        Verify Credentials
                      </motion.a>
                    )}
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
