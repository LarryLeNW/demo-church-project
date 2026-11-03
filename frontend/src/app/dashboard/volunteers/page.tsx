"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { apiFetch, ApiError } from "@/lib/api/client";
import { BentoCard } from "@/components/ui/bento-card";
import { TactileButton } from "@/components/ui/tactile-button";
import { TactileInput } from "@/components/ui/tactile-input";
import {
  HeartHandshake,
  Calendar,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Users,
  Music,
  Tv,
  Smile,
  ShieldCheck,
  Utensils,
  Plus,
  Clock,
  Sparkles,
  Search,
  Filter,
  Check,
  AlertCircle,
  HelpCircle,
  Trash2,
} from "lucide-react";

export type RosterStatus = "pending" | "confirmed" | "declined" | "swapped";

interface MinistryTeam {
  id: string;
  name: string;
  nameEn: string;
  leaderId: string | null;
  leaderName?: string | null;
  campusId: string;
  description: string | null;
  requiredClearance: boolean;
  color: string;
  iconName: string;
  memberCount?: number;
}

interface SundayRosterItem {
  id: string;
  serviceDate: string;
  serviceTitle: string;
  campusId: string;
  teamId: string;
  userId: string;
  roleTitle: string;
  status: RosterStatus;
  declineReason?: string | null;
  swapTargetUserId?: string | null;
  swapNotes?: string | null;
  notes?: string | null;
}

interface RosterDetail {
  roster: SundayRosterItem;
  team: MinistryTeam;
  volunteer: {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
  };
}

interface RosterOverviewResponse {
  stats: {
    total: number;
    confirmed: number;
    pending: number;
    declined: number;
    confirmationRate: number;
  };
  items: RosterDetail[];
}

const TEAM_ICONS: Record<string, any> = {
  Music: Music,
  Tv: Tv,
  Smile: Smile,
  ShieldCheck: ShieldCheck,
  Utensils: Utensils,
  Users: Users,
};

const CAMPUSES = [
  { id: "all", vi: "Tất cả các điểm nhóm (All Campuses)", en: "All Campuses" },
  { id: "Dallas Main Campus", vi: "Hội Thánh Dallas", en: "Dallas Main Campus" },
  { id: "Houston Campus", vi: "Hội Thánh Houston", en: "Houston Campus" },
  { id: "Fort Worth Campus", vi: "Hội Thánh Fort Worth", en: "Fort Worth Campus" },
  { id: "Austin Campus", vi: "Điểm Nhóm Sinh Viên Austin", en: "Austin Campus" },
];

