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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Left: Logo & Brand (Thuần logo, không viền hộp vuông) */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <img
            src={SAM_LOGO_DATA_URL}
            alt="SAM Logo"
            className="w-8 h-8 sm:w-9 sm:h-9 xl:w-10 xl:h-10 object-contain shrink-0 group-hover:scale-105 transition-transform"
          />
          <span className="font-serif font-black text-slate-900 text-lg sm:text-xl tracking-tight leading-none">
            SAM
          </span>
        </Link>

        {/* Center: Desktop Nav Links (Thanh lịch, không khung vuông, gạch chân tinh tế khi active) */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 shrink min-w-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-2 text-xs xl:text-sm tracking-wide transition-colors whitespace-nowrap font-serif ${
                  isActive
                    ? "text-primary-700 font-bold"
                    : "text-slate-700 hover:text-primary-700 font-medium"
                }`}
              >
                <span>{isEn ? item.labelEn : item.labelVi}</span>
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-primary-700 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Selector Dropdown with Country Flags */}
          <LanguageSwitcher size="sm" />

          {/* Sign In Link Button */}
          <Link href="/login" className="hidden sm:inline-flex shrink-0">
            <TactileButton variant="primary" size="sm" className="min-h-[32px] h-8 py-1 px-3 whitespace-nowrap text-xs">
              <span>{isEn ? "Sign In" : "Đăng Nhập"}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </TactileButton>
          </Link>

          {/* Mobile Hamburger Toggle (Phẳng, không hộp vuông) */}
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

      {/* Mobile Drawer Menu (Bố cục danh sách phân dòng, không khung hộp vuông) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FCFBF8] border-t border-amber-200/80 px-5 py-4 shadow-lg space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary-700 font-serif">
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
                    className={`flex items-center justify-between py-3 text-sm font-serif transition-colors ${
                      isActive
                        ? "text-primary-700 font-bold"
                        : "text-slate-800 hover:text-primary-700 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? "text-primary-700" : "text-amber-800/70"}`} />
                      <span>{isEn ? item.labelEn : item.labelVi}</span>
                    </div>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-700" />
                    )}
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
