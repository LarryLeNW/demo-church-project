"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { useLanguage } from "@/lib/i18n/language-context";
import { TactileButton } from "@/components/ui/tactile-button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  Compass,
  Heart,
  Award,
  Users,
  ExternalLink,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Globe2,
} from "lucide-react";

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
    <div className="min-h-screen flex flex-col bg-sacred-parchment text-slate-800">
      <PublicHeader />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12">
        {/* Breadcrumb Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200/80 animate-fade-in">
          <Breadcrumb
            items={[
              { label: bilingual("Giới Thiệu Về SAM", "About SAM Ministry") },
            ]}
          />
          <span className="text-xs text-slate-500 font-serif italic hidden sm:inline">
            {bilingual("Khải tượng, sứ mạng & ban giảng huấn", "Calling, mandate & servant leadership")}
          </span>
        </div>

        {/* ============================================================== */}
        {/* 2. CÂU CHUYỆN KHỞI SỰ (Editorial Narrative Story) */}
        {/* ============================================================== */}
        <section className="p-8 sm:p-12 bg-white rounded-3xl border border-amber-200/90 shadow-sm space-y-8 text-left animate-fade-up delay-75 reverent-card-hover">
          <div className="border-b border-amber-100 pb-4">
            <h2 className="font-scripture text-3xl sm:text-4xl font-bold text-slate-900 [text-wrap:balance]">
              {bilingual(
                "Một Khát Vọng Được Nuôi Dưỡng Từ Tình Yêu Với Công Việc Chúa",
                "A Ministerial Journey Rooted in Faithful Kingdom Service"
              )}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm sm:text-base text-slate-700 leading-relaxed font-serif [text-wrap:pretty]">
            <p className="border-l-3 border-primary-700 pl-4 sm:pl-5 italic">
              {bilingual(
                "Spiritual Advance Ministry (SAM) được thai nghén từ khát vọng thấy các tôi tớ Chúa, tín hữu và lãnh đạo mục vụ tại Hoa Kỳ cũng như cộng đồng người Việt khắp năm châu được tiếp cận nền giáo dục thần học thực tiễn, tài liệu bồi linh vững chắc và công cụ đồng hành đức tin mỗi ngày.",
                "Spiritual Advance Ministry (SAM) was birthed from the deep desire to see servants of God, disciples, and ministry leaders across the United States and global Vietnamese communities access practical theological education, solid devotional literature, and daily discipleship habits."
              )}
            </p>
            <p>
              {bilingual(
                "Trụ sở tại Dallas, Texas, SAM phối hợp với các học giả Kinh Thánh và viện thần học quốc tế để xây dựng hệ thống môn đồ hóa toàn diện. Chúng tôi không chỉ cung cấp giáo trình mà còn tạo dựng một môi trường thông công nâng đỡ, giúp con cái Chúa duy trì kỷ luật tĩnh nguyện, ghi nhớ Lời Chúa và nhân rộng thêm nhiều tôi tớ trung tín.",
                "Headquartered in Dallas, Texas, SAM collaborates with biblical scholars and seminaries to build a comprehensive discipleship ecosystem, fostering persistent spiritual disciplines and multiplying faithful servants of Christ."
              )}
            </p>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 3. TẦM NHÌN & SỨ MẠNG (2 Pillars) */}
        {/* ============================================================== */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="p-8 rounded-3xl bg-sacred-card border-2 border-amber-300/80 shadow-xs space-y-4 reverent-card-hover animate-fade-up delay-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-200 flex items-center justify-center text-primary-700 shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-scripture text-2xl font-bold text-slate-900">
                {bilingual("Tầm Nhìn Nước Trời (Our Vision)", "Our Kingdom Vision")}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans [text-wrap:pretty]">
              {bilingual(
                "Trở thành trung tâm huấn luyện thuộc linh đáng tin cậy, thắp sáng ngọn lửa phục hưng và đào tạo hàng ngàn người lãnh đạo Cơ Đốc trung kiên, tận hiến và kết quả cho Hội Thánh Đấng Christ.",
                "To be a trusted global spiritual equipping hub, igniting revival and raising thousands of faithful, fruit-bearing Christian leaders for the Body of Christ."
              )}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-sacred-card border-2 border-amber-300/80 shadow-xs space-y-4 reverent-card-hover animate-fade-up delay-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-200 flex items-center justify-center text-primary-700 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-scripture text-2xl font-bold text-slate-900">
                {bilingual("Sứ Mạng Trang Bị (Our Mission)", "Our Equipping Mission")}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans [text-wrap:pretty]">
              {bilingual(
                "Trang bị kiến thức Kinh Thánh chuẩn mực, huấn luyện kỹ năng mục vụ thực tế, tạo dựng môi trường thông công nâng đỡ và duy trì thói quen tĩnh nguyện - cầu thay bền bỉ.",
                "Equipping sound biblical knowledge, training practical ministerial skills, fostering supportive fellowship, and nurturing persistent prayer and devotional habits."
              )}
            </p>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 4. GIÁ TRỊ CỐT LÕI (Core Values với số La Mã chạm khắc) */}
        {/* ============================================================== */}
        <section className="bg-white rounded-3xl border border-amber-200/90 p-8 sm:p-12 shadow-sm space-y-8 text-left reverent-card-hover">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="font-scripture text-3xl sm:text-4xl font-bold text-slate-900 [text-wrap:balance]">
              {bilingual("Bốn Giá Trị Cốt Lõi Của SAM", "The Four Core Values of SAM")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 pt-2">
            {coreValues.map((val, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-sacred-card border border-amber-200/80 space-y-3 shadow-2xs reverent-card-hover"
              >
                <div className="flex items-center gap-3">
                  <span className="font-scripture text-2xl font-black text-primary-700">
                    {val.roman}.
                  </span>
                  <h3 className="font-scripture font-bold text-slate-900 text-lg">
                    {isEn ? val.titleEn : val.titleVi}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans pl-8 [text-wrap:pretty]">
                  {isEn ? val.descEn : val.descVi}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 5. BAN LÃNH ĐẠO & GIẢNG HUẤN THẬT (Human Leadership Showcase) */}
        {/* ============================================================== */}
        <section className="space-y-8 text-left">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="font-scripture text-3xl sm:text-4xl font-bold text-slate-900 [text-wrap:balance]">
              {bilingual("Ban Điều Hành & Giảng Huấn SAM", "Our Leadership & Faculty")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadership.map((person, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-amber-200/90 p-6 sm:p-7 shadow-xs reverent-card-hover flex flex-col justify-between space-y-4"
              >
                <div className="space-y-4">
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden border-2 border-amber-300 shadow-2xs">
                    <Image
                      src={person.image}
                      alt={person.name}
                      fill
                      className="object-cover object-top hover:scale-104 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <h3 className="font-scripture font-bold text-slate-900 text-xl">
                      {person.name}
                    </h3>
                    <p className="text-xs font-semibold text-primary-700 font-serif mt-0.5">
                      {isEn ? person.roleEn : person.roleVi}
                    </p>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans [text-wrap:pretty]">
                    {isEn ? person.bioEn : person.bioVi}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 6. ĐỒNG HÀNH CÙNG SỨ MẠNG SAM (Trang Nhã & Kết Nối) */}
        {/* ============================================================== */}
        <section className="p-8 sm:p-12 rounded-3xl bg-sacred-card border border-amber-200/90 shadow-sm space-y-6 text-left reverent-card-hover animate-fade-up">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-xs font-semibold text-primary-700 border border-primary-200">
              <Sparkles className="w-3.5 h-3.5 text-primary-700 shrink-0" />
              <span>{bilingual("Đồng Hành Mục Vụ", "Ministry Fellowship")}</span>
            </div>
            <h3 className="font-scripture text-2xl sm:text-3xl font-bold text-slate-900 [text-wrap:balance]">
              {bilingual(
                "Đồng Hành Cùng Hành Trình Môn Đồ Hóa Của SAM",
                "Join the Discipleship & Equipping Journey With SAM"
              )}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif [text-wrap:pretty]">
              {bilingual(
                "Khám phá các chương trình đào tạo, thư viện bài giảng bồi linh chuẩn mực và kết nối với mạng lưới các tôi tớ Chúa khắp nơi.",
                "Explore structured training curricula, sound theological resources, and fellowship with faithful servants of Christ globally."
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link href="/courses">
              <TactileButton variant="primary" size="md" withCross>
                <span>{bilingual("Khám Phá Các Khóa Học", "Explore Courses")}</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </TactileButton>
            </Link>

            <Link href="/library">
              <TactileButton variant="secondary" size="md">
                <BookOpen className="w-4 h-4 mr-1.5 text-primary-700" />
                <span>{bilingual("Kho Tư Liệu Bồi Linh", "Resource Vault")}</span>
              </TactileButton>
            </Link>

            <a
              href="https://www.facebook.com/saministry.org"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Cộng đồng Facebook SAM (Mở trong tab mới)"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-primary-50 text-slate-800 text-xs font-bold border border-amber-200/90 transition-all shadow-2xs min-h-[48px]"
            >
              <span>{bilingual("Cộng Đồng Facebook SAM", "SAM Facebook Page")}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
