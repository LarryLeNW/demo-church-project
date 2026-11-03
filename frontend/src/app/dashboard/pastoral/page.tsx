"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { apiFetch, ApiError } from "@/lib/api/client";
import { BentoCard } from "@/components/ui/bento-card";
import { TactileButton } from "@/components/ui/tactile-button";
import { TactileInput } from "@/components/ui/tactile-input";
import {
  HeartPulse,
  AlertCircle,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  Plus,
  Search,
  Building2,
  Home,
  Flame,
  ShieldAlert,
  CheckCircle2,
  Users,
  FileText,
  Sparkles,
  CalendarHeart,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

export type CareType =
  | "hospital_visit"
  | "home_visit"
  | "anointing_prayer"
  | "counseling"
  | "baby_dedication"
  | "bereavement";

export type CareUrgency = "routine" | "urgent" | "emergency";
export type CareStatus = "pending" | "scheduled" | "completed" | "cancelled";

export interface HouseholdMember {
  name: string;
  role: string;
  birthYear?: number;
}

export interface HouseholdItem {
  id: string;
  name: string;
  campusId: string;
  primaryPhone: string;
  addressLine1: string;
  city: string;
  state: string;
  zipcode: string;
  weddingAnniversary: string | null;
  members: HouseholdMember[];
  notes: string | null;
  createdAt: string;
}

export interface PastoralCareItem {
  id: string;
  userId: string;
  householdId: string | null;
  requestType: CareType;
  urgency: CareUrgency;
  patientOrMemberName: string;
  hospitalOrAddress: string;
  contactPhone: string;
  description: string;
  status: CareStatus;
  assignedPastorId: string | null;
  assignedPastorName: string | null;
  scheduledAt: string | null;
  pastoralReport: string | null;
  campusId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PastoralOverviewStats {
  totalRequests: number;
  pendingCount: number;
  emergencyCount: number;
  scheduledCount: number;
  completedCount: number;
  totalHouseholds: number;
}

const CARE_TYPE_META: Record<
  CareType,
  { labelVi: string; labelEn: string; icon: any; color: string }
> = {
  hospital_visit: {
    labelVi: "Thăm Viếng Bệnh Viện",
    labelEn: "Hospital Care Visit",
    icon: Building2,
    color: "bg-red-50 text-red-800 border-red-200",
  },
  home_visit: {
    labelVi: "Thăm Viếng Tư Gia",
    labelEn: "Home Pastoral Visit",
    icon: Home,
    color: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  anointing_prayer: {
    labelVi: "Cầu Nguyện Xức Dầu (Gia-cơ 5:14)",
    labelEn: "Anointing with Oil Prayer",
    icon: Flame,
    color: "bg-amber-50 text-amber-900 border-amber-300",
  },
  counseling: {
    labelVi: "Tư Vấn Hôn Nhân & Thuộc Linh",
    labelEn: "Pastoral Counseling",
    icon: Stethoscope,
    color: "bg-indigo-50 text-indigo-800 border-indigo-200",
  },
  baby_dedication: {
    labelVi: "Cầu Nguyện Dâng Con Cho Chúa",
    labelEn: "Baby Dedication",
    icon: Sparkles,
    color: "bg-blue-50 text-blue-800 border-blue-200",
  },
  bereavement: {
    labelVi: "An Ủi & Tang Lễ Hội Thánh",
    labelEn: "Bereavement & Memorial",
    icon: HeartPulse,
    color: "bg-slate-100 text-slate-800 border-slate-300",
  },
};

const CAMPUSES = [
  { id: "all", vi: "Tất cả các điểm nhóm (All Campuses)", en: "All Campuses" },
  { id: "Dallas Main Campus", vi: "Hội Thánh Dallas (Main Campus)", en: "Dallas Main Campus" },
  { id: "Houston Campus", vi: "Hội Thánh Houston", en: "Houston Campus" },
  { id: "Fort Worth Campus", vi: "Hội Thánh Fort Worth", en: "Fort Worth Campus" },
  { id: "Austin Campus", vi: "Điểm Nhóm Sinh Viên Austin", en: "Austin Campus" },
];

export default function PastoralCarePage() {
  const { user } = useAuth();
  const { bilingual, isEn } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PastoralOverviewStats>({
    totalRequests: 0,
    pendingCount: 0,
    emergencyCount: 0,
    scheduledCount: 0,
    completedCount: 0,
    totalHouseholds: 0,
  });

  const [activeTab, setActiveTab] = useState<"care" | "households" | "my_requests">("care");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters
  const [selectedCampus, setSelectedCampus] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Care Requests Data
  const [careRequests, setCareRequests] = useState<PastoralCareItem[]>([]);
  const [myRequests, setMyRequests] = useState<PastoralCareItem[]>([]);
  const [households, setHouseholds] = useState<HouseholdItem[]>([]);
  const [householdSearch, setHouseholdSearch] = useState("");

  // Modals & Forms
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState<PastoralCareItem | null>(null);
  const [showCompleteModal, setShowCompleteModal] = useState<PastoralCareItem | null>(null);
  const [showHouseholdModal, setShowHouseholdModal] = useState(false);

  // Form State: Create Care Request
  const [newRequestType, setNewRequestType] = useState<CareType>("hospital_visit");
  const [newUrgency, setNewUrgency] = useState<CareUrgency>("urgent");
  const [newPatientName, setNewPatientName] = useState("");
  const [newHospitalAddress, setNewHospitalAddress] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCampusId, setNewCampusId] = useState("Dallas Main Campus");
  const [submittingCare, setSubmittingCare] = useState(false);

  // Form State: Assign Pastor
  const [assignPastorName, setAssignPastorName] = useState("");
  const [assignPastorId, setAssignPastorId] = useState("pastor-1");
  const [assignDate, setAssignDate] = useState("");
  const [submittingAssign, setSubmittingAssign] = useState(false);

  // Form State: Complete Care Report
  const [pastoralReportText, setPastoralReportText] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);

  // Form State: Create Household
  const [houseName, setHouseName] = useState("");
  const [housePhone, setHousePhone] = useState("");
  const [houseAddress, setHouseAddress] = useState("");
  const [houseCity, setHouseCity] = useState("Plano");
  const [houseState, setHouseState] = useState("TX");
  const [houseZip, setHouseZip] = useState("75025");
  const [houseAnniversary, setHouseAnniversary] = useState("");
  const [houseMembersRaw, setHouseMembersRaw] = useState("Trần Minh Long (Trưởng hộ), Nguyễn Thị Mai (Vợ)");
  const [houseNotes, setHouseNotes] = useState("");
  const [submittingHouse, setSubmittingHouse] = useState(false);

  const isPastorOrLeader =
    user?.role === "senior_pastor" ||
    user?.role === "admin" ||
    user?.role === "ministry_leader";

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchOverview = async () => {
    try {
      const q = `/pastoral/overview?campusId=${encodeURIComponent(selectedCampus)}`;
      const data = await apiFetch<PastoralOverviewStats>(q);
      setStats(data);
    } catch (err) {
      console.error("Lỗi lấy thống kê chăm sóc mục vụ:", err);
    }
  };

  const fetchCareRequests = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCampus && selectedCampus !== "all") {
        params.append("campusId", selectedCampus);
      }
      if (urgencyFilter && urgencyFilter !== "all") {
        params.append("urgency", urgencyFilter);
      }
      if (statusFilter && statusFilter !== "all") {
        params.append("status", statusFilter);
      }
      if (searchQuery && searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }
      const q = `/pastoral/requests${params.toString() ? `?${params.toString()}` : ""}`;
      const data = await apiFetch<PastoralCareItem[]>(q);
      setCareRequests(data);
    } catch (err) {
      console.error("Lỗi tải danh sách yêu cầu chăm sóc:", err);
    }
  };

  const fetchMyRequests = async () => {
    if (!user) return;
    try {
      const data = await apiFetch<PastoralCareItem[]>("/pastoral/requests/my");
      setMyRequests(data);
    } catch (err) {
      console.error("Lỗi tải yêu cầu của tôi:", err);
    }
  };

  const fetchHouseholds = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCampus && selectedCampus !== "all") {
        params.append("campusId", selectedCampus);
      }
      if (householdSearch && householdSearch.trim()) {
        params.append("search", householdSearch.trim());
      }
      const q = `/pastoral/households${params.toString() ? `?${params.toString()}` : ""}`;
      const data = await apiFetch<HouseholdItem[]>(q);
      setHouseholds(data);
    } catch (err) {
      console.error("Lỗi tải danh bạ hộ gia đình:", err);
    }
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([
      fetchOverview(),
      fetchCareRequests(),
      fetchMyRequests(),
      fetchHouseholds(),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, [user, selectedCampus, urgencyFilter, statusFilter]);

  const handleCreateCareRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim() || !newHospitalAddress.trim() || !newContactPhone.trim()) {
      showToast(
        bilingual(
          "Vui lòng điền họ tên, địa chỉ bệnh viện/nơi ở và số điện thoại liên lạc.",
          "Please enter member name, hospital/address, and contact phone."
        )
      );
      return;
    }

    try {
      setSubmittingCare(true);
      await apiFetch("/pastoral/requests", {
        method: "POST",
        body: JSON.stringify({
          requestType: newRequestType,
          urgency: newUrgency,
          patientOrMemberName: newPatientName,
          hospitalOrAddress: newHospitalAddress,
          contactPhone: newContactPhone,
          description: newDescription,
          campusId: newCampusId,
        }),
      });

      showToast(
        bilingual(
          "Đã gửi yêu cầu chăm sóc mục vụ đến Ban Mục Sư thành công!",
          "Pastoral care request sent to pastoral ministry successfully!"
        )
      );
      setShowRequestModal(false);
      setNewPatientName("");
      setNewHospitalAddress("");
      setNewContactPhone("");
      setNewDescription("");
      await loadAll();
    } catch (err: any) {
      showToast(
        err?.message ||
          bilingual(
            "Không thể gửi yêu cầu chăm sóc mục vụ.",
            "Could not submit pastoral care request."
          )
      );
    } finally {
      setSubmittingCare(false);
    }
  };

  const handleAssignPastor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAssignModal) return;
    if (!assignPastorName.trim()) {
      showToast(
        bilingual(
          "Vui lòng chọn hoặc nhập tên Mục sư phụ trách.",
          "Please select or enter the assigned pastor."
        )
      );
      return;
    }

    try {
      setSubmittingAssign(true);
      await apiFetch(`/pastoral/requests/${showAssignModal.id}/assign`, {
        method: "PATCH",
        body: JSON.stringify({
          assignedPastorId: assignPastorId,
          assignedPastorName: assignPastorName,
          scheduledAt: assignDate || undefined,
        }),
      });

      showToast(
        bilingual(
          `Đã xếp lịch và phân công cho ${assignPastorName}!`,
          `Scheduled and assigned to ${assignPastorName}!`
        )
      );
      setShowAssignModal(null);
      await loadAll();
    } catch (err: any) {
      showToast(
        err?.message ||
          bilingual("Không thể phân công mục sư.", "Could not assign pastor.")
      );
    } finally {
      setSubmittingAssign(false);
    }
  };

  const handleCompleteCare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showCompleteModal) return;
    if (!pastoralReportText.trim()) {
      showToast(
        bilingual(
          "Vui lòng ghi chép tóm tắt buổi thăm viếng và tình hình người bệnh.",
          "Please write down pastoral visit notes and member condition."
        )
      );
      return;
    }

    try {
      setSubmittingReport(true);
      await apiFetch(`/pastoral/requests/${showCompleteModal.id}/complete`, {
        method: "PATCH",
        body: JSON.stringify({
          pastoralReport: pastoralReportText,
        }),
      });

      showToast(
        bilingual(
          "Đã hoàn tất buổi thăm viếng và lưu sổ mục vụ!",
          "Pastoral care visit completed and logged into church records!"
        )
      );
      setShowCompleteModal(null);
      setPastoralReportText("");
      await loadAll();
    } catch (err: any) {
      showToast(
        err?.message ||
          bilingual("Không thể lưu báo cáo thăm viếng.", "Could not save pastoral care report.")
      );
    } finally {
      setSubmittingReport(false);
    }
  };

  const handleCreateHousehold = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!houseName.trim() || !housePhone.trim() || !houseAddress.trim()) {
      showToast(
        bilingual(
          "Vui lòng nhập tên hộ gia đình, số điện thoại và địa chỉ.",
          "Please provide household name, phone number, and address."
        )
      );
      return;
    }

    const membersParsed: HouseholdMember[] = houseMembersRaw
      .split(/[,;\n]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((item, idx) => ({
        name: item,
        role: idx === 0 ? "head" : idx === 1 ? "spouse" : "child",
      }));

    try {
      setSubmittingHouse(true);
      await apiFetch("/pastoral/households", {
        method: "POST",
        body: JSON.stringify({
          name: houseName,
          campusId: newCampusId,
          primaryPhone: housePhone,
          addressLine1: houseAddress,
          city: houseCity,
          state: houseState,
          zipcode: houseZip,
          weddingAnniversary: houseAnniversary || undefined,
          members: membersParsed,
          notes: houseNotes,
        }),
      });

      showToast(
        bilingual(
          "Đã tạo hồ sơ hộ gia đình vào danh bạ Hội Thánh!",
          "Household profile successfully added to church directory!"
        )
      );
      setShowHouseholdModal(false);
      setHouseName("");
      setHousePhone("");
      setHouseAddress("");
      setHouseNotes("");
      await fetchHouseholds();
      await fetchOverview();
    } catch (err: any) {
      showToast(
        err?.message ||
          bilingual("Không thể tạo hộ gia đình.", "Could not create household profile.")
      );
    } finally {
      setSubmittingHouse(false);
    }
  };

  const getUrgencyBadge = (urgency: CareUrgency) => {
    switch (urgency) {
      case "emergency":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300 animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
            {bilingual("CẤP CỨU / KHẨN CẤP", "EMERGENCY / CRITICAL")}
          </span>
        );
      case "urgent":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
            <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
            {bilingual("Ưu Tiên Sớm", "Urgent Priority")}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {bilingual("Thường Kỳ", "Routine Care")}
          </span>
        );
    }
  };

  const getStatusBadge = (status: CareStatus) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3" /> {bilingual("Chờ Xếp Lịch", "Pending Schedule")}
          </span>
        );
      case "scheduled":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <Calendar className="w-3 h-3" /> {bilingual("Đã Lên Lịch Thăm", "Scheduled")}
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> {bilingual("Đã Hoàn Tất", "Completed")}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
            {bilingual("Đã Hủy", "Cancelled")}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-950 text-amber-200 px-5 py-3 rounded-xl shadow-xl border border-amber-400/40 flex items-center gap-3 animate-fade-in font-serif">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner - Sacred Grace & Scripture */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950 via-indigo-900 to-amber-950 text-white p-8 md:p-10 shadow-lg border border-amber-300/30">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-medium tracking-wide border border-amber-400/30 mb-3">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>
              {bilingual(
                "Mục Vụ Thăm Viếng & Sổ Gia Đình Hội Thánh (Pastoral Care & Households)",
                "Pastoral Care Ministry & Church Household Directory"
              )}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-amber-100 mb-3">
            {bilingual(
              "Chăm Sóc Mục Vụ & Tình Thân Linh Lực",
              "Pastoral Care & Flock Shepherding"
            )}
          </h1>
          <p className="font-serif italic text-amber-200/90 text-sm md:text-base leading-relaxed mb-4">
            {bilingual(
              '"Trong anh em có ai đau ốm chăng? Hãy mời các trưởng lão Hội Thánh đến; các trưởng lão hãy nhân danh Chúa cầu nguyện cho người và xức dầu cho người. Sự cầu nguyện bởi đức tin sẽ cứu kẻ bệnh..."',
              '"Is anyone among you sick? Let them call the elders of the church to pray over them and anoint them with oil in the name of the Lord. And the prayer offered in faith will make the sick person well..."'
            )}
          </p>
          <p className="text-xs font-mono uppercase tracking-widest text-amber-400/80">
            {bilingual("— Gia-cơ 5:14-15 (RVV11)", "— James 5:14-15 (ESV)")}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <TactileButton
              variant="gold"
              onClick={() => setShowRequestModal(true)}
              className="flex items-center gap-2 shadow-md"
            >
              <HeartPulse className="w-4 h-4 text-amber-950" />
              <span>
                {bilingual(
                  "Gửi Yêu Cầu Cầu Nguyện & Thăm Viếng",
                  "Request Pastoral Visit & Prayer"
                )}
              </span>
            </TactileButton>

            {isPastorOrLeader && (
              <TactileButton
                variant="secondary"
                onClick={() => setShowHouseholdModal(true)}
                className="flex items-center gap-2 bg-indigo-900/60 border-amber-400/40 text-amber-200 hover:bg-indigo-800"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {bilingual(
                    "+ Thêm Hộ Gia Đình Vào Danh Bạ",
                    "+ Add Household to Directory"
                  )}
                </span>
              </TactileButton>
            )}
          </div>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute right-6 -bottom-10 opacity-10 pointer-events-none select-none text-white text-[160px] font-serif">
          †
        </div>
      </div>

      {/* Bento Grid: Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <BentoCard
          title={bilingual("Khẩn Cấp Cần Thăm", "Emergency Care")}
          badge={
            <span className="w-3 h-3 rounded-full bg-red-600 animate-ping inline-block" />
          }
        >
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-red-700">
              {stats.emergencyCount}
            </span>
            <span className="text-xs text-slate-500">
              {bilingual("ca bệnh nặng / cấp cứu", "critical cases")}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {bilingual(
              "Ưu tiên phân công Mục sư đến bệnh viện sớm",
              "Immediate hospital and bedside pastoral response"
            )}
          </p>
        </BentoCard>

        <BentoCard
          title={bilingual("Yêu Cầu Chờ Lên Lịch", "Pending Requests")}
          badge={<Clock className="w-5 h-5 text-amber-700" />}
        >
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-amber-800">
              {stats.pendingCount}
            </span>
            <span className="text-xs text-slate-500">
              {bilingual("yêu cầu", "requests")}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {bilingual(
              "Chờ phân bổ Mục sư & đặt lịch hẹn",
              "Awaiting pastoral assignment and scheduling"
            )}
          </p>
        </BentoCard>

        <BentoCard
          title={bilingual("Buổi Thăm Đã Xếp Lịch", "Scheduled Visits")}
          badge={<Calendar className="w-5 h-5 text-blue-700" />}
        >
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-blue-800">
              {stats.scheduledCount}
            </span>
            <span className="text-xs text-slate-500">
              {bilingual("buổi hẹn", "appointments")}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {bilingual(
              "Đang trong tiến trình chăm sóc mục vụ",
              "Active pastoral appointments in progress"
            )}
          </p>
        </BentoCard>

        <BentoCard
          title={bilingual("Hộ Gia Đình Tín Hữu", "Registered Households")}
          badge={<Home className="w-5 h-5 text-emerald-700" />}
        >
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-emerald-800">
              {stats.totalHouseholds}
            </span>
            <span className="text-xs text-slate-500">
              {bilingual("hộ gia đình", "households")}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {bilingual(
              "Đã lưu trong danh bạ mục vụ Hội Thánh",
              "Enrolled in church care and family ministry"
            )}
          </p>
        </BentoCard>
      </div>

      {/* Tabs Selector */}
      <div className="border-b border-amber-200/80 flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("care")}
            className={`pb-3 px-4 font-serif text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "care"
                ? "border-amber-700 text-amber-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            <span>
              {bilingual(
                `Sổ Thăm Viếng & Cầu Nguyện (${careRequests.length})`,
                `Care & Visit Registry (${careRequests.length})`
              )}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("households")}
            className={`pb-3 px-4 font-serif text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "households"
                ? "border-amber-700 text-amber-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>
              {bilingual(
                `Danh Bạ Gia Đình Tín Hữu (${households.length})`,
                `Household Directory (${households.length})`
              )}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("my_requests")}
            className={`pb-3 px-4 font-serif text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "my_requests"
                ? "border-amber-700 text-amber-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>
              {bilingual(
                `Yêu Cầu Của Tôi (${myRequests.length})`,
                `My Care Requests (${myRequests.length})`
              )}
            </span>
          </button>
        </div>

        {/* Global Campus Filter */}
        <div className="hidden sm:flex items-center gap-2 pb-2">
          <MapPin className="w-4 h-4 text-amber-800" />
          <select
            value={selectedCampus}
            onChange={(e) => setSelectedCampus(e.target.value)}
            className="text-xs bg-amber-50 border border-amber-300/80 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none"
          >
            {CAMPUSES.map((c) => (
              <option key={c.id} value={c.id}>
                {isEn ? c.en : c.vi}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TAB 1: SỔ THĂM VIẾNG & CẦU NGUYỆN */}
      {activeTab === "care" && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/70 flex flex-wrap items-center gap-3 justify-between">
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={bilingual(
                    "Tìm theo tên tín hữu, bệnh viện hoặc số ĐT...",
                    "Search by member, hospital, or phone..."
                  )}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchCareRequests()}
                  className="w-full pl-9 pr-3 py-1.5 bg-white text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-amber-600"
                />
              </div>

              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-700"
              >
                <option value="all">
                  {bilingual("Tất cả mức độ khẩn cấp", "All Urgency Levels")}
                </option>
                <option value="emergency">
                  {bilingual("Khẩn cấp / Cấp cứu", "Critical / Emergency")}
                </option>
                <option value="urgent">
                  {bilingual("Ưu tiên sớm", "Urgent Priority")}
                </option>
                <option value="routine">
                  {bilingual("Thường kỳ", "Routine Care")}
                </option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-700"
              >
                <option value="all">
                  {bilingual("Tất cả trạng thái", "All Statuses")}
                </option>
                <option value="pending">
                  {bilingual("Chờ xếp lịch", "Pending Schedule")}
                </option>
                <option value="scheduled">
                  {bilingual("Đã lên lịch", "Scheduled")}
                </option>
                <option value="completed">
                  {bilingual("Đã hoàn tất", "Completed")}
                </option>
              </select>
            </div>

            <TactileButton
              variant="secondary"
              size="sm"
              onClick={fetchCareRequests}
              className="text-xs"
            >
              {bilingual("Lọc & Tìm Kiếm", "Filter & Search")}
            </TactileButton>
          </div>

          {/* Care Requests List */}
          {loading ? (
            <div className="p-12 text-center text-slate-500 font-serif">
              <span className="text-2xl animate-spin inline-block text-amber-700 font-serif">†</span>
              <p className="mt-2 text-sm italic">
                {bilingual("Đang tải sổ thăm viếng mục vụ...", "Loading pastoral care records...")}
              </p>
            </div>
          ) : careRequests.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-dashed border-amber-200 text-slate-500">
              <HeartPulse className="w-10 h-10 mx-auto text-amber-400 mb-2 opacity-60" />
              <p className="font-serif text-base text-slate-700">
                {bilingual(
                  "Chưa có yêu cầu thăm viếng nào phù hợp.",
                  "No care requests match this filter."
                )}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {bilingual(
                  "Tín hữu có thể gửi yêu cầu thăm viếng hoặc xin cầu nguyện xức dầu bất cứ lúc nào.",
                  "Church members can request a hospital visit, prayer, or anointing at any time."
                )}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {careRequests.map((item) => {
                const meta = CARE_TYPE_META[item.requestType] || CARE_TYPE_META.hospital_visit;
                const IconComponent = meta.icon;

                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-xl border p-5 shadow-sm transition-all hover:shadow-md flex flex-col justify-between ${
                      item.urgency === "emergency"
                        ? "border-red-300 ring-2 ring-red-100"
                        : "border-amber-200/80"
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${meta.color}`}
                          >
                            <IconComponent className="w-3.5 h-3.5" />
                            {isEn ? meta.labelEn : meta.labelVi}
                          </span>
                          {getUrgencyBadge(item.urgency)}
                        </div>
                        {getStatusBadge(item.status)}
                      </div>

                      {/* Patient & Location Info */}
                      <h3 className="text-lg font-serif font-bold text-slate-900 mb-1">
                        {item.patientOrMemberName}
                      </h3>

                      <div className="space-y-1.5 text-xs text-slate-600 mb-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                          <span className="font-medium text-slate-800">
                            {item.hospitalOrAddress}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <a
                            href={`tel:${item.contactPhone}`}
                            className="text-amber-800 font-semibold hover:underline"
                          >
                            {item.contactPhone}
                          </a>
                          <span className="text-[11px] text-slate-400">({item.campusId})</span>
                        </div>
                      </div>

                      {/* Description / Prayer Request */}
                      <div className="bg-[#FAF8F5] p-3 rounded-lg border border-amber-100/80 text-xs text-slate-700 leading-relaxed mb-3 italic">
                        "{item.description}"
                      </div>

                      {/* Scheduled Info or Completed Report */}
                      {item.assignedPastorName && (
                        <div className="mb-3 px-3 py-2 rounded-lg bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">
                              {bilingual("Mục sư phụ trách:", "Assigned Pastor:")}
                            </span>
                            <span className="font-bold text-indigo-900">
                              {item.assignedPastorName}
                            </span>
                          </div>
                          {item.scheduledAt && (
                            <div className="flex items-center justify-between mt-1 text-slate-600">
                              <span>
                                {bilingual("Lịch hẹn thăm viếng:", "Scheduled Visit:")}
                              </span>
                              <span className="font-mono font-medium text-slate-800">
                                {new Date(item.scheduledAt).toLocaleString(
                                  isEn ? "en-US" : "vi-VN",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {item.pastoralReport && (
                        <div className="mb-3 px-3 py-2 rounded-lg bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950">
                          <span className="font-semibold block mb-0.5 text-emerald-900">
                            {bilingual("Báo Cáo Sổ Mục Vụ:", "Pastoral Care Report:")}
                          </span>
                          <p className="text-slate-700">{item.pastoralReport}</p>
                        </div>
                      )}
                    </div>

                    {/* Action Bar for Pastors & Leaders */}
                    {isPastorOrLeader && (
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                        {item.status === "pending" && (
                          <TactileButton
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setShowAssignModal(item);
                              setAssignPastorName(user?.fullName || "Mục Sư Quản Nhiệm");
                            }}
                            className="text-xs"
                          >
                            {bilingual("Xếp Lịch & Phân Công", "Schedule & Assign")}
                          </TactileButton>
                        )}

                        {item.status === "scheduled" && (
                          <TactileButton
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              setShowCompleteModal(item);
                              setPastoralReportText("");
                            }}
                            className="text-xs"
                          >
                            {bilingual("Ghi Báo Cáo & Hoàn Tất", "Log Report & Complete")}
                          </TactileButton>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DANH BẠ GIA ĐÌNH TÍN HỮU */}
      {activeTab === "households" && (
        <div className="space-y-6">
          <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/70 flex flex-wrap items-center gap-3 justify-between">
            <div className="relative flex-1 min-w-[260px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={bilingual(
                  "Tìm hộ gia đình theo tên, thành phố (Plano, Dallas...), zipcode...",
                  "Search households by name, city (Plano, Dallas...), zipcode..."
                )}
                value={householdSearch}
                onChange={(e) => setHouseholdSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchHouseholds()}
                className="w-full pl-9 pr-3 py-1.5 bg-white text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div className="flex items-center gap-2">
              <TactileButton
                variant="secondary"
                size="sm"
                onClick={fetchHouseholds}
                className="text-xs"
              >
                {bilingual("Tìm Kiếm", "Search")}
              </TactileButton>

              {isPastorOrLeader && (
                <TactileButton
                  variant="gold"
                  size="sm"
                  onClick={() => setShowHouseholdModal(true)}
                  className="text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{bilingual("Thêm Hộ Mới", "Add Household")}</span>
                </TactileButton>
              )}
            </div>
          </div>

          {/* Households Grid */}
          {households.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-dashed border-amber-200 text-slate-500">
              <Users className="w-10 h-10 mx-auto text-amber-400 mb-2 opacity-60" />
              <p className="font-serif text-base text-slate-700">
                {bilingual("Chưa có hồ sơ gia đình nào được tìm thấy.", "No household records found.")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {households.map((house) => (
                <div
                  key={house.id}
                  className="bg-white rounded-xl border border-amber-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-serif font-bold text-base text-slate-900">
                        {house.name}
                      </h3>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                        {house.city}, {house.state}
                      </span>
                    </div>

                    {/* Address & Phone */}
                    <div className="space-y-1 text-xs text-slate-600 mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>
                          {house.addressLine1}, {house.city}, {house.state} {house.zipcode}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <a
                          href={`tel:${house.primaryPhone}`}
                          className="text-amber-800 font-semibold hover:underline"
                        >
                          {house.primaryPhone}
                        </a>
                      </div>
                    </div>

                    {/* Wedding Anniversary */}
                    {house.weddingAnniversary && (
                      <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-amber-50/70 border border-amber-200/80 flex items-center gap-2 text-xs text-amber-900">
                        <CalendarHeart className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>
                          {bilingual("Kỷ Niệm Cưới:", "Anniversary:")}{" "}
                          <strong className="font-serif font-bold">
                            {house.weddingAnniversary}
                          </strong>
                        </span>
                      </div>
                    )}

                    {/* Family Members */}
                    <div className="mb-3">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                        {bilingual(
                          `Thành viên gia đình (${house.members?.length || 0}):`,
                          `Family Members (${house.members?.length || 0}):`
                        )}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {house.members && house.members.length > 0 ? (
                          house.members.map((m, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-slate-100 text-[11px] text-slate-700 border border-slate-200"
                            >
                              {m.name}
                              {m.birthYear ? ` (${m.birthYear})` : ""}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            {bilingual("Chưa liệt kê", "None listed")}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Pastoral Notes */}
                    {house.notes && (
                      <p className="text-xs text-slate-500 italic bg-[#FCFBF9] p-2.5 rounded border border-amber-100">
                        {bilingual("Ghi chú:", "Notes:")} {house.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: YÊU CẦU CỦA TÔI */}
      {activeTab === "my_requests" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif font-bold text-slate-900">
              {bilingual(
                "Lịch Sử Yêu Cầu Chăm Sóc Mục Vụ Của Bạn",
                "Your Pastoral Care Request History"
              )}
            </h2>
            <TactileButton
              variant="gold"
              size="sm"
              onClick={() => setShowRequestModal(true)}
              className="text-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{bilingual("Gửi Yêu Cầu Mới", "New Care Request")}</span>
            </TactileButton>
          </div>

          {myRequests.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-dashed border-amber-200 text-slate-500">
              <FileText className="w-10 h-10 mx-auto text-amber-400 mb-2 opacity-60" />
              <p className="font-serif text-base text-slate-700">
                {bilingual(
                  "Bạn chưa gửi yêu cầu thăm viếng nào.",
                  "You have not submitted any pastoral care requests yet."
                )}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {bilingual(
                  'Khi cần Mục sư đến thăm bệnh viện, tư gia hoặc cầu nguyện xức dầu, hãy nhấn nút "Gửi Yêu Cầu Mới".',
                  'When in need of a pastoral visit, hospital prayer, or anointing, click "New Care Request".'
                )}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {myRequests.map((req) => {
                const meta = CARE_TYPE_META[req.requestType] || CARE_TYPE_META.hospital_visit;
                return (
                  <div
                    key={req.id}
                    className="bg-white p-4 rounded-xl border border-amber-200/70 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-serif font-bold text-slate-900">
                          {req.patientOrMemberName}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-semibold text-amber-800">
                          {isEn ? meta.labelEn : meta.labelVi}
                        </span>
                        {getUrgencyBadge(req.urgency)}
                      </div>
                      <p className="text-xs text-slate-600">
                        {bilingual("Địa điểm:", "Location:")} <strong>{req.hospitalOrAddress}</strong> —{" "}
                        {bilingual("SĐT:", "Phone:")} {req.contactPhone}
                      </p>
                      {req.assignedPastorName && (
                        <p className="text-xs text-indigo-900 font-medium mt-1">
                          {bilingual("Mục sư phụ trách:", "Assigned Pastor:")} {req.assignedPastorName}{" "}
                          {req.scheduledAt &&
                            `(${new Date(req.scheduledAt).toLocaleDateString(isEn ? "en-US" : "vi-VN")})`}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0">{getStatusBadge(req.status)}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: GỬI YÊU CẦU CẦU NGUYỆN & THĂM VIẾNG */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 border border-amber-200 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-amber-100">
              <div className="flex items-center gap-2 text-indigo-950 font-serif">
                <HeartPulse className="w-5 h-5 text-amber-700" />
                <h3 className="text-lg font-bold">
                  {bilingual(
                    "Gửi Yêu Cầu Chăm Sóc Mục Vụ",
                    "Request Pastoral Care & Visit"
                  )}
                </h3>
              </div>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCareRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {bilingual(
                    "Mục Đích Thăm Viếng & Cầu Nguyện:",
                    "Care Visit & Prayer Type:"
                  )}
                </label>
                <select
                  value={newRequestType}
                  onChange={(e) => setNewRequestType(e.target.value as CareType)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-600"
                >
                  <option value="hospital_visit">
                    {bilingual("Thăm Viếng Bệnh Viện (Hospital Visit)", "Hospital Care Visit")}
                  </option>
                  <option value="home_visit">
                    {bilingual("Thăm Viếng Tư Gia (Home Pastoral Visit)", "Home Pastoral Visit")}
                  </option>
                  <option value="anointing_prayer">
                    {bilingual(
                      "Cầu Nguyện Xức Dầu Theo Lời Chúa (Gia-cơ 5:14)",
                      "Anointing with Oil Prayer (James 5:14)"
                    )}
                  </option>
                  <option value="counseling">
                    {bilingual("Tư Vấn Hôn Nhân & Thuộc Linh (Counseling)", "Pastoral Counseling")}
                  </option>
                  <option value="baby_dedication">
                    {bilingual("Cầu Nguyện Dâng Con Cho Chúa (Baby Dedication)", "Baby Dedication")}
                  </option>
                  <option value="bereavement">
                    {bilingual("An Ủi & Tang Lễ Hội Thánh (Bereavement)", "Bereavement & Memorial")}
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {bilingual("Mức Độ Khẩn Cấp:", "Urgency Level:")}
                  </label>
                  <select
                    value={newUrgency}
                    onChange={(e) => setNewUrgency(e.target.value as CareUrgency)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-semibold"
                  >
                    <option value="routine">{bilingual("Thường kỳ (Routine)", "Routine")}</option>
                    <option value="urgent">{bilingual("Ưu tiên sớm trong tuần (Urgent)", "Urgent (Within 48h)")}</option>
                    <option value="emergency">{bilingual("🚨 CẤP CỨU / NGUY KỊCH (Emergency)", "🚨 Critical / Emergency")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {bilingual("Điểm Nhóm / Campus:", "Church Campus:")}
                  </label>
                  <select
                    value={newCampusId}
                    onChange={(e) => setNewCampusId(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  >
                    <option value="Dallas Main Campus">Dallas Main</option>
                    <option value="Houston Campus">Houston</option>
                    <option value="Fort Worth Campus">Fort Worth</option>
                    <option value="Austin Campus">Austin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {bilingual(
                    "Họ & Tên Người Cần Thăm Viếng / Bệnh Nhân:",
                    "Patient or Member Full Name:"
                  )}
                </label>
                <input
                  type="text"
                  required
                  placeholder={bilingual("Ví dụ: Bác Trương Minh Hải", "e.g., Hai Minh Truong")}
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {bilingual(
                    "Địa Chỉ Bệnh Viện (Kèm Số Phòng) hoặc Tư Gia:",
                    "Hospital (Room #) or Home Address:"
                  )}
                </label>
                <input
                  type="text"
                  required
                  placeholder={bilingual(
                    "Ví dụ: Baylor Scott & White Health (Plano, TX) - Phòng Cấp Cứu 304",
                    "e.g., Baylor Scott & White (Plano, TX) - ICU Room 304"
                  )}
                  value={newHospitalAddress}
                  onChange={(e) => setNewHospitalAddress(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {bilingual("Số Điện Thoại Liên Hệ Của Gia Đình:", "Family Contact Phone:")}
                </label>
                <input
                  type="tel"
                  required
                  placeholder="(469) 555-0199"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {bilingual(
                    "Mô Tả Tình Hình Sức Khỏe & Chi Tiết Lời Cầu Thay:",
                    "Health Situation & Prayer Details:"
                  )}
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder={bilingual(
                    "Chia sẻ hoàn cảnh, chẩn đoán của bác sĩ, hoặc lời cầu nguyện mà gia đình ước ao...",
                    "Share situation, doctor diagnosis, and specific prayers the family desires..."
                  )}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <TactileButton
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                >
                  {bilingual("Hủy Bỏ", "Cancel")}
                </TactileButton>
                <TactileButton
                  variant="gold"
                  size="sm"
                  type="submit"
                  disabled={submittingCare}
                >
                  {submittingCare
                    ? bilingual("Đang gửi...", "Submitting...")
                    : bilingual("Gửi Đến Ban Mục Sư", "Submit Care Request")}
                </TactileButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: XẾP LỊCH & PHÂN CÔNG MỤC SƯ */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-amber-200 shadow-2xl animate-fade-in">
            <h3 className="text-base font-serif font-bold text-slate-900 mb-2">
              {bilingual("Phân Công Thăm Viếng:", "Assign Care Visit:")} {showAssignModal.patientOrMemberName}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {showAssignModal.hospitalOrAddress}
            </p>

            <form onSubmit={handleAssignPastor} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {bilingual("Mục Sư / Trưởng Ban Phụ Trách:", "Assigned Pastor / Ministry Leader:")}
                </label>
                <input
                  type="text"
                  required
                  value={assignPastorName}
                  onChange={(e) => setAssignPastorName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {bilingual("Thời Gian Dự Kiến Thăm Viếng:", "Scheduled Visit Date & Time:")}
                </label>
                <input
                  type="datetime-local"
                  value={assignDate}
                  onChange={(e) => setAssignDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <TactileButton
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={() => setShowAssignModal(null)}
                >
                  {bilingual("Đóng", "Close")}
                </TactileButton>
                <TactileButton
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={submittingAssign}
                >
                  {submittingAssign
                    ? bilingual("Đang lưu...", "Saving...")
                    : bilingual("Xác Nhận Lên Lịch", "Confirm Schedule")}
                </TactileButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: GHI BÁO CÁO THĂM VIẾNG & HOÀN TẤT */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-amber-200 shadow-2xl animate-fade-in">
            <h3 className="text-base font-serif font-bold text-slate-900 mb-1">
              {bilingual("Ghi Chép Báo Cáo Thăm Viếng", "Log Pastoral Care Report")}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {bilingual("Bệnh nhân:", "Patient:")}{" "}
              <strong>{showCompleteModal.patientOrMemberName}</strong> ({showCompleteModal.hospitalOrAddress})
            </p>

            <form onSubmit={handleCompleteCare} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {bilingual(
                    "Nội Dung Buổi Thăm & Tình Trạng Thuộc Linh / Sức Khỏe:",
                    "Visit Summary & Spiritual / Health Status:"
                  )}
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder={bilingual(
                    "Ví dụ: Mục sư đã đến thăm tại phòng ICU, xức dầu và cầu nguyện. Gia đình được an ủi lớn, sức khỏe đã ổn định...",
                    "e.g., Visited at ICU, anointed with oil and prayed. Family greatly encouraged, condition stable..."
                  )}
                  value={pastoralReportText}
                  onChange={(e) => setPastoralReportText(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <TactileButton
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={() => setShowCompleteModal(null)}
                >
                  {bilingual("Hủy", "Cancel")}
                </TactileButton>
                <TactileButton
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={submittingReport}
                >
                  {submittingReport
                    ? bilingual("Đang lưu...", "Saving...")
                    : bilingual("Lưu Báo Cáo & Hoàn Tất", "Save Report & Complete")}
                </TactileButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: THÊM HỘ GIA ĐÌNH VÀO DANH BẠ */}
      {showHouseholdModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-amber-200 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-serif font-bold text-slate-900 mb-3 pb-2 border-b border-amber-100">
              {bilingual(
                "+ Thêm Hộ Gia Đình Vào Danh Bạ Hội Thánh",
                "+ Add Household to Church Directory"
              )}
            </h3>

            <form onSubmit={handleCreateHousehold} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {bilingual(
                    "Tên Hộ Gia Đình (Ví dụ: Gia đình Bác Trần Minh Long):",
                    "Household Name (e.g., The Tran Family):"
                  )}
                </label>
                <input
                  type="text"
                  required
                  value={houseName}
                  onChange={(e) => setHouseName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {bilingual("Số Điện Thoại Chính (US Phone):", "Primary US Phone:")}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(214) 555-8821"
                    value={housePhone}
                    onChange={(e) => setHousePhone(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {bilingual("Ngày Kỷ Niệm Cưới (YYYY-MM-DD):", "Wedding Anniversary:")}
                  </label>
                  <input
                    type="text"
                    placeholder="1988-06-18"
                    value={houseAnniversary}
                    onChange={(e) => setHouseAnniversary(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {bilingual("Địa Chỉ Nhà (Address Line 1):", "Home Address (Line 1):")}
                </label>
                <input
                  type="text"
                  required
                  placeholder="3200 McDermott Rd"
                  value={houseAddress}
                  onChange={(e) => setHouseAddress(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City ({bilingual("Thành phố", "City")}):
                  </label>
                  <input
                    type="text"
                    required
                    value={houseCity}
                    onChange={(e) => setHouseCity(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State ({bilingual("Tiểu bang", "State")}):
                  </label>
                  <input
                    type="text"
                    required
                    value={houseState}
                    onChange={(e) => setHouseState(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Zipcode ({bilingual("Mã vùng", "Zip")}):
                  </label>
                  <input
                    type="text"
                    required
                    value={houseZip}
                    onChange={(e) => setHouseZip(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {bilingual(
                    "Danh Sách Thành Viên (Cách nhau bằng dấu phẩy):",
                    "Family Members (Comma-separated):"
                  )}
                </label>
                <input
                  type="text"
                  placeholder="Trần Minh Long, Nguyễn Thị Mai, Trần David"
                  value={houseMembersRaw}
                  onChange={(e) => setHouseMembersRaw(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {bilingual(
                    "Ghi Chú Mục Vụ (Ban ngành, ân tứ, hoàn cảnh):",
                    "Pastoral Notes (Ministries, gifts, background):"
                  )}
                </label>
                <textarea
                  rows={2}
                  value={houseNotes}
                  onChange={(e) => setHouseNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <TactileButton
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={() => setShowHouseholdModal(false)}
                >
                  {bilingual("Đóng", "Close")}
                </TactileButton>
                <TactileButton
                  variant="gold"
                  size="sm"
                  type="submit"
                  disabled={submittingHouse}
                >
                  {submittingHouse
                    ? bilingual("Đang lưu...", "Saving...")
                    : bilingual("Lưu Hộ Gia Đình", "Save Household")}
                </TactileButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
