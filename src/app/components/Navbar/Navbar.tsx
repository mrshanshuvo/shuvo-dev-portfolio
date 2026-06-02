"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import type { NavItem } from "@/types";
import ThemeToggle from "../ThemeToggle";
import { Button } from "@/components/ui/button";

interface Props {
  resumeUrl: string;
}

export default function Navbar({ resumeUrl }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("home");
  const isClickingRef = useRef<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveSection("");
      return;
    }

    const sections = [
      "home",
      "about",
      "skills",
      "education",
      "experience",
      "projects",
      "playground",
      "blog",
      "certifications",
      "contact",
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickingRef.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.2, rootMargin: "-50px 0px -50px 0px" },
    );

    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [pathname]);

  const handleNavClick = (id: string): void => {
    setIsOpen(false);
    if (pathname === "/") {
      const targetId = id === "credentials" ? "certifications" : id;
      const element = document.getElementById(targetId);
      if (element) {
        isClickingRef.current = true;
        setActiveSection(id);

        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });

        if (window.history.pushState) {
          window.history.pushState(null, "", `#${id}`);
        }

        // Re-enable observer after smooth scroll finishes
        setTimeout(() => {
          isClickingRef.current = false;
        }, 1000);
      }
    } else {
      router.push(`/#${id}`);
    }
  };

  const getMappedActiveSection = (id: string): string => {
    switch (id) {
      case "home":
        return "about";
      case "skills":
      case "playground":
        return "projects";
      case "education":
      case "certifications":
      case "blog":
        return "more";
      default:
        return id;
    }
  };

  const mappedActive = getMappedActiveSection(activeSection);

  const mainNavItems: NavItem[] = [
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
  ];

  const moreNavItems: NavItem[] = [
    { id: "education", label: "Education" },
    { id: "certifications", label: "Certifications" },
    { id: "blog", label: "Blog" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed w-full top-0 z-50"
    >
      <div
        className={`transition-all duration-300 ${scrolled ? "py-3" : "py-6"}`}
      >
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`relative transition-all duration-300 ${
              scrolled
                ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl shadow-lg shadow-black/5 dark:shadow-black/20 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl"
                : "bg-transparent"
            }`}
          >
            <div className="flex justify-between items-center px-6 py-4">
              {/* Logo */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavClick("home")}
                className="flex items-center gap-3 group relative z-10"
                aria-label="Scroll to home"
              >
                <div className="relative">
                  <Image
                    src="/favicons/android-chrome-512x512.png"
                    alt="Logo"
                    width={36}
                    height={36}
                    className="rounded-lg ring-2 ring-emerald-500/20 dark:ring-emerald-400/20"
                    priority
                  />
                </div>
              </motion.button>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-6">
                <div className="flex items-center gap-1 mr-2">
                  {mainNavItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className="relative px-3 lg:px-4 py-2 group"
                      aria-current={
                        mappedActive === item.id ? "page" : undefined
                      }
                    >
                      <span
                        className={`relative z-10 text-sm font-bold transition-colors cursor-pointer ${
                          mappedActive === item.id
                            ? scrolled
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-slate-900 dark:text-white"
                            : scrolled
                              ? "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200"
                              : "text-slate-700/70 dark:text-white/70 group-hover:text-slate-900 dark:group-hover:text-white"
                        }`}
                      >
                        {item.label}
                      </span>
                      {mappedActive === item.id && (
                        <motion.div
                          layoutId="navIndicator"
                          className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                            scrolled
                              ? "bg-emerald-600 dark:bg-emerald-400"
                              : "bg-slate-900 dark:bg-white"
                          }`}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}
                    </button>
                  ))}

                  {/* More Dropdown */}
                  <div className="relative group">
                    <button
                      className="relative px-3 lg:px-4 py-2 group flex items-center gap-1"
                      aria-current={
                        mappedActive === "more" ? "page" : undefined
                      }
                    >
                      <span
                        className={`relative z-10 text-sm font-bold transition-colors cursor-pointer ${
                          mappedActive === "more"
                            ? scrolled
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-slate-900 dark:text-white"
                            : scrolled
                              ? "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200"
                              : "text-slate-700/70 dark:text-white/70 group-hover:text-slate-900 dark:group-hover:text-white"
                        }`}
                      >
                        More ▾
                      </span>
                      {mappedActive === "more" && (
                        <motion.div
                          layoutId="navIndicator"
                          className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                            scrolled
                              ? "bg-emerald-600 dark:bg-emerald-400"
                              : "bg-slate-900 dark:bg-white"
                          }`}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}
                    </button>
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                      <div className="py-2">
                        {moreNavItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            className="w-full text-left px-4 py-2 text-sm font-medium transition-colors text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Contact */}
                  <button
                    onClick={() => handleNavClick("contact")}
                    className="relative px-3 lg:px-4 py-2 group"
                    aria-current={
                      mappedActive === "contact" ? "page" : undefined
                    }
                  >
                    <span
                      className={`relative z-10 text-sm font-bold transition-colors cursor-pointer ${
                        mappedActive === "contact"
                          ? scrolled
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-slate-900 dark:text-white"
                          : scrolled
                            ? "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200"
                            : "text-slate-700/70 dark:text-white/70 group-hover:text-slate-900 dark:group-hover:text-white"
                      }`}
                    >
                      Contact
                    </span>
                    {mappedActive === "contact" && (
                      <motion.div
                        layoutId="navIndicator"
                        className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                          scrolled
                            ? "bg-emerald-600 dark:bg-emerald-400"
                            : "bg-slate-900 dark:bg-white"
                        }`}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <ThemeToggle />
                  <Button
                    nativeButton={false}
                    render={
                      <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md hover:-translate-y-px ${
                      scrolled
                        ? "bg-emerald-600 dark:bg-emerald-500 text-white hover:bg-emerald-700 dark:hover:bg-emerald-600 hover:shadow-lg"
                        : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 hover:shadow-lg border border-slate-700 dark:border-white/20"
                    }`}
                  >
                    Resume
                  </Button>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`md:hidden p-2 rounded-lg transition-colors ${
                  scrolled
                    ? "text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                    : "text-white hover:bg-white/10"
                }`}
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`md:hidden mt-3 rounded-2xl overflow-hidden ${
                  scrolled
                    ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50"
                    : "bg-slate-950/95 backdrop-blur-2xl border border-white/10"
                }`}
              >
                <div className="p-3">
                  {[
                    ...mainNavItems,
                    ...moreNavItems,
                    { id: "contact", label: "Contact" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                        mappedActive === item.id ||
                        (mappedActive === "more" &&
                          moreNavItems.some((m) => m.id === item.id))
                          ? scrolled
                            ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                            : "bg-white/10 text-white"
                          : scrolled
                            ? "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                            : "text-white/80 hover:bg-white/5"
                      }`}
                      aria-current={
                        mappedActive === item.id ||
                        (mappedActive === "more" &&
                          moreNavItems.some((m) => m.id === item.id))
                          ? "page"
                          : undefined
                      }
                    >
                      {item.label}
                    </button>
                  ))}
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block mt-3 px-4 py-3 rounded-lg text-base font-medium text-center transition-colors ${
                      scrolled
                        ? "bg-emerald-600 dark:bg-emerald-500 text-white hover:bg-emerald-700 dark:hover:bg-emerald-600"
                        : "bg-white/90 text-slate-900"
                    }`}
                  >
                    Download Resume
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
}
