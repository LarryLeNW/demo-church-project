"use client";

import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { BentoCard } from "@/components/ui/bento-card";
import { TactileButton } from "@/components/ui/tactile-button";
import {
  Heart,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Phone,
  AlertTriangle,
  Lock,
  User,
  Share2,
  X,
  MessageSquare,
  Shield,
} from "lucide-react";

interface PrayerItem {
  id: string;
  userId: string | null;
  authorName: string;
  title: string;
  content: string;
  category: string;
  isConfidential: boolean;
  isAnonymous: boolean;
  isAnswered: boolean;
  praiseReport: string | null;
  prayerCount: number;
  status: string;
  createdAt: string;
  hasInterceded?: boolean;
}

interface AbsenteeItem {
  memberId: string;
  fullName: string;
  email: string;
  phone: string;
  campusId: string;
  alertReason: string;
  consecutiveWeeks: number;
  lastActivityDate: string;
  urgency: string;
  lastContacted: {
    notes: string;
    visitDate: string;
  } | null;
}

const CATEGORIES = [
  { id: "", vi: "Tất Cả Lời Cầu Thay", en: "All Prayer Requests" },
  { id: "healing", vi: "Chữa Lành & Sức Khỏe", en: "Healing & Health" },
  { id: "family", vi: "Gia Đình & Hôn Nhân", en: "Family & Marriage" },
  { id: "ministry", vi: "Mục Vụ & Hội Thánh", en: "Ministry & Church" },
  { id: "salvation", vi: "Cứu Rỗi Thân Hữu", en: "Salvation of Loved Ones" },
  { id: "thanksgiving", vi: "Lời Chứng Tạ Ơn Chúa", en: "Thanksgiving & Testimonies" },
];

