"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { useLanguage } from "@/lib/i18n/language-context";
import {
  FileText,
  Printer,
  X,
  CheckCircle2,
  Calendar,
  Building,
  ShieldCheck,
  Search,
} from "lucide-react";
import { TactileButton } from "@/components/ui/tactile-button";

export interface AnnualTaxStatementData {
  taxYear: number;
  generatedDate: string;
  statementNumber: string;
  church: {
    name: string;
    vietnameseName: string;
    ein: string;
    status: string;
    address: string;
    phone: string;
    email: string;
    website: string;
  };
  donor: {
    fullName: string;
    email: string;
    address: string | null;
  };
  summary: {
    totalContributions: number;
    currency: string;
    fundBreakdown: Record<string, number>;
    contributionsCount: number;
  };
  contributions: Array<{
    date: string;
    receiptNumber: string | null;
    fundType: string;
    paymentMethodType: string;
    amount: number;
    notes: string | null;
  }>;
  legalDisclaimer: string;
  signatories: {
    seniorPastor: {
      name: string;
      title: string;
    };
    treasurer: {
      name: string;
      title: string;
    };
  };
}

interface AnnualTaxStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialYear?: number;
  isAdmin?: boolean;
}

export function AnnualTaxStatementModal({
  isOpen,
  onClose,
  initialYear = new Date().getFullYear(),
  isAdmin = false,
}: AnnualTaxStatementModalProps) {
  const { bilingual, isEn } = useLanguage();
  const [year, setYear] = useState<number>(initialYear);
  const [donorEmail, setDonorEmail] = useState<string>("");
  const [statement, setStatement] = useState<AnnualTaxStatementData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadStatement(year, donorEmail);
    }
  }, [isOpen, year]);

  async function loadStatement(targetYear: number, emailToQuery?: string) {
    try {
      setLoading(true);
      setError(null);
      const url =
        isAdmin && emailToQuery?.trim()
          ? `/api/donations/admin/annual-statement?email=${encodeURIComponent(emailToQuery.trim())}&year=${targetYear}`
          : `/api/donations/annual-statement?year=${targetYear}`;

      const res = await apiFetch<AnnualTaxStatementData>(url);
      setStatement(res);
    } catch (err) {
      console.error("Lỗi tải báo cáo thuế:", err);
      setError(
        bilingual(
          "Không thể tải báo cáo dâng hiến cho năm được chọn.",
          "Could not load contribution statement for selected year.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  if (!isOpen) return null;

  const fundLabels: Record<string, { vi: string; en: string }> = {
    tithes: { vi: "Thập phân (Tithes)", en: "Tithes & General Fund" },
    missions: { vi: "Truyền giáo (Missions)", en: "World & Local Missions" },
    building: { vi: "Xây dựng Đền Thánh (Building)", en: "Sanctuary Building Fund" },
    benevolence: { vi: "Bác ái (Benevolence)", en: "Benevolence & Care" },
    general: { vi: "Quỹ chung (General)", en: "Operating Ministry Fund" },
  };

  const methodLabels: Record<string, { vi: string; en: string }> = {
    card: { vi: "Thẻ ngân hàng (Stripe Card)", en: "Credit / Debit Card (Stripe)" },
    ach_bank_transfer: { vi: "Chuyển khoản trực tiếp (ACH)", en: "ACH Direct Bank Transfer" },
    check: { vi: "Séc (Check)", en: "Bank Check" },
    cash: { vi: "Tiền mặt (Cash)", en: "Cash" },
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#FCFBF8] border-2 border-amber-400/90 rounded-2xl max-w-3xl w-full p-4 sm:p-8 shadow-2xl space-y-6 relative max-h-[92vh] overflow-y-auto print:max-h-none print:overflow-visible print:border-none print:shadow-none print:p-0">
        {/* Controls Bar (Hidden during print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/80 pb-4 print:hidden">
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-slate-800 font-serif">
              {bilingual("Năm Tính Thuế:", "Tax Year:")}
            </label>
            <div className="flex gap-1.5">
              {[2026, 2025, 2024].map((y) => (
                <button
                  key={y}
                  onClick={() => setYear(y)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    year === y
                      ? "bg-indigo-950 text-white shadow-xs"
                      : "bg-white text-slate-700 border border-amber-200 hover:bg-amber-50"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-2">
              <input
                type="email"
                placeholder={bilingual("Tra cứu email tín hữu...", "Search member email...")}
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                className="h-8 px-2.5 text-xs bg-white border border-amber-200 rounded-lg w-48 text-slate-900"
              />
              <button
                onClick={() => loadStatement(year, donorEmail)}
                className="px-2.5 py-1.5 bg-amber-800 text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-amber-900"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <TactileButton variant="primary" size="sm" onClick={handlePrint}>
              <Printer className="w-3.5 h-3.5 mr-1" />
              <span>{bilingual("In / Lưu PDF", "Print / Save PDF")}</span>
            </TactileButton>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-2">
            <span className="text-amber-800 font-serif text-3xl font-bold animate-spin inline-block">†</span>
            <p className="text-xs font-serif italic text-slate-600">
              {bilingual(
                "Đang khởi tạo chứng từ thuế Form 1040...",
                "Generating official IRS Form 1040 contribution statement...",
              )}
            </p>
          </div>
        ) : error ? (
          <div className="py-12 text-center text-xs text-rose-700 font-semibold">{error}</div>
        ) : statement ? (
          <div className="space-y-6 text-slate-900">
            {/* Church Letterhead */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-indigo-950 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-800 font-serif text-3xl font-bold select-none">†</span>
                  <div>
                    <h2 className="font-scripture text-2xl font-bold text-indigo-950 leading-tight">
                      {statement.church.name}
                    </h2>
                    <h3 className="text-xs font-serif text-amber-800 font-semibold">
                      {statement.church.vietnameseName}
                    </h3>
                  </div>
                </div>
                <div className="text-[11px] text-slate-600 mt-2 space-y-0.5">
                  <p>{statement.church.address}</p>
                  <p>
                    Tel: {statement.church.phone} • Email: {statement.church.email} • {statement.church.website}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <div className="inline-block bg-emerald-50 border border-emerald-300 text-emerald-900 px-3 py-1.5 rounded-lg text-xs font-bold text-left sm:text-right">
                  <div>{statement.church.status}</div>
                  <div className="text-emerald-800 font-mono mt-0.5">
                    IRS EIN: <strong>{statement.church.ein}</strong>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 mt-2 font-mono">
                  Statement #: {statement.statementNumber}
                </div>
              </div>
            </div>

            {/* Document Title Banner */}
            <div className="bg-[#F8F6F0] border-y border-amber-200/90 py-3 text-center">
              <h3 className="font-scripture text-lg font-bold uppercase tracking-wider text-slate-900">
                Annual Contribution Statement — Tax Year {statement.taxYear}
              </h3>
              <p className="text-[11px] font-serif italic text-amber-900">
                {bilingual(
                  "Chứng Từ Dâng Hiến Khấu Trừ Thuế Thường Niên (IRS Form 1040, Schedule A)",
                  "Official IRS 501(c)(3) Charitable Contribution Substantiation (Schedule A)",
                )}
              </p>
            </div>

            {/* Donor & Period Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-amber-200/70 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  {bilingual("Thông Tin Tín Hữu (Donor Information)", "Donor Information")}
                </div>
                <div className="font-bold text-sm text-slate-900">{statement.donor.fullName}</div>
                <div className="text-slate-600">{statement.donor.email}</div>
                <div className="text-slate-500 font-serif">{statement.donor.address}</div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-amber-200/70 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  {bilingual("Thời Kỳ Khai Thuế (Tax Filing Period)", "Tax Filing Period")}
                </div>
                <div className="font-semibold text-slate-900">
                  01/01/{statement.taxYear} — 12/31/{statement.taxYear}
                </div>
                <div className="text-slate-600">
                  {bilingual("Tổng số giao dịch:", "Total Contributions:")}{" "}
                  <strong>{statement.summary.contributionsCount}</strong> {bilingual("lần", "records")}
                </div>
                <div className="text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {bilingual(
                      "Đầy đủ giá trị pháp lý khấu trừ thuế từ thiện Hoa Kỳ",
                      "Meets all IRS 501(c)(3) substantiation requirements",
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Summary by Fund & Total Banner */}
            <div className="bg-amber-50/60 border border-amber-300 rounded-xl p-4 space-y-3">
              <div className="text-xs font-bold uppercase text-amber-950 font-serif tracking-wider">
                {bilingual("Tổng Hợp Dâng Hiến Theo Từng Quỹ Mục Vụ", "Summary of Contributions by Fund")}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(statement.summary.fundBreakdown).map(([fund, amount]) => (
                  <div
                    key={fund}
                    className="flex justify-between items-center py-1 border-b border-amber-200/60"
                  >
                    <span className="text-slate-600">
                      {isEn ? (fundLabels[fund]?.en || fund) : (fundLabels[fund]?.vi || fund)}:
                    </span>
                    <span className="font-bold text-slate-900">
                      ${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t-2 border-amber-500 flex justify-between items-center">
                <span className="text-sm font-bold text-indigo-950 font-scripture">
                  {bilingual("TỔNG DÂNG HIẾN KHẤU TRỪ THUẾ:", "TOTAL TAX-DEDUCTIBLE CONTRIBUTIONS:")}
                </span>
                <span className="text-2xl font-bold font-scripture text-amber-900">
                  ${statement.summary.totalContributions.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Itemized Contributions Table */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase text-slate-800 font-serif tracking-wider">
                {bilingual(
                  `Chi Tiết Từng Lần Dâng Hiến Trong Năm ${statement.taxYear}`,
                  `Itemized Contribution Record for Tax Year ${statement.taxYear}`,
                )}
              </div>
              <div className="border border-amber-200 rounded-xl overflow-hidden bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8F6F0] text-slate-700 border-b border-amber-200">
                    <tr>
                      <th className="py-2.5 px-3">{bilingual("Ngày", "Date")}</th>
                      <th className="py-2.5 px-3">{bilingual("Mã Biên Nhận", "Receipt #")}</th>
                      <th className="py-2.5 px-3">{bilingual("Quỹ Mục Vụ", "Fund")}</th>
                      <th className="py-2.5 px-3">{bilingual("Phương Thức", "Method")}</th>
                      <th className="py-2.5 px-3 text-right">{bilingual("Số Tiền", "Amount")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100">
                    {statement.contributions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-400 italic">
                          {bilingual(
                            "Không có khoản dâng hiến nào được ghi nhận trong năm tính thuế này.",
                            "No contributions recorded for this tax year.",
                          )}
                        </td>
                      </tr>
                    ) : (
                      statement.contributions.map((c, idx) => (
                        <tr key={idx} className="hover:bg-amber-50/30">
                          <td className="py-2 px-3 text-slate-700">{c.date}</td>
                          <td className="py-2 px-3 font-mono text-[11px] text-slate-500">
                            {c.receiptNumber || "—"}
                          </td>
                          <td className="py-2 px-3 text-slate-800">
                            {isEn ? (fundLabels[c.fundType]?.en || c.fundType) : (fundLabels[c.fundType]?.vi || c.fundType)}
                          </td>
                          <td className="py-2 px-3 text-slate-500">
                            {isEn
                              ? (methodLabels[c.paymentMethodType]?.en || c.paymentMethodType)
                              : (methodLabels[c.paymentMethodType]?.vi || c.paymentMethodType)}
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-slate-900">
                            ${c.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* IRS Written Acknowledgment Notice */}
            <div className="p-3.5 bg-[#FAF8F5] border-l-4 border-indigo-900 rounded-r-xl text-[11px] text-slate-600 leading-relaxed font-serif">
              <strong className="text-indigo-950 font-sans block mb-1">
                IRS Written Acknowledgment & Legal Disclaimer:
              </strong>
              {statement.legalDisclaimer}
            </div>

            {/* Official Certification & Signatures */}
            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-amber-200 text-center">
              <div className="space-y-1">
                <div className="h-10 border-b border-slate-400 max-w-[200px] mx-auto flex items-end justify-center font-serif italic text-indigo-950 text-sm">
                  {statement.signatories.seniorPastor.name}
                </div>
                <div className="font-bold text-xs text-slate-900">
                  {statement.signatories.seniorPastor.name}
                </div>
                <div className="text-[10px] text-slate-500 font-serif">
                  {statement.signatories.seniorPastor.title}
                </div>
              </div>

              <div className="space-y-1">
                <div className="h-10 border-b border-slate-400 max-w-[200px] mx-auto flex items-end justify-center font-serif italic text-indigo-950 text-sm">
                  {statement.signatories.treasurer.name}
                </div>
                <div className="font-bold text-xs text-slate-900">
                  {statement.signatories.treasurer.name}
                </div>
                <div className="text-[10px] text-slate-500 font-serif">
                  {statement.signatories.treasurer.title}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-amber-200/80 pt-4 print:hidden">
          <span className="text-[11px] font-serif italic text-slate-500">
            {bilingual(
              "Giữ tài liệu này cho hồ sơ khai thuế thu nhập liên bang Hoa Kỳ (IRS Form 1040).",
              "Retain this statement for federal income tax return records (IRS Form 1040).",
            )}
          </span>
          <TactileButton variant="secondary" size="sm" onClick={onClose}>
            {bilingual("Đóng", "Close")}
          </TactileButton>
        </div>
      </div>
    </div>
  );
}
