"use client";

import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { BentoCard } from "@/components/ui/bento-card";
import { TactileButton } from "@/components/ui/tactile-button";
import {
  BookmarkCheck,
  BookOpen,
  Sparkles,
  RotateCw,
  Eye,
  EyeOff,
  Flame,
  CheckCircle2,
  Clock,
  Plus,
  X,
  Volume2,
  Layers,
  ArrowRight,
  Library,
  ChevronRight,
} from "lucide-react";

interface ScriptureMemoryItem {
  id: string;
  reference: string;
  text: string;
  translation: string;
  topic: string;
  intervalDays: number;
  easeFactor: number;
  repetitionCount: number;
  nextReviewDate: string;
  lastReviewedAt: string | null;
  status: string;
  createdAt: string;
}

interface LibraryVerse {
  id: string;
  reference: string;
  referenceEn: string | null;
  textVi: string;
  textEn: string | null;
  defaultTranslation: string;
  topic: string;
}

interface ScriptureStats {
  totalVerses: number;
  dueTodayCount: number;
  masteredCount: number;
  learningCount: number;
}

const TOPIC_LABELS: Record<string, { vi: string; en: string }> = {
  salvation: { vi: "Sự Cứu Rỗi", en: "Salvation" },
  faith: { vi: "Đức Tin", en: "Faith" },
  peace_hope: { vi: "Bình An & Hy Vọng", en: "Peace & Hope" },
  prayer: { vi: "Cầu Nguyện", en: "Prayer" },
  god_love: { vi: "Tình Yêu Của Chúa", en: "God's Love" },
  discipleship: { vi: "Đời Sống Môn Đồ", en: "Discipleship" },
  scripture_power: { vi: "Lời Hằng Sống", en: "Living Word" },
  family: { vi: "Gia Đình Cơ Đốc", en: "Christian Family" },
};

