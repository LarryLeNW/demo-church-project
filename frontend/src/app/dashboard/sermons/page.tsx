"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { apiFetch, ApiError } from "@/lib/api/client";
import { BentoCard } from "@/components/ui/bento-card";
import { TactileButton } from "@/components/ui/tactile-button";
import { TactileInput } from "@/components/ui/tactile-input";
import {
  BookText,
  Calendar,
  User,
  CheckCircle2,
  Mail,
  Printer,
  Sparkles,
  HelpCircle,
  Plus,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Save,
  Flame,
  MessageSquare,
  Share2,
} from "lucide-react";

interface OutlinePoint {
  id: string;
  pointNumber: number;
  titleVi: string;
  titleEn: string;
  scriptureRef?: string;
  scriptureTextVi?: string;
  scriptureTextEn?: string;
  fillInBlankTextVi: string;
  blankAnswersVi: string[];
  fillInBlankTextEn: string;
  blankAnswersEn: string[];
}

interface SermonOutline {
  id: string;
  title: string;
  titleEn: string;
  seriesName: string;
  preacherName: string;
  serviceDate: string;
  campusId: string;
  mainScriptureRef: string;
  mainScriptureTextVi: string;
  mainScriptureTextEn: string;
  outlinePoints: OutlinePoint[];
  discussionQuestions: string[];
  isPublished: boolean;
}

interface UserSermonNote {
  id: string;
  outlineId: string;
  userId: string;
  filledAnswers: Record<string, string>;
  personalNotes: Record<string, string>;
  prayerCommitment: string | null;
  isEmailed: boolean;
}

