"use client";
import { motion } from "framer-motion";
import { Certification } from "../../../types";
import { FaAward, FaExternalLinkAlt, FaCalendarAlt } from "react-icons/fa";
import { Card } from "@/components/ui/card";
import Image from "next/image";

interface CertificationsViewProps {
  certifications: Certification[];
}

export default function CertificationsView({
  certifications,
}: CertificationsViewProps) {
  return (
    <section
      id="certifications"
      className="py-24 relative overflow-hidden bg-slate-900/10"
    >
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
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
              className="flex items-center gap-3 text-emerald-500 font-black uppercase tracking-[0.3em] text-sm md:text-base mb-4"
            >
              <FaAward /> Academic & Credentials
            </motion.h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, idx) => (
            <motion.div
              key={cert._id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="flex items-center gap-6 p-6 rounded-3xl bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/5 hover:border-amber-500/30 transition-all duration-300 group shadow-sm hover:shadow-xl">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-500 group-hover:scale-110 transition-transform overflow-hidden shrink-0 relative border border-amber-100 dark:border-amber-900/30">
                  {cert.image ? (
                    <Image
                      src={cert.image}
                      alt={cert.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <FaAward size={32} />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-slate-900 dark:text-white font-bold mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {cert.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-2 font-medium">
                    {cert.issuer}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      <FaCalendarAlt size={10} />
                      {cert.date}
                    </div>
                    {cert.link && (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[10px] text-amber-500 hover:text-amber-400 font-bold uppercase tracking-widest transition-colors"
                      >
                        Verify <FaExternalLinkAlt size={10} />
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
