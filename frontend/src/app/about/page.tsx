"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { FixedWorldMapBackground } from "@/components/fixed-world-map-background";
import { useLanguage } from "@/lib/i18n/language-context";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Compass, Award } from "lucide-react";

export default function AboutPage() {
  const { isEn, bilingual } = useLanguage();

  const leadership = [
    {
      name: "Tabitha Nguyen",
      roleVi: "Chủ Tịch & Người Sáng Lập SAM",
      roleEn: "Founding President, Spiritual Advance Ministry",
      bioVi: "Khởi xướng Spiritual Advance Ministry với khải tượng trang bị và nâng tầm các tôi tớ Chúa, kết nối Hội Thánh và mở mang Nước Đức Chúa Trời.",
      bioEn: "Founder of Spiritual Advance Ministry with a vision to equip, elevate servants of God, connect churches, and advance God's Kingdom.",
      image: "/people/instructor-1.jpg",
    },
    {
      name: "Mục sư Jack Lee",
      roleVi: "Cố Vấn Mục Vụ & Giảng Huấn Thần Học",
      roleEn: "Lead Biblical Scholar & Pastoral Advisor",
      bioVi: "Học giả Kinh Thánh với hơn 15 năm kinh nghiệm giải kinh lịch sử - ngữ pháp và đào tạo lãnh đạo mục vụ tại các viện thần học quốc tế.",
      bioEn: "Biblical scholar with 15+ years of expository preaching and ministerial leadership training across global theological institutions.",
      image: "/people/instructor-3.jpg",
    },
    {
      name: "Cô Zoya Hank",
      roleVi: "Cố Vấn Kỷ Luật Thuộc Linh & Gia Đình",
      roleEn: "Spiritual Formation & Discipleship Mentor",
      bioVi: "Chuyên sâu về đào tạo môn đồ hóa, phục hưng gia đình Cơ Đốc và các thực hành kỷ luật tĩnh nguyện hằng ngày.",
      bioEn: "Specializes in discipleship coaching, Christian family restoration, and lifelong spiritual disciplines.",
      image: "/people/instructor-2.jpg",
    },
  ];

  const coreValues = [
    {
      roman: "I",
      titleVi: "Trung Tín Với Lời Đức Chúa Trời",
      titleEn: "Biblical Inerrancy & Integrity",
      descVi: "Kinh Thánh là Lời Đức Chúa Trời trọn vẹn, chân lý bất biến và kim chỉ nam duy nhất cho mọi hoạt động thuộc linh và chức vụ.",
      descEn: "The Holy Scripture is the infallible Word of God, our supreme authority and compass for faith and ministry.",
    },
    {
      roman: "II",
      titleVi: "Môn Đồ Hóa Tận Tâm & Bền Bỉ",
      titleEn: "Passionate Discipleship",
      descVi: "Môn đồ hóa không chỉ là một khóa học ngắn hạn, mà là lối sống đồng đi trọn đời với Đấng Cứu Thế Jesus.",
      descEn: "Discipleship is not a brief program, but a lifelong journey of walking closely with our Lord Jesus Christ.",
    },
    {
      roman: "III",
      titleVi: "Tinh Thần Người Đầy Tớ Khiêm Nhường",
      titleEn: "Servant Leadership",
      descVi: "Lãnh đạo Cơ Đốc noi gương Chúa Jesus rửa chân cho môn đồ, phục sự cộng đồng trong yêu thương và hy sinh.",
      descEn: "Christian leadership follows Jesus's example of washing disciples' feet, serving communities in sacrificial love.",
    },
    {
      roman: "IV",
      titleVi: "Hiệp Một Thân Thể Đấng Christ",
      titleEn: "Kingdom Unity in Christ",
      descVi: "Nối kết các Hội Thánh địa phương, vượt qua ranh giới giáo phái để hiệp sức gây dựng Nước Trời tại Mỹ và toàn cầu.",
      descEn: "Uniting local congregations across denominational lines to co-labor for the advance of God's Kingdom.",
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
              { label: bilingual("Giới Thiệu Về SAM", "About SAM Ministry") },
            ]}
          />
          <span className="text-xs text-amber-200/90 font-serif italic hidden sm:inline">
            {bilingual("Khải tượng, sứ mạng & ban giảng huấn", "Calling, mandate & servant leadership")}
          </span>
        </div>

        {/* ============================================================== */}
        {/* 1. CÂU CHUYỆN KHỞI SỰ (Editorial Narrative - Không Hộp Chữ Nhật) */}
        {/* ============================================================== */}
        <section className="space-y-6 text-left animate-fade-up">
          <div className="border-b border-white/20 pb-4">
            <p className="text-xs font-bold text-amber-300 font-serif uppercase tracking-widest">
              {bilingual("Lịch Sử Hình Thành & Tâm Tình Phục Vụ", "Origin & Ministry Heartbeat")}
            </p>
            <h1 className="font-scripture text-3xl sm:text-4xl lg:text-5xl font-bold text-white [text-wrap:balance] drop-shadow-md mt-1">
              {bilingual(
                "Một Khát Vọng Được Nuôi Dưỡng Từ Tình Yêu Với Công Việc Chúa",
                "A Ministerial Journey Rooted in Faithful Kingdom Service"
              )}
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm sm:text-base text-slate-100 leading-relaxed font-serif [text-wrap:pretty]">
            <p className="border-l-3 border-amber-400 pl-4 sm:pl-5 italic bg-slate-950/25 backdrop-blur-xs py-3 rounded-r-xl border-y border-r border-white/10">
              {bilingual(
                "Spiritual Advance Ministry (SAM) được thai nghén từ khát vọng thấy các tôi tớ Chúa, tín hữu và lãnh đạo mục vụ tại Hoa Kỳ cũng như cộng đồng người Việt khắp năm châu được tiếp cận nền giáo dục thần học thực tiễn, tài liệu bồi linh vững chắc và công cụ đồng hành đức tin mỗi ngày.",
                "Spiritual Advance Ministry (SAM) was birthed from the deep desire to see servants of God, disciples, and ministry leaders across the United States and global Vietnamese communities access practical theological education, solid devotional literature, and daily discipleship habits."
              )}
            </p>
            <p className="text-slate-200">
              {bilingual(
                "Trụ sở tại Dallas, Texas, SAM phối hợp với các học giả Kinh Thánh và viện thần học quốc tế để xây dựng hệ thống môn đồ hóa toàn diện. Chúng tôi không chỉ cung cấp giáo trình mà còn tạo dựng một môi trường thông công nâng đỡ, giúp con cái Chúa duy trì kỷ luật tĩnh nguyện, ghi nhớ Lời Chúa và nhân rộng thêm nhiều tôi tớ trung tín.",
                "Headquartered in Dallas, Texas, SAM collaborates with biblical scholars and seminaries to build a comprehensive discipleship ecosystem, fostering persistent spiritual disciplines and multiplying faithful servants of Christ."
              )}
            </p>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 2. TẦM NHÌN & SỨ MẠNG (Tấm Phù Điêu Kính Tối Màu Asymmetrical Plaque) */}
        {/* ============================================================== */}
        <section className="bg-slate-950/50 backdrop-blur-xl rounded-3xl sm:rounded-[48px] p-5 sm:p-10 lg:p-14 border border-white/20 text-white shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/20 text-left">
            <div className="pb-6 md:pb-0 md:pr-10 space-y-3">
              <div className="flex items-center gap-2.5 text-amber-300">
                <Compass className="w-5 h-5 shrink-0" />
                <h2 className="font-scripture text-2xl font-bold text-white">
                  {bilingual("Tầm Nhìn Nước Trời", "Our Kingdom Vision")}
                </h2>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-serif [text-wrap:pretty]">
                {bilingual(
                  "Trở thành trung tâm huấn luyện thuộc linh đáng tin cậy, thắp sáng ngọn lửa phục hưng và đào tạo hàng ngàn người lãnh đạo Cơ Đốc trung kiên, tận hiến và kết quả cho Hội Thánh Đấng Christ.",
                  "To be a trusted global spiritual equipping hub, igniting revival and raising thousands of faithful, fruit-bearing Christian leaders for the Body of Christ."
                )}
              </p>
            </div>

            <div className="pt-6 md:pt-0 md:pl-10 space-y-3">
              <div className="flex items-center gap-2.5 text-amber-300">
                <Award className="w-5 h-5 shrink-0" />
                <h2 className="font-scripture text-2xl font-bold text-white">
                  {bilingual("Sứ Mạng Trang Bị", "Our Equipping Mission")}
                </h2>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-serif [text-wrap:pretty]">
                {bilingual(
                  "Trang bị kiến thức Kinh Thánh chuẩn mực, huấn luyện kỹ năng mục vụ thực tế, tạo dựng môi trường thông công nâng đỡ và duy trì thói quen tĩnh nguyện - cầu thay bền bỉ.",
                  "Equipping sound biblical knowledge, training practical ministerial skills, fostering supportive fellowship, and nurturing persistent prayer and devotional habits."
                )}
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 3. BỐN GIÁ TRỊ CỐT LÕI (Bố Cục Số La Mã Mở - Không Đóng Hộp)   */}
        {/* ============================================================== */}
        <section className="space-y-8 text-left">
          <div className="border-b border-white/20 pb-4">
            <p className="text-xs font-semibold text-amber-300 font-serif uppercase tracking-widest">
              {bilingual("Nguyên Tắc Nền Tảng Dẫn Dắt Mục Vụ", "Foundational Principles Guiding Our Ministry")}
            </p>
            <h2 className="font-scripture text-3xl sm:text-4xl font-bold text-white [text-wrap:balance] drop-shadow-md mt-1">
              {bilingual("Bốn Giá Trị Cốt Lõi Của SAM", "The Four Core Values of SAM")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {coreValues.map((val, idx) => (
              <div key={idx} className="space-y-2 border-t border-white/20 pt-5">
                <div className="flex items-baseline gap-3">
                  <span className="font-scripture text-3xl font-black text-amber-400">
                    {val.roman}.
                  </span>
                  <h3 className="font-scripture font-bold text-white text-lg">
                    {isEn ? val.titleEn : val.titleVi}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans pl-8 [text-wrap:pretty]">
                  {isEn ? val.descEn : val.descVi}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 4. BAN ĐIỀU HÀNH & GIẢNG HUẤN (Khung Vòm Thánh Đường Đỉnh Cong) */}
        {/* ============================================================== */}
        <section className="space-y-8 text-left">
          <div className="border-b border-white/20 pb-4">
            <p className="text-xs font-semibold text-amber-300 font-serif uppercase tracking-widest">
              {bilingual("Đội Ngũ Tôi Tớ Chúa Tận Tụy", "Dedicated Servants of the Lord")}
            </p>
            <h2 className="font-scripture text-3xl sm:text-4xl font-bold text-white [text-wrap:balance] drop-shadow-md mt-1">
              {bilingual("Ban Điều Hành & Giảng Huấn SAM", "Our Leadership & Faculty")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadership.map((person, idx) => (
              <div
                key={idx}
                className="group flex flex-col justify-between overflow-hidden rounded-t-[48px] rounded-b-3xl bg-slate-950/50 backdrop-blur-xl border border-white/20 p-6 sm:p-7 shadow-2xl hover:-translate-y-2 hover:border-amber-400/60 transition-all duration-300 text-white"
              >
                <div className="space-y-4">
                  {/* Khung Vòm Thánh Đường bo cong tròn đỉnh */}
                  <div className="relative aspect-square w-full rounded-t-[40px] rounded-b-2xl overflow-hidden border-2 border-amber-400/80 shadow-sm">
                    <Image
                      src={person.image}
                      alt={person.name}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <h3 className="font-scripture font-bold text-white text-xl">
                      {person.name}
                    </h3>
                    <p className="text-xs font-semibold text-amber-300 font-serif mt-0.5">
                      {isEn ? person.roleEn : person.roleVi}
                    </p>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans [text-wrap:pretty]">
                    {isEn ? person.bioEn : person.bioVi}
                  </p>
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