export default function ScriptureMemoryPage() {
  const { user } = useAuth();
  const { bilingual, isEn } = useLanguage();

  // Active view: 'review' | 'library' | 'all'
  const [activeTab, setActiveTab] = useState<"review" | "library" | "all">("review");

  // User Memories
  const [memories, setMemories] = useState<ScriptureMemoryItem[]>([]);
  const [stats, setStats] = useState<ScriptureStats>({
    totalVerses: 0,
    dueTodayCount: 0,
    masteredCount: 0,
    learningCount: 0,
  });
  const [loading, setLoading] = useState(true);

  // Church Library Verses
  const [libraryVerses, setLibraryVerses] = useState<LibraryVerse[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);

  // Review Flashcard State
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [maskMode, setMaskMode] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewLanguage, setReviewLanguage] = useState<"vi" | "en">("vi");

  // Add Custom Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [customRef, setCustomRef] = useState("");
  const [customText, setCustomText] = useState("");
  const [customTopic, setCustomTopic] = useState("salvation");
  const [customTrans, setCustomTrans] = useState("rvv11");
  const [addingCustom, setAddingCustom] = useState(false);
  const [addError, setAddError] = useState("");

  const loadMemories = async () => {
    setLoading(true);
    try {
      const res = await apiFetch<{
        items: ScriptureMemoryItem[];
        stats: ScriptureStats;
      }>("/scripture/my-memories");
      setMemories(res.items || []);
      setStats(res.stats);
    } catch {
      // offline fallback
    } finally {
      setLoading(false);
    }
  };

  const loadLibrary = async () => {
    setLoadingLibrary(true);
    try {
      const res = await apiFetch<LibraryVerse[]>("/scripture/library", {
        auth: false,
      });
      setLibraryVerses(res || []);
    } catch {
      // fallback
    } finally {
      setLoadingLibrary(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadMemories();
    }
    loadLibrary();
  }, [user]);

  // Verses due for review today
  const dueVerses = memories.filter(
    (m) => new Date(m.nextReviewDate) <= new Date(),
  );

  const activeCard = dueVerses[currentReviewIndex] || memories[0];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSM2Review = async (rating: number) => {
    if (!activeCard) return;

    setIsSubmittingReview(true);
    try {
      await apiFetch(`/scripture/memories/${activeCard.id}/review`, {
        method: "POST",
        body: JSON.stringify({ rating }),
      });

      setIsFlipped(false);
      setMaskMode(false);

      if (currentReviewIndex < dueVerses.length - 1) {
        setCurrentReviewIndex((prev) => prev + 1);
      } else {
        setCurrentReviewIndex(0);
      }

      loadMemories();
    } catch {
      // error
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleAddFromLibrary = async (verse: LibraryVerse, lang: "vi" | "en") => {
    try {
      const text = lang === "vi" ? verse.textVi : verse.textEn || verse.textVi;
      const ref = lang === "vi" ? verse.reference : verse.referenceEn || verse.reference;
      const translation = lang === "vi" ? "rvv11" : "esv";

      await apiFetch("/scripture/memories", {
        method: "POST",
        body: JSON.stringify({
          verseId: verse.id,
          reference: ref,
          text,
          translation,
          topic: verse.topic,
        }),
      });

      loadMemories();
      setActiveTab("review");
    } catch {
      // ignore
    }
  };

  const handleAddCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRef.trim() || !customText.trim()) {
      setAddError(
        bilingual(
          "Vui lòng nhập phân đoạn và nội dung câu gốc.",
          "Please enter scripture reference and verse text."
        )
      );
      return;
    }

    setAddingCustom(true);
    setAddError("");
    try {
      await apiFetch("/scripture/memories", {
        method: "POST",
        body: JSON.stringify({
          reference: customRef.trim(),
          text: customText.trim(),
          translation: customTrans,
          topic: customTopic,
        }),
      });

      setShowAddModal(false);
      setCustomRef("");
      setCustomText("");
      loadMemories();
      setActiveTab("review");
    } catch (err) {
      if (err instanceof ApiError) {
        setAddError(err.message);
      } else {
        setAddError(
          bilingual("Không thể thêm câu gốc.", "Could not add scripture memory verse.")
        );
      }
    } finally {
      setAddingCustom(false);
    }
  };

  // Mask words for practice: masks every 3rd word
  const renderMaskedText = (text: string) => {
    if (!maskMode) return text;
    const words = text.split(" ");
    return words
      .map((word, i) => (i % 3 === 1 ? "______" : word))
      .join(" ");
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
                "Khắc Ghi Lời Chúa Vào Lòng • Thuật Toán SuperMemo SM-2",
                "Inscribing God's Word in Hearts • SuperMemo SM-2 Algorithm"
              )}
            </span>
          </div>
          <h1 className="font-scripture text-2xl sm:text-3xl font-bold tracking-tight">
            {bilingual(
              "Ghi Nhớ Câu Gốc Lời Chúa (Scripture Memory SRS)",
              "Scripture Memory System (SRS Spaced Repetition)"
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            {bilingual(
              '"Tôi đã giấu Lời Chúa trong lòng tôi, để tôi không phạm tội cùng Ngài." — Thi Thiên 119:11',
              '"I have hidden your word in my heart that I might not sin against you." — Psalm 119:11'
            )}
          </p>

          {/* Spaced Repetition Stats Ribbon */}
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-amber-300/30 text-xs flex items-center gap-2 backdrop-blur-xs">
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>
                {bilingual("Tổng Số:", "Total Verses:")} <strong>{stats.totalVerses}</strong>{" "}
                {bilingual("câu", "verses")}
              </span>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/50 text-xs flex items-center gap-2 backdrop-blur-xs text-amber-200">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>
                {bilingual("Cần Ôn Hôm Nay:", "Due Today:")} <strong>{stats.dueTodayCount}</strong>{" "}
                {bilingual("câu", "verses")}
              </span>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-xs flex items-center gap-2 backdrop-blur-xs text-emerald-200">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>
                {bilingual("Đã Thuộc Lòng:", "Mastered:")} <strong>{stats.masteredCount}</strong>{" "}
                {bilingual("câu", "verses")}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute right-6 -bottom-8 text-amber-500/10 font-serif text-9xl select-none pointer-events-none">
          †
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/70 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("review")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "review"
                ? "bg-indigo-950 text-white shadow-xs"
                : "bg-white text-slate-700 border border-amber-200 hover:bg-amber-50"
            }`}
          >
            <BookmarkCheck className="w-4 h-4 text-amber-400" />
            <span>
              {bilingual(
                `Thẻ Flashcard Ôn Tập (${dueVerses.length})`,
                `Flashcard Review (${dueVerses.length})`
              )}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("library")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "library"
                ? "bg-indigo-950 text-white shadow-xs"
                : "bg-white text-slate-700 border border-amber-200 hover:bg-amber-50"
            }`}
          >
            <Library className="w-4 h-4 text-amber-700" />
            <span>
              {bilingual(
                `Thư Viện Câu Gốc Hội Thánh (${libraryVerses.length})`,
                `Church Verse Library (${libraryVerses.length})`
              )}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-indigo-950 text-white shadow-xs"
                : "bg-white text-slate-700 border border-amber-200 hover:bg-amber-50"
            }`}
          >
            <Layers className="w-4 h-4 text-amber-700" />
            <span>
              {bilingual(
                `Tất Cả Câu Gốc Của Tôi (${memories.length})`,
                `My Memorized Verses (${memories.length})`
              )}
            </span>
          </button>
        </div>

        <TactileButton
          variant="gold"
          size="sm"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          <span>{bilingual("Tự Thêm Câu Gốc", "Add Custom Verse")}</span>
        </TactileButton>
      </div>

      {/* TAB 1: 3D FLASHCARD SM-2 REVIEW SESSION */}
      {activeTab === "review" && (
        <div className="max-w-2xl mx-auto space-y-6">
          {dueVerses.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-amber-200/80 shadow-xs space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <h3 className="font-scripture text-xl font-bold text-slate-900">
                  {bilingual(
                    "Tạ Ơn Chúa! Bạn Đã Hoàn Thành Lượt Ôn Hôm Nay",
                    "Praise the Lord! Daily Review Complete"
                  )}
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto font-serif">
                  {bilingual(
                    "Tất cả các câu gốc đến hạn đã được ôn tập xong theo thuật toán ngắt quãng SM-2. Hãy quay lại vào ngày mai để củng cố trí nhớ dài hạn!",
                    "All scheduled verses have been reviewed using SM-2 spaced repetition. Return tomorrow to reinforce your long-term memory!"
                  )}
                </p>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <TactileButton
                  variant="secondary"
                  size="md"
                  onClick={() => setActiveTab("library")}
                >
                  <Library className="w-4 h-4 mr-1.5 text-indigo-950" />
                  <span>
                    {bilingual(
                      "Chọn Thêm Câu Gốc Từ Thư Viện",
                      "Explore Church Verse Library"
                    )}
                  </span>
                </TactileButton>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Card Header & Controls */}
              <div className="flex items-center justify-between text-xs text-slate-500 font-serif px-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-900">
                    {bilingual(
                      `Câu ${currentReviewIndex + 1} / ${dueVerses.length}`,
                      `Verse ${currentReviewIndex + 1} of ${dueVerses.length}`
                    )}
                  </span>
                  <span>•</span>
                  <span>
                    {TOPIC_LABELS[activeCard.topic]?.[isEn ? "en" : "vi"] || activeCard.topic}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMaskMode(!maskMode)}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                      maskMode
                        ? "bg-amber-100 text-amber-900 border-amber-300"
                        : "bg-white text-slate-600 border-amber-200 hover:bg-amber-50"
                    }`}
                  >
                    {maskMode ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>
                      {maskMode
                        ? bilingual("Hiện Hết Chữ", "Show All Words")
                        : bilingual("Luyện Che Từ", "Mask Words Practice")}
                    </span>
                  </button>
                </div>
              </div>

              {/* 3D Sacred Grace Flashcard Container */}
              <div
                onClick={handleFlip}
                className="group relative cursor-pointer min-h-[300px] sm:min-h-[340px] bg-[#FCFBF8] rounded-3xl border-2 border-amber-300/90 shadow-md hover:shadow-lg hover:border-amber-400 p-8 flex flex-col justify-between transition-all select-none overflow-hidden"
              >
                {/* Watermark Cross */}
                <div className="absolute right-6 top-6 text-amber-600/10 font-serif text-8xl pointer-events-none select-none">
                  †
                </div>

                <div className="space-y-4">
                  {/* Topic & Translation Tag */}
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100/80 text-amber-900 border border-amber-300">
                      {TOPIC_LABELS[activeCard.topic]?.[isEn ? "en" : "vi"] || activeCard.topic}
                    </span>
                    <span className="text-[11px] font-bold uppercase text-slate-400 font-serif">
                      {bilingual("Bản Dịch:", "Translation:")} {activeCard.translation.toUpperCase()}
                    </span>
                  </div>

                  {/* Reference & Question */}
                  <div className="space-y-2 pt-2">
                    <h2 className="font-scripture text-2xl sm:text-3xl font-bold text-slate-900">
                      {activeCard.reference}
                    </h2>

                    {!isFlipped ? (
                      <p className="text-xs sm:text-sm text-slate-500 font-serif italic pt-4">
                        {bilingual(
                          '"Hãy nhẩm lại toàn bộ câu gốc trong tâm trí bạn... sau đó bấm vào thẻ để xem đáp án Lời Chúa."',
                          '"Recite the verse in your mind... then tap the card to verify against God\'s Word."'
                        )}
                      </p>
                    ) : (
                      <blockquote className="font-scripture text-lg sm:text-xl text-slate-900 font-medium leading-relaxed pt-2">
                        "{renderMaskedText(activeCard.text)}"
                      </blockquote>
                    )}
                  </div>
                </div>

                {/* Flip Indicator */}
                <div className="pt-4 border-t border-amber-200/60 flex items-center justify-between text-xs text-amber-900 font-serif">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <RotateCw className="w-3.5 h-3.5 text-amber-700" />
                    <span>
                      {isFlipped
                        ? bilingual("Bấm để ẩn đáp án", "Tap to hide answer")
                        : bilingual("Bấm thẻ để lật xem câu gốc", "Tap card to flip and verify")}
                    </span>
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {bilingual(
                      `Chu kỳ: ${activeCard.intervalDays} ngày`,
                      `Interval: ${activeCard.intervalDays} days`
                    )}
                  </span>
                </div>
              </div>

              {/* SM-2 Recall Rating Buttons (Visible when flipped) */}
              {isFlipped && (
                <div className="p-5 bg-white rounded-2xl border border-amber-200/80 shadow-xs space-y-3 animate-fadeIn">
                  <div className="text-center">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-serif">
                      {bilingual(
                        "Đánh Giá Khả Năng Thuộc Lòng Của Bạn:",
                        "Rate Your Recall Ability:"
                      )}
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {/* Rating 1: Again */}
                    <button
                      type="button"
                      disabled={isSubmittingReview}
                      onClick={() => handleSM2Review(1)}
                      className="p-3 rounded-xl border border-rose-300 bg-rose-50/70 hover:bg-rose-100/80 text-rose-900 text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer shadow-xs"
                    >
                      <span>{bilingual("🔴 Quên / Khó", "🔴 Again")}</span>
                      <span className="text-[10px] font-normal text-rose-700">
                        {bilingual("Ôn lại ngày mai", "Repeat tomorrow")}
                      </span>
                    </button>

                    {/* Rating 3: Hard */}
                    <button
                      type="button"
                      disabled={isSubmittingReview}
                      onClick={() => handleSM2Review(3)}
                      className="p-3 rounded-xl border border-amber-300 bg-amber-50/70 hover:bg-amber-100/80 text-amber-950 text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer shadow-xs"
                    >
                      <span>{bilingual("🟠 Ngập Ngừng", "🟠 Hard")}</span>
                      <span className="text-[10px] font-normal text-amber-800">
                        {bilingual("Ôn sau 2-3 ngày", "Review in 2-3 days")}
                      </span>
                    </button>

                    {/* Rating 4: Good */}
                    <button
                      type="button"
                      disabled={isSubmittingReview}
                      onClick={() => handleSM2Review(4)}
                      className="p-3 rounded-xl border border-indigo-300 bg-indigo-50/70 hover:bg-indigo-100/80 text-indigo-950 text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer shadow-xs"
                    >
                      <span>{bilingual("🟢 Nhớ Tốt", "🟢 Good")}</span>
                      <span className="text-[10px] font-normal text-indigo-800">
                        {bilingual("Ôn sau 6 ngày", "Review in 6 days")}
                      </span>
                    </button>

                    {/* Rating 5: Easy */}
                    <button
                      type="button"
                      disabled={isSubmittingReview}
                      onClick={() => handleSM2Review(5)}
                      className="p-3 rounded-xl border border-emerald-400 bg-emerald-50/90 hover:bg-emerald-100 text-emerald-950 text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer shadow-xs"
                    >
                      <span>{bilingual("🔵 Nhuần Nhuyễn", "🔵 Easy")}</span>
                      <span className="text-[10px] font-normal text-emerald-800">
                        {bilingual("Ôn sau 14+ ngày", "Review in 14+ days")}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CHURCH SCRIPTURE LIBRARY */}
      {activeTab === "library" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-scripture text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="text-amber-800 font-serif">†</span>
                <span>
                  {bilingual(
                    "Thư Viện Câu Gốc Nền Tảng Hội Thánh",
                    "Church Scripture Foundation Library"
                  )}
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-serif mt-0.5">
                {bilingual(
                  "Các câu gốc song ngữ căn bản trang bị cho môn đồ và gia đình Cơ Đốc",
                  "Essential bilingual scripture verses equipping disciples and Christian families"
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {libraryVerses.map((verse) => {
              const alreadyAdded = memories.some(
                (m) =>
                  m.reference.toLowerCase() === verse.reference.toLowerCase() ||
                  (verse.referenceEn &&
                    m.reference.toLowerCase() === verse.referenceEn.toLowerCase()),
              );

              const displayRef = isEn
                ? verse.referenceEn || verse.reference
                : verse.reference;

              const secondaryRef = isEn
                ? verse.referenceEn ? verse.reference : null
                : verse.referenceEn;

              const primaryText = isEn
                ? verse.textEn || verse.textVi
                : verse.textVi;

              const secondaryText = isEn
                ? verse.textEn ? verse.textVi : null
                : verse.textEn;

              return (
                <div
                  key={verse.id}
                  className="bg-white rounded-2xl border border-amber-200/80 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-300 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                        {TOPIC_LABELS[verse.topic]?.[isEn ? "en" : "vi"] || verse.topic}
                      </span>
                      {alreadyAdded && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {bilingual("✓ Đang Học", "✓ In Practice")}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-scripture text-lg font-bold text-slate-900">
                        {displayRef}
                      </h3>
                      {secondaryRef && (
                        <span className="text-xs text-slate-400 font-serif">
                          {secondaryRef}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif bg-[#FCFBF8] p-3 rounded-xl border border-amber-100">
                      "{primaryText}"
                    </p>

                    {secondaryText && (
                      <p className="text-[11px] text-slate-500 italic font-serif">
                        "{secondaryText}"
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-amber-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      disabled={alreadyAdded}
                      onClick={() => handleAddFromLibrary(verse, "vi")}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        alreadyAdded
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-indigo-950 text-white hover:bg-indigo-900 shadow-xs"
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-300" />
                      <span>
                        {alreadyAdded
                          ? bilingual("Đã Trong Lộ Trình", "In Your Plan")
                          : bilingual("+ Học Bản RVV11", "+ Learn RVV11")}
                      </span>
                    </button>

                    {verse.textEn && !alreadyAdded && (
                      <button
                        type="button"
                        onClick={() => handleAddFromLibrary(verse, "en")}
                        className="py-2 px-3 rounded-xl border border-amber-200 bg-white hover:bg-amber-50 text-indigo-950 text-xs font-semibold shadow-xs cursor-pointer"
                      >
                        <span>{bilingual("Học Tiếng Anh", "Learn English")}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: ALL USER MEMORIES TABLE */}
      {activeTab === "all" && (
        <div className="bg-white rounded-2xl border border-amber-200/80 shadow-xs overflow-hidden">
          <div className="p-4 bg-[#FCFBF8] border-b border-amber-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-amber-800 font-serif font-bold">†</span>
              <h3 className="font-scripture text-sm font-bold text-slate-900">
                {bilingual(
                  `Toàn Bộ Lộ Trình Ghi Nhớ Của Bạn (${memories.length})`,
                  `All Your Memorized Verses (${memories.length})`
                )}
              </h3>
            </div>
          </div>

          <div className="divide-y divide-amber-100/60">
            {memories.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                {bilingual(
                  "Chưa có câu gốc nào. Hãy chọn từ Thư Viện để bắt đầu!",
                  "No verses in your plan yet. Select verses from the Library to begin!"
                )}
              </div>
            ) : (
              memories.map((m) => {
                const isDue = new Date(m.nextReviewDate) <= new Date();

                return (
                  <div
                    key={m.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FCFBF8] transition-colors"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="font-scripture font-bold text-sm text-slate-900">
                          {m.reference}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                          {m.translation}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            m.status === "mastered"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-indigo-50 text-indigo-950 border-indigo-200"
                          }`}
                        >
                          {m.status === "mastered"
                            ? bilingual("✨ Đã Thuộc", "✨ Mastered")
                            : bilingual("Đang Ôn Luyện", "In Progress")}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 font-serif line-clamp-2">
                        "{m.text}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right text-xs">
                        <div
                          className={`font-semibold ${
                            isDue ? "text-amber-800 font-bold" : "text-slate-500"
                          }`}
                        >
                          {isDue
                            ? bilingual("⚡ Đến hạn ôn hôm nay", "⚡ Due for review today")
                            : bilingual(`Ôn sau ${m.intervalDays} ngày`, `Review in ${m.intervalDays} days`)}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {bilingual(
                            `Đã ôn ${m.repetitionCount} lần`,
                            `Reviewed ${m.repetitionCount} times`
                          )}
                        </div>
                      </div>

                      {isDue && (
                        <button
                          type="button"
                          onClick={() => setActiveTab("review")}
                          className="px-3 py-1.5 rounded-xl bg-indigo-950 text-white text-xs font-semibold shadow-xs cursor-pointer"
                        >
                          {bilingual("Ôn Ngay", "Review Now")}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* CUSTOM VERSE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FCFBF8] border border-amber-300/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-amber-200/70 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-amber-800 font-serif font-bold text-xl">†</span>
                <h3 className="font-scripture text-lg font-bold text-slate-900">
                  {bilingual(
                    "Thêm Câu Gốc Cá Nhân Vào Lộ Trình",
                    "Add Custom Verse to Memory Plan"
                  )}
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                {addError}
              </div>
            )}

            <form onSubmit={handleAddCustom} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  {bilingual(
                    "Phân Đoạn Kinh Thánh (Ví dụ: Giăng 14:6 hoặc Romans 12:2) *",
                    "Scripture Reference (e.g., John 14:6 or Romans 12:2) *"
                  )}
                </label>
                <input
                  type="text"
                  required
                  placeholder={bilingual("Ví dụ: Giăng 14:6", "e.g., John 14:6")}
                  value={customRef}
                  onChange={(e) => setCustomRef(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-amber-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    {bilingual("Chủ Đề", "Topic")}
                  </label>
                  <select
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-amber-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="salvation">{bilingual("Sự Cứu Rỗi", "Salvation")}</option>
                    <option value="faith">{bilingual("Đức Tin", "Faith")}</option>
                    <option value="peace_hope">{bilingual("Bình An & Hy Vọng", "Peace & Hope")}</option>
                    <option value="prayer">{bilingual("Cầu Nguyện", "Prayer")}</option>
                    <option value="discipleship">{bilingual("Đời Sống Môn Đồ", "Discipleship")}</option>
                    <option value="family">{bilingual("Gia Đình Cơ Đốc", "Christian Family")}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    {bilingual("Bản Dịch", "Translation")}
                  </label>
                  <select
                    value={customTrans}
                    onChange={(e) => setCustomTrans(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-amber-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="rvv11">
                      {bilingual("Bản Truyền Thống RVV11 (Tiếng Việt)", "Vietnamese RVV11 (Traditional)")}
                    </option>
                    <option value="niv">NIV (English)</option>
                    <option value="esv">ESV (English)</option>
                    <option value="kjv">KJV (English)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  {bilingual("Toàn Văn Lời Chúa Cần Ghi Nhớ *", "Full Scripture Text *")}
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder={bilingual(
                    "Ví dụ: Đức Chúa Jêsus phán rằng: Ta là đường đi, chân lý và sự sống; chẳng bởi Ta thì không ai đến được cùng Cha.",
                    'e.g., Jesus answered, "I am the way and the truth and the life. No one comes to the Father except through me."'
                  )}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full p-3 bg-white border border-amber-200/80 rounded-xl text-xs text-slate-900 font-serif focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
                >
                  {bilingual("Hủy Bỏ", "Cancel")}
                </button>
                <TactileButton variant="primary" size="md" type="submit" disabled={addingCustom}>
                  {addingCustom
                    ? bilingual("Đang Thêm...", "Adding...")
                    : bilingual("Thêm Vào Lộ Trình", "Add to Plan")}
                </TactileButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
