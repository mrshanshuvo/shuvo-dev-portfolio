"use client";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import Image from "next/image";
import type { Hero } from "@/types";
import type { IconType } from "react-icons";
import MagneticButton from "../MagneticButton";
import { Button } from "@/components/ui/button";

interface Props {
  hero: Hero;
}

const platformIconMap: Record<string, IconType> = {
  GitHub: FaGithub,
  LinkedIn: FaLinkedin,
  LeetCode: SiLeetcode,
  Email: FaEnvelope,
  Twitter: FaTwitter,
  Instagram: FaInstagram,
};

export default function HeroClient({ hero }: Props) {
  const scrollToProjects = (): void => {
    const element = document.getElementById("projects");
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Build type animation sequence array: ["text", delay, "text", delay, ...]
  const typeSequence = hero.typeSequences.flatMap((s) => [s.text, s.delay]);

  const parseMarkdown = (text: string): string => {
    if (!text) return "";
    let html = text;
    // Bold: **text** -> <strong>text</strong>
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Italic: *text* -> <em>text</em>
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
    // Links: [text](url) -> <a href="url" target="_blank" rel="noopener noreferrer">text</a>
    html = html.replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    );
    return html;
  };

  return (
    <section
      id="about"
      className="min-h-screen pt-28 pb-16 md:pt-32 md:pb-20 flex items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500 scroll-mt-24"
    >
      <div id="home" className="absolute top-0" />
      {/* High-end Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Premium Aurora Mesh Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-160 h-160 bg-emerald-500/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-50 animate-blob" />
        <div className="absolute bottom-[-10%] left-[-5%] w-160 h-160 bg-blue-500/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-50 animate-blob animation-delay-2000" />
        <div className="absolute top-[20%] left-[20%] w-120 h-120 bg-purple-500/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Hero Details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 text-center lg:text-left flex flex-col items-center lg:items-start"
          >
            {/* Profile image with Glassmorphism ring */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative inline-block mb-6"
            >
              <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full p-1.5 bg-white/10 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/20 dark:border-white/10 shadow-2xl">
                <div className="absolute inset-0 bg-linear-to-r from-emerald-500 to-blue-500 rounded-full animate-spin-slow opacity-50 dark:opacity-100 blur-sm" />
                <div className="relative w-full h-full rounded-full overflow-hidden border border-white dark:border-slate-800 z-10 bg-slate-100 dark:bg-slate-900">
                  <Image
                    src={hero.profileImage}
                    alt={`${hero.name} ${hero.lastName} - Full Stack Developer`}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                    sizes="8rem"
                    priority
                  />
                </div>
              </div>
            </motion.div>

            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.2,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <h1 className="font-display text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter leading-tight">
                {hero.name}{" "}
                <span className="text-emerald-500 dark:text-emerald-400">
                  {hero.lastName}
                </span>
              </h1>
            </motion.div>

            {/* Type animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-mono text-base md:text-lg text-emerald-600 dark:text-emerald-400 mb-4 h-6 flex items-center justify-center lg:justify-start uppercase tracking-widest overflow-hidden font-bold"
            >
              {typeSequence.length > 0 && (
                <TypeAnimation
                  sequence={typeSequence}
                  wrapper="span"
                  speed={50}
                  deletionSpeed={65}
                  repeat={Infinity}
                />
              )}
            </motion.div>

            {/* Hero Subheading */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-base md:text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-md font-medium"
            >
              {hero.tagline}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-8 w-full sm:w-auto"
            >
              <MagneticButton strength={15}>
                <Button
                  onClick={scrollToProjects}
                  className="group relative px-6 py-2.5 h-auto bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold rounded-full overflow-hidden transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 cursor-pointer text-sm"
                >
                  Explore My Work
                </Button>
              </MagneticButton>

              <MagneticButton strength={15}>
                <Button
                  variant="outline"
                  nativeButton={false}
                  render={
                    <a
                      href={hero.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                  className="px-6 py-2.5 h-auto border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-full transition-all duration-300 hover:border-slate-900 dark:hover:border-white hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 text-sm"
                >
                  Download Resume
                </Button>
              </MagneticButton>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex justify-center lg:justify-start gap-4"
            >
              {hero.socialLinks.map((social, index) => {
                const Icon = platformIconMap[social.platform] ?? FaEnvelope;
                const href =
                  social.platform === "Email" &&
                  !social.href.startsWith("mailto:")
                    ? `mailto:${social.href}`
                    : social.href;
                return (
                  <MagneticButton key={social.label} strength={25}>
                    <motion.a
                      href={href}
                      target={
                        social.platform === "Email" ? undefined : "_blank"
                      }
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: 0.7 + index * 0.1,
                        type: "spring",
                        stiffness: 200,
                      }}
                      className="relative flex p-3 text-slate-600 dark:text-slate-400 hover:text-white transition-colors duration-300 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-900 dark:hover:bg-slate-800 hover:border-slate-900 dark:hover:border-slate-700 shadow-sm hover:shadow-md group"
                      aria-label={social.label}
                    >
                      <Icon
                        size={18}
                        className="group-hover:scale-110 transition-transform duration-300"
                      />
                      <span className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 px-3 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-xs font-medium rounded-md pointer-events-none whitespace-nowrap shadow-xl z-50 translate-y-2 group-hover:translate-y-0">
                        {social.label}
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-900 dark:bg-slate-800 rotate-45" />
                      </span>
                    </motion.a>
                  </MagneticButton>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Right Column: Biography */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 w-full flex items-center"
          >
            <div
              className="space-y-6 text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed font-normal
              [&_a]:font-semibold [&_a]:text-slate-900 [&_a]:dark:text-slate-100 [&_a]:hover:text-emerald-500 [&_a]:dark:hover:text-emerald-400 [&_a]:transition-colors [&_a]:duration-200 [&_a]:cursor-pointer
              [&_strong]:font-semibold [&_strong]:text-slate-900 [&_strong]:dark:text-slate-100
              [&_b]:font-semibold [&_b]:text-slate-900 [&_b]:dark:text-slate-100"
            >
              {(hero.bio || "")
                .split("\n\n")
                .map(
                  (para, i) =>
                    para.trim() && (
                      <p
                        key={i}
                        dangerouslySetInnerHTML={{
                          __html: parseMarkdown(para),
                        }}
                      />
                    ),
                )}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}</style>
    </section>
  );
}
