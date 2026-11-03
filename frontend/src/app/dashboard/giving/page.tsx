"use client";

import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { BentoCard } from "@/components/ui/bento-card";
import { TactileButton } from "@/components/ui/tactile-button";
import { AnnualTaxStatementModal } from "@/components/annual-tax-statement-modal";
import {
  DollarSign,
  Heart,
  CreditCard,
  Building,
  CheckCircle2,
  Calendar,
  FileText,
  Printer,
  ShieldCheck,
  TrendingUp,
  Plus,
  X,
  Lock,
  ArrowRight,
  Download,
} from "lucide-react";

interface DonationItem {
  id: string;
  amount: number;
  currency: string;
  fundType: string;
  frequency: string;
  status: string;
  paymentMethodType: string;
  donorName: string;
  donorEmail: string;
  donorAddress?: string | null;
  receiptNumber: string;
  taxDeductible: boolean;
  notes: string | null;
  createdAt: string;
}

interface GivingSummary {
  year: number;
  totalAmount: number;
  uniqueDonorsCount: number;
  totalDonationsCount: number;
  fundBreakdown: Record<string, number>;
  recentDonations: DonationItem[];
}

interface TaxReceiptDetails {
  churchName: string;
  churchEin: string;
  churchAddress: string;
  taxExemptStatus: string;
  statementClause: string;
  receipt: DonationItem;
}

const PRESET_AMOUNTS = [25, 50, 100, 250, 500];

const FUND_OPTIONS = [
  {
    id: "tithes",
    titleVi: "Quỹ Thập Phân (Tithes 10%)",
    titleEn: "Tithes (10% General Ministry)",
    descVi: "Đem hết thảy phần mười vào kho... (Ma-la-chi 3:10)",
    descEn: "Bring the whole tithe into the storehouse... (Malachi 3:10)",
    scripture: "Malachi 3:10",
  },
  {
    id: "missions",
    titleVi: "Quỹ Truyền Giáo (Missions)",
    titleEn: "Missions & Outreach Fund",
    descVi: "Nâng đỡ các giáo sĩ và điểm truyền giáo vùng sâu",
    descEn: "Supporting missionaries and global ministry reach",
    scripture: "Matthew 28:19",
  },
  {
    id: "building",
    titleVi: "Quỹ Xây Dựng Đền Thánh",
    titleEn: "Building & Facility Fund",
    descVi: "Bảo dưỡng nhà Chúa & phòng học Cơ Đốc giáo dục",
    descEn: "Sanctuary upkeep & Christian education classrooms",
    scripture: "Haggai 1:8",
  },
  {
    id: "benevolence",
    titleVi: "Quỹ Bác Ái & Thăm Viếng",
    titleEn: "Benevolence & Pastoral Care",
    descVi: "Giúp đỡ tín hữu khó khăn, người già neo đơn và tang chế",
    descEn: "Assisting families in hardship, seniors, and bereavement",
    scripture: "James 1:27",
  },
];

