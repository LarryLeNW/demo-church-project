"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { BentoCard } from "@/components/ui/bento-card";
import { TactileButton } from "@/components/ui/tactile-button";
import {
  Megaphone,
  Mail,
  MessageSquare,
  AlertTriangle,
  Clock,
  Printer,
  Calendar,
  Sparkles,
  CheckCircle2,
  Send,
  Users2,
  FileText,
  DollarSign,
  Plus,
  X,
  BookOpen,
} from "lucide-react";

interface OrderOfServiceItem {
  order: number;
  segment: string;
  leaderOrMinister: string;
  notes?: string;
}

interface BulletinAnnouncement {
  title: string;
  category: string;
  content: string;
  dateOrDeadline?: string;
  contactPerson?: string;
}

interface ChurchBulletin {
  id: string;
  title: string;
  bulletinDate: string;
  themeScripture: string;
  sermonTitle: string;
  preacherName: string;
  orderOfService: OrderOfServiceItem[];
  announcements: BulletinAnnouncement[];
  prayerFocus: string;
  financialUpdate: string | null;
  isPublished: boolean;
}

interface ChurchCommunication {
  id: string;
  channel: "sms" | "email";
  type: string;
  targetAudience: string;
  title: string;
  content: string;
  recipientCount: number;
  status: string;
  sentAt: string;
  sender?: { fullName: string };
  metadata?: { provider?: string; segmentsCount?: number };
}

