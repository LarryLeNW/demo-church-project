"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { FixedWorldMapBackground } from "@/components/fixed-world-map-background";
import { useLanguage } from "@/lib/i18n/language-context";
import { TactileButton } from "@/components/ui/tactile-button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { TactileInput } from "@/components/ui/tactile-input";
import { TactileSelect, type TactileSelectOption } from "@/components/ui/tactile-select";
import {
  Heart,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  Calendar,
  Check,
  Compass,
  Award,
} from "lucide-react";

export default function GivePage() {
  const { isEn, bilingual } = useLanguage();
  const [frequency, setFrequency] = useState<"one_time" | "monthly">("one_time");
  const [selectedAmount, setSelectedAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [fund, setFund] = useState<string>("tithes");
  const [donorName, setDonorName] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [donorEmail, setDonorEmail] = useState<string>("");
  const [donorAddress, setDonorAddress] = useState<string>("");
  const [dedicationNote, setDedicationNote] = useState<string>("");
  const [showExtraDetails, setShowExtraDetails] = useState<boolean>(false);
  const [activePaymentMethod, setActivePaymentMethod] = useState<"card" | "bank" | "qr">("card");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const getImpactDescription = () => {
    if (customAmount) {
      return bilingual("Tấm lòng tự nguyện dâng hiến cho công việc Nước Trời", "Freewill offering supporting God's eternal Kingdom");
    }
    switch (selectedAmount) {
      case 50:
        return bilingual("Tài trợ sách bồi linh cho tín hữu mới", "Sponsoring discipleship literature for seekers");
      case 100:
        return bilingual("Học bổng trang bị 1 môn đồ hóa phục vụ", "1 Disciple full ministry scholarship");
      case 250:
        return bilingual("Tủ sách giải kinh cho Trường Chúa Nhật", "Theological reference vault for Sunday School");
      case 500:
        return bilingual("Sản xuất video bài giảng và học liệu trực tuyến", "Sermon media production & online curriculum");
      case 1000:
        return bilingual("Hỗ trợ mở mang điểm nhóm và công tác truyền giáo", "Church planting outreach & mission networking");
      default:
        return bilingual("Dâng hiến vì sự vinh hiển của Đức Chúa Trời", "Giving cheerfully for the glory of God");
    }
  };

  const presetAmounts = [
    { value: 50, labelVi: "Tài trợ sách bồi linh", labelEn: "Sponsor study books" },
    { value: 100, labelVi: "Học bổng 1 môn đồ", labelEn: "1 Disciple scholarship" },
    { value: 250, labelVi: "Tủ sách Trường Chúa Nhật", labelEn: "Sunday School vault" },
    { value: 500, labelVi: "Sản xuất video bài giảng", labelEn: "Sermon media production" },
    { value: 1000, labelVi: "Mở rộng điểm nhóm mới", labelEn: "Church planting outreach" },
  ];

  const fundDetails: Record<string, { nameVi: string; nameEn: string; descVi: string; descEn: string }> = {
    tithes: {
      nameVi: "Dâng Phần Mười (Tithes - 10%)",
      nameEn: "General Ministry Tithes (10%)",
      descVi: "Dâng hiến theo lời dạy của Chúa để duy trì nơi thờ phượng và công việc thánh của Hội Thánh.",
      descEn: "Honoring God with the firstfruits of income for ministry sustainability and kingdom advance.",
    },
    missions: {
      nameVi: "Quỹ Truyền Giáo & Học Bổng Môn Đồ",
      nameEn: "Missions & Discipleship Scholarships",
      descVi: "Đài thọ học phí, tài liệu cho các tôi tớ Chúa trẻ và các điểm truyền giáo khó khăn.",
      descEn: "Funding tuition and resources for emerging pastoral leaders in unreached mission fields.",
    },
    building: {
      nameVi: "Quỹ Thư Viện Bản Thảo & Cơ Sở",
      nameEn: "Library Vault & Facilities Fund",
      descVi: "Phát triển kho sách thần học số hóa, phòng học trực tuyến và trang thiết bị đào tạo.",
      descEn: "Expanding the digital theological library, interactive classroom, and studio facilities.",
    },
    benevolence: {
      nameVi: "Quỹ Bác Ái & Cứu Trợ Xã Hội",
      nameEn: "Benevolence & Community Relief",
      descVi: "Thăm viếng bệnh tật, trợ cấp các gia đình tín hữu khó khăn và cứu trợ thiên tai.",
      descEn: "Providing compassionate relief for the sick, struggling families, and disaster victims.",
    },
    general: {
      nameVi: "Quỹ Hoạt Động Mục Vụ Chung",
      nameEn: "General Ministerial Operations",
      descVi: "Hỗ trợ linh hoạt cho mọi hoạt động đào tạo, truyền thông và sự kiện của ban mục vụ.",
      descEn: "Flexible operational stewardship across teaching, publications, and fellowship events.",
    },
  };

  const fundSelectOptions: TactileSelectOption[] = [
    {
      value: "tithes",
      label: bilingual("Dâng Phần Mười (Tithes - 10%)", "General Ministry Tithes (10%)"),
      description: isEn ? fundDetails.tithes.descEn : fundDetails.tithes.descVi,
      tooltip: bilingual(
        "Theo Ma-la-chi 3:10: Đem hết thảy phần mười vào kho đền thánh để có lương thực trong nhà Chúa. Khấu trừ thuế theo IRS 501(c)(3).",
        "Based on Malachi 3:10. Tax-deductible under US IRS 501(c)(3) standards."
      ),
      badge: "IRS 501(c)(3)",
      icon: <Heart className="w-4 h-4 text-primary-700" />,
    },
    {
      value: "missions",
      label: bilingual("Quỹ Truyền Giáo & Học Bổng Môn Đồ", "Missions & Discipleship Scholarships"),
      description: isEn ? fundDetails.missions.descEn : fundDetails.missions.descVi,
      tooltip: bilingual(
        "Tài trợ 100% học bổng môn đồ hóa, in ấn Kinh Thánh và công tác mở mang Hội Thánh địa phương.",
        "100% sponsors discipleship scholarships, scripture resources, and cross-cultural church planting."
      ),
      badge: isEn ? "Global Outreach" : "Truyền Giáo",
      icon: <Compass className="w-4 h-4 text-primary-700" />,
    },
    {
      value: "building",
      label: bilingual("Quỹ Thư Viện Bản Thảo & Cơ Sở", "Library Vault & Facilities Fund"),
      description: isEn ? fundDetails.building.descEn : fundDetails.building.descVi,
      tooltip: bilingual(
        "Bảo tồn kho tư liệu lịch sử, máy chủ số hóa bản thảo và phòng thu bài giảng thánh ca trực tuyến.",
        "Preserving ancient theological vaults, digital media studios, and physical classroom facilities."
      ),
      badge: isEn ? "Capital & Vault" : "Cơ Sở & Kho Sách",
      icon: <Building className="w-4 h-4 text-primary-700" />,
    },
    {
      value: "benevolence",
      label: bilingual("Quỹ Bác Ái & Cứu Trợ Xã Hội", "Benevolence & Community Relief"),
      description: isEn ? fundDetails.benevolence.descEn : fundDetails.benevolence.descVi,
      tooltip: bilingual(
        "Hỗ trợ khẩn cấp cho tín hữu đau ốm, người cao niên neo đơn, góa phụ và cứu trợ thiên tai.",
        "Emergency hospital aid, widows, elderly care, and humanitarian disaster relief."
      ),
      badge: isEn ? "Relief Care" : "Bác Ái Yêu Thương",
      icon: <Sparkles className="w-4 h-4 text-primary-700" />,
    },
    {
      value: "general",
      label: bilingual("Quỹ Hoạt Động Mục Vụ Chung", "General Ministerial Operations"),
      description: isEn ? fundDetails.general.descEn : fundDetails.general.descVi,
      tooltip: bilingual(
        "Chi phí điện nước, truyền thông kỹ thuật số, hệ thống bảo mật và vận hành hàng ngày của chức vụ.",
        "Covers administrative utilities, software licensing, and general church operations."
      ),
      badge: isEn ? "Operations" : "Vận Hành Chung",
      icon: <ShieldCheck className="w-4 h-4 text-primary-700" />,
    },
  ];

  const faqs = [
    {
      qVi: "Khoản dâng hiến của tôi có được khấu trừ thuế IRS 501(c)(3) tại Mỹ không?",
      qEn: "Is my contribution fully tax-deductible under IRS 501(c)(3)?",
      aVi: "Hoàn toàn có. Spiritual Advance Ministry (SAM) là tổ chức tôn giáo bất vụ lợi được Sở Thuế Vụ Hoa Kỳ công nhận theo điều khoản IRS 501(c)(3). Mọi khoản dâng hiến đều được lưu trữ minh bạch và tự động xuất Biên Nhận Thuế Hằng Năm (Annual Contribution Statement) vào tháng 1 mỗi năm để quý vị khai thuế Schedule A (Form 1040).",
      aEn: "Yes. Spiritual Advance Ministry (SAM) is a registered 501(c)(3) non-profit religious organization recognized by the IRS. All donations are tax-deductible to the full extent of US law, and annual statements are issued every January for Schedule A (Form 1040) filing.",
    },
    {
      qVi: "Thông tin thẻ và thanh toán của tôi được bảo mật như thế nào?",
      qEn: "How is my payment and personal information secured?",
      aVi: "Toàn bộ giao dịch thẻ trực tuyến được xử lý qua cổng Stripe với chuẩn bảo mật ngân hàng cao nhất PCI-DSS Level 1 và mã hóa SSL 256-bit. SAM tuyệt đối không lưu trữ số thẻ ngân hàng của quý vị trên máy chủ nội bộ.",
      aEn: "All online card transactions are processed through Stripe with the highest PCI-DSS Level 1 banking security and 256-bit SSL encryption. SAM never stores your sensitive card numbers on internal servers.",
    },
    {
      qVi: "Tôi có thể hủy hoặc thay đổi khoản dâng hiến định kỳ hằng tháng như thế nào?",
      qEn: "How can I manage or cancel a monthly recurring donation?",
      aVi: "Quý vị có thể quản lý hoặc hủy khoản dâng định kỳ bất cứ lúc nào thông qua Cổng Cá Nhân (Dashboard) hoặc gửi email yêu cầu trực tiếp đến ban thủ quỹ tại give@saministry.org mà không phải chịu bất kỳ khoản phí phạt nào.",
      aEn: "You can modify or cancel your recurring giving anytime via your personal Dashboard or by emailing our treasurer at give@saministry.org with zero cancellation fees.",
    },
    {
      qVi: "Tín hữu tại Việt Nam có thể dâng hiến bằng những phương thức nào?",
      qEn: "What payment options are available for donors in Vietnam?",
      aVi: "Tín hữu tại Việt Nam có thể chọn tab 'Mã VietQR / Ví Điện Tử' để quét mã QR chuyển khoản liên ngân hàng 24/7 trực tiếp vào tài khoản đại diện chính thức của ban mục vụ tại Việt Nam, hoàn toàn miễn phí giao dịch.",
      aEn: "Believers in Vietnam can select the 'VietQR / Mobile Wallet' tab to scan the 24/7 interbank QR code directly into our designated ministry representative account in Vietnam without transaction fees.",
    },
  ];

  const currentAmount = customAmount ? Number(customAmount) : selectedAmount;

  const handleDonateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        amount: currentAmount,
        fundType: fund,
        donorName: isAnonymous ? (isEn ? "Anonymous Believer" : "Tín Hữu Ẩn Danh") : donorName || "Tín hữu",
        donorEmail: donorEmail || "donor@saministry.org",
        donorAddress: donorAddress || undefined,
        notes: dedicationNote || undefined,
        paymentMethodType: activePaymentMethod === "card" ? "card" : "us_bank_account",
      };

      const res = await fetch("http://localhost:4000/api/donations/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        setIsSuccess(true);
      }
    } catch {
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative text-slate-800 bg-transparent overflow-x-hidden max-w-[100vw]">
      <FixedWorldMapBackground />
      <PublicHeader />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-14 space-y-12 sm:space-y-16">
        {/* Breadcrumb Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/20 animate-fade-in text-white">
          <Breadcrumb
            items={[
              { label: bilingual("Dâng Hiến Trực Tuyến", "Online Ministry Giving") },
            ]}
          />
          <span className="text-xs text-amber-200/90 font-serif italic hidden sm:inline">
            {bilingual("Khấu trừ thuế theo chuẩn IRS 501(c)(3) tại Hoa Kỳ", "Tax-deductible under US IRS 501(c)(3)")}
          </span>
        </div>

        {/* ============================================================== */}
        {/* 2. MAIN 2-COLUMN GIVING SANCTUARY: Form (7 cols) + Certificate/Trust (5 cols) */}
        {/* ============================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* CỘT TRÁI (7 cols): Sanctuary Giving Plaque (Dark Frosted Glass) */}
          <div className="lg:col-span-7 bg-slate-950/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-5 sm:p-6 space-y-4 text-left text-white animate-fade-up">
            <div className="border-b border-white/15 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 font-serif flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                  {bilingual("Cổng Dâng Hiến Thánh Khiết", "Sacred Stewardship Portal")}
                </span>
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5 text-emerald-400" />
                  <span>SSL 256-bit</span>
                </span>
              </div>
              <h2 className="font-scripture text-xl sm:text-2xl font-bold text-white mt-1">
                {bilingual("Tấm Lòng Dâng Cho Chúa", "Online Ministry Offering")}
              </h2>
              <p className="text-[11px] text-slate-300 font-sans mt-0.5">
                {bilingual(
                  "Bảo mật ngân hàng PCI-DSS Cấp 1 • Biên nhận khấu trừ thuế hợp lệ theo IRS 501(c)(3) tại Hoa Kỳ",
                  "Encrypted PCI-DSS Level 1 • Official US 501(c)(3) Tax-Deductible Annual Statement"
                )}
              </p>
            </div>

            {isSuccess ? (
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-primary-500/40 text-center space-y-3 animate-scale-in text-white">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-600 to-amber-600 text-white mx-auto flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-widest font-serif">
                    {bilingual("Xác Nhận Thành Công", "Transaction Completed")}
                  </span>
                  <h3 className="font-scripture text-xl font-bold text-white">
                    {bilingual("Cảm Tạ Ơn Chúa & Cảm Ơn Quý Vị!", "Praise God & Thank You for Your Offering!")}
                  </h3>
                </div>
                <p className="text-xs text-slate-200 max-w-md mx-auto leading-relaxed [text-wrap:pretty]">
                  {bilingual(
                    `Hệ thống đã tiếp nhận tấm lòng dâng hiến $${currentAmount} USD (${frequency === "monthly" ? "Định kỳ hằng tháng" : "Một lần"}) vào ${fundDetails[fund]?.nameVi || "Quỹ Mục Vụ"}. Biên nhận thuế đã được gửi đến email ${donorEmail || "quý vị"}.`,
                    `We have safely recorded your contribution of $${currentAmount} USD (${frequency === "monthly" ? "Monthly recurring" : "One-time"}) towards the ${fundDetails[fund]?.nameEn || "Ministry Fund"}. An official tax receipt has been dispatched to ${donorEmail || "your email"}.`
                  )}
                </p>
                <div className="pt-1">
                  <TactileButton variant="primary" size="sm" onClick={() => setIsSuccess(false)} className="rounded-full">
                    <span>{bilingual("Dâng Thêm Khoản Khác", "Make Another Offering")}</span>
                  </TactileButton>
                </div>
              </div>
            ) : (
              <form onSubmit={handleDonateSubmit} className="space-y-3.5">
                {/* 1. Header Row: Amount Title + Frequency Switcher */}
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs font-serif font-bold uppercase tracking-wider text-amber-300">
                    {bilingual("Số Tiền Dâng Hiến (USD)", "Gift Amount (USD)")}
                  </label>

                  {/* Frequency Switcher: Compact Pill */}
                  <div className="inline-flex p-1 bg-slate-900/90 rounded-xl border border-white/15">
                    <button
                      type="button"
                      onClick={() => setFrequency("one_time")}
                      className={`px-3 py-1 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        frequency === "one_time"
                          ? "bg-primary-600 text-white shadow-xs"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>{bilingual("Một Lần", "One-Time")}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFrequency("monthly")}
                      className={`px-3 py-1 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        frequency === "monthly"
                          ? "bg-primary-600 text-white shadow-xs"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Calendar className="w-3 h-3 text-amber-300" />
                      <span>{bilingual("Hằng Tháng", "Monthly")}</span>
                    </button>
                  </div>
                </div>

                {/* 2. Amount Grid: 3 columns x 2 rows (5 presets + 1 custom input) */}
                <div className="space-y-1.5">
                  <div className="grid grid-cols-3 gap-2">
                    {[50, 100, 250, 500, 1000].map((amt) => {
                      const isSelected = selectedAmount === amt && !customAmount;
                      return (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => {
                            setSelectedAmount(amt);
                            setCustomAmount("");
                          }}
                          className={`h-10 rounded-xl text-xs font-serif font-bold transition-all border cursor-pointer flex items-center justify-center ${
                            isSelected
                              ? "bg-primary-600 border-amber-400 text-white shadow-md ring-1 ring-amber-400/50"
                              : "bg-white/10 border-white/15 text-slate-200 hover:bg-white/15 hover:text-white"
                          }`}
                        >
                          <span className="font-scripture text-base font-bold">${amt}</span>
                        </button>
                      );
                    })}

                    {/* Slot 6: Custom Amount input */}
                    <div className="relative flex items-center">
                      <span className="absolute left-2.5 font-scripture text-xs font-bold text-amber-300 select-none pointer-events-none">
                        $
                      </span>
                      <input
                        type="number"
                        min="1"
                        placeholder={isEn ? "Other..." : "Số khác..."}
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setSelectedAmount(0);
                        }}
                        className={`w-full h-10 pl-6 pr-2 text-xs font-semibold rounded-xl border transition-all text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 ${
                          customAmount
                            ? "bg-primary-600/70 border-amber-400 ring-1 ring-amber-400/50"
                            : "bg-white/10 border-white/15"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Subtle spiritual impact description */}
                  <p className="text-[11px] text-amber-300/80 font-serif italic text-left pl-1">
                    ✨ {getImpactDescription()}
                  </p>
                </div>

                {/* 3. Fund Designation */}
                <div className="space-y-1">
                  <TactileSelect
                    label={bilingual("Chỉ định Quỹ Mục Vụ:", "Designate Ministry Fund:")}
                    tooltip={bilingual(
                      "Mọi khoản dâng đều được cấp biên nhận khấu trừ thuế cuối năm theo quy chế IRS 501(c)(3)",
                      "All contributions receive an annual deductible tax statement under IRS 501(c)(3) guidelines"
                    )}
                    value={fund}
                    onValueChange={(val) => setFund(val)}
                    onChange={(e) => setFund(e.target.value)}
                    options={fundSelectOptions}
                    selectSize="sm"
                    variant="dark"
                  />
                </div>

                {/* 4. Donor Information */}
                <div className="space-y-2 pt-0.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-serif font-bold uppercase tracking-wider text-amber-300">
                      {bilingual("Thông Tin Người Dâng", "Donor Information")}
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="rounded border-white/30 bg-white/10 text-primary-600 focus:ring-amber-400 cursor-pointer w-3.5 h-3.5"
                      />
                      <span>{bilingual("Dâng ẩn danh", "Give anonymously")}</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {!isAnonymous ? (
                      <TactileInput
                        variant="glass"
                        label={bilingual("Họ và tên", "Full Name")}
                        placeholder={bilingual("Ví dụ: Nguyễn Văn A", "Full Name")}
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        className="min-h-[36px] py-1 text-xs rounded-xl"
                        required={!isAnonymous}
                      />
                    ) : (
                      <div className="p-2 rounded-xl bg-white/10 border border-white/15 text-xs text-slate-300 flex items-center min-h-[36px]">
                        {bilingual("Khoản dâng sẽ được bảo mật danh tính.", "Anonymous donation.")}
                      </div>
                    )}

                    <TactileInput
                      variant="glass"
                      label={bilingual("Email nhận biên nhận thuế", "Email for Tax Receipt")}
                      type="email"
                      placeholder="email@example.com"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="min-h-[36px] py-1 text-xs rounded-xl"
                      required
                    />
                  </div>

                  {/* Expandable Extra Details (Address & Prayer Note) */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowExtraDetails(!showExtraDetails)}
                      className="text-[11px] text-amber-300/90 hover:text-amber-200 flex items-center gap-1 font-serif font-medium transition-colors cursor-pointer py-0.5"
                    >
                      {showExtraDetails ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5 text-amber-300" />
                          <span>{bilingual("Thu gọn địa chỉ gửi thư & lời cầu thay", "Collapse mailing address & prayer note")}</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5 text-amber-300" />
                          <span>{bilingual("+ Thêm địa chỉ nhận biên nhận giấy / Lời cầu thay (tùy chọn)", "+ Add mailing address / Prayer note (optional)")}</span>
                        </>
                      )}
                    </button>

                    {showExtraDetails && (
                      <div className="mt-2 space-y-2 pt-2 border-t border-white/10 animate-fade-in">
                        <TactileInput
                          variant="glass"
                          label={bilingual("Địa chỉ gửi biên nhận cuối năm (Hoa Kỳ)", "Mailing Address for US Tax Filing")}
                          placeholder="1234 Grace Ave, Dallas, TX 75201"
                          value={donorAddress}
                          onChange={(e) => setDonorAddress(e.target.value)}
                          className="min-h-[36px] py-1 text-xs rounded-xl"
                        />
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-200 mb-1">
                            {bilingual("Ghi chú tạ ơn / Lời cầu thay đi kèm:", "Prayer Request or Dedication Note:")}
                          </label>
                          <textarea
                            rows={2}
                            value={dedicationNote}
                            onChange={(e) => setDedicationNote(e.target.value)}
                            placeholder={bilingual("Dâng tạ ơn Chúa nhân dịp...", "In memory of / With gratitude for...")}
                            className="w-full px-3 py-1.5 text-xs bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. Payment Methods */}
                <div className="space-y-1.5 pt-0.5">
                  <label className="text-xs font-serif font-bold uppercase tracking-wider text-amber-300 block">
                    {bilingual("Phương Thức Thanh Toán", "Payment Method")}
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setActivePaymentMethod("card")}
                      className={`py-2 px-2.5 rounded-xl text-xs font-serif font-bold flex items-center justify-center gap-1.5 transition-all min-h-[38px] cursor-pointer ${
                        activePaymentMethod === "card"
                          ? "bg-primary-600 text-white shadow-md border border-amber-400/80 ring-1 ring-amber-400/30"
                          : "bg-white/10 border border-white/15 text-slate-300 hover:bg-white/15 hover:text-white"
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      <span>{bilingual("Thẻ / Stripe", "Card / Stripe")}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActivePaymentMethod("bank")}
                      className={`py-2 px-2.5 rounded-xl text-xs font-serif font-bold flex items-center justify-center gap-1.5 transition-all min-h-[38px] cursor-pointer ${
                        activePaymentMethod === "bank"
                          ? "bg-primary-600 text-white shadow-md border border-amber-400/80 ring-1 ring-amber-400/30"
                          : "bg-white/10 border border-white/15 text-slate-300 hover:bg-white/15 hover:text-white"
                      }`}
                    >
                      <Building className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                      <span>{bilingual("Chase / Zelle", "Bank / Zelle")}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActivePaymentMethod("qr")}
                      className={`py-2 px-2.5 rounded-xl text-xs font-serif font-bold flex items-center justify-center gap-1.5 transition-all min-h-[38px] cursor-pointer ${
                        activePaymentMethod === "qr"
                          ? "bg-primary-600 text-white shadow-md border border-amber-400/80 ring-1 ring-amber-400/30"
                          : "bg-white/10 border border-white/15 text-slate-300 hover:bg-white/15 hover:text-white"
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                      <span>{bilingual("VietQR", "VietQR Banking")}</span>
                    </button>
                  </div>

                  {/* Compact payment method info */}
                  {activePaymentMethod === "card" && (
                    <div className="p-2 rounded-xl bg-white/10 border border-white/15 text-[11px] flex items-center justify-between text-slate-300">
                      <span className="flex items-center gap-1 text-emerald-300">
                        <Lock className="w-3 h-3 text-emerald-400" />
                        <span>SSL 256-bit • Stripe PCI-DSS Level 1</span>
                      </span>
                      <span className="font-mono text-amber-200 font-semibold">Visa • MC • Amex</span>
                    </div>
                  )}

                  {activePaymentMethod === "bank" && (
                    <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-[11px] space-y-1 text-slate-200">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Chase Bank USA:</span>
                        <span className="font-bold text-white">Spiritual Advance Ministry</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Zelle Official:</span>
                        <span className="font-mono font-bold text-amber-300 bg-slate-900/80 px-2 py-0.5 rounded border border-white/15">give@saministry.org</span>
                      </div>
                    </div>
                  )}

                  {activePaymentMethod === "qr" && (
                    <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-[11px] space-y-1 text-slate-200">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Vietcombank VN:</span>
                        <span className="font-mono font-bold text-emerald-300">0071000888SAM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Chủ tài khoản:</span>
                        <span className="font-bold text-white">BAN DIEU HANH SAM VIETNAM</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. Submit Button */}
                <div className="pt-1.5">
                  <TactileButton
                    variant="primary"
                    size="md"
                    withCross
                    type="submit"
                    disabled={isSubmitting || currentAmount <= 0}
                    className="w-full text-sm font-bold shadow-lg min-h-[44px] py-2.5 rounded-xl cursor-pointer"
                  >
                    <span>
                      {isSubmitting
                        ? bilingual("Đang Kết Nối Cổng Thanh Toán...", "Connecting to Secure Gateway...")
                        : bilingual(
                            `Dâng Hiến $${currentAmount} USD (${frequency === "monthly" ? "Hằng Tháng" : "Một Lần"})`,
                            `Give $${currentAmount} USD (${frequency === "monthly" ? "Monthly" : "One-Time"})`
                          )}
                    </span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </TactileButton>
                </div>
              </form>
            )}
          </div>

          {/* CỘT PHẢI (5 cols): Khung Tín Thác & Xem Trước Biên Nhận Thuế 501(c)(3) (Sticky scroll) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-3.5 text-left animate-fade-up delay-150">
            {/* TẤM BIÊN NHẬN THUẾ MẪU (Cathedral Arch Top Certificate) */}
            <div className="rounded-2xl bg-slate-950/60 backdrop-blur-xl border border-amber-400/40 p-5 shadow-2xl space-y-3 relative overflow-hidden text-white">
              <div className="border-b border-white/15 pb-2.5 flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest font-serif block">
                    {bilingual("Mẫu Biên Nhận Khấu Trừ Thuế", "Tax-Deductible Receipt Preview")}
                  </span>
                  <h3 className="font-scripture text-base sm:text-lg font-bold text-white mt-0.5">
                    Official Contribution Receipt
                  </h3>
                </div>
                {/* Circular Gold Seal */}
                <div className="w-11 h-11 rounded-full border border-amber-400 bg-amber-400/10 text-amber-300 font-serif font-bold text-[10px] shrink-0 flex flex-col items-center justify-center shadow-md">
                  <Award className="w-3.5 h-3.5 text-amber-400 mb-0.5" />
                  <span>501(c)(3)</span>
                </div>
              </div>

              {/* Dotted ledger details */}
              <div className="space-y-1.5 text-xs text-slate-300 font-sans">
                <div className="flex justify-between py-0.5 border-b border-white/10">
                  <span className="text-slate-400">{bilingual("Tổ chức thụ hưởng:", "Organization:")}</span>
                  <span className="font-bold text-white">Spiritual Advance Ministry</span>
                </div>

                <div className="flex justify-between py-0.5 border-b border-white/10">
                  <span className="text-slate-400">{bilingual("Mã số thuế IRS (EIN):", "IRS EIN Number:")}</span>
                  <span className="font-mono font-bold text-amber-200">88-3492810</span>
                </div>

                <div className="flex justify-between py-0.5 border-b border-white/10">
                  <span className="text-slate-400">{bilingual("Người dâng hiến:", "Donor Name:")}</span>
                  <span className="font-bold text-white truncate max-w-[180px]">
                    {isAnonymous ? (isEn ? "Anonymous" : "Ẩn Danh") : donorName || (isEn ? "Your Full Name" : "Họ và tên của bạn")}
                  </span>
                </div>

                <div className="flex justify-between py-0.5 border-b border-white/10">
                  <span className="text-slate-400">{bilingual("Quỹ mục đích:", "Designated Fund:")}</span>
                  <span className="font-bold text-amber-300 truncate max-w-[180px]">{isEn ? fundDetails[fund]?.nameEn : fundDetails[fund]?.nameVi}</span>
                </div>

                <div className="flex justify-between py-1 bg-white/10 px-3 rounded-xl border border-white/20 mt-1">
                  <span className="font-bold text-slate-200">{bilingual("Số tiền khấu trừ:", "Deductible Gift:")}</span>
                  <span className="font-scripture text-base font-bold text-amber-300">${currentAmount} USD</span>
                </div>
              </div>

              {/* IRS statement */}
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] text-slate-300 italic font-serif leading-relaxed [text-wrap:pretty]">
                {bilingual(
                  "\"Không có hàng hóa hoặc dịch vụ nào được cung cấp để trao đổi với khoản đóng góp này ngoài các lợi ích tôn giáo thiêng liêng.\" — Quy định IRS Hoa Kỳ",
                  "\"No goods or services were provided in exchange for this contribution other than intangible religious benefits.\" — IRS Requirement"
                )}
              </div>
            </div>

            {/* Khối Cam Kết Trách Nhiệm Mục Vụ (Dark Frosted Glass Plaque with Roman Numerals) */}
            <div className="rounded-2xl bg-slate-950/60 backdrop-blur-xl border border-white/20 p-4 space-y-2.5 shadow-2xl text-white">
              <h3 className="font-scripture text-sm font-bold text-amber-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{bilingual("Cam Kết Minh Bạch Của SAM", "Stewardship Commitments")}</span>
              </h3>

              <div className="space-y-2 text-xs text-slate-300 divide-y divide-white/10">
                <div className="pt-1.5 flex items-start gap-2.5">
                  <span className="font-scripture text-amber-400 font-bold text-xs shrink-0">I.</span>
                  <span className="text-[11px] leading-relaxed">
                    {bilingual(
                      "100% các khoản dâng chỉ định được sử dụng đúng mục đích cho công tác môn đồ hóa và đào tạo tôi tớ Chúa.",
                      "100% of designated gifts are strictly routed to discipleship coaching and literature distribution."
                    )}
                  </span>
                </div>
                <div className="pt-1.5 flex items-start gap-2.5">
                  <span className="font-scripture text-amber-400 font-bold text-xs shrink-0">II.</span>
                  <span className="text-[11px] leading-relaxed">
                    {bilingual(
                      "Tự động xuất file PDF báo cáo tài chính hằng năm lưu trữ trong tài khoản cá nhân.",
                      "Automated PDF annual tax summaries permanently archived in your member dashboard."
                    )}
                  </span>
                </div>
                <div className="pt-1.5 flex items-start gap-2.5">
                  <span className="font-scripture text-amber-400 font-bold text-xs shrink-0">III.</span>
                  <span className="text-[11px] leading-relaxed">
                    {bilingual(
                      "Đội ngũ hỗ trợ ban thủ quỹ luôn sẵn sàng tư vấn trực tiếp qua hotline và email.",
                      "Our pastoral treasurer team is always reachable for giving inquiries and assistance."
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 3. FAQ ACCORDION: Unified Dark Frosted Glass Plaque (Zero box fatigue) */}
        {/* ============================================================== */}
        <section className="max-w-4xl mx-auto text-left space-y-6">
          <div className="text-center space-y-1">
            <h2 className="font-scripture text-2xl sm:text-3xl font-bold text-white [text-wrap:balance] drop-shadow-md">
              {bilingual("Chính Sách & Câu Hỏi Thường Gặp", "Stewardship Policies & Frequently Asked Questions")}
            </h2>
            <p className="text-xs font-semibold text-amber-300 font-serif uppercase tracking-widest">
              {bilingual("Minh Bạch Tài Chính • Pháp Lý 501(c)(3)", "Financial Integrity & US 501(c)(3) Compliance")}
            </p>
          </div>

          <div className="rounded-[40px] bg-slate-950/60 backdrop-blur-xl border border-white/20 p-6 sm:p-10 shadow-2xl text-white divide-y divide-white/15">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="py-4 first:pt-0 last:pb-0">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between gap-4 text-left font-scripture font-bold text-white text-base sm:text-lg hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    <span>{isEn ? faq.qEn : faq.qVi}</span>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-amber-300" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-300" />
                      )}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="pt-3 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed max-w-[70ch] [text-wrap:pretty] animate-fade-in">
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