export default function GivingPage() {
  const { user } = useAuth();
  const { bilingual, isEn } = useLanguage();

  // Form states
  const [selectedAmount, setSelectedAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [selectedFund, setSelectedFund] = useState<string>("tithes");
  const [frequency, setFrequency] = useState<"one_time" | "monthly">("one_time");
  const [donorName, setDonorName] = useState(user?.fullName || "");
  const [donorEmail, setDonorEmail] = useState(user?.email || "");
  const [donorAddress, setDonorAddress] = useState("");
  const [donorNotes, setDonorNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "us_bank_account">("card");

  // Payment progress
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<DonationItem | null>(null);
  const [paymentError, setPaymentError] = useState("");

  // History & Admin Summary
  const [history, setHistory] = useState<DonationItem[]>([]);
  const [totalGiven, setTotalGiven] = useState(0);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [adminSummary, setAdminSummary] = useState<GivingSummary | null>(null);

  // Modals
  const [activeReceipt, setActiveReceipt] = useState<TaxReceiptDetails | null>(null);
  const [showAnnualStatementModal, setShowAnnualStatementModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualDonorName, setManualDonorName] = useState("");
  const [manualAmount, setManualAmount] = useState(100);
  const [manualFund, setManualFund] = useState("tithes");
  const [manualMethod, setManualMethod] = useState<"cash" | "check">("cash");
  const [manualNotes, setManualNotes] = useState("");
  const [recordingManual, setRecordingManual] = useState(false);

  const isPastorOrAdmin = user?.role === "senior_pastor" || user?.role === "admin";

  const loadGivingData = async () => {
    setLoadingHistory(true);
    try {
      // Load user history
      const res = await apiFetch<{ items: DonationItem[]; totalGiven: number }>(
        "/donations/my-history",
      );
      setHistory(res.items || []);
      setTotalGiven(res.totalGiven || 0);

      // Load admin summary if pastor
      if (isPastorOrAdmin) {
        try {
          const summary = await apiFetch<GivingSummary>("/donations/admin/summary");
          setAdminSummary(summary);
        } catch {
          // ignore if unauthorized
        }
      }
    } catch {
      // offline fallback
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (user) {
      setDonorName(user.fullName || "");
      setDonorEmail(user.email || "");
      loadGivingData();
    }
  }, [user]);

  const activeAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  const handleGiveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeAmount <= 0) {
      setPaymentError(
        bilingual(
          "Vui lòng chọn hoặc nhập số tiền dâng hiến hợp lệ.",
          "Please select or enter a valid donation amount."
        )
      );
      return;
    }

    if (!donorName.trim() || !donorEmail.trim()) {
      setPaymentError(
        bilingual(
          "Vui lòng điền họ tên và email để nhận biên nhận thuế.",
          "Please provide your full name and email to receive your tax receipt."
        )
      );
      return;
    }

    setProcessing(true);
    setPaymentError("");

    try {
      if (frequency === "one_time") {
        const res = await apiFetch<{ donation: DonationItem }>("/donations/create-intent", {
          method: "POST",
          body: JSON.stringify({
            amount: activeAmount,
            fundType: selectedFund,
            donorName: donorName.trim(),
            donorEmail: donorEmail.trim(),
            donorAddress: donorAddress.trim() || null,
            notes: donorNotes.trim() || null,
            paymentMethodType: paymentMethod,
          }),
        });
        setPaymentSuccess(res.donation);
      } else {
        const res = await apiFetch<{ donation: DonationItem }>(
          "/donations/create-subscription",
          {
            method: "POST",
            body: JSON.stringify({
              amount: activeAmount,
              fundType: selectedFund,
              frequency: "monthly",
              donorName: donorName.trim(),
              donorEmail: donorEmail.trim(),
              donorAddress: donorAddress.trim() || null,
              paymentMethodId: "pm_card_simulated",
            }),
          },
        );
        setPaymentSuccess(res.donation);
      }

      loadGivingData();
    } catch (err) {
      if (err instanceof ApiError) {
        setPaymentError(err.message);
      } else {
        setPaymentError(
          bilingual(
            "Không thể hoàn tất giao dịch dâng hiến. Vui lòng thử lại.",
            "Could not complete giving transaction. Please try again."
          )
        );
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleViewReceipt = async (donationId: string) => {
    try {
      const receiptData = await apiFetch<TaxReceiptDetails>(`/donations/receipt/${donationId}`);
      setActiveReceipt(receiptData);
    } catch {
      // fallback
    }
  };

  const handleRecordManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualDonorName.trim() || manualAmount <= 0) return;

    setRecordingManual(true);
    try {
      await apiFetch("/donations/admin/record-manual", {
        method: "POST",
        body: JSON.stringify({
          donorName: manualDonorName.trim(),
          amount: manualAmount,
          fundType: manualFund,
          paymentMethodType: manualMethod,
          notes: manualNotes.trim() || null,
        }),
      });

      setShowManualModal(false);
      setManualDonorName("");
      setManualNotes("");
      loadGivingData();
    } catch {
      // handle error
    } finally {
      setRecordingManual(false);
    }
  };

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amt);
  };

  return (
    <div className="space-y-8">
      {/* Sacred Grace Giving Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-950 text-white rounded-2xl border border-amber-400/30 shadow-md shadow-indigo-950/20">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-serif uppercase tracking-widest">
            <span>†</span>
            <span>{bilingual("Dâng Hiến Vì Nước Đức Chúa Trời & Hội Thánh", "Giving for the Kingdom of God & His Church")}</span>
          </div>
          <h1 className="font-scripture text-2xl sm:text-3xl font-bold tracking-tight">
            {bilingual("Dâng Hiến Trực Tuyến & Chứng Từ Thuế Hoa Kỳ", "Online Giving & US Tax Deductible Receipts")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            {bilingual(
              '"Mỗi người nên quyên tiền tùy theo lòng mình đã định, không phải miễn cưỡng hay vì ép uổng; vì Đức Chúa Trời yêu kẻ dâng của cách vui lòng." — 2 Cô-rinh-tô 9:7',
              '"Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver." — 2 Corinthians 9:7'
            )}
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-900/80 border border-amber-300/30 text-[11px] text-amber-200 backdrop-blur-xs">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>{bilingual("Quy chuẩn khấu trừ thuế IRS 501(c)(3) • Mã EIN: 75-3928174", "IRS 501(c)(3) Tax Deductible Compliance • EIN: 75-3928174")}</span>
          </div>
        </div>

        <div className="absolute right-6 -bottom-8 text-amber-500/10 font-serif text-9xl select-none pointer-events-none">
          †
        </div>
      </div>

      {/* PASTOR / ADMIN FINANCIAL OVERSIGHT */}
      {isPastorOrAdmin && adminSummary && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-amber-800 font-serif font-bold text-lg">†</span>
              <h2 className="font-scripture text-lg font-bold text-slate-900">
                {bilingual(`Báo Cáo Sổ Quỹ Dâng Hiến (Năm ${adminSummary.year})`, `Church Giving Treasury Report (Year ${adminSummary.year})`)}
              </h2>
            </div>
            <TactileButton
              variant="gold"
              size="sm"
              onClick={() => setShowManualModal(true)}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>{bilingual("Ghi Nhận Tiền Mặt / Séc", "Record Cash / Check")}</span>
            </TactileButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <BentoCard
              title={bilingual("Tổng Quỹ Nhận Được", "Total Giving Received")}
              subtitle={bilingual("Stripe, Thẻ & Tiền Mặt", "Stripe, Cards & Cash")}
            >
              <div className="text-2xl sm:text-3xl font-scripture font-bold text-slate-900 mt-2">
                {formatCurrency(adminSummary.totalAmount)}
              </div>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">
                {bilingual(`${adminSummary.totalDonationsCount} lượt dâng hiến`, `${adminSummary.totalDonationsCount} donations`)}
              </p>
            </BentoCard>

            <BentoCard
              title={bilingual("Quỹ Thập Phân (Tithes)", "Tithes (10% General)")}
              subtitle={bilingual("Dâng phần mười", "Ten percent tithe")}
            >
              <div className="text-2xl sm:text-3xl font-scripture font-bold text-indigo-950 mt-2">
                {formatCurrency(adminSummary.fundBreakdown?.tithes || 0)}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {bilingual("Nền tảng mục vụ chung", "General church ministry")}
              </p>
            </BentoCard>

            <BentoCard
              title={bilingual("Quỹ Truyền Giáo (Missions)", "Missions & Outreach")}
              subtitle={bilingual("Chuyến đi truyền giáo", "Global & local missions")}
            >
              <div className="text-2xl sm:text-3xl font-scripture font-bold text-amber-900 mt-2">
                {formatCurrency(adminSummary.fundBreakdown?.missions || 0)}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {bilingual("Hỗ trợ các giáo sĩ", "Supporting gospel workers")}
              </p>
            </BentoCard>

            <BentoCard
              title={bilingual("Quỹ Xây Dựng (Building)", "Building Fund")}
              subtitle={bilingual("Cơ sở đền thánh", "Sanctuary & classrooms")}
            >
              <div className="text-2xl sm:text-3xl font-scripture font-bold text-emerald-900 mt-2">
                {formatCurrency(adminSummary.fundBreakdown?.building || 0)}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {bilingual("Bảo dưỡng phòng học", "Facilities maintenance")}
              </p>
            </BentoCard>
          </div>
        </section>
      )}

      {/* Main Giving Form & History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Giving Terminal (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-amber-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-amber-100 pb-4">
            <div>
              <h2 className="font-scripture text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="text-amber-800 font-serif">†</span>
                <span>{bilingual("Phiếu Dâng Hiến Trực Tuyến", "Online Giving Terminal")}</span>
              </h2>
              <p className="text-xs text-slate-500 font-serif mt-0.5">
                {bilingual("Bảo mật mã hóa 256-bit chuẩn ngân hàng Stripe", "256-bit bank-grade encryption powered by Stripe")}
              </p>
            </div>

            {/* Frequency Tab */}
            <div className="flex p-1 bg-[#FBF9F5] border border-amber-200 rounded-xl">
              <button
                type="button"
                onClick={() => setFrequency("one_time")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  frequency === "one_time"
                    ? "bg-indigo-950 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {bilingual("Dâng 1 Lần", "One-Time")}
              </button>
              <button
                type="button"
                onClick={() => setFrequency("monthly")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  frequency === "monthly"
                    ? "bg-indigo-950 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {bilingual("Dâng Định Kỳ Hàng Tháng", "Monthly Recurring")}
              </button>
            </div>
          </div>

          {paymentSuccess ? (
            <div className="p-6 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-scripture text-xl font-bold text-emerald-950">
                  {bilingual("Cảm Tạ Chúa! Khoản Dâng Đã Hoàn Tất", "Praise the Lord! Your Giving is Complete")}
                </h3>
                <p className="text-xs text-emerald-800 max-w-md mx-auto">
                  {bilingual(
                    `Khoản dâng ${formatCurrency(paymentSuccess.amount)} cho ${paymentSuccess.fundType.toUpperCase()} đã được ghi nhận vào sổ quỹ Hội Thánh.`,
                    `Your gift of ${formatCurrency(paymentSuccess.amount)} towards ${paymentSuccess.fundType.toUpperCase()} has been recorded in the church ledger.`
                  )}
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-emerald-100 text-xs text-slate-700 max-w-sm mx-auto space-y-1.5 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-500">{bilingual("Mã Biên Nhận Thuế:", "Tax Receipt #:")}</span>
                  <span className="font-bold text-indigo-950">{paymentSuccess.receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{bilingual("Thời gian:", "Date:")}</span>
                  <span>{new Date(paymentSuccess.createdAt).toLocaleString(isEn ? "en-US" : "vi-VN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{bilingual("Người dâng:", "Donor:")}</span>
                  <span className="font-medium">{paymentSuccess.donorName}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => handleViewReceipt(paymentSuccess.id)}
                  className="px-4 py-2 rounded-xl bg-indigo-950 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-indigo-900 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-300" />
                  <span>{bilingual("Xem Biên Nhận Thuế 501(c)(3)", "View 501(c)(3) Receipt")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentSuccess(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  {bilingual("Dâng Khoản Khác", "Give Another Amount")}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleGiveSubmit} className="space-y-6">
              {paymentError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                  {paymentError}
                </div>
              )}

              {/* Amount Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider font-serif">
                  {bilingual("1. Chọn Số Tiền Dâng Hiến (USD)", "1. Select Gift Amount (USD)")}
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                  {PRESET_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amt);
                        setCustomAmount("");
                      }}
                      className={`py-3 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                        selectedAmount === amt && !customAmount
                          ? "bg-indigo-950 text-amber-300 border-indigo-950 shadow-sm"
                          : "bg-[#FCFBF8] text-slate-800 border-amber-200/80 hover:bg-amber-100/50"
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                      $
                    </span>
                    <input
                      type="number"
                      min="1"
                      placeholder={bilingual("Hoặc nhập số tiền tùy chọn...", "Or enter custom amount...")}
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full h-11 pl-8 pr-4 bg-[#FCFBF8] border border-amber-200/90 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Fund Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider font-serif">
                  {bilingual("2. Chọn Quỹ Dâng Hiến", "2. Designate Giving Fund")}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FUND_OPTIONS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSelectedFund(f.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        selectedFund === f.id
                          ? "bg-amber-50/70 border-amber-500 ring-1 ring-amber-500/30"
                          : "bg-[#FCFBF8] border-amber-200/80 hover:bg-amber-50/40"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs text-slate-900">
                          {isEn ? f.titleEn : f.titleVi}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                          {isEn ? f.descEn : f.descVi}
                        </p>
                      </div>
                      <span className="text-[10px] text-amber-800 font-serif font-semibold mt-2">
                        📖 {f.scripture}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Donor Information for IRS 501(c)(3) */}
              <div className="space-y-3 pt-2 border-t border-amber-100">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider font-serif">
                  {bilingual("3. Thông Tin Tín Hữu Nhận Chứng Từ Thuế IRS", "3. Donor Details for IRS 501(c)(3) Receipt")}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {bilingual("Họ và Tên Đầy Đủ *", "Full Legal Name *")}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={bilingual("Ví dụ: John Tran", "e.g., John Tran")}
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full h-10 px-3 bg-[#FCFBF8] border border-amber-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {bilingual("Email Nhận Biên Nhận *", "Tax Receipt Email *")}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="email@example.com"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="w-full h-10 px-3 bg-[#FCFBF8] border border-amber-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block font-semibold text-slate-700 mb-1">
                    {bilingual("Địa Chỉ Cư Trú Tại Hoa Kỳ (In trên hồ sơ thuế Form 1040)", "US Street Address (Printed on Form 1040 Schedule A)")}
                  </label>
                  <input
                    type="text"
                    placeholder={bilingual(
                      "Ví dụ: 1234 Preston Rd, Plano, TX 75024",
                      "e.g., 1234 Preston Rd, Plano, TX 75024"
                    )}
                    value={donorAddress}
                    onChange={(e) => setDonorAddress(e.target.value)}
                    className="w-full h-10 px-3 bg-[#FCFBF8] border border-amber-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="text-xs">
                  <label className="block font-semibold text-slate-700 mb-1">
                    {bilingual("Ghi Chú / Lời Tạ Ơn (Tùy chọn)", "Prayer Notes / Dedication (Optional)")}
                  </label>
                  <input
                    type="text"
                    placeholder={bilingual("Ví dụ: Dâng tạ ơn Chúa ban phước cho gia đình", "e.g., In thanksgiving for family blessings")}
                    value={donorNotes}
                    onChange={(e) => setDonorNotes(e.target.value)}
                    className="w-full h-10 px-3 bg-[#FCFBF8] border border-amber-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2 pt-2 border-t border-amber-100">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider font-serif">
                  {bilingual("4. Phương Thức Thanh Toán Chuẩn Hoa Kỳ", "4. US Payment Method")}
                </label>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                      paymentMethod === "card"
                        ? "bg-indigo-950 text-white border-indigo-950"
                        : "bg-[#FCFBF8] text-slate-700 border-amber-200"
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-amber-300" />
                    <span className="font-semibold">
                      {bilingual("Thẻ Tín Dụng / Ghi Nợ (Stripe)", "Credit / Debit Card (Stripe)")}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("us_bank_account")}
                    className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                      paymentMethod === "us_bank_account"
                        ? "bg-indigo-950 text-white border-indigo-950"
                        : "bg-[#FCFBF8] text-slate-700 border-amber-200"
                    }`}
                  >
                    <Building className="w-4 h-4 text-amber-300" />
                    <span className="font-semibold">
                      {bilingual("Chuyển Khoản Ngân Hàng (ACH)", "US Bank Transfer (ACH)")}
                    </span>
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <TactileButton
                  variant="gold"
                  size="lg"
                  type="submit"
                  disabled={processing}
                  className="w-full text-base"
                >
                  <Heart className="w-4 h-4 mr-2 fill-current" />
                  <span>
                    {processing
                      ? bilingual("Đang Xử Lý Giao Dịch Thánh...", "Processing Sacred Gift...")
                      : bilingual(`Hoàn Tất Dâng Hiến ${formatCurrency(activeAmount)}`, `Complete Offering of ${formatCurrency(activeAmount)}`)}
                  </span>
                </TactileButton>

                <p className="text-[11px] text-center text-slate-400 mt-2 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>
                    {bilingual(
                      "Xử lý an toàn qua hạ tầng Stripe. Tiền dâng được chuyển thẳng vào tài khoản Hội Thánh.",
                      "Secured by Stripe banking infrastructure. Funds deposit directly to church treasury."
                    )}
                  </span>
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Giving History & 501(c)(3) Statement (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Member Giving Summary Card */}
          <div className="p-6 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-2xl border border-amber-400/30 shadow-md space-y-3">
            <div className="flex items-center justify-between text-xs text-amber-300 font-serif uppercase tracking-widest">
              <span>† {bilingual("Tổng Dâng Hiến Năm 2026", "2026 Total Giving")}</span>
              <span>{bilingual("Khấu Trừ Thuế 100%", "100% Tax Deductible")}</span>
            </div>
            <div className="text-3xl sm:text-4xl font-scripture font-bold text-amber-300">
              {formatCurrency(totalGiven)}
            </div>
            <p className="text-xs text-slate-300 font-serif leading-relaxed">
              {bilingual(
                "Mọi khoản dâng hiến của bạn đều được lưu trữ và tổng hợp sẵn sàng cho việc xuất báo cáo thuế cuối năm gửi cơ quan thuế Hoa Kỳ (IRS).",
                "All your contributions are recorded and ready for year-end IRS charitable deduction filing (Form 1040)."
              )}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAnnualStatementModal(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/50 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <FileText className="w-4 h-4 text-amber-300" />
                <span>{bilingual("Xuất Báo Cáo Thuế Thường Niên (IRS Form 1040)", "Export Annual IRS Tax Statement (Form 1040)")}</span>
              </button>
            </div>
          </div>

          {/* Giving History Table */}
          <div className="bg-white rounded-2xl border border-amber-200/80 shadow-xs overflow-hidden">
            <div className="p-4 bg-[#FCFBF8] border-b border-amber-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-amber-800 font-serif font-bold">†</span>
                <h3 className="font-scripture text-sm font-bold text-slate-900">
                  {bilingual(`Lịch Sử Dâng Hiến Của Bạn (${history.length})`, `Your Giving History (${history.length})`)}
                </h3>
              </div>
            </div>

            <div className="divide-y divide-amber-100/60 max-h-[420px] overflow-y-auto">
              {loadingHistory ? (
                <div className="p-8 text-center text-xs text-slate-500 font-serif">
                  {bilingual('"Đang tra cứu sổ quỹ..."', '"Loading contribution history..."')}
                </div>
              ) : history.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <FileText className="w-8 h-8 mx-auto text-amber-700/50" />
                  <p className="text-xs text-slate-500">
                    {bilingual("Chưa có giao dịch dâng hiến trực tuyến nào.", "No online contributions yet.")}
                  </p>
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 flex items-center justify-between gap-3 hover:bg-[#FCFBF8] transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {formatCurrency(item.amount)}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-950 border border-indigo-200">
                          {item.fundType}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString(isEn ? "en-US" : "vi-VN")} •{" "}
                        <span className="font-serif">{item.receiptNumber}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleViewReceipt(item.id)}
                      className="px-2.5 py-1.5 rounded-lg border border-amber-200 bg-white hover:bg-amber-50 text-indigo-950 text-xs font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
                      title={bilingual("Xem biên nhận thuế", "View tax receipt")}
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-800" />
                      <span>{bilingual("Chứng Từ", "Receipt")}</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* OFFICIAL IRS 501(c)(3) TAX RECEIPT MODAL */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FCFBF8] border-2 border-amber-400 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative">
            <button
              onClick={() => setActiveReceipt(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Header */}
            <div className="text-center space-y-2 border-b-2 border-amber-200/80 pb-5">
              <span className="text-amber-800 font-serif text-3xl font-bold select-none">†</span>
              <h3 className="font-scripture text-2xl font-bold text-slate-900">
                {activeReceipt.churchName}
              </h3>
              <p className="text-xs text-slate-600 font-serif">{activeReceipt.churchAddress}</p>
              <div className="inline-block px-3 py-1 rounded-full bg-amber-100/70 text-amber-900 text-xs font-bold border border-amber-300">
                IRS 501(c)(3) EIN: {activeReceipt.churchEin}
              </div>
            </div>

            {/* Receipt Details */}
            <div className="space-y-4 text-xs">
              <div className="flex justify-between border-b border-amber-100 pb-2">
                <span className="text-slate-500 font-semibold">{bilingual("MÃ BIÊN NHẬN THUẾ:", "TAX RECEIPT #:")}</span>
                <span className="font-mono font-bold text-slate-900">
                  {activeReceipt.receipt.receiptNumber}
                </span>
              </div>

              <div className="flex justify-between border-b border-amber-100 pb-2">
                <span className="text-slate-500 font-semibold">{bilingual("TÍN HỮU DÂNG HIẾN:", "DONOR NAME:")}</span>
                <span className="font-bold text-slate-900">{activeReceipt.receipt.donorName}</span>
              </div>

              <div className="flex justify-between border-b border-amber-100 pb-2">
                <span className="text-slate-500 font-semibold">{bilingual("EMAIL & ĐỊA CHỈ:", "EMAIL & ADDRESS:")}</span>
                <span className="text-right text-slate-800 font-serif">
                  {activeReceipt.receipt.donorEmail}
                  <br />
                  {activeReceipt.receipt.donorAddress || "United States"}
                </span>
              </div>

              <div className="flex justify-between border-b border-amber-100 pb-2">
                <span className="text-slate-500 font-semibold">{bilingual("MỤC ĐÍCH / QUỸ DÂNG:", "DESIGNATED FUND:")}</span>
                <span className="font-bold uppercase text-amber-900">
                  {activeReceipt.receipt.fundType}
                </span>
              </div>

              <div className="flex justify-between border-b-2 border-indigo-950 pb-3 pt-1 text-sm">
                <span className="font-bold text-slate-900">{bilingual("TỔNG SỐ TIỀN DÂNG (USD):", "TOTAL GIFT AMOUNT (USD):")}</span>
                <span className="font-bold text-indigo-950 text-base">
                  {formatCurrency(activeReceipt.receipt.amount)}
                </span>
              </div>

              {/* Legal IRS Statement */}
              <div className="p-4 bg-white rounded-xl border border-amber-200/80 space-y-1.5 font-serif text-[11px] text-slate-600 leading-relaxed italic">
                <p className="font-bold text-slate-800 not-italic">
                  {bilingual("Tuyên Bố Pháp Lý Khấu Trừ Thuế:", "IRS Charitable Tax Disclosure:")}
                </p>
                <p>"{activeReceipt.statementClause}"</p>
                <p className="text-[10px] text-slate-500 not-italic pt-1">
                  {bilingual(
                    "Biên nhận này hợp lệ để nộp kèm hồ sơ khai thuế liên bang Hoa Kỳ (Form 1040, Schedule A).",
                    "This official receipt satisfies IRS requirements for substantiating charitable deductions (Form 1040, Schedule A)."
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] text-slate-500 font-serif">
                {bilingual("Ban Thư Ký & Thủ Quỹ Hội Thánh", "Church Secretary & Treasurer")}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-indigo-950 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-indigo-900 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-300" />
                  <span>{bilingual("In Chứng Từ PDF", "Print PDF Receipt")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RECORD MANUAL DONATION MODAL (Pastor / Admin) */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FCFBF8] border border-amber-300/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-amber-200/70 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-amber-800 font-serif font-bold text-xl">†</span>
                <h3 className="font-scripture text-lg font-bold text-slate-900">
                  {bilingual("Ghi Nhận Dâng Hiến Tiền Mặt / Séc (Check)", "Record Cash / Check Contribution")}
                </h3>
              </div>
              <button
                onClick={() => setShowManualModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordManual} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  {bilingual("Tên Tín Hữu Dâng Hiến *", "Donor Full Name *")}
                </label>
                <input
                  type="text"
                  required
                  placeholder={bilingual("Ví dụ: Bà Sarah Nguyen", "e.g., Sarah Nguyen")}
                  value={manualDonorName}
                  onChange={(e) => setManualDonorName(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-amber-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    {bilingual("Số Tiền Dâng (USD) *", "Amount (USD) *")}
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={manualAmount}
                    onChange={(e) => setManualAmount(parseFloat(e.target.value) || 0)}
                    className="w-full h-10 px-3 bg-white border border-amber-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    {bilingual("Hình Thức Dâng", "Payment Type")}
                  </label>
                  <select
                    value={manualMethod}
                    onChange={(e) => setManualMethod(e.target.value as "cash" | "check")}
                    className="w-full h-10 px-3 bg-white border border-amber-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="cash">{bilingual("Tiền Mặt (Cash)", "Cash")}</option>
                    <option value="check">{bilingual("Séc Ngân Hàng (Check)", "Bank Check")}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  {bilingual("Quỹ Dâng", "Giving Fund")}
                </label>
                <select
                  value={manualFund}
                  onChange={(e) => setManualFund(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-amber-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="tithes">{bilingual("Quỹ Thập Phân (Tithes)", "Tithes")}</option>
                  <option value="missions">{bilingual("Quỹ Truyền Giáo (Missions)", "Missions")}</option>
                  <option value="building">{bilingual("Quỹ Xây Dựng Đền Thánh (Building)", "Building Fund")}</option>
                  <option value="benevolence">{bilingual("Quỹ Bác Ái & Thăm Viếng", "Benevolence")}</option>
                  <option value="general">{bilingual("Quỹ Chung", "General Fund")}</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  {bilingual("Ghi Chú (Số Check hoặc dịp dâng)", "Notes (Check # or dedication)")}
                </label>
                <input
                  type="text"
                  placeholder={bilingual("Ví dụ: Check #2041 dâng ngày Lễ Tạ Ơn", "e.g., Check #2041 Thanksgiving Offering")}
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-amber-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
                >
                  {bilingual("Hủy Bỏ", "Cancel")}
                </button>
                <TactileButton variant="primary" size="md" type="submit" disabled={recordingManual}>
                  {recordingManual
                    ? bilingual("Đang Ghi Sổ...", "Recording...")
                    : bilingual("Ghi Sổ Quỹ & Cấp Mã Thuế", "Record & Generate Tax Receipt")}
                </TactileButton>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ANNUAL IRS 501(c)(3) TAX STATEMENT MODAL */}
      <AnnualTaxStatementModal
        isOpen={showAnnualStatementModal}
        onClose={() => setShowAnnualStatementModal(false)}
        isAdmin={isPastorOrAdmin}
      />
    </div>
  );
}
