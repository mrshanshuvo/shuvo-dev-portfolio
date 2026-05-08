"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  FaGraduationCap,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import type { Education } from "@/types";

interface Props {
  education: Education[];
}

export default function EducationClient({ education }: Props) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 text-blue-500 font-black uppercase tracking-[0.3em] text-sm mb-4"
            >
              <FaGraduationCap /> Learning Journey
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
              Academic{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-500">
                Background
              </span>
            </h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl md:text-right text-md md:text-lg font-medium leading-relaxed line-clamp-2">
            A chronicle of my formal education and academic achievements that
            laid the foundation for my engineering career.
          </p>
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
              <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-[2rem] p-8 border border-slate-200/50 dark:border-white/10 shadow-xl h-full overflow-hidden flex flex-col">
                <CardHeader className="p-0 mb-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 shrink-0 bg-blue-500/10 rounded-2xl flex items-center justify-center overflow-hidden border border-blue-500/20 shadow-inner">
                        {edu.logo ? (
                          <Image
                            src={edu.logo}
                            alt={edu.institution}
                            fill
                            className="object-contain p-2"
                          />
                        ) : (
                          <FaGraduationCap className="text-blue-500 text-3xl" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="font-display text-xl font-bold text-slate-900 dark:text-white leading-tight">
                          Education
                        </CardTitle>
                        {edu.location && (
                          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">
                            <FaMapMarkerAlt
                              className="text-blue-500/60"
                              size={10}
                            />
                            {edu.location}
                          </div>
                        )}
                      </div>
                    </div>
                    {edu.gpa && (
                      <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30 font-black px-3 py-1 text-[10px] rounded-lg">
                        GPA: {edu.gpa}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex-1 flex flex-col">
                  <div className="space-y-4 mb-6">
                    <div>
                      <h5 className="font-black text-slate-900 dark:text-white mb-1 leading-snug group-hover:text-blue-500 transition-colors">
                        {edu.degree}
                      </h5>
                      <p className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                        {edu.institution}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
                      <FaCalendarAlt size={12} className="text-blue-500/40" />
                      {edu.period}
                    </div>
                    <div className="space-y-2 border-l-2 border-blue-500/10 pl-4 py-1">
                      {Array.isArray(edu.details) ? (
                        edu.details.map((detail, dIdx) => (
                          <p
                            key={dIdx}
                            className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic flex gap-2 items-start"
                          >
                            <span className="text-blue-500/40 mt-1.5 shrink-0">
                              •
                            </span>
                            {detail}
                          </p>
                        ))
                      ) : (
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic">
                          {edu.details}
                        </p>
                      )}
                    </div>
                  </div>
                  {edu.link && (
                    <a
                      href={edu.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center justify-center gap-2 w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-blue-500 hover:text-white transition-all rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300"
                    >
                      <FaExternalLinkAlt size={10} />
                      View Credentials
                    </a>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
