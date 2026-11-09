"use client";

import React from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { useLanguage } from "@/lib/i18n/language-context";
import { TactileButton } from "@/components/ui/tactile-button";
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
} from "lucide-react";

export default function AboutPage() {
  const { isEn, bilingual } = useLanguage();

  const leadership = [
    {
      name: "Tabitha Nguyen",
      roleVi: "Chủ Tịch & Người Sáng Lập SAM (President & Founder)",
      roleEn: "President & Founder, Spiritual Advance Ministry",
      bioVi: "Người sáng lập Spiritual Advance Ministry với khải tượng trang bị và nâng tầm các tôi tớ Chúa, kết nối Hội Thánh và mở mang Nước Đức Chúa Trời.",
      bioEn: "Founder of Spiritual Advance Ministry with a vision to equip, elevate servants of God, connect churches, and advance God's Kingdom.",
      image: "/people/instructor-2.jpg",
    },
    {
      name: "Jack Lee",
      roleVi: "Cố Vấn Mục Vụ & Giảng Huấn (Pastoral Advisor & Scholar)",
      roleEn: "Lead Biblical Scholar & Pastoral Advisor",
      bioVi: "Học giả Kinh Thánh với hơn 15 năm kinh nghiệm giải kinh, huấn luyện người hầu việc Chúa tại các viện thần học quốc tế.",
      bioEn: "Biblical scholar with 15+ years of expository preaching and ministerial leadership training across global theological institutions.",
      image: "/people/instructor-1.jpg",
    },
    {
      name: "Zoya Hank",
      roleVi: "Giáo Thọ Kỷ Luật Thuộc Linh & Gia Đình (Spiritual Formation)",
      roleEn: "Spiritual Formation & Discipleship Mentor",
      bioVi: "Chuyên sâu về đào tạo môn đồ hóa, phục hưng gia đình Cơ Đốc và các thực hành kỷ luật thuộc linh vững vàng.",
      bioEn: "Specializes in discipleship coaching, Christian family restoration, and lifelong spiritual disciplines.",
      image: "/people/instructor-2.jpg",
    },
  ];

  const coreValues = [
    {
      titleVi: "Trung Tín Với Lời Chúa (Biblical Inerrancy)",
      titleEn: "Biblical Inerrancy",
      descVi: "Kinh Thánh là Lời Đức Chúa Trời trọn vẹn, chân lý bất biến và kim chỉ nam cho mọi hoạt động thuộc linh và chức vụ.",
      descEn: "The Holy Scripture is the infallible Word of God, our supreme authority and compass for faith and ministry.",
    },
    {
      titleVi: "Môn Đồ Hóa Tận Tâm (Passionate Discipleship)",
      titleEn: "Passionate Discipleship",
      descVi: "Không chỉ dừng lại ở số lượng, mà chú trọng chiều sâu đức tin, giúp mỗi tín hữu trở nên môn đồ kết quả của Đấng Christ.",
      descEn: "Prioritizing depth over mere numbers, mentoring believers to become fruitful and mature disciples of Christ.",
    },
    {
      titleVi: "Phụng Sự Khiêm Nhường (Servant Leadership)",
      titleEn: "Servant Leadership",
      descVi: "Noi gương Chúa Jesus rửa chân cho môn đồ: Lãnh đạo bằng tình yêu thương hy sinh và tấm lòng tôi tớ trung tín.",
      descEn: "Following Jesus who washed His disciples' feet: Leading through sacrificial love and faithful servant-heartedness.",
    },
    {
      titleVi: "Hiệp Một Trong Thân Thể Đấng Christ (Kingdom Unity)",
      titleEn: "Kingdom Unity",
      descVi: "Hợp tác rộng mở với các Hội Thánh, tổ chức mục vụ và giáo hạt cùng chung khát vọng mở mang Tin Lành cứu rỗi.",
      descEn: "Fostering fellowship and collaboration with global churches and ministries for the advancement of the Gospel.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5]">
      <PublicHeader />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
        {/* Hero Banner */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FEF5EE] border border-[#F17F34]/40 text-[#DE6D22] text-xs font-semibold tracking-wider uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#F17F34]" />
            <span>{bilingual("Về Chúng Tôi", "About Our Ministry")}</span>
          </div>
          <h1 className="font-scripture text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Spiritual Advance Ministry
          </h1>
          <p className="font-serif font-bold text-[#F17F34] text-base sm:text-xl uppercase tracking-wide">
            {bilingual("Tận Hiến Trang Bị Môn Đồ Chúa", "We Are Devoted In Equipping People")}
          </p>
          <p className="text-xs sm:text-base text-slate-700 font-serif italic leading-relaxed pt-2">
            {bilingual(
              '"Chúng tôi hiện diện để vun trồng, nâng tầm và trang bị cho các tôi tớ Chúa nhằm đem mọi người đến gần Đức Chúa Trời và trở nên những người phục sự trung tín của Ngài."',
              '"We exist to cultivate, elevate, and equip the servants of God to bring people closer to God and to be His faithful servants."'
            )}
          </p>
        </section>

        {/* Story Section */}
        <section className="p-6 sm:p-10 bg-white rounded-3xl border border-amber-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-[#F17F34] font-semibold text-xs tracking-wider uppercase">
            <Compass className="w-4 h-4" />
            <span>{bilingual("Câu Chuyện Của Chúng Tôi", "Our Story")}</span>
          </div>
          <h2 className="font-scripture text-2xl sm:text-3xl font-bold text-slate-900">
            {bilingual(
              "Hành Trình Khởi Sự Từ Tấm Lòng Yêu Mến Công Việc Chúa",
              "A Journey Born From Love For God's Kingdom"
            )}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
            <p>
              {bilingual(
                "Spiritual Advance Ministry (SAM) được thai nghén từ khát vọng thấy các tôi tớ Chúa, tín hữu và lãnh đạo mục vụ tại Hoa Kỳ cũng như cộng đồng người Việt khắp năm châu được tiếp cận nền giáo dục thần học thực tiễn, tài liệu bồi linh vững chắc và công cụ đồng hành đức tin mỗi ngày.",
                "Spiritual Advance Ministry (SAM) was birthed from the deep desire to see servants of God, disciples, and ministry leaders across the United States and global Vietnamese communities access practical theological education, solid devotional literature, and daily discipleship habits."
              )}
            </p>
            <p>
              {bilingual(
                "Từ những lớp học nhỏ ban đầu, SAM đã phát triển thành nền tảng đào tạo môn đồ hóa toàn diện, thư viện tài liệu bồi linh chuyên sâu, kết nối chặt chẽ với các đối tác giáo dục Cơ Đốc quốc tế như ISOM (International School of Ministry).",
                "From small fellowship classes, SAM has grown into a comprehensive Christian equipping hub, an interactive sermon library, and official alliances with global Christian education bodies such as ISOM (International School of Ministry)."
              )}
            </p>
          </div>
        </section>

        {/* Vision & Mission Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 sm:p-8 bg-gradient-to-br from-amber-50/70 to-white rounded-2xl border border-amber-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FEF5EE] border border-[#F17F34]/30 flex items-center justify-center text-[#F17F34]">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-scripture text-xl font-bold text-slate-900">
              {bilingual("Tầm Nhìn (Our Vision)", "Our Vision")}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {bilingual(
                "Trở thành trung tâm huấn luyện thuộc linh đáng tin cậy, thắp sáng ngọn lửa phục hưng và đào tạo hàng ngàn người lãnh đạo Cơ Đốc trung kiên, tận hiến và kết quả cho Hội Thánh Đấng Christ.",
                "To be a trusted global spiritual equipping hub, igniting revival and raising thousands of faithful, fruit-bearing Christian leaders for the Body of Christ."
              )}
            </p>
          </div>

          <div className="p-6 sm:p-8 bg-gradient-to-br from-[#FEF5EE] to-white rounded-2xl border border-amber-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-800">
              <Award className="w-5 h-5 text-amber-700" />
            </div>
            <h3 className="font-scripture text-xl font-bold text-slate-900">
              {bilingual("Sứ Mạng (Our Mission)", "Our Mission")}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {bilingual(
                "Trang bị kiến thức Kinh Thánh chuẩn mực, huấn luyện kỹ năng mục vụ thực tế, tạo dựng môi trường thông công nâng đỡ và duy trì thói quen tĩnh nguyện - cầu thay bền bỉ.",
                "Equipping sound biblical knowledge, training practical ministerial skills, fostering supportive fellowship, and nurturing persistent prayer and devotional habits."
              )}
            </p>
          </div>
        </section>

        {/* Core Values */}
        <section className="p-6 sm:p-10 bg-white rounded-3xl border border-amber-200/80 shadow-xs space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F17F34] font-serif">
              {bilingual("Nền Tảng Vững Chắc", "Foundational Pillars")}
            </span>
            <h2 className="font-scripture text-2xl sm:text-3xl font-bold text-slate-900">
              {bilingual("Giá Trị Cốt Lõi & Niềm Tin Của SAM", "Core Values & Beliefs")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {coreValues.map((val, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#FCFBF8] border border-amber-200/70 space-y-2 hover:border-[#F17F34] transition-all"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F17F34] shrink-0" />
                  <h4 className="font-scripture font-bold text-slate-900 text-base">
                    {isEn ? val.titleEn : val.titleVi}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                  {isEn ? val.descEn : val.descVi}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Leadership & President */}
        <section className="space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F17F34] font-serif">
              {bilingual("Ban Lãnh Đạo & Đối Tác", "President & Leadership")}
            </span>
            <h2 className="font-scripture text-2xl sm:text-3xl font-bold text-slate-900">
              {bilingual("Người Phục Vụ & Giảng Huấn", "Meet Our Ministry Team")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leadership.map((person, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-amber-200/80 p-5 space-y-3.5 shadow-2xs hover:border-[#F17F34] hover:shadow-md transition-all flex flex-col"
              >
                <div className="w-20 h-20 rounded-full mx-auto overflow-hidden bg-amber-100 border-2 border-amber-300 relative flex items-center justify-center">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-amber-800 text-lg -z-0">
                    {person.name.charAt(0)}
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <h4 className="font-scripture font-bold text-slate-900 text-lg">
                    {person.name}
                  </h4>
                  <p className="text-[11px] font-semibold text-[#F17F34]">
                    {isEn ? person.roleEn : person.roleVi}
                  </p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed text-center font-sans flex-1">
                  {isEn ? person.bioEn : person.bioVi}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Official Website & Facebook Box */}
        <section className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-[#DE6D22] text-white border border-amber-400/40 shadow-xl space-y-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-[#F17F34]" />
              <span>{bilingual("Cổng Thông Tin Chính Thức", "Official Portal")}</span>
            </div>
            <h3 className="font-scripture text-2xl sm:text-3xl font-bold text-white">
              {bilingual(
                "Kết Nối Trực Tiếp Với Spiritual Advance Ministry",
                "Connect Directly with Spiritual Advance Ministry"
              )}
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-serif">
              {bilingual(
                "Ghé thăm trang web chính thức saministry.org và Fanpage Facebook của chúng tôi để cập nhật lịch đào tạo, thông điệp mục vụ và nguồn tư liệu thuộc linh mới nhất.",
                "Visit our official portal saministry.org and our Facebook Fanpage for the latest training schedules, ministerial messages, and spiritual resources."
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
              <span>{bilingual("Truy Cập Website saministry.org", "Visit saministry.org")}</span>
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
      </main>

      <PublicFooter />
    </div>
  );
}
