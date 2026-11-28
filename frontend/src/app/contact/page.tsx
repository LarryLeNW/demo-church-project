"use client";

import React, { useState } from "react";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { FixedWorldMapBackground } from "@/components/fixed-world-map-background";
import { useLanguage } from "@/lib/i18n/language-context";
import { TactileButton } from "@/components/ui/tactile-button";
import { TactileInput } from "@/components/ui/tactile-input";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Heart,
  Handshake,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default function ContactPage() {
  const { isEn, bilingual } = useLanguage();
  const [activeTab, setActiveTab] = useState<"general" | "prayer" | "partner">("general");

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isConfidential, setIsConfidential] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col relative text-slate-800 bg-transparent">
      <FixedWorldMapBackground />
      <PublicHeader />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-14 space-y-12 sm:space-y-16">
        {/* Breadcrumb Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/20 animate-fade-in text-white">
          <Breadcrumb
            items={[
              { label: bilingual("Liên Hệ & Cầu Thay", "Contact & Prayer Requests") },
            ]}
          />
          <span className="text-xs text-amber-200/90 font-serif italic hidden sm:inline">
            {bilingual("Dallas Main Campus (Hoa Kỳ) & Văn phòng Việt Nam", "Dallas Main Campus (USA) & Vietnam Office")}
          </span>
        </div>

        {/* ============================================================== */}
        {/* 2. TWO-COLUMN SANCTUARY: Info Directory (Left) + Prayer Form (Right) */}
        {/* ============================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 text-left items-start">
          {/* CỘT TRÁI (5 cols): Dark Frosted Glass Directory */}
          <div className="lg:col-span-5 rounded-[40px] bg-slate-950/60 backdrop-blur-xl border border-white/20 p-7 sm:p-8 text-white space-y-7 shadow-2xl animate-fade-up">
            <div className="border-b border-white/15 pb-4">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-widest font-serif block">
                {bilingual("Trụ Sở & Kênh Liên Lạc", "Official Presence & Contact")}
              </span>
              <h2 className="font-scripture text-2xl font-bold text-white mt-1">
                {bilingual("Thông Tin Trực Thuộc", "Ministry Offices")}
              </h2>
            </div>

            <div className="space-y-5 text-xs font-sans">
              {/* Dallas Campus */}
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 text-amber-300 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-white block font-serif text-sm">
                    {bilingual("Trụ sở Dallas (USA):", "Dallas Headquarters:")}
                  </span>
                  <span className="text-slate-300">Dallas Main Campus, Texas, United States</span>
                </div>
              </div>

              {/* Vietnam Office */}
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 text-amber-300 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-white block font-serif text-sm">
                    {bilingual("Văn phòng kết nối Việt Nam:", "Vietnam Office:")}
                  </span>
                  <span className="text-slate-300">TP. Hồ Chí Minh & mạng lưới mục vụ toàn quốc</span>
                </div>
              </div>

              {/* Hotline */}
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-white block font-serif text-sm">
                    {bilingual("Hotline Mục Vụ:", "Pastoral Care Hotline:")}
                  </span>
                  <span className="text-amber-200 font-mono font-bold">+1 (214) 555-SAM1 / +84 (028) 3888-SAM</span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 text-sky-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-white block font-serif text-sm">Email:</span>
                  <a href="mailto:contact@saministry.org" className="text-amber-300 font-semibold hover:underline">
                    contact@saministry.org
                  </a>
                </div>
              </div>

              {/* Office Hours */}
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 text-rose-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-white block font-serif text-sm">
                    {bilingual("Giờ làm việc & Tương giao:", "Ministry Hours:")}
                  </span>
                  <span className="text-slate-300">Thứ Hai – Thứ Bảy: 8:00 AM – 6:00 PM (CST)</span>
                </div>
              </div>
            </div>

            {/* Cathedral Arched Map Frame */}
            <div className="pt-2">
              <div className="rounded-t-[32px] rounded-b-2xl bg-slate-900 border border-white/20 overflow-hidden shadow-lg p-5 text-center space-y-2">
                <MapPin className="w-6 h-6 text-amber-400 mx-auto" />
                <span className="text-xs font-bold text-white block font-serif">Spiritual Advance Ministry</span>
                <span className="text-xs text-slate-400 block">Dallas, TX 75201, United States</span>
                <a
                  href="https://maps.google.com/?q=Dallas,Texas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-amber-300 font-bold pt-1 hover:underline"
                >
                  <span>{bilingual("Xem trên Google Maps", "Open in Google Maps")}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI (7 cols): Frosted Dark Prayer & Fellowship Sanctuary */}
          <div className="lg:col-span-7 bg-slate-950/50 backdrop-blur-xl rounded-[40px] border border-white/20 shadow-2xl p-7 sm:p-10 space-y-7 text-white animate-fade-up delay-75 min-h-[580px]">
            {/* Pill Tab Switcher: Rock-solid 3-column grid with stable geometry and 0 width jitter */}
            <div className="grid grid-cols-3 gap-1 sm:gap-1.5 p-1.5 bg-slate-900/80 rounded-full border border-white/15 w-full">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("general");
                  setSubmitted(false);
                }}
                className={`w-full py-2.5 px-1.5 sm:px-3 rounded-full text-[11px] sm:text-xs font-serif font-bold transition-colors duration-200 flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer select-none text-center ${
                  activeTab === "general"
                    ? "bg-primary-700 text-white shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">{bilingual("Liên Hệ Chung", "General Inquiry")}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("prayer");
                  setSubmitted(false);
                }}
                className={`w-full py-2.5 px-1.5 sm:px-3 rounded-full text-[11px] sm:text-xs font-serif font-bold transition-colors duration-200 flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer select-none text-center ${
                  activeTab === "prayer"
                    ? "bg-primary-700 text-white shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">{bilingual("Gửi Lời Cầu Thay", "Prayer Request")}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("partner");
                  setSubmitted(false);
                }}
                className={`w-full py-2.5 px-1.5 sm:px-3 rounded-full text-[11px] sm:text-xs font-serif font-bold transition-colors duration-200 flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer select-none text-center ${
                  activeTab === "partner"
                    ? "bg-primary-700 text-white shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Handshake className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">{bilingual("Đề Xuất Hợp Tác", "Partnership")}</span>
              </button>
            </div>

            {submitted ? (
              <div className="p-8 rounded-3xl bg-slate-900/80 border border-primary-500/40 text-center space-y-4 animate-scale-in text-white">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-600 to-amber-600 text-white mx-auto flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="font-scripture text-2xl font-bold text-white">
                  {bilingual("Cảm Tạ Ơn Chúa, Chúng Tôi Đã Nhận Thông Điệp!", "Message Received! Praise The Lord!")}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 max-w-md mx-auto leading-relaxed [text-wrap:pretty]">
                  {activeTab === "prayer"
                    ? bilingual(
                        "Lời cầu thay của quý vị đã được chuyển tới Ban Hiệp Nguyện của SAM để dốc lòng cầu nguyện mỗi buổi sáng.",
                        "Your prayer request has been delivered to SAM's Intercession Team to lift up before God's throne of grace."
                      )
                    : bilingual(
                        "Ban điều hành SAM sẽ phản hồi qua email hoặc số điện thoại của quý vị trong vòng 24 giờ làm việc.",
                        "Our leadership team will reach out to you within 24 business hours."
                      )}
                </p>
                <div className="pt-2">
                  <TactileButton variant="primary" size="md" onClick={() => setSubmitted(false)} className="rounded-full">
                    <span>{bilingual("Gửi Tin Nhắn Khác", "Send Another Message")}</span>
                  </TactileButton>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TactileInput
                    variant="glass"
                    label={bilingual("Họ và tên của bạn", "Your Full Name")}
                    placeholder={bilingual("Nguyễn Văn A", "Full Name")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <TactileInput
                    variant="glass"
                    label={bilingual("Địa chỉ Email", "Email Address")}
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TactileInput
                    variant="glass"
                    label={bilingual("Số điện thoại (Nhận tin nhắn / Zalo)", "Phone Number")}
                    type="tel"
                    placeholder="+1 (214) ... hoặc 090..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <TactileInput
                    variant="glass"
                    label={
                      activeTab === "prayer"
                        ? bilingual("Nan đề / Tiêu đề cầu thay", "Prayer Title / Subject")
                        : activeTab === "partner"
                        ? bilingual("Tên Hội Thánh / Tổ chức hợp tác", "Church or Organization Name")
                        : bilingual("Tiêu đề tin nhắn", "Subject")
                    }
                    placeholder={
                      activeTab === "prayer"
                        ? bilingual("Xin cầu thay cho sức khỏe / gia đình...", "Prayer for healing / family...")
                        : bilingual("Tiêu đề liên hệ...", "Subject...")
                    }
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>

                {/* Textarea */}
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-semibold text-slate-200 tracking-wide font-serif">
                    {activeTab === "prayer"
                      ? bilingual("Chi tiết lời cầu nguyện & mong ước:", "Detailed Prayer Request:")
                      : activeTab === "partner"
                      ? bilingual("Mục đích & Nội dung đề xuất hợp tác:", "Partnership Proposal Details:")
                      : bilingual("Nội dung tin nhắn:", "Your Message:")}
                  </label>
                  <textarea
                    rows={5}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={
                      activeTab === "prayer"
                        ? bilingual(
                            "Hãy chia sẻ hoàn cảnh và điều bạn ước ao Chúa nhậm lời...",
                            "Share your situation and how we can pray for you..."
                          )
                        : bilingual("Nội dung chi tiết...", "Details...")
                    }
                    className="w-full px-4 py-3 text-xs bg-white/10 text-white rounded-2xl border border-white/20 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 min-h-[120px]"
                    required
                  />
                </div>

                {/* Microcopy & Confidential Option with stable geometry */}
                <div className="min-h-[28px] flex items-center">
                  {activeTab === "prayer" ? (
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none">
                      <input
                        type="checkbox"
                        checked={isConfidential}
                        onChange={(e) => setIsConfidential(e.target.checked)}
                        className="rounded border-white/30 bg-white/10 text-primary-600 focus:ring-amber-400 w-4 h-4 cursor-pointer shrink-0"
                      />
                      <span className="leading-snug">
                        {bilingual(
                          "Giữ kín nhiệm (Chỉ gửi riêng Mục Sư & Ban Cầu Thay, không hiện công khai)",
                          "Keep confidential (Only visible to Pastoral Prayer Team, not public)"
                        )}
                      </span>
                    </label>
                  ) : (
                    <div className="text-[11px] text-slate-400 italic">
                      {activeTab === "partner"
                        ? bilingual(
                            "Đồng hành cùng phát triển và lan tỏa Phúc Âm cho cộng đồng.",
                            "Partnering together to spread the Gospel across communities."
                          )
                        : bilingual(
                            "Mọi thông tin liên hệ được bảo mật theo tiêu chuẩn an toàn SAM.",
                            "All communication is kept secure and confidential by SAM."
                          )}
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <TactileButton variant="primary" size="lg" type="submit" withCross className="w-full rounded-full min-h-[50px] shadow-lg">
                    <span>
                      {activeTab === "prayer"
                        ? bilingual("Gửi Yêu Cầu Cầu Thay", "Submit Prayer Request")
                        : activeTab === "partner"
                        ? bilingual("Gửi Đề Xuất Hợp Tác", "Send Partnership Inquiry")
                        : bilingual("Gửi Tin Nhắn", "Send Message")}
                    </span>
                  </TactileButton>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
