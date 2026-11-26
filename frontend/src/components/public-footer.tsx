"use client";

import React from "react";
import Link from "next/link";
import { SAM_LOGO_DATA_URL } from "@/lib/sam-logo";
import { useLanguage } from "@/lib/i18n/language-context";
import { Mail, MapPin } from "lucide-react";

export function PublicFooter() {
  const { isEn, bilingual } = useLanguage();

  return (
    <footer className="bg-slate-950/75 backdrop-blur-xl border-t border-white/15 py-4 sm:py-5 text-slate-300 text-xs mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        {/* Left: Brand & Copyright */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-3 text-xs">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <img
              src={SAM_LOGO_DATA_URL}
              alt="Spiritual Advance Ministry"
              className="w-6 h-6 object-contain shrink-0 group-hover:scale-105 transition-transform"
            />
            <span className="font-serif font-bold text-white text-sm tracking-tight">
              Spiritual Advance Ministry
            </span>
          </Link>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-[11px] text-slate-400 font-serif">
            © {new Date().getFullYear()} SAM. {bilingual("Bảo lưu mọi quyền.", "All rights reserved.")}
          </span>
        </div>

        {/* Right: Quick Contact & Soli Deo Gloria */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-4 text-[11px]">
          <span className="inline-flex items-center gap-1 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Dallas, TX & VN</span>
          </span>
          <a
            href="mailto:contact@saministry.org"
            className="inline-flex items-center gap-1 text-slate-300 hover:text-amber-300 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>contact@saministry.org</span>
          </a>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-amber-300 font-serif font-semibold italic">
            Soli Deo Gloria
          </span>
        </div>
      </div>
    </footer>
  );
}
