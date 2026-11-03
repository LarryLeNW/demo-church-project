"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { BentoCard } from "@/components/ui/bento-card";
import { TactileButton } from "@/components/ui/tactile-button";
import {
  ShieldCheck,
  Baby,
  AlertTriangle,
  Printer,
  CheckCircle2,
  Calendar,
  Clock,
  Plus,
  Users2,
  Phone,
  Lock,
  Heart,
  Sparkles,
  X,
  Search,
} from "lucide-react";

interface ChildProfile {
  id: string;
  parentId: string;
  fullName: string;
  birthDate: string;
  classroom: "nursery" | "preschool" | "elementary" | "youth";
  allergies: string | null;
  specialNotes: string | null;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

interface ActiveCheckinItem {
  id: string;
  childId: string;
  parentId: string;
  sessionDate: string;
  securityCode: string;
  classroom: string;
  checkinTime: string;
  checkoutTime: string | null;
  status: string;
  child: ChildProfile;
  parent: { fullName: string; phone?: string };
}

interface CheckinResult {
  securityCode: string;
  sessionDate: string;
  guardianClaimTicket: {
    parentName: string;
    securityCode: string;
    sessionDate: string;
    timestamp: string;
    children: Array<{ name: string; classroom: string }>;
    legalNotice: string;
  };
  childBadges: Array<{
    checkinId: string;
    childId: string;
    fullName: string;
    classroom: string;
    allergies: string | null;
    specialNotes: string | null;
    emergencyContactName: string;
    emergencyContactPhone: string;
    securityCode: string;
    sessionDate: string;
    checkinTime: string;
  }>;
}

export default function CheckinPage() {
  const { user } = useAuth();
  const { bilingual, isEn } = useLanguage();
  const [activeTab, setActiveTab] = useState<"parent" | "roster">("parent");

  // Parent state
  const [myChildren, setMyChildren] = useState<ChildProfile[]>([]);
  const [selectedChildIds, setSelectedChildIds] = useState<string[]>([]);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [checkinResult, setCheckinResult] = useState<CheckinResult | null>(null);
  const [checkingIn, setCheckingIn] = useState(false);

  // Register child modal
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const [newChildBirthDate, setNewChildBirthDate] = useState("2020-01-01");
  const [newChildClassroom, setNewChildClassroom] = useState<
    "nursery" | "preschool" | "elementary" | "youth"
  >("preschool");
  const [newChildAllergies, setNewChildAllergies] = useState("");
  const [newChildNotes, setNewChildNotes] = useState("");
  const [newChildEmergencyName, setNewChildEmergencyName] = useState(user?.fullName || "");
  const [newChildEmergencyPhone, setNewChildEmergencyPhone] = useState(user?.phone || "(214) 555-0199");
  const [savingChild, setSavingChild] = useState(false);

  // Teacher Classroom Roster state
  const [rosterItems, setRosterItems] = useState<ActiveCheckinItem[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<string>("");
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [checkoutCheckinId, setCheckoutCheckinId] = useState<string | null>(null);
  const [checkoutCodeInput, setCheckoutCodeInput] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState("");

  const isTeacherOrStaff =
    user?.role === "senior_pastor" ||
    user?.role === "admin" ||
    user?.role === "ministry_leader";

  useEffect(() => {
    loadMyChildren();
    if (isTeacherOrStaff) {
      loadRoster();
    }
  }, [isTeacherOrStaff, selectedClassroom]);

  async function loadMyChildren() {
    try {
      setLoadingChildren(true);
      const res = await apiFetch<ChildProfile[]>("/children/my-children");
      setMyChildren(res || []);
      // Pre-select all children
      if (res && res.length > 0) {
        setSelectedChildIds(res.map((c) => c.id));
      }
    } catch (err) {
      console.error("Lỗi tải danh sách con:", err);
    } finally {
      setLoadingChildren(false);
    }
  }

  async function loadRoster() {
    try {
      setLoadingRoster(true);
      const url = selectedClassroom
        ? `/children/active-roster?classroom=${selectedClassroom}`
        : "/children/active-roster";
      const res = await apiFetch<{ items: ActiveCheckinItem[] }>(url);
      setRosterItems(res.items || []);
    } catch (err) {
      console.error("Lỗi tải sĩ số phòng học:", err);
    } finally {
      setLoadingRoster(false);
    }
  }

  function toggleChildSelection(childId: string) {
    setSelectedChildIds((prev) =>
      prev.includes(childId) ? prev.filter((id) => id !== childId) : [...prev, childId],
    );
  }

  async function handleCheckin() {
    if (selectedChildIds.length === 0) return;

    try {
      setCheckingIn(true);
      const res = await apiFetch<CheckinResult>("/children/checkin", {
        method: "POST",
        body: JSON.stringify({ childIds: selectedChildIds }),
      });
      setCheckinResult(res);
      if (isTeacherOrStaff) {
        loadRoster();
      }
    } catch (err) {
      console.error("Lỗi điểm danh bé:", err);
    } finally {
      setCheckingIn(false);
    }
  }

  async function handleRegisterChild(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSavingChild(true);
      await apiFetch("/children", {
        method: "POST",
        body: JSON.stringify({
          fullName: newChildName.trim(),
          birthDate: newChildBirthDate,
          classroom: newChildClassroom,
          allergies: newChildAllergies.trim() || undefined,
          specialNotes: newChildNotes.trim() || undefined,
          emergencyContactName: newChildEmergencyName.trim(),
          emergencyContactPhone: newChildEmergencyPhone.trim(),
        }),
      });

      setShowAddChildModal(false);
      setNewChildName("");
      setNewChildAllergies("");
      setNewChildNotes("");
      loadMyChildren();
    } catch (err) {
      console.error("Lỗi lưu hồ sơ bé:", err);
    } finally {
      setSavingChild(false);
    }
  }

  async function handleCheckoutSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!checkoutCheckinId || !checkoutCodeInput.trim()) return;

