"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { useLanguage } from "@/lib/i18n/language-context";
import { TactileButton } from "@/components/ui/tactile-button";
import { BentoCard } from "@/components/ui/bento-card";
import {
  Heart,
  BookOpen,
  DollarSign,
  Compass,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Award,
  Globe2,
  ExternalLink,
  Quote,
  Star,
  CheckCircle2,
  Play,
  Download,
  Mail,
  Phone,
  MapPin,
  Flame,
} from "lucide-react";

export default function HomePage() {
  const { isEn, bilingual } = useLanguage();
  const [prayerCount, setPrayerCount] = useState(68);
  const [hasPrayed, setHasPrayed] = useState(false);

  const handlePray = () => {
    if (!hasPrayed) {
      setPrayerCount((prev) => prev + 1);
      setHasPrayed(true);
    }
  };

  // Testimonials
  const testimonials = [
    {
      name: "Mục Sư Nguyễn Văn An",
      titleEn: "Senior Pastor, Grace Church Dallas",
      titleVi: "Mục Sư Quản Nhiệm, Hội Thánh Dallas",
      contentVi:
        "Tài liệu và giáo trình bồi linh của SAM đã đem lại sinh khí mới cho ban điều hành và các nhóm nhỏ của chúng tôi. Các bài học có chiều sâu giải kinh và ứng dụng thực tiễn cao.",
      contentEn:
        "SAM's materials have brought fresh spiritual vigor to our church leadership and small groups with solid expository depth.",
      stars: 5,
    },
    {
      name: "Cô Trần Thị Mai",
      titleEn: "Sunday School Director",
      titleVi: "Trưởng Ban Trường Chúa Nhật",
      contentVi:
        "Thư viện bài giảng và kho sách của SAM là nguồn tư liệu quý báu giúp tôi soạn bài dạy mỗi Chúa Nhật. Các con cái Chúa tiếp thu Lời Chúa rất hào hứng và kết quả.",
      contentEn:
        "The SAM resource vault is an invaluable blessing for my Sunday school lesson prep every week.",
      stars: 5,
    },
    {
      name: "Anh Lê Hoàng Nam",
      titleEn: "Youth & Life Group Leader",
      titleVi: "Trưởng Nhóm Nhỏ Thanh Niên",
      contentVi:
        "Khóa học Môn Đồ Hóa 101 giúp tôi thấu hiểu sứ mạng phục sự khiêm nhường. Tôi học được cách đồng hành và cầu thay cho từng anh em trong nhóm.",
      contentEn:
        "Discipleship 101 taught me humble servant leadership and how to mentor every brother in our youth fellowship.",
      stars: 5,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5]">
      {/* 1. Header / Navbar */}
      <PublicHeader />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 space-y-16 sm:space-y-20">
        {/* ============================================================== */}
        {/* 2. Hero Section */}
        {/* ============================================================== */}
        <section className="flex flex-col items-center text-center gap-4 sm:gap-6 pt-2 sm:pt-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FEF5EE] border border-[#F17F34]/40 text-[#DE6D22] text-xs font-semibold tracking-wider uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#F17F34]" />
            <span>{bilingual("Tận Hiến Trang Bị Môn Đồ Chúa", "We Are Devoted In Equipping People")}</span>
          </div>

          <div className="space-y-2 max-w-4xl px-2">
            <h1 className="font-scripture text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Spiritual Advance Ministry
            </h1>
            <p className="font-serif font-bold text-[#F17F34] text-sm sm:text-lg md:text-xl tracking-wide uppercase">
              {bilingual(
                "Nền Tảng Đào Tạo & Môn Đồ Hóa SAM",
                "Christian Discipleship & Ministerial Equipping Platform"
              )}
            </p>
            <p className="max-w-2xl mx-auto text-xs sm:text-base text-slate-700 leading-relaxed font-serif italic pt-2">
              {bilingual(
                '"Chúng tôi hiện diện để vun trồng, nâng tầm và trang bị cho các tôi tớ Chúa nhằm đem mọi người đến gần Đức Chúa Trời và trở nên những người phục sự trung tín của Ngài."',
                '"We exist to cultivate, elevate, and equip the servants of God to bring people closer to God and to be His faithful servants."'
              )}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2 w-full max-w-md sm:max-w-none">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <TactileButton variant="primary" size="lg" withCross className="w-full sm:w-auto justify-center">
                <span>{bilingual("Vào Bàn Thờ Phượng", "Enter Sanctuary Portal")}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </TactileButton>
            </Link>

            <Link href="/about" className="w-full sm:w-auto">
              <TactileButton variant="secondary" size="lg" className="w-full sm:w-auto justify-center">
                <span>{bilingual("Tìm Hiểu Về SAM", "About Ministry")}</span>
              </TactileButton>
            </Link>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 3. Section Giới Thiệu Tóm Tắt (About Summary) */}
        {/* ============================================================== */}
        <section className="p-6 sm:p-10 bg-white rounded-3xl border border-amber-200/80 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-amber-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F17F34] font-serif block">
                {bilingual("Khải Tượng Mục Vụ", "Ministry Vision")}
              </span>
              <h2 className="font-scripture text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                {bilingual("Về Spiritual Advance Ministry", "About Spiritual Advance Ministry")}
              </h2>
            </div>
            <Link href="/about" className="shrink-0">
              <TactileButton variant="secondary" size="sm">
                <span>{bilingual("Xem Chi Tiết", "Read Full Story")}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </TactileButton>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="space-y-2 p-4 rounded-2xl bg-[#FCFBF8] border border-amber-200/60">
              <Compass className="w-6 h-6 text-[#F17F34]" />
              <h3 className="font-scripture font-bold text-slate-900 text-base">
                {bilingual("Tầm Nhìn Nước Trời", "Kingdom Vision")}
              </h3>
              <p>
                {bilingual(
                  "Trở thành trung tâm huấn luyện đức tin đáng tin cậy, thắp sáng ngọn lửa thuộc linh cho các Hội Thánh và cộng đồng.",
                  "To be a trusted discipleship hub igniting persistent revival across churches and fellowships."
                )}
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-[#FCFBF8] border border-amber-200/60">
              <Award className="w-6 h-6 text-amber-700" />
              <h3 className="font-scripture font-bold text-slate-900 text-base">
                {bilingual("Sứ Mạng Trang Bị", "Equipping Mission")}
              </h3>
              <p>
                {bilingual(
                  "Cung cấp giáo trình Kinh Thánh chuẩn mực, tài liệu bồi linh thực tiễn và huấn luyện kỹ năng hầu việc Chúa có kết quả.",
                  "Providing sound biblical syllabus, practical devotional resources, and fruitful ministry skill coaching."
                )}
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-[#FCFBF8] border border-amber-200/60">
              <Heart className="w-6 h-6 text-rose-700" />
              <h3 className="font-scripture font-bold text-slate-900 text-base">
                {bilingual("Ban Lãnh Đạo Tận Tâm", "Servant Leadership")}
              </h3>
              <p>
                {bilingual(
                  "Được lãnh đạo bởi Chủ tịch Tabitha Nguyen cùng các học giả Kinh Thánh và đối tác mục vụ quốc tế giàu kinh nghiệm.",
                  "Led by President Tabitha Nguyen alongside experienced biblical scholars and global ministry partners."
                )}
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 4. Section SAM: Giới Thiệu Ngắn & Liên Kết Ngoài */}
        {/* ============================================================== */}
        <section className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-[#DE6D22] text-white border border-amber-400/40 shadow-xl space-y-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-amber-200">
              <Globe2 className="w-3.5 h-3.5 text-[#F17F34]" />
              <span>{bilingual("Hệ Sinh Thái Mục Vụ SAM", "SAM Ministry Ecosystem")}</span>
            </div>
            <h2 className="font-scripture text-2xl sm:text-3xl font-bold text-white">
              {bilingual(
                "Kết Nối Trực Tiếp Với Website saministry.org & Fanpage",
                "Connect Directly With saministry.org & Official Fanpage"
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-serif">
              {bilingual(
                "Nền tảng saministry.org cung cấp đầy đủ thông tin về các chương trình chứng chỉ quốc tế, khóa đào tạo lãnh đạo và kênh truyền thông của Spiritual Advance Ministry.",
                "Visit saministry.org for comprehensive training schedules, international certification courses, and ministerial updates."
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="https://saministry.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F17F34] hover:bg-[#DE6D22] text-white text-xs font-bold transition-all shadow-md"
            >
              <span>{bilingual("Khám Phá Website saministry.org", "Visit Official saministry.org")}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href="https://www.facebook.com/saministry.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
            >
              <span>{bilingual("Fanpage Facebook SAM", "SAM Facebook Page")}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 5. Section Thư Viện Nổi Bật (Library Highlights) */}
        {/* ============================================================== */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F17F34] font-serif block">
                {bilingual("Nguồn Tư Liệu Quý", "Featured Resources")}
              </span>
              <h2 className="font-scripture text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                {bilingual("Thư Viện Tài Liệu & Video Bài Giảng Mới Nhất", "Latest Books & Sermon Videos")}
              </h2>
            </div>
            <Link href="/library" className="shrink-0">
              <TactileButton variant="secondary" size="sm">
                <span>{bilingual("Xem Tất Cả Trong Thư Viện", "View All in Library")}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </TactileButton>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-white rounded-2xl border border-amber-200/80 shadow-2xs hover:border-[#F17F34] transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FEF5EE] text-[#F17F34]">
                  {bilingual("Sách Bồi Linh", "Book")}
                </span>
                <h3 className="font-scripture text-lg font-bold text-slate-900">
                  {bilingual("Nguyên Tắc Môn Đồ Hóa Vững Vàng", "Foundations of Solid Discipleship")}
                </h3>
                <p className="text-xs text-[#DE6D22] font-serif font-medium">Tác giả: Tabitha Nguyen</p>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {bilingual(
                    "Cẩm nang đồng hành từng bước giúp tân tín hữu tăng trưởng đức tin và dấn thân phục sự Chúa.",
                    "Practical guide helping believers mature spiritually and commit to fruitful ministry."
                  )}
                </p>
              </div>
              <Link href="/library" className="inline-flex items-center gap-1 text-xs font-bold text-[#F17F34] hover:underline pt-2 border-t border-amber-100">
                <span>{bilingual("Tải Về / Đọc Thử", "Download / Preview")}</span> &rarr;
              </Link>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-amber-200/80 shadow-2xs hover:border-[#F17F34] transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  {bilingual("Thần Học", "Theology")}
                </span>
                <h3 className="font-scripture text-lg font-bold text-slate-900">
                  {bilingual("Giải Kinh Học Thực Hành Cho Tôi Tớ Chúa", "Practical Hermeneutics")}
                </h3>
                <p className="text-xs text-[#DE6D22] font-serif font-medium">Giảng huấn: Jack Lee</p>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {bilingual(
                    "Phương pháp tiếp cận Lời Chúa theo văn cảnh lịch sử - ngữ pháp và soạn bài giảng sinh động.",
                    "Sound biblical interpretation principles and sermon preparation guidelines."
                  )}
                </p>
              </div>
              <Link href="/library" className="inline-flex items-center gap-1 text-xs font-bold text-[#F17F34] hover:underline pt-2 border-t border-amber-100">
                <span>{bilingual("Tải Về / Đọc Thử", "Download / Preview")}</span> &rarr;
              </Link>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-amber-200/80 shadow-2xs hover:border-[#F17F34] transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-900">
                  {bilingual("Video Bài Giảng", "Video Sermon")}
                </span>
                <h3 className="font-scripture text-lg font-bold text-slate-900">
                  {bilingual("Bí Quyết Giữ Lửa Tĩnh Nguyện & Cầu Thay", "Devotional Fire & Prayer")}
                </h3>
                <p className="text-xs text-[#DE6D22] font-serif font-medium">Diễn giả: Tabitha Nguyen</p>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {bilingual(
                    "Video bài giảng 42 phút bồi dưỡng tâm linh, phá tan khô hạn và giữ chuỗi ngày tương giao bền bỉ.",
                    "A 42-minute uplifting sermon on breaking spiritual dryness and maintaining intimate communion."
                  )}
                </p>
              </div>
              <Link href="/library" className="inline-flex items-center gap-1 text-xs font-bold text-[#F17F34] hover:underline pt-2 border-t border-amber-100">
                <span>{bilingual("Xem Video Trực Tuyến", "Watch Video")}</span> &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 6. Section Dâng Hiến (Giving Call to Action) */}
        {/* ============================================================== */}
        <section className="p-6 sm:p-10 bg-white rounded-3xl border border-amber-200/80 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF5EE] text-xs font-semibold text-[#DE6D22] border border-[#F17F34]/30">
                <DollarSign className="w-3.5 h-3.5 text-[#F17F34]" />
                <span>{bilingual("Đóng Góp Mục Vụ", "Ministry Stewardship")}</span>
              </div>
              <h2 className="font-scripture text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
                {bilingual(
                  "Đồng Hành Cùng SAM Gieo Hạt Giống Nước Trời",
                  "Partner With SAM To Sow Seeds For Eternity"
                )}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                {bilingual(
                  "Mọi sự dâng hiến của quý vị giúp đài thọ học bổng cho các môn đồ, in ấn tài liệu bồi linh và sản xuất video bài giảng miễn phí. Hỗ trợ đầy đủ phương thức chuyển khoản ngân hàng, mã VietQR và xuất chứng từ thuế IRS 501(c)(3) tại Mỹ.",
                  "Your generous giving supports scholarships, free theological literature, and sermon production. Fully supported via US bank transfer, VietQR, and IRS 501(c)(3) statements."
                )}
              </p>
              <div className="pt-2">
                <Link href="/give">
                  <TactileButton variant="primary" size="lg" withCross>
                    <span>{bilingual("Dâng Hiến Ngay (Give Online)", "Make an Offering Today")}</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </TactileButton>
                </Link>
              </div>
            </div>

            {/* Quick Giving Box Preview */}
            <div className="p-6 rounded-2xl bg-[#FCFBF8] border border-amber-200/70 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                <span className="font-bold text-slate-800 uppercase font-serif">
                  {bilingual("Các Quỹ Chỉ Định", "Designated Funds")}
                </span>
                <span className="text-[11px] text-[#F17F34] font-semibold">100% Minh Bạch</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-amber-200/60">
                  <span className="font-semibold text-slate-800">Quỹ Đào Tạo Môn Đồ Hóa</span>
                  <span className="text-[#DE6D22] font-bold">501(c)(3)</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-amber-200/60">
                  <span className="font-semibold text-slate-800">Quỹ Học Bổng & Truyền Giáo</span>
                  <span className="text-[#DE6D22] font-bold">501(c)(3)</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-amber-200/60">
                  <span className="font-semibold text-slate-800">Quỹ Thư Viện & Ấn Phẩm Miễn Phí</span>
                  <span className="text-[#DE6D22] font-bold">501(c)(3)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 7. Section Lời Chứng (Testimonials) */}
        {/* ============================================================== */}
        <section className="space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F17F34] font-serif">
              {bilingual("Bông Trái Thuộc Linh", "Spiritual Fruits")}
            </span>
            <h2 className="font-scripture text-2xl sm:text-3xl font-bold text-slate-900">
              {bilingual("Lời Chứng & Cảm Nhận Của Môn Đồ", "Testimonials & Lives Changed")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item, idx) => (
              <div
                key={idx}
                className="p-6 bg-white rounded-2xl border border-amber-200/80 shadow-2xs hover:border-[#F17F34] transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(item.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#F17F34]/40" />
                  <p className="text-xs text-slate-700 leading-relaxed font-serif italic">
                    "{isEn ? item.contentEn : item.contentVi}"
                  </p>
                </div>

                <div className="pt-3 border-t border-amber-100">
                  <h4 className="font-scripture font-bold text-slate-900 text-sm">{item.name}</h4>
                  <p className="text-[11px] text-[#DE6D22] font-serif">
                    {isEn ? item.titleEn : item.titleVi}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 8. Section Liên Hệ Tóm Tắt (Contact Summary) */}
        {/* ============================================================== */}
        <section className="p-6 sm:p-10 bg-white rounded-3xl border border-amber-200/80 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-amber-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F17F34] font-serif block">
                {bilingual("Thông Tin Liên Lạc", "Get In Touch")}
              </span>
              <h2 className="font-scripture text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                {bilingual("Bạn Cần Cầu Thay Hoặc Hợp Tác Mục Vụ?", "Need Prayer Or Have A Question?")}
              </h2>
            </div>
            <Link href="/contact" className="shrink-0">
              <TactileButton variant="primary" size="md">
                <span>{bilingual("Gửi Lời Cầu Thay / Liên Hệ", "Send Message / Prayer")}</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </TactileButton>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700">
            <div className="p-4 rounded-xl bg-[#FCFBF8] border border-amber-200/60 flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#F17F34] shrink-0" />
              <div>
                <span className="font-bold block text-slate-900">Hotline:</span>
                <span>+1 (214) 555-SAM1</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FCFBF8] border border-amber-200/60 flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#F17F34] shrink-0" />
              <div>
                <span className="font-bold block text-slate-900">Email:</span>
                <span>contact@saministry.org</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FCFBF8] border border-amber-200/60 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#F17F34] shrink-0" />
              <div>
                <span className="font-bold block text-slate-900">{bilingual("Trụ sở:", "Headquarters:")}</span>
                <span>Dallas, TX (USA) & TP.HCM</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 9. Footer */}
      <PublicFooter />
    </div>
  );
}
