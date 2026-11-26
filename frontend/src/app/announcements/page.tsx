"use client";

import React from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { FixedWorldMapBackground } from "@/components/fixed-world-map-background";
import { useLanguage } from "@/lib/i18n/language-context";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  Calendar,
  Sparkles,
  ChevronRight,
  Flame,
  Mail,
  Send,
} from "lucide-react";

export default function AnnouncementsPage() {
  const { isEn, bilingual } = useLanguage();

  const newsList = [
    {
      id: "a1",
      date: "08/11/2026",
      categoryVi: "Thông Báo Khóa Học",
      categoryEn: "Course Updates",
      titleVi: "Khai Giảng Khóa Học Môn Đồ Hóa Nền Tảng (Discipleship 101) Khóa Mùa Đông",
      titleEn: "Winter Enrollment Now Open for Discipleship 101",
      summaryVi: "Khóa học 8 tuần trực tuyến trang bị giáo lý nền tảng và thói quen thuộc linh cho tân tín hữu và người phục sự. Đăng ký nhận tài liệu miễn phí.",
      summaryEn: "An 8-week structured online course equipping foundational doctrine and holy disciplines for emerging disciples.",
      author: "Ban Đào Tạo SAM",
      numeral: "I",
    },
    {
      id: "a2",
      date: "01/11/2026",
      categoryVi: "Bản Tin Mục Vụ",
      categoryEn: "Ministry Bulletin",
      titleVi: "Bản Tin Tuần Soli Deo Gloria & Báo Cáo Tài Chính Minh Bạch Quý 3",
      titleEn: "Soli Deo Gloria Weekly Bulletin & Q3 Financial Report",
      summaryVi: "Tổng kết các sự kiện bồi linh, báo cáo ngân quỹ dâng hiến và kế hoạch trao học bổng cho các học viên thần học trong niên khóa mới.",
      summaryEn: "Summary of discipleship milestones, financial stewardship transparency, and scholarship distribution.",
      author: "Ban Trị Sự SAM",
      numeral: "II",
    },
    {
      id: "a3",
      date: "25/10/2026",
      categoryVi: "Hiệp Nguyện Khẩn Cấp",
      categoryEn: "Urgent Intercession",
      titleVi: "Chiến Dịch 21 Ngày Cầu Nguyện Phục Hưng Gia Đình & Hội Thánh",
      titleEn: "21 Days of Fasting & Prayer for Family Revival",
      summaryVi: "Kêu gọi toàn thể con dân Chúa trong mạng lưới SAM cùng hiệp ý cầu nguyện mỗi 6:00 AM cho sự hiệp một, chữa lành và phục hưng đời sống đức tin.",
      summaryEn: "Inviting all SAM disciples to join in corporate morning prayer for family restoration and spiritual awakening.",
      author: "Ban Cầu Thay SAM",
      numeral: "III",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col relative text-slate-800 bg-transparent">
      <FixedWorldMapBackground />
      <PublicHeader />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-14 space-y-12 sm:space-y-16">
        {/* Breadcrumb Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/20 animate-fade-in text-white">
          <Breadcrumb
            items={[
              { label: bilingual("Bản Tin & Thông Báo", "Ministry Bulletin & Announcements") },
            ]}
          />
          <span className="text-xs text-amber-200/90 font-serif italic hidden sm:inline">
            {bilingual("Cập nhật hoạt động & lịch hiệp nguyện", "Latest ministry programs & prayer gatherings")}
          </span>
        </div>

        {/* ============================================================== */}
        {/* 1. EDITORIAL HEADER DIRECTLY ON MAP (No enclosing box) */}
        {/* ============================================================== */}
        <section className="text-center space-y-3 animate-fade-in">
          <div className="inline-flex items-center gap-2 text-amber-300 font-serif text-xs uppercase tracking-widest">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>{bilingual("Tiếng Kèn Thức Tỉnh & Thông Điệp Mục Vụ", "Ministry Bulletin & Holy Herald")}</span>
          </div>

          <h1 className="font-scripture text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-md [text-wrap:balance]">
            {bilingual("Bản Tin & Thông Báo Mục Vụ", "Ministry Announcements & Bulletins")}
          </h1>

          <p className="text-sm sm:text-base text-amber-100/90 font-serif italic max-w-2xl mx-auto drop-shadow-xs">
            {bilingual(
              "\"Người mang tin lành, rao sự bình an, đem tin tốt lành của ơn phước... thật tốt đẹp dường nào trên các núi!\" — Ê-sai 52:7",
              "\"How beautiful on the mountains are the feet of those who bring good news, who proclaim peace!\" — Isaiah 52:7"
            )}
          </p>
        </section>

        {/* ============================================================== */}
        {/* 2. ARCHITECTURAL TIMELINE WITH SCALLOPED CATHEDRAL ARCH CARDS */}
        {/* ============================================================== */}
        <section className="space-y-8 relative text-left">
          {/* Vertical gold timeline stem (desktop only) */}
          <div className="hidden sm:block absolute left-8 top-6 bottom-6 w-0.5 bg-gradient-to-b from-amber-400 via-amber-300/40 to-transparent -z-1" />

          {newsList.map((item, idx) => (
            <article
              key={item.id}
              className="relative flex flex-col sm:flex-row items-start gap-6 group animate-fade-up"
              style={{ animationDelay: `${(idx + 1) * 100}ms` }}
            >
              {/* Circular Roman Numeral Node */}
              <div className="hidden sm:flex w-16 h-16 rounded-full bg-slate-950/90 backdrop-blur-md border-2 border-amber-400 text-amber-300 font-scripture font-bold text-lg items-center justify-center shrink-0 shadow-xl group-hover:scale-110 group-hover:border-amber-300 transition-all">
                {item.numeral}
              </div>

              {/* Scalloped Cathedral Arch Card */}
              <div className="flex-1 rounded-tr-[44px] rounded-bl-[44px] rounded-tl-2xl rounded-br-2xl bg-white/92 backdrop-blur-xl border border-white/80 p-6 sm:p-9 shadow-2xl hover:shadow-primary-900/20 hover:-translate-y-1 transition-all duration-300 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-primary-50 text-primary-800 border border-primary-200">
                    {isEn ? item.categoryEn : item.categoryVi}
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-500 font-mono text-xs font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-primary-700" />
                    <span>{item.date}</span>
                  </span>
                </div>

                <h2 className="font-scripture text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-primary-700 transition-colors leading-snug [text-wrap:balance]">
                  {isEn ? item.titleEn : item.titleVi}
                </h2>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans [text-wrap:pretty]">
                  {isEn ? item.summaryEn : item.summaryVi}
                </p>

                <div className="pt-3 border-t border-amber-100 flex items-center justify-between text-xs">
                  <span className="text-amber-900 font-serif italic">
                    {bilingual("Nguồn: ", "Source: ")}
                    <span className="font-bold">{item.author}</span>
                  </span>

                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1 text-primary-700 font-bold hover:underline"
                  >
                    <span>{bilingual("Liên hệ ban mục vụ", "Contact ministry")}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* ============================================================== */}
        {/* 3. FELLOWSHIP NEWSLETTER RIBBON (Floating pill) */}
        {/* ============================================================== */}
        <section className="rounded-full bg-slate-950/60 backdrop-blur-xl border border-white/20 px-6 sm:px-10 py-5 text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-2xl animate-fade-up">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 text-amber-300 flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-scripture text-base sm:text-lg font-bold text-white">
                {bilingual("Đăng Ký Nhận Bản Tin Mục Vụ Hằng Tuần", "Subscribe to Weekly Ministry Updates")}
              </h3>
              <p className="text-xs text-slate-300">
                {bilingual("Nhận bài đọc bồi linh và lịch hiệp nguyện trực tiếp qua email", "Receive spiritual reflections and intercession schedules directly in your inbox")}
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-primary-600 to-amber-600 hover:from-primary-500 hover:to-amber-500 text-white text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{bilingual("Đăng Ký Miễn Phí", "Subscribe Free")}</span>
          </Link>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
