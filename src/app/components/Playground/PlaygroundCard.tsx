"use client";
import { motion } from "framer-motion";
import { Demo } from "@/types";
import { FaExternalLinkAlt, FaStar } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface PlaygroundCardProps {
  demo: Demo;
  index: number;
  iconRegistry?: Record<string, string>;
}

export default function PlaygroundCard({
  demo,
  index,
  iconRegistry,
}: PlaygroundCardProps) {
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
      className="relative h-100 sm:h-112.5 w-full"
    >
      <div className="group relative bg-slate-900 rounded-xl border border-white/10 overflow-hidden flex flex-col h-full w-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:border-purple-500/30 hover:shadow-[0_20px_50px_rgba(168,85,247,0.15)]">
        <Link
          href={`/playground/${demo.slug}`}
          className="absolute inset-0 z-20"
        >
          <span className="sr-only">View Lab Experiment Details</span>
        </Link>

        {/* Full Card Image or Glowing Gradient */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={demo.title}
              fill
              priority={index < 4}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            /* Premium Purple/Indigo Aurora Glow as backdrop if no image */
            <div className="absolute inset-0 bg-linear-to-br from-indigo-950/40 via-purple-950/30 to-slate-950/20" />
          )}
          {/* Gradients for text readability */}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/60 to-slate-900/10 opacity-90 transition-opacity duration-500 group-hover:opacity-85" />

          {/* Radial accent glow that highlights on hover */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] group-hover:bg-purple-500/20 transition-all duration-500 pointer-events-none" />
        </div>

        {/* Top Section: Badges & Buttons */}
        <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-30 pointer-events-none">
          {/* Left: Code Icon & Featured Badge */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {demo.featured && (
              <div
                className="flex items-center justify-center px-3 py-1.5 bg-linear-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold tracking-widest uppercase rounded-full shadow-lg shrink-0"
                title="Featured Experiment"
              >
                <FaStar className="text-[10px]" />
              </div>
            )}
          </div>

          {/* Right: Live Demo Action Buttons */}
          <div className="shrink-0 flex items-center gap-2 pointer-events-auto">
            <Button
              variant="outline"
              size="icon"
              nativeButton={false}
              render={
                <a href={demo.url} target="_blank" rel="noopener noreferrer" />
              }
              className="rounded-full p-7 text-white bg-white/10 border border-white/20 backdrop-blur-md hover:text-purple-400 hover:bg-white/10 hover:border-purple-400/50 transition-colors shadow-lg"
              title="Open Lab Experiment"
            >
              <FaExternalLinkAlt className="size-6 drop-shadow-sm" />
            </Button>
          </div>
        </div>

        {/* Floating Content at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col z-30 pointer-events-none">
          <div className="mb-3">
            <h3 className="font-display text-2xl font-bold text-purple-400 group-hover:text-purple-300 transition-colors duration-300 line-clamp-1 drop-shadow-md flex items-center gap-1.5">
              <span>{demo.title}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="inline-block h-5 w-5 shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transition-none opacity-60 group-hover:opacity-100"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </h3>
          </div>

          <p className="text-slate-300 group-hover:text-slate-100 transition-colors duration-300 text-sm leading-relaxed mb-6 line-clamp-2 font-medium drop-shadow-sm">
            {demo.description}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2 pointer-events-auto">
            {(demo.tech || []).slice(0, 4).map((name) => {
              const iconUrl = iconRegistry?.[name];
              return (
                <Badge
                  key={name}
                  variant="outline"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 dark:bg-purple-950/40 border border-purple-500/20 text-purple-300 rounded-xl text-[10px] font-bold shadow-sm backdrop-blur-md transition-all duration-300 group-hover:border-purple-400/40 group-hover:bg-purple-500/20 group-hover:text-purple-200"
                  title={name}
                >
                  {iconUrl && (
                    <Image
                      src={iconUrl}
                      alt={name}
                      width={14}
                      height={14}
                      className="object-contain shrink-0"
                    />
                  )}
                  {name}
                </Badge>
              );
            })}
            {(demo.tech || []).length > 4 && (
              <Badge
                variant="outline"
                className="flex items-center justify-center px-2 py-1.5 bg-purple-500/10 dark:bg-purple-950/40 border border-purple-500/20 text-purple-300 rounded-xl text-[10px] font-bold shadow-sm backdrop-blur-md transition-all duration-300 group-hover:border-purple-400/40 group-hover:bg-purple-500/20 group-hover:text-purple-200"
              >
                +{(demo.tech?.length || 0) - 4}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
