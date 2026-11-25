"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { useLanguage } from "@/lib/i18n/language-context";
import { TactileButton } from "@/components/ui/tactile-button";
import {
  BookOpen,
  ArrowRight,
  Sparkles,
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
          <div className="lg:col-span-7 space-y-6 text-left animate-fade-up">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-700 font-serif flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary-700 shrink-0" />
              <span>{bilingual("Tận Hiến Trang Bị Môn Đồ Chúa", "Equipping Servants of Christ")}</span>
            </p>

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

            {/* Dấu ấn tín nhiệm & bảo trợ (bố cục ngang tự nhiên, không khung hộp) */}
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
          <div className="lg:col-span-5 flex justify-center lg:justify-end animate-fade-up delay-150">
            <div className="relative w-full max-w-sm">
              {/* Cathedral Arch Frame */}
              <div className="rounded-t-[140px] rounded-b-3xl border-3 border-amber-300/80 bg-white p-3 shadow-xl overflow-hidden reverent-card-hover">
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
        {/* 3. GÓC TĨNH NGUYỆN HÔM NAY (Thanh Khiết & Trang Trọng - Không Khung AI) */}
        {/* ============================================================== */}
        <section className="border-y border-amber-200/80 py-10 sm:py-14 space-y-6 text-center max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary-700 font-serif">
            <Flame className="w-4 h-4 text-primary-700 animate-holy-breathe" />
            <span>{bilingual("Lời Chúa Hôm Nay • Góc Tĩnh Nguyện", "Daily Scripture Sanctuary")}</span>
          </div>

          <div className="space-y-4">
            <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl text-slate-900 leading-snug italic max-w-3xl mx-auto [text-wrap:balance]">
              {bilingual(
                "“Vì Đức Chúa Trời yêu thương thế gian, đến nỗi đã ban Con Một của Ngài, hầu cho hễ ai tin Con ấy không bị hư mất mà được sự sống đời đời.”",
                "“For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.”"
              )}
            </blockquote>

            <p className="text-xs sm:text-sm font-semibold text-primary-800 font-serif tracking-wider">
              {bilingual("Phúc Âm Giăng 3:16 • Bản Truyền Thống Hiệu Đính", "The Gospel of John 3:16 • ESV")}
            </p>

            <p className="text-xs text-slate-600 font-sans max-w-xl mx-auto [text-wrap:pretty]">
              {bilingual(
                "Lời hứa đời đời về ân điển cứu chuộc và tình yêu vô điều kiện của Đấng Tạo Hóa dành cho mỗi người chúng ta.",
                "The eternal promise of redeeming grace and unconditional love for every seeking heart."
              )}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link href="/courses">
              <TactileButton variant="primary" size="sm">
                <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                <span>{bilingual("Học Lời Chúa Cùng SAM", "Study God's Word")}</span>
              </TactileButton>
            </Link>
            <Link href="/about">
              <TactileButton variant="secondary" size="sm">
                <span>{bilingual("Tìm Hiểu Sứ Mạng SAM", "About Our Mission")}</span>
              </TactileButton>
            </Link>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 4. KHẢI TƯỢNG MỤC VỤ (Bố cục Báo in Cổ điển - Không Khung AI) */}
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Cột trái (7 cols): Bài luận sứ mạng thoáng đãng, thuần typography */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6 text-left pr-0 lg:pr-6">
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-500 font-serif tracking-widest uppercase block">
                  {bilingual("Tuyên Ngôn Mục Vụ", "Ministry Statement")}
                </span>
                <blockquote className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-snug italic border-l-3 border-primary-700 pl-5 [text-wrap:balance]">
                  {bilingual(
                    '"Một Hội Thánh vững mạnh bắt đầu từ những môn đồ có rễ đức tin đâm sâu trong Lời Đức Chúa Trời."',
                    '"A thriving church is built upon disciples deeply rooted in the infallible Word of God."'
                  )}
                </blockquote>
                <p className="text-sm text-slate-700 leading-relaxed font-sans [text-wrap:pretty]">
                  {bilingual(
                    "Spiritual Advance Ministry thành lập tại Dallas, Texas nhằm đáp ứng nhu cầu cấp thiết về tài liệu bồi dưỡng lãnh đạo và môn đồ hóa bài bản cho cộng đồng người Việt hải ngoại và trong nước. Chúng tôi cung cấp các chương trình giải kinh trung thực, tài liệu bồi linh sâu sắc và cố vấn thực hành mục vụ cho từng hội thánh địa phương.",
                    "Founded in Dallas, Texas, Spiritual Advance Ministry addresses the urgent need for structured discipleship curriculum and leadership training for Vietnamese congregations globally, delivering rigorous biblical interpretation and hands-on pastoral guidance."
                  )}
                </p>
              </div>

              {/* Chân trang bài luận có ảnh giảng viên và đường kẻ thanh */}
              <div className="pt-6 border-t border-amber-200/60 flex items-center justify-between gap-4">
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

            {/* Cột phải (5 cols): 3 Trụ Cột số La Mã I, II, III phân cách bằng chỉ kẻ thanh, KHÔNG KHUNG HỘP */}
            <div className="lg:col-span-5 divide-y divide-amber-200/70 border-t lg:border-t-0 lg:border-l border-amber-200/70 lg:pl-8 text-left">
              <div className="pb-6 space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="font-scripture text-3xl font-black text-primary-700">I.</span>
                  <h3 className="font-scripture font-bold text-slate-900 text-lg">
                    {bilingual("Tầm Nhìn Nước Trời", "Kingdom Vision")}
                  </h3>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed pl-7 [text-wrap:pretty]">
                  {bilingual(
                    "Thắp sáng ngọn lửa phục hưng tâm linh và xây dựng trung tâm huấn luyện đáng tin cậy cho các Hội Thánh địa phương.",
                    "Igniting persistent spiritual revival and establishing a trusted discipleship hub for local congregations."
                  )}
                </p>
              </div>

              <div className="py-6 space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="font-scripture text-3xl font-black text-primary-700">II.</span>
                  <h3 className="font-scripture font-bold text-slate-900 text-lg">
                    {bilingual("Sứ Mạng Chuẩn Mực", "Sound Exegesis")}
                  </h3>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed pl-7 [text-wrap:pretty]">
                  {bilingual(
                    "Giáo trình bồi linh chuẩn xác theo văn cảnh lịch sử - ngữ pháp, không thỏa hiệp trước các trào lưu thế tục.",
                    "Sound biblical curriculum preserving theological integrity without secular compromise."
                  )}
                </p>
              </div>

              <div className="pt-6 space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="font-scripture text-3xl font-black text-primary-700">III.</span>
                  <h3 className="font-scripture font-bold text-slate-900 text-lg">
                    {bilingual("Phục Sự Khiêm Nhường", "Servant Leadership")}
                  </h3>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed pl-7 [text-wrap:pretty]">
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
                className="bg-white rounded-2xl border border-amber-200/90 shadow-2xs reverent-card-hover overflow-hidden flex flex-col justify-between group"
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
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[11px] font-bold text-primary-700 border border-amber-200 shadow-2xs">
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
        {/* 6. DÂNG HIẾN MỤC VỤ (Bố Cục Báo Chí Trang Nhã - Tông Giấy Ngà Đồng Nhất) */}
        {/* ============================================================== */}
        <section className="border-y border-amber-200/80 py-12 sm:py-16 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Cột trái (7 cols): Lời kêu gọi hiệp một dâng hiến */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-primary-700 font-serif block">
                {bilingual("Sứ Mạng Dâng Hiến & Quản Trị Mục Vụ", "Ministry Stewardship & Giving")}
              </span>

              <h2 className="font-scripture text-3xl sm:text-4xl font-bold text-slate-900 [text-wrap:balance]">
                {bilingual(
                  "Đồng Hành Gieo Hạt Giống Nước Trời Cùng Spiritual Advance Ministry",
                  "Partner with Spiritual Advance Ministry to Sow Seeds for Eternity"
                )}
              </h2>

              <p className="text-sm text-slate-700 leading-relaxed font-serif [text-wrap:pretty]">
                {bilingual(
                  "Mọi khoản dâng hiến của quý tôi con Chúa đều được sử dụng minh bạch để tài trợ học bổng môn đồ hóa, in ấn tài liệu Kinh Thánh miễn phí và tổ chức các lớp huấn luyện lãnh đạo. Đầy đủ biên nhận khấu trừ thuế theo quy chuẩn IRS 501(c)(3) tại Hoa Kỳ.",
                  "Your generous contributions are transparently dedicated to discipleship scholarships, theological publications, and ministry workshops. Fully tax-deductible under IRS 501(c)(3) regulations."
                )}
              </p>

              <div className="pt-1 text-xs text-slate-500 font-serif italic">
                {bilingual(
                  "Hệ thống tự động xuất biên nhận thuế cuối năm theo quy chuẩn IRS 501(c)(3).",
                  "Automated annual tax receipts under IRS 501(c)(3) regulations."
                )}
              </div>
            </div>

            {/* Cột phải (5 cols): Danh sách các quỹ mục đích phân tách bằng nét kẻ thanh */}
            <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-amber-200/80 lg:pl-8 space-y-4 text-left">
              <div className="flex items-center justify-between pb-3 border-b border-amber-200/80">
                <span className="font-bold text-slate-900 uppercase font-serif text-xs tracking-wider">
                  {bilingual("Các Quỹ Mục Đích Rõ Ràng", "Designated Ministry Funds")}
                </span>
                <span className="text-[11px] text-primary-700 font-semibold font-serif">
                  100% Khấu Trừ Thuế
                </span>
              </div>

              <ul className="divide-y divide-amber-200/60 text-sm">
                <li className="py-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-slate-900 font-serif block font-medium">Quỹ Đào Tạo Môn Đồ Hóa</span>
                    <span className="text-xs text-slate-500">Trang bị thế hệ tôi tớ Chúa</span>
                  </div>
                  <span className="text-xs font-mono text-primary-700 font-semibold shrink-0 ml-3">
                    IRS 501(c)(3)
                  </span>
                </li>
                <li className="py-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-slate-900 font-serif block font-medium">Quỹ Học Bổng & Giảng Viên</span>
                    <span className="text-xs text-slate-500">Hỗ trợ học viên Trường Chúa Nhật</span>
                  </div>
                  <span className="text-xs font-mono text-primary-700 font-semibold shrink-0 ml-3">
                    IRS 501(c)(3)
                  </span>
                </li>
                <li className="py-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-slate-900 font-serif block font-medium">Quỹ In Ấn & Thư Viện Miễn Phí</span>
                    <span className="text-xs text-slate-500">Phát hành sách & tài liệu bồi linh</span>
                  </div>
                  <span className="text-xs font-mono text-primary-700 font-semibold shrink-0 ml-3">
                    IRS 501(c)(3)
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 7. LỜI CHỨNG MÔN ĐỒ & GƯƠNG MẶT THẬT (Bố Cục Cột Báo Chí - Không Khung AI) */}
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

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-amber-200/80 border-y border-amber-200/80 py-8 text-left">
            {testimonies.map((t, idx) => (
              <div
                key={idx}
                className="px-0 md:px-8 py-6 md:py-0 flex flex-col justify-between space-y-6 first:pl-0 last:pr-0"
              >
                <div className="space-y-3">
                  <span className="text-xs font-bold text-primary-700 font-serif tracking-wider uppercase block">
                    {isEn ? t.fruitEn : t.fruitVi}
                  </span>

                  <blockquote className="text-sm text-slate-700 leading-relaxed font-serif italic [text-wrap:pretty]">
                    "{isEn ? t.quoteEn : t.quoteVi}"
                  </blockquote>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border border-amber-300 shrink-0">
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
        {/* 8. LIÊN HỆ & THĂM VIẾNG MỤC VỤ (Phân Cột Tự Nhiên - Không Khung AI) */}
        {/* ============================================================== */}
        <section className="border-t border-amber-200/80 pt-10 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-amber-200/60 border-t border-amber-200/60 pt-6 text-xs text-slate-700 text-left">
            <div className="py-3 sm:py-0 sm:px-6 first:pl-0 flex items-center gap-3.5">
              <Phone className="w-5 h-5 text-primary-700 shrink-0" />
              <div>
                <span className="font-bold block text-slate-900 font-serif">Hotline Mục Vụ:</span>
                <span className="text-slate-600">+1 (214) 555-SAM1</span>
              </div>
            </div>

            <div className="py-3 sm:py-0 sm:px-6 flex items-center gap-3.5">
              <Mail className="w-5 h-5 text-primary-700 shrink-0" />
              <div>
                <span className="font-bold block text-slate-900 font-serif">Email Cầu Thay:</span>
                <span className="text-slate-600">contact@saministry.org</span>
              </div>
            </div>

            <div className="py-3 sm:py-0 sm:px-6 last:pr-0 flex items-center gap-3.5">
              <MapPin className="w-5 h-5 text-primary-700 shrink-0" />
              <div>
                <span className="font-bold block text-slate-900 font-serif">{bilingual("Trụ sở:", "Headquarters:")}</span>
                <span className="text-slate-600">Dallas, TX (USA) & TP.HCM</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
