"use client";

import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { BentoCard } from "@/components/ui/bento-card";
import { TactileButton } from "@/components/ui/tactile-button";
import { TactileInput } from "@/components/ui/tactile-input";
import {
  Users2,
  Calendar,
  MapPin,
  Video,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  UserCheck,
  X,
} from "lucide-react";

interface Member {
  id: string;
  userId: string;
  role: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
  };
}

interface SmallGroup {
  id: string;
  name: string;
  leaderId: string;
  leader: {
    fullName: string;
    email: string;
  };
  category: string;
  scheduleRule: string;
  location: string | null;
  zoomLink: string | null;
  zipcode: string | null;
  description: string | null;
  members?: Member[];
  createdAt: string;
}

export default function GroupsPage() {
  const { user } = useAuth();
  const { bilingual, isEn } = useLanguage();
  const [groups, setGroups] = useState<SmallGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<SmallGroup | null>(null);
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [attendanceRecords, setAttendanceRecords] = useState<
    Record<string, "present" | "absent" | "excused">
  >({});
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [attendanceSuccess, setAttendanceSuccess] = useState(false);

  // New Group Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSchedule, setNewSchedule] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newZoom, setNewZoom] = useState("");
  const [newZipcode, setNewZipcode] = useState("");
  const [newCategory, setNewCategory] = useState("families");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);

  const isLeaderOrPastor =
    user?.role === "senior_pastor" ||
    user?.role === "admin" ||
    user?.role === "ministry_leader";

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (selectedCategory) params.append("category", selectedCategory);
      const queryStr = params.toString() ? `?${params.toString()}` : "";
      const res = await apiFetch<{ items: SmallGroup[] }>(`/groups${queryStr}`);
      setGroups(res.items || []);
    } catch {
      // error handling
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [selectedCategory]);

  const handleOpenAttendance = async (group: SmallGroup) => {
    setSelectedGroup(group);
    setAttendanceSuccess(false);
    try {
      const detailed = await apiFetch<SmallGroup>(`/groups/${group.id}`);
      setSelectedGroup(detailed);
      // Mặc định tất cả đều Có mặt
      const initial: Record<string, "present" | "absent" | "excused"> = {};
      detailed.members?.forEach((m) => {
        initial[m.userId] = "present";
      });
      setAttendanceRecords(initial);
    } catch {
      //
    }
  };

  const handleSaveAttendance = async () => {
    if (!selectedGroup) return;
    setSavingAttendance(true);
    try {
      const records = Object.entries(attendanceRecords).map(
        ([userId, status]) => ({
          userId,
          status,
        }),
      );
      await apiFetch(`/groups/${selectedGroup.id}/attendance`, {
        method: "POST",
        body: {
          sessionDate: attendanceDate,
          records,
        },
      });
      setAttendanceSuccess(true);
      setTimeout(() => {
        setSelectedGroup(null);
        setAttendanceSuccess(false);
      }, 1500);
    } catch {
      alert(bilingual("Không thể lưu kết quả điểm danh. Vui lòng thử lại", "Failed to save attendance. Please try again."));
    } finally {
      setSavingAttendance(false);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !user) return;
    setCreating(true);
    try {
      await apiFetch("/groups", {
        method: "POST",
        body: {
          name: newName,
          leaderId: user.id,
          category: newCategory,
          scheduleRule: newSchedule,
          location: newLocation || undefined,
          zoomLink: newZoom || undefined,
          zipcode: newZipcode || undefined,
          description: newDesc || undefined,
        },
      });
      setShowCreateModal(false);
      setNewName("");
      setNewLocation("");
      setNewZoom("");
      setNewZipcode("");
      setNewDesc("");
      fetchGroups();
    } catch (err) {
      alert(bilingual("Không thể tạo nhóm nhỏ", "Failed to create small group."));
    } finally {
      setCreating(false);
    }
  };

  const categories = [
    { key: "", vi: "Tất Cả Các Nhóm", en: "All Groups" },
    { key: "families", vi: "Gia Đình Trẻ", en: "Young Families" },
    { key: "youth", vi: "Thanh Thiếu Niên", en: "Youth & Teens" },
    { key: "young_adults", vi: "Sinh Viên & Đi Làm", en: "Young Adults & College" },
    { key: "seniors", vi: "Trung Tráng Niên", en: "Seniors & Elders" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-800 font-serif uppercase tracking-widest">
            <span>†</span>
            <span>
              {bilingual(
                "Hiệp Một Thông Công & Gây Dựng",
                "United in Fellowship & Discipleship"
              )}
            </span>
          </div>
          <h1 className="font-scripture text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {bilingual("Nhóm Nhỏ & Tế Bào (Life Groups)", "Small Groups & Life Groups")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {bilingual(
              "Nơi tín hữu kết nối thân mật, cùng học Lời Chúa, hiệp nguyện và chăm sóc lẫn nhau.",
              "Where believers gather intimately to study God's Word, pray, and care for one another."
            )}
          </p>
        </div>

        {isLeaderOrPastor && (
          <TactileButton
            variant="primary"
            size="md"
            withCross
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>{bilingual("Tạo Nhóm Nhỏ Mới", "Create New Life Group")}</span>
          </TactileButton>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={bilingual(
              "Tìm theo tên nhóm, địa điểm hoặc Zipcode...",
              "Search by group name, location, or Zipcode..."
            )}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchGroups()}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white rounded-xl border border-amber-200/80 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar py-1">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedCategory(c.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === c.key
                  ? "bg-indigo-950 text-white border-indigo-950 shadow-xs"
                  : "bg-white text-slate-700 border-amber-200/80 hover:bg-amber-50"
              }`}
            >
              {isEn ? c.en : c.vi}
            </button>
          ))}
        </div>
      </div>

      {/* Groups List */}
      {loading ? (
        <div className="py-16 text-center text-xs font-serif italic text-slate-500">
          {bilingual(
            '"Đang tải danh sách các nhóm thông công..."',
            '"Loading small group fellowship rosters..."'
          )}
        </div>
      ) : groups.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-amber-200/60 p-8 space-y-3">
          <Users2 className="w-8 h-8 text-amber-700 mx-auto opacity-70" />
          <h3 className="font-scripture text-base font-bold text-slate-800">
            {bilingual(
              "Chưa tìm thấy nhóm nhỏ nào phù hợp",
              "No small groups match your query"
            )}
          </h3>
          <p className="text-xs text-slate-500">
            {bilingual(
              "Hãy thử đổi từ khóa tìm kiếm hoặc Zipcode khác.",
              "Try searching with another keyword or US Zipcode."
            )}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <BentoCard
              key={group.id}
              title={group.name}
              subtitle={`${bilingual("Trưởng nhóm:", "Leader:")} ${group.leader?.fullName || bilingual("Chưa gán", "Unassigned")}`}
              badge={
                group.zipcode ? (
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-200">
                    Zip {group.zipcode}
                  </span>
                ) : null
              }
            >
              <div className="mt-3 space-y-3 text-xs text-slate-700">
                <p className="text-slate-600 line-clamp-2 leading-relaxed italic font-serif">
                  {group.description || bilingual(
                    "Nhóm thông công học Lời Chúa và cùng nhau cầu thay.",
                    "Fellowship group gathering around Scripture and intercession."
                  )}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-amber-100/70 text-[11px]">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>{group.scheduleRule}</span>
                  </div>

                  {group.location && (
                    <div className="flex items-center gap-2 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-amber-700" />
                      <span className="truncate">{group.location}</span>
                    </div>
                  )}

                  {group.zoomLink && (
                    <div className="flex items-center gap-2 text-indigo-900 font-medium">
                      <Video className="w-3.5 h-3.5 text-indigo-900" />
                      <a
                        href={group.zoomLink}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline truncate"
                      >
                        {bilingual("Vào phòng Zoom nhóm", "Join Zoom Meeting")}
                      </a>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-800">
                    {group.members?.length || 1} {bilingual("Tín Hữu", "Members")}
                  </span>

                  {isLeaderOrPastor && (
                    <button
                      onClick={() => handleOpenAttendance(group)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-950 text-white text-xs font-semibold flex items-center gap-1 hover:bg-indigo-900 shadow-xs cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-amber-300" />
                      <span>{bilingual("Điểm Danh Ca Nhóm", "Take Attendance")}</span>
                    </button>
                  )}
                </div>
              </div>
            </BentoCard>
          ))}
        </div>
      )}

      {/* Attendance Modal */}
      {selectedGroup && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl border border-amber-200 shadow-2xl p-6 space-y-5 animate-in fade-in duration-200">
            <div className="flex items-start justify-between border-b border-amber-100 pb-3">
              <div>
                <span className="text-[10px] font-serif uppercase tracking-widest text-amber-800">
                  {bilingual("† ĐIỂM DANH BUỔI SINH HOẠT NHÓM", "† LIFE GROUP ATTENDANCE ROSTER")}
                </span>
                <h3 className="font-scripture text-lg font-bold text-slate-900 mt-0.5">
                  {selectedGroup.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedGroup(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {bilingual("Ngày Sinh Hoạt Nhóm", "Session Date")}
                </label>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-amber-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">
                  {bilingual(
                    `Danh Sách Tín Hữu (${selectedGroup.members?.length || 0})`,
                    `Member Roster (${selectedGroup.members?.length || 0})`
                  )}
                </label>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {selectedGroup.members?.map((member) => {
                    const status = attendanceRecords[member.userId] || "present";
                    return (
                      <div
                        key={member.id}
                        className="p-3 rounded-xl bg-[#FCFBF8] border border-amber-100 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900">
                            {member.user?.fullName}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {member.user?.phone || member.user?.email}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              setAttendanceRecords((prev) => ({
                                ...prev,
                                [member.userId]: "present",
                              }))
                            }
                            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                              status === "present"
                                ? "bg-emerald-700 text-white shadow-xs"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {bilingual("Có mặt", "Present")}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setAttendanceRecords((prev) => ({
                                ...prev,
                                [member.userId]: "excused",
                              }))
                            }
                            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                              status === "excused"
                                ? "bg-amber-600 text-white shadow-xs"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {bilingual("Có phép", "Excused")}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setAttendanceRecords((prev) => ({
                                ...prev,
                                [member.userId]: "absent",
                              }))
                            }
                            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                              status === "absent"
                                ? "bg-rose-700 text-white shadow-xs"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {bilingual("Vắng", "Absent")}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {attendanceSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{bilingual("Đã ghi nhận điểm danh thành công!", "Attendance recorded successfully!")}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-100">
              <button
                type="button"
                onClick={() => setSelectedGroup(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                {bilingual("Hủy", "Cancel")}
              </button>
              <TactileButton
                variant="primary"
                size="md"
                disabled={savingAttendance}
                onClick={handleSaveAttendance}
              >
                <span>
                  {savingAttendance
                    ? bilingual("Đang lưu...", "Saving...")
                    : bilingual("Xác Nhận Điểm Danh", "Submit Attendance")}
                </span>
              </TactileButton>
            </div>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl border border-amber-200 shadow-2xl p-6 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-start justify-between border-b border-amber-100 pb-3">
              <h3 className="font-scripture text-lg font-bold text-slate-900">
                {bilingual("Khởi Tạo Nhóm Nhỏ Mới", "Create New Small Group")}
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-3.5">
              <TactileInput
                label={bilingual("Tên Nhóm Nhỏ / Tế Bào", "Life Group Name")}
                placeholder={bilingual(
                  "VD: Nhóm Gia Đình Dallas (Plano)",
                  "e.g., Dallas Young Families (Plano)"
                )}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <TactileInput
                  label={bilingual("Lịch Sinh Hoạt", "Weekly Schedule")}
                  placeholder={bilingual("Thứ Sáu 19:30", "Friday 7:30 PM")}
                  value={newSchedule}
                  onChange={(e) => setNewSchedule(e.target.value)}
                  required
                />
                <TactileInput
                  label="US Zipcode"
                  placeholder="75024"
                  value={newZipcode}
                  onChange={(e) => setNewZipcode(e.target.value)}
                />
              </div>

              <TactileInput
                label={bilingual("Địa Điểm Sinh Hoạt (Tư gia / Phòng nhóm)", "Location (Home / Room)")}
                placeholder={bilingual(
                  "Tư gia Chấp sự Nguyen...",
                  "Deacon Nguyen's residence..."
                )}
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
              />

              <TactileInput
                label={bilingual("Phòng Nhóm Trực Tuyến Zoom (Nếu có)", "Zoom Link (Optional)")}
                placeholder="https://zoom.us/j/..."
                value={newZoom}
                onChange={(e) => setNewZoom(e.target.value)}
              />

              <TactileInput
                label={bilingual("Mô Tả & Mục Tiêu Nhóm", "Group Description & Focus")}
                placeholder={bilingual(
                  "Mô tả ngắn về thành phần và mục tiêu thông công...",
                  "Brief summary of target demographic and fellowship purpose..."
                )}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-amber-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  {bilingual("Đóng", "Close")}
                </button>
                <TactileButton variant="primary" size="md" disabled={creating}>
                  <span>
                    {creating
                      ? bilingual("Đang tạo...", "Creating...")
                      : bilingual("Lưu Nhóm Mới", "Create Life Group")}
                  </span>
                </TactileButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
