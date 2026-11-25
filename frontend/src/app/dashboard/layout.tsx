"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth, type Role } from "@/lib/auth-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { SAM_LOGO_DATA_URL } from "@/lib/sam-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { cn } from "@/lib/cn";
import {
  LayoutDashboard,
  LineChart,
  BookOpen,
  Library,
  Video,
  UserCheck,
  DollarSign,
  Globe,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

interface NavItem {
  href: string;
  labelVi: string;
  labelEn: string;
  icon: any;
  badgeVi?: string;
  badgeEn?: string;
  badgeColor?: string;
  roles?: Role[];
}

interface NavSection {
  titleVi: string;
  titleEn: string;
  items: NavItem[];
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const { lang, setLang, isEn, t, bilingual } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  // State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fontScale, setFontScale] = useState<"normal" | "large" | "xlarge">("normal");

  const applyFontScale = (scale: "normal" | "large" | "xlarge") => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      if (scale === "xlarge") {
        root.style.fontSize = "18px";
      } else if (scale === "large") {
        root.style.fontSize = "17px";
      } else {
        root.style.fontSize = "16px";
      }
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedFont = localStorage.getItem("app_font_scale") as "normal" | "large" | "xlarge";
      if (savedFont) {
        setFontScale(savedFont);
        applyFontScale(savedFont);
      }
    }
  }, []);

  const handleFontScaleChange = (scale: "normal" | "large" | "xlarge") => {
    setFontScale(scale);
    applyFontScale(scale);
    if (typeof window !== "undefined") {
      localStorage.setItem("app_font_scale", scale);
    }
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] flex flex-col items-center justify-center gap-3">
        <span className="text-amber-700 font-serif text-3xl animate-spin select-none">†</span>
        <span className="text-xs font-serif italic text-slate-600">
          {bilingual(
            '"Đang chuẩn bị không gian quản trị tài nguyên..."',
            '"Preparing the resource administration console..."'
          )}
        </span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const currentRole: Role = user.role;

  const roleLabels: Record<
    Role,
    { titleVi: string; titleEn: string; color: string; badgeVi: string; badgeEn: string }
  > = {
    admin: {
      titleVi: "Ban Quản Trị Hệ Thống",
      titleEn: "System Administrator",
      color: "bg-primary-700 text-white border-primary-800",
      badgeVi: "⚙️ Ban Quản Trị",
      badgeEn: "⚙️ Admin",
    },
    user: {
      titleVi: "Thành Viên / Môn Đồ",
      titleEn: "Member / Disciple",
      color: "bg-slate-100 text-slate-800 border-slate-300",
      badgeVi: "🕊️ Thành Viên",
      badgeEn: "🕊️ Member",
    },
    senior_pastor: {
      titleVi: "Mục Sư Quản Trị",
      titleEn: "Senior Pastor Admin",
      color: "bg-primary-700 text-white border-primary-800",
      badgeVi: "† Mục Sư Quản Trị",
      badgeEn: "† Pastor Admin",
    },
    ministry_leader: {
      titleVi: "Trưởng Ban Mục Vụ",
      titleEn: "Ministry Leader",
      color: "bg-primary-700 text-white border-primary-800",
      badgeVi: "⭐ Trưởng Ban",
      badgeEn: "⭐ Leader",
    },
    member: {
      titleVi: "Thành Viên Hệ Thống",
      titleEn: "System Member",
      color: "bg-slate-100 text-slate-800 border-slate-300",
      badgeVi: "🕊️ Thành Viên",
      badgeEn: "🕊️ Member",
    },
    parent: {
      titleVi: "Phụ Huynh",
      titleEn: "Parent",
      color: "bg-slate-100 text-slate-800 border-slate-300",
      badgeVi: "🌱 Phụ Huynh",
      badgeEn: "🌱 Parent",
    },
  };

  // Dedicated Resource Administration Navigation
  const navSections: NavSection[] = [
    {
      titleVi: "Tổng Quan Quản Trị",
      titleEn: "Executive Overview",
      items: [
        {
          href: "/dashboard",
          labelVi: "Bảng Điều Khiển Quản Trị",
          labelEn: "Admin Dashboard",
          icon: LayoutDashboard,
        },
        {
          href: "/dashboard/analytics",
          labelVi: "Báo Cáo Sức Khỏe & Thống Kê",
          labelEn: "Analytics & Health Cockpit",
          icon: LineChart,
        },
      ],
    },
    {
      titleVi: "Quản Lý Tài Nguyên",
      titleEn: "Resource Management",
      items: [
        {
          href: "/dashboard/courses",
          labelVi: "Quản Lý Khóa Học & Đào Tạo",
          labelEn: "Courses & Training",
          icon: BookOpen,
        },
        {
          href: "/dashboard/library",
          labelVi: "Quản Lý Thư Viện & Sách",
          labelEn: "Library & Spiritual Books",
          icon: Library,
          badgeVi: "Mới",
          badgeEn: "New",
          badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
        },
        {
          href: "/dashboard/sermons",
          labelVi: "Kho Bài Giảng & Video",
          labelEn: "Sermon Vault & Media",
          icon: Video,
        },
      ],
    },
    {
      titleVi: "Người Dùng & Tài Chính",
      titleEn: "Users & Finance",
      items: [
        {
          href: "/dashboard/users",
          labelVi: "Quản Lý Người Dùng & Quyền",
          labelEn: "Users & Role Permissions",
          icon: UserCheck,
          badgeVi: "RBAC",
          badgeEn: "RBAC",
          badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
        },
        {
          href: "/dashboard/giving",
          labelVi: "Dâng Hiến & Báo Cáo Thuế 501(c)(3)",
          labelEn: "Giving & 501(c)(3) Tax",
          icon: DollarSign,
        },
      ],
    },
    {
      titleVi: "Cài Đặt Website",
      titleEn: "Website & CMS",
      items: [
        {
          href: "/dashboard/website-settings",
          labelVi: "Cấu Hình Trang Chủ (CMS)",
          labelEn: "Homepage Content (CMS)",
          icon: Globe,
          badgeVi: "CMS",
          badgeEn: "CMS",
          badgeColor: "bg-primary-100 text-primary-900 border-primary-300",
        },
        {
          href: "/dashboard/settings",
          labelVi: "Cài Đặt Hệ Thống & Bảo Mật",
          labelEn: "System Settings & Security",
          icon: Settings,
        },
      ],
    },
  ];

  const getFontSizeClass = () => {
    switch (fontScale) {
      case "xlarge":
        return "text-[115%]";
      case "large":
        return "text-[108%]";
      default:
        return "text-[100%]";
    }
  };

  return (
    <div className={`min-h-screen bg-[#FBF9F5] flex text-slate-900 ${getFontSizeClass()}`}>
      {/* ============================================================== */}
      {/* 1. LEFT SIDEBAR (Fixed Desktop 280px + Mobile Drawer) */}
      {/* ============================================================== */}
      <>
        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs lg:hidden animate-fade-in"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#FCFBF8] border-r border-amber-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-sm lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Top Brand & Soli Deo Gloria */}
          <div className="p-4 border-b border-amber-200/70 bg-gradient-to-b from-[#FAF8F3] to-[#FCFBF8]">
            <div className="flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-2.5">
                <img
                  src={SAM_LOGO_DATA_URL}
                  alt="SAM - Spiritual Advance Ministry"
                  className="w-8 h-8 object-contain shrink-0"
                />
                <div className="flex flex-col">
                  <span className="font-scripture text-base font-bold text-slate-900 tracking-tight leading-none">
                    SAM <span className="text-xs font-serif font-normal text-amber-900">• Admin Console</span>
                  </span>
                  <span className="text-xs tracking-wider uppercase text-amber-900 font-serif mt-1">
                    Quản Trị Tài Nguyên Mục Vụ
                  </span>
                </div>
              </Link>

              {/* Close button on mobile */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-amber-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Items (Scrollable Menu) */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 no-scrollbar">
            {navSections.map((sec, secIdx) => {
              return (
                <div key={secIdx} className="space-y-1">
                  <div className="px-3 pb-1">
                    <span className="text-[11px] font-serif font-bold uppercase tracking-wider text-amber-950 block">
                      {isEn ? sec.titleEn : sec.titleVi}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    {sec.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      const label = isEn ? item.labelEn : item.labelVi;
                      const badge = isEn ? (item.badgeEn || item.badgeVi) : item.badgeVi;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                            isActive
                              ? "bg-primary-700 text-white font-semibold shadow-xs shadow-primary-950/20"
                              : "text-slate-700 hover:bg-primary-50 hover:text-primary-800"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <Icon
                              className={`w-4 h-4 shrink-0 transition-colors ${
                                isActive
                                  ? "text-white"
                                  : "text-amber-900 group-hover:text-primary-700"
                              }`}
                            />
                            <span className="truncate">{label}</span>
                          </div>

                          {badge && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                                item.badgeColor || "bg-amber-100 text-amber-900 border-amber-300"
                              }`}
                            >
                              {badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar Footer: User Card & Soli Deo Gloria */}
          <div className="p-3 border-t border-amber-200/70 bg-[#FAF8F3] space-y-2">
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-amber-200/60 shadow-2xs">
              <div className="flex items-center gap-2 truncate">
                <div className="w-8 h-8 rounded-full bg-primary-700 text-white font-serif font-bold flex items-center justify-center shrink-0 text-xs shadow-xs">
                  {user.fullName.charAt(0)}
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {user.fullName}
                  </span>
                  <span className="text-[11px] text-amber-900 truncate font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-primary-700 inline" />
                    <span>{isEn ? roleLabels[currentRole]?.badgeEn : roleLabels[currentRole]?.badgeVi}</span>
                  </span>
                </div>
              </div>

              <button
                onClick={() => logout()}
                title={isEn ? "Sign Out" : "Đăng xuất"}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50 transition-all cursor-pointer shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center text-[11px] text-amber-950/70 font-serif italic">
              {isEn ? "Soli Deo Gloria • Glory to God Alone" : "Soli Deo Gloria • Vinh Hiển Thuộc Về Chúa"}
            </div>
          </div>
        </aside>
      </>

      {/* ============================================================== */}
      {/* 2. RIGHT WORKSPACE (Main Content Area) */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-[#FCFBF8]/95 backdrop-blur-md border-b border-amber-200/70 shadow-xs h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-amber-200/80 bg-white text-slate-700 hover:bg-amber-50 cursor-pointer"
            >
              <Menu className="w-5 h-5 text-amber-900" />
            </button>

            {/* Breadcrumb / Current View */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-serif text-slate-600">
              <span className="font-semibold text-slate-900">SAM Admin</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-amber-900 font-semibold">
                {isEn ? "Resource Administration" : "Bảng Quản Trị Tài Nguyên"}
              </span>
            </div>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Senior-Friendly Font Size Adjuster (A- / A / A+) */}
            <div
              className="flex items-center rounded-xl bg-amber-50/80 border border-amber-200/80 p-0.5 text-xs font-serif"
              title={isEn ? "Adjust font size" : "Phóng to / Thu nhỏ cỡ chữ cho Ban Quản Trị"}
            >
              <button
                onClick={() => handleFontScaleChange("normal")}
                className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                  fontScale === "normal"
                    ? "bg-white text-primary-700 shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                A
              </button>
              <button
                onClick={() => handleFontScaleChange("large")}
                className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                  fontScale === "large"
                    ? "bg-white text-primary-700 shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                A+
              </button>
              <button
                onClick={() => handleFontScaleChange("xlarge")}
                className={`px-2 py-1 rounded-lg text-sm font-semibold transition-all ${
                  fontScale === "xlarge"
                    ? "bg-white text-primary-700 shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                A++
              </button>
            </div>

            {/* Language Selector Dropdown with Country Flags (VI / EN) */}
            <LanguageSwitcher />

            {/* View Public Website Link Button */}
            <Link
              href="/"
              target="_blank"
              title={isEn ? "Open Public Website" : "Xem Website Bên Ngoài"}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-200/80 bg-white hover:bg-amber-50 text-xs font-semibold text-slate-700 cursor-pointer shadow-2xs transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-amber-800" />
              <span>{isEn ? "Live Site" : "Trang Chủ"}</span>
            </Link>
          </div>
        </header>

        {/* Main Content Viewport */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <div key={pathname} className="animate-fade-in">
            {children}
          </div>
        </main>

        {/* Sacred Footer */}
        <footer className="border-t border-amber-200/60 bg-[#FCFBF8] py-5 px-4 text-center text-xs text-slate-500 font-serif">
          <p>{t("footer.benediction")}</p>
        </footer>
      </div>
    </div>
  );
}
