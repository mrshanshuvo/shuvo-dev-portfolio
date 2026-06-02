"use client";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FaExternalLinkAlt, FaStar } from "react-icons/fa";
import type { Project } from "@/types";
import { getIcon } from "@/lib/techIconMap";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ perspective: 1000 }}
      className="group relative"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-[1rem] border border-slate-200/50 dark:border-white/10 transition-colors duration-300 overflow-hidden flex flex-col h-full shadow-xl hover:shadow-2xl hover:border-emerald-500/50 dark:hover:border-emerald-500/50 group/card"
      >
        <Link
          href={`/projects/${project.slug}`}
          className="absolute inset-0 z-10"
        >
          <span className="sr-only">View Project Details</span>
        </Link>
        {/* Image */}
        <div
          className="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-800"
          style={{ transform: "translateZ(30px)" }}
        >
          <Image
            src={project.image || "/images/placeholder.png"}
            alt={project.title}
            fill
            priority={index < 4}
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {project.featured && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/90 text-white text-xs font-bold tracking-widest uppercase rounded-full backdrop-blur-sm shadow-lg">
              <FaStar className="text-xs" /> Featured
            </div>
          )}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 max-w-[calc(100%-100px)]">
            {Array.isArray(project.category)
              ? project.category.map((cat) => (
                  <div
                    key={cat}
                    className="px-3 py-1.5 bg-slate-900/80 text-white font-bold text-[10px] rounded-full backdrop-blur-sm tracking-widest uppercase border border-white/10 shadow-lg whitespace-nowrap"
                  >
                    {cat}
                  </div>
                ))
              : project.category && (
                  <div className="px-3 py-1.5 bg-slate-900/80 text-white font-bold text-[10px] rounded-full backdrop-blur-sm tracking-widest uppercase border border-white/10 shadow-lg whitespace-nowrap">
                    {project.category}
                  </div>
                )}
          </div>
        </div>

        {/* Content */}
        <div
          className="p-6 flex flex-col flex-1"
          style={{ transform: "translateZ(40px)" }}
        >
          <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-1 group-hover:text-emerald-500 transition-colors">
            {project.title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2 flex-1 font-medium">
            {project.description}
          </p>

          <div className="flex items-end justify-between mt-auto gap-4">
            {/* Tech stack */}
            <div className="flex flex-wrap gap-2">
              {project.techNames.slice(0, 5).map((name) => {
                const Icon = getIcon(name);
                return (
                  <Badge
                    key={name}
                    variant="outline"
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-bold shadow-sm"
                    title={name}
                  >
                    <Icon className="text-emerald-500" />
                    {name}
                  </Badge>
                );
              })}
            </div>

            {/* Actions */}
            {project.live && project.live.length > 0 && (
              <div
                className="flex items-center justify-end relative z-20 shrink-0"
                style={{ transform: "translateZ(50px)" }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  nativeButton={false}
                  render={
                    <a
                      href={project.live[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                  className="size-12 text-emerald-600 dark:text-emerald-400 hover:text-white bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-600 border border-emerald-200 dark:border-emerald-800/50 rounded-xl transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md"
                  title="Live Demo"
                >
                  <FaExternalLinkAlt size={16} />
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