export default function VolunteersPage() {
  const { user } = useAuth();
  const { bilingual, isEn } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<MinistryTeam[]>([]);
  const [mySchedule, setMySchedule] = useState<RosterDetail[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pastor & Coordinator View
  const isPastorOrLeader =
    user?.role === "senior_pastor" ||
    user?.role === "admin" ||
    user?.role === "ministry_leader";

  const [selectedCampus, setSelectedCampus] = useState("all");
  const [selectedDate, setSelectedDate] = useState("2026-11-08");
  const [overview, setOverview] = useState<RosterOverviewResponse | null>(null);

  // Join Team Modal
  const [joiningTeam, setJoiningTeam] = useState<MinistryTeam | null>(null);
  const [preferredRole, setPreferredRole] = useState("");
  const [joinNotes, setJoinNotes] = useState("");
  const [submittingJoin, setSubmittingJoin] = useState(false);

  // Decline Modal
  const [decliningRosterId, setDecliningRosterId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  const [submittingDecline, setSubmittingDecline] = useState(false);

  // Assign Roster Modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignServiceDate, setAssignServiceDate] = useState("2026-11-08");
  const [assignTeamId, setAssignTeamId] = useState("");
  const [assignRoleTitle, setAssignRoleTitle] = useState("");
  const [assignNotes, setAssignNotes] = useState("");
  const [submittingAssign, setSubmittingAssign] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchMyData = async () => {
    try {
      const [teamsData, scheduleData] = await Promise.all([
        apiFetch<MinistryTeam[]>("/volunteers/teams"),
        apiFetch<RosterDetail[]>("/volunteers/my-schedule"),
      ]);
      setTeams(teamsData);
      setMySchedule(scheduleData);
      if (teamsData.length > 0 && !assignTeamId) {
        setAssignTeamId(teamsData[0].id);
      }
    } catch (err) {
      console.error("Không thể tải dữ liệu phụng vụ:", err);
    }
  };

  const fetchAdminOverview = async () => {
    if (!isPastorOrLeader) return;
    try {
      const params = new URLSearchParams();
      if (selectedDate && selectedDate.trim()) {
        params.append("serviceDate", selectedDate.trim());
      }
      if (selectedCampus && selectedCampus !== "all") {
        params.append("campusId", selectedCampus);
      }
      const q = `/volunteers/roster${params.toString() ? `?${params.toString()}` : ""}`;
      const data = await apiFetch<RosterOverviewResponse>(q);
      setOverview(data);
    } catch (err) {
      console.error("Không thể tải danh sách ca trực:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchMyData();
      if (isPastorOrLeader) {
        await fetchAdminOverview();
      }
      setLoading(false);
    };
    init();
  }, [user]);

  useEffect(() => {
    if (isPastorOrLeader) {
      fetchAdminOverview();
    }
  }, [selectedCampus, selectedDate]);

  const handleConfirmRoster = async (rosterId: string) => {
    try {
      await apiFetch(`/volunteers/roster/${rosterId}/status`, {
        method: "PATCH",
        body: { status: "confirmed" },
      });
      showToast(
        bilingual(
          "Đã xác nhận sẵn sàng tham gia ca trực Chúa Nhật! Nguyện Chúa ban ơn.",
          "Confirmed Sunday serving shift! God bless your ministry.",
        ),
      );
      await Promise.all([fetchMyData(), fetchAdminOverview()]);
    } catch (err) {
      alert((err as ApiError).message || bilingual("Không thể xác nhận ca trực.", "Could not confirm shift."));
    }
  };

  const handleDeclineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decliningRosterId) return;
    setSubmittingDecline(true);
    try {
      await apiFetch(`/volunteers/roster/${decliningRosterId}/status`, {
        method: "PATCH",
        body: {
          status: "declined",
          declineReason: declineReason || bilingual("Bận việc đột xuất", "Unexpected schedule conflict"),
        },
      });
      showToast(bilingual("Đã báo bận cho ban phụng vụ.", "Shift decline recorded for ministry leaders."));
      setDecliningRosterId(null);
      setDeclineReason("");
      await Promise.all([fetchMyData(), fetchAdminOverview()]);
    } catch (err) {
      alert((err as ApiError).message || bilingual("Không thể từ chối ca trực.", "Could not decline shift."));
    } finally {
      setSubmittingDecline(false);
    }
  };

  const handleJoinTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joiningTeam) return;
    setSubmittingJoin(true);
    try {
      await apiFetch("/volunteers/join-team", {
        method: "POST",
        body: {
          teamId: joiningTeam.id,
          roleInTeam: preferredRole || undefined,
          notes: joinNotes || undefined,
        },
      });
      showToast(
        bilingual(
          `Đã ghi danh tham gia ${joiningTeam.name}!`,
          `Registered to join ${joiningTeam.nameEn || joiningTeam.name}!`,
        ),
      );
      setJoiningTeam(null);
      setPreferredRole("");
      setJoinNotes("");
      await fetchMyData();
    } catch (err) {
      alert((err as ApiError).message || bilingual("Không thể đăng ký tham gia.", "Could not submit registration."));
    } finally {
      setSubmittingJoin(false);
    }
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmittingAssign(true);
    try {
      await apiFetch("/volunteers/roster/assign", {
        method: "POST",
        body: {
          serviceDate: assignServiceDate,
          serviceTitle: bilingual("Lễ Thờ Phượng Chúa Nhật (10:00 AM)", "Sunday Worship Service (10:00 AM)"),
          campusId: selectedCampus === "all" ? "Dallas Main Campus" : selectedCampus,
          teamId: assignTeamId,
          userId: user.id,
          roleTitle: assignRoleTitle || bilingual("Thành viên phụng sự", "Ministry Servant"),
          notes: assignNotes || undefined,
        },
      });
      showToast(bilingual("Đã phân công ca trực Chúa Nhật thành công!", "Sunday serving assignment scheduled successfully!"));
      setShowAssignModal(false);
      setAssignRoleTitle("");
      setAssignNotes("");
      await Promise.all([fetchAdminOverview(), fetchMyData()]);
    } catch (err) {
      alert((err as ApiError).message || bilingual("Không thể phân công ca trực.", "Could not assign shift."));
    } finally {
      setSubmittingAssign(false);
    }
  };

  const handleDeleteSlot = async (rosterId: string) => {
    if (
      !confirm(
        bilingual(
          "Bạn có chắc chắn muốn xóa vị trí phân công ca trực này không?",
          "Are you sure you want to delete this shift assignment?",
        ),
      )
    )
      return;
    try {
      await apiFetch(`/volunteers/roster/${rosterId}`, { method: "DELETE" });
      showToast(bilingual("Đã hủy phân công ca trực.", "Shift assignment removed."));
      await Promise.all([fetchAdminOverview(), fetchMyData()]);
    } catch (err) {
      alert((err as ApiError).message || bilingual("Không thể xóa ca trực.", "Could not remove shift."));
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <span className="text-amber-800 font-serif text-3xl animate-spin select-none">†</span>
        <span className="text-sm font-serif italic text-slate-600">
          {bilingual(
            '"Đang chuẩn bị danh sách các ban phụng sự Nhà Chúa..."',
            '"Preparing ministry teams and serving rosters..."',
          )}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-950 text-white px-5 py-3 rounded-xl shadow-xl border border-amber-400/50 flex items-center gap-2.5 text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-200/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-serif text-amber-800 tracking-wider uppercase mb-1">
            <span>†</span>
            <span>{bilingual("Phục Vụ Chúa Bằng Ơn Ban • Ministry Rostering", "Serving Through Spiritual Gifts • Volunteer Rostering")}</span>
          </div>
          <h1 className="font-scripture text-3xl font-bold text-slate-900 tracking-tight">
            {bilingual("Ban Phụng Vụ & Lịch Trực Chúa Nhật", "Volunteer Ministries & Sunday Roster")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {bilingual(
              '"Mỗi người trong anh em hãy lấy ơn mình đã được mà giúp lẫn nhau, khác nào người quản lý khôn khéo giữ các thứ ân điển của Đức Chúa Trời." — 1 Phi-e-rơ 4:10',
              '"Each of you should use whatever gift you have received to serve others, as faithful stewards of God’s grace in its various forms." — 1 Peter 4:10',
            )}
          </p>
        </div>

        {isPastorOrLeader && (
          <div className="shrink-0 flex items-center gap-3">
            <TactileButton
              variant="gold"
              size="md"
              onClick={() => setShowAssignModal(true)}
              className="flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{bilingual("+ Phân Công Ca Trực Mới", "+ Assign New Roster Slot")}</span>
            </TactileButton>
          </div>
        )}
      </div>

      {/* 1. MEMBER SECTION: MY SERVING SCHEDULE */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-800" />
            <h2 className="font-scripture text-xl font-bold text-slate-900">
              {bilingual("Lịch Phục Vụ Chúa Nhật Của Tôi", "My Sunday Serving Schedule")}
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-serif">
            {bilingual(
              `${mySchedule.length} ca trực được phân công`,
              `${mySchedule.length} assigned serving shifts`,
            )}
          </span>
        </div>

        {mySchedule.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mySchedule.map(({ roster, team }) => {
              const Icon = TEAM_ICONS[team.iconName] || Users;
              const isConfirmed = roster.status === "confirmed";
              const isPending = roster.status === "pending";
              const isDeclined = roster.status === "declined";

              return (
                <div
                  key={roster.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                    isConfirmed
                      ? "bg-white border-emerald-300 shadow-xs"
                      : isPending
                      ? "bg-gradient-to-br from-amber-50/90 to-white border-amber-300 shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-500 opacity-75"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`p-2.5 rounded-xl ${
                            isConfirmed
                              ? "bg-emerald-100 text-emerald-900"
                              : "bg-indigo-100 text-indigo-950"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-scripture text-sm font-bold text-slate-900 leading-snug">
                            {isEn ? (team.nameEn || team.name) : team.name}
                          </h3>
                          <span className="text-[10px] text-slate-500">{roster.campusId}</span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isConfirmed
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                            : isPending
                            ? "bg-amber-100 text-amber-900 border-amber-300 animate-pulse"
                            : "bg-rose-100 text-rose-800 border-rose-300"
                        }`}
                      >
                        {isConfirmed
                          ? bilingual("✓ Đã Xác Nhận", "✓ Confirmed")
                          : isPending
                          ? bilingual("⏳ Chờ Phản Hồi", "⏳ Awaiting Confirmation")
                          : bilingual("✕ Đã Báo Bận", "✕ Declined / Unavailable")}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#FCFBF8] border border-amber-200/60 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-serif">
                          {bilingual("Chúa Nhật Ngày:", "Sunday Date:")}
                        </span>
                        <span className="font-bold text-indigo-950 font-mono">
                          {roster.serviceDate}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-serif">
                          {bilingual("Vị trí đảm nhận:", "Serving Role:")}
                        </span>
                        <span className="font-bold text-slate-900">{roster.roleTitle}</span>
                      </div>
                      {roster.notes && (
                        <p className="text-[11px] text-slate-600 italic pt-1 border-t border-amber-100">
                          {bilingual("Ghi chú:", "Notes:")} {roster.notes}
                        </p>
                      )}
                      {roster.declineReason && (
                        <p className="text-[11px] text-rose-700 italic pt-1 border-t border-rose-100">
                          {bilingual("Lý do vắng:", "Reason for decline:")} {roster.declineReason}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {isPending && (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-100">
                      <button
                        onClick={() => handleConfirmRoster(roster.id)}
                        className="w-full py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{bilingual("Sẵn Sàng", "Accept Shift")}</span>
                      </button>

                      <button
                        onClick={() => setDecliningRosterId(roster.id)}
                        className="w-full py-2 rounded-xl border border-rose-300 hover:bg-rose-50 text-rose-800 text-xs font-semibold cursor-pointer flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{bilingual("Báo Bận", "Decline")}</span>
                      </button>
                    </div>
                  )}

                  {isConfirmed && (
                    <div className="flex items-center justify-between pt-2 border-t border-emerald-100 text-[11px] text-emerald-800 font-medium">
                      <span>{bilingual("Bạn đã xác nhận ca trực này.", "You confirmed this serving shift.")}</span>
                      <button
                        onClick={() => setDecliningRosterId(roster.id)}
                        className="text-slate-500 hover:text-rose-700 underline cursor-pointer"
                      >
                        {bilingual("Đổi ý?", "Change?")}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-white border border-amber-200/80 text-center space-y-2">
            <Sparkles className="w-8 h-8 text-amber-700 mx-auto" />
            <h3 className="font-scripture text-base font-bold text-slate-900">
              {bilingual("Bạn chưa có ca trực nào sắp tới", "No upcoming serving shifts")}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {bilingual(
                "Hãy chọn một ban ngành phụng vụ bên dưới để đăng ký dâng ân tứ phục vụ Hội Thánh trong các buổi nhóm Chúa Nhật!",
                "Choose a ministry team below to sign up and use your spiritual gifts serving the Church on Sundays!",
              )}
            </p>
          </div>
        )}
      </section>

      {/* 2. MINISTRY TEAMS DIRECTORY */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-800" />
            <h2 className="font-scripture text-xl font-bold text-slate-900">
              {bilingual("Các Ban Ngành Phụng Vụ Của Hội Thánh", "Church Ministry Teams & Departments")}
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-serif">
            {bilingual(
              "Đang chiêu mộ tín hữu dâng ân tứ phục vụ",
              "Welcoming volunteers to serve through their gifts",
            )}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {teams.map((team) => {
            const Icon = TEAM_ICONS[team.iconName] || Users;
            return (
              <div
                key={team.id}
                className="p-6 rounded-2xl bg-white border border-amber-200/80 shadow-xs flex flex-col justify-between gap-4 hover:border-amber-300 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="p-3 rounded-xl bg-amber-50 text-indigo-950 border border-amber-200/60">
                      <Icon className="w-6 h-6" />
                    </div>
                    {team.requiredClearance && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Child Safety Clearance</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-scripture text-base font-bold text-slate-900">
                      {isEn ? (team.nameEn || team.name) : team.name}
                    </h3>
                    <p className="text-[11px] text-amber-800 font-serif font-medium mt-0.5">
                      {isEn ? team.name : team.nameEn}
                    </p>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {team.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-amber-100 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      {bilingual("Trưởng ban:", "Leader:")}{" "}
                      <strong>{team.leaderName || bilingual("Chưa bổ nhiệm", "Unassigned")}</strong>
                    </span>
                    <span>
                      {bilingual("Thành viên:", "Members:")}{" "}
                      <strong>
                        {team.memberCount || 0} {bilingual("người", "volunteers")}
                      </strong>
                    </span>
                  </div>
                </div>

                <TactileButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setJoiningTeam(team)}
                  className="w-full justify-center"
                >
                  <HeartHandshake className="w-4 h-4 mr-1 text-amber-800" />
                  <span>{bilingual("Đăng Ký Tham Gia Ban Này", "Join This Ministry Team")}</span>
                </TactileButton>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. PASTOR & COORDINATOR SUNDAY ROSTER MANAGEMENT */}
      {isPastorOrLeader && (
        <section className="space-y-6 pt-6 border-t border-amber-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-serif text-amber-800 uppercase tracking-wider">
                <span>†</span>
                <span>{bilingual("Điều Phối Mục Vụ • Sunday Service Roster Board", "Ministry Coordination • Sunday Service Roster Board")}</span>
              </div>
              <h2 className="font-scripture text-2xl font-bold text-slate-900">
                {bilingual("Bảng Phân Công & Tỷ Lệ Sẵn Sàng Chúa Nhật", "Sunday Service Roster & Readiness Rate")}
              </h2>
            </div>

            {/* Date & Campus Selectors */}
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-amber-300 text-xs font-semibold text-slate-800 focus:outline-none"
              />
              <select
                value={selectedCampus}
                onChange={(e) => setSelectedCampus(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-amber-300 text-xs font-semibold text-slate-800 focus:outline-none"
              >
                {CAMPUSES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {isEn ? c.en : c.vi}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Roster Overview Stats */}
          {overview && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white border border-amber-200 shadow-xs">
                <span className="text-xs text-slate-500 font-serif">
                  {bilingual("Tổng Vị Trí Phân Công", "Total Assigned Slots")}
                </span>
                <p className="font-scripture text-2xl font-bold text-slate-900 mt-1">
                  {overview.stats.total}
                </p>
                <span className="text-[10px] text-slate-400">
                  {bilingual("Ca trực Chúa Nhật", "Sunday shift positions")}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-amber-200 shadow-xs">
                <span className="text-xs text-slate-500 font-serif">
                  {bilingual("Đã Xác Nhận (Confirmed)", "Confirmed Volunteers")}
                </span>
                <p className="font-scripture text-2xl font-bold text-emerald-700 mt-1">
                  {overview.stats.confirmed}
                </p>
                <span className="text-[10px] text-emerald-600 font-semibold">
                  {bilingual("Tỷ lệ sẵn sàng:", "Readiness rate:")} {overview.stats.confirmationRate}%
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-amber-200 shadow-xs">
                <span className="text-xs text-slate-500 font-serif">
                  {bilingual("Chờ Phản Hồi (Pending)", "Pending Confirmation")}
                </span>
                <p className="font-scripture text-2xl font-bold text-amber-800 mt-1">
                  {overview.stats.pending}
                </p>
                <span className="text-[10px] text-amber-700">
                  {bilingual("Cần nhắc nhở trước T7", "Remind by Saturday")}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-amber-200 shadow-xs">
                <span className="text-xs text-slate-500 font-serif">
                  {bilingual("Báo Bận (Declined)", "Declined / Unavailable")}
                </span>
                <p className="font-scripture text-2xl font-bold text-rose-700 mt-1">
                  {overview.stats.declined}
                </p>
                <span className="text-[10px] text-rose-600">
                  {bilingual("Cần tìm người thay thế", "Requires substitute")}
                </span>
              </div>
            </div>
          )}

          {/* Roster Items Table */}
          <div className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-xs space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-amber-200 text-slate-500 font-serif">
                    <th className="pb-3 font-semibold">{bilingual("Ban Ngành", "Ministry Team")}</th>
                    <th className="pb-3 font-semibold">{bilingual("Vị Trí Phụng Vụ", "Serving Role")}</th>
                    <th className="pb-3 font-semibold">{bilingual("Tình Nguyện Viên", "Volunteer")}</th>
                    <th className="pb-3 font-semibold">{bilingual("Trạng Thái", "Status")}</th>
                    <th className="pb-3 font-semibold">{bilingual("Ghi Chú", "Notes")}</th>
                    <th className="pb-3 font-semibold text-right">{bilingual("Thao Tác", "Action")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100/70">
                  {overview?.items && overview.items.length > 0 ? (
                    overview.items.map(({ roster, team, volunteer }) => (
                      <tr key={roster.id} className="hover:bg-amber-50/40 transition-colors">
                        <td className="py-3.5 pr-4">
                          <span className="font-bold text-slate-900">
                            {isEn ? (team.nameEn || team.name) : team.name}
                          </span>
                          <span className="block text-[10px] text-slate-400 font-mono">
                            {roster.campusId}
                          </span>
                        </td>
                        <td className="py-3.5 pr-4 font-semibold text-indigo-950">
                          {roster.roleTitle}
                        </td>
                        <td className="py-3.5 pr-4">
                          <span className="font-bold text-slate-900">{volunteer.fullName}</span>
                          <span className="block text-[10px] text-slate-500">{volunteer.email}</span>
                        </td>
                        <td className="py-3.5 pr-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              roster.status === "confirmed"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                : roster.status === "pending"
                                ? "bg-amber-50 text-amber-900 border-amber-300"
                                : "bg-rose-50 text-rose-800 border-rose-300"
                            }`}
                          >
                            {roster.status === "confirmed"
                              ? bilingual("✓ Đã xác nhận", "✓ Confirmed")
                              : roster.status === "pending"
                              ? bilingual("Chờ xác nhận", "Pending")
                              : bilingual("✕ Báo bận", "Declined")}
                          </span>
                        </td>
                        <td className="py-3.5 pr-4 text-slate-600 text-[11px] max-w-xs truncate">
                          {roster.declineReason ? (
                            <span className="text-rose-700">
                              {bilingual("Lý do:", "Reason:")} {roster.declineReason}
                            </span>
                          ) : (
                            roster.notes || "—"
                          )}
                        </td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => handleDeleteSlot(roster.id)}
                            title={bilingual("Xóa phân công", "Remove assignment")}
                            className="p-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500 italic">
                        {bilingual(
                          `Chưa có lịch phân công nào cho ngày Chúa Nhật ${selectedDate}. Bấm "+ Phân Công Ca Trực Mới" để lên lịch.`,
                          `No serving roster assignments for Sunday ${selectedDate}. Click "+ Assign New Roster Slot" to schedule.`,
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* MODAL 1: JOIN MINISTRY TEAM */}
      {joiningTeam && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-amber-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-amber-800" />
                <h3 className="font-scripture text-lg font-bold text-slate-900">
                  {bilingual("Ghi Danh Phụng Sự", "Volunteer Signup")}
                </h3>
              </div>
              <button
                onClick={() => setJoiningTeam(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-slate-800">
              <p>
                <strong>{bilingual("Ban:", "Ministry:")}</strong> {isEn ? (joiningTeam.nameEn || joiningTeam.name) : joiningTeam.name}
              </p>
              {joiningTeam.requiredClearance && (
                <p className="mt-1 text-rose-800 font-medium">
                  {bilingual(
                    "* Ban này yêu cầu xác minh an toàn nhi đồng (Background Check) trước khi đứng lớp.",
                    "* This ministry requires Child Safety Background Clearance before serving.",
                  )}
                </p>
              )}
            </div>

            <form onSubmit={handleJoinTeamSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-serif font-bold text-slate-800 mb-1">
                  {bilingual("Vị trí hoặc nhạc cụ / ân tứ bạn muốn phụng sự:", "Preferred role, instrument, or area of serving:")}
                </label>
                <TactileInput
                  type="text"
                  value={preferredRole}
                  onChange={(e) => setPreferredRole(e.target.value)}
                  placeholder={bilingual(
                    "Ví dụ: Piano, Hát Bè, Tiếp tân, Kỹ thuật Mixer...",
                    "e.g. Piano, Vocalist, Usher, Audio Tech...",
                  )}
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-slate-800 mb-1">
                  {bilingual("Kinh nghiệm hoặc ghi chú gửi Trưởng ban:", "Experience or note for Ministry Leader:")}
                </label>
                <textarea
                  rows={3}
                  value={joinNotes}
                  onChange={(e) => setJoinNotes(e.target.value)}
                  placeholder={bilingual(
                    "Tôi có thể phục vụ vào các Chúa Nhật tuần 1 và 3...",
                    "I can serve on 1st and 3rd Sundays of the month...",
                  )}
                  className="w-full p-2.5 rounded-xl border border-amber-300 text-xs text-slate-800 focus:outline-none focus:border-indigo-950 font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-100">
                <button
                  type="button"
                  onClick={() => setJoiningTeam(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  {bilingual("Hủy Bỏ", "Cancel")}
                </button>
                <TactileButton
                  type="submit"
                  variant="gold"
                  size="md"
                  disabled={submittingJoin}
                >
                  {submittingJoin
                    ? bilingual("Đang gửi...", "Submitting...")
                    : bilingual("Xác Nhận Đăng Ký", "Confirm Signup")}
                </TactileButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DECLINE ROSTER REASON */}
      {decliningRosterId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-amber-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
              <div className="flex items-center gap-2 text-rose-800">
                <XCircle className="w-5 h-5" />
                <h3 className="font-scripture text-base font-bold text-slate-900">
                  {bilingual("Báo Bận Ca Trực", "Report Shift Unavailable")}
                </h3>
              </div>
              <button
                onClick={() => setDecliningRosterId(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDeclineSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-serif font-bold text-slate-800 mb-1">
                  {bilingual(
                    "Lý do vắng mặt (để trưởng ban kịp điều phối người thay thế):",
                    "Reason for absence (to help schedule a substitute):",
                  )}
                </label>
                <textarea
                  rows={3}
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  placeholder={bilingual(
                    "Ví dụ: Bận công tác xa, gia đình có việc hiếu...",
                    "e.g. Out of town, family emergency, unwell...",
                  )}
                  required
                  className="w-full p-2.5 rounded-xl border border-rose-300 text-xs text-slate-800 focus:outline-none focus:border-rose-700 font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-100">
                <button
                  type="button"
                  onClick={() => setDecliningRosterId(null)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-700 cursor-pointer"
                >
                  {bilingual("Đóng", "Close")}
                </button>
                <button
                  type="submit"
                  disabled={submittingDecline}
                  className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold cursor-pointer"
                >
                  {submittingDecline
                    ? bilingual("Đang gửi...", "Submitting...")
                    : bilingual("Xác Nhận Báo Bận", "Confirm Unavailable")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ASSIGN NEW ROSTER (PASTOR ACTION) */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-amber-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-800" />
                <h3 className="font-scripture text-lg font-bold text-slate-900">
                  {bilingual("Phân Công Ca Trực Chúa Nhật Mới", "Assign New Sunday Roster Slot")}
                </h3>
              </div>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-serif font-bold text-slate-800 mb-1">
                  {bilingual("Ngày Phụng Vụ:", "Service Date:")}
                </label>
                <input
                  type="date"
                  value={assignServiceDate}
                  onChange={(e) => setAssignServiceDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-amber-300 text-xs text-slate-800 focus:outline-none focus:border-indigo-950 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-slate-800 mb-1">
                  {bilingual("Chọn Ban Ngành Phụng Vụ:", "Select Ministry Team:")}
                </label>
                <select
                  value={assignTeamId}
                  onChange={(e) => setAssignTeamId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-amber-300 text-xs text-slate-800 focus:outline-none focus:border-indigo-950"
                  required
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {isEn ? (t.nameEn || t.name) : t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-slate-800 mb-1">
                  {bilingual("Vị Trí Phụng Vụ (Role Title):", "Serving Role / Title:")}
                </label>
                <TactileInput
                  type="text"
                  value={assignRoleTitle}
                  onChange={(e) => setAssignRoleTitle(e.target.value)}
                  placeholder={bilingual(
                    "Ví dụ: Hát Chính, Đệm Đàn Piano, Đón Tiếp...",
                    "e.g. Worship Leader, Keyboard, Greeter...",
                  )}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-slate-800 mb-1">
                  {bilingual("Ghi Chú Cho Tình Nguyện Viên:", "Instructions / Notes for Volunteer:")}
                </label>
                <textarea
                  rows={2}
                  value={assignNotes}
                  onChange={(e) => setAssignNotes(e.target.value)}
                  placeholder={bilingual(
                    "Giờ tổng duyệt, tài liệu bài hát...",
                    "Sound check time, sheet music links...",
                  )}
                  className="w-full p-2.5 rounded-xl border border-amber-300 text-xs text-slate-800 focus:outline-none focus:border-indigo-950 font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-100">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  {bilingual("Hủy Bỏ", "Cancel")}
                </button>
                <TactileButton
                  type="submit"
                  variant="gold"
                  size="md"
                  disabled={submittingAssign}
                >
                  {submittingAssign
                    ? bilingual("Đang lưu...", "Saving...")
                    : bilingual("Lưu Phân Công", "Save Assignment")}
                </TactileButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
