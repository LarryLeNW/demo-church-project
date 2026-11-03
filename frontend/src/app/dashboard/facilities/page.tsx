"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { apiFetch, ApiError } from "@/lib/api/client";
import { BentoCard } from "@/components/ui/bento-card";
import { TactileButton } from "@/components/ui/tactile-button";
import {
  Building,
  Church,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Users,
  Utensils,
  Flame,
  BookOpen,
  Sparkles,
  MapPin,
  Mic2,
  Tv,
  Music,
  Wine,
  Shirt,
  ShieldCheck,
  Search,
} from "lucide-react";

export type FacilityType =
  | "sanctuary"
  | "fellowship_hall"
  | "chapel"
  | "classroom"
  | "youth_center"
  | "conference_room"
  | "pastor_office"
  | "nursery";

export type ReservationStatus = "pending" | "approved" | "rejected" | "cancelled";

export type EquipmentType =
  | "audio_sound"
  | "video_livestream"
  | "musical_instrument"
  | "furniture"
  | "communion_holy_baptism";

export type EquipmentCondition = "excellent" | "good" | "fair" | "maintenance_required";

export interface FacilityRoomItem {
  id: string;
  name: string;
  type: FacilityType;
  campusId: string;
  capacity: number;
  amenities: string[];
  isAvailable: boolean;
  requiresApproval: boolean;
  notes: string | null;
}

export interface FacilityReservationItem {
  id: string;
  roomId: string;
  room?: FacilityRoomItem;
  requestedByUserId: string;
  requestedByUserName: string;
  eventName: string;
  ministryName: string;
  campusId: string;
  startTime: string;
  endTime: string;
  setupNotes: string | null;
  status: ReservationStatus;
  approvedByUserName: string | null;
  rejectionReason: string | null;
  createdAt: string;
}

export interface EquipmentItemRecord {
  id: string;
  name: string;
  type: EquipmentType;
  campusId: string;
  quantity: number;
  availableQuantity: number;
  condition: EquipmentCondition;
  location: string;
  notes: string | null;
}

export interface FacilitiesOverviewStats {
  totalRooms: number;
  availableRooms: number;
  pendingReservations: number;
  approvedReservations: number;
  totalEquipmentCount: number;
}

const FACILITY_TYPE_LABELS: Record<FacilityType, { labelVi: string; labelEn: string; icon: any }> = {
  sanctuary: { labelVi: "Thánh Đường Chính", labelEn: "Main Sanctuary", icon: Church },
  fellowship_hall: { labelVi: "Nhà Thông Công & Ẩm Thực", labelEn: "Fellowship Hall & Dining", icon: Utensils },
  chapel: { labelVi: "Nhà Nguyện Tĩnh Nguyện", labelEn: "Prayer Chapel", icon: Flame },
  classroom: { labelVi: "Phòng Học Trường Chúa Nhật", labelEn: "Sunday School Classroom", icon: BookOpen },
  youth_center: { labelVi: "Phòng Sinh Hoạt Thanh Thiếu Niên", labelEn: "Youth Center", icon: Sparkles },
  conference_room: { labelVi: "Phòng Họp Ban Trị Sự", labelEn: "Board Conference Room", icon: Users },
  pastor_office: { labelVi: "Văn Phòng Tư Vấn Mục Vụ", labelEn: "Pastoral Counseling Office", icon: Building },
  nursery: { labelVi: "Phòng Hài Nhi & Chăm Sóc Mẹ Bé", labelEn: "Nursery & Mother-Baby Care", icon: ShieldCheck },
};

const EQUIPMENT_TYPE_LABELS: Record<EquipmentType, { labelVi: string; labelEn: string; icon: any }> = {
  audio_sound: { labelVi: "Âm Thanh & Micro", labelEn: "Audio & Microphones", icon: Mic2 },
  video_livestream: { labelVi: "Máy Chiếu & Livestream", labelEn: "Video Projector & Livestream", icon: Tv },
  musical_instrument: { labelVi: "Nhạc Cụ & Piano", labelEn: "Musical Instruments & Piano", icon: Music },
  furniture: { labelVi: "Bàn Ghế & Khánh Tiết", labelEn: "Chairs, Tables & Furnishings", icon: Users },
  communion_holy_baptism: { labelVi: "Thánh Lễ (Tiệc Thánh & Báp-têm)", labelEn: "Holy Sacraments (Communion & Baptism)", icon: Wine },
};

const CAMPUSES = [
  { id: "all", name: "Tất cả các điểm nhóm (All Campuses)" },
  { id: "Dallas Main Campus", name: "Hội Thánh Dallas (Dallas Main Campus)" },
  { id: "Houston Campus", name: "Hội Thánh Houston (Houston Campus)" },
  { id: "Fort Worth Campus", name: "Hội Thánh Fort Worth (Fort Worth Campus)" },
  { id: "Austin Campus", name: "Điểm Nhóm Sinh Viên Austin (Austin Campus)" },
];

