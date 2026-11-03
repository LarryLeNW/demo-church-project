"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { TactileButton } from "@/components/ui/tactile-button";
import { BentoCard } from "@/components/ui/bento-card";
import {
  BookOpen,
  ArrowLeft,
  Play,
  CheckCircle2,
  Circle,
  Clock,
  Download,
  HelpCircle,
  FileText,
  Save,
  Plus,
  X,
  Share2,
  Sparkles,
  User,
} from "lucide-react";

interface Lesson {
  id: string;
  courseId: string;
  title: string;
  slug: string;
  videoUrl: string | null;
  duration: number;
  scriptureReference: string | null;
  studyGuidePdfUrl: string | null;
  discussionQuestions: string[] | null;
  orderIndex: number;
}

interface CourseDetails {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  category: string;
  language: string;
  instructorName: string;
  lessons: Lesson[];
}

interface UserProgress {
  completedLessonsCount: number;
  totalLessonsCount: number;
  percentComplete: number;
  progressMap: Record<
    string,
    {
      isCompleted: boolean;
      notes: string | null;
      completedAt: string | null;
    }
  >;
}

export default function CourseClassroomPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const { user } = useAuth();
  const { bilingual, isEn } = useLanguage();

  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Notes state
  const [notes, setNotes] = useState<string>("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSavedSuccess, setNotesSavedSuccess] = useState(false);

  // Mark completion state
  const [togglingCompletion, setTogglingCompletion] = useState(false);

  // Add Lesson Modal
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [lessonTitle, setLessonTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [scriptureRef, setScriptureRef] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [questionsText, setQuestionsText] = useState("");
  const [addingLesson, setAddingLesson] = useState(false);
  const [addLessonError, setAddLessonError] = useState("");

  const isLeaderOrPastor =
    user?.role === "senior_pastor" ||
    user?.role === "admin" ||
    user?.role === "ministry_leader";

  const loadCourseData = async () => {
    setLoading(true);
    setError(null);
    try {
      const courseData = await apiFetch<CourseDetails>(
        `/courses/${resolvedParams.slug}`,
        { auth: false },
      );
      setCourse(courseData);

      if (courseData.lessons && courseData.lessons.length > 0) {
        setActiveLesson(courseData.lessons[0]);
      }

      if (user) {
        try {
          const progData = await apiFetch<UserProgress>(
            `/courses/${courseData.id}/my-progress`,
          );
          setProgress(progData);

          if (
            courseData.lessons &&
            courseData.lessons[0] &&
            progData.progressMap[courseData.lessons[0].id]
          ) {
            setNotes(progData.progressMap[courseData.lessons[0].id].notes || "");
          }
        } catch {
          // Progress fetch is non-blocking
        }
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(
          bilingual(
            "Không thể tải thông tin khóa học.",
            "Could not load course information.",
          ),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourseData();
  }, [resolvedParams.slug]);

  // Switch active lesson
  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    const existingNotes = progress?.progressMap[lesson.id]?.notes || "";
    setNotes(existingNotes);
    setNotesSavedSuccess(false);
  };

  // Save Notes
  const handleSaveNotes = async () => {
    if (!activeLesson) return;
    setSavingNotes(true);
    try {
      await apiFetch(`/courses/lessons/${activeLesson.id}/progress`, {
        method: "POST",
        body: JSON.stringify({
          notes,
        }),
      });

      // Update local progress state
      setProgress((prev) => {
        if (!prev) return prev;
        const currentProg = prev.progressMap[activeLesson.id] || {
          isCompleted: false,
          notes: "",
          completedAt: null,
        };
        return {
          ...prev,
          progressMap: {
            ...prev.progressMap,
            [activeLesson.id]: {
              ...currentProg,
              notes,
            },
          },
        };
      });

      setNotesSavedSuccess(true);
      setTimeout(() => setNotesSavedSuccess(false), 3000);
    } catch {
      // error saving
    } finally {
      setSavingNotes(false);
    }
  };

  // Toggle Completion
  const handleToggleCompletion = async () => {
    if (!activeLesson) return;
    const isCurrentlyCompleted =
      progress?.progressMap[activeLesson.id]?.isCompleted || false;
    const newCompletedStatus = !isCurrentlyCompleted;

    setTogglingCompletion(true);
    try {
      await apiFetch(`/courses/lessons/${activeLesson.id}/progress`, {
        method: "POST",
        body: JSON.stringify({
          isCompleted: newCompletedStatus,
        }),
      });

      // Refresh course progress
      if (course) {
        const progData = await apiFetch<UserProgress>(
          `/courses/${course.id}/my-progress`,
        );
        setProgress(progData);
      }
    } catch {
      // error toggling
    } finally {
      setTogglingCompletion(false);
    }
  };

  // Add Lesson
  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course || !lessonTitle.trim()) return;

    setAddingLesson(true);
    setAddLessonError("");

    const discussionQuestions = questionsText
      .split("\n")
      .map((q) => q.trim())
      .filter((q) => q.length > 0);

    try {
      await apiFetch(`/courses/${course.id}/lessons`, {
        method: "POST",
        body: JSON.stringify({
          title: lessonTitle.trim(),
          videoUrl: videoUrl.trim() || null,
          duration: durationMinutes * 60,
          scriptureReference: scriptureRef.trim() || null,
          studyGuidePdfUrl: pdfUrl.trim() || null,
          discussionQuestions:
            discussionQuestions.length > 0 ? discussionQuestions : null,
          orderIndex: (course.lessons?.length || 0) + 1,
        }),
      });

      setShowAddLessonModal(false);
      setLessonTitle("");
      setVideoUrl("");
      setScriptureRef("");
      setPdfUrl("");
      setQuestionsText("");
      loadCourseData();
    } catch (err) {
      if (err instanceof ApiError) {
        setAddLessonError(err.message);
      } else {
        setAddLessonError(
          bilingual("Không thể thêm bài học.", "Could not add lesson."),
        );
      }
    } finally {
      setAddingLesson(false);
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return bilingual("0 phút", "0 mins");
    const minutes = Math.floor(seconds / 60);
    return `${minutes} ${bilingual("phút", "mins")}`;
  };

  if (loading) {
    return (
      <div className="text-center py-24 space-y-3">
        <span className="text-amber-700 font-serif text-3xl animate-spin select-none inline-block">
          †
        </span>
        <p className="text-xs font-serif italic text-slate-500">
          {bilingual(
            '"Đang mở giảng đường trực tuyến..."',
            '"Opening online classroom & discipleship hall..."',
          )}
        </p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-amber-200/60 space-y-4 max-w-lg mx-auto">
        <BookOpen className="w-12 h-12 mx-auto text-amber-700" />
        <h2 className="font-scripture text-xl font-bold text-slate-900">
          {bilingual("Không Tìm Thấy Khóa Học", "Course Not Found")}
        </h2>
        <p className="text-xs text-slate-600">
          {error ||
            bilingual(
              "Khóa học này không tồn tại hoặc đã gỡ xuống.",
              "This course does not exist or has been unpublished.",
            )}
        </p>
        <Link href="/dashboard/courses">
          <TactileButton variant="primary" size="md">
            {bilingual("Quay lại Kho Bài Giảng", "Back to Sermon Vault")}
          </TactileButton>
        </Link>
      </div>
    );
  }

  const isCurrentCompleted =
    activeLesson && progress?.progressMap[activeLesson.id]?.isCompleted;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Course Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200/70 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/courses"
            className="p-2 rounded-xl bg-white border border-amber-200/80 text-slate-600 hover:text-indigo-950 hover:bg-amber-50 shadow-xs transition-all cursor-pointer"
            title={bilingual("Quay lại danh mục", "Back to catalog")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-amber-800 uppercase tracking-wider font-serif">
              <span>{bilingual("† Khóa Học & Bài Giảng", "† Discipleship & Courses")}</span>
              <span>•</span>
              <span>{course.instructorName}</span>
            </div>
            <h1 className="font-scripture text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {course.title}
            </h1>
          </div>
        </div>

        {isLeaderOrPastor && (
          <TactileButton
            variant="gold"
            size="sm"
            onClick={() => setShowAddLessonModal(true)}
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>{bilingual("Thêm Bài Học Mới", "Add New Lesson")}</span>
          </TactileButton>
        )}
      </div>

      {/* Main 2-Column Classroom Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2/3): Video Player, Scripture, Discussion, Notes */}
        <div className="lg:col-span-2 space-y-6">
          {activeLesson ? (
            <>
              {/* Responsive 16:9 Video Player Frame */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-amber-400/40 shadow-md">
                {activeLesson.videoUrl ? (
                  <iframe
                    src={activeLesson.videoUrl}
                    title={activeLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900">
                    <span className="text-amber-300 font-serif text-5xl mb-2">†</span>
                    <p className="text-sm font-scripture text-white">
                      {bilingual(
                        "Bài Giảng Đang Được Cập Nhật Video",
                        "Sermon Video Updating Soon",
                      )}
                    </p>
                    <p className="text-xs text-amber-200/70 mt-1">
                      {bilingual(
                        "Hãy đọc phân đoạn Lời Chúa và câu hỏi thảo luận bên dưới",
                        "Please review the Scripture foundation and discussion questions below",
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Lesson Action Bar */}
              <div className="p-5 bg-white rounded-2xl border border-amber-200/70 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      {bilingual("Bài", "Lesson")} {activeLesson.orderIndex}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDuration(activeLesson.duration)}
                    </span>
                  </div>
                  <h2 className="font-scripture text-lg font-bold text-slate-900">
                    {activeLesson.title}
                  </h2>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <TactileButton
                    variant={isCurrentCompleted ? "gold" : "primary"}
                    size="md"
                    onClick={handleToggleCompletion}
                    disabled={togglingCompletion}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    <span>
                      {isCurrentCompleted
                        ? bilingual("Đã Hoàn Thành", "Completed")
                        : bilingual("Đánh Dấu Hoàn Thành", "Mark Completed")}
                    </span>
                  </TactileButton>
                </div>
              </div>

              {/* Scripture Reference Card */}
              {activeLesson.scriptureReference && (
                <div className="p-5 bg-[#FCFBF8] rounded-2xl border border-amber-300/80 shadow-xs space-y-2 relative overflow-hidden">
                  <div className="absolute top-2 right-4 text-amber-600/10 font-serif text-7xl select-none pointer-events-none">
                    †
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider font-serif">
                    <BookOpen className="w-4 h-4 text-amber-800" />
                    <span>{bilingual("Nền Tảng Lời Chúa (Scripture Foundation)", "Scripture Foundation")}</span>
                  </div>
                  <blockquote className="font-scripture text-base sm:text-lg text-slate-900 italic font-semibold leading-relaxed">
                    "{activeLesson.scriptureReference}"
                  </blockquote>
                  <p className="text-xs text-slate-600 font-serif">
                    {bilingual(
                      "Mở Kinh Thánh để cùng suy ngẫm trong suốt thời gian lắng nghe sứ điệp bài giảng.",
                      "Open your Bible to follow along and meditate throughout this sermon message.",
                    )}
                  </p>
                </div>
              )}

              {/* Cell Group Discussion Questions */}
              {activeLesson.discussionQuestions && activeLesson.discussionQuestions.length > 0 && (
                <div className="p-6 bg-white rounded-2xl border border-amber-200/70 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-amber-100 pb-3">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-indigo-950" />
                      <h3 className="font-scripture text-base font-bold text-slate-900">
                        {bilingual(
                          "Câu Hỏi Thảo Luận Nhóm Nhỏ / Life Group",
                          "Life Group Discussion Questions",
                        )}
                      </h3>
                    </div>
                    <span className="text-xs text-amber-800 font-serif">
                      {activeLesson.discussionQuestions.length} {bilingual("câu hỏi", "questions")}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {activeLesson.discussionQuestions.map((q, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FCFBF8] border border-amber-100/80"
                      >
                        <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-950 text-white font-serif font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                          {q}
                        </p>
                      </div>
                    ))}
                  </div>

                  {activeLesson.studyGuidePdfUrl && (
                    <div className="pt-2">
                      <a
                        href={activeLesson.studyGuidePdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100/70 text-amber-900 border border-amber-200 text-xs font-semibold shadow-xs transition-all"
                      >
                        <Download className="w-4 h-4 text-amber-800" />
                        <span>{bilingual("Tải Tài Liệu Hướng Dẫn Thảo Luận (PDF Guide)", "Download Discussion Guide (PDF)")}</span>
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Personal Sermon Notes Box */}
              <div className="p-6 bg-white rounded-2xl border border-amber-200/70 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-amber-100 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-800" />
                    <div>
                      <h3 className="font-scripture text-base font-bold text-slate-900">
                        {bilingual("Sổ Tay Ghi Chú Sứ Điệp Cá Nhân", "Personal Sermon Notes & Journal")}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-serif">
                        {bilingual(
                          "Ghi lại những điều Chúa Thánh Linh phán cùng lòng bạn qua bài giảng này",
                          "Record personal takeaways and what the Holy Spirit reveals to your heart",
                        )}
                      </p>
                    </div>
                  </div>
                  {notesSavedSuccess && (
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 animate-pulse">
                      {bilingual("✓ Đã lưu ghi chú", "✓ Notes saved")}
                    </span>
                  )}
                </div>

                <textarea
                  rows={6}
                  placeholder={bilingual(
                    "Viết ghi chú cá nhân, điều đánh động lòng bạn hoặc lời cầu nguyện đáp ứng...",
                    "Write personal notes, key verses that touched you, or responsive prayers...",
                  )}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-4 bg-[#FCFBF8] border border-amber-200/80 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed font-serif"
                />

                <div className="flex justify-end">
                  <TactileButton
                    variant="primary"
                    size="sm"
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                  >
                    <Save className="w-3.5 h-3.5 mr-1" />
                    <span>
                      {savingNotes
                        ? bilingual("Đang lưu...", "Saving...")
                        : bilingual("Lưu Ghi Chú", "Save Notes")}
                    </span>
                  </TactileButton>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-amber-200/60 space-y-3">
              <BookOpen className="w-12 h-12 mx-auto text-amber-700/60" />
              <h3 className="font-scripture text-lg font-bold text-slate-900">
                {bilingual(
                  "Chưa Có Bài Giảng Nào Trong Khóa Học Này",
                  "No lessons in this course yet",
                )}
              </h3>
              {isLeaderOrPastor && (
                <TactileButton
                  variant="gold"
                  size="md"
                  onClick={() => setShowAddLessonModal(true)}
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  <span>{bilingual("Thêm Bài Giảng Đầu Tiên", "Add First Lesson")}</span>
                </TactileButton>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar (1/3): Course Progress & Lesson Playlist */}
        <div className="space-y-6">
          {/* Course Progress Card */}
          <div className="p-5 bg-white rounded-2xl border border-amber-200/70 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">
                {bilingual("Tiến Độ Môn Đồ Hóa", "Discipleship Progress")}
              </span>
              <span className="font-bold text-amber-900 font-serif">
                {progress?.percentComplete ?? 0}%
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-amber-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progress?.percentComplete ?? 0}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-500 font-serif">
              {bilingual(
                `Đã hoàn thành ${progress?.completedLessonsCount ?? 0} / ${course.lessons?.length ?? 0} bài giảng`,
                `Completed ${progress?.completedLessonsCount ?? 0} of ${course.lessons?.length ?? 0} lessons`,
              )}
            </p>
          </div>

          {/* Lesson Playlist */}
          <div className="bg-white rounded-2xl border border-amber-200/70 shadow-xs overflow-hidden">
            <div className="p-4 bg-[#FCFBF8] border-b border-amber-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-amber-800 font-serif font-bold">†</span>
                <h3 className="font-scripture text-sm font-bold text-slate-900">
                  {bilingual("Danh Sách Bài Học", "Lesson Playlist")} ({course.lessons?.length ?? 0})
                </h3>
              </div>
            </div>

            <div className="divide-y divide-amber-100/60 max-h-[600px] overflow-y-auto">
              {course.lessons && course.lessons.length > 0 ? (
                course.lessons.map((lesson) => {
                  const isActive = activeLesson?.id === lesson.id;
                  const isCompleted =
                    progress?.progressMap[lesson.id]?.isCompleted || false;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => handleSelectLesson(lesson)}
                      className={`w-full p-4 text-left flex items-start gap-3 transition-all cursor-pointer ${
                        isActive
                          ? "bg-amber-50/80 border-l-4 border-amber-700"
                          : "hover:bg-[#FCFBF8]"
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300" />
                        )}
                      </div>

                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span
                            className={`font-serif font-bold ${
                              isActive ? "text-amber-900" : "text-slate-500"
                            }`}
                          >
                            {bilingual("Bài", "Lesson")} {lesson.orderIndex}
                          </span>
                          <span className="text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDuration(lesson.duration)}
                          </span>
                        </div>

                        <h4
                          className={`text-xs font-semibold leading-snug line-clamp-2 ${
                            isActive ? "text-indigo-950 font-bold" : "text-slate-800"
                          }`}
                        >
                          {lesson.title}
                        </h4>

                        {lesson.scriptureReference && (
                          <p className="text-[10px] text-amber-800 font-serif italic line-clamp-1">
                            📖 {lesson.scriptureReference}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-6 text-center text-xs text-slate-500">
                  {bilingual("Chưa có bài học nào", "No lessons available")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ADD LESSON MODAL (Pastor / Leader) */}
      {showAddLessonModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FCFBF8] border border-amber-300/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-amber-200/70 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-amber-800 font-serif font-bold text-xl">†</span>
                <h3 className="font-scripture text-lg font-bold text-slate-900">
                  {bilingual("Thêm Bài Học Mới Vào Khóa Học", "Add New Lesson to Course")}
                </h3>
              </div>
              <button
                onClick={() => setShowAddLessonModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addLessonError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                {addLessonError}
              </div>
            )}

            <form onSubmit={handleAddLesson} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  {bilingual("Tiêu Đề Bài Học / Sứ Điệp *", "Lesson Title / Message Topic *")}
                </label>
                <input
                  type="text"
                  required
                  placeholder={bilingual(
                    "Ví dụ: Bài 4: Sự Đắc Thắng Trong Sự Cám Dỗ",
                    "e.g. Lesson 4: Victory Over Temptation",
                  )}
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-amber-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    {bilingual("Thời Lượng (Phút)", "Duration (Minutes)")}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="240"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 30)}
                    className="w-full h-10 px-3 bg-white border border-amber-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    {bilingual("Kinh Thánh Nền Tảng", "Scripture Reference")}
                  </label>
                  <input
                    type="text"
                    placeholder={bilingual("Ví dụ: Giăng 15:1-8", "e.g. John 15:1-8")}
                    value={scriptureRef}
                    onChange={(e) => setScriptureRef(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-amber-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  {bilingual("Link Video Embed (YouTube Embed URL)", "Video Embed URL (YouTube / Vimeo)")}
                </label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/embed/..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-amber-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  {bilingual("Link Tài Liệu Hướng Dẫn Thảo Luận (PDF Guide URL)", "Study Guide URL (PDF)")}
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/guide.pdf"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-amber-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  {bilingual(
                    "Câu Hỏi Thảo Luận Nhóm Nhỏ (Mỗi câu một dòng)",
                    "Life Group Discussion Questions (one per line)",
                  )}
                </label>
                <textarea
                  rows={3}
                  placeholder={bilingual(
                    "1. Câu hỏi thứ nhất?\n2. Câu hỏi thứ hai?",
                    "1. First question?\n2. Second question?",
                  )}
                  value={questionsText}
                  onChange={(e) => setQuestionsText(e.target.value)}
                  className="w-full p-3 bg-white border border-amber-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLessonModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
                >
                  {bilingual("Hủy Bỏ", "Cancel")}
                </button>
                <TactileButton variant="primary" size="md" type="submit" disabled={addingLesson}>
                  {addingLesson
                    ? bilingual("Đang Thêm...", "Adding...")
                    : bilingual("Thêm Bài Giảng", "Add Lesson")}
                </TactileButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