    try {
      setCheckoutError("");
      setCheckoutSuccess("");
      await apiFetch(`/children/checkout/${checkoutCheckinId}`, {
        method: "POST",
        body: JSON.stringify({ securityCode: checkoutCodeInput.trim() }),
      });

      setCheckoutSuccess(
        bilingual(
          "Đã đối chiếu mã bảo mật chính xác! Bàn giao bé ra về an toàn.",
          "Security code verified successfully! Child safely dismissed."
        )
      );
      setCheckoutCodeInput("");
      setCheckoutCheckinId(null);
      loadRoster();
    } catch (err) {
      setCheckoutError(
        (err as Error).message ||
          bilingual("Mã bảo mật không trùng khớp!", "Security code does not match!")
      );
    }
  }

  const classroomLabels: Record<string, { title: string; age: string; color: string }> = {
    nursery: {
      title: isEn ? "Nursery" : "Lớp Hài Nhi (Nursery)",
      age: isEn ? "0 - 2 Yrs" : "0 - 2 Tuổi",
      color: "bg-rose-100 text-rose-900 border-rose-300",
    },
    preschool: {
      title: isEn ? "Pre-K" : "Lớp Mầm Non (Pre-K)",
      age: isEn ? "3 - 5 Yrs" : "3 - 5 Tuổi",
      color: "bg-amber-100 text-amber-900 border-amber-300",
    },
    elementary: {
      title: isEn ? "Elementary" : "Lớp Thiếu Nhi (Elementary)",
      age: isEn ? "6 - 11 Yrs" : "6 - 11 Tuổi",
      color: "bg-emerald-100 text-emerald-900 border-emerald-300",
    },
    youth: {
      title: isEn ? "Youth" : "Lớp Thanh Thiếu Niên (Youth)",
      age: isEn ? "12+ Yrs" : "12+ Tuổi",
      color: "bg-indigo-100 text-indigo-900 border-indigo-300",
    },
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white rounded-2xl border border-amber-400/30 shadow-md relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-serif uppercase tracking-widest">
            <span>†</span>
            <span>{bilingual("Tiêu Chuẩn Bảo Mật An Toàn Nhi Đồng Hoa Kỳ", "US Child Safety & Security Standards")}</span>
          </div>
          <h1 className="font-scripture text-2xl sm:text-3xl font-bold tracking-tight">
            {bilingual("Điểm Danh An Toàn Lớp Thiếu Nhi (Child Check-in)", "Secure Child Check-in & Safety Verification")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
            {bilingual(
              "Hệ thống cấp mã bảo mật ngẫu nhiên đối chiếu Phụ huynh — Con nhỏ, cảnh báo tiền sử dị ứng y tế nổi bật và chỉ bàn giao bé khi mã nhận diện trùng khớp 100%.",
              "Randomized security codes matching Parent with Child, prominent medical allergy badges, and 100% verified code checkout."
            )}
          </p>
        </div>

        <div className="absolute right-6 -bottom-8 text-amber-500/10 font-serif text-9xl select-none pointer-events-none">
          †
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-amber-200/70 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setActiveTab("parent")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "parent"
                ? "bg-indigo-950 text-white shadow-xs"
                : "bg-white text-slate-700 border border-amber-200 hover:bg-amber-50"
            }`}
          >
            <Baby className="w-4 h-4 text-amber-400" />
            <span>{bilingual(`Phụ Huynh Check-In (${myChildren.length} Bé)`, `Parent Check-In (${myChildren.length} Children)`)}</span>
          </button>

          {isTeacherOrStaff && (
            <button
              onClick={() => setActiveTab("roster")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "roster"
                  ? "bg-indigo-950 text-white shadow-xs"
                  : "bg-white text-slate-700 border border-amber-200 hover:bg-amber-50"
              }`}
            >
              <Users2 className="w-4 h-4 text-amber-700" />
              <span>{bilingual(`Sĩ Số Phòng Học & Quét Mã Đón Bé (${rosterItems.length})`, `Classroom Roster & Code Verification (${rosterItems.length})`)}</span>
            </button>
          )}
        </div>

        {activeTab === "parent" && (
          <TactileButton
            variant="secondary"
            size="sm"
            onClick={() => setShowAddChildModal(true)}
          >
            <Plus className="w-3.5 h-3.5 mr-1 text-indigo-950" />
            <span>{bilingual("Đăng Ký Bé Mới", "+ Register Child")}</span>
          </TactileButton>
        )}
      </div>

      {/* TAB 1: PARENT CHECK-IN */}
      {activeTab === "parent" && (
        <div className="space-y-8">
          {/* Children Selection Card */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-amber-300/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-amber-200/70 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-amber-800 font-serif font-bold text-xl">†</span>
                <h3 className="font-scripture text-lg font-bold text-slate-900">
                  {bilingual("Chọn Các Bé Tham Dự Lớp Chúa Nhật Hôm Nay", "Select Children Attending Sunday School Today")}
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-serif">
                {bilingual("Chúa Nhật, ", "Sunday, ")}{new Date().toLocaleDateString(isEn ? "en-US" : "vi-VN")}
              </span>
            </div>

            {loadingChildren ? (
              <div className="py-12 text-center text-xs text-slate-500 font-serif">
                {bilingual("Đang tra cứu danh sách con của phụ huynh...", "Loading your registered children...")}
              </div>
            ) : myChildren.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <Baby className="w-10 h-10 mx-auto text-amber-600/50" />
                <p className="text-xs text-slate-500">
                  {bilingual("Bạn chưa đăng ký bé nào trong hệ thống trường Chúa Nhật.", "You have not registered any children in Sunday School yet.")}
                </p>
                <TactileButton variant="primary" size="sm" onClick={() => setShowAddChildModal(true)}>
                  {bilingual("Đăng Ký Bé Ngay", "Register Child Now")}
                </TactileButton>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myChildren.map((child) => {
                  const isSelected = selectedChildIds.includes(child.id);
                  const room = classroomLabels[child.classroom] || classroomLabels.preschool;

                  return (
                    <div
                      key={child.id}
                      onClick={() => toggleChildSelection(child.id)}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? "bg-amber-50/70 border-amber-500 shadow-xs"
                          : "bg-[#FCFBF8] border-slate-200 hover:bg-amber-50/30"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-sm text-slate-900">{child.fullName}</div>
                          <div className="text-[11px] text-slate-500 font-serif mt-0.5">
                            {bilingual("Ngày sinh: ", "Birthdate: ")}{child.birthDate}
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${room.color}`}
                        >
                          {room.title} ({room.age})
                        </span>
                      </div>

                      {child.allergies ? (
                        <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-semibold flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span>{bilingual("Dị ứng: ", "Allergies: ")}{child.allergies}</span>
                        </div>
                      ) : (
                        <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{bilingual("Không có tiền sử dị ứng", "No known allergies")}</span>
                        </div>
                      )}

                      <div className="pt-2 border-t border-amber-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-serif">{bilingual("Sẵn sàng điểm danh", "Ready for check-in")}</span>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-4 h-4 text-amber-600 rounded-sm focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {myChildren.length > 0 && (
              <div className="pt-3 flex items-center justify-end">
                <TactileButton
                  variant="gold"
                  size="md"
                  onClick={handleCheckin}
                  disabled={checkingIn || selectedChildIds.length === 0}
                >
                  <ShieldCheck className="w-4 h-4 mr-1.5" />
                  <span>
                    {checkingIn
                      ? bilingual("Đang Sinh Mã Bảo Mật...", "Generating Security Code...")
                      : bilingual(`Điểm Danh & Lấy Tem An Toàn (${selectedChildIds.length} Bé)`, `Check-in & Get Badges (${selectedChildIds.length} Children)`)}
                  </span>
                </TactileButton>
              </div>
            )}
          </div>

          {/* CHECK-IN SUCCESS RESULT: Claim Ticket & Nametags */}
          {checkinResult && (
            <div className="bg-[#FCFBF8] border-2 border-amber-400 rounded-2xl p-6 sm:p-8 shadow-md space-y-6 animate-in fade-in zoom-in-95">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-800">
                    <ShieldCheck className="w-7 h-7 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-scripture text-xl font-bold text-slate-900">
                      {bilingual("Điểm Danh Thành Công! Mã An Toàn: ", "Check-in Successful! Safety Code: ")}
                      <span className="text-amber-800 font-mono text-2xl font-bold ml-1">
                        {checkinResult.securityCode}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-600 font-serif">
                      {bilingual(
                        "Vui lòng dán tem tên lên áo của bé và lưu giữ vé đón để đối chiếu khi tan giờ nhóm.",
                        "Please attach nametag to child's shirt and keep claim ticket for checkout."
                      )}
                    </p>
                  </div>
                </div>

                <TactileButton variant="primary" size="sm" onClick={() => window.print()}>
                  <Printer className="w-3.5 h-3.5 mr-1" />
                  <span>{bilingual("In Tem Dán Áo & Vé Đón", "Print Badges & Claim Ticket")}</span>
                </TactileButton>
              </div>

              {/* Badges Display Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Guardian Claim Ticket (Vé Đón Bé Của Phụ Huynh) */}
                <div className="bg-white border-2 border-dashed border-indigo-950 p-5 rounded-2xl space-y-4 shadow-xs relative">
                  <div className="flex justify-between items-start border-b border-indigo-900/20 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900 font-serif">
                        {bilingual("Vé Đón Trẻ Em • Guardian Claim Ticket", "Guardian Claim Ticket • Parent Pickup")}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 mt-0.5">
                        {checkinResult.guardianClaimTicket.parentName}
                      </h4>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-500">{checkinResult.sessionDate}</div>
                      <div className="text-[10px] text-slate-500">
                        {checkinResult.guardianClaimTicket.timestamp}
                      </div>
                    </div>
                  </div>

                  <div className="text-center py-3 bg-amber-50/80 rounded-xl border border-amber-300">
                    <span className="text-[11px] font-bold text-amber-950 uppercase font-serif tracking-widest block">
                      {bilingual("MÃ BẢO MẬT ĐỐI CHIẾU DUY NHẤT", "MATCHING SECURITY CODE")}
                    </span>
                    <span className="text-4xl font-mono font-bold text-amber-900 tracking-wider">
                      {checkinResult.securityCode}
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <span className="font-bold text-slate-800">
                      {bilingual("Các bé được bảo hộ:", "Children in custody:")}
                    </span>
                    <ul className="list-disc list-inside text-slate-700">
                      {checkinResult.guardianClaimTicket.children.map((c, i) => (
                        <li key={i}>
                          <strong>{c.name}</strong> — {c.classroom}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-[10px] text-slate-500 font-serif italic leading-tight pt-2 border-t border-slate-100">
                    {checkinResult.guardianClaimTicket.legalNotice}
                  </p>
                </div>

                {/* 2. Child Security Nametags (Tem Dán Áo Cho Bé) */}
                <div className="space-y-4">
                  {checkinResult.childBadges.map((badge) => (
                    <div
                      key={badge.childId}
                      className="bg-white border-2 border-amber-500 p-5 rounded-2xl space-y-3 shadow-xs relative"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 font-serif">
                            {bilingual("Lớp Thiếu Nhi Chúa Nhật • Nametag", "Sunday School Child Nametag")}
                          </span>
                          <h4 className="font-bold text-base text-slate-900 mt-0.5">
                            {badge.fullName}
                          </h4>
                          <span className="text-xs font-semibold text-indigo-950">
                            {bilingual("Phòng Học: ", "Classroom: ")}{badge.classroom.toUpperCase()}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-2xl font-mono font-bold text-amber-900 block">
                            {badge.securityCode}
                          </span>
                          <span className="text-[10px] text-slate-500">{badge.sessionDate}</span>
                        </div>
                      </div>

                      {badge.allergies && (
                        <div className="bg-rose-600 text-white p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 uppercase tracking-wide">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>{bilingual("CẢNH BÁO Y TẾ: ", "MEDICAL ALERT: ")}{badge.allergies}</span>
                        </div>
                      )}

                      <div className="pt-2 border-t border-amber-100 flex justify-between items-center text-[11px] text-slate-600">
                        <span>
                          {bilingual("Cấp cứu: ", "Emergency: ")}<strong>{badge.emergencyContactName}</strong>
                        </span>
                        <span className="font-mono">{badge.emergencyContactPhone}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TEACHER CLASSROOM ROSTER & CHECKOUT */}
      {activeTab === "roster" && isTeacherOrStaff && (
        <div className="space-y-6">
          {/* Top Status & Verification Badge */}
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-950">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>
                <strong>{bilingual("Trạng Thái An Toàn: ", "Security Status: ")}</strong>
                {bilingual(
                  "Toàn bộ giáo viên và tình nguyện viên phụ trách đều đã hoàn thành kiểm tra lý lịch tư pháp (Verified Background Check).",
                  "All teachers and volunteers have completed comprehensive background checks."
                )}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-serif">
                {bilingual("Lọc theo phòng:", "Filter by room:")}
              </span>
              <select
                value={selectedClassroom}
                onChange={(e) => setSelectedClassroom(e.target.value)}
                className="h-8 px-2.5 bg-white border border-emerald-300 rounded-lg text-xs text-slate-900 cursor-pointer"
              >
                <option value="">{bilingual(`Tất Cả Các Lớp (${rosterItems.length})`, `All Rooms (${rosterItems.length})`)}</option>
                <option value="nursery">{bilingual("Nursery (0 - 2 Tuổi)", "Nursery (0 - 2 Yrs)")}</option>
                <option value="preschool">{bilingual("Pre-K (3 - 5 Tuổi)", "Pre-K (3 - 5 Yrs)")}</option>
                <option value="elementary">{bilingual("Elementary (6 - 11 Tuổi)", "Elementary (6 - 11 Yrs)")}</option>
                <option value="youth">{bilingual("Youth (12+ Tuổi)", "Youth (12+ Yrs)")}</option>
              </select>
            </div>
          </div>

          {checkoutSuccess && (
            <div className="p-3.5 bg-emerald-100 text-emerald-900 border border-emerald-400 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" />
              <span>{checkoutSuccess}</span>
            </div>
          )}

          {checkoutError && (
            <div className="p-3.5 bg-rose-100 text-rose-900 border border-rose-400 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-700" />
              <span>{checkoutError}</span>
            </div>
          )}

          {/* Roster Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loadingRoster ? (
              <div className="col-span-full py-12 text-center text-xs text-slate-500 font-serif">
                {bilingual("Đang tra cứu sĩ số phòng học...", "Loading classroom roster...")}
              </div>
            ) : rosterItems.length === 0 ? (
              <div className="col-span-full py-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-amber-200">
                {bilingual("Chưa có bé nào check-in trong phòng học này hôm nay.", "No children checked in to this classroom today.")}
              </div>
            ) : (
              rosterItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-white border border-amber-200/90 rounded-2xl space-y-3 shadow-xs hover:border-amber-400 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{item.child.fullName}</h4>
                      <div className="text-[11px] text-slate-500">
                        {bilingual("Phụ huynh: ", "Parent: ")}{item.parent?.fullName || bilingual("Quý Phụ Huynh", "Parent")}
                      </div>
                    </div>

                    <span className="font-mono font-bold text-xs bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full">
                      {bilingual("Mã: ", "Code: ")}{item.securityCode}
                    </span>
                  </div>

                  {item.child.allergies && (
                    <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>{item.child.allergies}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-amber-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500">
                      {bilingual("Vào lớp: ", "Check-in: ")}
                      {new Date(item.checkinTime).toLocaleTimeString(isEn ? "en-US" : "vi-VN", { hour: "2-digit", minute: "2-digit" })}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setCheckoutCheckinId(item.id);
                        setCheckoutCodeInput("");
                        setCheckoutError("");
                        setCheckoutSuccess("");
                      }}
                      className="px-2.5 py-1 bg-indigo-950 text-white rounded-lg text-xs font-semibold hover:bg-indigo-900 transition-all cursor-pointer"
                    >
                      {bilingual("Xuất Lớp (Checkout)", "Verify & Checkout")}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT VERIFICATION MODAL */}
      {checkoutCheckinId && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FCFBF8] border-2 border-amber-400 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-800" />
                <h3 className="font-scripture text-lg font-bold text-slate-900">
                  {bilingual("Đối Chiếu Mã Vé Phụ Huynh", "Match Guardian Claim Ticket Code")}
                </h3>
              </div>
              <button
                onClick={() => setCheckoutCheckinId(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-serif">
              {bilingual(
                "Xin yêu cầu phụ huynh xuất trình Vé Đón Bé (Claim Ticket) và nhập mã bảo mật (Ví dụ: G-7429) để đối chiếu trước khi bàn giao bé ra về.",
                "Please ask the guardian to present their Claim Ticket and enter the security code (e.g., G-7429) to verify before releasing the child."
              )}
            </p>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  {bilingual("Mã Bảo Mật Trên Vé Của Phụ Huynh *", "Security Code on Guardian Ticket *")}
                </label>
                <input
                  type="text"
                  required
                  placeholder={bilingual("Ví dụ: G-7429", "e.g., G-7429")}
                  value={checkoutCodeInput}
                  onChange={(e) => setCheckoutCodeInput(e.target.value.toUpperCase())}
                  className="w-full h-11 px-3 bg-white border-2 border-amber-300 rounded-xl font-mono text-center text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 uppercase tracking-widest"
                />
              </div>

              {checkoutError && (
                <div className="text-xs text-rose-700 font-semibold p-2 bg-rose-50 rounded-lg border border-rose-200">
                  {checkoutError}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCheckoutCheckinId(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
                >
                  {bilingual("Hủy Bỏ", "Cancel")}
                </button>
                <TactileButton variant="primary" size="md" type="submit">
                  {bilingual("Xác Nhận & Bàn Giao Bé", "Confirm & Release Child")}
                </TactileButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REGISTER CHILD MODAL */}
      {showAddChildModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FCFBF8] border-2 border-amber-400 rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
              <div className="flex items-center gap-2">
                <Baby className="w-5 h-5 text-amber-800" />
                <h3 className="font-scripture text-lg font-bold text-slate-900">
                  {bilingual("Đăng Ký Hồ Sơ Bé Mới", "Register New Child Profile")}
                </h3>
              </div>
              <button
                onClick={() => setShowAddChildModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterChild} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  {bilingual("Họ và Tên Bé *", "Child's Full Name *")}
                </label>
                <input
                  type="text"
                  required
                  placeholder={bilingual("Ví dụ: Joshua Nguyen", "e.g., Joshua Nguyen")}
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-amber-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    {bilingual("Ngày Sinh *", "Birthdate *")}
                  </label>
                  <input
                    type="date"
                    required
                    value={newChildBirthDate}
                    onChange={(e) => setNewChildBirthDate(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-amber-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    {bilingual("Phòng Học / Độ Tuổi *", "Classroom / Age Group *")}
                  </label>
                  <select
                    value={newChildClassroom}
                    onChange={(e) => setNewChildClassroom(e.target.value as any)}
                    className="w-full h-10 px-3 bg-white border border-amber-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value="nursery">{bilingual("Nursery (0 - 2 Tuổi)", "Nursery (0 - 2 Yrs)")}</option>
                    <option value="preschool">{bilingual("Pre-K (3 - 5 Tuổi)", "Pre-K (3 - 5 Yrs)")}</option>
                    <option value="elementary">{bilingual("Elementary (6 - 11 Tuổi)", "Elementary (6 - 11 Yrs)")}</option>
                    <option value="youth">{bilingual("Youth (12+ Tuổi)", "Youth (12+ Yrs)")}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  {bilingual("Tiền Sử Dị Ứng / Y Tế (Sẽ in màu đỏ nổi bật trên tem)", "Allergies / Medical Notes (Will be printed in bold red on nametag)")}
                </label>
                <input
                  type="text"
                  placeholder={bilingual("Ví dụ: Dị ứng đậu phộng (Peanut Allergy), hen suyễn", "e.g., Peanut Allergy, Asthma")}
                  value={newChildAllergies}
                  onChange={(e) => setNewChildAllergies(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-amber-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    {bilingual("Người Liên Hệ Khẩn Cấp *", "Emergency Contact Name *")}
                  </label>
                  <input
                    type="text"
                    required
                    value={newChildEmergencyName}
                    onChange={(e) => setNewChildEmergencyName(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-amber-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    {bilingual("Số Điện Thoại Khẩn Cấp *", "Emergency Contact Phone *")}
                  </label>
                  <input
                    type="text"
                    required
                    value={newChildEmergencyPhone}
                    onChange={(e) => setNewChildEmergencyPhone(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-amber-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddChildModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
                >
                  {bilingual("Hủy Bỏ", "Cancel")}
                </button>
                <TactileButton variant="primary" size="md" type="submit" disabled={savingChild}>
                  {savingChild
                    ? bilingual("Đang Lưu...", "Saving...")
                    : bilingual("Lưu Hồ Sơ Bé", "Save Child Profile")}
                </TactileButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
