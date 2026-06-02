"use client";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Demo } from "@/types";
import { FaExternalLinkAlt, FaCode, FaStar, FaGithub } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface PlaygroundCardProps {
  demo: Demo;
  index: number;
  iconRegistry?: Record<string, string>;
}

export default function PlaygroundCard({ demo, index, iconRegistry }: PlaygroundCardProps) {
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

  const image = demo.image || demo.media?.find((m) => m.type === "image")?.url;

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
      className="group relative h-full"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-[1rem] border border-slate-200/50 dark:border-white/10 transition-all duration-300 overflow-hidden flex flex-col h-full shadow-xl hover:shadow-2xl hover:border-purple-500/50 dark:hover:border-purple-500/50 group/card"
      >
        <Link
          href={`/playground/${demo.slug}`}
          className="absolute inset-0 z-10"
        >
          <span className="sr-only">View Lab Experiment Details</span>
        </Link>

        {/* Featured Badge */}
        {demo.featured && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/90 text-white text-[10px] font-bold tracking-widest uppercase rounded-full backdrop-blur-sm shadow-lg z-20">
            <FaStar className="text-[10px]" /> Featured
          </div>
        )}

        {/* Image (If exists) or beautiful glowing gradient top header */}
        {image ? (
          <div
            className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800"
            style={{ transform: "translateZ(30px)" }}
          >
            <Image
              src={image}
              alt={demo.title}
              fill
              className="object-cover group-hover/card:scale-110 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
          </div>
        ) : (
          /* Decorative Glow for text-only cards */
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] group-hover/card:bg-purple-500/20 transition-all duration-500 pointer-events-none" />
        )}

        {/* Content */}
        <div
          className="p-6 flex flex-col flex-1"
          style={{ transform: "translateZ(40px)" }}
        >
          {/* Header Icon + Demo Action Button */}
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover/card:scale-110 transition-transform duration-500 border border-slate-100 dark:border-white/5">
              <FaCode size={20} />
            </div>
            <div
              className="relative z-20 shrink-0 flex items-center gap-2"
              style={{ transform: "translateZ(50px)" }}
            >
              {demo.github && (
                <Button
                  variant="outline"
                  size="icon"
                  nativeButton={false}
                  render={
                    <a
                      href={demo.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                  className="size-10 text-slate-700 dark:text-slate-300 hover:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md cursor-pointer"
                  title="GitHub Repository"
                >
                  <FaGithub size={14} />
                </Button>
              )}
              <Button
                variant="outline"
                size="icon"
                nativeButton={false}
                render={
                  <a
                    href={demo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
                className="size-10 text-purple-600 dark:text-purple-400 hover:text-white bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-600 border border-purple-200 dark:border-purple-800/50 rounded-xl transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md cursor-pointer"
                title="Open Lab Experiment"
              >
                <FaExternalLinkAlt size={14} />
              </Button>
            </div>
          </div>

          <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-1 group-hover/card:text-purple-500 transition-colors">
            {demo.title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2 flex-1 font-medium">
            {demo.description}
          </p>

          <div className="flex items-end justify-between mt-auto gap-4">
            {/* Tech stack badges with matching high-end design */}
            <div className="flex flex-wrap gap-2">
              {demo.tech.slice(0, 5).map((name) => {
                const iconUrl = iconRegistry?.[name];
                return (
                  <Badge
                    key={name}
                    variant="outline"
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-bold shadow-sm"
                    title={name}
                  >
                    {iconUrl && (
                      <Image src={iconUrl} alt={name} width={14} height={14} className="object-contain" />
                    )}
                    {name}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
