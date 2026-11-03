"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SAM_LOGO_DATA_URL } from "@/lib/sam-logo";
import { apiFetch, ApiError } from "@/lib/api/client";
import { useLanguage } from "@/lib/i18n/language-context";
import { TactileButton } from "@/components/ui/tactile-button";
import { BentoCard } from "@/components/ui/bento-card";
import {
  Heart,
  Server,
  BookOpen,
  DollarSign,
  Users,
  Compass,
  Flame,
  Volume2,
  LogIn,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  Languages,
  GraduationCap,
  Sparkles,
  Award,
  Globe2,
  HelpCircle,
  Quote,
  Star,
  CheckCircle2,
  Menu,
  X,
} from "lucide-react";

type HealthResponse = {
  status: string;
  service: string;
  timestamp: string;
  uptime: number;
};

export default function HomePage() {
  const { lang, toggleLang, isEn, t, bilingual } = useLanguage();
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [prayerCount, setPrayerCount] = useState(48);
  const [hasPrayed, setHasPrayed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<HealthResponse>("/health", { auth: false });
      setHealth(data);
    } catch {
      // offline fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const handlePray = () => {
    if (!hasPrayed) {
      setPrayerCount((prev) => prev + 1);
      setHasPrayed(true);
    }
  };

  // Industry Partners from saministry.org
  const partners = [
    { name: "Global Theological Alliance", logo: "/partners/partner-1.svg", type: "Theological Education" },
    { name: "Christian Leadership Institute", logo: "/partners/partner-2.svg", type: "Pastoral Accreditation" },
    { name: "Kingdom Mission Society", logo: "/partners/partner-3.svg", type: "Missionary Training" },
    { name: "Biblical Discipleship Fellowship", logo: "/partners/partner-4.svg", type: "Church Ministry Alliance" },
    { name: "Pastoral Care Network", logo: "/partners/partner-5.svg", type: "Christian Higher Education" },
  ];

  // Lead Instructors from saministry.org
  const instructors = [
    {
      name: "Jack Lee",
      titleEn: "Lead Biblical Scholar & Pastoral Trainer",
      titleVi: "Học Giả Kinh Thánh & Giảng Viên Mục Vụ",
      image: "/people/instructor-1.jpg",
      specialtyEn: "Biblical Hermeneutics, Expository Preaching & Leadership",
      specialtyVi: "Giải Kinh Học, Giảng Luận Giải Kinh & Đào Tạo Lãnh Đạo",
      experience: "15+ Years",
    },
    {
      name: "Zoya Hank",
      titleEn: "Spiritual Formation & Discipleship Mentor",
      titleVi: "Giáo Thọ Môn Đồ Hóa & Kỷ Luật Thuộc Linh",
      image: "/people/instructor-2.jpg",
      specialtyEn: "Spiritual Disciplines, Mentorship & Family Ministry",
      specialtyVi: "Kỷ Luật Thuộc Linh, Huấn Luyện Môn Đồ & Mục Vụ Gia Đình",
      experience: "12+ Years",
    },
    {
      name: "Alex Jones",
      titleEn: "Discipleship Coach & Small Group Strategist",
      titleVi: "Chuyên Gia Nhóm Tế Bào & Cầu Thay",
      image: "/people/instructor-3.jpg",
      specialtyEn: "Cell Group Dynamics, Pastoral Care & Outreach Strategy",
      specialtyVi: "Động Lực Nhóm Tế Bào, Chăm Sóc Thăm Viếng & Truyền Giáo",
      experience: "40+ Groups",
    },
    {
      name: "Chris Parker",
      titleEn: "Youth & Sunday School Education Dean",
      titleVi: "Trưởng Ban Giáo Dục Cơ Đốc & Trường Chúa Nhật",
      image: "/people/instructor-4.jpg",
      specialtyEn: "Sunday School Curriculum, Child Safety & Next-Gen Faith",
      specialtyVi: "Giáo Trình Trường Chúa Nhật, An Toàn Nhi Đồng & Thanh Thiếu Niên",
      experience: "10+ Years",
    },
  ];

  // Global Impact Metrics from saministry.org
  const impactStats = [
    {
      value: "10+",
      labelEn: "Ministry Awards",
      labelVi: "Giải Thưởng Mục Vụ",
      descEn: "Excellence in Christian education and discipleship innovation",
      descVi: "Công nhận về đổi mới đào tạo và chất lượng giáo dục Cơ Đốc",
      icon: Award,
    },
    {
      value: "5+",
      labelEn: "Countries Reached",
      labelVi: "Quốc Gia Đồng Hành",
      descEn: "Disciples across USA, Australia, Japan, UK & worldwide",
      descVi: "Cộng đồng môn đồ tại Mỹ, Úc, Nhật Bản, Anh Quốc và nhiều nơi",
      icon: Globe2,
    },
    {
      value: "12+",
      labelEn: "Industry Partners",
      labelVi: "Đối Tác Đồng Hành",
      descEn: "Seminaries, mission agencies, and Christian alliances",
      descVi: "Các viện thần học, hội đồng mục vụ và liên minh Cơ Đốc",
      icon: Users,
    },
    {
      value: "7,450+",
      labelEn: "Disciples & Students",
      labelVi: "Học Viên & Môn Đồ",
      descEn: "Servants equipped with living biblical skills for God's harvest",
      descVi: "Các tôi tớ Chúa được trang bị kỹ năng thiết thực cho mùa gặt",
      icon: GraduationCap,
    },
  ];

  // Student reviews from saministry.org with verified photos
  const testimonials = [
    {
      name: "Kelvin Black",
      location: "Dallas, TX, USA",
      avatar: "/people/testimonial-kelvin.jpg",
      quoteVi:
        "Các khóa đào tạo tại SAM đã hoàn toàn thay đổi đời sống thuộc linh và năng quyền phục vụ của tôi trong Hội Thánh địa phương.",
      quoteEn:
        "The actionable training at SAM has completely elevated my spiritual walk and ministry effectiveness in our local church.",
      rating: 5,
    },
    {
      name: "Zasha Swan",
      location: "Sydney, Australia",
      avatar: "/people/testimonial-zasha.jpg",
      quoteVi:
        "Học hỏi trực tiếp từ các Mục sư và Tôi tớ Chúa đầy ơn giúp tôi nắm vững Lời Ngài và kỹ năng môn đồ hóa gia đình.",
      quoteEn:
        "Learning directly from blessed pastors and apostles helped me build solid biblical grounding and disciple my family.",
      rating: 5,
    },
    {
      name: "Frank Jones",
      location: "Tokyo, Japan",
      avatar: "/people/testimonial-frank.jpg",
      quoteVi:
        "Nền tảng tích hợp toàn bộ: bài giảng, trắc nghiệm củng cố, tĩnh nguyện hằng ngày và nhóm nhỏ thông công rất thuận tiện.",
      quoteEn:
        "Having all courses, pop quizzes, daily devotions, and life groups integrated into a single sacred account is a blessing.",
      rating: 5,
    },
    {
      name: "Jack Brown",
      location: "London, UK",
      avatar: "/people/testimonial-jack.jpg",
      quoteVi:
        "Chương trình đào tạo thực tế, tài liệu quý giá dễ lưu giữ và nuôi dưỡng tâm linh mỗi sáng sớm.",
      quoteEn:
        "Actionable curriculum, premium materials that are good to keep, and daily nourishment for our spiritual journey.",
      rating: 5,
    },
  ];

  return (
    <main className="min-h-screen px-3 sm:px-6 md:px-8 py-4 sm:py-8 md:py-10 max-w-6xl mx-auto flex flex-col gap-8 sm:gap-10 md:gap-12 bg-[#FBF9F5] overflow-x-hidden">
      {/* Top Brand Navbar */}
      <nav className="flex items-center justify-between pb-3 sm:pb-6 border-b border-amber-200/60">
        {/* Left: Brand Identity */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 relative rounded-xl bg-white border border-amber-300/80 p-1 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
            <img
              src={SAM_LOGO_DATA_URL}
              alt="SAM"
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-black text-slate-900 text-lg sm:text-xl tracking-tight leading-none">
                SAM
              </span>
              <span className="hidden sm:inline text-[10px] font-bold text-amber-800 bg-amber-100/80 border border-amber-300/70 px-1.5 py-0.5 rounded-full">
                saministry.org
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-serif leading-none mt-0.5">
              Spiritual Advance Ministry
            </span>
          </div>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Toggle (Always directly accessible) */}
          <button
            onClick={toggleLang}
            title="Chuyển đổi ngôn ngữ / Switch Language (VI ⇄ EN)"
            className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl border border-amber-200/80 bg-white hover:bg-amber-50 text-xs font-semibold text-slate-700 cursor-pointer shadow-2xs"
          >
            <Languages className="w-3.5 h-3.5 text-amber-800 shrink-0" />
            <span className="font-bold text-indigo-950 text-xs">{lang}</span>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/dashboard/courses"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-950 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-800" />
              <span>{bilingual("Khóa Học", "All Courses")}</span>
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-950 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>{isEn ? "Sign In" : "Đăng Nhập"}</span>
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-amber-900 bg-amber-100/70 hover:bg-amber-200/70 border border-amber-300/80 rounded-xl transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isEn ? "Register" : "Đăng Ký"}</span>
            </Link>

            <Link href="/dashboard" className="shrink-0">
              <TactileButton variant="primary" size="sm">
                <span>{isEn ? "Sanctuary" : "Bàn Thờ Phượng"}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </TactileButton>
            </Link>
          </div>

          {/* Mobile Clean Navigation: Sign In Button + Hamburger */}
          <div className="flex md:hidden items-center gap-1.5">
            <Link href="/login">
              <TactileButton variant="secondary" size="sm" className="px-2.5 py-1 text-xs min-h-[34px]">
                <span>{isEn ? "Sign In" : "Đăng Nhập"}</span>
              </TactileButton>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-1.5 rounded-xl border border-amber-200/80 bg-white text-slate-700 hover:bg-amber-50 cursor-pointer shadow-2xs"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-amber-900" />
              ) : (
                <Menu className="w-5 h-5 text-amber-900" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white rounded-2xl border border-amber-200 shadow-lg p-4 sm:p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-1 pb-3 border-b border-amber-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 font-serif">
              {bilingual("Điều Hướng Mục Vụ", "Ministry Navigation")}
            </span>
            <div className="grid grid-cols-1 gap-1 pt-1">
              <Link
                href="/dashboard/courses"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-amber-50 text-xs font-semibold text-slate-800 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-amber-800" />
                <span>{bilingual("Tất Cả Khóa Học", "All Courses & Curriculum")}</span>
              </Link>
              <Link
                href="/dashboard/giving"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-amber-50 text-xs font-semibold text-slate-800 transition-colors"
              >
                <DollarSign className="w-4 h-4 text-amber-800" />
                <span>{bilingual("Dâng Hiến Trực Tuyến (501c3)", "Online Giving (501c3)")}</span>
              </Link>
              <Link
                href="/dashboard/prayers"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-amber-50 text-xs font-semibold text-slate-800 transition-colors"
              >
                <Heart className="w-4 h-4 text-rose-700" />
                <span>{bilingual("Tường Cầu Thay Thánh", "Sacred Prayer Wall")}</span>
              </Link>
              <Link
                href="/dashboard/scripture"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-amber-50 text-xs font-semibold text-slate-800 transition-colors"
              >
                <Flame className="w-4 h-4 text-amber-600" />
                <span>{bilingual("Ghi Nhớ Lời Chúa (SRS)", "Scripture Memory (SRS)")}</span>
              </Link>
              <Link
                href="/dashboard/pathway"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-amber-50 text-xs font-semibold text-slate-800 transition-colors"
              >
                <Compass className="w-4 h-4 text-indigo-900" />
                <span>{bilingual("Hành Trình Môn Đồ Hóa", "Discipleship Pathway")}</span>
              </Link>
            </div>
          </div>

          <div className="pt-1 flex flex-col gap-2">
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <TactileButton variant="primary" size="md" className="w-full justify-center">
                <span>{bilingual("Vào Bàn Thờ Phượng", "Enter Sanctuary Portal")}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </TactileButton>
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <TactileButton variant="secondary" size="sm" className="w-full justify-center">
                  <span>{isEn ? "Sign In" : "Đăng Nhập"}</span>
                </TactileButton>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <TactileButton variant="gold" size="sm" className="w-full justify-center">
                  <span>{isEn ? "Register" : "Đăng Ký"}</span>
                </TactileButton>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <header className="flex flex-col items-center text-center gap-3.5 sm:gap-5 pt-1 sm:pt-2">
        {/* Sacred Slogan Pill (Concise & Elegant, No Ugly Truncation) */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-300/80 text-amber-900 text-xs font-semibold tracking-wider uppercase shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>
            {bilingual(
              "Tận Hiến Trang Bị Môn Đồ Chúa",
              "We Are Devoted In Equipping People"
            )}
          </span>
        </div>

        {/* Clear Dignified Headline Hierarchy */}
        <div className="space-y-1.5 sm:space-y-2 max-w-4xl px-2">
          <h1 className="font-scripture text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Spiritual Advance Ministry
          </h1>
          <p className="font-serif font-bold text-amber-900 text-sm sm:text-lg md:text-xl tracking-wide uppercase">
            {bilingual(
              "Nền Tảng Đào Tạo & Môn Đồ Hóa SAM",
              "Christian Discipleship & Ministerial Equipping Platform"
            )}
          </p>

          <p className="max-w-2xl mx-auto text-xs sm:text-base text-slate-700 leading-relaxed font-serif italic pt-1 sm:pt-2 px-1">
            {bilingual(
              '"Chúng tôi hiện diện để vun trồng, nâng tầm và trang bị cho các tôi tớ Chúa nhằm đem mọi người đến gần Đức Chúa Trời và trở nên những người phục sự trung tín của Ngài."',
              '"We exist to cultivate, elevate, and equip the servants of God to bring people closer to God and to be His faithful servants."'
            )}
          </p>
        </div>

        {/* Focused CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-4 pt-1 sm:pt-2 w-full max-w-md sm:max-w-none px-4 sm:px-0">
          <Link href="/dashboard/courses" className="w-full sm:w-auto">
            <TactileButton variant="primary" size="lg" withCross className="w-full sm:w-auto justify-center">
              <GraduationCap className="w-4 h-4 mr-2" />
              <span>{bilingual("Xem Tất Cả Khóa Học", "View All Courses")}</span>
            </TactileButton>
          </Link>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <TactileButton variant="secondary" size="lg" className="w-full sm:w-auto justify-center">
              <span>{bilingual("Vào Bàn Thờ Phượng", "Enter Sanctuary Portal")}</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </TactileButton>
          </Link>
        </div>

        {/* Quiet Giving Sublink */}
        <div className="pt-0.5">
          <Link
            href="/dashboard/giving"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 hover:text-indigo-950 transition-colors"
          >
            <DollarSign className="w-3.5 h-3.5 text-amber-700" />
            <span>{bilingual("Dâng hiến trực tuyến chuẩn IRS 501(c)(3)", "IRS 501(c)(3) Giving & Tithes")}</span>
            <span className="text-amber-600">&rarr;</span>
          </Link>
        </div>
      </header>

      {/* 3 Core Highlight Features from saministry.org */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-amber-200/80 shadow-xs hover:border-amber-400 transition-all space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/40 text-amber-800 flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5 text-amber-700" />
          </div>
          <h3 className="font-scripture text-lg font-bold text-slate-900">
            {bilingual("Đào Tạo Thực Tiễn", "Actionable Training")}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            {bilingual(
              "Lộ trình đào tạo có hệ thống, trang bị các kỹ năng thiết thực cho mùa gặt tâm linh và phụng sự Hội Thánh.",
              "Put all schedule trainings here. Structured ministerial syllabus equipping servants with practical skills for the spiritual harvest."
            )}
          </p>
          <Link
            href="/dashboard/courses"
            className="text-xs font-semibold text-amber-900 hover:text-indigo-950 inline-flex items-center gap-1 pt-1"
          >
            <span>{bilingual("Khám phá khóa học", "Explore curriculum")}</span> &rarr;
          </Link>
        </div>

        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-amber-200/80 shadow-xs hover:border-amber-400 transition-all space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 flex items-center justify-center font-bold">
            <Flame className="w-5 h-5 text-amber-600 fill-amber-500" />
          </div>
          <h3 className="font-scripture text-lg font-bold text-slate-900">
            {bilingual("Trắc Nghiệm & Lời Chúa (SRS)", "Interesting Quizzes & SRS")}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            {bilingual(
              "Bài kiểm tra củng cố kiến thức và thuật toán lặp lại ngắt quãng (SM-2) giúp ghi nhớ câu gốc Lời Chúa suốt đời.",
              "Pop quizzes and spaced-repetition memory system (SM-2) cementing the living Word of God in the disciple's heart forever."
            )}
          </p>
          <Link
            href="/dashboard/scripture"
            className="text-xs font-semibold text-amber-900 hover:text-indigo-950 inline-flex items-center gap-1 pt-1"
          >
            <span>{bilingual("Ôn luyện Lời Chúa", "Memorize Scripture")}</span> &rarr;
          </Link>
        </div>

        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-amber-200/80 shadow-xs hover:border-amber-400 transition-all space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5 text-emerald-700" />
          </div>
          <h3 className="font-scripture text-lg font-bold text-slate-900">
            {bilingual("Kho Bài Giảng & Tài Liệu Quý", "Premium Material & Vault")}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            {bilingual(
              "Dàn ý bài giảng điền khuyết tương tác, tài liệu tĩnh nguyện gia đình và chứng từ khấu trừ thuế IRS 501(c)(3).",
              "Curated materials that are good to keep: interactive sermon notes, family quiet time guides, and annual IRS tax receipts."
            )}
          </p>
          <Link
            href="/dashboard/sermons"
            className="text-xs font-semibold text-amber-900 hover:text-indigo-950 inline-flex items-center gap-1 pt-1"
          >
            <span>{bilingual("Vào kho bài giảng", "Browse sermon vault")}</span> &rarr;
          </Link>
        </div>
      </section>

      {/* Professional Equipping Section (Be in Demand with Professional Training) */}
      <section className="p-5 sm:p-8 md:p-10 bg-gradient-to-r from-indigo-950 via-slate-900 to-amber-950 text-white rounded-3xl border border-amber-400/40 shadow-xl space-y-6 sm:space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300 font-serif">
            SAM Professional Equipping
          </span>
          <h2 className="font-scripture text-2xl md:text-4xl font-bold text-amber-100">
            {bilingual(
              "Vun Trồng Tôi Tớ Chúa Bằng Đào Tạo Chuyên Sâu",
              "Be in Demand with Our Professional Spiritual Training"
            )}
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-serif">
            {bilingual(
              "Trang bị trọn vẹn cho người chăn bầy, trưởng ban mục vụ và môn đồ bước vào cánh đồng mùa gặt của Chúa.",
              "Equipping shepherds, ministry leaders, and faithful disciples with actionable spiritual skills for the harvest."
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="p-4 sm:p-5 bg-white/5 border border-white/10 rounded-2xl space-y-2 backdrop-blur-xs">
            <div className="text-amber-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{bilingual("Kỹ Năng Thực Chiến", "Build Relevant Skills")}</span>
            </div>
            <h4 className="font-bold text-sm text-white">
              {bilingual("Đắc Thủ Kỹ Năng Cho Mùa Gặt", "Gaining the Right Skills for the Harvest")}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {bilingual(
                "Nắm vững phương pháp dẫn dắt nhóm nhỏ, tư vấn thăm viếng bệnh nhân, và điều hành trường Chúa Nhật.",
                "Practical equipping in small group leadership, pastoral care visits, and Sunday school administration."
              )}
            </p>
          </div>

          <div className="p-4 sm:p-5 bg-white/5 border border-white/10 rounded-2xl space-y-2 backdrop-blur-xs">
            <div className="text-amber-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{bilingual("Tài Khoản Đồng Bộ", "All-in-One Learning Account")}</span>
            </div>
            <h4 className="font-bold text-sm text-white">
              {bilingual("Một Tài Khoản Duy Nhất", "All Courses Integrated in One Place")}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {bilingual(
                "Mọi khóa học, chuỗi ngày tĩnh nguyện, chứng từ dâng hiến và điểm danh con cái đều quy về một hồ sơ cá nhân.",
                "Courses, devotional streak tracking, tax receipts, and child check-in badges consolidated in one dashboard."
              )}
            </p>
          </div>

          <div className="p-4 sm:p-5 bg-white/5 border border-white/10 rounded-2xl space-y-2 backdrop-blur-xs">
            <div className="text-amber-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{bilingual("Học Từ Bậc Thầy Linh Lực", "Learn from the Blessed")}</span>
            </div>
            <h4 className="font-bold text-sm text-white">
              {bilingual("Mục Sư & Tôi Tớ Chúa Đầy Ơn", "Taught by Pastors & Apostles")}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {bilingual(
                "Mọi bài giảng và tài liệu được biên soạn và chia sẻ bởi các tôi tớ Chúa có chiều sâu linh nghiệm và thực tiễn.",
                "Everything taught by blessed spiritual leaders: seasoned pastors, apostles, and experienced shepherds."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Industry Partners Section (from saministry.org) */}
      <section className="p-5 sm:p-8 md:p-10 bg-[#FCFBF8] rounded-3xl border border-amber-200/80 shadow-xs space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-900 font-serif uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>{bilingual("Liên Minh & Đối Tác Mục Vụ", "Ministry Alliances & Accreditation")}</span>
          </div>
          <h2 className="font-scripture text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            {bilingual("Đối Tác Đồng Hành Cùng SAM", "Industry Partners")}
          </h2>
          <p className="text-xs md:text-sm text-slate-600 font-serif leading-relaxed px-1">
            {bilingual(
              "Hợp tác chặt chẽ cùng các viện thần học, hội đồng mục vụ và tổ chức giáo dục Cơ Đốc quốc tế nhằm trang bị trọn vẹn cho tôi tớ Chúa.",
              "Collaborating with leading seminaries, missionary societies, and Christian education alliances to cultivate faithful servants of God."
            )}
          </p>
        </div>

        {/* 5 Partner Logos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 pt-2 items-center">
          {partners.map((p, idx) => (
            <div
              key={idx}
              className={`p-4 sm:p-5 bg-white rounded-2xl border border-amber-200/60 shadow-2xs hover:border-amber-400 hover:shadow-xs transition-all flex flex-col items-center justify-center gap-2 text-center group ${
                idx === 4 ? "col-span-2 sm:col-span-1 max-w-[240px] mx-auto w-full sm:max-w-none" : ""
              }`}
            >
              <div className="h-12 sm:h-14 w-full flex items-center justify-center">
                <img
                  src={p.logo}
                  alt={p.name}
                  className="max-h-10 sm:max-h-12 max-w-[120px] sm:max-w-[130px] object-contain opacity-75 group-hover:opacity-100 transition-opacity filter group-hover:drop-shadow-xs"
                />
              </div>
              <span className="text-[10px] font-semibold text-slate-500 font-serif group-hover:text-amber-900 transition-colors">
                {p.type}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Meet Our Lead Instructors (from saministry.org) */}
      <section className="p-5 sm:p-8 md:p-10 bg-white rounded-3xl border border-amber-200/80 shadow-xs space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-amber-100 pb-4 sm:pb-5">
          <div className="space-y-1.5 sm:space-y-2 max-w-2xl">
            <span className="text-xs font-bold font-serif uppercase tracking-widest text-amber-800">
              {bilingual("Đội Ngũ Giảng Viên & Mục Vụ", "Blessed Teachers & Shepherds")}
            </span>
            <h2 className="font-scripture text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              {bilingual("Đội Ngũ Giảng Huấn Dẫn Đạo SAM", "Meet Our Lead Instructors")}
            </h2>
            <p className="text-xs md:text-sm text-slate-600 font-serif leading-relaxed">
              {bilingual(
                "Mọi bài giảng và khóa học đều được dẫn dắt bởi các tôi tớ Chúa đầy ơn: Mục sư, Học giả và Người chăn bầy tận tụy vì mùa gặt.",
                "Everything is taught by blessed spiritual leaders: seasoned pastors, scholars, and experienced shepherds devoted to equipping you."
              )}
            </p>
          </div>
          <Link href="/dashboard/courses" className="shrink-0 w-full sm:w-auto">
            <TactileButton variant="secondary" size="sm" className="w-full sm:w-auto justify-center">
              <span>{bilingual("Khám Phá Các Khóa Học", "Browse All Courses")}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </TactileButton>
          </Link>
        </div>

        {/* 4 Lead Instructors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {instructors.map((ins, idx) => (
            <div
              key={idx}
              className="bg-[#FCFBF8] rounded-2xl border border-amber-200/70 overflow-hidden shadow-2xs hover:shadow-md hover:border-amber-300 transition-all flex flex-col group"
            >
              <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                <img
                  src={ins.image}
                  alt={ins.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-indigo-950/80 backdrop-blur-xs text-[10px] font-bold text-amber-300 border border-amber-400/40">
                  {ins.experience}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="font-scripture text-base font-bold text-slate-900 group-hover:text-amber-900 transition-colors">
                    {ins.name}
                  </h3>
                  <div className="text-[11px] font-bold text-amber-800 font-serif leading-snug">
                    {bilingual(ins.titleVi, ins.titleEn)}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-sans pt-1">
                    {bilingual(ins.specialtyVi, ins.specialtyEn)}
                  </p>
                </div>

                <div className="pt-2 border-t border-amber-100/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-serif">saministry Faculty</span>
                  <span className="text-amber-700 font-semibold">&bull; SAM Mentor</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Numbers Speak Section (from saministry.org) */}
      <section className="p-5 sm:p-8 md:p-10 bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 text-white rounded-3xl border border-amber-400/30 shadow-xl space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 font-serif">
            {bilingual("Minh Chứng Năng Quyền & Tầm Ảnh Hưởng", "Proven Fruits of Ministry")}
          </span>
          <h2 className="font-scripture text-2xl md:text-3xl font-bold text-amber-100">
            {bilingual("Những Con Số Nói Lên Hoa Trái", "Numbers Speak")}
          </h2>
          <p className="text-xs text-slate-300 font-serif">
            {bilingual(
              "Chúa ban ơn và mở đường để mục vụ SAM chạm đến hàng ngàn môn đồ trên toàn cầu.",
              "By God's grace, advancing His Kingdom across nations and generations."
            )}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-2">
          {impactStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-4 sm:p-5 bg-white/5 border border-white/10 rounded-2xl space-y-1.5 sm:space-y-2 backdrop-blur-xs text-center flex flex-col items-center justify-center hover:bg-white/10 transition-colors"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 flex items-center justify-center mb-0.5 sm:mb-1">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                </div>
                <div className="font-scripture text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-200">
                  {stat.value}
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider">
                  {bilingual(stat.labelVi, stat.labelEn)}
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-300 leading-tight">
                  {bilingual(stat.descVi, stat.descEn)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sacred Scripture Banner */}
      <section className="p-5 sm:p-8 bg-[#FCFBF8] rounded-2xl border border-amber-200/70 shadow-sm text-center space-y-3 relative overflow-hidden">
        <div className="absolute top-2 left-3 sm:top-3 sm:left-4 text-amber-200 font-serif text-5xl sm:text-6xl select-none opacity-40">
          “
        </div>
        <span className="text-xs font-serif font-bold tracking-widest uppercase text-amber-800">
          {t("home.john316_title")}
        </span>
        <blockquote className="font-scripture text-lg sm:text-xl md:text-2xl text-slate-900 italic max-w-3xl mx-auto leading-relaxed px-2">
          "{t("home.john316_quote")}"
        </blockquote>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-900 bg-amber-100/70 px-3 py-1 rounded-full border border-amber-200">
            <Volume2 className="w-3.5 h-3.5" /> {bilingual("Nghe đọc câu gốc", "Listen to audio verse")}
          </span>
          <span className="text-xs text-slate-500 font-serif">† {bilingual("Giăng 3:16", "John 3:16")}</span>
        </div>
      </section>

      {/* Interactive Bento Grid: Prayer Wall, SRS, US Giving */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: Prayer Wall */}
        <BentoCard
          title={bilingual("Tường Cầu Thay Thánh", "Sacred Prayer Wall")}
          subtitle={bilingual(
            "Hiệp một lòng trong danh Chúa Jesus",
            "United in one heart in the name of Jesus"
          )}
          badge={
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200/80 flex items-center gap-1">
              <Heart className="w-3 h-3 fill-rose-600 text-rose-600" />{" "}
              {bilingual("Hiệp Nguyện", "Intercession")}
            </span>
          }
        >
          <div className="mt-2 space-y-3 text-sm">
            <div className="p-3.5 sm:p-4 bg-[#FBF9F5] rounded-xl border border-amber-100/80 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium text-slate-700">
                  {bilingual(
                    "Gia đình Tín hữu Nguyen (Dallas, TX)",
                    "Nguyen Family (Dallas, TX)"
                  )}
                </span>
                <span>{bilingual("Hôm nay", "Today")}</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic font-serif">
                {bilingual(
                  '"Xin Hội Thánh cùng hiệp ý cầu thay cho cháu Timmy vượt qua kỳ thi và gìn giữ đức tin nơi Chúa tại trường đại học..."',
                  '"Please join our family in praying for Timmy as he takes his exams and walks faithfully with the Lord at university..."'
                )}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-1 gap-2">
              <button
                onClick={handlePray}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border ${
                  hasPrayed
                    ? "bg-amber-100 text-amber-900 border-amber-300"
                    : "bg-white text-indigo-950 border-amber-300/80 hover:bg-amber-50/70 shadow-xs cursor-pointer"
                }`}
              >
                <span className="text-amber-700">🙏</span>
                <span>
                  {hasPrayed
                    ? bilingual("Đã Hiệp Nguyện", "Prayed")
                    : bilingual("Hiệp Nguyện Cùng Bạn", "Pray with You")}
                </span>
                <span className="ml-1 px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-900 text-[10px] font-bold">
                  {prayerCount}
                </span>
              </button>
              <Link
                href="/dashboard/prayers"
                className="py-2.5 px-3 rounded-xl text-xs font-semibold bg-indigo-950 text-white hover:bg-indigo-900 transition-colors flex items-center justify-center"
              >
                {bilingual("Tường Cầu Thay", "Prayer Wall")} &rarr;
              </Link>
            </div>
          </div>
        </BentoCard>

        {/* Card 2: Scripture Memory & Devotional Streak */}
        <BentoCard
          title={bilingual("Ghi Nhớ Lời Chúa (SRS)", "Scripture Memory (SRS)")}
          subtitle={bilingual(
            "Giấu Lời Chúa trong lòng (Thi Thiên 119:11)",
            "Hide God's Word in your heart (Psalm 119:11)"
          )}
          badge={
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
              <Flame className="w-3 h-3 fill-amber-600 text-amber-600" />{" "}
              {bilingual("Chuỗi 14 Ngày", "14-Day Streak")}
            </span>
          }
        >
          <div className="mt-2 space-y-2.5 text-xs text-slate-700">
            <div className="flex items-center justify-between p-3 bg-[#FBF9F5] rounded-xl border border-amber-100/80">
              <div className="flex items-center gap-2">
                <span className="text-amber-700 font-serif">†</span>
                <span className="font-medium">Romans 8:28 (ESV)</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {bilingual("Đã Thuộc", "Mastered")}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#FBF9F5] rounded-xl border border-amber-100/80">
              <div className="flex items-center gap-2">
                <span className="text-amber-700 font-serif">†</span>
                <span className="font-medium">Philippians 4:13 (NIV)</span>
              </div>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {bilingual("Ôn Hôm Nay", "Review Today")}
              </span>
            </div>
            <div className="pt-1 flex items-center justify-between">
              <p className="text-[11px] text-slate-500">
                {bilingual(
                  "Thuật toán ngắt quãng SM-2 giúp nhớ câu gốc.",
                  "Spaced repetition (SM-2) cements God's Word forever."
                )}
              </p>
              <Link
                href="/dashboard/scripture"
                className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1"
              >
                {bilingual("Học Lời Chúa", "Learn Scripture")} &rarr;
              </Link>
            </div>
          </div>
        </BentoCard>

        {/* Card 3: US Giving & 501(c)(3) */}
        <BentoCard
          title={bilingual("Dâng Hiến & Chứng Từ Thuế", "Giving & Tax Statements")}
          subtitle={bilingual(
            "Chuẩn IRS 501(c)(3) Hoa Kỳ",
            "IRS 501(c)(3) US Compliant"
          )}
          badge={
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              Stripe & ACH
            </span>
          }
        >
          <div className="mt-2 space-y-2.5 text-xs text-slate-700">
            <div className="p-3 bg-[#FBF9F5] rounded-xl border border-amber-100/80 space-y-1">
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>{bilingual("Quỹ Tổng Hội (Tithes)", "General Tithes Fund")}</span>
                <span className="font-bold text-slate-900">$200.00 / {bilingual("tháng", "mo")}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>{bilingual("Quỹ Truyền Giáo (Missions)", "World Missions Fund")}</span>
                <span className="font-bold text-slate-900">$50.00 / {bilingual("tháng", "mo")}</span>
              </div>
            </div>
            <Link
              href="/dashboard/giving"
              className="p-2.5 bg-indigo-50/60 hover:bg-indigo-100/70 transition-colors rounded-xl border border-indigo-100 text-indigo-950 flex items-center justify-between"
            >
              <span>{bilingual("Dâng Hiến Trực Tuyến & Báo Cáo Thuế:", "Online Giving & Tax Deductible:")}</span>
              <span className="font-bold underline cursor-pointer">{bilingual("Chi Tiết", "Details")} &rarr;</span>
            </Link>
            <p className="text-[11px] text-slate-500">
              {bilingual(
                "Bảo mật tuyệt đối: Chỉ Mục sư Quản nhiệm và Ban Tài chính mới xem số liệu dâng hiến cá nhân.",
                "Strictly confidential: Only Senior Pastor and Finance Trustees access itemized giving."
              )}
            </p>
          </div>
        </BentoCard>
      </section>

      {/* Discipleship Pathway Pillars */}
      <section className="p-5 sm:p-8 bg-white rounded-2xl border border-amber-200/70 shadow-sm space-y-5 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-4">
          <div>
            <h2 className="font-scripture text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {bilingual(
                "Bốn Giai Đoạn Vun Trồng Tôi Tớ Chúa",
                "Four Stages of Discipleship Pathway"
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {bilingual(
                "Từ lúc nhận biết Chúa Cứu Thế đến khi trở thành người chăn bầy đắc lực",
                "From first encountering Christ to becoming a faithful shepherd"
              )}
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800 shrink-0">
            <span className="font-serif">†</span>
            <span>{bilingual("Ma-thi-ơ 28:19 • Đại Mạng Lệnh", "Matthew 28:19 • The Great Commission")}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Link
            href="/dashboard/pathway"
            className="p-4 bg-[#FCFBF8] hover:bg-amber-50/60 transition-colors rounded-xl border border-amber-200/50 space-y-1.5 cursor-pointer block"
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-amber-800">
              {bilingual("Giai Đoạn 1", "Stage 1")}
            </div>
            <h4 className="font-scripture text-base font-bold text-slate-900">
              {bilingual("Tân Tín Hữu", "New Believer")}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {bilingual(
                "Căn bản đức tin, tiếp nhận Chúa Jesus, chuẩn bị Thánh Lễ Báp-têm.",
                "Foundations of faith, receiving Christ, and preparing for Holy Baptism."
              )}
            </p>
          </Link>

          <Link
            href="/dashboard/pathway"
            className="p-4 bg-[#FCFBF8] hover:bg-amber-50/60 transition-colors rounded-xl border border-amber-200/50 space-y-1.5 cursor-pointer block"
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-amber-800">
              {bilingual("Giai Đoạn 2", "Stage 2")}
            </div>
            <h4 className="font-scripture text-base font-bold text-slate-900">
              {bilingual("Môn Đồ Hóa", "Discipleship")}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {bilingual(
                "Đồng đi cùng Chúa, tĩnh nguyện hằng ngày, thói quen thuộc Lời Ngài.",
                "Daily communion with Christ, quiet time devotions, and Scripture memory."
              )}
            </p>
          </Link>

          <Link
            href="/dashboard/groups"
            className="p-4 bg-[#FCFBF8] hover:bg-amber-50/60 transition-colors rounded-xl border border-amber-200/50 space-y-1.5 cursor-pointer block"
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-amber-800">
              {bilingual("Giai Đoạn 3", "Stage 3")}
            </div>
            <h4 className="font-scripture text-base font-bold text-slate-900">
              {bilingual("Nhóm Tế Bào", "Life Groups")}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {bilingual(
                "Thông công thân mật, hiệp nguyện nâng đỡ, thăm viếng chăm sóc nhau.",
                "Intimate fellowship, intercessory prayer, and pastoral house visits."
              )}
            </p>
          </Link>

          <Link
            href="/dashboard/courses"
            className="p-4 bg-[#FCFBF8] hover:bg-amber-50/60 transition-colors rounded-xl border border-amber-200/50 space-y-1.5 cursor-pointer block"
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-amber-800">
              {bilingual("Giai Đoạn 4", "Stage 4")}
            </div>
            <h4 className="font-scripture text-base font-bold text-slate-900">
              {bilingual("Lãnh Đạo Mục Vụ", "Ministry Leadership")}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {bilingual(
                "Đào tạo Chấp sự, Trưởng ban, hướng dẫn Trường Chúa Nhật & Phụng sự Chúa.",
                "Equipping Deacons, ministry leaders, Sunday School teachers, and servant-hearted leaders."
              )}
            </p>
          </Link>
        </div>
      </section>

      {/* Student & Disciple Testimonials from saministry.org */}
      <section className="p-5 sm:p-8 md:p-10 bg-[#FCFBF8] rounded-3xl border border-amber-200/80 shadow-xs space-y-6 sm:space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold font-serif uppercase tracking-widest text-amber-800">
            {bilingual("Lời Chứng Của Môn Đồ", "Voices of Transformation")}
          </span>
          <h2 className="font-scripture text-2xl md:text-3xl font-bold text-slate-900">
            {bilingual(
              "Môn Đồ Nói Gì Về Sự Biến Đổi Đời Sống",
              "What Our Students Say About Transformation in Their Lives"
            )}
          </h2>
          <p className="text-xs text-slate-600 font-serif italic px-2">
            {bilingual(
              "Cộng đồng tín hữu và học viên được trang bị từ các Hội Thánh tại Hoa Kỳ và khắp thế giới.",
              "A global community of disciples and church leaders equipped across the US and worldwide."
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 bg-white rounded-2xl border border-amber-200/60 flex flex-col justify-between gap-4 shadow-2xs hover:shadow-xs transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic font-serif">
                  "{bilingual(t.quoteVi, t.quoteEn)}"
                </p>
              </div>

              <div className="border-t border-amber-100 pt-3 flex items-center gap-2.5">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-9 h-9 rounded-full object-cover border border-amber-300/80 shrink-0 shadow-2xs"
                />
                <div className="min-w-0">
                  <h5 className="font-bold text-xs text-slate-900 truncate">{t.name}</h5>
                  <span className="text-[10px] text-slate-500 font-serif block truncate">{t.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action Banner (Join 7,450+ Disciples Today) */}
      <section className="p-6 sm:p-8 md:p-12 rounded-3xl bg-gradient-to-r from-amber-950 via-indigo-950 to-indigo-900 text-white border border-amber-400/50 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
        <div className="max-w-xl space-y-2.5 text-center md:text-left">
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300 font-serif">
            Spiritual Advance Ministry (SAM)
          </span>
          <h2 className="font-scripture text-2xl sm:text-3xl md:text-4xl font-bold text-amber-100">
            {bilingual(
              "Gia Nhập Hơn 7,450+ Môn Đồ & Tín Hữu Đang Được Trang Bị",
              "Join Our 7,450+ Happy Students & Disciples Today!"
            )}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-serif">
            {bilingual(
              "Bắt đầu hành trình đào tạo thuộc linh hôm nay: Học Lời Chúa, tĩnh nguyện liên tục, gắn kết nhóm nhỏ và nhận chứng từ dâng hiến chuẩn IRS 501(c)(3).",
              "Begin your spiritual growth journey today: Scripture study, devotional streak, life group fellowship, and IRS 501(c)(3) Giving."
            )}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full sm:w-auto shrink-0">
          <Link href="/register" className="w-full sm:w-auto">
            <TactileButton variant="gold" size="lg" className="w-full sm:w-auto justify-center">
              <span>{bilingual("Bắt Đầu Ngay (Start Learning)", "Start Learning Today")}</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </TactileButton>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <TactileButton variant="secondary" size="lg" className="w-full sm:w-auto justify-center">
              <span>{bilingual("Đăng Nhập", "Sign In")}</span>
            </TactileButton>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-amber-200/60 pt-6 pb-8 sm:pt-8 sm:pb-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-serif text-center sm:text-left">
        <div className="flex items-center gap-2.5">
          <img
            src={SAM_LOGO_DATA_URL}
            alt="SAM"
            className="w-7 h-7 object-contain"
          />
          <span className="font-bold text-slate-800">
            saministry (SAM) • Spiritual Advance Ministry
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px]">
          <a
            href="https://saministry.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-900 underline"
          >
            saministry.org
          </a>
          <span>•</span>
          <span>IRS 501(c)(3) Compliant</span>
          <span>•</span>
          <span>Soli Deo Gloria</span>
        </div>
      </footer>
    </main>
  );
}
