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
    <div className="min-h-screen flex flex-col bg-[#FBF9F5]">
      <PublicHeader />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 space-y-12">
        {/* Header Title */}
        <section className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FEF5EE] border border-[#F17F34]/40 text-[#DE6D22] text-xs font-semibold tracking-wider uppercase shadow-xs">
            <Mail className="w-3.5 h-3.5 text-[#F17F34]" />
            <span>{bilingual("Kết Nối Mục Vụ", "Ministry Contact")}</span>
          </div>
          <h1 className="font-scripture text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {bilingual("Liên Hệ & Gửi Lời Cầu Thay", "Get in Touch & Prayer Wall")}
          </h1>
          <p className="text-xs sm:text-base text-slate-700 font-serif italic leading-relaxed">
            {bilingual(
              "Chúng tôi luôn lắng nghe, đồng hành và cầu nguyện cho mọi nan đề thuộc thể lẫn thuộc linh của quý vị.",
              "We are here to listen, stand in prayer, and partner with you for the glory of Christ."
            )}
          </p>
        </section>

        {/* 2 Columns: Contact Info & Interactive Forms */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Official Info & Map */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 bg-white rounded-2xl border border-amber-200/80 shadow-2xs space-y-5">
              <h3 className="font-scripture text-lg font-bold text-slate-900 border-b border-amber-100 pb-3">
                {bilingual("Thông Tin Chính Thức", "Official Contact")}
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FEF5EE] text-[#F17F34] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">
                      {bilingual("Trụ sở Dallas (USA):", "Dallas Headquarters:")}
                    </span>
                    <span className="text-slate-600">Dallas Main Campus, Texas, United States</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">
                      {bilingual("Văn phòng kết nối Việt Nam:", "Vietnam Office:")}
                    </span>
                    <span className="text-slate-600">TP. Hồ Chí Minh & các đối tác mục vụ toàn quốc</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">Hotline:</span>
                    <span className="text-slate-600">+1 (214) 555-SAM1 / +84 (028) 3888-SAM</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-800 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">Email:</span>
                    <a href="mailto:contact@saministry.org" className="text-[#F17F34] font-semibold hover:underline">
                      contact@saministry.org
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-800 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">
                      {bilingual("Giờ làm việc & Tương giao:", "Ministry Hours:")}
                    </span>
                    <span className="text-slate-600">Thứ Hai – Thứ Bảy: 8:00 AM – 6:00 PM (CST)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Map Representation */}
            <div className="p-4 bg-white rounded-2xl border border-amber-200/80 overflow-hidden shadow-2xs space-y-3">
              <span className="text-xs font-bold text-slate-800 font-serif block">
                {bilingual("Bản Đồ Chỉ Đường Trực Tuyến", "Sanctuary Geolocation")}
              </span>
              <div className="relative aspect-video rounded-xl bg-slate-100 border border-amber-200/60 overflow-hidden flex items-center justify-center text-center p-4">
                <div className="space-y-1">
                  <MapPin className="w-6 h-6 text-[#F17F34] mx-auto animate-bounce" />
                  <span className="text-xs font-bold text-slate-800 block">Spiritual Advance Ministry</span>
                  <span className="text-[11px] text-slate-500 block">Dallas, TX 75201, United States</span>
                  <a
                    href="https://maps.google.com/?q=Dallas,Texas"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#F17F34] font-semibold pt-1 hover:underline"
                  >
                    <span>{bilingual("Xem trên Google Maps", "Open in Google Maps")}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Form Tabs */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-amber-200/90 shadow-md p-6 sm:p-8 space-y-6">
            {/* Tab Selection */}
            <div className="flex items-center gap-2 p-1 bg-amber-50/70 rounded-2xl border border-amber-200/60">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("general");
                  setSubmitted(false);
                }}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "general"
                    ? "bg-[#F17F34] text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{bilingual("Liên Hệ Chung", "General Inquiry")}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("prayer");
                  setSubmitted(false);
                }}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "prayer"
                    ? "bg-[#F17F34] text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>{bilingual("Yêu Cầu Cầu Thay", "Prayer Request")}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("partner");
                  setSubmitted(false);
                }}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "partner"
                    ? "bg-[#F17F34] text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                <Handshake className="w-3.5 h-3.5" />
                <span>{bilingual("Đề Xuất Hợp Tác", "Partnership")}</span>
              </button>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-[#FEF5EE] border border-[#F17F34]/30 text-center space-y-4 animate-in fade-in">
                <div className="w-14 h-14 rounded-full bg-[#F17F34] text-white mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-scripture text-2xl font-bold text-slate-900">
                  {bilingual("Cảm Tạ Ơn Chúa, Chúng Tôi Đã Nhận Thông Điệp!", "Message Received! Praise The Lord!")}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 max-w-md mx-auto leading-relaxed">
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
                <TactileButton variant="primary" size="md" onClick={() => setSubmitted(false)}>
                  {bilingual("Gửi Tin Nhắn Khác", "Send Another Message")}
                </TactileButton>
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
                  <label className="text-xs font-semibold text-slate-800 tracking-wide">
                    {activeTab === "prayer"
                      ? bilingual("Chi tiết lời cầu nguyện & mong ước", "Detailed Prayer Request")
                      : activeTab === "partner"
                      ? bilingual("Mục đích & Nội dung đề xuất hợp tác", "Partnership Proposal Details")
                      : bilingual("Nội dung tin nhắn", "Your Message")}
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
                    className="w-full px-4 py-3 text-xs bg-[#FAF8F3] text-slate-900 rounded-xl border border-amber-200/90 focus:outline-none focus:border-[#F17F34] focus:ring-1 focus:ring-[#F17F34]/20"
                    required
                  />
                </div>

                {activeTab === "prayer" && (
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 pt-1">
                    <input
                      type="checkbox"
                      checked={isConfidential}
                      onChange={(e) => setIsConfidential(e.target.checked)}
                      className="rounded border-amber-300 text-[#F17F34] focus:ring-[#F17F34] w-4 h-4"
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
      </main>

      <PublicFooter />
    </div>
  );
}
