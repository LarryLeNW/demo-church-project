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
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  const { bilingual } = useLanguage();

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-xs font-medium text-slate-600 animate-fade-in ${className}`}
    >
      <ol className="flex items-center flex-wrap gap-1.5 sm:gap-2">
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-slate-600 hover:text-primary-700 transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-primary-700" />
            <span className="font-serif">{bilingual("Trang Chủ", "Home")}</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5 sm:gap-2">
              <ChevronRight className="w-3.5 h-3.5 text-amber-700/60 shrink-0" />
              {isLast || !item.href ? (
                <span
                  className="font-bold text-slate-900 font-serif"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-slate-600 hover:text-primary-700 transition-colors font-serif"
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
