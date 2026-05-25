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

  return (
    <section
      id="home"
      className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500"
    >
      {/* High-end Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Premium Aurora Mesh Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-160 h-160 bg-emerald-500/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-50 animate-blob" />
        <div className="absolute bottom-[-10%] left-[-5%] w-160 h-160 bg-blue-500/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-50 animate-blob animation-delay-2000" />
        <div className="absolute top-[20%] left-[20%] w-120 h-120 bg-purple-500/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Profile image with Glassmorphism ring */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative inline-block mb-10"
          >
            <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full p-2 bg-white/10 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/20 dark:border-white/10 shadow-2xl">
              <div className="absolute inset-0 bg-linear-to-r from-emerald-500 to-blue-500 rounded-full animate-spin-slow opacity-50 dark:opacity-100 blur-sm" />
              <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-slate-800 z-10 bg-slate-100 dark:bg-slate-900">
                <Image
                  src={hero.profileImage}
                  alt={`${hero.name} ${hero.lastName} - Full Stack Developer`}
                  width={192}
                  height={192}
                  className="object-cover w-full h-full"
                  sizes="(max-width: 768px) 10rem, 12rem"
                  priority
                />
              </div>
            </div>
          </motion.div>

          {/* Name with Premium Display Font */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter leading-tight">
              {hero.name}{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-500 to-blue-600 dark:from-emerald-400 dark:to-blue-500">
                {hero.lastName}
              </span>
            </h1>
          </motion.div>

          {/* Type animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-mono text-lg md:text-2xl text-emerald-600 dark:text-emerald-400 mb-8 h-7 md:h-9 flex items-center justify-center uppercase tracking-widest overflow-hidden"
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

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            {hero.bio}
          </motion.p>

          {/* Magnetic CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-8   justify-center items-center mb-16"
          >
            <MagneticButton strength={20}>
              <Button
                onClick={scrollToProjects}
                className="group relative px-6 py-2 sm:py-3 lg:py-4 h-auto bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold rounded-full overflow-hidden transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 cursor-pointer"
              >
                <span className="relative z-10 flex items-center gap-2 transition-colors duration-300">
                  Explore My Work
                </span>
              </Button>
            </MagneticButton>

            <MagneticButton strength={20}>
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
                className="px-6 py-2 sm:py-3 lg:py-4 h-auto border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-full transition-all duration-300 hover:border-slate-900 dark:hover:border-white hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
              >
                Download Resume
              </Button>
            </MagneticButton>
          </motion.div>

          {/* Magnetic Social links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex justify-center gap-6"
          >
            {hero.socialLinks.map((social, index) => {
              const Icon = platformIconMap[social.platform] ?? FaEnvelope;
              const href =
                social.platform === "Email" &&
                !social.href.startsWith("mailto:")
                  ? `mailto:${social.href}`
                  : social.href;
              return (
                <MagneticButton key={social.label} strength={30}>
                  <motion.a
                    href={href}
                    target={social.platform === "Email" ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.8 + index * 0.1,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="relative flex p-4 text-slate-600 dark:text-slate-400 hover:text-white transition-colors duration-300 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-900 dark:hover:bg-slate-800 hover:border-slate-900 dark:hover:border-slate-700 shadow-sm hover:shadow-md group"
                    aria-label={social.label}
                  >
                    <Icon
                      size={20}
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

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-slate-400 dark:border-slate-600 rounded-full flex justify-center p-2"
          >
            <div className="w-1 h-2 bg-slate-600 dark:bg-slate-400 rounded-full" />
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}</style>
    </section>
  );
}
