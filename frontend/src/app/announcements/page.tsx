"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { useLanguage } from "@/lib/i18n/language-context";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  Bell,
  Calendar,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Megaphone,
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
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5]">
      <PublicHeader />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
        {/* Breadcrumb Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200/80 animate-fade-in">
          <Breadcrumb
            items={[
              { label: bilingual("Bản Tin & Thông Báo Mục Vụ", "Ministry Announcements") },
            ]}
          />
          <span className="text-xs text-slate-500 font-serif italic hidden sm:inline">
            {bilingual("Cập nhật hoạt động & lịch hiệp nguyện", "Latest ministry programs & prayer gatherings")}
          </span>
        </div>

        {/* News List */}
        <section className="space-y-4 max-w-4xl mx-auto">
          {newsList.map((item, idx) => (
            <article
              key={item.id}
              className="p-6 bg-white rounded-2xl border border-amber-200/80 shadow-2xs reverent-card-hover space-y-3 animate-fade-up"
              style={{ animationDelay: `${(idx + 1) * 75}ms` }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FEF5EE] text-[#F17F34] border border-[#F17F34]/30">
                  {isEn ? item.categoryEn : item.categoryVi}
                </span>
                <span className="flex items-center gap-1 text-slate-500 font-mono text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-amber-800" />
                  <span>{item.date}</span>
                </span>
              </div>

              <h2 className="font-scripture text-xl font-bold text-slate-900 hover:text-[#F17F34] transition-colors leading-snug">
                {isEn ? item.titleEn : item.titleVi}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                {isEn ? item.summaryEn : item.summaryVi}
              </p>

              <div className="pt-2 border-t border-amber-100 flex items-center justify-between text-xs">
                <span className="text-amber-900 font-serif italic">
                  {bilingual("Nguồn: ", "Source: ")}
                  <span className="font-bold">{item.author}</span>
                </span>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1 text-[#F17F34] font-semibold hover:underline"
                >
                  <span>{bilingual("Liên hệ ban mục vụ", "Contact ministry")}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
