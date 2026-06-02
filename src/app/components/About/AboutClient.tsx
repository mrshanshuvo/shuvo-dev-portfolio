"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FaUser } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import type { About } from "@/types";

interface Props {
  about: About;
}

export default function AboutClient({ about }: Props) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
            <motion.h2
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 text-emerald-500 font-black uppercase tracking-[0.3em] text-sm md:text-base mb-4"
            >
              <FaUser /> Cinematic Profile
            </motion.h2>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Bio - Centered, full width */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="w-full"
          >
            <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-[2rem] p-10 border border-slate-200/50 dark:border-white/10 shadow-xl hover:shadow-2xl transition-shadow overflow-hidden">
              <CardContent className="p-0">
                {(about.bio || "").split("\n\n").map(
                  (para, i) =>
                    para.trim() && (
                      <p
                        key={i}
                        className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed font-medium last:mb-0"
                      >
                        {para}
                      </p>
                    ),
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
