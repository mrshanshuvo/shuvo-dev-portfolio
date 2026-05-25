"use client";
import { motion } from "framer-motion";
import { Testimonial } from "@/types";
import { FaQuoteLeft, FaUserCircle } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface TestimonialsClientProps {
  testimonials: Testimonial[];
}

export default function TestimonialsClient({
  testimonials,
}: TestimonialsClientProps) {
  return (
    <section
      id="testimonials"
      className="py-24 relative overflow-hidden bg-slate-900/20"
    >
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
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
              <FaQuoteLeft /> The Feedback
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
              Client <span className="text-emerald-400">Testimonials</span>
            </h2>
          </div>
        </motion.div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {testimonials.map((item, idx) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="break-inside-avoid"
            >
              <Card className="relative p-8 rounded-[2rem] bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/5 hover:border-blue-500/30 transition-all duration-500 group shadow-sm hover:shadow-xl">
                <FaQuoteLeft
                  className="text-blue-500/20 mb-6 group-hover:text-blue-500/40 transition-colors"
                  size={40}
                />

                <CardContent className="p-0">
                  <p className="text-slate-700 dark:text-slate-200 text-lg leading-relaxed mb-8 italic">
                    &quot;{item.content}&quot;
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 overflow-hidden border border-slate-200 dark:border-white/10 relative">
                      {item.avatar ? (
                        <Image
                          src={item.avatar}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <FaUserCircle size={24} />
                      )}
                    </div>
                    <div>
                      <h4 className="text-slate-900 dark:text-white font-bold">
                        {item.name}
                      </h4>
                      <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
                        {item.role} {item.company && `@ ${item.company}`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
