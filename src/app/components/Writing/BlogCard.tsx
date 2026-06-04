"use client";
import { motion } from "framer-motion";
import { Blog } from "@/types";
import { FaArrowRight, FaCalendarAlt } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";

interface BlogCardProps {
  blog: Blog;
  index: number;
}

export default function BlogCard({ blog, index }: BlogCardProps) {
  return (
    <motion.a
      href={blog.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group block"
    >
      <Card className="h-full rounded-2xl bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/5 hover:border-blue-500/30 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-xl">
        <CardHeader className="p-8 pb-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              {blog.tags.slice(0, 2).map((tag, tIdx) => (
                <Badge
                  key={tIdx}
                  variant="outline"
                  className="text-[10px] font-black text-blue-400 uppercase tracking-widest px-3 py-1 rounded-full bg-blue-400/10 border-none"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold">
              <FaCalendarAlt size={12} />
              {blog.date}
            </div>
          </div>

          {blog.image && (
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 border border-slate-200 dark:border-white/5">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}

          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-blue-500 transition-colors line-clamp-2">
            {blog.title}
          </h3>
        </CardHeader>

        <CardContent className="p-8 pt-0">
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8 line-clamp-3">
            {blog.description}
          </p>

          <div className="flex items-center gap-2 text-blue-500 font-bold text-sm">
            Read Article{" "}
            <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </motion.a>
  );
}
