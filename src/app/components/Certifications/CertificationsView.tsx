"use client";
import { motion } from "framer-motion";
import { Certification } from "../../../types";
import { FaAward } from "react-icons/fa";
import { ArrowUpRight } from "lucide-react";

interface CertificationsViewProps {
  certifications: Certification[];
}

export default function CertificationsView({
  certifications,
}: CertificationsViewProps) {
  return (
    <section
      id="certifications"
      className="scroll-mt-28 py-24 bg-slate-50 dark:bg-slate-900"
    >
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
              className="flex items-center gap-3 text-emerald-500 font-black uppercase tracking-[0.2em] text-sm md:text-xl mb-4"
            >
              <FaAward /> Academic & Credentials
            </motion.h2>
          </div>
        </motion.div>

        <div className="flex flex-col gap-12 lg:gap-8 group/list">
          {certifications.map((cert, idx) => (
            <motion.div
              key={cert._id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:opacity-100! lg:group-hover/list:opacity-50"
            >
              {/* Hover Background Overlay */}
              <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-xl transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-200/50 dark:lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg" />

              {/* Date Column */}
              <header
                className="z-10 mb-2 mt-1 text-xs font-bold uppercase tracking-widest text-slate-500 sm:col-span-2"
                aria-label={cert.date}
              >
                {cert.date}
              </header>

              {/* Content Column */}
              <div className="z-10 sm:col-span-6">
                <h3 className="font-medium leading-snug text-slate-900 dark:text-slate-200">
                  {cert.link ? (
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-baseline font-bold leading-tight text-slate-900 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 text-lg md:text-xl transition-colors group/link"
                    >
                      <span>
                        {cert.title} ·{" "}
                        <span className="inline-block">{cert.issuer}</span>
                      </span>
                      <ArrowUpRight className="inline-block ml-1 h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1" />
                    </a>
                  ) : (
                    <div className="inline-flex items-baseline font-bold leading-tight text-slate-900 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 text-lg md:text-xl transition-colors">
                      <span>
                        {cert.title} ·{" "}
                        <span className="inline-block">{cert.issuer}</span>
                      </span>
                    </div>
                  )}
                </h3>

                {cert.details && cert.details.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {cert.details.map((detail, dIdx) => (
                      <span
                        key={dIdx}
                        className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      >
                        {detail}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
