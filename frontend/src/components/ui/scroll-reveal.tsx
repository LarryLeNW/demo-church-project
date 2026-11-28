"use client";

import React, { useEffect, useRef, useState } from "react";

export type ScrollRevealVariant =
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "reveal-text"
  | "reveal-scale"
  | "fade";

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: ScrollRevealVariant;
  delay?: number; // Milliseconds
  duration?: number; // Milliseconds
  className?: string;
  threshold?: number;
  once?: boolean;
}

/**
 * Prescott Potter's House Inspired Scroll Reveal & Entrance Animation
 * Hardware-accelerated fluid entrance ("chạy ra") powered by IntersectionObserver
 */
export function ScrollReveal({
  children,
  variant = "slide-up",
  delay = 0,
  duration = 750,
  className = "",
  threshold = 0.12,
  once = true,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion preferences
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(el);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  // Initial hidden classes
  const getInitialClass = () => {
    switch (variant) {
      case "slide-up":
        return "translate-y-12 opacity-0";
      case "slide-down":
        return "-translate-y-12 opacity-0";
      case "slide-left":
        return "translate-x-14 opacity-0";
      case "slide-right":
        return "-translate-x-14 opacity-0";
      case "reveal-text":
        return "opacity-0 [clip-path:inset(0_100%_0_0)] -translate-x-4";
      case "reveal-scale":
        return "scale-95 opacity-0";
      case "fade":
      default:
        return "opacity-0";
    }
  };

  const activeClass =
    "translate-y-0 translate-x-0 scale-100 opacity-100 [clip-path:inset(0_0%_0_0)]";

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)", // Sacred Golden Easing
        willChange: isVisible ? "auto" : "transform, opacity",
      }}
      className={`transition-all ${isVisible ? activeClass : getInitialClass()} ${className}`}
    >
      {children}
    </div>
  );
}