export default function CommunicationsPage() {
  const { user } = useAuth();
  const { bilingual, isEn } = useLanguage();
  const [activeTab, setActiveTab] = useState<"bulletin" | "broadcast">("bulletin");

  // Bulletin states
  const [bulletin, setBulletin] = useState<ChurchBulletin | null>(null);
  const [loadingBulletin, setLoadingBulletin] = useState(true);

  // Broadcast states
  const [broadcasts, setBroadcasts] = useState<ChurchCommunication[]>([]);
  const [loadingBroadcasts, setLoadingBroadcasts] = useState(false);
  const [channel, setChannel] = useState<"sms" | "email">("sms");
  const [type, setType] = useState("emergency_alert");
  const [targetAudience, setTargetAudience] = useState("all_members");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [broadcastFeedback, setBroadcastFeedback] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const isPastorOrAdmin = user?.role === "senior_pastor" || user?.role === "admin";

  useEffect(() => {
    loadBulletin();
    if (isPastorOrAdmin) {
      loadBroadcastHistory();
    }
  }, [isPastorOrAdmin]);

  async function loadBulletin() {
    try {
      setLoadingBulletin(true);
      const res = await apiFetch<ChurchBulletin>("/communications/bulletin/latest");
      setBulletin(res);
    } catch (err) {
      console.error("Lỗi tải bản tin:", err);
    } finally {
      setLoadingBulletin(false);
    }
  }

  async function loadBroadcastHistory() {
    try {
      setLoadingBroadcasts(true);
      const res = await apiFetch<{ items: ChurchCommunication[] }>(
        "/communications/broadcasts",
      );
      setBroadcasts(res.items || []);
    } catch (err) {
      console.error("Lỗi tải lịch sử truyền thông:", err);
    } finally {
      setLoadingBroadcasts(false);
    }
  }

  async function handleSendBroadcast(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      setSending(true);
      setBroadcastFeedback(null);
      const res = await apiFetch<{ message: string; recipientsCount: number }>(
        "/communications/broadcast",
        {
          method: "POST",
          body: JSON.stringify({
            channel,
            type,
            targetAudience,
            title: title.trim(),
            content: content.trim(),
          }),
        },
      );

      setBroadcastFeedback({
        success: true,
        message:
          res.message ||
          bilingual(
            "Đã gửi thông điệp mục vụ thành công!",
            "Ministry broadcast sent successfully!",
          ),
      });

      setTitle("");
      setContent("");
      loadBroadcastHistory();
    } catch (err) {
      setBroadcastFeedback({
        success: false,
        message: bilingual(
          "Không thể phát sóng thông điệp. Xin thử lại.",
          "Could not send broadcast. Please try again.",
        ),
      });
    } finally {
      setSending(false);
    }
  }

  const typeLabels: Record<string, { vi: string; en: string }> = {
    emergency_alert: {
      vi: "Cảnh Báo Khẩn Cấp (Bão Tuyết / Thời Tiết)",
      en: "Emergency Alert (Severe Weather / Ice Storm)",
    },
    weekly_bulletin: {
      vi: "Bản Tin Mục Vụ Tuần",
      en: "Weekly Ministry Bulletin",
    },
    service_reminder: {
      vi: "Nhắc Lịch Thờ Phượng",
      en: "Worship Service Reminder",
    },
    general_announcement: {
      vi: "Thông Báo Chung",
      en: "General Church Announcement",
    },
  };

  const audienceLabels: Record<string, { vi: string; en: string }> = {
    all_members: {
      vi: "Tất Cả Tín Hữu (142 Người)",
      en: "All Church Members (142 people)",
    },
    leaders_only: {
      vi: "Ban Lãnh Đạo & Trưởng Ban Mục Vụ",
      en: "Pastors, Elders & Ministry Leaders",
    },
    parents_only: {
      vi: "Phụ Huynh Lớp Thiếu Nhi",
      en: "Children's Sunday School Parents",
    },
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-950 text-white rounded-2xl border border-amber-400/30 shadow-md relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-serif uppercase tracking-widest">
            <span>†</span>
            <span>{bilingual("Truyền Thông Mục Vụ & Bản Tin Điện Tử", "Ministry Communications & Church Bulletin")}</span>
          </div>
          <h1 className="font-scripture text-2xl sm:text-3xl font-bold tracking-tight">
            {bilingual("Tiếng Kèn Thức Canh & Bản Tin Hội Thánh", "Watchman's Trumpet & Church Bulletin")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
            {bilingual(
              "Hệ thống kết nối mục vụ song ngữ: Bản tin thờ phượng Chúa Nhật và mạng lưới gửi SMS Twilio khẩn cấp (cảnh báo đóng băng, dời giờ nhóm) đến từng gia đình tín hữu.",
              "Bilingual church communications: Weekly Sunday worship bulletin and emergency Twilio SMS broadcast (winter storm advisories, service adjustments) directly to member households.",
            )}
          </p>
        </div>

        <div className="absolute right-6 -bottom-8 text-amber-500/10 font-serif text-9xl select-none pointer-events-none">
          †
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center justify-between border-b border-amber-200/70 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setActiveTab("bulletin")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "bulletin"
                ? "bg-indigo-950 text-white shadow-xs"
                : "bg-white text-slate-700 border border-amber-200 hover:bg-amber-50"
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>{bilingual("Bản Tin Chúa Nhật (Church Bulletin)", "Weekly Church Bulletin")}</span>
          </button>

          {isPastorOrAdmin && (
            <button
              onClick={() => setActiveTab("broadcast")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "broadcast"
                  ? "bg-indigo-950 text-white shadow-xs"
                  : "bg-white text-slate-700 border border-amber-200 hover:bg-amber-50"
              }`}
            >
              <Megaphone className="w-4 h-4 text-amber-700" />
              <span>
                {bilingual(
                  `Phát Sóng SMS Twilio Khẩn Cấp (${broadcasts.length})`,
                  `Twilio SMS & Broadcast (${broadcasts.length})`,
                )}
              </span>
            </button>
          )}
        </div>

        {activeTab === "bulletin" && (
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg border border-amber-300 bg-white hover:bg-amber-50 text-indigo-950 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-amber-800" />
            <span>{bilingual("In Bản Tin", "Print Bulletin")}</span>
          </button>
        )}
      </div>

      {/* TAB 1: WEEKLY CHURCH BULLETIN */}
      {activeTab === "bulletin" && (
        <div className="space-y-6">
          {loadingBulletin ? (
            <div className="py-20 text-center space-y-2">
              <span className="text-amber-800 font-serif text-3xl font-bold animate-spin inline-block">†</span>
              <p className="text-xs font-serif italic text-slate-600">
                {bilingual("Đang chuẩn bị bản tin thờ phượng...", "Preparing worship bulletin...")}
              </p>
            </div>
          ) : !bulletin ? (
            <div className="p-12 text-center text-xs text-slate-500">
              {bilingual("Chưa có bản tin nào được xuất bản.", "No bulletin has been published yet.")}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto bg-white border border-amber-300/80 rounded-2xl shadow-sm overflow-hidden p-6 sm:p-10 space-y-8">
              {/* Bulletin Header */}
              <div className="text-center space-y-2 border-b-2 border-indigo-950 pb-6">
                <span className="text-amber-800 font-serif text-3xl font-bold select-none">†</span>
                <h2 className="font-scripture text-2xl sm:text-3xl font-bold text-indigo-950">
                  {bulletin.title}
                </h2>
                <div className="text-xs font-serif text-amber-900 font-semibold">
                  {bilingual("Hội Thánh Tin Lành Ân Điển Hoa Kỳ", "Grace Church USA")} •{" "}
                  {bilingual("Ngày", "Date")} {bulletin.bulletinDate}
                </div>
              </div>

              {/* Theme Scripture & Sermon Focus */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#FCFBF8] border border-amber-200/80 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold uppercase text-amber-800 font-serif tracking-wider">
                    {bilingual("Câu Gốc Chủ Đề Của Tuần", "Weekly Theme Scripture")}
                  </span>
                  <blockquote className="font-scripture text-sm italic text-slate-900 leading-relaxed pt-1">
                    {bulletin.themeScripture}
                  </blockquote>
                </div>

                <div className="p-4 bg-indigo-950 text-white rounded-xl space-y-1">
                  <span className="text-[10px] font-bold uppercase text-amber-300 font-serif tracking-wider">
                    {bilingual("Giảng Luận Chúa Nhật", "Sunday Sermon")}
                  </span>
                  <h3 className="font-scripture text-lg font-bold text-amber-200">
                    "{bulletin.sermonTitle}"
                  </h3>
                  <p className="text-xs text-slate-300">
                    {bilingual("Giảng luận:", "Speaker:")} {bulletin.preacherName}
                  </p>
                </div>
              </div>

              {/* Order of Service Schedule */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-amber-200/80 pb-2">
                  <span className="text-amber-800 font-serif font-bold">†</span>
                  <h4 className="text-xs font-bold font-serif text-slate-900 uppercase tracking-wider">
                    {bilingual(
                      "Chương Trình Lễ Thờ Phượng (Order of Service)",
                      "Order of Worship Service",
                    )}
                  </h4>
                </div>

                <div className="border border-amber-200/70 rounded-xl overflow-hidden divide-y divide-amber-100">
                  {bulletin.orderOfService.map((item) => (
                    <div
                      key={item.order}
                      className="p-3 sm:px-4 flex items-center justify-between gap-4 text-xs hover:bg-[#FCFBF8] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-[11px] shrink-0">
                          {item.order}
                        </span>
                        <span className="font-semibold text-slate-900">{item.segment}</span>
                      </div>
                      <span className="text-slate-500 font-serif text-right text-[11px]">
                        {item.leaderOrMinister}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Announcements */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-amber-200/80 pb-2">
                  <span className="text-amber-800 font-serif font-bold">†</span>
                  <h4 className="text-xs font-bold font-serif text-slate-900 uppercase tracking-wider">
                    {bilingual("Thông Báo Mục Vụ Trong Tuần", "Weekly Ministry Announcements")}
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {bulletin.announcements.map((ann, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-[#FCFBF8] border border-amber-200 rounded-xl space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                          {ann.category}
                        </span>
                        <h5 className="font-bold text-xs text-slate-900 pt-1">{ann.title}</h5>
                        <p className="text-[11px] text-slate-600 leading-snug">{ann.content}</p>
                      </div>
                      <div className="text-[10px] text-slate-500 pt-2 border-t border-amber-100/80 flex justify-between">
                        <span>{ann.dateOrDeadline}</span>
                        <span className="font-semibold text-indigo-950">{ann.contactPerson}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pastoral Prayer & Giving Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-amber-50/60 border border-amber-300 rounded-xl space-y-1">
                  <div className="font-bold text-amber-950 font-serif uppercase tracking-wider">
                    {bilingual("Trọng Tâm Cầu Thay Tuần Này", "Pastoral Prayer Focus")}
                  </div>
                  <p className="text-slate-700 leading-relaxed font-serif italic pt-1">
                    "{bulletin.prayerFocus}"
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/70 border border-emerald-300 rounded-xl space-y-1">
                  <div className="font-bold text-emerald-950 font-serif uppercase tracking-wider">
                    {bilingual("Tài Chính Dâng Hiến & Tạ Ơn Chúa", "Tithes & Offerings Thanksgiving")}
                  </div>
                  <p className="text-slate-700 leading-relaxed pt-1">
                    {bulletin.financialUpdate ||
                      bilingual(
                        "Nguyện Chúa ban phước dồi dào trên lòng trung tín của con dân Ngài.",
                        "May God abundantly bless the faithfulness of His people.",
                      )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BROADCAST SMS & EMAIL COMPOSE */}
      {activeTab === "broadcast" && isPastorOrAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: Compose Message */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-amber-300/80 shadow-xs space-y-5">
              <div className="flex items-center gap-2 border-b border-amber-200/70 pb-3">
                <Megaphone className="w-5 h-5 text-amber-800" />
                <h3 className="font-scripture text-lg font-bold text-slate-900">
                  {bilingual("Phát Sóng Thông Điệp Mục Vụ", "Broadcast Ministry Message")}
                </h3>
              </div>

              {broadcastFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    broadcastFeedback.success
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                      : "bg-rose-50 text-rose-800 border border-rose-300"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{broadcastFeedback.message}</span>
                </div>
              )}

              <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
                {/* Channel Selector */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5 uppercase font-serif tracking-wider">
                    {bilingual("1. Chọn Kênh Phát Sóng", "1. Choose Delivery Channel")}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setChannel("sms")}
                      className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                        channel === "sms"
                          ? "bg-indigo-950 text-white border-indigo-950"
                          : "bg-[#FCFBF8] text-slate-700 border-amber-200 hover:bg-amber-50"
                      }`}
                    >
                      <MessageSquare className="w-4 h-4 text-amber-400" />
                      <div className="text-left">
                        <div className="font-bold">
                          {bilingual("SMS Twilio (Khẩn Cấp)", "Twilio SMS (Urgent)")}
                        </div>
                        <div className="text-[10px] opacity-80">
                          {bilingual("Gửi trực tiếp vào điện thoại", "Direct mobile text alert")}
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setChannel("email")}
                      className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                        channel === "email"
                          ? "bg-indigo-950 text-white border-indigo-950"
                          : "bg-[#FCFBF8] text-slate-700 border-amber-200 hover:bg-amber-50"
                      }`}
                    >
                      <Mail className="w-4 h-4 text-amber-400" />
                      <div className="text-left">
                        <div className="font-bold">
                          {bilingual("Email Mục Vụ (Resend)", "Ministry Email (Resend)")}
                        </div>
                        <div className="text-[10px] opacity-80">
                          {bilingual("Bản tin & thông báo chi tiết", "Full email broadcast with rich text")}
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Target Audience & Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">
                      {bilingual("Đối Tượng Nhận Tin", "Target Audience")}
                    </label>
                    <select
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="w-full h-10 px-3 bg-[#FCFBF8] border border-amber-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {Object.entries(audienceLabels).map(([key, labelObj]) => (
                        <option key={key} value={key}>
                          {isEn ? labelObj.en : labelObj.vi}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">
                      {bilingual("Loại Thông Báo", "Broadcast Type")}
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full h-10 px-3 bg-[#FCFBF8] border border-amber-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {Object.entries(typeLabels).map(([key, labelObj]) => (
                        <option key={key} value={key}>
                          {isEn ? labelObj.en : labelObj.vi}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    {bilingual("Tiêu Đề Thông Báo *", "Broadcast Subject / Title *")}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={bilingual(
                      "Ví dụ: THÔNG BÁO BÃO TUYẾT DALLAS - BUỔI NHÓM ZOOM",
                      "e.g. DALLAS WINTER STORM ALERT - ZOOM SERVICE",
                    )}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-10 px-3 bg-[#FCFBF8] border border-amber-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Content */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-semibold text-slate-800">
                      {bilingual("Nội Dung Thông Điệp *", "Message Content *")}
                    </label>
                    {channel === "sms" && (
                      <span className="text-[10px] text-slate-500">
                        {content.length} {bilingual("ký tự", "characters")} ({Math.ceil(content.length / 160) || 1} SMS segment)
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={4}
                    required
                    placeholder={
                      channel === "sms"
                        ? bilingual(
                            "Kính gửi Hội Thánh: Do đường đóng băng nguy hiểm, buổi nhóm tối nay chuyển sang trực tuyến Zoom lúc 19:30...",
                            "Dear Church Family: Due to icy road conditions, tonight's service moves online to Zoom at 7:30 PM...",
                          )
                        : bilingual(
                            "Soạn nội dung thông báo đầy đủ gửi qua hộp thư điện tử của tín hữu...",
                            "Compose full ministry newsletter or pastoral announcement for members...",
                          )
                    }
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-3 bg-[#FCFBF8] border border-amber-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
                  />
                </div>

                <TactileButton variant="primary" size="md" type="submit" disabled={sending} className="w-full">
                  <Send className="w-4 h-4 mr-1.5" />
                  <span>
                    {sending
                      ? bilingual("Đang Phát Sóng...", "Broadcasting...")
                      : channel === "sms"
                      ? bilingual("Phát Sóng SMS Twilio", "Broadcast Twilio SMS")
                      : bilingual("Gửi Email Mục Vụ", "Send Ministry Email")}
                  </span>
                </TactileButton>
              </form>
            </div>
          </div>

          {/* Right Log: Broadcast History */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-scripture text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="text-amber-800 font-serif">†</span>
                <span>
                  {bilingual("Lịch Sử Phát Sóng Gần Đây", "Recent Broadcast History")} ({broadcasts.length})
                </span>
              </h3>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {loadingBroadcasts ? (
                <div className="p-8 text-center text-xs text-slate-500 font-serif">
                  {bilingual("Đang tra cứu lịch sử...", "Loading broadcast history...")}
                </div>
              ) : broadcasts.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-2xl border border-amber-200/80">
                  {bilingual("Chưa có thông điệp phát sóng nào.", "No broadcast messages yet.")}
                </div>
              ) : (
                broadcasts.map((comm) => (
                  <div
                    key={comm.id}
                    className="p-4 bg-white border border-amber-200/80 rounded-2xl space-y-2 hover:border-amber-400 transition-colors shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`p-1.5 rounded-lg text-xs ${
                            comm.channel === "sms"
                              ? "bg-indigo-100 text-indigo-900"
                              : "bg-amber-100 text-amber-900"
                          }`}
                        >
                          {comm.channel === "sms" ? (
                            <MessageSquare className="w-3.5 h-3.5" />
                          ) : (
                            <Mail className="w-3.5 h-3.5" />
                          )}
                        </span>
                        <span className="font-bold text-xs text-slate-900">{comm.title}</span>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                        {comm.recipientCount} {bilingual("người nhận", "recipients")}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-[#FCFBF8] p-2.5 rounded-xl border border-amber-100">
                      {comm.content}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 font-serif">
                      <span>
                        {bilingual("Đối tượng:", "Audience:")}{" "}
                        {isEn
                          ? (audienceLabels[comm.targetAudience]?.en || comm.targetAudience)
                          : (audienceLabels[comm.targetAudience]?.vi || comm.targetAudience)}
                      </span>
                      <span>{new Date(comm.sentAt).toLocaleString(isEn ? "en-US" : "vi-VN")}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
