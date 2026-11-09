"use client";

import React from "react";
import Link from "next/link";
import { SAM_LOGO_DATA_URL } from "@/lib/sam-logo";
import { useLanguage } from "@/lib/i18n/language-context";
import { Mail, Phone, MapPin, Globe, ExternalLink, Heart } from "lucide-react";

export function PublicFooter() {
  const { isEn, bilingual } = useLanguage();

  return (
    <footer className="bg-[#FAF8F3] border-t border-amber-200/80 pt-10 pb-8 sm:pt-14 sm:pb-12 text-slate-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white border border-amber-300/80 p-1 flex items-center justify-center shrink-0 shadow-2xs">
                <img
                  src={SAM_LOGO_DATA_URL}
                  alt="SAM"
                  className="w-7 h-7 object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-black text-slate-900 text-base tracking-tight leading-none">
                  SAM
                </span>
                <span className="text-[10px] text-slate-500 font-serif leading-none mt-0.5">
                  Spiritual Advance Ministry
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-600 leading-relaxed font-serif italic">
              {bilingual(
                '"Tận hiến trang bị người hầu việc Chúa, đem mọi người đến gần Đức Chúa Trời và trở nên những người phục sự trung tín của Ngài."',
                '"Devoted in equipping people to bring everyone closer to God and raise faithful servants of Christ."'
              )}
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-serif">
              {bilingual("Liên Kết Nhanh", "Quick Links")}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-[#F17F34] transition-colors">
                  {bilingual("Trang Chủ", "Home")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#F17F34] transition-colors">
                  {bilingual("Về Chúng Tôi (About)", "About Ministry")}
                </Link>
              </li>
              <li>
                <Link href="/library" className="hover:text-[#F17F34] transition-colors">
                  {bilingual("Thư Viện Tài Liệu & Video", "Library & Sermon Vault")}
                </Link>
              </li>
              <li>
                <Link href="/give" className="hover:text-[#F17F34] transition-colors">
                  {bilingual("Dâng Hiến Trực Tuyến", "Online Giving")}
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-[#F17F34] transition-colors">
                  {bilingual("Các Khóa Học Bồi Linh", "Discipleship Courses")}
                </Link>
              </li>
              <li>
                <Link href="/announcements" className="hover:text-[#F17F34] transition-colors">
                  {bilingual("Thông Báo & Bản Tin", "News & Bulletins")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#F17F34] transition-colors">
                  {bilingual("Liên Hệ & Cầu Thay", "Contact & Prayer Requests")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Ministry Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-serif">
              {bilingual("Trụ Sở & Liên Hệ", "Official Ministry")}
            </h4>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <span>Dallas, Texas (USA) & TP. Hồ Chí Minh (Việt Nam)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-800 shrink-0" />
                <a href="mailto:contact@saministry.org" className="hover:text-[#F17F34]">
                  contact@saministry.org
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-800 shrink-0" />
                <span>Hotline: +1 (214) 555-SAM1 / +84 (028) 3888-SAM</span>
              </div>
            </div>
          </div>

          {/* Col 4: Dâng hiến & Môn đồ hóa */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-serif">
              {bilingual("Hiệp Ý & Dâng Hiến", "Fellowship & Giving")}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {bilingual(
                "Mọi sự dâng hiến của quý con cái Chúa đều được cấp biên nhận minh bạch và đóng góp cho công tác môn đồ hóa toàn cầu.",
                "Every offering is transparently managed and poured directly into Christian equipping and pastoral development."
              )}
            </p>
            <Link
              href="/give"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FEF5EE] border border-[#F17F34]/30 text-xs font-semibold text-[#DE6D22] hover:bg-[#FDE8D7] transition-all"
            >
              <Heart className="w-3.5 h-3.5 text-[#F17F34]" />
              <span>{bilingual("Dâng hiến ngay", "Make an offering")} &rarr;</span>
            </Link>
          </div>
        </div>

        {/* Bottom copyright & Soli Deo Gloria */}
        <div className="pt-6 border-t border-amber-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-serif text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} Spiritual Advance Ministry (SAM). {bilingual("Bảo lưu mọi quyền.", "All rights reserved.")}
          </div>
          <div className="text-[#DE6D22] font-semibold italic flex items-center gap-1">
            <span>Soli Deo Gloria</span>
            <span>•</span>
            <span>{isEn ? "Glory to God Alone" : "Vinh Hiển Thuộc Về Chúa"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
