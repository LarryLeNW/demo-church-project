"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  variant?: "default" | "sacred" | "dark";
}

export function Breadcrumb({ items, className = "", variant = "sacred" }: BreadcrumbProps) {
  const { bilingual } = useLanguage();
  const isSacred = variant === "sacred" || variant === "dark";

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-xs font-medium animate-fade-in ${
        isSacred ? "text-amber-100/90" : "text-slate-600"
      } ${className}`}
    >
      <ol className="flex items-center flex-wrap gap-1.5 sm:gap-2">
        <li className="flex items-center">
          <Link
            href="/"
            className={`flex items-center gap-1.5 transition-colors ${
              isSacred ? "text-amber-200 hover:text-white" : "text-slate-600 hover:text-primary-700"
            }`}
          >
            <Home className={`w-3.5 h-3.5 ${isSacred ? "text-amber-300" : "text-primary-700"}`} />
            <span className="font-serif">{bilingual("Trang Chủ", "Home")}</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5 sm:gap-2">
              <ChevronRight
                className={`w-3.5 h-3.5 shrink-0 ${
                  isSacred ? "text-amber-300/80" : "text-amber-700/60"
                }`}
              />
              {isLast || !item.href ? (
                <span
                  className={`font-bold font-serif ${
                    isSacred ? "text-white drop-shadow-xs" : "text-slate-900"
                  }`}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={`transition-colors font-serif ${
                    isSacred ? "text-amber-200 hover:text-white" : "text-slate-600 hover:text-primary-700"
                  }`}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
