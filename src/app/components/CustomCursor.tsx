"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true); // safe default = hidden until confirmed otherwise

  // Detect touch device after mount to prevent SSR/hydration mismatch
  useEffect(() => {
    const hasTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      navigator.maxTouchPoints > 0;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsTouchDevice(hasTouch);
  }, []);

  // Mouse tracking & hover detection
  useEffect(() => {
    if (isTouchDevice) return;

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleLinkHoverEnter = () => setIsHovering(true);
    const handleLinkHoverLeave = () => setIsHovering(false);

    window.addEventListener("mousemove", updateMousePosition);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    const interactiveElements = document.querySelectorAll(
      "a, button, input, textarea, select, [role='button']",
    );

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleLinkHoverEnter);
      el.addEventListener("mouseleave", handleLinkHoverLeave);
    });

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);

      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleLinkHoverEnter);
        el.removeEventListener("mouseleave", handleLinkHoverLeave);
      });
    };
  }, [isTouchDevice, isVisible]);

  // Don't render on touch devices
  if (isTouchDevice) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-emerald-500 rounded-full pointer-events-none z-100 mix-blend-difference"
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
          scale: isHovering ? 2.5 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
          mass: 0.1,
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-emerald-500/50 rounded-full pointer-events-none z-99"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 1.5 : 1,
          opacity: isVisible ? (isHovering ? 0 : 1) : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 25,
          mass: 0.5,
        }}
      />
    </>
  );
}
