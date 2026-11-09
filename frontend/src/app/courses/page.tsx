"use client";

import React, { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";

export default function CoursesPage() {
  const { isEn, bilingual } = useLanguage();
  const [filter, setFilter] = useState("all");

  const courses = [
    {
      id: "c1",
      slug: "discipleship-101",
      titleVi: "Môn Đồ Hóa Nền Tảng (Discipleship 101)",
      titleEn: "Discipleship 101: Solid Foundation in Christ",
      instructor: "Tabitha Nguyen",
      duration: "8 Tuần (16 Tiết)",
      levelVi: "Căn bản",
      levelEn: "Beginner",
      badgeVi: "Đang Chiêu Sinh",
      badgeEn: "Open Enrollment",
      image: "/covers/discipleship-101.svg",
      descVi: "Khóa học trang bị nền tảng đức tin vững chắc cho tân tín hữu và người muốn trở thành người môn đồ trung kiên theo chân Chúa Jesus.",
      descEn: "Equipping new believers and disciples with unwavering spiritual foundation and Christ-centered habits.",
    },
    {
      id: "c2",
      slug: "bible-habit",
      titleVi: "Thói Quen Đọc Kinh Thánh & Suy Ngẫm Lời Chúa",
      titleEn: "Spiritual Disciplines: Living Word & Prayer",
      instructor: "Jack Lee",
      duration: "4 Tuần (8 Tiết)",
      levelVi: "Thực hành",
      levelEn: "Practical",
      badgeVi: "Miễn Phí",
      badgeEn: "Free",
      image: "/covers/bible-habit.svg",
      descVi: "Xây dựng kỷ luật tĩnh nguyện buổi sáng, phương pháp SOAP suy ngẫm Kinh Thánh và thuật toán ngắt quãng ghi nhớ Lời Chúa.",
      descEn: "Building sacred morning habits, the SOAP Bible reflection method, and spaced-repetition Scripture memory.",
    },
    {
      id: "c3",
      slug: "leadership-foundations",
      titleVi: "Kỹ Năng Lãnh Đạo Nhóm Nhỏ & Chăm Sóc Mục Vụ",
      titleEn: "Small Group Leadership & Pastoral Care",
      instructor: "Zoya Hank",
      duration: "6 Tuần (12 Tiết)",
      levelVi: "Nâng cao",
      levelEn: "Intermediate",
      badgeVi: "Mục Vụ",
      badgeEn: "Ministry",
      image: "/covers/leadership-foundations.svg",
      descVi: "Huấn luyện kỹ năng điều phối buổi nhóm tế bào, giải quyết xung đột trong yêu thương và thăm viếng chăm sóc con chiên.",
      descEn: "Empowering cell leaders with group dynamics, conflict resolution, and caring shepherd mentorship.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5]">
      <PublicHeader />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 space-y-10">
        <section className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FEF5EE] border border-[#F17F34]/40 text-[#DE6D22] text-xs font-semibold tracking-wider uppercase shadow-xs">
            <GraduationCap className="w-3.5 h-3.5 text-[#F17F34]" />
            <span>{bilingual("Chương Trình Đào Tạo", "Curriculum & Training")}</span>
          </div>
          <h1 className="font-scripture text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {bilingual("Các Khóa Học Bồi Linh & Môn Đồ Hóa", "Christian Discipleship Courses")}
          </h1>
          <p className="text-xs sm:text-base text-slate-700 font-serif italic leading-relaxed">
            {bilingual(
              "Chương trình học tập có hệ thống, linh hoạt trực tuyến và kết hợp nhóm thảo luận thực tế.",
              "Structured syllabus designed for online learning, self-paced progress, and life group discussion."
            )}
          </p>
        </section>

        {/* Course Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-amber-200/80 shadow-2xs hover:border-[#F17F34] hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video bg-slate-900 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.titleVi}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector('.img-fallback')) {
                        const fallback = document.createElement('div');
                        fallback.className = 'img-fallback w-full h-full bg-gradient-to-br from-indigo-950 via-slate-900 to-[#F17F34]/30 flex flex-col items-center justify-center text-amber-300';
                        fallback.innerHTML = '<span class="text-4xl font-serif">†</span><span class="text-xs font-bold mt-1 tracking-wider text-amber-200 uppercase">SAM Academy</span>';
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                  <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F17F34] text-white shadow-xs">
                    {isEn ? course.badgeEn : course.badgeVi}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-800" />
                      <span>{course.duration}</span>
                    </span>
                    <span className="text-amber-900 font-semibold">
                      {isEn ? course.levelEn : course.levelVi}
                    </span>
                  </div>

                  <h3 className="font-scripture text-lg font-bold text-slate-900 leading-snug">
                    {isEn ? course.titleEn : course.titleVi}
                  </h3>

                  <p className="text-xs text-[#DE6D22] font-serif font-medium">
                    {bilingual("Giảng viên: ", "Instructor: ")}
                    <span className="font-bold">{course.instructor}</span>
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-sans">
                    {isEn ? course.descEn : course.descVi}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link href="/dashboard/courses" className="block w-full">
                  <TactileButton variant="primary" size="md" className="w-full justify-center">
                    <span>{bilingual("Vào Học Ngay", "Start Course")}</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </TactileButton>
                </Link>
              </div>
            </div>
          ))}
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
