"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/language-context";
import { CountryFlag } from "@/components/ui/country-flag";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/cn";

export interface LanguageSwitcherProps {
  className?: string;
  variant?: "subtle" | "default" | "parchment";
  align?: "left" | "right";
}

export function LanguageSwitcher({
  className,
  variant = "subtle",
  align = "right",
}: LanguageSwitcherProps) {
  const { lang, setLang, isEn } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  const variantStyles = {
    subtle:
      "bg-amber-50/80 hover:bg-amber-100/70 text-slate-800 border-amber-200/90 focus:border-amber-500",
    default:
      "bg-white hover:bg-amber-50/80 text-slate-900 border-amber-200/90 focus:border-primary-600",
    parchment:
      "bg-[#FBF9F5] hover:bg-amber-50/80 text-slate-900 border-amber-200/90 focus:border-primary-600",
  };

  const options: { value: "VI" | "EN"; label: string; fullLabel: string }[] = [
    { value: "VI", label: "VI", fullLabel: "Tiếng Việt" },
    { value: "EN", label: "EN", fullLabel: "English" },
  ];

  return (
    <div
      ref={dropdownRef}
      className={cn("relative inline-block shrink-0 text-left", className)}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setIsOpen(false);
          if (e.key === "ArrowDown" && !isOpen) {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={isEn ? "Select Language" : "Chọn Ngôn Ngữ"}
        className={cn(
          "inline-flex items-center justify-between gap-1.5 h-9 px-2.5 rounded-xl border shadow-2xs font-bold text-xs transition-all duration-150 cursor-pointer select-none outline-none focus:ring-2 focus:ring-amber-500/20 active:scale-[0.98]",
          variantStyles[variant],
          isOpen && "border-amber-500 ring-2 ring-amber-500/20 bg-amber-100/60"
        )}
      >
        <div className="flex items-center gap-1.5 shrink-0">
          <CountryFlag country={lang} className="w-5 h-3.5 shadow-2xs" />
          <span className="font-bold text-xs text-slate-800 tracking-tight leading-none">
            {lang}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-amber-900/80 shrink-0 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Floating Popover Listbox */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Language selection"
          className={cn(
            "absolute z-50 mt-1.5 min-w-[145px] p-1 rounded-xl bg-white/98 backdrop-blur-md shadow-xl border border-amber-200/90 space-y-0.5 animate-in fade-in-0 zoom-in-95 duration-150",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {options.map((opt) => {
            const isSelected = opt.value === lang;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  setLang(opt.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer text-left select-none",
                  isSelected
                    ? "bg-amber-100/70 text-slate-900 font-bold border border-amber-300/80 shadow-2xs"
                    : "hover:bg-amber-50/80 text-slate-700 border border-transparent font-medium"
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <CountryFlag country={opt.value} className="w-5 h-3.5 shadow-2xs" />
                  <span className="truncate">{opt.fullLabel}</span>
                  <span className="text-[10px] text-slate-400 font-sans font-normal">
                    ({opt.label})
                  </span>
                </div>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-primary-700 shrink-0 ml-1" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
