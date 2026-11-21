"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { useLanguage } from "@/lib/i18n/language-context";
import { TactileButton } from "@/components/ui/tactile-button";
import {
  BookOpen,
  GraduationCap,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Compass,
  Award,
  Layers,
  Heart,
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
      titleVi: "Thói Quen Đọc Kinh Thánh & Suy Ngẫm Lời Chúa",
      titleEn: "Spiritual Disciplines: Living Word & Prayer",
      instructor: "Mục sư Jack Lee",
      instructorRoleVi: "Học giả Kinh Thánh • Dallas Theological Fellowship",
      instructorRoleEn: "Biblical Scholar • Dallas Fellowship",
      instructorAvatar: "/people/instructor-2.jpg",
      duration: "4 Tuần (8 Tiết)",
      levelVi: "Thực hành",
      levelEn: "Practical",
      badgeVi: "Khóa Học Miễn Phí",
      badgeEn: "Free Access",
      image: "/covers/bible-habit.svg",
      descVi: "Xây dựng kỷ luật tĩnh nguyện buổi sáng, phương pháp SOAP suy ngẫm Kinh Thánh và thuật toán ngắt quãng ghi nhớ Lời Chúa trọn đời.",
      descEn: "Building sacred morning habits, the SOAP Bible reflection method, and spaced-repetition Scripture memory.",
      highlightsVi: ["Quy trình tĩnh nguyện buổi sáng 30 phút", "Phương pháp SOAP: Đọc, Quan sát, Áp dụng, Cầu nguyện", "Ghi nhớ 52 câu gốc then chốt trong năm"],
      highlightsEn: ["30-minute morning devotional routine", "SOAP Method: Scripture, Observation, Application, Prayer", "Memorizing 52 key memory verses yearly"],
    },
    {
      id: "c3",
      slug: "leadership-foundations",
      category: "leadership",
      titleVi: "Kỹ Năng Lãnh Đạo Nhóm Nhỏ & Chăm Sóc Mục Vụ",
      titleEn: "Small Group Leadership & Pastoral Care",
      instructor: "Cô Zoya Hank & Ban Giảng Huấn SAM",
      instructorRoleVi: "Cố vấn Trường Chúa Nhật & Chăm sóc Hội Thánh",
      instructorRoleEn: "Sunday School & Pastoral Advisor",
      instructorAvatar: "/people/instructor-3.jpg",
      duration: "6 Tuần (12 Tiết)",
      levelVi: "Nâng cao",
      levelEn: "Intermediate",
      badgeVi: "Chứng Chỉ Mục Vụ",
      badgeEn: "Certificate Track",
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
      stage: "I",
      titleVi: "Tân Tín Hữu",
      titleEn: "New Seeker & Believer",
      descVi: "Hiểu rõ phúc âm, xác quyết đức tin nơi Đấng Christ và nhận lễ Báp-têm trong niềm vui trọn vẹn.",
      descEn: "Grasping salvation grace, professing faith in Christ, and stepping forward in baptism.",
    },
    {
      stage: "II",
      titleVi: "Môn Đồ Trưởng Thành",
      titleEn: "Maturing Disciple",
      descVi: "Xây dựng chuỗi tĩnh nguyện hằng ngày, đọc Kinh Thánh trọn bộ và tham gia sinh hoạt nhóm nhỏ.",
      descEn: "Establishing daily devotional streaks, reading the Word, and active life group fellowship.",
    },
    {
      stage: "III",
      titleVi: "Tôi Tớ Phục Sự",
      titleEn: "Serving Minister",
      descVi: "Dấn thân vào các ban ngành: Ban Hát, Trường Chúa Nhật, Tiếp tân, Kỹ thuật và Tường Cầu Thay.",
      descEn: "Active ministry participation in worship, Sunday school, hospitality, tech, and prayer wall.",
    },
    {
      stage: "IV",
      titleVi: "Lãnh Đạo Mục Vụ",
      titleEn: "Pastoral Leader",
      descVi: "Dẫn dắt nhóm tế bào, giảng dạy lời Chúa và nhân rộng thêm nhiều môn đồ mới cho Nước Trời.",
      descEn: "Leading cell groups, teaching the Word faithfully, and multiplying disciples for the Kingdom.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-sacred-parchment text-slate-800">
      <PublicHeader />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-14 space-y-16 sm:space-y-24">
        {/* ============================================================== */}
        {/* 1. HERO SECTION: Lời Chúa & Sứ Mạng Học Viện */}
        {/* ============================================================== */}
        <section className="text-center space-y-4 max-w-3xl mx-auto pt-2 sm:pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-800 text-xs font-semibold uppercase tracking-wider shadow-xs">
            <GraduationCap className="w-3.5 h-3.5 text-primary-800 shrink-0" />
            <span>{bilingual("Học Viện Môn Đồ Hóa SAM", "SAM Discipleship Academy")}</span>
          </div>

          <h1 className="font-scripture text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight [text-wrap:balance]">
            {bilingual("Chương Trình Đào Tạo & Môn Đồ Hóa", "Equipping Servants Through Sound Curriculum")}
          </h1>

          <div className="border-y border-amber-200/80 py-3 my-2 max-w-2xl mx-auto">
            <p className="text-sm sm:text-base text-slate-700 font-serif italic leading-relaxed [text-wrap:pretty]">
              {bilingual(
                '"Những điều con đã nghe nơi ta ở trước mặt nhiều người chứng, hãy giao phó cho mấy người trung thành, cũng có tài dạy dỗ kẻ khác." — II Ti-mô-thê 2:2',
                '"And the things you have heard me say in the presence of many witnesses entrust to reliable people who will also be qualified to teach others." — 2 Timothy 2:2'
              )}
            </p>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 2. BỘ LỌC CHỦ ĐỀ KHÓA HỌC (Interactive Category Filter) */}
        {/* ============================================================== */}
        <section className="space-y-8">
          <h2 className="sr-only">
            {bilingual("Danh Sách Khóa Học Tuyển Chọn", "Curated Discipleship Courses Catalog")}
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {categories.map((cat) => {
              const isSelected = filter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer min-h-[44px] ${
                    isSelected
                      ? "bg-primary-700 text-white shadow-xs"
                      : "bg-white border border-amber-200/90 text-slate-700 hover:bg-primary-50 hover:text-primary-700"
                  }`}
                >
                  {isEn ? cat.labelEn : cat.labelVi}
                </button>
              );
            })}
          </div>

          {/* Lưới danh sách khóa học phong phú */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-3xl border border-amber-200/90 shadow-sm hover:border-primary-600 transition-all overflow-hidden flex flex-col justify-between group text-left"
              >
                <div>
                  {/* Bìa khóa học chuẩn tỷ lệ */}
                  <div className="relative aspect-[16/10] w-full bg-amber-50 border-b border-amber-100 overflow-hidden">
                    <Image
                      src={course.image}
                      alt={course.titleVi}
                      fill
                      className="object-cover group-hover:scale-104 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-primary-800 border border-amber-200 shadow-xs">
                      {isEn ? course.badgeEn : course.badgeVi}
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Thời lượng & Cấp độ */}
                    <div className="flex items-center justify-between text-xs text-slate-500 font-sans">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-primary-700 shrink-0" />
                        <span>{course.duration}</span>
                      </span>
                      <span className="text-primary-800 font-bold bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-200">
                        {isEn ? course.levelEn : course.levelVi}
                      </span>
                    </div>

                    {/* Tiêu đề khóa học */}
                    <h3 className="font-scripture text-xl font-bold text-slate-900 group-hover:text-primary-700 transition-colors leading-snug [text-wrap:balance]">
                      {isEn ? course.titleEn : course.titleVi}
                    </h3>

                    {/* Giảng viên & Chân dung thật */}
                    <div className="flex items-center gap-3 pt-1 border-t border-amber-100">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden border border-amber-300 shrink-0">
                        <Image
                          src={course.instructorAvatar}
                          alt={course.instructor}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block font-serif">
                          {course.instructor}
                        </span>
                        <span className="text-xs text-slate-500 line-clamp-1">
                          {isEn ? course.instructorRoleEn : course.instructorRoleVi}
                        </span>
                      </div>
                    </div>

                    {/* Mô tả tóm lược */}
                    <p className="text-xs text-slate-700 leading-relaxed font-sans line-clamp-3 [text-wrap:pretty]">
                      {isEn ? course.descEn : course.descVi}
                    </p>

                    {/* Điểm nhấn giáo trình */}
                    <div className="space-y-1.5 pt-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-serif block">
                        {bilingual("Trọng Tâm Bài Học:", "Key Competencies:")}
                      </span>
                      {(isEn ? course.highlightsEn : course.highlightsVi).map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary-700 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Nút hành động */}
                <div className="p-6 pt-0 border-t border-amber-100/60 mt-4">
                  <Link href="/dashboard" className="block w-full pt-4">
                    <TactileButton variant="primary" size="md" withCross className="w-full justify-center">
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
        {/* 3. LỘ TRÌNH MÔN ĐỒ HÓA 4 BƯỚC (The 4-Stage Discipleship Pathway) */}
        {/* ============================================================== */}
        <section className="bg-white rounded-3xl border-2 border-amber-300/80 p-8 sm:p-12 shadow-md space-y-8 text-left">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="font-scripture text-3xl sm:text-4xl font-bold text-slate-900 [text-wrap:balance]">
              {bilingual("Lộ Trình Môn Đồ Hóa 4 Giai Đoạn", "The 4-Stage Discipleship Pathway")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-sans [text-wrap:pretty]">
              {bilingual(
                "Một lộ trình đào tạo có hệ thống giúp con cái Chúa từ bước đầu tin nhận cho đến khi trở thành người phục sự trung tín và dẫn dắt người khác.",
                "A structured formation pathway guiding believers from first salvation to faithful servant leadership."
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            {pathwayStages.map((st, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-sacred-card border border-amber-200/80 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-200 flex items-center justify-center font-scripture text-xl font-black text-primary-700">
                    {st.stage}
                  </div>
                  <h3 className="font-scripture text-lg font-bold text-slate-900">
                    {isEn ? st.titleEn : st.titleVi}
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans [text-wrap:pretty]">
                    {isEn ? st.descEn : st.descVi}
                  </p>
                </div>
                <div className="pt-2">
                  <span className="text-xs font-bold text-primary-800 uppercase font-serif tracking-wider">
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
