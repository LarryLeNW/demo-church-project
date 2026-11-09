"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { BentoCard } from "@/components/ui/bento-card";
import { TactileButton } from "@/components/ui/tactile-button";
import {
  BookOpen,
  Play,
  Clock,
  User,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  X,
  Sparkles,
  Layers,
  Globe2,
} from "lucide-react";

interface LessonSummary {
  id: string;
  title: string;
  duration: number;
  scriptureReference: string | null;
}

interface CourseItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  category: string;
  language: string;
  instructorName: string;
  isPublished: boolean;
  lessonsCount?: number;
  totalDuration?: number;
  lessons?: LessonSummary[];
  createdAt: string;
}

const CATEGORIES = [
  { id: "", vi: "Tất Cả Mục Vụ", en: "All Ministries" },
  { id: "discipleship", vi: "Môn Đồ Hóa", en: "Discipleship" },
  { id: "sermon_archive", vi: "Kho Bài Giảng", en: "Sermon Vault" },
  { id: "theology", vi: "Thần Học Căn Bản", en: "Basic Theology" },
  { id: "leadership", vi: "Lãnh Đạo Tôi Tớ", en: "Servant Leadership" },
  { id: "marriage_family", vi: "Hôn Nhân Gia Đình", en: "Marriage & Family" },
];

const CATEGORY_NAMES: Record<string, { vi: string; en: string }> = {
  discipleship: { vi: "Môn Đồ Hóa", en: "Discipleship" },
  theology: { vi: "Thần Học Cơ Đốc", en: "Christian Theology" },
  sunday_school: { vi: "Trường Chúa Nhật", en: "Sunday School" },
  sermon_archive: { vi: "Kho Bài Giảng", en: "Sermon Vault" },
  leadership: { vi: "Lãnh Đạo Tôi Tớ", en: "Servant Leadership" },
  marriage_family: { vi: "Hôn Nhân Gia Đình", en: "Marriage & Family" },
  youth: { vi: "Thanh Thiếu Niên", en: "Youth Ministry" },
};

