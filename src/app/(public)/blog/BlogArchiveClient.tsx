"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Blog } from "@/types";
import BlogCard from "@/app/components/Writing/BlogCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa";

interface Props {
  blogs: Blog[];
}

export default function BlogArchiveClient({ blogs }: Props) {
  const [activeTag, setActiveTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const allTags = ["All", ...Array.from(new Set(blogs.flatMap((b) => b.tags)))];

  const filteredBlogs = blogs.filter((blog) => {
    const matchesTag = activeTag === "All" || blog.tags.includes(activeTag);
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         blog.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight"
          >
            Technical <span className="text-blue-500">Writing</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium"
          >
            Exploring the intersection of code, design, and artificial intelligence.
          </motion.p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative w-full md:w-96"
          >
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-white dark:bg-slate-900/50 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-full h-12 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {allTags.slice(0, 8).map((tag) => (
              <Button
                key={tag}
                onClick={() => setActiveTag(tag)}
                variant={activeTag === tag ? "default" : "outline"}
                className={`rounded-full px-4 py-1 text-xs font-black transition-all ${
                  activeTag === tag
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "text-slate-600 dark:text-slate-400 hover:border-blue-500 border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5"
                }`}
              >
                {tag}
              </Button>
            ))}
          </motion.div>
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredBlogs.map((blog, i) => (
              <motion.div
                key={blog._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <BlogCard blog={blog} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredBlogs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-slate-500 text-xl font-medium">No articles found matching your criteria.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
