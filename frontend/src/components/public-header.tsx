"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SAM_LOGO_DATA_URL } from "@/lib/sam-logo";
import { useLanguage } from "@/lib/i18n/language-context";
import { TactileButton } from "@/components/ui/tactile-button";
import { LanguageSwitcher } from "@/components/language-switcher";
import {
  Menu,
  X,
  ArrowRight,
  BookOpen,
  DollarSign,
  Info,
  PhoneCall,
  Bell,
  Home,
} from "lucide-react";

export function PublicHeader() {
  const { isEn, bilingual } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/", labelVi: "Trang Chủ", labelEn: "Home", icon: Home },
    { href: "/about", labelVi: "Giới Thiệu", labelEn: "About", icon: Info },
    { href: "/library", labelVi: "Thư Viện", labelEn: "Library", icon: BookOpen },
    { href: "/give", labelVi: "Dâng Hiến", labelEn: "Give", icon: DollarSign },
    { href: "/contact", labelVi: "Liên Hệ", labelEn: "Contact", icon: PhoneCall },
    { href: "/courses", labelVi: "Khóa Học", labelEn: "Courses", icon: BookOpen },
    { href: "/announcements", labelVi: "Thông Báo", labelEn: "News", icon: Bell },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FCFBF8]/95 backdrop-blur-md border-b border-amber-200/70 shadow-xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Logo & Brand */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 xl:w-11 xl:h-11 rounded-xl bg-white border border-amber-300/80 p-1 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
            <img
              src={SAM_LOGO_DATA_URL}
              alt="SAM Logo"
              className="w-7 h-7 sm:w-8 sm:h-8 xl:w-9 xl:h-9 object-contain"
            />
          </div>
          <span className="font-serif font-black text-slate-900 text-lg sm:text-xl tracking-tight leading-none">
            SAM
          </span>
        </Link>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 shrink min-w-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-1.5 xl:px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "text-primary-800 bg-primary-50 border border-primary-200"
                    : "text-slate-700 hover:text-primary-800 hover:bg-primary-50"
                }`}
              >
                {isEn ? item.labelEn : item.labelVi}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Language Selector Dropdown with Country Flags */}
          <LanguageSwitcher size="sm" />

          {/* Sign In Link Button */}
          <Link href="/login" className="hidden sm:inline-flex shrink-0">
            <TactileButton variant="primary" size="sm" className="min-h-[32px] h-8 py-1 px-3 whitespace-nowrap text-xs">
              <span>{isEn ? "Sign In" : "Đăng Nhập"}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </TactileButton>
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-xl border border-amber-200/80 bg-white text-slate-700 hover:bg-amber-50 cursor-pointer shadow-2xs shrink-0"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-amber-900" />
            ) : (
              <Menu className="w-5 h-5 text-amber-900" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-amber-200/80 p-4 sm:p-5 shadow-lg space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#F17F34] font-serif">
              {bilingual("Điều Hướng Mục Vụ", "Ministry Navigation")}
            </span>
            <div className="grid grid-cols-1 gap-1 pt-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      isActive
                        ? "bg-[#FEF5EE] text-[#F17F34] border border-[#F17F34]/30"
                        : "text-slate-800 hover:bg-amber-50"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-amber-800" />
                    <span>{isEn ? item.labelEn : item.labelVi}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-amber-100 flex items-center justify-between">
            <span className="text-xs font-serif text-slate-600">
              {bilingual("Ngôn ngữ hiển thị:", "Display Language:")}
            </span>
            <LanguageSwitcher align="right" />
          </div>

          <div className="pt-1">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <TactileButton variant="primary" size="md" className="w-full justify-center">
                <span>{bilingual("Đăng Nhập Quản Trị", "Sign In to Admin")}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </TactileButton>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
