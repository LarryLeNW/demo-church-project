"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { useLanguage } from "@/lib/i18n/language-context";
import { TactileButton } from "@/components/ui/tactile-button";
import {
  Heart,
  BookOpen,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Quote,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Flame,
  ShieldCheck,
  GraduationCap,
  Users,
} from "lucide-react";

export default function HomePage() {
  const { isEn, bilingual } = useLanguage();
  const [prayerCount, setPrayerCount] = useState(84);
  const [hasPrayed, setHasPrayed] = useState(false);

  const handlePray = () => {
    if (!hasPrayed) {
      setPrayerCount((prev) => prev + 1);
      setHasPrayed(true);
    }
  };

  const partnerLogos = [
    { name: "Dallas Theological Alliance", src: "/partners/partner-1.svg" },
    { name: "Vietnamese Christian Fellowship", src: "/partners/partner-2.svg" },
    { name: "Grace Heritage Mission", src: "/partners/partner-3.svg" },
    { name: "Faith Equipping Network", src: "/partners/partner-4.svg" },
    { name: "Global Servant Outreach", src: "/partners/partner-5.svg" },
  ];

  const featuredCourses = [
    {
      titleVi: "Nguyên Tắc Môn Đồ Hóa Vững Vàng",
      titleEn: "Foundations of Solid Discipleship",
      authorVi: "Chấp sự Tabitha Nguyen",
      authorEn: "Minister Tabitha Nguyen",
      tagVi: "Giáo Trình Căn Bản",
      tagEn: "Core Syllabus",
      descVi: "Khóa học 8 tuần giúp người học thấu hiểu hành trình theo Chúa và trang bị kỹ năng chăm sóc tân tín hữu.",
      descEn: "An 8-week comprehensive course guiding believers through foundational walk with Christ and pastoral mentoring.",
      cover: "/covers/discipleship-101.svg",
      lessons: "8 Bài Học • 16 Giờ",
    },
    {
      titleVi: "Giải Kinh Học Thực Hành Cho Tôi Tớ Chúa",
      titleEn: "Practical Hermeneutics for Servants",
      authorVi: "Mục sư Jack Lee",
      authorEn: "Pastor Jack Lee",
      tagVi: "Giải Nghĩa Lời Chúa",
      tagEn: "Biblical Exegesis",
      descVi: "Phương pháp đọc hiểu Kinh Thánh theo văn cảnh lịch sử - ngữ pháp và bố cục bài giảng Trường Chúa Nhật.",
      descEn: "Sound principles for understanding scripture within grammatical-historical contexts and sermon structuring.",
      cover: "/covers/leadership-foundations.svg",
      lessons: "12 Bài Học • 24 Giờ",
    },
    {
      titleVi: "Thói Quen Thuộc Linh & Lửa Tĩnh Nguyện",
      titleEn: "Spiritual Disciplines & Devotional Life",
      authorVi: "Ban Giảng Huấn SAM",
      authorEn: "SAM Pastoral Faculty",
      tagVi: "Bồi Linh Thực Tiễn",
      tagEn: "Devotional Growth",
      descVi: "Xây dựng kỷ luật tĩnh nguyện hằng ngày, duy trì đời sống cầu thay và thói quen đọc Kinh Thánh trọn năm.",
      descEn: "Cultivating daily prayer habits, personal devotions, and enduring scripture memory throughout the year.",
      cover: "/covers/bible-habit.svg",
      lessons: "6 Bài Học • 10 Giờ",
    },
  ];

  const testimonies = [
    {
      name: "Mục sư Nguyễn Văn An",
      roleVi: "Quản nhiệm Hội Thánh Dallas, TX",
      roleEn: "Senior Pastor, Dallas Vietnamese Church",
      avatar: "/people/testimonial-jack.jpg",
      fruitVi: "Phục Hưng Ban Điều Hành & Nhóm Nhỏ",
      fruitEn: "Leadership Renewal & Life Groups",
      quoteVi:
        "Tài liệu và giáo trình bồi linh của SAM đã đem lại sinh khí mới cho ban điều hành và các nhóm nhỏ của chúng tôi. Các bài học có chiều sâu giải kinh và ứng dụng thực tiễn cao.",
      quoteEn:
        "SAM materials brought fresh spiritual vigor to our church leadership and life groups with sound biblical depth.",
    },
    {
      name: "Cô Trần Thị Mai",
      roleVi: "Trưởng Ban Trường Chúa Nhật, Garden Grove",
      roleEn: "Sunday School Director, Garden Grove",
      avatar: "/people/testimonial-zasha.jpg",
      fruitVi: "Nền Tảng Dạy Đạo Cho Thế Hệ Trẻ",
      fruitEn: "Fruitful Sunday School Curriculum",
      quoteVi:
        "Thư viện bài giảng và kho sách của SAM là nguồn tư liệu quý báu giúp tôi soạn bài dạy mỗi Chúa Nhật. Các con cái Chúa tiếp thu Lời Chúa rất hào hứng và kết quả.",
      quoteEn:
        "The SAM resource vault is an invaluable blessing for our teachers to prepare inspiring Sunday school lessons.",
    },
    {
      name: "Anh Lê Hoàng Nam",
      roleVi: "Trưởng Ban Thanh Niên, Austin, TX",
      roleEn: "Youth & College Ministry Leader, Austin",
      avatar: "/people/testimonial-frank.jpg",
      fruitVi: "Môn Đồ Hóa Tận Hiến & Khiêm Nhường",
      fruitEn: "Servant Mentorship & Humility",
      quoteVi:
        "Khóa học Môn Đồ Hóa 101 giúp tôi thấu hiểu sứ mạng phục sự khiêm nhường. Tôi học được cách đồng hành và cầu thay cho từng anh em trong nhóm.",
      quoteEn:
        "Discipleship 101 taught our young leaders humble servant leadership and how to mentor brothers and sisters.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-sacred-parchment text-slate-800">
      <PublicHeader />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-14 space-y-20 sm:space-y-28">
        {/* ============================================================== */}
        {/* 1. EDITORIAL SPLIT HERO (Bố cục Báo in / Thánh đường cổ điển) */}
        {/* ============================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center pt-2 sm:pt-4">
          {/* Cột trái: Nội dung tuyên ngôn & Kêu gọi */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-primary-700 shrink-0" />
              <span>{bilingual("Tận Hiến Trang Bị Môn Đồ Chúa", "Equipping Servants of Christ")}</span>
            </div>

            <div className="space-y-4">
              <h1 className="font-scripture text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08] [text-wrap:balance]">
                {bilingual(
                  "Vun Trồng Tôi Tớ Chúa & Nâng Tầm Môn Đồ Hóa",
                  "Cultivating Servants & Elevating Discipleship"
                )}
              </h1>
              <p className="font-serif text-lg sm:text-xl font-bold text-primary-700 tracking-wide">
                Spiritual Advance Ministry (SAM)
              </p>
            </div>

            {/* Khung trích dẫn tuyên ngôn sứ mạng có thanh chỉ viền đôi */}
            <div className="border-l-3 border-primary-700 pl-4 sm:pl-5 py-1 space-y-2">
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-serif italic [text-wrap:pretty]">
                {bilingual(
                  '"Chúng tôi hiện diện để vun trồng, nâng tầm và trang bị cho các tôi tớ Chúa nhằm đem mọi người đến gần Đức Chúa Trời và trở nên những người phục sự trung tín của Ngài."',
                  '"We exist to cultivate, elevate, and equip the servants of God to bring people closer to God and to be His faithful servants."'
                )}
              </p>
              <span className="text-xs text-slate-500 font-sans block">
                {bilingual("Dallas, Texas • Phục sự cộng đồng Cơ Đốc", "Dallas, Texas • Serving Christian Ministries")}
              </span>
            </div>

            {/* Cụm nút CTA dứt khoát */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <TactileButton variant="primary" size="lg" withCross className="w-full sm:w-auto justify-center">
                  <span>{bilingual("Vào Cổng Môn Đồ Hóa", "Enter Discipleship Portal")}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </TactileButton>
              </Link>

              <Link href="/courses" className="w-full sm:w-auto">
                <TactileButton variant="secondary" size="lg" className="w-full sm:w-auto justify-center">
                  <span>{bilingual("Xem Các Khóa Học", "Explore Courses")}</span>
                </TactileButton>
              </Link>
            </div>

            {/* Dấu ấn tín nhiệm & bảo trợ */}
            <div className="pt-4 border-t border-amber-200/60 flex flex-wrap items-center gap-6 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary-700 shrink-0" />
                <span className="font-semibold text-slate-800">IRS 501(c)(3) Phê Chuẩn</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary-700 shrink-0" />
                <span>Giáo trình song ngữ Anh - Việt</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary-700 shrink-0" />
                <span>Hơn 1,200 môn đồ đã được trang bị</span>
              </div>
            </div>
          </div>

          {/* Cột phải: Khung vòm Thánh đường lồng chân dung người thật */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm">
              {/* Cathedral Arch Frame */}
              <div className="rounded-t-[140px] rounded-b-3xl border-3 border-amber-300/80 bg-white p-3 shadow-xl overflow-hidden">
                <div className="relative aspect-[3/4] w-full rounded-t-[128px] rounded-b-2xl overflow-hidden bg-amber-100">
                  <Image
                    src="/people/instructor-1.jpg"
                    alt="Chủ tịch Tabitha Nguyen - Spiritual Advance Ministry"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    priority
                    className="object-cover object-top hover:scale-103 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Nhãn giới thiệu dưới chân ảnh */}
                  <div className="absolute bottom-0 inset-x-0 p-5 pb-6 text-white space-y-1 text-left bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block font-serif">
                      {bilingual("Chủ Tịch Sáng Lập", "Founding President")}
                    </span>
                    <h2 className="font-scripture text-xl sm:text-2xl font-bold leading-tight text-white">
                      Tabitha Nguyen
                    </h2>
                    <p className="text-xs text-slate-200 font-serif">
                      Spiritual Advance Ministry • Dallas, Texas
                    </p>
                  </div>
                </div>
              </div>

              {/* Huy hiệu dấu ấn vàng bên hông vòm (đặt lệch phải, không che text) */}
              <div className="hidden sm:flex absolute -bottom-5 -right-5 bg-white border border-amber-300 rounded-2xl p-3.5 shadow-lg items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-200 flex items-center justify-center text-primary-700 font-serif font-black text-sm shrink-0">
                  SAM
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-900 block font-serif">Soli Deo Gloria</span>
                  <span className="text-xs text-primary-700 font-medium">Khải tượng môn đồ hóa</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 2. DẢI ĐỐI TÁC MỤC VỤ (Partnership Trust Band) */}
        {/* ============================================================== */}
        <section className="py-6 border-y border-amber-200/70 space-y-4 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 font-serif">
            {bilingual(
              "Đồng Hành Cùng Các Đối Tác Mục Vụ & Học Viện Thần Học",
              "Partnering with Christian Ministries & Seminaries"
            )}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-85 hover:opacity-100 transition-opacity">
            {partnerLogos.map((p, idx) => (
              <div key={idx} className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all">
                <div className="relative w-8 h-8 shrink-0">
                  <Image src={p.src} alt={p.name} fill className="object-contain" />
                </div>
                <span className="text-xs font-semibold text-slate-700 font-serif">{p.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 3. GÓC TĨNH NGUYỆN HÔM NAY (Daily Sanctuary Encounter) */}
        {/* ============================================================== */}
        <section className="bg-sacred-card rounded-3xl border-2 border-amber-300/80 p-6 sm:p-10 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-200 pb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-semibold">
              <Flame className="w-4 h-4 text-primary-700 shrink-0" />
              <span>{bilingual("Góc Tĩnh Nguyện & Lời Chúa Hôm Nay", "Daily Devotional Sanctuary")}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600 font-serif">
              <span>{bilingual("Phúc Âm Giăng 3:16", "The Gospel of John 3:16")}</span>
              <span>•</span>
              <span className="text-primary-700 font-semibold">{bilingual("Bản Truyền Thống Hiệu Đính", "ESV")}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Đoạn Lời Chúa với Drop Cap cổ điển */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="flex items-start gap-4">
                <span className="font-scripture text-5xl sm:text-6xl font-black text-primary-700 leading-none shrink-0 select-none">
                  V
                </span>
                <p className="font-serif text-lg sm:text-xl text-slate-900 leading-relaxed italic [text-wrap:pretty]">
                  {bilingual(
                    'ì Đức Chúa Trời yêu thương thế gian, đến nỗi đã ban Con Một của Ngài, hầu cho hễ ai tin Con ấy không bị hư mất mà được sự sống đời đời."',
                    'or God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."'
                  )}
                </p>
              </div>
              <p className="text-xs text-slate-600 font-sans pl-14 sm:pl-16">
                {bilingual(
                  "Lời hứa đời đời về ân điển cứu chuộc và tình yêu vô điều kiện của Đấng Tạo Hóa dành cho mỗi người chúng ta.",
                  "The eternal promise of redeeming grace and unconditional love for every seeking heart."
                )}
              </p>
            </div>

            {/* Khối Hiệp Nguyện sống động với avatar thật */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-amber-200/90 shadow-xs space-y-4 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase font-serif tracking-wider">
                  {bilingual("Tường Cầu Nguyện Hiệp Một", "Prayer Fellowship")}
                </span>
                <span className="text-xs text-primary-700 font-bold bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-200">
                  {prayerCount} {bilingual("lời hiệp nguyện", "prayed")}
                </span>
              </div>

              {/* Avatar stack của các tín hữu đang cùng cầu thay */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2 overflow-hidden">
                  <div className="relative w-7 h-7 rounded-full border-2 border-white overflow-hidden">
                    <Image src="/people/instructor-2.jpg" alt="Member" fill className="object-cover" />
                  </div>
                  <div className="relative w-7 h-7 rounded-full border-2 border-white overflow-hidden">
                    <Image src="/people/testimonial-frank.jpg" alt="Member" fill className="object-cover" />
                  </div>
                  <div className="relative w-7 h-7 rounded-full border-2 border-white overflow-hidden">
                    <Image src="/people/testimonial-jack.jpg" alt="Member" fill className="object-cover" />
                  </div>
                </div>
                <p className="text-xs text-slate-600 font-serif">
                  {bilingual("Các tôi tớ Chúa đang hiệp lòng cầu thay", "Brothers & sisters currently praying")}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  type="button"
                  onClick={handlePray}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[46px] cursor-pointer ${
                    hasPrayed
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                      : "bg-primary-700 hover:bg-primary-800 text-white shadow-xs"
                  }`}
                >
                  {hasPrayed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>{bilingual("Đã Hiệp Nguyện Cùng Thánh Đồ", "Amen • Prayed Together")}</span>
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 text-white fill-white/20" />
                      <span>{bilingual("Tôi Cùng Hiệp Nguyện 🙏", "Join in Prayer 🙏")}</span>
                    </>
                  )}
                </button>

                <Link href="/dashboard/prayers" className="sm:w-auto">
                  <TactileButton variant="secondary" size="sm" className="w-full justify-center">
                    <span>{bilingual("Tường Cầu Thay", "Prayer Wall")}</span>
                  </TactileButton>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 4. KHẢI TƯỢNG MỤC VỤ (Editorial Magazine Layout - Phá vỡ lưới 3 card) */}
        {/* ============================================================== */}
        <section className="space-y-8">
          <div className="border-b border-amber-200 pb-4">
            <h2 className="font-scripture text-3xl sm:text-4xl font-bold text-slate-900 [text-wrap:balance]">
              {bilingual(
                "Ba Trụ Cột Nền Tảng Của Spiritual Advance Ministry",
                "The Three Pillars of Spiritual Advance Ministry"
              )}
            </h2>
            <p className="text-xs font-bold text-primary-700 font-serif uppercase tracking-widest mt-1">
              {bilingual("Khải Tượng Mục Vụ & Đào Tạo Môn Đồ", "Vision, Mandate & Discipleship")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Cột lớn (7 cols): Bài luận sứ mạng kèm chân dung giảng viên */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-amber-200/90 p-6 sm:p-8 flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-500 font-serif tracking-widest uppercase">
                  {bilingual("Tuyên Ngôn Mục Vụ", "Ministry Statement")}
                </span>
                <blockquote className="font-serif text-xl sm:text-2xl font-bold text-slate-900 leading-snug italic [text-wrap:balance]">
                  {bilingual(
                    '"Một Hội Thánh vững mạnh bắt đầu từ những môn đồ có rễ đức tin đâm sâu trong Lời Đức Chúa Trời."',
                    '"A thriving church is built upon disciples deeply rooted in the infallible Word of God."'
                  )}
                </blockquote>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans max-w-2xl [text-wrap:pretty]">
                  {bilingual(
                    "Spiritual Advance Ministry thành lập tại Dallas, Texas nhằm đáp ứng nhu cầu cấp thiết về tài liệu bồi dưỡng lãnh đạo và môn đồ hóa bài bản cho cộng đồng người Việt hải ngoại và trong nước. Chúng tôi cung cấp các chương trình giải kinh trung thực, tài liệu bồi linh sâu sắc và cố vấn thực hành mục vụ cho từng hội thánh địa phương.",
                    "Founded in Dallas, Texas, Spiritual Advance Ministry addresses the urgent need for structured discipleship curriculum and leadership training for Vietnamese congregations globally, delivering rigorous biblical interpretation and hands-on pastoral guidance."
                  )}
                </p>
              </div>

              {/* Chân trang bài luận có ảnh giảng viên */}
              <div className="pt-6 mt-6 border-t border-amber-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border border-amber-300">
                    <Image src="/people/instructor-3.jpg" alt="SAM Faculty" fill className="object-cover" />
                  </div>
                  <div>
                    <span className="font-serif font-bold text-slate-900 text-sm block">Ban Giảng Huấn SAM</span>
                    <span className="text-xs text-primary-700">Dallas Theological Fellowship</span>
                  </div>
                </div>

                <Link href="/about">
                  <TactileButton variant="secondary" size="sm">
                    <span>{bilingual("Đọc Lịch Sử SAM", "About Ministry")}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </TactileButton>
                </Link>
              </div>
            </div>

            {/* Cột nhỏ (5 cols): Danh mục số La Mã I, II, III chạm khắc */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-4">
              <div className="p-5 rounded-2xl bg-sacred-card border border-amber-200/80 shadow-2xs space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-scripture text-2xl font-black text-primary-700">I.</span>
                  <h3 className="font-scripture font-bold text-slate-900 text-base">
                    {bilingual("Tầm Nhìn Nước Trời", "Kingdom Vision")}
                  </h3>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed pl-8 [text-wrap:pretty]">
                  {bilingual(
                    "Thắp sáng ngọn lửa phục hưng tâm linh và xây dựng trung tâm huấn luyện đáng tin cậy cho các Hội Thánh địa phương.",
                    "Igniting persistent spiritual revival and establishing a trusted discipleship hub for local congregations."
                  )}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-sacred-card border border-amber-200/80 shadow-2xs space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-scripture text-2xl font-black text-primary-700">II.</span>
                  <h3 className="font-scripture font-bold text-slate-900 text-base">
                    {bilingual("Sứ Mạng Chuẩn Mực", "Sound Exegesis")}
                  </h3>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed pl-8 [text-wrap:pretty]">
                  {bilingual(
                    "Giáo trình bồi linh chuẩn xác theo văn cảnh lịch sử - ngữ pháp, không thỏa hiệp trước các trào lưu thế tục.",
                    "Sound biblical curriculum preserving theological integrity without secular compromise."
                  )}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-sacred-card border border-amber-200/80 shadow-2xs space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-scripture text-2xl font-black text-primary-700">III.</span>
                  <h3 className="font-scripture font-bold text-slate-900 text-base">
                    {bilingual("Phục Sự Khiêm Nhường", "Servant Leadership")}
                  </h3>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed pl-8 [text-wrap:pretty]">
                  {bilingual(
                    "Tận tâm đồng hành cùng các mục sư, chấp sự và phụ huynh trong công tác nuôi dưỡng thế hệ kế thừa.",
                    "Dedicated mentorship supporting pastors, deacons, and families in raising faithful spiritual successors."
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 5. KHÓA HỌC & BÌA SÁCH THẬT (Showcase Bìa Sách Thật) */}
        {/* ============================================================== */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-200 pb-4">
            <div>
              <h2 className="font-scripture text-3xl sm:text-4xl font-bold text-slate-900 [text-wrap:balance]">
                {bilingual("Các Khóa Học & Giáo Trình Nổi Bật", "Featured Discipleship Courses")}
              </h2>
              <p className="text-xs font-semibold text-primary-700 font-serif uppercase tracking-widest mt-1">
                {bilingual("Tài Liệu Bồi Linh Đầy Đủ Bìa & Đề Cương", "Standardized Curricula & Study Guides")}
              </p>
            </div>

            <Link href="/courses" className="shrink-0">
              <TactileButton variant="secondary" size="sm">
                <span>{bilingual("Xem Tất Cả Khóa Học", "Browse All Courses")}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </TactileButton>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {featuredCourses.map((c, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-amber-200/90 shadow-xs hover:border-primary-600 transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Bìa sách thật có aspect ratio chuẩn sách in */}
                  <div className="relative aspect-[16/10] w-full bg-amber-50 border-b border-amber-100 overflow-hidden">
                    <Image
                      src={c.cover}
                      alt={c.titleVi}
                      fill
                      className="object-cover group-hover:scale-104 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[11px] font-bold text-primary-700 border border-amber-200 shadow-xs">
                      {isEn ? c.tagEn : c.tagVi}
                    </div>
                  </div>

                  <div className="p-6 space-y-3 text-left">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-sans">
                      <span>{c.lessons}</span>
                      <span className="text-primary-700 font-semibold">{isEn ? c.authorEn : c.authorVi}</span>
                    </div>

                    <h3 className="font-scripture text-lg font-bold text-slate-900 group-hover:text-primary-700 transition-colors [text-wrap:balance]">
                      {isEn ? c.titleEn : c.titleVi}
                    </h3>

                    <p className="text-xs text-slate-700 leading-relaxed font-sans line-clamp-3 [text-wrap:pretty]">
                      {isEn ? c.descEn : c.descVi}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href="/courses"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 hover:text-primary-800 hover:underline min-h-[40px]"
                  >
                    <span>{bilingual("Vào Lớp Học Ngay", "Enroll in Course")}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 6. DÂNG HIẾN HOÀNG GIA (Royal Majesty Indigo Accent Section) */}
        {/* ============================================================== */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-amber-400/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-amber-300 text-xs font-semibold border border-amber-300/30">
                <Heart className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>{bilingual("Sứ Mạng Dâng Hiến Mục Vụ", "Ministry Stewardship")}</span>
              </div>

              <h2 className="font-scripture text-3xl sm:text-4xl font-bold text-white [text-wrap:balance]">
                {bilingual(
                  "Đồng Hành Gieo Hạt Giống Nước Trời Cùng SAM",
                  "Partner with SAM to Sow Seeds for Eternity"
                )}
              </h2>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-serif [text-wrap:pretty]">
                {bilingual(
                  "Mọi khoản dâng hiến của quý tôi con Chúa đều được sử dụng minh bạch để tài trợ học bổng môn đồ hóa, in ấn tài liệu Kinh Thánh miễn phí và tổ chức các lớp huấn luyện lãnh đạo. Đầy đủ biên nhận khấu trừ thuế theo quy chuẩn IRS 501(c)(3) tại Hoa Kỳ.",
                  "Your generous contributions are transparently dedicated to discipleship scholarships, theological publications, and ministry workshops. Fully tax-deductible under IRS 501(c)(3) regulations."
                )}
              </p>

              <div className="pt-2">
                <Link href="/give">
                  <TactileButton variant="primary" size="lg" withCross>
                    <span>{bilingual("Dâng Hiến Trực Tuyến (Give Online)", "Make a Donation Today")}</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </TactileButton>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 rounded-2xl bg-white/5 border border-white/15 backdrop-blur-md space-y-4 text-xs text-left">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-bold text-amber-200 uppercase font-serif tracking-wider">
                  {bilingual("Các Quỹ Mục Đích Rõ Ràng", "Designated Ministry Funds")}
                </span>
                <span className="text-[11px] text-amber-300 font-semibold">100% Khấu Trừ Thuế</span>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between">
                  <span className="font-medium text-white">Quỹ Đào Tạo Môn Đồ Hóa</span>
                  <span className="text-xs font-bold text-amber-300">IRS 501(c)(3)</span>
                </div>
                <div className="p-3 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between">
                  <span className="font-medium text-white">Quỹ Học Bổng & Giảng Viên</span>
                  <span className="text-xs font-bold text-amber-300">IRS 501(c)(3)</span>
                </div>
                <div className="p-3 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between">
                  <span className="font-medium text-white">Quỹ In Ấn & Thư Viện Miễn Phí</span>
                  <span className="text-xs font-bold text-amber-300">IRS 501(c)(3)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 7. LỜI CHỨNG MÔN ĐỒ & GƯƠNG MẶT THẬT (Human Testimonials) */}
        {/* ============================================================== */}
        <section className="space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="font-scripture text-3xl sm:text-4xl font-bold text-slate-900 [text-wrap:balance]">
              {bilingual("Bông Trái Thuộc Linh & Lời Chứng", "Spiritual Fruits & Testimonies")}
            </h2>
            <p className="text-xs font-semibold text-primary-700 font-serif">
              {bilingual(
                "Ma-thi-ơ 7:16 • 'Nhờ trái của họ, các ngươi sẽ nhận biết họ'",
                "Matthew 7:16 • 'By their fruit you will recognize them'"
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonies.map((t, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-amber-200/90 p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-6 text-left"
              >
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>{isEn ? t.fruitEn : t.fruitVi}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif italic [text-wrap:pretty]">
                    "{isEn ? t.quoteEn : t.quoteVi}"
                  </p>
                </div>

                <div className="pt-4 border-t border-amber-100 flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber-300 shrink-0">
                    <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-scripture font-bold text-slate-900 text-sm">{t.name}</h3>
                    <p className="text-xs text-primary-700 font-serif">{isEn ? t.roleEn : t.roleVi}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 8. LIÊN HỆ & THĂM VIẾNG MỤC VỤ (Pastoral Directory) */}
        {/* ============================================================== */}
        <section className="bg-white rounded-3xl border border-amber-200/90 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-amber-100 pb-4">
            <div>
              <h2 className="font-scripture text-2xl sm:text-3xl font-bold text-slate-900 [text-wrap:balance]">
                {bilingual("Bạn Cần Cầu Thay Hoặc Kết Nối Mục Vụ?", "Need Prayer or Ministry Partnership?")}
              </h2>
              <p className="text-xs font-semibold text-primary-700 font-serif mt-1">
                {bilingual("Ban Cầu Thay & Thăm Viếng Luôn Sẵn Sàng Lắng Nghe", "Our Pastoral Team Is Here for You")}
              </p>
            </div>

            <Link href="/contact" className="shrink-0">
              <TactileButton variant="primary" size="md">
                <span>{bilingual("Gửi Lời Cầu Thay Ngay", "Send Prayer Request")}</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </TactileButton>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700 text-left">
            <div className="p-4 rounded-xl bg-sacred-card border border-amber-200/60 flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary-700 shrink-0" />
              <div>
                <span className="font-bold block text-slate-900">Hotline Mục Vụ:</span>
                <span>+1 (214) 555-SAM1</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-sacred-card border border-amber-200/60 flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary-700 shrink-0" />
              <div>
                <span className="font-bold block text-slate-900">Email Cầu Thay:</span>
                <span>contact@saministry.org</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-sacred-card border border-amber-200/60 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary-700 shrink-0" />
              <div>
                <span className="font-bold block text-slate-900">{bilingual("Trụ sở:", "Headquarters:")}</span>
                <span>Dallas, TX (USA) & TP.HCM</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