export default function SermonsPage() {
  const { user } = useAuth();
  const { bilingual, isEn } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [allOutlines, setAllOutlines] = useState<SermonOutline[]>([]);
  const [currentOutline, setCurrentOutline] = useState<SermonOutline | null>(null);
  const [myNote, setMyNote] = useState<UserSermonNote | null>(null);

  // Note taking state
  const [filledAnswers, setFilledAnswers] = useState<Record<string, string>>({});
  const [personalNotes, setPersonalNotes] = useState<Record<string, string>>({});
  const [prayerCommitment, setPrayerCommitment] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [revealedBlanks, setRevealedBlanks] = useState<Record<string, boolean>>({});

  // Pastor outline creator
  const isPastorOrLeader =
    user?.role === "senior_pastor" ||
    user?.role === "admin" ||
    user?.role === "ministry_leader";

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchOutlines = async () => {
    try {
      const outlines = await apiFetch<SermonOutline[]>("/sermons/outlines", { auth: false });
      setAllOutlines(outlines);
      if (outlines.length > 0) {
        const active = outlines[0];
        setCurrentOutline(active);
        await loadMyNote(active.id);
      }
    } catch (err) {
      console.error("Không thể tải danh sách bài giảng:", err);
    }
  };

  const loadMyNote = async (outlineId: string) => {
    if (!user) return;
    try {
      const note = await apiFetch<UserSermonNote>(`/sermons/my-notes/${outlineId}`);
      setMyNote(note);
      setFilledAnswers(note.filledAnswers || {});
      setPersonalNotes(note.personalNotes || {});
      setPrayerCommitment(note.prayerCommitment || "");
    } catch (err) {
      console.error("Không thể tải ghi chú cá nhân:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchOutlines();
      setLoading(false);
    };
    init();
  }, [user]);

  const handleSelectOutline = async (outlineId: string) => {
    const selected = allOutlines.find((o) => o.id === outlineId);
    if (selected) {
      setCurrentOutline(selected);
      await loadMyNote(selected.id);
    }
  };

  const handleAnswerChange = (pointId: string, blankIdx: number, value: string) => {
    const key = `${pointId}_${blankIdx}`;
    setFilledAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handlePersonalNoteChange = (pointId: string, value: string) => {
    setPersonalNotes((prev) => ({ ...prev, [pointId]: value }));
  };

  const handleToggleReveal = (key: string) => {
    setRevealedBlanks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveNotes = async () => {
    if (!currentOutline) return;
    setSavingNote(true);
    try {
      const saved = await apiFetch<UserSermonNote>(`/sermons/my-notes/${currentOutline.id}`, {
        method: "PUT",
        body: {
          filledAnswers,
          personalNotes,
          prayerCommitment: prayerCommitment || undefined,
        },
      });
      setMyNote(saved);
      showToast(
        bilingual(
          "Đã lưu ghi chú bài giảng thành công vào tài khoản của bạn!",
          "Sermon outline notes successfully saved to your profile!"
        )
      );
    } catch (err) {
      alert(
        (err as ApiError).message ||
          bilingual("Không thể lưu ghi chú.", "Could not save sermon notes.")
      );
    } finally {
      setSavingNote(false);
    }
  };

  const handleEmailNotes = async () => {
    if (!currentOutline) return;
    setSendingEmail(true);
    try {
      const res = await apiFetch<{ success: boolean; message: string }>(
        `/sermons/my-notes/${currentOutline.id}/email`,
        { method: "POST" },
      );
      showToast(res.message);
    } catch (err) {
      alert(
        (err as ApiError).message ||
          bilingual("Không thể gửi email.", "Could not send sermon notes email.")
      );
    } finally {
      setSendingEmail(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <span className="text-amber-800 font-serif text-3xl animate-spin select-none">†</span>
        <span className="text-sm font-serif italic text-slate-600">
          {bilingual(
            '"Đang mở cuốn tập ghi chép Lời Chúa ngày Thánh Nhật..."',
            '"Opening Sunday Sermon Notes & Living Word..."'
          )}
        </span>
      </div>
    );
  }

  if (!currentOutline) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-amber-200 space-y-3">
        <BookText className="w-10 h-10 text-amber-700 mx-auto" />
        <h3 className="font-scripture text-lg font-bold text-slate-900">
          {bilingual(
            "Chưa có dàn ý bài giảng nào được xuất bản",
            "No sermon outline published yet"
          )}
        </h3>
        <p className="text-xs text-slate-500">
          {bilingual(
            "Mục sư sẽ cập nhật dàn ý trước giờ thờ phượng Chúa Nhật.",
            "Pastoral staff will publish the sermon outline prior to Sunday service."
          )}
        </p>
      </div>
    );
  }

  const displayTitle = isEn
    ? currentOutline.titleEn || currentOutline.title
    : currentOutline.title;
  const secondaryTitle = isEn
    ? currentOutline.titleEn ? currentOutline.title : null
    : currentOutline.titleEn;

  const displayScripture = isEn
    ? currentOutline.mainScriptureTextEn || currentOutline.mainScriptureTextVi
    : currentOutline.mainScriptureTextVi;
  const secondaryScripture = isEn
    ? currentOutline.mainScriptureTextEn ? currentOutline.mainScriptureTextVi : null
    : currentOutline.mainScriptureTextEn;

  return (
    <div className="space-y-8 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-950 text-white px-5 py-3 rounded-xl shadow-xl border border-amber-400/50 flex items-center gap-2.5 text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Sermon Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-200/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-serif text-amber-800 tracking-wider uppercase mb-1">
            <span>†</span>
            <span>{currentOutline.seriesName}</span>
          </div>
          <h1 className="font-scripture text-3xl font-bold text-slate-900 tracking-tight">
            {displayTitle}
          </h1>
          {secondaryTitle && (
            <p className="text-xs sm:text-sm text-slate-600 font-serif italic mt-0.5">
              {secondaryTitle}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
            <span className="flex items-center gap-1 font-semibold text-slate-800">
              <User className="w-3.5 h-3.5 text-amber-800" />
              <span>{currentOutline.preacherName}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono">
              <Calendar className="w-3.5 h-3.5 text-amber-800" />
              <span>{currentOutline.serviceDate}</span>
            </span>
            <span>•</span>
            <span className="font-medium text-amber-900">{currentOutline.campusId}</span>
          </div>
        </div>

        {/* Outline Switcher Dropdown */}
        <div className="shrink-0 flex items-center gap-2">
          {allOutlines.length > 1 && (
            <select
              value={currentOutline.id}
              onChange={(e) => handleSelectOutline(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-amber-300 text-xs font-semibold text-slate-800 focus:outline-none"
            >
              {allOutlines.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.serviceDate} — {isEn ? (o.titleEn || o.title) : o.title}
                </option>
              ))}
            </select>
          )}

          <TactileButton
            variant="gold"
            size="md"
            onClick={handleSaveNotes}
            disabled={savingNote}
            className="flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>
              {savingNote
                ? bilingual("Đang lưu...", "Saving...")
                : bilingual("Lưu Ghi Chú", "Save Notes")}
            </span>
          </TactileButton>
        </div>
      </div>

      {/* Main Scripture Reference Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50 via-white to-amber-50 border border-amber-200/90 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-serif font-bold text-amber-900 uppercase tracking-widest">
            <span>†</span>
            <span>
              {bilingual("Câu Gốc Nền Tảng:", "Key Scripture Reference:")}{" "}
              {currentOutline.mainScriptureRef}
            </span>
          </div>
          <span className="text-[11px] font-mono text-amber-800 bg-amber-100/60 px-2.5 py-0.5 rounded-full border border-amber-200">
            {bilingual("Kinh Thánh Trọn Bộ", "Complete Scripture")}
          </span>
        </div>

        <p className="font-scripture italic text-base sm:text-lg text-slate-900 leading-relaxed pt-1">
          "{displayScripture}"
        </p>

        {secondaryScripture && (
          <p className="text-xs text-slate-600 font-serif border-t border-amber-100 pt-2">
            "{secondaryScripture}"
          </p>
        )}
      </div>

      {/* Interactive Outline Points with Fill-in-the-Blanks */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookText className="w-5 h-5 text-amber-800" />
            <h2 className="font-scripture text-xl font-bold text-slate-900">
              {bilingual(
                "Dàn Ý Bài Giảng & Điền Khuyết Tương Tác",
                "Interactive Sermon Outline & Fill-in Notes"
              )}
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-serif italic">
            {bilingual(
              "* Điền vào ô trống theo lời giảng của Mục sư",
              "* Fill in blanks as Pastor speaks"
            )}
          </span>
        </div>

        <div className="space-y-6">
          {currentOutline.outlinePoints.map((point) => {
            const rawTemplate = isEn
              ? point.fillInBlankTextEn || point.fillInBlankTextVi
              : point.fillInBlankTextVi;
            const expectedAnswers = isEn
              ? point.blankAnswersEn && point.blankAnswersEn.length
                ? point.blankAnswersEn
                : point.blankAnswersVi
              : point.blankAnswersVi;
            const parts = rawTemplate.split(/\{\{(.*?)\}\}/g);

            const pointTitle = isEn
              ? point.titleEn || point.titleVi
              : point.titleVi;
            const pointSub = isEn
              ? point.titleEn ? point.titleVi : null
              : point.titleEn;
            const pointScriptureText = isEn
              ? point.scriptureTextEn || point.scriptureTextVi
              : point.scriptureTextVi;

            return (
              <div
                key={point.id}
                className="p-6 rounded-2xl bg-white border border-amber-200/80 shadow-xs space-y-4 hover:border-amber-300 transition-all"
              >
                {/* Point Header */}
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-xl bg-indigo-950 text-amber-300 font-bold flex items-center justify-center shrink-0 text-sm shadow-xs">
                    {point.pointNumber}
                  </span>
                  <div>
                    <h3 className="font-scripture text-lg font-bold text-slate-900 leading-snug">
                      {pointTitle}
                    </h3>
                    {pointSub && (
                      <p className="text-xs text-slate-500 font-serif italic mt-0.5">
                        {pointSub}
                      </p>
                    )}
                  </div>
                </div>

                {/* Point Scripture Callout */}
                {point.scriptureRef && (
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-amber-200/60 space-y-1 text-xs">
                    <span className="font-bold text-amber-900 font-serif">
                      {point.scriptureRef}:
                    </span>{" "}
                    <span className="italic text-slate-800 font-scripture">
                      "{pointScriptureText}"
                    </span>
                  </div>
                )}

                {/* Fill-in-the-Blank Sentence */}
                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/70 text-sm text-slate-800 leading-relaxed font-serif">
                  {parts.map((part, pIdx) => {
                    const isBlank = pIdx % 2 === 1;
                    if (!isBlank) {
                      return <span key={pIdx}>{part}</span>;
                    }

                    const blankIdx = Math.floor(pIdx / 2);
                    const key = `${point.id}_${blankIdx}`;
                    const expectedAnswer = expectedAnswers[blankIdx] || part;
                    const currentValue = filledAnswers[key] || "";
                    const isCorrect =
                      currentValue.trim().toLowerCase() === expectedAnswer.trim().toLowerCase();
                    const isRevealed = revealedBlanks[key];

                    return (
                      <span key={pIdx} className="inline-flex items-center gap-1 mx-1.5 my-1">
                        <input
                          type="text"
                          value={isRevealed ? expectedAnswer : currentValue}
                          onChange={(e) => handleAnswerChange(point.id, blankIdx, e.target.value)}
                          placeholder={bilingual("[ điền từ ]", "[ fill word ]")}
                          className={`px-3 py-1 text-xs sm:text-sm font-bold font-sans rounded-lg border text-center transition-all ${
                            isCorrect || isRevealed
                              ? "bg-emerald-50 text-emerald-900 border-emerald-400 ring-2 ring-emerald-300/40"
                              : currentValue
                              ? "bg-white text-indigo-950 border-amber-400"
                              : "bg-white text-slate-800 border-amber-300 border-dashed placeholder:text-slate-400"
                          }`}
                          style={{ width: `${Math.max(10, expectedAnswer.length + 4)}ch` }}
                        />

                        {isCorrect && (
                          <span
                            className="text-emerald-600 text-xs font-bold"
                            title={bilingual("Chính xác!", "Correct!")}
                          >
                            ✓
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleToggleReveal(key)}
                          title={bilingual("Xem gợi ý đáp án", "Reveal answer")}
                          className="p-1 text-slate-400 hover:text-amber-800 cursor-pointer"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    );
                  })}
                </div>

                {/* Personal Reflection Notes for this point */}
                <div>
                  <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                    {bilingual(
                      "Ghi Chú & Cảm Nhận Cá Nhân Của Bạn:",
                      "Personal Notes & Heart Reflections:"
                    )}
                  </label>
                  <textarea
                    rows={2}
                    value={personalNotes[point.id] || ""}
                    onChange={(e) => handlePersonalNoteChange(point.id, e.target.value)}
                    placeholder={bilingual(
                      "Những điều Chúa nhắc nhở bạn qua điểm này...",
                      "What the Holy Spirit is highlighting to you through this point..."
                    )}
                    className="w-full p-3 rounded-xl bg-slate-50/70 border border-amber-200/80 text-xs text-slate-800 focus:outline-none focus:border-indigo-950 font-sans"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Small Group Discussion Questions Guide */}
      {currentOutline.discussionQuestions && currentOutline.discussionQuestions.length > 0 && (
        <section className="p-6 rounded-2xl bg-white border border-amber-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-800" />
            <h2 className="font-scripture text-xl font-bold text-slate-900">
              {bilingual(
                "Câu Hỏi Thảo Luận Nhóm Nhỏ (Life Group Guide)",
                "Small Group Discussion Guide (Life Groups)"
              )}
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            {bilingual(
              "Dành cho buổi sinh hoạt nhóm tế bào trong tuần để đào sâu áp dụng bài giảng:",
              "For weekly small group gatherings to unpack and apply the Sunday message:"
            )}
          </p>

          <div className="space-y-2.5">
            {currentOutline.discussionQuestions.map((q, qIdx) => (
              <div
                key={qIdx}
                className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-slate-800 font-serif leading-relaxed"
              >
                {q}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Post-Sermon Prayer & Faith Commitment */}
      <section className="p-6 rounded-2xl bg-white border border-amber-200/80 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-800" />
          <h2 className="font-scripture text-lg font-bold text-slate-900">
            {bilingual(
              "Lời Cầu Nguyện & Cam Kết Hành Động Sau Bài Giảng",
              "Post-Sermon Prayer & Faith Commitment"
            )}
          </h2>
        </div>
        <textarea
          rows={3}
          value={prayerCommitment}
          onChange={(e) => setPrayerCommitment(e.target.value)}
          placeholder={bilingual(
            "Lạy Chúa, con xin dâng lên Ngài lời cầu nguyện và quyết định thay đổi đời sống con tuần này...",
            "Lord, I surrender this prayer and commit my steps to walking in Your truth this week..."
          )}
          className="w-full p-3.5 rounded-xl bg-[#FAF8F5] border border-amber-200/80 text-xs text-slate-800 focus:outline-none focus:border-indigo-950 font-sans"
        />
      </section>

      {/* Bottom Sticky Action Bar */}
      <div className="sticky bottom-6 z-40 bg-[#FCFBF8]/95 backdrop-blur-md p-4 rounded-2xl border border-amber-300 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-600 font-serif">
          <Sparkles className="w-4 h-4 text-amber-700" />
          <span>
            {bilingual(
              "Ghi chú tự động đồng bộ theo tài khoản của bạn",
              "Notes automatically sync to your personal account"
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl border border-amber-300 hover:bg-amber-50 text-xs font-semibold text-slate-800 flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-800" />
            <span>{bilingual("In Bản Ghi Chú", "Print Notes")}</span>
          </button>

          <button
            onClick={handleEmailNotes}
            disabled={sendingEmail}
            className="px-3.5 py-2 rounded-xl border border-amber-300 hover:bg-amber-50 text-xs font-semibold text-slate-800 flex items-center gap-1.5 cursor-pointer"
          >
            <Mail className="w-4 h-4 text-amber-800" />
            <span>
              {sendingEmail
                ? bilingual("Đang gửi...", "Sending...")
                : bilingual("Gửi Về Email", "Email Notes")}
            </span>
          </button>

          <TactileButton
            variant="gold"
            size="md"
            onClick={handleSaveNotes}
            disabled={savingNote}
            className="flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>
              {savingNote
                ? bilingual("Đang lưu...", "Saving...")
                : bilingual("Lưu Toàn Bộ", "Save All")}
            </span>
          </TactileButton>
        </div>
      </div>
    </div>
  );
}
