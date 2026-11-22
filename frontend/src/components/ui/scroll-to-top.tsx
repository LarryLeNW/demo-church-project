"use client";

import React, { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import { cn } from "@/lib/cn";

export function ScrollToTop() {
  const { isEn } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Show button when scrolled past 350px
      if (scrollY > 350) {
        setVisible(true);
      } else {
        setVisible(false);
      }

      // Calculate reading progress percentage (0 - 100)
      if (scrollHeight > 0) {
        const currentProgress = Math.min(100, Math.max(0, (scrollY / scrollHeight) * 100));
        setProgress(currentProgress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const radius = 19;
  const circumference = 2 * Math.PI * radius; // ~119.38
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={isEn ? "Scroll back to top" : "Cuộn lên đầu trang"}
      title={isEn ? "Back to top" : "Lên đầu trang"}
      className={cn(
        "fixed z-40 bottom-5 right-5 sm:bottom-7 sm:right-7",
        "w-11 h-11 sm:w-12 sm:h-12 rounded-full",
        "bg-[#FCFBF8]/95 backdrop-blur-md border border-amber-300/80 shadow-lg shadow-amber-950/15",
        "flex items-center justify-center cursor-pointer select-none group",
        "transition-all duration-300 ease-out",
        "hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-500/30",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      {/* Subtle Circular Scroll Progress Ring */}
      <svg
        className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
        viewBox="0 0 44 44"
      >
        <circle
          cx="22"
          cy="22"
          r={radius}
          className="stroke-amber-200/50"
          strokeWidth="2"
          fill="none"
        />
        <circle
          cx="22"
          cy="22"
          r={radius}
          className="stroke-primary-600 transition-all duration-150"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          fill="none"
        />
      </svg>

      {/* Upward Chevron Icon */}
      <div className="relative z-10 w-7 h-7 rounded-full bg-white/90 group-hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center shadow-2xs">
        <ChevronUp className="w-4 h-4 text-primary-700 group-hover:text-white transition-all duration-200 group-hover:-translate-y-0.5" />
      </div>
    </button>
  );
}
