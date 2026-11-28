"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { FixedWorldMapBackground } from "@/components/fixed-world-map-background";
import { useLanguage } from "@/lib/i18n/language-context";
import { TactileButton } from "@/components/ui/tactile-button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  BookOpen,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function CoursesPage() {
  const { isEn, bilingual } = useLanguage();
  const [filter, setFilter] = useState("all");

  const categories = [
    { id: "all", labelVi: "Tất Cả Các Khóa", labelEn: "All Courses" },
    { id: "beginner", labelVi: "Tân Tín Hữu (Căn bản)", labelEn: "New Believers" },
    { id: "practical", labelVi: "Kỷ Luật Tĩnh Nguyện", labelEn: "Spiritual Habits" },
    { id: "leadership", labelVi: "Lãnh Đạo & Chăm Sóc", labelEn: "Pastoral Leadership" },
  ];

  const courses = [
    {
      id: "c1",
      slug: "discipleship-101",
      category: "beginner",
      titleVi: "Môn Đồ Hóa Nền Tảng (Discipleship 101)",
      titleEn: "Discipleship 101: Solid Foundation in Christ",
      instructor: "Chấp sự Tabitha Nguyen",
      instructorRoleVi: "Chủ tịch SAM • Giảng viên Môn đồ hóa",
      instructorRoleEn: "SAM President • Discipleship Faculty",
      instructorAvatar: "/people/instructor-1.jpg",
      duration: "8 Tuần (16 Tiết)",
      levelVi: "Căn bản",
      levelEn: "Beginner",
      badgeVi: "Đang Chiêu Sinh",
      badgeEn: "Open Enrollment",
      image: "/covers/discipleship-101.svg",
      descVi: "Khóa học trang bị nền tảng đức tin vững chắc cho tân tín hữu và người muốn trở thành người môn đồ trung kiên theo chân Chúa Jesus.",
      descEn: "Equipping new believers and disciples with unwavering spiritual foundation and Christ-centered habits.",
      highlightsVi: ["Khám phá ơn cứu rỗi và bản tính Đức Chúa Trời", "Thực hành cầu nguyện và chiến thắng cám dỗ", "Gắn kết mật thiết với Hội Thánh địa phương"],
      highlightsEn: ["Salvation assurance and God's nature", "Prayer habits and overcoming temptations", "Deep fellowship in local church body"],
    },
    {
      id: "c2",
      slug: "bible-habit",
      category: "practical",
      titleVi: "Thói Quen Thuộc Linh & Lửa Tĩnh Nguyện",
      titleEn: "Spiritual Disciplines & Lifelong Devotion",
      instructor: "Cô Zoya Hank",
      instructorRoleVi: "Cố vấn Kỷ luật Thuộc linh",
      instructorRoleEn: "Spiritual Formation Director",
      instructorAvatar: "/people/instructor-2.jpg",
      duration: "6 Tuần (12 Tiết)",
      levelVi: "Thực hành",
      levelEn: "Practical",
      badgeVi: "Bồi Linh Nổi Bật",
      badgeEn: "Featured",
      image: "/covers/bible-habit.svg",
      descVi: "Xây dựng thói quen đọc Kinh Thánh hằng ngày, kỷ luật kiêng ăn cầu nguyện và áp dụng phương pháp lặp lại ngắt quãng (SRS) để ghi nhớ Lời Chúa.",
      descEn: "Cultivating daily scripture reading, prayerful fasting, and spaced repetition memory habits for spiritual growth.",
      highlightsVi: ["Kế hoạch đọc Kinh Thánh trọn năm có hệ thống", "Ôn luyện câu gốc Lời Chúa mỗi ngày qua thẻ nhớ SRS", "Kỷ luật tĩnh nguyện buổi sáng và ghi chép nhật ký đức tin"],
      highlightsEn: ["Structured one-year Bible reading plan", "Daily Scripture memory with SRS flashcards", "Morning prayer habits and spiritual journaling"],
    },
    {
      id: "c3",
      slug: "leadership-foundations",
      category: "leadership",
      titleVi: "Lãnh Đạo Phục Sự & Quản Lý Nhóm Nhỏ",
      titleEn: "Servant Leadership & Life Group Shepherding",
      instructor: "Mục sư Jack Lee",
      instructorRoleVi: "Cố vấn Giảng huấn Thần học",
      instructorRoleEn: "Pastoral & Theological Faculty",
      instructorAvatar: "/people/instructor-3.jpg",
      duration: "10 Tuần (20 Tiết)",
      levelVi: "Nâng cao",
      levelEn: "Advanced",
      badgeVi: "Đào Tạo Lãnh Đạo",
      badgeEn: "Leadership",
      image: "/covers/leadership-foundations.svg",
      descVi: "Huấn luyện kỹ năng điều phối buổi nhóm tế bào, giải quyết xung đột trong yêu thương và thăm viếng chăm sóc con chiên theo tinh thần đầy tớ khiêm nhường.",
      descEn: "Empowering cell leaders with group dynamics, conflict resolution, and caring shepherd mentorship.",
      highlightsVi: ["Kỹ năng điều phối câu hỏi thảo luận Kinh Thánh", "Thăm viếng và cầu thay cho tín hữu yếu đuối", "Nhân rộng và đào tạo người lãnh đạo kế thừa"],
      highlightsEn: ["Facilitating biblical group discussions", "Pastoral home visits and absentee care", "Mentoring and raising next-generation leaders"],
    },
  ];

  const filteredCourses = courses.filter((c) => {
    if (filter === "all") return true;
    return c.category === filter;
  });

  const pathwayStages = [
    {
      stage: "1",
      titleVi: "Tân Tín Hữu",
      titleEn: "New Seeker & Believer",
      descVi: "Hiểu rõ phúc âm, xác quyết đức tin nơi Đấng Christ và nhận lễ Báp-têm trong niềm vui trọn vẹn.",
      descEn: "Grasping salvation grace, professing faith in Christ, and stepping forward in baptism.",
    },
    {
      stage: "2",
      titleVi: "Môn Đồ Trưởng Thành",
      titleEn: "Maturing Disciple",
      descVi: "Xây dựng chuỗi tĩnh nguyện hằng ngày, đọc Kinh Thánh trọn bộ và tham gia sinh hoạt nhóm nhỏ.",
      descEn: "Establishing daily devotional streaks, reading the Word, and active life group fellowship.",
    },
    {
      stage: "3",
      titleVi: "Tôi Tớ Phục Sự",
      titleEn: "Serving Minister",
      descVi: "Dấn thân vào các ban ngành: Ban Hát, Trường Chúa Nhật, Tiếp tân, Kỹ thuật và Tường Cầu Thay.",
      descEn: "Active ministry participation in worship, Sunday school, hospitality, tech, and prayer wall.",
    },
    {
      stage: "4",
      titleVi: "Lãnh Đạo Mục Vụ",
      titleEn: "Pastoral Leader",
      descVi: "Dẫn dắt nhóm tế bào, giảng dạy lời Chúa và nhân rộng thêm nhiều môn đồ mới cho Nước Trời.",
      descEn: "Leading cell groups, teaching the Word faithfully, and multiplying disciples for the Kingdom.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col relative text-slate-800 bg-transparent">
      <FixedWorldMapBackground />
      <PublicHeader />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-16 space-y-16 sm:space-y-20">
        {/* Breadcrumb Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/20 animate-fade-in text-white">
          <Breadcrumb
            items={[
              { label: bilingual("Khóa Học & Giáo Trình Môn Đồ Hóa", "Discipleship Courses") },
            ]}
          />
          <span className="text-xs text-amber-200/90 font-serif italic hidden sm:inline">
            {bilingual("Chương trình đào tạo tôi tớ Chúa & người phục sự", "Equipping faithful servants through sound curriculum")}
          </span>
        </div>

        {/* ============================================================== */}
        {/* 1. BỘ LỌC CHỦ ĐỀ KHÓA HỌC (Pill Buttons)                       */}
        {/* ============================================================== */}
        <section className="space-y-8 animate-fade-up">
          {/* Bộ lọc dạng Pill mềm mại */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {categories.map((cat) => {
              const isSelected = filter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer min-h-[44px] active:scale-[0.98] ${
                    isSelected
                      ? "bg-primary-600 text-white shadow-md border border-primary-500"
                      : "bg-white/10 hover:bg-white/20 border border-white/30 text-white"
                  }`}
                >
                  {isEn ? cat.labelEn : cat.labelVi}
                </button>
              );
            })}
          </div>

          {/* Lưới danh sách khóa học: Khung Vòm Thánh Đường bo cong tròn đỉnh */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredCourses.map((course, idx) => (
              <div
                key={course.id}
                className="group flex flex-col justify-between overflow-hidden rounded-t-[36px] sm:rounded-t-[48px] rounded-b-2xl sm:rounded-b-3xl bg-slate-950/50 backdrop-blur-xl border border-white/20 hover:border-amber-400/50 shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left text-white animate-fade-up"
                style={{ animationDelay: `${(idx + 1) * 75}ms` }}
              >
                <div>
                  {/* Bìa khóa học Khung Vòm Thánh Đường */}
                  <div className="relative aspect-[16/10] w-full rounded-t-[32px] sm:rounded-t-[44px] overflow-hidden bg-slate-900 border-b border-white/10">
                    <Image
                      src={course.image}
                      alt={course.titleVi}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-amber-300 border border-white/20 shadow-xs">
                      {isEn ? course.badgeEn : course.badgeVi}
                    </div>
                  </div>

                  <div className="p-5 sm:p-7 space-y-4">
                    {/* Thời lượng & Cấp độ */}
                    <div className="flex items-center justify-between text-xs text-slate-400 font-sans">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{course.duration}</span>
                      </span>
                      <span className="text-amber-300 font-bold bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
                        {isEn ? course.levelEn : course.levelVi}
                      </span>
                    </div>

                    {/* Tiêu đề khóa học */}
                    <h2 className="font-scripture text-xl font-bold text-white group-hover:text-amber-300 transition-colors leading-snug [text-wrap:balance]">
                      {isEn ? course.titleEn : course.titleVi}
                    </h2>

                    {/* Giảng viên & Chân dung thật dạng huy hiệu tròn */}
                    <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400/80 shrink-0 shadow-xs">
                        <Image
                          src={course.instructorAvatar}
                          alt={course.instructor}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block font-serif">
                          {course.instructor}
                        </span>
                        <span className="text-xs text-slate-300 line-clamp-1">
                          {isEn ? course.instructorRoleEn : course.instructorRoleVi}
                        </span>
                      </div>
                    </div>

                    {/* Mô tả tóm lược */}
                    <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-2 [text-wrap:pretty]">
                      {isEn ? course.descEn : course.descVi}
                    </p>
                  </div>
                </div>

                {/* Nút hành động */}
                <div className="p-5 sm:p-7 pt-0 border-t border-white/10 mt-4">
                  <Link href="/dashboard" className="block w-full pt-4">
                    <TactileButton variant="primary" size="md" withCross className="w-full justify-center rounded-full">
                      <span>{bilingual("Vào Lớp Học Ngay", "Enroll in Course")}</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </TactileButton>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 2. LỘ TRÌNH MÔN ĐỒ HÓA 4 BƯỚC (TẤM PHÙ ĐIÊU KÍNH TỐI MÀU)        */}
        {/* ============================================================== */}
        <section className="bg-slate-950/50 backdrop-blur-xl rounded-3xl sm:rounded-[48px] p-5 sm:p-10 lg:p-14 border border-white/20 text-white shadow-2xl space-y-8 text-left">
          <div className="border-b border-white/20 pb-4">
            <p className="text-xs font-semibold text-amber-300 font-serif uppercase tracking-widest">
              {bilingual(
                "Từ Tân Tín Hữu Đến Người Phục Sự Trung Tín Của Đấng Christ",
                "From New Believer to Faithful Servant Leader"
              )}
            </p>
            <h2 className="font-scripture text-3xl sm:text-4xl font-bold text-white [text-wrap:balance] mt-1">
              {bilingual("Lộ Trình Môn Đồ Hóa 4 Giai Đoạn", "The 4-Stage Discipleship Pathway")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/20">
            {pathwayStages.map((st, idx) => (
              <div
                key={idx}
                className="py-6 sm:py-0 sm:px-6 first:pl-0 last:pr-0 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <span className="font-scripture text-4xl font-black text-amber-400 block">
                    0{st.stage}.
                  </span>
                  <h3 className="font-scripture text-lg font-bold text-white">
                    {isEn ? st.titleEn : st.titleVi}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans [text-wrap:pretty]">
                    {isEn ? st.descEn : st.descVi}
                  </p>
                </div>
                <div className="pt-3 border-t border-white/15">
                  <span className="text-[11px] font-bold text-amber-300 uppercase font-serif tracking-wider">
                    {bilingual(`Giai Đoạn ${st.stage}`, `Stage ${st.stage}`)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
