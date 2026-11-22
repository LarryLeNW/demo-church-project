"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { BentoCard } from "@/components/ui/bento-card";
import { TactileButton } from "@/components/ui/tactile-button";
import {
  BookOpen,
  Library,
  UserCheck,
  Globe,
  DollarSign,
  LineChart,
  Settings,
  ShieldCheck,
  Database,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Clock,
  Layers,
  Video,
} from "lucide-react";

export default function DashboardAdminPage() {
  const { user } = useAuth();
  const { isEn, bilingual } = useLanguage();

  if (!user) return null;

  const statCards = [
    {
      titleVi: "Khóa Học & Đào Tạo",
      titleEn: "Courses & Training",
      value: "12",
      unitVi: "khóa học",
      unitEn: "courses",
      subVi: "48 bài học video • 2 bản nháp",
      subEn: "48 video lessons • 2 drafts",
      icon: BookOpen,
      href: "/dashboard/courses",
      badgeColor: "bg-amber-100 text-amber-900",
    },
    {
      titleVi: "Thư Viện & Sách Bồi Linh",
      titleEn: "Spiritual Library",
      value: "28",
      unitVi: "tài liệu PDF",
      unitEn: "PDF titles",
      subVi: "1,420 lượt tải • 6 chuyên mục",
      subEn: "1,420 downloads • 6 categories",
      icon: Library,
      href: "/dashboard/library",
      badgeColor: "bg-emerald-100 text-emerald-900",
      isNew: true,
    },
    {
      titleVi: "Người Dùng & Tín Hữu",
      titleEn: "Members & Users",
      value: "156",
      unitVi: "tài khoản",
      unitEn: "accounts",
      subVi: "4 Quản trị viên • 152 Thành viên",
      subEn: "4 Administrators • 152 Members",
      icon: UserCheck,
      href: "/dashboard/users",
      badgeColor: "bg-blue-100 text-blue-900",
    },
    {
      titleVi: "Quỹ Dâng Hiến 501(c)(3)",
      titleEn: "YTD US Giving",
      value: "$42,850",
      unitVi: "YTD Stripe/ACH",
      unitEn: "YTD Stripe/ACH",
      subVi: "100% chuẩn khấu trừ thuế IRS",
      subEn: "100% IRS 501(c)(3) compliant",
      icon: DollarSign,
      href: "/dashboard/giving",
      badgeColor: "bg-purple-100 text-purple-900",
    },
  ];

  const resourceModules = [
    {
      titleVi: "Quản Lý Khóa Học Trực Tuyến",
      titleEn: "Online Course Management",
      descVi: "Tạo và biên tập các khóa học môn đồ hóa, tải lên video bài giảng, sắp xếp bài học và quản lý học viên.",
      descEn: "Create and edit discipleship courses, upload sermon videos, organize curriculum lessons, and monitor learners.",
      icon: BookOpen,
      href: "/dashboard/courses",
      actionVi: "Quản lý khóa học →",
      actionEn: "Manage Courses →",
      badge: "LMS",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    },
    {
      titleVi: "Quản Lý Thư Viện & Sách PDF",
      titleEn: "Library & Book Management",
      descVi: "Tải lên giáo trình bồi linh, tài liệu nghiên cứu thần học, bìa sách và phân loại chủ đề song ngữ Anh - Việt.",
      descEn: "Upload spiritual ebooks, study guides, book covers, and configure bilingual English-Vietnamese metadata.",
      icon: Library,
      href: "/dashboard/library",
      actionVi: "Quản lý thư viện →",
      actionEn: "Manage Library →",
      badge: isEn ? "New" : "Mới",
      badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    },
    {
      titleVi: "Quản Trị Người Dùng & Phân Quyền",
      titleEn: "User Directory & RBAC Governance",
      descVi: "Xem danh sách tài khoản, gán quyền Admin/Leader, đặt lại mật khẩu an toàn và kiểm tra bảo mật truy cập.",
      descEn: "Browse accounts, configure Admin/Leader role permissions, reset passwords, and audit login security.",
      icon: UserCheck,
      href: "/dashboard/users",
      actionVi: "Quản trị người dùng →",
      actionEn: "Manage Users →",
      badge: "RBAC",
      badgeColor: "bg-indigo-100 text-indigo-900 border-indigo-300",
    },
    {
      titleVi: "Cấu Hình Nội Dung Trang Chủ (CMS)",
      titleEn: "Homepage & Website CMS",
      descVi: "Tùy biến banner chính ngoài trang chủ, khẩu hiệu Lời Chúa, khóa học nổi bật, số hotline và thông tin mục vụ.",
      descEn: "Customize public homepage hero banners, scripture slogans, featured courses, contact hotlines, and footer.",
      icon: Globe,
      href: "/dashboard/website-settings",
      actionVi: "Cấu hình trang chủ →",
      actionEn: "Configure Homepage →",
      badge: "CMS",
      badgeColor: "bg-primary-100 text-primary-900 border-primary-300",
    },
    {
      titleVi: "Cài Đặt Hệ Thống & Bảo Mật",
      titleEn: "System Settings & Security",
      descVi: "Cấu hình tích hợp cổng Stripe, email Resend, sao lưu dữ liệu tự động và chính sách bảo mật hệ thống.",
      descEn: "Global system setup: Stripe payment gateway, Resend email service, database backups, and security governance.",
      icon: Settings,
      href: "/dashboard/settings",
      actionVi: "Cài đặt hệ thống →",
      actionEn: "System Settings →",
      badge: isEn ? "System" : "Hệ Thống",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-300",
    },
    {
      titleVi: "Báo Cáo Tài Chính & Dâng Hiến",
      titleEn: "Financials & 501(c)(3) Giving",
      descVi: "Theo dõi dòng tiền dâng hiến Stripe, ACH bank transfer, tự động xuất chứng từ khấu trừ thuế IRS cuối năm.",
      descEn: "Track Stripe giving transactions, ACH transfers, and generate IRS annual tax deduction statements.",
      icon: DollarSign,
      href: "/dashboard/giving",
      actionVi: "Xem báo cáo dâng hiến →",
      actionEn: "View Giving Reports →",
      badge: "IRS 501c3",
      badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
    },
  ];

  const recentActivities = [
    {
      id: "ACT-01",
      actionVi: "Xuất bản khóa học mới: Môn Đồ Hóa Thực Hành - Cấp Độ 1",
      actionEn: "Published new course: Practical Discipleship - Level 1",
      target: "Courses Module",
      user: "Admin",
      time: "2 giờ trước",
      timeEn: "2h ago",
    },
    {
      id: "ACT-02",
      actionVi: "Tải lên sách PDF: Lược Khảo Kinh Thánh Trọn Bộ (Song Ngữ)",
      actionEn: "Uploaded PDF book: Comprehensive Bible Survey (Bilingual)",
      target: "Library Module",
      user: "Admin",
      time: "Hôm qua",
      timeEn: "Yesterday",
    },
    {
      id: "ACT-03",
      actionVi: "Cấu hình cổng thanh toán Stripe & xuất chứng từ thuế 501(c)(3)",
      actionEn: "Configured Stripe payment gateway & 501(c)(3) tax statements",
      target: "Giving Module",
      user: "Admin",
      time: "Hôm qua",
      timeEn: "Yesterday",
    },
    {
      id: "ACT-04",
      actionVi: "Cập nhật thông tin hotline & địa chỉ văn phòng SAM ngoài website",
      actionEn: "Updated hotline phone & office address on public website",
      target: "Website CMS",
      user: "Admin",
      time: "3 ngày trước",
      timeEn: "3 days ago",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Admin Welcome Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-indigo-950 via-slate-900 to-amber-950 text-white rounded-2xl border border-amber-400/30 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs text-amber-300 font-serif uppercase tracking-widest">
            <span>†</span>
            <span>{isEn ? "Spiritual Advance Ministry • Resource Admin Console" : "Spiritual Advance Ministry • Bảng Quản Trị Tài Nguyên"}</span>
          </div>
          <h1 className="font-scripture text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {isEn ? "Welcome, Administrator" : "Kính Chào Ban Quản Trị,"} {user.fullName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-normal leading-relaxed">
            {isEn
              ? "Central management console: Control courses, library books, user accounts, US 501(c)(3) giving, and public website homepage settings."
              : "Bảng chỉ huy quản trị tài nguyên: Kiểm soát toàn diện khóa học, thư viện sách bồi linh, người dùng, tài chính dâng hiến và cấu hình nội dung trang chủ ngoài website."}
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <Link href="/" target="_blank">
            <TactileButton variant="secondary" size="md">
              <ExternalLink className="w-4 h-4 mr-1.5" />
              <span>{isEn ? "View Public Site" : "Xem Trang Chủ"}</span>
            </TactileButton>
          </Link>
          <Link href="/dashboard/website-settings">
            <TactileButton variant="gold" size="md">
              <Globe className="w-4 h-4 mr-1.5" />
              <span>{isEn ? "Homepage CMS" : "Cấu Hình CMS"}</span>
            </TactileButton>
          </Link>
        </div>
      </div>

      {/* 2. Key Resource Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((st, idx) => {
          const Icon = st.icon;
          return (
            <Link
              key={idx}
              href={st.href}
              className="group p-5 bg-white rounded-2xl border border-amber-200/80 shadow-xs hover:border-primary-600 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif font-bold text-slate-700">
                  {isEn ? st.titleEn : st.titleVi}
                </span>
                <div className={`w-8 h-8 rounded-xl ${st.badgeColor} flex items-center justify-center shrink-0`}>
                  <Icon className="w-4 h-4 text-slate-800" />
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 group-hover:text-primary-700 transition-colors">
                  {st.value}
                  <span className="text-xs font-sans font-normal text-slate-500 ml-1.5">
                    {isEn ? st.unitEn : st.unitVi}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 truncate">
                  {isEn ? st.subEn : st.subVi}
                </p>
              </div>

              <div className="pt-2 border-t border-amber-100 flex items-center justify-between text-xs text-primary-700 font-semibold group-hover:translate-x-0.5 transition-transform">
                <span>{bilingual("Vào quản lý →", "Open Module →")}</span>
                {st.isNew && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    NEW
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* 3. Core Resource Management Modules (6 Cards) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-scripture text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="text-primary-700 font-serif">†</span>
            <span>{bilingual("Các Khu Vực Quản Trị Tài Nguyên", "Resource Management Hubs")}</span>
          </h2>
          <span className="text-xs text-slate-500 font-serif">
            {bilingual("Dành riêng cho Ban Quản Trị & Mục Vụ", "Restricted to System Administrators")}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resourceModules.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <div
                key={idx}
                className="p-5 bg-white rounded-2xl border border-amber-200/90 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-primary-700">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${mod.badgeColor}`}>
                      {mod.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-slate-900 text-base">
                      {isEn ? mod.titleEn : mod.titleVi}
                    </h3>
                    <p className="text-xs text-slate-600 font-sans mt-1 leading-relaxed">
                      {isEn ? mod.descEn : mod.descVi}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-amber-100">
                  <Link
                    href={mod.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-700 hover:text-primary-900 transition-colors"
                  >
                    <span>{isEn ? mod.actionEn : mod.actionVi}</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Infrastructure Health & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* System & API Status */}
        <div className="p-5 bg-white rounded-2xl border border-amber-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-primary-700" />
              <h3 className="font-serif font-bold text-slate-900 text-sm">
                {bilingual("Hạ Tầng & Kết Nối API", "System Infrastructure")}
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              {bilingual("Hoạt Động Tốt", "All Systems Live")}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">MySQL Database (Laragon/VPS):</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Connected</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Stripe US 501(c)(3) Gateway:</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ready</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Resend Email Delivery Service:</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Active</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Video CDN & Sermon Vault:</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>High Speed</span>
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-amber-100 text-[11px] text-slate-500 font-serif italic">
            {bilingual(
              "Được bảo mật theo tiêu chuẩn NestJS ESM & JWT Token",
              "Secured by NestJS ESM & JWT Token Authentication"
            )}
          </div>
        </div>

        {/* Recent Admin Activity Log */}
        <div className="lg:col-span-2 p-5 bg-white rounded-2xl border border-amber-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary-700" />
              <h3 className="font-serif font-bold text-slate-900 text-sm">
                {bilingual("Nhật Ký Quản Trị Gần Đây", "Recent Administrative Activity")}
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Real-time log</span>
          </div>

          <div className="divide-y divide-amber-100 text-xs">
            {recentActivities.map((act) => (
              <div key={act.id} className="py-2.5 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="font-medium text-slate-800">
                    {isEn ? act.actionEn : act.actionVi}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="font-semibold text-primary-700">{act.target}</span>
                    <span>•</span>
                    <span>{act.user}</span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 shrink-0">
                  {isEn ? act.timeEn : act.time}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-1 text-center">
            <Link
              href="/dashboard/analytics"
              className="text-xs font-semibold text-primary-700 hover:text-primary-900"
            >
              {bilingual("Xem toàn bộ nhật ký kiểm toán hệ thống →", "View complete system audit log →")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
