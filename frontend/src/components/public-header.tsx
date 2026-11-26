"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SAM_LOGO_DATA_URL } from "@/lib/sam-logo";
import { useLanguage } from "@/lib/i18n/language-context";
import { LanguageSwitcher } from "@/components/language-switcher";
import {
  Menu,
  X,
  BookOpen,
  DollarSign,
  Info,
  PhoneCall,
  Home,
  GraduationCap,
} from "lucide-react";

export function PublicHeader() {
  const { isEn, bilingual } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Đã bỏ màn hình Thông Báo (/announcements) theo yêu cầu người dùng
  const navItems = [
    { href: "/", labelVi: "Trang Chủ", labelEn: "Home", icon: Home },
    { href: "/about", labelVi: "Giới Thiệu", labelEn: "About", icon: Info },
    { href: "/courses", labelVi: "Khóa Học", labelEn: "Courses", icon: GraduationCap },
    { href: "/library", labelVi: "Thư Viện", labelEn: "Library", icon: BookOpen },
    { href: "/give", labelVi: "Dâng Hiến", labelEn: "Give", icon: DollarSign },
    { href: "/contact", labelVi: "Liên Hệ", labelEn: "Contact", icon: PhoneCall },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FCFBF8]/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4 sm:gap-6">
        {/* Left: Logo & Brand */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <img
            src={SAM_LOGO_DATA_URL}
            alt="Spiritual Advance Ministry"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0 group-hover:scale-105 transition-transform"
          />
          <span className="font-serif font-bold text-slate-900 text-sm sm:text-[15px] xl:text-base tracking-tight leading-none whitespace-nowrap">
            Spiritual Advance Ministry
          </span>
        </Link>

        {/* Center: Desktop Nav Links (Chữ to rõ ràng hơn, độ đậm chuẩn phong cách Thánh Khiết) */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 shrink min-w-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`py-2 text-[14px] xl:text-[15px] tracking-normal whitespace-nowrap font-serif transition-all duration-200 ${
                  isActive
                    ? "text-primary-700 font-bold opacity-100 border-b-2 border-primary-700 -mb-[2px]"
                    : "text-slate-800 font-semibold opacity-85 hover:opacity-100 hover:text-primary-700"
                }`}
              >
                <span>{isEn ? item.labelEn : item.labelVi}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Language Selector Dropdown with Country Flags (h-9) */}
          <LanguageSwitcher size="sm" />

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 text-slate-700 hover:text-primary-700 transition-colors cursor-pointer shrink-0"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-900" />
            ) : (
              <Menu className="w-6 h-6 text-slate-900" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FCFBF8] border-t border-amber-200/80 px-5 py-4 shadow-lg space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary-700 font-serif">
              {bilingual("Điều Hướng Mục Vụ", "Ministry Navigation")}
            </span>
            <div className="divide-y divide-amber-100/80 pt-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3.5 py-3.5 text-[15px] font-serif transition-all duration-200 ${
                      isActive
                        ? "text-primary-700 font-bold opacity-100"
                        : "text-slate-800 font-semibold opacity-85 hover:opacity-100 hover:text-primary-700"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-primary-700" : "text-amber-800/70"}`} />
                    <span>{isEn ? item.labelEn : item.labelVi}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-amber-200/70 flex items-center justify-between">
            <span className="text-xs font-serif text-slate-600">
              {bilingual("Ngôn ngữ hiển thị:", "Display Language:")}
            </span>
            <LanguageSwitcher align="right" />
          </div>
        </div>
      )}
    </header>
  );
}
