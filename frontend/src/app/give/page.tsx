"use client";

import React, { useState } from "react";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { useLanguage } from "@/lib/i18n/language-context";
import { TactileButton } from "@/components/ui/tactile-button";
import { TactileInput } from "@/components/ui/tactile-input";
import {
  Heart,
  DollarSign,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  FileText,
} from "lucide-react";

export default function GivePage() {
  const { isEn, bilingual } = useLanguage();
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [fund, setFund] = useState<string>("discipleship");
  const [donorName, setDonorName] = useState<string>("");
  const [donorEmail, setDonorEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [activePaymentMethod, setActivePaymentMethod] = useState<"card" | "bank" | "qr">("card");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const presetAmounts = [25, 50, 100, 250, 500];

  const faqs = [
    {
      qVi: "Khoản dâng hiến của tôi được sử dụng vào việc gì?",
      qEn: "How are my donations and tithes utilized?",
      aVi: "100% các khoản dâng được chuyển trực tiếp vào các hoạt động trang bị người hầu việc Chúa: Học bổng thần học cho người khó khăn, biên soạn và in ấn tài liệu bồi linh, sản xuất video bài giảng miễn phí và công tác cứu trợ cộng đồng.",
      aEn: "100% of contributions directly support equipping servants of God: theological scholarships, translation and printing of discipleship books, free sermon production, and outreach relief.",
    },
    {
      qVi: "Tôi có nhận được biên nhận khấu trừ thuế IRS 501(c)(3) tại Mỹ không?",
      qEn: "Will I receive an IRS 501(c)(3) tax-deductible receipt?",
      aVi: "Có. Tất cả các khoản dâng hiến đều được hệ thống tự động lưu vào Sổ Quỹ và xuất biên nhận thuế cuối năm (Annual Contribution Statement) đáp ứng đầy đủ tiêu chuẩn khấu trừ thuế từ thiện theo luật định Hoa Kỳ.",
      aEn: "Yes. All donations automatically generate an annual IRS 501(c)(3) giving statement eligible for charitable tax deductions in the US.",
    },
    {
      qVi: "Tôi ở Việt Nam thì có thể dâng hiến bằng cách nào?",
      qEn: "How can donors in Vietnam contribute?",
      aVi: "Quý con cái Chúa có thể quét mã VietQR hoặc chuyển khoản trực tiếp qua tài khoản ngân hàng đại diện của ban mục vụ tại Việt Nam được hiển thị ở tab Chuyển Khoản Ngân Hàng / QR Code.",
      aEn: "Believers in Vietnam can scan VietQR or transfer directly to the official ministry banking accounts shown in the Bank Transfer / QR tab.",
    },
    {
      qVi: "Thông tin thẻ và tài khoản của tôi có được bảo mật an toàn?",
      qEn: "Is my payment and personal information secure?",
      aVi: "Tuyệt đối an toàn. Hệ thống tích hợp cổng thanh toán quốc tế Stripe mã hóa chuẩn PCI-DSS Level 1 cao nhất. SAM không bao giờ lưu trữ số thẻ ngân hàng của quý vị.",
      aEn: "Absolutely. Transactions are encrypted through Stripe with highest PCI-DSS Level 1 compliance. SAM never stores your sensitive card numbers.",
    },
  ];

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  const currentAmount = customAmount ? Number(customAmount) : selectedAmount;

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5]">
      <PublicHeader />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
        {/* Hero Banner */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FEF5EE] border border-[#F17F34]/40 text-[#DE6D22] text-xs font-semibold tracking-wider uppercase shadow-xs">
            <Heart className="w-3.5 h-3.5 text-[#F17F34]" />
            <span>{bilingual("Dâng Hiến Thuộc Linh", "Sacred Stewardship")}</span>
          </div>
          <h1 className="font-scripture text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {bilingual("Cùng Hiệp Lực Mở Mang Nước Chúa", "Honor The Lord With Giving")}
          </h1>
          <p className="text-xs sm:text-base text-slate-700 font-serif italic leading-relaxed pt-1">
            {bilingual(
              '"Hãy lấy tài vật và hoa quả đầu mùa của con mà tôn vinh Đức Giê-hô-va; thì các vựa lẫm con sẽ đầy tràn lúa miến." — Châm ngôn 3:9-10',
              '"Honor the Lord with your wealth, with the firstfruits of all your crops; then your barns will be filled to overflowing." — Proverbs 3:9-10'
            )}
          </p>
        </section>

        {/* 3 Pillars of Stewardship */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 bg-white rounded-2xl border border-amber-200/80 shadow-2xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#FEF5EE] border border-[#F17F34]/30 flex items-center justify-center text-[#F17F34]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-scripture text-lg font-bold text-slate-900">
              {bilingual("Trang Bị Tôi Tớ Chúa", "Equipping Servants")}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {bilingual(
                "Đài thọ học phí, sách vở và giáo trình Kinh Thánh cho các môn đồ, người lãnh đạo trẻ tại các vùng truyền giáo khó khăn.",
                "Sponsoring tuition, textbooks, and biblical curriculum for young disciples and emerging pastors in mission fields."
              )}
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-amber-200/80 shadow-2xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-800">
              <FileText className="w-5 h-5 text-amber-700" />
            </div>
            <h3 className="font-scripture text-lg font-bold text-slate-900">
              {bilingual("Ấn Phẩm & Video Miễn Phí", "Free Literature & Media")}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {bilingual(
                "Dịch thuật và phát hành miễn phí các tài liệu giải kinh, bài giảng bồi linh tương tác đến hàng ngàn con cái Chúa.",
                "Translating and distributing free expository notes, discipleship guides, and sermon videos to thousands."
              )}
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-amber-200/80 shadow-2xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <h3 className="font-scripture text-lg font-bold text-slate-900">
              {bilingual("Minh Bạch Chuẩn 501(c)(3)", "Transparent Accountability")}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {bilingual(
                "Báo cáo tài chính rõ ràng, tuân thủ nghiêm ngặt quy chế tổ chức tôn giáo bất vụ lợi và xuất biên nhận thuế cuối năm.",
                "Strict adherence to non-profit stewardship guidelines with instant receipts and year-end IRS deduction statements."
              )}
            </p>
          </div>
        </section>

        {/* Giving Form Box */}
        <section className="bg-white rounded-3xl border border-amber-200/90 shadow-md p-6 sm:p-10 max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F17F34] font-serif">
              {bilingual("Biểu Mẫu Dâng Hiến Trực Tuyến", "Online Contribution Form")}
            </span>
            <h2 className="font-scripture text-2xl sm:text-3xl font-bold text-slate-900">
              {bilingual("Tấm Lòng Dâng Cho Chúa", "Offer Your Gift")}
            </h2>
          </div>

          {isSuccess ? (
            <div className="p-8 rounded-2xl bg-[#FEF5EE] border border-[#F17F34]/40 text-center space-y-4 animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-[#F17F34] text-white mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-scripture text-2xl font-bold text-slate-900">
                {bilingual("Cảm Tạ Ơn Chúa & Chân Thành Cảm Ơn Quý Vị!", "Praise God & Thank You For Your Generosity!")}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 max-w-md mx-auto leading-relaxed">
                {bilingual(
                  `Chúng tôi đã ghi nhận tấm lòng dâng hiến $${currentAmount} USD vào Quỹ ${fund}. Biên nhận xác nhận đã được gửi đến email ${donorEmail || "của bạn"}.`,
                  `We have recorded your offering of $${currentAmount} USD toward the ${fund} fund. Confirmation has been emailed to ${donorEmail || "you"}.`
                )}
              </p>
              <TactileButton variant="primary" size="md" onClick={() => setIsSuccess(false)}>
                {bilingual("Dâng Thêm Khoản Khác", "Make Another Offering")}
              </TactileButton>
            </div>
          ) : (
            <form onSubmit={handleDonateSubmit} className="space-y-6">
              {/* Preset Amounts */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  {bilingual("Chọn số tiền dâng (USD):", "Select Amount (USD):")}
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                  {presetAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amt);
                        setCustomAmount("");
                      }}
                      className={`py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                        selectedAmount === amt && !customAmount
                          ? "bg-[#F17F34] text-white shadow-xs"
                          : "bg-[#FAF8F3] border border-amber-200 text-slate-800 hover:bg-amber-100/60"
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
                <div className="pt-1.5">
                  <input
                    type="number"
                    min="1"
                    placeholder={bilingual("Hoặc nhập số tiền tùy chọn ($USD)...", "Or enter custom amount ($USD)...")}
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(0);
                    }}
                    className="w-full px-4 py-2.5 text-xs bg-[#FAF8F3] border border-amber-200/80 rounded-xl text-slate-900 focus:outline-none focus:border-[#F17F34]"
                  />
                </div>
              </div>

              {/* Fund Designation */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  {bilingual("Chỉ định Quỹ Mục Vụ:", "Designate Fund:")}
                </label>
                <select
                  value={fund}
                  onChange={(e) => setFund(e.target.value)}
                  className="w-full px-4 py-3 text-xs font-semibold bg-[#FAF8F3] border border-amber-200/80 rounded-xl text-slate-800 focus:outline-none focus:border-[#F17F34] cursor-pointer"
                >
                  <option value="discipleship">
                    {bilingual("Quỹ Đào Tạo Môn Đồ Hóa (Discipleship & Training)", "Discipleship & Training Fund")}
                  </option>
                  <option value="tithe">
                    {bilingual("Dâng Phần Mười (Tithe - 10%)", "General Ministry Tithe")}
                  </option>
                  <option value="missions">
                    {bilingual("Quỹ Truyền Giáo & Học Bổng (Missions & Scholarships)", "Missions & Scholarships")}
                  </option>
                  <option value="media">
                    {bilingual("Quỹ Phát Triển Thư Viện & Video (Library & Vault)", "Media & Library Vault")}
                  </option>
                </select>
              </div>

              {/* Donor Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TactileInput
                  label={bilingual("Họ và tên người dâng", "Donor Full Name")}
                  placeholder={bilingual("Nguyễn Văn A hoặc Ẩn Danh", "Full Name or Anonymous")}
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  required
                />
                <TactileInput
                  label={bilingual("Địa chỉ Email nhận biên nhận thuế", "Email Address (For Tax Receipt)")}
                  type="email"
                  placeholder="tinhuu@gmail.com"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  required
                />
              </div>

              {/* Payment Methods Tabs */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  {bilingual("Phương thức dâng hiến:", "Payment Method:")}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setActivePaymentMethod("card")}
                    className={`p-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      activePaymentMethod === "card"
                        ? "bg-[#FEF5EE] border-2 border-[#F17F34] text-[#DE6D22]"
                        : "bg-[#FAF8F3] border border-amber-200 text-slate-700"
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#F17F34]" />
                    <span>{bilingual("Thẻ Quốc Tế / Stripe", "Credit Card / Stripe")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActivePaymentMethod("bank")}
                    className={`p-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      activePaymentMethod === "bank"
                        ? "bg-[#FEF5EE] border-2 border-[#F17F34] text-[#DE6D22]"
                        : "bg-[#FAF8F3] border border-amber-200 text-slate-700"
                    }`}
                  >
                    <Building className="w-5 h-5 text-amber-800" />
                    <span>{bilingual("Chuyển Khoản / ACH", "Bank Transfer / Zelle")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActivePaymentMethod("qr")}
                    className={`p-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      activePaymentMethod === "qr"
                        ? "bg-[#FEF5EE] border-2 border-[#F17F34] text-[#DE6D22]"
                        : "bg-[#FAF8F3] border border-amber-200 text-slate-700"
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-emerald-700" />
                    <span>{bilingual("Mã VietQR / Ví Điện Tử", "VietQR / Mobile Wallet")}</span>
                  </button>
                </div>

                {/* Sub details for payment */}
                {activePaymentMethod === "bank" && (
                  <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs space-y-1.5">
                    <p className="font-bold text-amber-950">
                      {bilingual("Thông Tin Tài Khoản Zelle / US Bank:", "US Bank / Zelle Info:")}
                    </p>
                    <p>Ngân hàng: Chase Bank USA | Account Name: Spiritual Advance Ministry</p>
                    <p>Zelle Email: <span className="font-mono font-bold text-[#F17F34]">give@saministry.org</span></p>
                  </div>
                )}

                {activePaymentMethod === "qr" && (
                  <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs space-y-1.5">
                    <p className="font-bold text-emerald-950">
                      {bilingual("Tài Khoản Đại Diện Tại Việt Nam:", "Vietnam Banking Representative:")}
                    </p>
                    <p>Ngân hàng: Vietcombank | Tên: BAN DIEU HANH SAM VIETNAM</p>
                    <p>Số tài khoản: <span className="font-mono font-bold text-emerald-900">0071000888SAM</span></p>
                    <p className="italic text-slate-500">Nội dung chuyển khoản: Ho Ten + SDT + Dang Hien SAM</p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <TactileButton variant="primary" size="lg" withCross type="submit" className="w-full">
                  <span>
                    {bilingual(
                      `Xác Nhận Dâng Hiến $${currentAmount} USD`,
                      `Confirm Offering of $${currentAmount} USD`
                    )}
                  </span>
                </TactileButton>
              </div>
            </form>
          )}
        </section>

        {/* FAQ Accordion */}
        <section className="space-y-6 max-w-3xl mx-auto">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F17F34] font-serif">
              {bilingual("Giải Đáp Thắc Mắc", "Frequently Asked Questions")}
            </span>
            <h2 className="font-scripture text-2xl sm:text-3xl font-bold text-slate-900">
              {bilingual("Chính Sách & Câu Hỏi Thường Gặp", "Stewardship Policies & FAQ")}
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-amber-200/80 overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left font-scripture font-bold text-slate-900 text-sm sm:text-base hover:text-[#F17F34] transition-colors cursor-pointer"
                  >
                    <span>{isEn ? faq.qEn : faq.qVi}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#F17F34] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 font-sans leading-relaxed border-t border-amber-100">
                      {isEn ? faq.aEn : faq.aVi}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
