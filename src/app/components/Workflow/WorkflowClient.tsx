"use client";
import { motion } from "framer-motion";
import { WorkflowStep } from "@/types";
import * as Icons from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";

interface WorkflowClientProps {
  workflow: WorkflowStep[];
}

export default function WorkflowClient({ workflow }: WorkflowClientProps) {
  return (
    <section
      id="workflow"
      className="py-24 bg-slate-50 dark:bg-slate-950/50 relative overflow-hidden"
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
              <Icons.FaCodeBranch /> The Process
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
              Development{" "}
              <span className="text-emerald-400">
                Lifecycle
              </span>
            </h2>
          </div>
        </motion.div>

        <div className="relative">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-emerald-500/20 to-transparent hidden lg:block -translate-y-1/2" />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8">
            {workflow.map((step, idx) => {
              const Icon = (Icons as any)[step.icon] || Icons.FaProjectDiagram;
              return (
                <motion.div
                  key={step._id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative flex flex-col items-center text-center group"
                >
                  <div className="relative z-10 w-24 h-24 rounded-full bg-white dark:bg-slate-900 border-4 border-slate-100 dark:border-slate-950 shadow-[0_0_50px_rgba(16,185,129,0.1)] flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-8 group-hover:scale-110 group-hover:border-emerald-500/30 transition-all duration-500">
                    <Icon size={32} />
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 text-white dark:text-slate-950 text-xs font-black flex items-center justify-center border-4 border-white dark:border-slate-950">
                      0{idx + 1}
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors uppercase tracking-wider">
                    {step.title}
                  </h3>

                  <Card className="bg-transparent border-none shadow-none">
                    <CardContent className="p-0">
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-62.5 mx-auto">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
