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
      className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden"
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
              className="flex items-center gap-3 text-emerald-500 font-black uppercase tracking-[0.2em] text-sm md:text-lg mb-4"
            >
              <FaPenNib /> Latest Writing
            </motion.h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {blogs.map((blog, idx) => (
            <BlogCard key={blog._id} blog={blog} index={idx} />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <Link
            href="/blog"
            className="group px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-2xl text-lg font-black transition-all hover:scale-105 shadow-xl hover:shadow-blue-500/20 flex items-center gap-3"
          >
            Read All Articles
            <FaArrowRight
              className="group-hover:translate-x-2 transition-transform"
              size={16}
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
