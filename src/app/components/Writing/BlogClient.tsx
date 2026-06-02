"use client";
import { motion } from "framer-motion";
import { Blog } from "@/types";
import Link from "next/link";
import { FaPenNib, FaArrowRight } from "react-icons/fa";

import BlogCard from "./BlogCard";

interface BlogClientProps {
  blogs: Blog[];
}

export default function BlogClient({ blogs }: BlogClientProps) {
  return (
    <section
      id="blog"
      className="scroll-mt-28 py-16 bg-white dark:bg-slate-950 relative overflow-hidden"
    >
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-left"
          >
            <motion.h2
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 text-emerald-500 font-black uppercase tracking-[0.2em] text-sm md:text-lg"
            >
              <FaPenNib /> Latest Writing
            </motion.h2>
          </motion.div>

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex shrink-0"
          >
            <Link
              href="/blog"
              className="group px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 rounded-xl text-sm font-bold transition-all hover:scale-105 shadow-md flex items-center gap-2 cursor-pointer"
            >
              Read All Articles
              <FaArrowRight
                className="group-hover:translate-x-1 transition-transform"
                size={12}
              />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, idx) => (
            <BlogCard key={blog._id} blog={blog} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
