"use client";

import React from "react";
import Link from "next/link";
import { SAM_LOGO_DATA_URL } from "@/lib/sam-logo";
import { useLanguage } from "@/lib/i18n/language-context";
import { Mail, MapPin } from "lucide-react";

export function PublicFooter() {
  const { isEn, bilingual } = useLanguage();

  return (
    <footer className="bg-slate-950/75 backdrop-blur-xl border-t border-white/15 py-6 sm:py-7 text-slate-300 text-xs mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 space-y-4">
        {/* Top compact row: Brand, Horizontal Nav, and Quick Contact */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          {/* Brand */}
          <Link href="/" className="inline-flex items-center gap-2.5 group shrink-0">
            <img
              src={SAM_LOGO_DATA_URL}
              alt="Spiritual Advance Ministry"
              className="w-7 h-7 object-contain shrink-0 group-hover:scale-105 transition-transform"
            />
            <span className="font-serif font-bold text-white text-sm sm:text-base tracking-tight">
              Spiritual Advance Ministry
            </span>
          </Link>

          {/* Horizontal Nav Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-7 gap-y-2 font-medium text-slate-200">
            <Link href="/" className="hover:text-amber-300 transition-colors">
              {bilingual("Trang Chủ", "Home")}
            </Link>
            <Link href="/about" className="hover:text-amber-300 transition-colors">
              {bilingual("Về Chúng Tôi", "About")}
            </Link>
            <Link href="/courses" className="hover:text-amber-300 transition-colors">
              {bilingual("Khóa Học", "Courses")}
            </Link>
            <Link href="/library" className="hover:text-amber-300 transition-colors">
              {bilingual("Thư Viện", "Library")}
            </Link>
            <Link href="/give" className="hover:text-amber-300 transition-colors">
              {bilingual("Dâng Hiến", "Give")}
            </Link>
            <Link href="/contact" className="hover:text-amber-300 transition-colors">
              {bilingual("Liên Hệ", "Contact")}
            </Link>
          </nav>

          {/* Quick Contact badge */}
          <div className="flex items-center gap-4 text-[11px] text-slate-400 shrink-0">
            <span className="inline-flex items-center gap-1">
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
          </div>
        </div>

        {/* Bottom divider line & Copyright */}
        <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 font-serif text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} Spiritual Advance Ministry (SAM). {bilingual("Bảo lưu mọi quyền.", "All rights reserved.")}
          </div>
          <div className="text-amber-300 font-semibold italic flex items-center gap-1.5">
            <span>Soli Deo Gloria</span>
            <span>•</span>
            <span>{isEn ? "Glory to God Alone" : "Vinh Hiển Thuộc Về Chúa"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