const CATEGORY_LABELS: Record<string, { vi: string; en: string; color: string }> = {
  healing: { vi: "Chữa Lành", en: "Healing", color: "bg-rose-50 text-rose-800 border-rose-200" },
  family: { vi: "Gia Đình", en: "Family", color: "bg-amber-50 text-amber-800 border-amber-200" },
  ministry: { vi: "Mục Vụ", en: "Ministry", color: "bg-indigo-50 text-indigo-950 border-indigo-200" },
  salvation: { vi: "Cứu Rỗi", en: "Salvation", color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  thanksgiving: { vi: "Tạ Ơn", en: "Praise Report", color: "bg-amber-100 text-amber-950 border-amber-300 font-bold" },
  general: { vi: "Hiệp Nguyện", en: "General Prayer", color: "bg-slate-50 text-slate-700 border-slate-200" },
};

export default function PrayerSanctuaryPage() {
  const { user } = useAuth();
  const { bilingual, isEn } = useLanguage();

  const [prayers, setPrayers] = useState<PrayerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [onlyAnswered, setOnlyAnswered] = useState(false);
  const [search, setSearch] = useState("");

  // Absentee Alerts (Pastor only)
  const [absentees, setAbsentees] = useState<AbsenteeItem[]>([]);
  const [loadingAbsentees, setLoadingAbsentees] = useState(false);

  // Create Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("healing");
  const [isConfidential, setIsConfidential] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // Testimony Modal
  const [testimonyTarget, setTestimonyTarget] = useState<PrayerItem | null>(null);
  const [praiseReportText, setPraiseReportText] = useState("");
  const [submittingTestimony, setSubmittingTestimony] = useState(false);

  // Pastoral Visit Modal
  const [visitTarget, setVisitTarget] = useState<AbsenteeItem | null>(null);
  const [visitNotes, setVisitNotes] = useState("");
  const [contactType, setContactType] = useState("phone");
  const [loggingVisit, setLoggingVisit] = useState(false);

  // Local intercession tracking
  const [intercedingIds, setIntercedingIds] = useState<Set<string>>(new Set());

  const isPastorOrAdmin = user?.role === "senior_pastor" || user?.role === "admin";

  const fetchPrayers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (selectedCategory) params.append("category", selectedCategory);
      if (onlyAnswered) params.append("isAnswered", "true");
      const queryStr = params.toString() ? `?${params.toString()}` : "";

      const res = await apiFetch<{ items: PrayerItem[] }>(`/prayers${queryStr}`);
      setPrayers(res.items || []);
    } catch {
      // offline fallback
    } finally {
      setLoading(false);
    }
  };

  const fetchAbsentees = async () => {
    if (!isPastorOrAdmin) return;
    setLoadingAbsentees(true);
    try {
      const res = await apiFetch<{ absentees: AbsenteeItem[] }>(
        "/prayers/pastoral-care/absentees",
      );
      setAbsentees(res.absentees || []);
    } catch {
      // ignore
    } finally {
      setLoadingAbsentees(false);
    }
  };

  useEffect(() => {
    fetchPrayers();
  }, [selectedCategory, onlyAnswered]);

  useEffect(() => {
    if (user && isPastorOrAdmin) {
      fetchAbsentees();
    }
  }, [user]);

  const handleIntercede = async (prayerId: string) => {
    if (intercedingIds.has(prayerId)) return;

    setIntercedingIds((prev) => new Set(prev).add(prayerId));
    try {
      const res = await apiFetch<{ prayerCount: number }>(`/prayers/${prayerId}/intercede`, {
        method: "POST",
      });

      setPrayers((prev) =>
        prev.map((p) =>
          p.id === prayerId
            ? { ...p, prayerCount: res.prayerCount, hasInterceded: true }
            : p,
        ),
      );
    } catch {
      // error
    } finally {
      setIntercedingIds((prev) => {
        const next = new Set(prev);
        next.delete(prayerId);
        return next;
      });
    }
  };

  const handleCreatePrayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      setCreateError(
        bilingual(
          "Vui lòng điền đầy đủ tiêu đề và nội dung cầu thay.",
          "Please enter a prayer title and request details."
        )
      );
      return;
    }

    setCreating(true);
    setCreateError("");
    try {
      await apiFetch("/prayers", {
        method: "POST",
        body: JSON.stringify({
          title: newTitle.trim(),
          content: newContent.trim(),
          category: newCategory,
          isConfidential,
          isAnonymous,
        }),
      });

      setShowCreateModal(false);
      setNewTitle("");
      setNewContent("");
      setIsConfidential(false);
      setIsAnonymous(false);
      fetchPrayers();
    } catch (err) {
      if (err instanceof ApiError) {
        setCreateError(err.message);
      } else {
        setCreateError(
          bilingual(
            "Không thể gửi lời cầu thay. Vui lòng thử lại.",
            "Could not submit prayer request. Please try again."
          )
        );
      }
    } finally {
      setCreating(false);
    }
  };

  const handleSubmitTestimony = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonyTarget || !praiseReportText.trim()) return;

    setSubmittingTestimony(true);
    try {
      await apiFetch(`/prayers/${testimonyTarget.id}/testimony`, {
        method: "PATCH",
        body: JSON.stringify({
          praiseReport: praiseReportText.trim(),
        }),
      });

      setTestimonyTarget(null);
      setPraiseReportText("");
      fetchPrayers();
    } catch {
      // error
    } finally {
      setSubmittingTestimony(false);
    }
  };

  const handleLogVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitTarget || !visitNotes.trim()) return;

    setLoggingVisit(true);
    try {
      await apiFetch("/prayers/pastoral-care/log-visit", {
        method: "POST",
        body: JSON.stringify({
          memberId: visitTarget.memberId,
          contactType,
          notes: visitNotes.trim(),
        }),
      });

      setVisitTarget(null);
      setVisitNotes("");
      fetchAbsentees();
    } catch {
      // error
    } finally {
      setLoggingVisit(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Sacred Grace Hero Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-950 text-white rounded-2xl border border-amber-400/30 shadow-md shadow-indigo-950/20">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-serif uppercase tracking-widest">
            <span>†</span>
            <span>
              {bilingual(
                "Hiệp Một Lòng Trong Danh Chúa Jesus",
                "United in Heart in Jesus' Name"
              )}
            </span>
          </div>
          <h1 className="font-scripture text-2xl sm:text-3xl font-bold tracking-tight">
            {bilingual(
              "Tường Cầu Thay Thánh & Lời Chứng Tạ Ơn",
              "Sacred Prayer Wall & Praise Sanctuary"
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            {bilingual(
              '"Hãy cầu nguyện không thôi. Hãy tạ ơn Chúa trong mọi sự; vì đây là ý muốn của Đức Chúa Trời trong Đức Chúa Jêsus Christ đối với anh em." — 1 Tê-sa-lô-ni-ca 5:17-18',
              '"Pray continually, give thanks in all circumstances; for this is God\'s will for you in Christ Jesus." — 1 Thessalonians 5:17-18'
            )}
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <TactileButton
              variant="gold"
              size="md"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              <span>
                {bilingual(
                  "Gửi Lời Cầu Xin Lên Hội Thánh",
                  "Submit Prayer Request"
                )}
              </span>
            </TactileButton>

            <button
              onClick={() => {
                setOnlyAnswered(!onlyAnswered);
                setSelectedCategory("");
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                onlyAnswered
                  ? "bg-amber-400 text-indigo-950 border-amber-300 font-bold"
                  : "bg-white/10 hover:bg-white/20 text-white border-white/20"
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>
                {onlyAnswered
                  ? bilingual("Đang Lọc Lời Chứng Đã Nhậm", "Showing Answered Prayers")
                  : bilingual("Xem Lời Chúa Đã Nhậm Lời", "View Answered Prayers ✨")}
              </span>
            </button>
          </div>
        </div>

        <div className="absolute right-6 -bottom-8 text-amber-500/10 font-serif text-9xl select-none pointer-events-none">
          †
        </div>
      </div>

      {/* PASTOR ABSENTEE EARLY WARNING & PASTORAL CARE */}
      {isPastorOrAdmin && absentees.length > 0 && (
        <section className="p-6 bg-white rounded-2xl border-2 border-rose-300/80 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-scripture text-base font-bold text-rose-950 flex items-center gap-2">
                  <span>
                    {bilingual(
                      "Cảnh Báo Thuộc Linh: Tín Hữu Vắng Mặt Cần Thăm Viếng Ngay",
                      "Spiritual Watch: Absent Members Requiring Care Visit"
                    )}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold">
                    {absentees.length} {bilingual("Tín Hữu", "Members")}
                  </span>
                </h3>
                <p className="text-xs text-rose-700 font-serif">
                  {bilingual(
                    "Tự động phát hiện tín hữu vắng mặt 2 tuần liên tiếp hoặc ngưng đọc Lời Chúa trong 14 ngày",
                    "Automatically flagging members absent 2 consecutive weeks or inactive in devotional reading for 14 days"
                  )}
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {bilingual("Mục Vụ Chăm Sóc Bầy Chiên", "Shepherd Care Ministry")}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {absentees.map((item) => (
              <div
                key={item.memberId}
                className="p-4 rounded-xl bg-[#FCFBF8] border border-amber-200/80 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900">{item.fullName}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                      {bilingual(
                        `Vắng ${item.consecutiveWeeks} Tuần`,
                        `Absent ${item.consecutiveWeeks} Weeks`
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-rose-700 font-medium">{item.alertReason}</p>
                  <p className="text-[11px] text-slate-500 font-serif">
                    {bilingual("Điểm nhóm:", "Campus:")} {item.campusId} •{" "}
                    {bilingual("Lần sinh hoạt cuối:", "Last active:")}{" "}
                    {new Date(item.lastActivityDate).toLocaleDateString(
                      isEn ? "en-US" : "vi-VN"
                    )}
                  </p>

                  {item.lastContacted && (
                    <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100 text-[11px] text-emerald-900">
                      <span className="font-bold">
                        {bilingual("Lần thăm gần nhất:", "Last Care Visit:")}
                      </span>{" "}
                      {item.lastContacted.notes}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-amber-100">
                  <a
                    href={`tel:${item.phone}`}
                    className="flex-1 py-2 px-3 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-300" />
                    <span>
                      {bilingual("Gọi", "Call")} {item.phone}
                    </span>
                  </a>

                  <button
                    onClick={() => {
                      setVisitTarget(item);
                      setVisitNotes("");
                    }}
                    className="py-2 px-3 rounded-xl border border-amber-300 bg-white hover:bg-amber-50 text-indigo-950 text-xs font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-amber-800" />
                    <span>{bilingual("Ghi Sổ Thăm Viếng", "Log Visit")}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setOnlyAnswered(false);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id && !onlyAnswered
                  ? "bg-indigo-950 text-white shadow-xs"
                  : "bg-white text-slate-700 border border-amber-200/70 hover:bg-amber-100/60"
              }`}
            >
              {isEn ? cat.en : cat.vi}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchPrayers();
          }}
          className="relative sm:w-64"
        >
          <Search className="w-4 h-4 text-amber-800 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={bilingual(
              "Tìm theo nội dung cầu thay...",
              "Search prayer requests..."
            )}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 bg-white border border-amber-200/80 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
          />
        </form>
      </div>

      {/* Prayer Cards Grid */}
      {loading ? (
        <div className="text-center py-20 space-y-3">
          <span className="text-amber-700 font-serif text-3xl animate-spin select-none inline-block">
            †
          </span>
          <p className="text-xs font-serif italic text-slate-500">
            {bilingual(
              '"Đang mở nơi hiệp nguyện trước Ngôi Ơn Phước..."',
              '"Approaching the Throne of Grace in prayer..."'
            )}
          </p>
        </div>
      ) : prayers.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-amber-200/60 space-y-3">
          <Heart className="w-10 h-10 mx-auto text-amber-700/60" />
          <h3 className="font-scripture text-lg font-bold text-slate-900">
            {bilingual(
              "Chưa có lời cầu thay nào trong danh mục này",
              "No prayer requests in this category yet"
            )}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {bilingual(
              "Hãy là người đầu tiên dâng lời cầu xin hoặc chia sẻ phước hạnh Chúa ban cho Hội Thánh.",
              "Be the first to submit a request or share what God has done for our church community."
            )}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {prayers.map((prayer) => {
            const catBadge =
              CATEGORY_LABELS[prayer.category] || CATEGORY_LABELS.general;
            const isAuthorOrPastor =
              prayer.userId === user?.id || isPastorOrAdmin;

            const authorDisplayName =
              prayer.isAnonymous || prayer.authorName === "Tín Hữu Ẩn Danh"
                ? bilingual("Tín Hữu Ẩn Danh", "Anonymous Member")
                : prayer.authorName;

            return (
              <div
                key={prayer.id}
                className={`bg-white rounded-2xl p-6 border shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 ${
                  prayer.isAnswered
                    ? "border-amber-400/90 bg-gradient-to-br from-amber-50/40 via-white to-white"
                    : "border-amber-200/80"
                }`}
              >
                <div className="space-y-3">
                  {/* Top Metadata */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${catBadge.color}`}
                      >
                        {isEn ? catBadge.en : catBadge.vi}
                      </span>
                      {prayer.isConfidential && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />{" "}
                          {bilingual("Kín nhiệm", "Confidential")}
                        </span>
                      )}
                      {prayer.isAnswered && (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400 text-indigo-950 flex items-center gap-1 shadow-xs">
                          <Sparkles className="w-3 h-3 fill-current" />{" "}
                          {bilingual("Chúa Đã Nhậm Lời ✨", "Answered Prayer ✨")}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-serif">
                      {new Date(prayer.createdAt).toLocaleDateString(
                        isEn ? "en-US" : "vi-VN"
                      )}
                    </span>
                  </div>

                  {/* Title & Author */}
                  <div>
                    <h3 className="font-scripture text-lg font-bold text-slate-900 leading-snug">
                      {prayer.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-amber-900 font-serif mt-1">
                      <User className="w-3.5 h-3.5 text-amber-700" />
                      <span>{authorDisplayName}</span>
                    </div>
                  </div>

                  {/* Prayer Content */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif bg-[#FCFBF8] p-4 rounded-xl border border-amber-100/80">
                    "{prayer.content}"
                  </p>

                  {/* Praise Report / Answered Testimony */}
                  {prayer.isAnswered && prayer.praiseReport && (
                    <div className="p-4 bg-amber-50/80 border border-amber-300 rounded-xl space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 font-serif">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>
                          {bilingual(
                            "Lời Chứng Tạ Ơn Đức Chúa Trời:",
                            "Testimony of God's Answer:"
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-amber-950 font-serif italic leading-relaxed">
                        "{prayer.praiseReport}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-amber-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => handleIntercede(prayer.id)}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                      prayer.hasInterceded
                        ? "bg-amber-100 text-amber-950 border-amber-300 font-bold"
                        : "bg-white text-indigo-950 border-amber-300/80 hover:bg-amber-50/60 shadow-xs"
                    }`}
                  >
                    <span>🙏</span>
                    <span>
                      {prayer.hasInterceded
                        ? bilingual("Đã Hiệp Ý Trong Chúa", "Interceded in Prayer")
                        : bilingual("Tôi Cùng Hiệp Nguyện", "I'm Praying For This")}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-950 text-[10px] font-bold">
                      {prayer.prayerCount}
                    </span>
                  </button>

                  {isAuthorOrPastor && !prayer.isAnswered && (
                    <button
                      onClick={() => {
                        setTestimonyTarget(prayer);
                        setPraiseReportText("");
                      }}
                      className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-300 text-xs font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
                      title={bilingual(
                        "Chia sẻ lời chứng tạ ơn khi Chúa đã nhậm lời",
                        "Share praise report when God answered prayer"
                      )}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                      <span className="hidden sm:inline">
                        {bilingual("Chúa Đã Nhậm", "Share Praise")}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE PRAYER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FCFBF8] border border-amber-300/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-amber-200/70 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-amber-800 font-serif font-bold text-xl">†</span>
                <h3 className="font-scripture text-lg font-bold text-slate-900">
                  {bilingual(
                    "Gửi Lời Cầu Xin Lên Tường Hiệp Nguyện",
                    "Submit Prayer Request to the Sanctuary Wall"
                  )}
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreatePrayer} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  {bilingual("Tiêu Đề Lời Cầu Thay *", "Prayer Request Title *")}
                </label>
                <input
                  type="text"
                  required
                  placeholder={bilingual(
                    "Ví dụ: Xin cầu nguyện cho ca mổ của Mẹ vào tuần tới",
                    "e.g., Please pray for my mother's surgery next week"
                  )}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-amber-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  {bilingual("Chuyên Mục", "Category")}
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-amber-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="healing">{bilingual("Chữa Lành & Sức Khỏe", "Healing & Health")}</option>
                  <option value="family">{bilingual("Gia Đình & Hôn Nhân", "Family & Marriage")}</option>
                  <option value="ministry">{bilingual("Mục Vụ & Hội Thánh", "Ministry & Church")}</option>
                  <option value="salvation">{bilingual("Cứu Rỗi Thân Hữu", "Salvation of Loved Ones")}</option>
                  <option value="thanksgiving">{bilingual("Lời Chứng Tạ Ơn", "Praise Report")}</option>
                  <option value="general">{bilingual("Nan Đề Chung", "General Prayer")}</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  {bilingual("Nội Dung Chi Tiết Lời Cầu Xin *", "Prayer Details *")}
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder={bilingual(
                    "Mô tả cụ thể nan đề, thời gian, và điều bạn mong ước Hội Thánh cùng hiệp nguyện cùng bạn...",
                    "Describe your prayer need, situation, and how our church community can pray specifically..."
                  )}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-3 bg-white border border-amber-200/80 rounded-xl text-xs text-slate-900 font-serif focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-2 pt-1 border-t border-amber-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isConfidential}
                    onChange={(e) => setIsConfidential(e.target.checked)}
                    className="w-4 h-4 text-amber-700 rounded border-amber-300 focus:ring-amber-500"
                  />
                  <span className="font-semibold text-slate-800">
                    {bilingual(
                      "Kín nhiệm: Chỉ Mục sư Quản nhiệm và Ban Trị Sự được xem",
                      "Confidential: Pastoral staff and church board only"
                    )}
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 text-amber-700 rounded border-amber-300 focus:ring-amber-500"
                  />
                  <span className="font-semibold text-slate-800">
                    {bilingual(
                      'Đăng ẩn danh (Hiển thị tác giả là "Tín Hữu Ẩn Danh")',
                      'Post anonymously (Displays author as "Anonymous Member")'
                    )}
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
                >
                  {bilingual("Hủy Bỏ", "Cancel")}
                </button>
                <TactileButton variant="primary" size="md" type="submit" disabled={creating}>
                  {creating
                    ? bilingual("Đang Gửi Lời Cầu Xin...", "Submitting...")
                    : bilingual("Gửi Lời Cầu Thay", "Submit Prayer Request")}
                </TactileButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRAISE REPORT / TESTIMONY MODAL */}
      {testimonyTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FCFBF8] border-2 border-amber-400 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-amber-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-amber-800 font-serif font-bold text-xl">†</span>
                <h3 className="font-scripture text-lg font-bold text-slate-900">
                  {bilingual(
                    "Ghi Nhận Lời Chứng: Đức Chúa Trời Đã Nhậm Lời!",
                    "Praise Report: God Has Answered Prayer!"
                  )}
                </h3>
              </div>
              <button
                onClick={() => setTestimonyTarget(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTestimony} className="space-y-4 text-xs">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="font-bold text-slate-900">
                  {bilingual("Lời Cầu Thay:", "Prayer Request:")}
                </span>{" "}
                <span className="text-slate-700">{testimonyTarget.title}</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  {bilingual(
                    "Chia Sẻ Lời Chứng Tạ Ơn (Praise Report) *",
                    "Share Your Praise Report / Testimony *"
                  )}
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder={bilingual(
                    "Hãy kể lại việc Chúa đã nhậm lời và ban ơn phước như thế nào để khích lệ đức tin toàn thể Hội Thánh...",
                    "Tell how God answered this prayer and worked in this situation to encourage our whole church community..."
                  )}
                  value={praiseReportText}
                  onChange={(e) => setPraiseReportText(e.target.value)}
                  className="w-full p-3 bg-white border border-amber-200/80 rounded-xl text-xs text-slate-900 font-serif focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTestimonyTarget(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
                >
                  {bilingual("Hủy Bỏ", "Cancel")}
                </button>
                <TactileButton
                  variant="gold"
                  size="md"
                  type="submit"
                  disabled={submittingTestimony}
                >
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  <span>
                    {submittingTestimony
                      ? bilingual("Đang Ghi Nhận...", "Publishing...")
                      : bilingual("Đăng Lời Chứng Tạ Ơn", "Post Praise Report")}
                  </span>
                </TactileButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOG PASTORAL VISIT MODAL */}
      {visitTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FCFBF8] border border-amber-300/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-amber-200/70 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-amber-800 font-serif font-bold text-xl">†</span>
                <h3 className="font-scripture text-lg font-bold text-slate-900">
                  {bilingual(
                    "Ghi Sổ Nhật Ký Chăm Sóc & Thăm Viếng",
                    "Log Pastoral Care & Visit Entry"
                  )}
                </h3>
              </div>
              <button
                onClick={() => setVisitTarget(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogVisit} className="space-y-4 text-xs">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                <div className="font-bold text-slate-900">{visitTarget.fullName}</div>
                <div className="text-slate-600 font-serif">
                  {bilingual("Điện thoại:", "Phone:")} {visitTarget.phone} • {visitTarget.alertReason}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  {bilingual("Hình Thức Liên Hệ", "Contact Method")}
                </label>
                <select
                  value={contactType}
                  onChange={(e) => setContactType(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-amber-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="phone">
                    {bilingual("Gọi điện thoại thăm hỏi", "Phone Call")}
                  </option>
                  <option value="in_person">
                    {bilingual("Gặp gỡ trực tiếp", "In-Person Meeting")}
                  </option>
                  <option value="home_visit">
                    {bilingual("Thăm viếng tại tư gia", "Home Care Visit")}
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  {bilingual(
                    "Ghi Chú Nội Dung Thăm Viếng & Nhu Cầu Cầu Thay *",
                    "Pastoral Visit Notes & Prayer Requests *"
                  )}
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder={bilingual(
                    "Ví dụ: Đã gọi điện thăm hỏi, gia đình bị cảm sốt nên vắng mặt, hiện đã khỏe lại và sẽ đi nhà thờ vào Chúa Nhật tới...",
                    "e.g., Called family; missed worship due to flu. Recovered now and attending worship this upcoming Sunday..."
                  )}
                  value={visitNotes}
                  onChange={(e) => setVisitNotes(e.target.value)}
                  className="w-full p-3 bg-white border border-amber-200/80 rounded-xl text-xs text-slate-900 font-serif focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setVisitTarget(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
                >
                  {bilingual("Hủy Bỏ", "Cancel")}
                </button>
                <TactileButton variant="primary" size="md" type="submit" disabled={loggingVisit}>
                  {loggingVisit
                    ? bilingual("Đang Lưu Sổ...", "Saving...")
                    : bilingual("Lưu Nhật Ký Thăm Viếng", "Save Care Entry")}
                </TactileButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