export default function FacilitiesPage() {
  const { user } = useAuth();
  const { bilingual, isEn } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"reservations" | "rooms" | "equipment" | "my">("reservations");
  const [selectedCampus, setSelectedCampus] = useState("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Data State
  const [stats, setStats] = useState<FacilitiesOverviewStats>({
    totalRooms: 0,
    availableRooms: 0,
    pendingReservations: 0,
    approvedReservations: 0,
    totalEquipmentCount: 0,
  });
  const [rooms, setRooms] = useState<FacilityRoomItem[]>([]);
  const [reservations, setReservations] = useState<FacilityReservationItem[]>([]);
  const [myReservations, setMyReservations] = useState<FacilityReservationItem[]>([]);
  const [equipmentList, setEquipmentList] = useState<EquipmentItemRecord[]>([]);

  // Filter & Search
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");

  // Modals
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState<FacilityReservationItem | null>(null);
  const [showRoomModal, setShowRoomModal] = useState(false);

  // Form State: Create Reservation
  const [resRoomId, setResRoomId] = useState("");
  const [resEventName, setResEventName] = useState("");
  const [resMinistryName, setResMinistryName] = useState("");
  const [resStartTime, setResStartTime] = useState("");
  const [resEndTime, setResEndTime] = useState("");
  const [resSetupNotes, setResSetupNotes] = useState("");
  const [submittingReserve, setSubmittingReserve] = useState(false);

  // Form State: Review Reservation
  const [reviewStatus, setReviewStatus] = useState<ReservationStatus>("approved");
  const [rejectionReason, setRejectionReason] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Form State: Create Room
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomType, setNewRoomType] = useState<FacilityType>("classroom");
  const [newRoomCapacity, setNewRoomCapacity] = useState(30);
  const [newRoomAmenities, setNewRoomAmenities] = useState("Máy chiếu, Bảng trắng kính, Loa trợ giảng");
  const [newRoomNotes, setNewRoomNotes] = useState("");
  const [submittingRoom, setSubmittingRoom] = useState(false);

  const isPastorOrLeader =
    user?.role === "senior_pastor" ||
    user?.role === "admin" ||
    user?.role === "ministry_leader";

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const qCampus = `?campusId=${encodeURIComponent(selectedCampus)}`;
      const resParams = new URLSearchParams({ campusId: selectedCampus });
      if (statusFilter && statusFilter !== "all") {
        resParams.append("status", statusFilter);
      }
      if (dateFilter && dateFilter.trim()) {
        resParams.append("date", dateFilter.trim());
      }

      const [statsRes, roomsRes, resRes, eqRes] = await Promise.all([
        apiFetch<FacilitiesOverviewStats>(`/facilities/overview${qCampus}`),
        apiFetch<FacilityRoomItem[]>(`/facilities/rooms${qCampus}`),
        apiFetch<FacilityReservationItem[]>(`/facilities/reservations?${resParams.toString()}`),
        apiFetch<EquipmentItemRecord[]>(`/facilities/equipment${qCampus}`),
      ]);

      setStats(statsRes);
      setRooms(roomsRes);
      setReservations(resRes);
      setEquipmentList(eqRes);

      if (user) {
        const myRes = await apiFetch<FacilityReservationItem[]>("/facilities/reservations/my");
        setMyReservations(myRes);
      }
    } catch (err) {
      console.error("Lỗi nạp dữ liệu cơ sở vật chất:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user, selectedCampus, statusFilter, dateFilter]);

  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resRoomId || !resEventName.trim() || !resMinistryName.trim() || !resStartTime || !resEndTime) {
      showToast(
        bilingual(
          "Vui lòng điền đầy đủ phòng, tên sự kiện, ban ngành và khung giờ.",
          "Please fill in room, event name, ministry, and time slots."
        )
      );
      return;
    }

    try {
      setSubmittingReserve(true);
      await apiFetch("/facilities/reservations", {
        method: "POST",
        body: JSON.stringify({
          roomId: resRoomId,
          eventName: resEventName,
          ministryName: resMinistryName,
          campusId: selectedCampus === "all" ? "Dallas Main Campus" : selectedCampus,
          startTime: new Date(resStartTime).toISOString(),
          endTime: new Date(resEndTime).toISOString(),
          setupNotes: resSetupNotes,
        }),
      });

      showToast(
        bilingual(
          "Đã gửi đơn đặt phòng nhóm thành công!",
          "Room reservation submitted successfully!"
        )
      );
      setShowReserveModal(false);
      setResEventName("");
      setResMinistryName("");
      setResStartTime("");
      setResEndTime("");
      setResSetupNotes("");
      await loadData();
    } catch (err: any) {
      showToast(
        err?.message ||
          bilingual(
            "Không thể đặt phòng. Vui lòng kiểm tra lại khung giờ.",
            "Could not reserve room. Please check the time slot."
          )
      );
    } finally {
      setSubmittingReserve(false);
    }
  };

  const handleReviewReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showReviewModal) return;

    try {
      setSubmittingReview(true);
      await apiFetch(`/facilities/reservations/${showReviewModal.id}/review`, {
        method: "PATCH",
        body: JSON.stringify({
          status: reviewStatus,
          rejectionReason: reviewStatus === "rejected" ? rejectionReason : undefined,
        }),
      });

      showToast(
        reviewStatus === "approved"
          ? bilingual(
              "Đã duyệt và xác nhận lịch đặt phòng!",
              "Room reservation approved and confirmed!"
            )
          : bilingual("Đã từ chối đơn đặt phòng.", "Room reservation declined.")
      );
      setShowReviewModal(null);
      setRejectionReason("");
      await loadData();
    } catch (err: any) {
      showToast(
        err?.message ||
          bilingual("Không thể cập nhật phê duyệt.", "Could not update reservation approval.")
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim() || !newRoomCapacity) {
      showToast(
        bilingual(
          "Vui lòng điền tên phòng và sức chứa.",
          "Please enter room name and capacity."
        )
      );
      return;
    }

    const amenitiesParsed = newRoomAmenities
      .split(/[,;\n]/)
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      setSubmittingRoom(true);
      await apiFetch("/facilities/rooms", {
        method: "POST",
        body: JSON.stringify({
          name: newRoomName,
          type: newRoomType,
          campusId: selectedCampus === "all" ? "Dallas Main Campus" : selectedCampus,
          capacity: Number(newRoomCapacity),
          amenities: amenitiesParsed,
          notes: newRoomNotes,
          requiresApproval: true,
        }),
      });

      showToast(
        bilingual(
          "Đã thêm phòng nhóm mới vào cơ sở vật chất Hội Thánh!",
          "New facility room successfully added to church directory!"
        )
      );
      setShowRoomModal(false);
      setNewRoomName("");
      setNewRoomNotes("");
      await loadData();
    } catch (err: any) {
      showToast(
        err?.message ||
          bilingual("Không thể tạo phòng.", "Could not create new room.")
      );
    } finally {
      setSubmittingRoom(false);
    }
  };

  const getStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600" />
            {bilingual("Chờ Ban Trị Sự Duyệt", "Pending Board Approval")}
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            {bilingual("Đã Phê Duyệt & Khóa Lịch", "Approved & Confirmed")}
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-300">
            <XCircle className="w-3 h-3 text-rose-600" />
            {bilingual("Từ Chối", "Rejected")}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
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

      {/* Header Banner - Sacred Grace & Psalm 26:8 */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-amber-950 text-white p-8 md:p-10 shadow-lg border border-amber-400/30">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-medium tracking-wide border border-amber-400/30 mb-3">
            <Building className="w-3.5 h-3.5" />
            <span>
              {bilingual(
                "QUẢN TRỊ CƠ SỞ VẬT CHẤT • CHURCH FACILITIES & EQUIPMENT",
                "CHURCH FACILITIES & EQUIPMENT • SACRED STEWARDSHIP"
              )}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-amber-100 mb-3">
            {bilingual(
              "Phòng Nhóm, Thiết Bị Thánh Lễ & Cơ Sở Hội Thánh",
              "Sanctuaries, Sacred Equipment & Facilities"
            )}
          </h1>
          <p className="font-serif italic text-amber-200/90 text-sm md:text-base leading-relaxed mb-4">
            {bilingual(
              '"Lạy Đức Giê-hô-va, con yêu mến đền tạm nơi Ngài ngự, và nơi sự vinh hiển Ngài ở. Mọi sự phải làm cho chu đáo, trang nghiêm và theo thứ tự."',
              '"Lord, I love the house where you live, the place where your glory dwells. But everything should be done in a fitting and orderly way."'
            )}
          </p>
          <p className="text-xs font-mono uppercase tracking-widest text-amber-400/80">
            {bilingual(
              "— Thi thiên (Psalm) 26:8 • 1 Cô-rinh-tô 14:40",
              "— Psalm 26:8 • 1 Corinthians 14:40"
            )}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <TactileButton
              variant="gold"
              onClick={() => {
                setShowReserveModal(true);
                if (rooms.length > 0 && !resRoomId) setResRoomId(rooms[0].id);
              }}
              className="flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4 text-amber-950" />
              <span>{bilingual("Đăng Ký Đặt Phòng Nhóm Mới", "Reserve Room / Facility")}</span>
            </TactileButton>

            {isPastorOrLeader && (
              <TactileButton
                variant="secondary"
                onClick={() => setShowRoomModal(true)}
                className="flex items-center gap-2 bg-indigo-900/60 border-amber-400/40 text-amber-200 hover:bg-indigo-800"
              >
                <Building className="w-4 h-4" />
                <span>{bilingual("+ Thêm Phòng Nhóm Vào Cơ Sở", "+ Add New Room")}</span>
              </TactileButton>
            )}
          </div>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute right-6 -bottom-10 opacity-10 pointer-events-none select-none text-white text-[160px] font-serif">
          †
        </div>
      </div>

      {/* Bento Grid: Vital Facility Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <BentoCard
          title={bilingual("Phòng Nhóm Sẵn Sàng", "Available Facilities")}
          badge={<Church className="w-5 h-5 text-indigo-800" />}
        >
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-slate-900">
              {stats.availableRooms}/{stats.totalRooms}
            </span>
            <span className="text-xs text-slate-500">
              {bilingual("phòng khả dụng", "rooms ready")}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {bilingual("Thánh đường, Nhà ăn, Lớp học, Nhà nguyện", "Sanctuary, Hall, Classrooms, Chapel")}
          </p>
        </BentoCard>

        <BentoCard
          title={bilingual("Yêu Cầu Chờ Phê Duyệt", "Pending Approvals")}
          badge={
            stats.pendingReservations > 0 ? (
              <span className="w-3 h-3 rounded-full bg-amber-600 animate-ping inline-block" />
            ) : (
              <Clock className="w-5 h-5 text-slate-400" />
            )
          }
        >
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-amber-800">
              {stats.pendingReservations}
            </span>
            <span className="text-xs text-slate-500">
              {bilingual("đơn chờ duyệt", "pending requests")}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {bilingual("Chờ Ban Trị Sự kiểm tra và khóa lịch", "Awaiting Church Board confirmation")}
          </p>
        </BentoCard>

        <BentoCard
          title={bilingual("Lịch Đặt Đã Duyệt", "Approved Reservations")}
          badge={<CheckCircle2 className="w-5 h-5 text-emerald-700" />}
        >
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-emerald-800">
              {stats.approvedReservations}
            </span>
            <span className="text-xs text-slate-500">
              {bilingual("buổi sinh hoạt", "confirmed events")}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {bilingual("Đã được xác nhận không xung đột giờ", "Locked in calendar with zero conflict")}
          </p>
        </BentoCard>

        <BentoCard
          title={bilingual("Thiết Bị Thánh Vụ", "Managed Equipment")}
          badge={<Mic2 className="w-5 h-5 text-amber-800" />}
        >
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-amber-900">
              {stats.totalEquipmentCount}
            </span>
            <span className="text-xs text-slate-500">
              {bilingual("thiết bị / vật phẩm", "items in service")}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {bilingual("Âm thanh, Nhạc cụ, Báp-têm, Tiệc Thánh", "Audio, Instruments, Baptism, Communion")}
          </p>
        </BentoCard>
      </div>

      {/* Tabs Selector & Campus Filter */}
      <div className="border-b border-amber-200/80 flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("reservations")}
            className={`pb-3 px-4 font-serif text-sm font-semibold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === "reservations"
                ? "border-amber-700 text-amber-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>
              {bilingual(
                `Lịch Đặt Phòng (${reservations.length})`,
                `Reservations (${reservations.length})`
              )}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("rooms")}
            className={`pb-3 px-4 font-serif text-sm font-semibold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === "rooms"
                ? "border-amber-700 text-amber-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Building className="w-4 h-4" />
            <span>
              {bilingual(
                `Danh Mục Phòng Nhóm (${rooms.length})`,
                `Room Directory (${rooms.length})`
              )}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("equipment")}
            className={`pb-3 px-4 font-serif text-sm font-semibold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === "equipment"
                ? "border-amber-700 text-amber-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Mic2 className="w-4 h-4" />
            <span>
              {bilingual(
                `Kho Thiết Bị & Thánh Lễ (${equipmentList.length})`,
                `Sacred Equipment & AV (${equipmentList.length})`
              )}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("my")}
            className={`pb-3 px-4 font-serif text-sm font-semibold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === "my"
                ? "border-amber-700 text-amber-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>
              {bilingual(
                `Đơn Đặt Của Tôi (${myReservations.length})`,
                `My Bookings (${myReservations.length})`
              )}
            </span>
          </button>
        </div>

        {/* Global Campus Selector */}
        <div className="hidden sm:flex items-center gap-2 pb-2">
          <MapPin className="w-4 h-4 text-amber-800" />
          <select
            value={selectedCampus}
            onChange={(e) => setSelectedCampus(e.target.value)}
            className="text-xs bg-amber-50 border border-amber-300/80 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none"
          >
            {CAMPUSES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TAB 1: LỊCH ĐẶT PHÒNG */}
      {activeTab === "reservations" && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/70 flex flex-wrap items-center gap-3 justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-700 cursor-pointer"
              >
                <option value="all">{bilingual("Tất cả trạng thái", "All Statuses")}</option>
                <option value="pending">{bilingual("Chờ phê duyệt", "Pending Approval")}</option>
                <option value="approved">{bilingual("Đã phê duyệt", "Approved")}</option>
                <option value="rejected">{bilingual("Bị từ chối", "Rejected")}</option>
              </select>

              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-700"
              />
            </div>

            <TactileButton
              variant="secondary"
              size="sm"
              onClick={loadData}
              className="text-xs"
            >
              {bilingual("Làm Mới Danh Sách", "Refresh List")}
            </TactileButton>
          </div>

          {/* Reservations List */}
          {loading ? (
            <div className="py-12 text-center font-serif text-slate-500">
              <span className="text-2xl animate-spin inline-block text-amber-700">†</span>
              <p className="mt-2 text-sm italic">
                {bilingual("Đang nạp lịch sử dụng cơ sở vật chất...", "Loading facility reservation calendar...")}
              </p>
            </div>
          ) : reservations.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-dashed border-amber-200 text-slate-500">
              <Calendar className="w-10 h-10 mx-auto text-amber-400 mb-2 opacity-60" />
              <p className="font-serif text-base text-slate-700">
                {bilingual("Chưa có lịch đặt phòng nào.", "No facility reservations yet.")}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {bilingual(
                  'Các ban ngành có thể nhấn nút "Đăng Ký Đặt Phòng Nhóm Mới" ở trên.',
                  'Ministries can click "Reserve Room / Facility" above.'
                )}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {reservations.map((res) => (
                <div
                  key={res.id}
                  className="bg-white rounded-xl border border-amber-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider block">
                          {res.ministryName}
                        </span>
                        <h3 className="font-serif font-bold text-base text-slate-900 mt-0.5">
                          {res.eventName}
                        </h3>
                      </div>
                      {getStatusBadge(res.status)}
                    </div>

                    {/* Room & Time Details */}
                    <div className="space-y-1.5 text-xs text-slate-600 mb-3 bg-[#FAF8F5] p-3 rounded-lg border border-amber-100">
                      <div className="flex items-center gap-2">
                        <Building className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span className="font-semibold text-slate-800">
                          {res.room?.name || bilingual("Phòng Nhóm Hội Thánh", "Church Sanctuary / Room")}
                        </span>
                        <span className="text-[11px] text-slate-400">({res.campusId})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-mono text-slate-700">
                          {new Date(res.startTime).toLocaleString(isEn ? "en-US" : "vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}{" "}
                          —{" "}
                          {new Date(res.endTime).toLocaleTimeString(isEn ? "en-US" : "vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{bilingual("Người đặt: ", "Requested by: ")}{res.requestedByUserName}</span>
                      </div>
                    </div>

                    {/* Setup Notes */}
                    {res.setupNotes && (
                      <p className="text-xs text-slate-600 italic mb-3">
                        {bilingual("Ghi chú kỹ thuật: ", "Setup notes: ")}"{res.setupNotes}"
                      </p>
                    )}

                    {/* Rejection Note */}
                    {res.rejectionReason && (
                      <p className="text-xs text-rose-700 bg-rose-50 p-2 rounded border border-rose-200 mb-3">
                        {bilingual("Lý do từ chối: ", "Reason for rejection: ")}{res.rejectionReason}
                      </p>
                    )}
                  </div>

                  {/* Pastor/Admin Review Action */}
                  {isPastorOrLeader && res.status === "pending" && (
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                      <TactileButton
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setShowReviewModal(res);
                          setReviewStatus("rejected");
                        }}
                        className="text-xs text-rose-700 hover:bg-rose-50 border-rose-200"
                      >
                        {bilingual("Từ Chối", "Reject")}
                      </TactileButton>

                      <TactileButton
                        variant="gold"
                        size="sm"
                        onClick={() => {
                          setShowReviewModal(res);
                          setReviewStatus("approved");
                        }}
                        className="text-xs"
                      >
                        {bilingual("Phê Duyệt Lịch", "Approve Booking")}
                      </TactileButton>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DANH MỤC PHÒNG NHÓM & TIỆN NGHI */}
      {activeTab === "rooms" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rooms.map((room) => {
            const meta = FACILITY_TYPE_LABELS[room.type] || FACILITY_TYPE_LABELS.classroom;
            const Icon = meta.icon;

            return (
              <div
                key={room.id}
                className="bg-white rounded-xl border border-amber-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-900 border border-indigo-200">
                      <Icon className="w-3.5 h-3.5" />
                      {isEn ? meta.labelEn : meta.labelVi}
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                      {bilingual("Sức chứa: ", "Capacity: ")}{room.capacity} {bilingual("chỗ", "seats")}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-slate-900 mb-2">
                    {room.name}
                  </h3>

                  <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-700" />
                    <span>{room.campusId}</span>
                  </p>

                  {/* Amenities */}
                  <div className="mb-3">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                      {bilingual("Tiện nghi & Trang thiết bị:", "Amenities & Equipment:")}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {room.amenities && room.amenities.length > 0 ? (
                        room.amenities.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-slate-100 text-[11px] text-slate-700 border border-slate-200"
                          >
                            ✓ {item}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          {bilingual("Tiêu chuẩn", "Standard")}
                        </span>
                      )}
                    </div>
                  </div>

                  {room.notes && (
                    <p className="text-xs text-slate-500 italic bg-[#FCFBF9] p-2.5 rounded border border-amber-100">
                      {bilingual("Ghi chú: ", "Notes: ")}{room.notes}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-3">
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {bilingual("Khả dụng", "Available")}
                  </span>

                  <TactileButton
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setResRoomId(room.id);
                      setShowReserveModal(true);
                    }}
                    className="text-xs"
                  >
                    {bilingual("Đặt Phòng Này", "Book This Room")}
                  </TactileButton>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: KHO THIẾT BỊ THÁNH VỤ & ÂM THANH */}
      {activeTab === "equipment" && (
        <div className="space-y-4">
          <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/70 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-slate-900 text-sm">
                {bilingual(
                  "Danh Sách Thiết Bị Kỹ Thuật, Nhạc Cụ & Vật Phẩm Thánh Lễ",
                  "Technical Equipment, Musical Instruments & Sacred Vessels"
                )}
              </h3>
              <p className="text-xs text-slate-500">
                {bilingual(
                  "Quản lý số lượng, tình trạng bảo quản và vị trí lưu giữ tại các điểm nhóm.",
                  "Track inventory, working condition, and storage locations across campuses."
                )}
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-amber-100 text-amber-900 border border-amber-300">
              {bilingual(`Tổng số: ${equipmentList.length} hạng mục`, `Total: ${equipmentList.length} items`)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipmentList.map((eq) => {
              const meta = EQUIPMENT_TYPE_LABELS[eq.type] || EQUIPMENT_TYPE_LABELS.audio_sound;
              const Icon = meta.icon;

              return (
                <div
                  key={eq.id}
                  className="bg-white rounded-xl border border-amber-200/80 p-4 shadow-xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                      <Icon className="w-3.5 h-3.5" />
                      {isEn ? meta.labelEn : meta.labelVi}
                    </span>
                    <span className="text-xs font-bold text-slate-900 font-mono">
                      {bilingual("SL: ", "Qty: ")}{eq.availableQuantity}/{eq.quantity}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-sm text-slate-900">
                    {eq.name}
                  </h4>

                  <div className="text-xs text-slate-500 space-y-1">
                    <p className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-700" />
                      <span>{eq.location}</span>
                    </p>
                    <p className="text-[11px]">
                      {bilingual("Tình trạng: ", "Condition: ")}
                      <span className="font-semibold text-emerald-700">
                        {eq.condition === "excellent"
                          ? bilingual("Hoạt động hoàn hảo", "Excellent condition")
                          : bilingual("Tốt", "Good")}
                      </span>
                    </p>
                  </div>

                  {eq.notes && (
                    <p className="text-[11px] text-slate-500 italic bg-[#FCFBF8] p-2 rounded border border-amber-100">
                      {eq.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: LỊCH ĐẶT CỦA TÔI */}
      {activeTab === "my" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif font-bold text-slate-900">
              {bilingual("Các Đơn Đặt Phòng Của Bạn", "Your Facility Reservations")}
            </h2>
            <TactileButton
              variant="gold"
              size="sm"
              onClick={() => {
                setShowReserveModal(true);
                if (rooms.length > 0 && !resRoomId) setResRoomId(rooms[0].id);
              }}
              className="text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{bilingual("Đặt Phòng Mới", "New Booking")}</span>
            </TactileButton>
          </div>

          {myReservations.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-dashed border-amber-200 text-slate-500">
              <Building className="w-10 h-10 mx-auto text-amber-400 mb-2 opacity-60" />
              <p className="font-serif text-base text-slate-700">
                {bilingual("Bạn chưa có đơn đặt phòng nào.", "You have no active facility bookings.")}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {bilingual(
                  "Khi ban ngành của bạn cần không gian tập hát, thông công hoặc nhóm nhỏ, hãy gửi đơn đặt.",
                  "Submit a request whenever your ministry needs rehearsal, fellowship, or small group space."
                )}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {myReservations.map((res) => (
                <div
                  key={res.id}
                  className="bg-white p-4 rounded-xl border border-amber-200/70 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-serif font-bold text-slate-900 text-sm">
                        {res.eventName}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-semibold text-amber-800">
                        {res.room?.name || bilingual("Phòng nhóm", "Room")}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {bilingual("Thời gian: ", "Time: ")}
                      <strong>
                        {new Date(res.startTime).toLocaleString(isEn ? "en-US" : "vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                        })}{" "}
                        — {new Date(res.endTime).toLocaleTimeString(isEn ? "en-US" : "vi-VN", { hour: "2-digit", minute: "2-digit" })}
                      </strong>
                    </p>
                    {res.approvedByUserName && (
                      <p className="text-xs text-emerald-800 font-medium mt-1">
                        {bilingual("Đã được duyệt bởi: ", "Approved by: ")}{res.approvedByUserName}
                      </p>
                    )}
                    {res.rejectionReason && (
                      <p className="text-xs text-rose-700 mt-1">
                        {bilingual("Lý do từ chối: ", "Rejection reason: ")}{res.rejectionReason}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0">{getStatusBadge(res.status)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: ĐẶT PHÒNG NHÓM MỚI */}
      {showReserveModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 border border-amber-200 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-amber-100">
              <div className="flex items-center gap-2 text-indigo-950 font-serif">
                <Building className="w-5 h-5 text-amber-700" />
                <h3 className="text-lg font-bold">
                  {bilingual("Đăng Ký Đặt Phòng Nhóm Hội Thánh", "Church Facility Booking Request")}
                </h3>
              </div>
              <button
                onClick={() => setShowReserveModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReservation} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {bilingual("Chọn Phòng Nhóm Cần Đặt:", "Select Room / Space:")}
                </label>
                <select
                  required
                  value={resRoomId}
                  onChange={(e) => setResRoomId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-600"
                >
                  <option value="">{bilingual("-- Chọn phòng --", "-- Select Room --")}</option>
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({bilingual("Sức chứa: ", "Capacity: ")}{r.capacity} {bilingual("người", "seats")} - {r.campusId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {bilingual("Tên Sự Kiện / Mục Đích Buổi Nhóm:", "Event Name / Meeting Purpose:")}
                </label>
                <input
                  type="text"
                  required
                  placeholder={bilingual("Ví dụ: Tập hát Ban Thờ Phượng Chúa Nhật", "e.g., Sunday Worship Team Rehearsal")}
                  value={resEventName}
                  onChange={(e) => setResEventName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {bilingual("Tên Ban Ngành / Nhóm Tế Bào Phụ Trách:", "Ministry / Small Group Responsible:")}
                </label>
                <input
                  type="text"
                  required
                  placeholder={bilingual("Ví dụ: Ban Thờ Phượng & Kỹ Thuật Media", "e.g., Worship & Media Ministry")}
                  value={resMinistryName}
                  onChange={(e) => setResMinistryName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {bilingual("Bắt Đầu:", "Start Time:")}
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={resStartTime}
                    onChange={(e) => setResStartTime(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {bilingual("Kết Thúc:", "End Time:")}
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={resEndTime}
                    onChange={(e) => setResEndTime(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {bilingual("Yêu Cầu Kỹ Thuật & Khánh Tiết (Bàn ghế, máy lạnh, micro):", "Setup & AV Requirements (Chairs, AC, Mics):")}
                </label>
                <textarea
                  rows={3}
                  placeholder={bilingual("Ví dụ: Cần mở máy lạnh trước 30 phút, chuẩn bị 4 micro không dây...", "e.g., Turn on AC 30 mins early, setup 4 wireless mics...")}
                  value={resSetupNotes}
                  onChange={(e) => setResSetupNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <TactileButton
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={() => setShowReserveModal(false)}
                >
                  {bilingual("Hủy Bỏ", "Cancel")}
                </TactileButton>
                <TactileButton
                  variant="gold"
                  size="sm"
                  type="submit"
                  disabled={submittingReserve}
                >
                  {submittingReserve
                    ? bilingual("Đang kiểm tra...", "Checking conflicts...")
                    : bilingual("Gửi Đơn Đặt Phòng", "Submit Reservation")}
                </TactileButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DUYỆT HOẶC TỪ CHỐI ĐƠN ĐẶT PHÒNG */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-amber-200 shadow-2xl animate-fade-in">
            <h3 className="text-base font-serif font-bold text-slate-900 mb-2">
              {bilingual("Phê Duyệt Đơn Đặt: ", "Review Booking: ")}{showReviewModal.eventName}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {bilingual("Phòng: ", "Room: ")}<strong>{showReviewModal.room?.name}</strong> • {bilingual("Ban: ", "Ministry: ")}{showReviewModal.ministryName}
            </p>

            <form onSubmit={handleReviewReservation} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {bilingual("Quyết Định Phê Duyệt:", "Approval Decision:")}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewStatus("approved")}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      reviewStatus === "approved"
                        ? "bg-emerald-600 text-white border-emerald-700"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    {bilingual("✓ Đồng Ý Phê Duyệt", "✓ Approve Booking")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewStatus("rejected")}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      reviewStatus === "rejected"
                        ? "bg-rose-600 text-white border-rose-700"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    {bilingual("✕ Từ Chối Yêu Cầu", "✕ Reject Request")}
                  </button>
                </div>
              </div>

              {reviewStatus === "rejected" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {bilingual("Lý Do Từ Chối:", "Rejection Reason:")}
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder={bilingual("Ví dụ: Trùng lịch với buổi bồi linh toàn Hội Thánh...", "e.g., Conflict with church-wide revival...")}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              )}

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <TactileButton
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={() => setShowReviewModal(null)}
                >
                  {bilingual("Đóng", "Close")}
                </TactileButton>
                <TactileButton
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={submittingReview}
                >
                  {submittingReview
                    ? bilingual("Đang lưu...", "Saving...")
                    : bilingual("Xác Nhận Quyết Định", "Confirm Decision")}
                </TactileButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: THÊM PHÒNG NHÓM MỚI VÀO CƠ SỞ */}
      {showRoomModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-amber-200 shadow-2xl animate-fade-in">
            <h3 className="text-base font-serif font-bold text-slate-900 mb-3 pb-2 border-b border-amber-100">
              {bilingual("+ Thêm Phòng Nhóm Vào Cơ Sở Vật Chất", "+ Add New Facility / Room")}
            </h3>

            <form onSubmit={handleCreateRoom} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {bilingual("Tên Phòng Nhóm:", "Room Name:")}
                </label>
                <input
                  type="text"
                  required
                  placeholder={bilingual("Ví dụ: Phòng Họp Ban Trị Sự Tầng 2", "e.g., 2nd Floor Board Conference Room")}
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {bilingual("Loại Phòng:", "Room Type:")}
                  </label>
                  <select
                    value={newRoomType}
                    onChange={(e) => setNewRoomType(e.target.value as FacilityType)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  >
                    <option value="sanctuary">{bilingual("Thánh Đường Chính", "Main Sanctuary")}</option>
                    <option value="fellowship_hall">{bilingual("Nhà Thông Công & Hội Trường", "Fellowship Hall")}</option>
                    <option value="chapel">{bilingual("Nhà Nguyện Tĩnh Nguyện", "Prayer Chapel")}</option>
                    <option value="classroom">{bilingual("Phòng Học Trường Chúa Nhật", "Sunday School Classroom")}</option>
                    <option value="youth_center">{bilingual("Phòng Thanh Thiếu Niên", "Youth Center")}</option>
                    <option value="conference_room">{bilingual("Phòng Họp Ban Trị Sự", "Board Conference Room")}</option>
                    <option value="pastor_office">{bilingual("Văn Phòng Tư Vấn Mục Vụ", "Pastoral Counseling Office")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {bilingual("Sức Chứa (Người):", "Capacity (Seats):")}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newRoomCapacity}
                    onChange={(e) => setNewRoomCapacity(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {bilingual("Tiện Nghi Có Sẵn (Phân cách bằng dấu phẩy):", "Available Amenities (comma-separated):")}
                </label>
                <input
                  type="text"
                  placeholder={bilingual("Máy chiếu 4K, Loa trợ giảng, Đàn Piano, Bảng trắng", "4K Projector, Sound PA, Piano, Whiteboard")}
                  value={newRoomAmenities}
                  onChange={(e) => setNewRoomAmenities(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {bilingual("Ghi Chú Sử Dụng:", "Usage Guidelines:")}
                </label>
                <textarea
                  rows={2}
                  value={newRoomNotes}
                  onChange={(e) => setNewRoomNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <TactileButton
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={() => setShowRoomModal(false)}
                >
                  {bilingual("Đóng", "Close")}
                </TactileButton>
                <TactileButton
                  variant="gold"
                  size="sm"
                  type="submit"
                  disabled={submittingRoom}
                >
                  {submittingRoom
                    ? bilingual("Đang lưu...", "Saving...")
                    : bilingual("Lưu Phòng Nhóm", "Save Facility Room")}
                </TactileButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