export default function CoursesCatalogPage() {
  const { user } = useAuth();
  const { bilingual, isEn } = useLanguage();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");

  // Create Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("discipleship");
  const [newLanguage, setNewLanguage] = useState("vi");
  const [newInstructor, setNewInstructor] = useState("");
  const [newThumbnail, setNewThumbnail] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");

  const isLeaderOrPastor =
    user?.role === "senior_pastor" ||
    user?.role === "admin" ||
    user?.role === "ministry_leader";

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (selectedCategory) params.append("category", selectedCategory);
      if (selectedLanguage) params.append("language", selectedLanguage);
      const queryStr = params.toString() ? `?${params.toString()}` : "";

      const res = await apiFetch<{ items: CourseItem[] }>(`/courses${queryStr}`, {
        auth: false,
      });
      setCourses(res.items || []);
    } catch {
      // offline fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory, selectedLanguage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourses();
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setFormError(bilingual("Vui lòng nhập tiêu đề khóa học.", "Please enter a course title."));
      return;
    }

    setCreating(true);
    setFormError("");
    try {
      await apiFetch("/courses", {
        method: "POST",
        body: JSON.stringify({
          title: newTitle.trim(),
          category: newCategory,
          language: newLanguage,
          instructorName: newInstructor.trim(),
          thumbnailUrl: newThumbnail.trim() || null,
          description: newDescription.trim() || null,
        }),
      });

      setShowCreateModal(false);
      setNewTitle("");
      setNewDescription("");
      setNewThumbnail("");
      fetchCourses();
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message);
      } else {
        setFormError(
          bilingual(
            "Không thể tạo khóa học. Vui lòng thử lại.",
            "Could not create course. Please try again.",
          ),
        );
      }
    } finally {
      setCreating(false);
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return bilingual("0 phút", "0 mins");
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} ${bilingual("phút", "mins")}`;
    const hours = Math.floor(minutes / 60);
    const remMinutes = minutes % 60;
    return remMinutes > 0
      ? `${hours} ${bilingual("giờ", "hrs")} ${remMinutes} ${bilingual("phút", "mins")}`
      : `${hours} ${bilingual("giờ", "hrs")}`;
  };

  return (
    <div className="space-y-8">
      {/* Sacred Grace Hero Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-950 text-white rounded-2xl border border-amber-400/30 shadow-md shadow-indigo-950/20">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-serif uppercase tracking-widest">
            <span>†</span>
            <span>{bilingual("Trang Bị Lời Chúa & Đào Tạo Môn Đồ", "Scripture Equipping & Discipleship")}</span>
          </div>
          <h1 className="font-scripture text-2xl sm:text-3xl font-bold tracking-tight">
            {bilingual("Kho Bài Giảng & Khóa Học Thánh Kinh", "Sermon Vault & Biblical Studies")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            {bilingual(
              '"Hãy chuyên tâm để được đẹp lòng Đức Chúa Trời như người làm công không chỗ trách được, lấy lòng ngay thẳng giảng dạy lời của lẽ thật." — 2 Ti-mô-thê 2:15',
              '"Do your best to present yourself to God as one approved, a worker who does not need to be ashamed and who correctly handles the word of truth." — 2 Timothy 2:15',
            )}
          </p>

          {isLeaderOrPastor && (
            <div className="pt-2">
              <TactileButton
                variant="gold"
                size="md"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                <span>{bilingual("Thêm Khóa Học / Chuỗi Bài Mới", "Add New Course / Sermon Series")}</span>
              </TactileButton>
            </div>
          )}
        </div>

        {/* Subtle Watermark Cross */}
        <div className="absolute right-6 -bottom-6 text-amber-500/10 font-serif text-9xl select-none pointer-events-none">
          †
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Category Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-indigo-950 text-white shadow-xs"
                  : "bg-white text-slate-700 border border-amber-200/70 hover:bg-amber-100/60"
              }`}
            >
              {isEn ? cat.en : cat.vi}
            </button>
          ))}
        </div>

        {/* Search & Language Dropdown */}
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-amber-800 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={bilingual("Tìm theo chủ đề, giảng viên...", "Search by title, instructor...")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-3 bg-white border border-amber-200/80 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
            />
          </form>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="h-10 px-3 bg-white border border-amber-200/80 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
          >
            <option value="">{bilingual("Tất cả ngôn ngữ", "All Languages")}</option>
            <option value="vi">{bilingual("Tiếng Việt", "Vietnamese")}</option>
            <option value="en">{bilingual("Tiếng Anh", "English")}</option>
            <option value="bilingual">{bilingual("Song ngữ", "Bilingual")}</option>
          </select>
        </div>
      </div>

      {/* Course Cards Grid */}
      {loading ? (
        <div className="text-center py-16 space-y-3">
          <span className="text-amber-700 font-serif text-3xl animate-spin select-none inline-block">
            †
          </span>
          <p className="text-xs font-serif italic text-slate-500">
            {bilingual(
              '"Đang chuẩn bị kho tài liệu Lời Chúa..."',
              '"Preparing discipleship archives and God\'s Word..."',
            )}
          </p>
        </div>
      ) : courses.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-amber-200/60 space-y-3">
          <BookOpen className="w-10 h-10 mx-auto text-amber-700/60" />
          <h3 className="font-scripture text-lg font-bold text-slate-900">
            {bilingual("Không tìm thấy khóa học phù hợp", "No matching courses found")}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {bilingual(
              "Hãy thử tìm bằng từ khóa khác hoặc chuyển sang danh mục môn đồ hóa khác.",
              "Try searching with different terms or explore other discipleship categories.",
            )}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-amber-200/70 overflow-hidden shadow-xs hover:shadow-md hover:border-amber-300 transition-all flex flex-col group"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                {course.thumbnailUrl ? (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector('.img-fallback')) {
                        const fallback = document.createElement('div');
                        fallback.className = 'img-fallback w-full h-full bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 flex items-center justify-center';
                        fallback.innerHTML = '<span class="text-amber-300/40 font-serif text-6xl">†</span>';
                        parent.prepend(fallback);
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 flex items-center justify-center">
                    <span className="text-amber-300/40 font-serif text-6xl">†</span>
                  </div>
                )}

                {/* Category Pill Overlay */}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-950/90 text-amber-300 border border-amber-400/30 backdrop-blur-xs">
                    {isEn
                      ? (CATEGORY_NAMES[course.category]?.en || course.category)
                      : (CATEGORY_NAMES[course.category]?.vi || course.category)}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 text-white uppercase backdrop-blur-xs">
                    {course.language === "vi" ? "VI" : course.language === "en" ? "EN" : "Bilingual"}
                  </span>
                </div>
              </div>

              {/* Course Info Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-scripture text-lg font-bold text-slate-900 group-hover:text-indigo-950 line-clamp-2 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {course.description ||
                      bilingual(
                        "Khóa học môn đồ hóa trang bị cho tín hữu.",
                        "Discipleship equipping course for church members.",
                      )}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-amber-100">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-amber-800" />
                      <span className="font-medium text-slate-800">{course.instructorName}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {course.lessonsCount ?? course.lessons?.length ?? 0}{" "}
                        {bilingual("bài giảng", "lessons")}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDuration(course.totalDuration)}</span>
                    </span>
                  </div>

                  <Link href={`/dashboard/courses/${course.slug}`} className="block w-full">
                    <TactileButton variant="primary" size="md" className="w-full">
                      <Play className="w-4 h-4 mr-1.5 fill-amber-300 text-amber-300" />
                      <span>{bilingual("Vào Xem Bài Giảng", "Start Learning / Watch")}</span>
                    </TactileButton>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE COURSE MODAL (Pastor / Leader) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FCFBF8] border border-amber-300/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-amber-200/70 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-amber-800 font-serif font-bold text-xl">†</span>
                <h3 className="font-scripture text-lg font-bold text-slate-900">
                  {bilingual("Thêm Khóa Học / Chuỗi Bài Mới", "Create New Course / Sermon Series")}
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  {bilingual("Tiêu Đề Khóa Học / Loạt Bài Giảng *", "Course Title / Sermon Series *")}
                </label>
                <input
                  type="text"
                  required
                  placeholder={bilingual("Ví dụ: Nền Tảng Đời Sống Cơ Đốc", "e.g. Foundations of Christian Life")}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-amber-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    {bilingual("Chuyên Mục Mục Vụ", "Ministry Category")}
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-amber-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="discipleship">{bilingual("Môn Đồ Hóa (Discipleship)", "Discipleship")}</option>
                    <option value="sermon_archive">{bilingual("Kho Bài Giảng (Sermon Vault)", "Sermon Vault")}</option>
                    <option value="theology">{bilingual("Thần Học Cơ Đốc (Theology)", "Christian Theology")}</option>
                    <option value="leadership">{bilingual("Lãnh Đạo Tôi Tớ (Leadership)", "Servant Leadership")}</option>
                    <option value="marriage_family">{bilingual("Hôn Nhân Gia Đình", "Marriage & Family")}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    {bilingual("Ngôn Ngữ", "Language")}
                  </label>
                  <select
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-amber-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="vi">{bilingual("Tiếng Việt", "Vietnamese")}</option>
                    <option value="en">{bilingual("Tiếng Anh", "English")}</option>
                    <option value="bilingual">{bilingual("Song ngữ Anh - Việt", "Bilingual EN - VI")}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  {bilingual("Mục Sư Giảng Luận / Diễn Giả", "Pastor / Instructor")}
                </label>
                <input
                  type="text"
                  placeholder={bilingual("Ví dụ: Mục Sư Quản Nhiệm John Tran", "e.g. Senior Pastor John Tran")}
                  value={newInstructor}
                  onChange={(e) => setNewInstructor(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-amber-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  {bilingual("Đường Dẫn Hình Ảnh Bìa (Thumbnail URL)", "Course Thumbnail URL")}
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newThumbnail}
                  onChange={(e) => setNewThumbnail(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-amber-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  {bilingual("Mô Tả Tổng Quan", "Course Overview")}
                </label>
                <textarea
                  rows={3}
                  placeholder={bilingual(
                    "Mô tả mục tiêu của khóa học hoặc sứ điệp bài giảng...",
                    "Summary of course syllabus, faith objectives...",
                  )}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-3 bg-white border border-amber-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
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
                    ? bilingual("Đang Khởi Tạo...", "Creating...")
                    : bilingual("Khởi Tạo Khóa Học", "Create Course")}
                </TactileButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
