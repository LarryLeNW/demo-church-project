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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Logo & Brand (Tên đầy đủ gọn gàng, tinh tế) */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <img
            src={SAM_LOGO_DATA_URL}
            alt="Spiritual Advance Ministry"
            className="w-6 h-6 sm:w-7 sm:h-7 object-contain shrink-0 group-hover:scale-105 transition-transform"
          />
          <span className="font-serif font-bold text-slate-800 text-xs sm:text-[13px] xl:text-sm tracking-tight leading-none whitespace-nowrap">
            Spiritual Advance Ministry
          </span>
        </Link>

        {/* Center: Desktop Nav Links (Sử dụng opacity thay vì đường kẻ) */}
        <nav className="hidden lg:flex items-center gap-3 xl:gap-4.5 shrink min-w-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`py-1.5 text-xs xl:text-[13px] tracking-normal whitespace-nowrap font-serif transition-all duration-200 ${
                  isActive
                    ? "text-primary-700 font-bold opacity-100"
                    : "text-slate-800 font-medium opacity-65 hover:opacity-100 hover:text-primary-700"
                }`}
              >
                <span>{isEn ? item.labelEn : item.labelVi}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Language Selector Dropdown with Country Flags (h-8) */}
          <LanguageSwitcher size="sm" />

          {/* Sign In Link Button (Khớp chính xác height h-8 với LanguageSwitcher) */}
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg bg-primary-700 hover:bg-primary-800 text-white font-bold text-xs whitespace-nowrap shadow-2xs transition-all active:scale-[0.98]"
          >
            <span>{isEn ? "Sign In" : "Đăng Nhập"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Hamburger Toggle (Phẳng, không hộp vuông) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-1.5 text-slate-700 hover:text-primary-700 transition-colors cursor-pointer shrink-0"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-slate-900" />
            ) : (
              <Menu className="w-5 h-5 text-slate-900" />
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
                    className={`flex items-center gap-3 py-3 text-sm font-serif transition-all duration-200 ${
                      isActive
                        ? "text-primary-700 font-bold opacity-100"
                        : "text-slate-800 font-medium opacity-65 hover:opacity-100 hover:text-primary-700"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-primary-700" : "text-amber-800/70"}`} />
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
