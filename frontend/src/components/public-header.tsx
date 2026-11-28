"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SAM_LOGO_DATA_URL } from "@/lib/sam-logo";
import { useLanguage } from "@/lib/i18n/language-context";
import { useAuth } from "@/lib/auth-context";
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
  LogIn,
  LayoutDashboard,
} from "lucide-react";

export function PublicHeader() {
  const { isEn, bilingual } = useLanguage();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-950/90 backdrop-blur-2xl border-b border-white/20 shadow-2xl shadow-black/40"
          : "bg-slate-950/75 backdrop-blur-xl border-b border-white/15 shadow-md"
      }`}
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-6">
        {/* Left: Logo & Brand */}
        <Link href="/" className="flex items-center gap-2 group shrink min-w-0">
          <img
            src={SAM_LOGO_DATA_URL}
            alt="Spiritual Advance Ministry"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0 group-hover:scale-105 transition-transform"
          />
          <span className="font-serif font-bold text-white text-[12.5px] xs:text-sm sm:text-[15px] xl:text-base tracking-tight leading-none whitespace-nowrap">
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
                    ? "text-amber-300 font-bold opacity-100 border-b-2 border-amber-400 -mb-[2px]"
                    : "text-slate-200 font-semibold opacity-85 hover:opacity-100 hover:text-amber-300"
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
          <LanguageSwitcher size="sm" variant="glass" />

          {/* Desktop Login / Dashboard button */}
          <Link
            href={user ? "/dashboard" : "/login"}
            className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-serif font-semibold tracking-wide transition-all cursor-pointer shadow-xs"
          >
            {user ? (
              <>
                <LayoutDashboard className="w-3.5 h-3.5 text-amber-300" />
                <span>{bilingual("Quản Trị", "Dashboard")}</span>
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5 text-amber-300" />
                <span>{bilingual("Đăng Nhập", "Login")}</span>
              </>
            )}
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE LEFT SLIDE-IN DRAWER & BACKDROP OVERLAY                 */}
      {/* ============================================================== */}
      {mounted &&
        createPortal(
          <>
            {/* 1. Backdrop Overlay (Bấm ra ngoài thì đóng) */}
            <div
              data-testid="drawer-backdrop"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
              className={`fixed inset-0 bg-black/75 backdrop-blur-xs z-[9998] lg:hidden transition-opacity duration-300 ${
                mobileMenuOpen
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
            />

            {/* 2. Left Slide-In Drawer Panel (Chuyển động mượt mà trượt từ bên trái sang) */}
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation"
              className={`fixed inset-y-0 left-0 z-[9999] w-[290px] xs:w-[320px] max-w-[85vw] h-full h-[100dvh] bg-slate-950/98 backdrop-blur-2xl border-r border-white/20 shadow-2xl flex flex-col justify-between p-5 text-white lg:hidden transition-transform duration-300 ease-out will-change-transform ${
                mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="space-y-6">
                {/* Drawer Header: Brand + Close button */}
                <div className="flex items-center justify-between pb-4 border-b border-white/15">
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5"
                  >
                    <img
                      src={SAM_LOGO_DATA_URL}
                      alt="Spiritual Advance Ministry"
                      className="w-7 h-7 object-contain shrink-0"
                    />
                    <span className="font-serif font-bold text-white text-sm tracking-tight leading-tight">
                      SAM Ministry
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 font-serif block pl-1">
                    {bilingual("Điều Hướng Mục Vụ", "Ministry Navigation")}
                  </span>
                  <div className="divide-y divide-white/10 pt-1">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3.5 py-3 px-3 rounded-xl text-[15px] font-serif transition-all duration-200 ${
                            isActive
                              ? "text-amber-300 font-bold bg-primary-600/30 border border-amber-400/50 shadow-xs"
                              : "text-slate-200 font-semibold hover:text-amber-300 hover:bg-white/10 border border-transparent"
                          }`}
                        >
                          <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-amber-300" : "text-slate-400"}`} />
                          <span className="truncate">{isEn ? item.labelEn : item.labelVi}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Drawer Footer: Login Button & Tagline */}
              <div className="pt-4 border-t border-white/15 space-y-3">
                <Link
                  href={user ? "/dashboard" : "/login"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-primary-600 to-amber-600 hover:from-primary-500 hover:to-amber-500 text-white font-serif font-bold text-sm shadow-lg transition-all cursor-pointer min-h-[46px]"
                >
                  {user ? (
                    <>
                      <LayoutDashboard className="w-4 h-4 text-amber-200" />
                      <span>{bilingual("Vào Bảng Quản Trị", "Go to Dashboard")}</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 text-amber-200" />
                      <span>{bilingual("Đăng Nhập Thành Viên", "Member Login")}</span>
                    </>
                  )}
                </Link>

                <p className="text-[11px] text-slate-400 text-center font-serif">
                  Dallas, Texas • Spiritual Advance Ministry
                </p>
              </div>
            </div>
          </>,
          document.body
        )}
    </header>
  );
}
