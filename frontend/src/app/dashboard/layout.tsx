"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth, type Role } from "@/lib/auth-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { SAM_LOGO_DATA_URL } from "@/lib/sam-logo";
import { DevotionalStreakBadge } from "@/components/devotional-streak-badge";
import {
  Church,
  LogOut,
  BookOpen,
  Users2,
  Heart,
  DollarSign,
  Compass,
  Home,
  BookmarkCheck,
  BookMarked,
  Megaphone,
  ShieldCheck,
  MapPin,
  Languages,
  HeartHandshake,
  CalendarDays,
  BookText,
  HeartPulse,
  LineChart,
  Building,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  SlidersHorizontal,
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
  const { lang, toggleLang, isEn, t, bilingual } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  // State
  const [campus, setCampus] = useState("Dallas Main Campus");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fontScale, setFontScale] = useState<"normal" | "large" | "xlarge">("normal");

  // Simulated Role Switcher for live testing & evaluation
  const [simulatedRole, setSimulatedRole] = useState<Role | null>(null);

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
      const savedCampus = localStorage.getItem("selected_campus");
      if (savedCampus) setCampus(savedCampus);
      const savedFont = localStorage.getItem("app_font_scale") as "normal" | "large" | "xlarge";
      if (savedFont) {
        setFontScale(savedFont);
        applyFontScale(savedFont);
      }
    }
  }, []);

  const handleCampusChange = (newCampus: string) => {
    setCampus(newCampus);
    if (typeof window !== "undefined") {
      localStorage.setItem("selected_campus", newCampus);
    }
  };

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
            '"Đang chuẩn bị nơi thờ phượng và thông công..."',
            '"Preparing the sanctuary of fellowship and worship..."'
          )}
        </span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Active Effective Role (allows live simulation for demo)
  const currentRole: Role = simulatedRole || user.role;

  const roleLabels: Record<
    Role,
    { titleVi: string; titleEn: string; color: string; badgeVi: string; badgeEn: string }
  > = {
    senior_pastor: {
      titleVi: "Mục Sư Quản Nhiệm (Senior Pastor)",
      titleEn: "Senior Pastor",
      color: "bg-indigo-950 text-amber-300 border-amber-400/40",
      badgeVi: "👑 Mục Sư Quản Nhiệm",
      badgeEn: "👑 Senior Pastor",
    },
    admin: {
      titleVi: "Ban Trị Sự (Admin)",
      titleEn: "Church Admin",
      color: "bg-indigo-900 text-white border-indigo-700",
      badgeVi: "⚙️ Ban Trị Sự",
      badgeEn: "⚙️ Church Admin",
    },
    ministry_leader: {
      titleVi: "Trưởng Ban Mục Vụ (Leader)",
      titleEn: "Ministry Leader",
      color: "bg-amber-100 text-amber-900 border-amber-300",
      badgeVi: "🛡️ Trưởng Ban Mục Vụ",
      badgeEn: "🛡️ Ministry Leader",
    },
    member: {
      titleVi: "Tín Hữu (Disciple Member)",
      titleEn: "Disciple Member",
      color: "bg-emerald-100 text-emerald-900 border-emerald-300",
      badgeVi: "🕊️ Tín Hữu Môn Đồ",
      badgeEn: "🕊️ Disciple Member",
    },
    parent: {
      titleVi: "Phụ Huynh Lớp Thiếu Nhi",
      titleEn: "Kids Ministry Parent",
      color: "bg-rose-100 text-rose-900 border-rose-300",
      badgeVi: "👨‍👩‍👧 Phụ Huynh Thiếu Nhi",
      badgeEn: "👨‍👩‍👧 Kids Parent",
    },
  };

  // Grouped Navigation Sections
  const navSections: NavSection[] = [
    {
      titleVi: "Đời Sống Thuộc Linh",
      titleEn: "Spiritual Life",
      items: [
        {
          href: "/dashboard",
          labelVi: "Bàn Thờ Phượng",
          labelEn: "Worship Sanctuary",
          icon: Home,
        },
        {
          href: "/dashboard/bible",
          labelVi: "Đọc Kinh Thánh Hằng Ngày",
          labelEn: "Daily Bible Reading",
          icon: BookMarked,
        },
        {
          href: "/dashboard/scripture",
          labelVi: "Ghi Nhớ Lời Chúa (SRS)",
          labelEn: "Scripture Memory (SRS)",
          icon: BookmarkCheck,
        },
        {
          href: "/dashboard/prayers",
          labelVi: "Tường Cầu Thay",
          labelEn: "Prayer Wall",
          icon: Heart,
        },
        {
          href: "/dashboard/sermons",
          labelVi: "Ghi Chú Bài Giảng",
          labelEn: "Sermon Vault & Notes",
          icon: BookText,
        },
        {
          href: "/dashboard/pathway",
          labelVi: "Hành Trình Đức Tin",
          labelEn: "Discipleship Pathway",
          icon: Compass,
        },
        {
          href: "/dashboard/courses",
          labelVi: "Môn Đồ Hóa & Bài Giảng",
          labelEn: "Courses & Sunday School",
          icon: BookOpen,
        },
      ],
    },
    {
      titleVi: "Cộng Đồng & Thông Công",
      titleEn: "Community & Fellowship",
      items: [
        {
          href: "/dashboard/groups",
          labelVi: "Nhóm Nhỏ (Life Groups)",
          labelEn: "Small Groups / Life Groups",
          icon: Users2,
        },
        {
          href: "/dashboard/events",
          labelVi: "Lịch Sự Kiện & RSVP",
          labelEn: "Church Calendar & RSVP",
          icon: CalendarDays,
        },
        {
          href: "/dashboard/checkin",
          labelVi: "Điểm Danh Thiếu Nhi",
          labelEn: "Kids Safe Check-in",
          icon: ShieldCheck,
          badgeVi: currentRole === "parent" ? "PIN An Toàn" : undefined,
          badgeEn: currentRole === "parent" ? "Safety PIN" : undefined,
          badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
        },
        {
          href: "/dashboard/communications",
          labelVi: "Bản Tin & SMS Khẩn",
          labelEn: "Church Bulletin & SMS",
          icon: Megaphone,
        },
      ],
    },
    {
      titleVi: "Phụng Sự & Dâng Hiến",
      titleEn: "Service & Stewardship",
      items: [
        {
          href: "/dashboard/giving",
          labelVi: "Dâng Hiến (Stripe & 501c3)",
          labelEn: "Giving & 501(c)(3) Tax",
          icon: DollarSign,
        },
        {
          href: "/dashboard/volunteers",
          labelVi: "Ban Phụng Vụ & Lịch Trực",
          labelEn: "Volunteer Ministries & Roster",
          icon: HeartHandshake,
        },
        {
          href: "/dashboard/facilities",
          labelVi: "Phòng Nhóm & Thiết Bị",
          labelEn: "Facilities & Equipment",
          icon: Building,
          badgeVi:
            currentRole === "senior_pastor" || currentRole === "admin" ? "Duyệt đơn" : undefined,
          badgeEn:
            currentRole === "senior_pastor" || currentRole === "admin" ? "Review" : undefined,
          badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
        },
      ],
    },
    {
      titleVi: "Chỉ Huy & Mục Vụ Cấp Cao",
      titleEn: "Pastoral Leadership",
      items: [
        {
          href: "/dashboard/analytics",
          labelVi: "Bảng Chỉ Huy (Analytics)",
          labelEn: "Executive Health Cockpit",
          icon: LineChart,
          roles: ["senior_pastor", "admin", "ministry_leader"],
        },
        {
          href: "/dashboard/pastoral",
          labelVi: "Sổ Chăm Sóc & Gia Đình",
          labelEn: "Pastoral Care & Households",
          icon: HeartPulse,
          badgeVi:
            currentRole === "senior_pastor" || currentRole === "admin"
              ? "! Khẩn cấp"
              : undefined,
          badgeEn:
            currentRole === "senior_pastor" || currentRole === "admin"
              ? "! Urgent"
              : undefined,
          badgeColor: "bg-red-100 text-red-800 border-red-300 animate-pulse",
          roles: ["senior_pastor", "admin", "ministry_leader"],
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
                <div className="w-9 h-9 rounded-xl bg-white border border-amber-300/80 p-1 flex items-center justify-center shrink-0 shadow-2xs">
                  <img
                    src={SAM_LOGO_DATA_URL}
                    alt="SAM - Spiritual Advance Ministry"
                    className="w-7 h-7 object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-scripture text-base font-bold text-slate-900 tracking-tight leading-none">
                    SAM <span className="text-xs font-serif font-normal text-amber-900">• saministry</span>
                  </span>
                  <span className="text-[10px] tracking-wider uppercase text-amber-800 font-serif mt-0.5">
                    Spiritual Advance Ministry
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

            {/* Quick Role Simulator (Live Role Switcher) */}
            <div className="mt-3.5 pt-3 border-t border-amber-200/50">
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                <span className="font-semibold uppercase tracking-wider flex items-center gap-1 text-amber-900">
                  <SlidersHorizontal className="w-3 h-3 text-amber-700" />
                  {isEn ? "Role Simulator:" : "Góc Nhìn Vai Trò:"}
                </span>
                {simulatedRole && (
                  <button
                    onClick={() => setSimulatedRole(null)}
                    className="text-[10px] text-amber-800 underline hover:text-amber-950"
                  >
                    {isEn ? "Default" : "Mặc định"}
                  </button>
                )}
              </div>
              <select
                value={currentRole}
                onChange={(e) => setSimulatedRole(e.target.value as Role)}
                className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-amber-50/70 border border-amber-300 text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="senior_pastor">{isEn ? "👑 Senior Pastor" : "👑 Mục Sư Quản Nhiệm (Pastor)"}</option>
                <option value="admin">{isEn ? "⚙️ Church Admin" : "⚙️ Ban Trị Sự (Admin)"}</option>
                <option value="ministry_leader">{isEn ? "🛡️ Ministry Leader" : "🛡️ Trưởng Ban Mục Vụ (Leader)"}</option>
                <option value="member">{isEn ? "🕊️ Disciple Member" : "🕊️ Tín Hữu Môn Đồ (Member)"}</option>
                <option value="parent">{isEn ? "👨‍👩‍👧 Kids Ministry Parent" : "👨‍👩‍👧 Phụ Huynh Thiếu Nhi (Parent)"}</option>
              </select>
            </div>
          </div>

          {/* Navigation Items (Scrollable Menu) */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 no-scrollbar">
            {navSections.map((sec, secIdx) => {
              // Filter items by role
              const visibleItems = sec.items.filter((item) => {
                if (!item.roles) return true;
                return item.roles.includes(currentRole);
              });

              if (visibleItems.length === 0) return null;

              return (
                <div key={secIdx} className="space-y-1">
                  <div className="px-3 pb-1">
                    <span className="text-[11px] font-serif font-bold uppercase tracking-wider text-amber-900/90 block">
                      {isEn ? sec.titleEn : sec.titleVi}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    {visibleItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      const label = isEn ? item.labelEn : item.labelVi;
                      const badge = isEn ? (item.badgeEn || item.badgeVi) : item.badgeVi;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                            isActive
                              ? "bg-indigo-950 text-white font-semibold shadow-xs"
                              : "text-slate-700 hover:bg-amber-100/60 hover:text-indigo-950"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <Icon
                              className={`w-4 h-4 shrink-0 transition-colors ${
                                isActive
                                  ? "text-amber-400"
                                  : "text-amber-800 group-hover:text-amber-900"
                              }`}
                            />
                            <span className="truncate">{label}</span>
                          </div>

                          {badge && (
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border shrink-0 ${
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
                <div className="w-8 h-8 rounded-full bg-indigo-950 text-amber-300 font-serif font-bold flex items-center justify-center shrink-0 text-xs">
                  {user.fullName.charAt(0)}
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {user.fullName}
                  </span>
                  <span className="text-[10px] text-amber-800 truncate font-medium">
                    {isEn ? roleLabels[currentRole]?.badgeEn : roleLabels[currentRole]?.badgeVi}
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

            <div className="text-center text-[10px] text-amber-900/60 font-serif italic">
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
              <span className="font-semibold text-slate-900">SAM (saministry)</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-amber-900 font-semibold">
                {isEn ? roleLabels[currentRole]?.titleEn : roleLabels[currentRole]?.titleVi}
              </span>
            </div>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Senior-Friendly Font Size Adjuster (A- / A / A+) */}
            <div
              className="flex items-center rounded-xl bg-amber-50/80 border border-amber-200/80 p-0.5 text-xs font-serif"
              title={isEn ? "Adjust font size" : "Phóng to / Thu nhỏ cỡ chữ cho Mục sư & Tín hữu cao niên"}
            >
              <button
                onClick={() => handleFontScaleChange("normal")}
                className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  fontScale === "normal"
                    ? "bg-white text-indigo-950 shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                A
              </button>
              <button
                onClick={() => handleFontScaleChange("large")}
                className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                  fontScale === "large"
                    ? "bg-white text-indigo-950 shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                A+
              </button>
              <button
                onClick={() => handleFontScaleChange("xlarge")}
                className={`px-2 py-1 rounded-lg text-sm font-semibold transition-all ${
                  fontScale === "xlarge"
                    ? "bg-white text-indigo-950 shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                A++
              </button>
            </div>

            {/* Campus Selector (Multi-Campus) */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs">
              <MapPin className="w-3.5 h-3.5 text-amber-800 shrink-0" />
              <select
                value={campus}
                onChange={(e) => handleCampusChange(e.target.value)}
                className="bg-transparent text-slate-800 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="Dallas Main Campus">Dallas Main</option>
                <option value="Houston Campus">Houston Campus</option>
                <option value="Fort Worth Campus">Fort Worth Campus</option>
                <option value="Austin Campus">Austin Campus</option>
              </select>
            </div>

            {/* Language Switcher (VI / EN) */}
            <button
              onClick={toggleLang}
              title="Chuyển đổi ngôn ngữ / Switch Language (VI ⇄ EN)"
              className="px-2.5 py-1 rounded-xl border border-amber-200/80 bg-white hover:bg-amber-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <Languages className="w-3.5 h-3.5 text-amber-800" />
              <span className="font-bold text-indigo-950">{lang}</span>
              <span className="hidden sm:inline text-[10px] text-slate-500 font-normal">
                ({isEn ? "English" : "Tiếng Việt"})
              </span>
            </button>

            {/* Devotional Habit Streak Flame */}
            <DevotionalStreakBadge />
          </div>
        </header>

        {/* Main Content Viewport */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* Sacred Footer */}
        <footer className="border-t border-amber-200/60 bg-[#FCFBF8] py-6 px-4 text-center text-xs text-slate-500 font-serif">
          <p>{t("footer.benediction")}</p>
        </footer>
      </div>
    </div>
  );
}
