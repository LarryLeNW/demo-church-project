"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { apiFetch, ApiError } from "@/lib/api/client";
import { BentoCard } from "@/components/ui/bento-card";
import { TactileButton } from "@/components/ui/tactile-button";
import { TactileInput } from "@/components/ui/tactile-input";
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Plus,
  Sparkles,
  Ticket,
  Search,
  Filter,
  DollarSign,
  XCircle,
  FileText,
  Utensils,
  Heart,
  ChevronRight,
  Flame,
} from "lucide-react";

export type EventCategory =
  | "worship"
  | "fellowship"
  | "camp_retreat"
  | "training"
  | "outreach"
  | "family_kids";

interface ChurchEventItem {
  id: string;
  title: string;
  titleEn: string;
  slug: string;
  description: string | null;
  category: EventCategory;
  campusId: string;
  startDate: string;
  endDate: string | null;
  location: string;
  bannerUrl: string | null;
  requiresRegistration: boolean;
  maxAttendees: number | null;
  registeredCount: number;
  registrationDeadline: string | null;
  cost: number;
  isPublished: boolean;
}

interface EventRegistrationItem {
  id: string;
  eventId: string;
  userId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string | null;
  adultCount: number;
  childCount: number;
  dietaryRestrictions: string | null;
  paymentStatus: string;
  status: "confirmed" | "waitlist" | "cancelled";
  notes: string | null;
  registeredAt: string;
}

interface MyRegistrationRecord {
  registration: EventRegistrationItem;
  event: ChurchEventItem | null;
}

const CATEGORY_META: Record<
  EventCategory,
  { labelVi: string; labelEn: string; color: string }
> = {
  worship: {
    labelVi: "Thờ Phượng & Bồi Linh",
    labelEn: "Worship & Revival",
    color: "bg-indigo-100 text-indigo-900 border-indigo-200",
  },
  fellowship: {
    labelVi: "Thông Công & Ẩm Thực",
    labelEn: "Fellowship & Banquet",
    color: "bg-emerald-100 text-emerald-900 border-emerald-200",
  },
  camp_retreat: {
    labelVi: "Trại Hè & Bồi Linh",
    labelEn: "Camps & Retreats",
    color: "bg-amber-100 text-amber-900 border-amber-300",
  },
  training: {
    labelVi: "Đào Tạo Môn Đồ",
    labelEn: "Discipleship Training",
    color: "bg-blue-100 text-blue-900 border-blue-200",
  },
  outreach: {
    labelVi: "Truyền Giáo & Cứu Trợ",
    labelEn: "Outreach & Charity",
    color: "bg-purple-100 text-purple-900 border-purple-200",
  },
  family_kids: {
    labelVi: "Gia Đình & Thiếu Nhi (VBS)",
    labelEn: "Family & Kids VBS",
    color: "bg-rose-100 text-rose-900 border-rose-200",
  },
};

const CAMPUSES = [
  { id: "all", vi: "Tất cả các điểm nhóm (All Campuses)", en: "All Campuses" },
  { id: "Dallas Main Campus", vi: "Hội Thánh Dallas", en: "Dallas Main Campus" },
  { id: "Houston Campus", vi: "Hội Thánh Houston", en: "Houston Campus" },
  { id: "Fort Worth Campus", vi: "Hội Thánh Fort Worth", en: "Fort Worth Campus" },
  { id: "Austin Campus", vi: "Điểm Nhóm Sinh Viên Austin", en: "Austin Campus" },
];

