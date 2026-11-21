"use client";

import React, { useState } from "react";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { useLanguage } from "@/lib/i18n/language-context";
import { TactileButton } from "@/components/ui/tactile-button";
import { TactileInput } from "@/components/ui/tactile-input";
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
    <div className="min-h-screen flex flex-col bg-sacred-parchment text-slate-800">
      <PublicHeader />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-14 space-y-12 sm:space-y-16">
        {/* Header Title */}
        <section className="text-center space-y-4 max-w-3xl mx-auto pt-2 sm:pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-800 text-xs font-semibold uppercase tracking-wider shadow-xs">
            <Mail className="w-3.5 h-3.5 text-primary-800 shrink-0" />
            <span>{bilingual("Kết Nối Mục Vụ SAM", "Ministry Fellowship & Contact")}</span>
          </div>

          <h1 className="font-scripture text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight [text-wrap:balance]">
            {bilingual("Liên Hệ & Gửi Lời Cầu Thay", "Get in Touch & Prayer Requests")}
          </h1>

          <div className="border-y border-amber-200/80 py-3 my-2 max-w-2xl mx-auto">
            <p className="text-sm sm:text-base text-slate-700 font-serif italic leading-relaxed [text-wrap:pretty]">
              {bilingual(
                '"Hãy trình các sự cầu xin của mình cho Đức Chúa Trời bởi sự cầu nguyện, nài xin, cùng sự tạ ơn." — Phi-líp 4:6',
                '"In every situation, by prayer and petition, with thanksgiving, present your requests to God." — Philippians 4:6'
              )}
            </p>
          </div>
        </section>

        {/* 2 Columns: Contact Info & Interactive Forms */}
        <section className="space-y-6">
          <h2 className="sr-only">
            {bilingual("Thông Tin Liên Hệ & Trụ Sở Mục Vụ", "Ministry Contact & Locations")}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          {/* Left Column: Official Info & Geolocation */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 sm:p-7 bg-white rounded-3xl border border-amber-200/90 shadow-sm space-y-5">
              <h3 className="font-scripture text-xl font-bold text-slate-900 border-b border-amber-100 pb-3">
                {bilingual("Thông Tin Trực Thuộc", "Official Presence")}
              </h3>

              <div className="space-y-4 text-xs font-sans">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-700 border border-primary-200 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block font-serif">
                      {bilingual("Trụ sở Dallas (USA):", "Dallas Headquarters:")}
                    </span>
                    <span className="text-slate-600">Dallas Main Campus, Texas, United States</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 border border-amber-300 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block font-serif">
                      {bilingual("Văn phòng kết nối Việt Nam:", "Vietnam Office:")}
                    </span>
                    <span className="text-slate-600">TP. Hồ Chí Minh & mạng lưới mục vụ toàn quốc</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block font-serif">Hotline Tư Vấn:</span>
                    <span className="text-slate-700 font-mono">+1 (214) 555-SAM1 / +84 (028) 3888-SAM</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-300 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block font-serif">Email:</span>
                    <a href="mailto:contact@saministry.org" className="text-primary-700 font-semibold hover:underline">
                      contact@saministry.org
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-800 border border-rose-300 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block font-serif">
                      {bilingual("Giờ làm việc & Tương giao:", "Ministry Hours:")}
                    </span>
                    <span className="text-slate-600">Thứ Hai – Thứ Bảy: 8:00 AM – 6:00 PM (CST)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Map Representation */}
            <div className="p-5 bg-white rounded-3xl border border-amber-200/90 overflow-hidden shadow-2xs space-y-3">
              <span className="text-xs font-bold text-slate-900 font-serif block">
                {bilingual("Địa Điểm Thờ Phượng & Kết Nối", "Sanctuary Geolocation")}
              </span>
              <div className="relative aspect-video rounded-2xl bg-sacred-card border border-amber-200 overflow-hidden flex items-center justify-center text-center p-4">
                <div className="space-y-1">
                  <MapPin className="w-6 h-6 text-primary-700 mx-auto" />
                  <span className="text-xs font-bold text-slate-900 block font-serif">Spiritual Advance Ministry</span>
                  <span className="text-xs text-slate-500 block">Dallas, TX 75201, United States</span>
                  <a
                    href="https://maps.google.com/?q=Dallas,Texas"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary-800 font-bold pt-1 hover:underline"
                  >
                    <span>{bilingual("Xem trên Google Maps", "Open in Google Maps")}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Form Tabs */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-amber-200/90 shadow-md p-6 sm:p-9 space-y-6">
            {/* Tab Selection */}
            <div className="flex items-center gap-2 p-1.5 bg-sacred-card rounded-2xl border border-amber-200">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("general");
                  setSubmitted(false);
                }}
                className={`flex-1 py-3 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] ${
                  activeTab === "general"
                    ? "bg-primary-700 text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-900 hover:bg-white"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>{bilingual("Liên Hệ Chung", "General Inquiry")}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("prayer");
                  setSubmitted(false);
                }}
                className={`flex-1 py-3 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] ${
                  activeTab === "prayer"
                    ? "bg-primary-700 text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-900 hover:bg-white"
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>{bilingual("Gửi Lời Cầu Thay", "Prayer Request")}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("partner");
                  setSubmitted(false);
                }}
                className={`flex-1 py-3 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] ${
                  activeTab === "partner"
                    ? "bg-primary-700 text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-900 hover:bg-white"
                }`}
              >
                <Handshake className="w-4 h-4" />
                <span>{bilingual("Đề Xuất Hợp Tác", "Partnership")}</span>
              </button>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-primary-50 border border-primary-200 text-center space-y-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-primary-700 text-white mx-auto flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="font-scripture text-2xl font-bold text-slate-900">
                  {bilingual("Cảm Tạ Ơn Chúa, Chúng Tôi Đã Nhận Thông Điệp!", "Message Received! Praise The Lord!")}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 max-w-md mx-auto leading-relaxed [text-wrap:pretty]">
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
                  <TactileButton variant="primary" size="md" onClick={() => setSubmitted(false)}>
                    <span>{bilingual("Gửi Tin Nhắn Khác", "Send Another Message")}</span>
                  </TactileButton>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TactileInput
                    label={bilingual("Họ và tên của bạn", "Your Full Name")}
                    placeholder={bilingual("Nguyễn Văn A", "Full Name")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <TactileInput
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
                    label={bilingual("Số điện thoại (Nhận tin nhắn / Zalo)", "Phone Number")}
                    type="tel"
                    placeholder="+1 (214) ... hoặc 090..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <TactileInput
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
                  <label className="text-xs font-semibold text-slate-800 tracking-wide font-serif">
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
                    className="w-full px-4 py-3 text-xs bg-sacred-card text-slate-900 rounded-xl border border-amber-200 placeholder:text-slate-500 focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700 min-h-[120px]"
                    required
                  />
                </div>

                {activeTab === "prayer" && (
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 pt-1 select-none">
                    <input
                      type="checkbox"
                      checked={isConfidential}
                      onChange={(e) => setIsConfidential(e.target.checked)}
                      className="rounded border-amber-300 text-primary-700 focus:ring-primary-700 w-4 h-4 cursor-pointer"
                    />
                    <span>
                      {bilingual(
                        "Giữ kín nhiệm (Chỉ chia sẻ riêng với Mục Sư & Ban Cầu Thay, không hiện lên tường công khai)",
                        "Keep confidential (Only visible to Pastor and Prayer team, not public)"
                      )}
                    </span>
                  </label>
                )}

                <div className="pt-2">
                  <TactileButton variant="primary" size="lg" type="submit" withCross className="w-full">
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
        </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