export default function EventsPage() {
  const { user } = useAuth();
  const { bilingual, isEn } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<ChurchEventItem[]>([]);
  const [myRegistrations, setMyRegistrations] = useState<MyRegistrationRecord[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters
  const [selectedCampus, setSelectedCampus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [registeringEvent, setRegisteringEvent] = useState<ChurchEventItem | null>(null);
  const [attendeeName, setAttendeeName] = useState("");
  const [attendeeEmail, setAttendeeEmail] = useState("");
  const [attendeePhone, setAttendeePhone] = useState("");
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [dietary, setDietary] = useState("");
  const [rsvpNotes, setRsvpNotes] = useState("");
  const [submittingRsvp, setSubmittingRsvp] = useState(false);

  // Pastor View State
  const isPastorOrLeader =
    user?.role === "senior_pastor" ||
    user?.role === "admin" ||
    user?.role === "ministry_leader";

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewingAttendeesEvent, setViewingAttendeesEvent] = useState<ChurchEventItem | null>(null);
  const [attendeesList, setAttendeesList] = useState<EventRegistrationItem[]>([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);

  // Create Form State
  const [newTitle, setNewTitle] = useState("");
  const [newTitleEn, setNewTitleEn] = useState("");
  const [newCategory, setNewCategory] = useState<EventCategory>("worship");
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newMaxAttendees, setNewMaxAttendees] = useState(100);
  const [newCost, setNewCost] = useState(0);
  const [submittingCreate, setSubmittingCreate] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchEvents = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCampus && selectedCampus !== "all") {
        params.append("campusId", selectedCampus);
      }
      if (selectedCategory && selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }
      if (searchQuery && searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }
      const q = `/events${params.toString() ? `?${params.toString()}` : ""}`;
      const data = await apiFetch<ChurchEventItem[]>(q, { auth: false });
      setEvents(data);
    } catch (err) {
      console.error("Không thể tải danh sách sự kiện:", err);
    }
  };

  const fetchMyRegistrations = async () => {
    if (!user) return;
    try {
      const data = await apiFetch<MyRegistrationRecord[]>("/events/my/registrations");
      setMyRegistrations(data);
    } catch (err) {
      console.error("Không thể tải danh sách đăng ký của tôi:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchEvents(), fetchMyRegistrations()]);
      setLoading(false);
    };
    init();
  }, [user]);

  useEffect(() => {
    fetchEvents();
  }, [selectedCampus, selectedCategory, searchQuery]);

  const openRsvpModal = (event: ChurchEventItem) => {
    setRegisteringEvent(event);
    setAttendeeName(user?.fullName || "");
    setAttendeeEmail(user?.email || "");
    setAttendeePhone(user?.phone || "");
    setAdultCount(1);
    setChildCount(0);
    setDietary("");
    setRsvpNotes("");
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registeringEvent) return;
    setSubmittingRsvp(true);
    try {
      await apiFetch(`/events/${registeringEvent.id}/register`, {
        method: "POST",
        body: {
          attendeeName,
          attendeeEmail,
          attendeePhone: attendeePhone || undefined,
          adultCount,
          childCount,
          dietaryRestrictions: dietary || undefined,
          notes: rsvpNotes || undefined,
        },
      });
      showToast(
        bilingual(
          `Đã đăng ký tham dự thành công sự kiện: ${registeringEvent.title}!`,
          `Successfully registered for: ${registeringEvent.titleEn || registeringEvent.title}!`,
        ),
      );
      setRegisteringEvent(null);
      await Promise.all([fetchEvents(), fetchMyRegistrations()]);
    } catch (err) {
      alert((err as ApiError).message || bilingual("Không thể đăng ký tham gia sự kiện.", "Could not register for event."));
    } finally {
      setSubmittingRsvp(false);
    }
  };

  const handleCancelRegistration = async (regId: string) => {
    if (
      !confirm(
        bilingual(
          "Bạn có chắc chắn muốn hủy phiếu đăng ký này không?",
          "Are you sure you want to cancel this event registration?",
        ),
      )
    )
      return;
    try {
      await apiFetch(`/events/registrations/${regId}`, { method: "DELETE" });
      showToast(bilingual("Đã hủy phiếu đăng ký tham dự.", "Registration cancelled successfully."));
      await Promise.all([fetchEvents(), fetchMyRegistrations()]);
    } catch (err) {
      alert((err as ApiError).message || bilingual("Không thể hủy đăng ký.", "Could not cancel registration."));
    }
  };

  const openAttendeesModal = async (event: ChurchEventItem) => {
    setViewingAttendeesEvent(event);
    setLoadingAttendees(true);
    try {
      const data = await apiFetch<EventRegistrationItem[]>(`/events/${event.id}/attendees`);
      setAttendeesList(data);
    } catch (err) {
      console.error("Could not load attendees:", err);
    } finally {
      setLoadingAttendees(false);
    }
  };

  const handleCreateEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingCreate(true);
    try {
      await apiFetch("/events", {
        method: "POST",
        body: {
          title: newTitle,
          titleEn: newTitleEn,
          category: newCategory,
          campusId: selectedCampus === "all" ? "Dallas Main Campus" : selectedCampus,
          startDate: newStartDate,
          endDate: newEndDate || undefined,
          location: newLocation,
          description: newDescription || undefined,
          maxAttendees: Number(newMaxAttendees),
          cost: Number(newCost),
          requiresRegistration: true,
          isPublished: true,
        },
      });
      showToast(bilingual("Đã tạo sự kiện Hội Thánh mới thành công!", "New church event created successfully!"));
      setShowCreateModal(false);
      setNewTitle("");
      setNewTitleEn("");
      setNewLocation("");
      setNewDescription("");
      await fetchEvents();
    } catch (err) {
      alert((err as ApiError).message || bilingual("Không thể tạo sự kiện.", "Could not create event."));
    } finally {
      setSubmittingCreate(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <span className="text-amber-800 font-serif text-3xl animate-spin select-none">†</span>
        <span className="text-sm font-serif italic text-slate-600">
          {bilingual(
            '"Đang mở lịch sinh hoạt và các ngày lễ thánh của Hội Thánh..."',
            '"Loading church calendar and sacred convocations..."',
          )}
        </span>
      </div>
    );
  }

  const isUserRegisteredFor = (eventId: string) => {
    return myRegistrations.some(
      (r) => r.registration.eventId === eventId && r.registration.status === "confirmed",
    );
  };

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
            <span>{bilingual("Sinh Hoạt & Đại Lễ Hội Thánh", "Church Events & Convocations")}</span>
          </div>
          <h1 className="font-scripture text-3xl font-bold text-slate-900 tracking-tight">
            {bilingual("Lịch Sự Kiện & Đăng Ký Tham Gia", "Church Events & RSVP Registration")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {bilingual(
              '"Chớ bỏ qua sự nhóm lại như mấy kẻ quen làm, nhưng phải khuyên bảo nhau... thì càng phải làm như vậy chừng nấy." — Hê-bơ-rơ 10:25',
              '"And let us not neglect our meeting together, as some people do, but encourage one another..." — Hebrews 10:25',
            )}
          </p>
        </div>

        {isPastorOrLeader && (
          <div className="shrink-0 flex items-center gap-3">
            <TactileButton
              variant="gold"
              size="md"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{bilingual("+ Tạo Sự Kiện Mới", "+ Create New Event")}</span>
            </TactileButton>
          </div>
        )}
      </div>

      {/* 1. MY REGISTERED EVENTS (IF ANY) */}
      {myRegistrations.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-amber-800" />
            <h2 className="font-scripture text-lg font-bold text-slate-900">
              {bilingual("Sự Kiện Tôi & Gia Đình Đã Đăng Ký (My RSVP)", "My Registered Events & Tickets (RSVP)")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myRegistrations.map(({ registration, event }) => {
              if (!event) return null;
              const isConfirmed = registration.status === "confirmed";

              return (
                <div
                  key={registration.id}
                  className="p-4 rounded-xl bg-white border border-amber-200 shadow-xs flex flex-col justify-between gap-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {isConfirmed
                          ? bilingual("✓ Đã Xác Nhận Vé", "✓ Confirmed Ticket")
                          : bilingual("⏳ Danh Sách Chờ", "⏳ Waitlist")}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {new Date(registration.registeredAt).toLocaleDateString(isEn ? "en-US" : "vi-VN")}
                      </span>
                    </div>

                    <h3 className="font-scripture text-sm font-bold text-slate-900 leading-snug">
                      {isEn ? (event.titleEn || event.title) : event.title}
                    </h3>

                    <div className="text-xs text-slate-600 space-y-1">
                      <p className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                        <span>{new Date(event.startDate).toLocaleString(isEn ? "en-US" : "vi-VN")}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                        <span>
                          {registration.adultCount} {bilingual("người lớn", "adult(s)")}
                          {registration.childCount > 0 &&
                            `, ${registration.childCount} ${bilingual("trẻ em", "child(ren)")}`}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-amber-100 text-xs">
                    <span className="text-[11px] text-slate-500">
                      {bilingual("Người đặt:", "Ticket for:")} <strong>{registration.attendeeName}</strong>
                    </span>
                    <button
                      onClick={() => handleCancelRegistration(registration.id)}
                      className="text-rose-700 hover:text-rose-900 font-medium underline cursor-pointer text-[11px]"
                    >
                      {bilingual("Hủy Phiếu", "Cancel RSVP")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 2. FILTERS BAR */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === "all"
                ? "bg-indigo-950 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-amber-100"
            }`}
          >
            {bilingual("Tất cả sự kiện", "All Events")}
          </button>
          {Object.entries(CATEGORY_META).map(([catKey, meta]) => (
            <button
              key={catKey}
              onClick={() => setSelectedCategory(catKey)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === catKey
                  ? "bg-indigo-950 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-amber-100"
              }`}
            >
              {isEn ? meta.labelEn : meta.labelVi}
            </button>
          ))}
        </div>

        {/* Campus & Search */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCampus}
            onChange={(e) => setSelectedCampus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none"
          >
            {CAMPUSES.map((c) => (
              <option key={c.id} value={c.id}>
                {isEn ? c.en : c.vi}
              </option>
            ))}
          </select>

          <div className="relative w-48 shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={bilingual("Tìm sự kiện...", "Search events...")}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. EVENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {events.map((ev) => {
          const meta = CATEGORY_META[ev.category] || CATEGORY_META.worship;
          const isRegistered = isUserRegisteredFor(ev.id);
          const isFull = ev.maxAttendees && ev.registeredCount >= ev.maxAttendees;
          const capacityPercent = ev.maxAttendees
            ? Math.min(100, Math.round((ev.registeredCount / ev.maxAttendees) * 100))
            : 0;

          return (
            <div
              key={ev.id}
              className="bg-white rounded-2xl border border-amber-200/90 shadow-md shadow-amber-950/5 overflow-hidden flex flex-col justify-between hover:border-amber-300 transition-all"
            >
              {/* Event Image Banner */}
              {ev.bannerUrl && (
                <div className="h-48 w-full overflow-hidden relative">
                  <img
                    src={ev.bannerUrl}
                    alt={ev.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-3 py-1 rounded-full border shadow-xs backdrop-blur-md bg-white/95 ${meta.color}`}
                    >
                      {isEn ? meta.labelEn : meta.labelVi}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-950/90 text-amber-300 border border-amber-400/30 backdrop-blur-md">
                      {Number(ev.cost) > 0 ? `$${ev.cost}` : bilingual("Miễn Phí (Free)", "Free Admission")}
                    </span>
                  </div>
                </div>
              )}

              {/* Event Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-amber-800 font-serif font-bold uppercase tracking-wider">
                    <span>{ev.campusId}</span>
                  </div>

                  <h3 className="font-scripture text-xl font-bold text-slate-900 leading-snug">
                    {isEn ? (ev.titleEn || ev.title) : ev.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-serif italic">
                    {isEn ? ev.title : ev.titleEn}
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mt-2 font-normal">
                    {ev.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-amber-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-800 shrink-0" />
                      <span className="font-medium">
                        {new Date(ev.startDate).toLocaleString(isEn ? "en-US" : "vi-VN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-4 h-4 text-amber-800 shrink-0" />
                      <span className="font-medium truncate" title={ev.location}>
                        {ev.location}
                      </span>
                    </div>
                  </div>

                  {/* Capacity Bar */}
                  {ev.maxAttendees && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>
                          {bilingual("Đã đăng ký:", "Registered:")}{" "}
                          <strong>{ev.registeredCount}</strong> / {ev.maxAttendees}{" "}
                          {bilingual("chỗ", "spots")}
                        </span>
                        <span className="font-mono font-bold text-indigo-950">
                          {capacityPercent}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all rounded-full ${
                            capacityPercent >= 90
                              ? "bg-rose-600"
                              : capacityPercent >= 70
                              ? "bg-amber-500"
                              : "bg-emerald-600"
                          }`}
                          style={{ width: `${capacityPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    {isRegistered ? (
                      <div className="flex-1 py-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{bilingual("Bạn Đã Đăng Ký Tham Gia", "You are registered")}</span>
                      </div>
                    ) : (
                      <TactileButton
                        variant={isFull ? "secondary" : "gold"}
                        size="md"
                        onClick={() => openRsvpModal(ev)}
                        className="flex-1 justify-center"
                      >
                        <Ticket className="w-4 h-4 mr-1.5" />
                        <span>
                          {isFull
                            ? bilingual("Đăng Ký Danh Sách Chờ", "Join Waitlist")
                            : bilingual("Đăng Ký Tham Gia (RSVP)", "Register / RSVP")}
                        </span>
                      </TactileButton>
                    )}

                    {isPastorOrLeader && (
                      <button
                        onClick={() => openAttendeesModal(ev)}
                        title={bilingual("Xem danh sách tham gia", "View attendees list")}
                        className="px-3.5 py-2.5 rounded-xl border border-amber-300 hover:bg-amber-50 text-indigo-950 text-xs font-semibold cursor-pointer flex items-center gap-1"
                      >
                        <Users className="w-4 h-4 text-amber-800" />
                        <span>{ev.registeredCount}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {events.length === 0 && (
        <div className="p-12 rounded-2xl bg-white border border-amber-200/80 text-center space-y-2">
          <CalendarDays className="w-10 h-10 text-amber-700 mx-auto" />
          <h3 className="font-scripture text-base font-bold text-slate-900">
            {bilingual("Không tìm thấy sự kiện nào", "No events found")}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {bilingual(
              "Vui lòng thử chọn điểm nhóm khác hoặc phân loại sự kiện khác để xem thêm lịch sinh hoạt.",
              "Please try selecting a different campus or category to view more scheduled events.",
            )}
          </p>
        </div>
      )}

      {/* MODAL 1: RSVP FORM */}
      {registeringEvent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-amber-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-amber-800" />
                <h3 className="font-scripture text-lg font-bold text-slate-900">
                  {bilingual("Đăng Ký Tham Gia Sự Kiện", "Event Registration (RSVP)")}
                </h3>
              </div>
              <button
                onClick={() => setRegisteringEvent(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-slate-800 space-y-1">
              <h4 className="font-bold text-indigo-950 font-scripture text-sm">
                {isEn ? (registeringEvent.titleEn || registeringEvent.title) : registeringEvent.title}
              </h4>
              <p className="text-slate-600">
                {new Date(registeringEvent.startDate).toLocaleString(isEn ? "en-US" : "vi-VN", {
                  dateStyle: "full",
                  timeStyle: "short",
                })}
              </p>
              <p className="text-slate-600">{registeringEvent.location}</p>
            </div>

            <form onSubmit={handleRsvpSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-serif font-bold text-slate-800 mb-1">
                  {bilingual("Họ và tên người đại diện:", "Full Name of Registrant:")}
                </label>
                <TactileInput
                  type="text"
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-serif font-bold text-slate-800 mb-1">
                    {bilingual("Email nhận vé:", "Confirmation Email:")}
                  </label>
                  <TactileInput
                    type="email"
                    value={attendeeEmail}
                    onChange={(e) => setAttendeeEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-serif font-bold text-slate-800 mb-1">
                    {bilingual("Số điện thoại:", "Phone Number:")}
                  </label>
                  <TactileInput
                    type="tel"
                    value={attendeePhone}
                    onChange={(e) => setAttendeePhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-serif font-bold text-slate-800 mb-1">
                    {bilingual("Số Người Lớn:", "Adult Count:")}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={adultCount}
                    onChange={(e) => setAdultCount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-amber-300 text-xs font-semibold text-slate-800 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-serif font-bold text-slate-800 mb-1">
                    {bilingual("Số Trẻ Em (nếu có):", "Children Count (if any):")}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={childCount}
                    onChange={(e) => setChildCount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-amber-300 text-xs font-semibold text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-slate-800 mb-1">
                  {bilingual(
                    "Yêu Cầu Ăn Uống Hoặc Dị Ứng (Nếu sự kiện có phục vụ bữa ăn):",
                    "Dietary Restrictions or Allergies (if meal is provided):",
                  )}
                </label>
                <TactileInput
                  type="text"
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  placeholder={bilingual(
                    "Ví dụ: Ăn chay, dị ứng đậu phộng, hải sản...",
                    "e.g. Vegetarian, peanut allergy, gluten-free...",
                  )}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-100">
                <button
                  type="button"
                  onClick={() => setRegisteringEvent(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  {bilingual("Hủy Bỏ", "Cancel")}
                </button>
                <TactileButton
                  type="submit"
                  variant="gold"
                  size="md"
                  disabled={submittingRsvp}
                >
                  {submittingRsvp
                    ? bilingual("Đang xử lý...", "Processing...")
                    : bilingual("Xác Nhận Đăng Ký (RSVP)", "Confirm Registration (RSVP)")}
                </TactileButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PASTOR ATTENDEES ROSTER */}
      {viewingAttendeesEvent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 border border-amber-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-800" />
                <div>
                  <h3 className="font-scripture text-base font-bold text-slate-900">
                    {bilingual("Danh Sách Tín Hữu Đăng Ký Tham Dự", "Registered Attendees Roster")}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isEn ? (viewingAttendeesEvent.titleEn || viewingAttendeesEvent.title) : viewingAttendeesEvent.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingAttendeesEvent(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {loadingAttendees ? (
                <div className="py-8 text-center text-xs text-slate-500 italic">
                  {bilingual("Đang tải danh sách người tham dự...", "Loading attendees roster...")}
                </div>
              ) : attendeesList.length > 0 ? (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-amber-200 text-slate-500 font-serif">
                      <th className="pb-2.5 font-semibold">{bilingual("Họ Tên", "Full Name")}</th>
                      <th className="pb-2.5 font-semibold">{bilingual("Email & Điện Thoại", "Contact Info")}</th>
                      <th className="pb-2.5 font-semibold">{bilingual("Số Lượng", "Party Size")}</th>
                      <th className="pb-2.5 font-semibold">{bilingual("Trạng Thái", "Status")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100">
                    {attendeesList.map((a) => (
                      <tr key={a.id} className="hover:bg-amber-50/40">
                        <td className="py-2.5 font-bold text-slate-900">{a.attendeeName}</td>
                        <td className="py-2.5 text-slate-600">
                          {a.attendeeEmail}
                          {a.attendeePhone && (
                            <span className="block text-[10px] text-slate-400">{a.attendeePhone}</span>
                          )}
                        </td>
                        <td className="py-2.5 text-indigo-950 font-medium">
                          {a.adultCount} {bilingual("Lớn", "Adult(s)")}
                          {a.childCount > 0 ? `, ${a.childCount} ${bilingual("Nhỏ", "Child(ren)")}` : ""}
                        </td>
                        <td className="py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              a.status === "confirmed"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {a.status === "confirmed"
                              ? bilingual("Đã Xác Nhận", "Confirmed")
                              : bilingual("Chờ Chỗ", "Waitlist")}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-8 text-center text-xs text-slate-500 italic">
                  {bilingual("Chưa có phiếu đăng ký nào cho sự kiện này.", "No RSVPs recorded yet for this event.")}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-amber-100">
              <button
                onClick={() => setViewingAttendeesEvent(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                {bilingual("Đóng", "Close")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: PASTOR CREATE EVENT */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-amber-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-800" />
                <h3 className="font-scripture text-lg font-bold text-slate-900">
                  {bilingual("Tạo Sự Kiện / Đại Lễ Hội Thánh Mới", "Create Church Event / Convocation")}
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEventSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-serif font-bold text-slate-800 mb-1">
                  {bilingual("Tiêu Đề Sự Kiện (Tiếng Việt):", "Event Title (Vietnamese):")}
                </label>
                <TactileInput
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={bilingual("Ví dụ: Đêm Thánh Ca Giáng Sinh...", "e.g. Christmas Eve Candlelight Service...")}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-slate-800 mb-1">
                  {bilingual("Tiêu Đề Tiếng Anh (English Title):", "English Title:")}
                </label>
                <TactileInput
                  type="text"
                  value={newTitleEn}
                  onChange={(e) => setNewTitleEn(e.target.value)}
                  placeholder="e.g. Christmas Eve Candlelight Service..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-serif font-bold text-slate-800 mb-1">
                    {bilingual("Phân Loại:", "Category:")}
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as EventCategory)}
                    className="w-full p-2.5 rounded-xl border border-amber-300 text-xs text-slate-800 focus:outline-none"
                  >
                    {Object.entries(CATEGORY_META).map(([k, meta]) => (
                      <option key={k} value={k}>
                        {isEn ? meta.labelEn : meta.labelVi}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-serif font-bold text-slate-800 mb-1">
                    {bilingual("Địa Điểm:", "Location:")}
                  </label>
                  <TactileInput
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Sanctuary / Fellowship Hall..."
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-serif font-bold text-slate-800 mb-1">
                    {bilingual("Thời Gian Bắt Đầu:", "Start Date & Time:")}
                  </label>
                  <input
                    type="datetime-local"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-amber-300 text-xs text-slate-800 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif font-bold text-slate-800 mb-1">
                    {bilingual("Thời Gian Kết Thúc:", "End Date & Time:")}
                  </label>
                  <input
                    type="datetime-local"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-amber-300 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-serif font-bold text-slate-800 mb-1">
                    {bilingual("Số Chỗ Tối Đa:", "Maximum Capacity:")}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newMaxAttendees}
                    onChange={(e) => setNewMaxAttendees(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-amber-300 text-xs text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif font-bold text-slate-800 mb-1">
                    {bilingual("Lệ Phí (USD, 0 nếu miễn phí):", "Fee (USD, 0 if free):")}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-amber-300 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-slate-800 mb-1">
                  {bilingual("Mô Tả & Nội Dung Sinh Hoạt:", "Description & Details:")}
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder={bilingual(
                    "Thông điệp sự kiện, lịch trình sinh hoạt...",
                    "Event message, schedule outline, notes...",
                  )}
                  className="w-full p-2.5 rounded-xl border border-amber-300 text-xs text-slate-800 focus:outline-none font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  {bilingual("Hủy Bỏ", "Cancel")}
                </button>
                <TactileButton
                  type="submit"
                  variant="gold"
                  size="md"
                  disabled={submittingCreate}
                >
                  {submittingCreate
                    ? bilingual("Đang tạo...", "Creating...")
                    : bilingual("Lưu Sự Kiện", "Save Event")}
                </TactileButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
