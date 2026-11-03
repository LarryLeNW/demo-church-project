"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { BentoCard } from "@/components/ui/bento-card";
import { TactileButton } from "@/components/ui/tactile-button";
import { DevotionalStreakBadge } from "@/components/devotional-streak-badge";
import {
  Heart,
  Users2,
  DollarSign,
  AlertTriangle,
  BookOpen,
  Phone,
  Flame,
  CheckCircle2,
  Calendar,
  Sparkles,
  Volume2,
  ShieldCheck,
  ShieldAlert,
  Clock,
  ArrowRight,
  BookmarkCheck,
  BookMarked,
  HeartPulse,
  Building,
  Key,
  Baby,
  HeartHandshake,
  FileText,
  UserCheck,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const { lang, isEn, t, bilingual } = useLanguage();
  const [hasPrayed, setHasPrayed] = useState(false);
  const [prayedCount, setPrayedCount] = useState(12);

  // Quick Action States for Pastor & Leader
  const [roomApproved, setRoomApproved] = useState(false);
  const [pastorAssigned, setPastorAssigned] = useState(false);
  const [groupAttendanceLogged, setGroupAttendanceLogged] = useState(false);
  const [rosterConfirmed, setRosterConfirmed] = useState(false);

  if (!user) return null;

  const role = user.role;
  const isPastor = role === "senior_pastor" || role === "admin";
  const isLeader = role === "ministry_leader";
  const isParent = role === "parent";
  const isMember = role === "member";

  const getGreetingTitle = () => {
    if (isEn) {
      if (isPastor) return "Pastor";
      if (isLeader) return "Leader";
      if (isParent) return "Parent";
      return "Brother/Sister";
    }
    if (isPastor) return "Mục Sư";
    if (isLeader) return "Trưởng Ban";
    if (isParent) return "Phụ Huynh";
    return "Anh Chị Em";
  };

  const getGreetingSubtitle = () => {
    if (isEn) {
      if (isPastor)
        return "Executive Pastoral Cockpit: Monitor church health, approve requests, and care for sheep in need.";
      if (isLeader)
        return "Ministry Leader Portal: Life group attendance, Sunday roster confirmations, and team fellowship.";
      if (isParent)
        return "Children Ministry Parent Portal: Secure PIN check-in badge and weekly family devotion guides.";
      return "May the Word of Christ dwell in you richly through daily scripture reading, memory verses, and prayer.";
    }
    if (isPastor)
      return "Bảng chỉ huy mục vụ: Nắm bắt sức khỏe Hội Thánh, phê duyệt nhanh yêu cầu và chăm sóc các linh hồn cần thăm viếng.";
    if (isLeader)
      return "Không gian hướng dẫn mục vụ: Điểm danh nhóm tế bào tuần này, xác nhận ca trực phụng vụ và chăm sóc thành viên.";
    if (isParent)
      return "Khu vực đồng hành cùng con: Lấy mã PIN an toàn đưa đón bé lớp Trường Chúa Nhật và nhận tài liệu tĩnh nguyện gia đình.";
    return "Nguyện Lời Chúa soi dẫn bước chân bạn qua việc đọc Kinh Thánh, ôn câu gốc và hiệp lòng thờ phượng.";
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-indigo-950 via-indigo-900 to-amber-950 text-white rounded-2xl border border-amber-400/30 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-serif uppercase tracking-widest">
            <span>†</span>
            <span>{isEn ? "Grace & Peace in our Lord Jesus Christ" : "Ân Điển & Bình An Của Chúa Cứu Thế Jesus"}</span>
          </div>
          <h1 className="font-scripture text-2xl sm:text-3xl font-bold tracking-tight">
            {isEn ? "Welcome" : "Kính Chào"} {getGreetingTitle()} {user.fullName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-normal leading-relaxed">
            {getGreetingSubtitle()}
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <DevotionalStreakBadge className="bg-white/10 text-amber-300 border-amber-400/40 hover:bg-white/20 py-2 px-3 text-sm" />
          <Link href="/dashboard/giving">
            <TactileButton variant="gold" size="md">
              <DollarSign className="w-4 h-4 mr-1" />
              <span>{isEn ? "Give Online" : "Dâng Hiến"}</span>
            </TactileButton>
          </Link>
          <Link href="/dashboard/bible">
            <TactileButton variant="secondary" size="md">
              <BookOpen className="w-4 h-4 mr-1 text-indigo-950" />
              <span>{isEn ? "Read Scripture" : "Đọc Lời Chúa"}</span>
            </TactileButton>
          </Link>
        </div>
      </div>

      {/* ====================================================================== */}
      {/* 1. SENIOR PASTOR & CHURCH ADMIN VIEW */}
      {/* ====================================================================== */}
      {isPastor && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-scripture text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-amber-800 font-serif">†</span>
              <span>{bilingual("Chỉ Huy Mục Vụ & Tình Hình Hội Thánh", "Pastoral Leadership & Church Vitals")}</span>
            </h2>
            <Link
              href="/dashboard/analytics"
              className="text-xs font-semibold text-amber-800 hover:text-amber-950 hover:underline flex items-center gap-1"
            >
              <span>{bilingual("Xem Báo Cáo Sức Khỏe Toàn Diện (Executive Analytics) →", "View Comprehensive Health Report (Executive Analytics) →")}</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <BentoCard
              title={bilingual("Sức Khỏe Hội Thánh", "Church Spiritual Health")}
              subtitle={bilingual("Tổng hợp 5 trụ cột Lời Chúa", "Composite of 5 Biblical Pillars")}
            >
              <div className="text-3xl font-serif font-bold text-indigo-950 mt-2">
                82<span className="text-lg text-slate-400 font-sans">/100</span>
              </div>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">
                {bilingual("✓ Hội Thánh Phát Triển Ổn Định", "✓ Growing & Spiritually Healthy")}
              </p>
            </BentoCard>

            <BentoCard
              title={bilingual("Cảnh Báo Vắng Mặt", "Absentee Watchlist")}
              subtitle={bilingual("Cần Mục sư thăm viếng", "Pastoral Follow-up Needed")}
              badge={
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                  {bilingual("3 Tín Hữu", "3 Members")}
                </span>
              }
            >
              <div className="text-3xl font-serif font-bold text-rose-700 mt-2">3</div>
              <p className="text-[11px] text-rose-600 font-medium mt-1">
                {bilingual("Vắng mặt ≥ 2 tuần liên tiếp", "Absent for ≥ 2 consecutive weeks")}
              </p>
            </BentoCard>

            <BentoCard
              title={bilingual("Dâng Hiến YTD (Stripe/ACH)", "YTD Giving (Stripe/ACH)")}
              subtitle={bilingual("Chuẩn khấu trừ thuế 501(c)(3)", "IRS 501(c)(3) Tax Deductible")}
            >
              <div className="text-3xl font-serif font-bold text-amber-900 mt-2">$20,850</div>
              <p className="text-[11px] text-slate-600 font-medium mt-1">
                {bilingual("Quỹ Tổng hội & Truyền giáo", "Tithes & Missions Funds")}
              </p>
            </BentoCard>

            <BentoCard
              title={bilingual("Đơn Chờ Phê Duyệt", "Pending Approvals")}
              subtitle={bilingual("Phòng nhóm & Thăm bệnh", "Rooms & Care Visits")}
            >
              <div className="text-3xl font-serif font-bold text-slate-900 mt-2">
                {bilingual("2 Đơn", "2 Requests")}
              </div>
              <p className="text-[11px] text-amber-800 font-medium mt-1">
                {bilingual("Cần Ban Trị Sự xác nhận", "Action required by church leadership")}
              </p>
            </BentoCard>
          </div>

          {/* Pastoral Decision Inbox (Hộp thư quyết định 1-chạm) */}
          <div className="p-6 bg-white rounded-2xl border border-amber-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-700" />
                <h3 className="font-scripture text-base font-bold text-indigo-950">
                  {bilingual("Hộp Thư Phê Duyệt Mục Vụ 1-Chạm (Pastoral Decision Inbox)", "1-Click Pastoral Decision Inbox")}
                </h3>
              </div>
              <span className="text-xs text-amber-800 font-medium">
                {bilingual("Cần xử lý hôm nay", "Requires attention today")}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Item 1: Hospital Visitation */}
              <div className="p-4 rounded-xl bg-red-50/60 border border-red-200 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-300 animate-pulse">
                      {bilingual("🚨 CẤP CỨU BỆNH VIỆN (GIA-CƠ 5:14)", "🚨 URGENT HOSPITAL VISIT (JAMES 5:14)")}
                    </span>
                    <span className="text-xs text-slate-500">{bilingual("Phòng 304", "Room 304")}</span>
                  </div>
                  <h4 className="font-serif font-bold text-slate-900 text-sm mt-2">
                    {bilingual("Bác Trương Minh Hải (Baylor Scott & White Health)", "Brother Hai Truong (Baylor Scott & White Health)")}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 italic">
                    {bilingual(
                      '"Gia đình xin Mục sư đến cầu nguyện đặt tay xức dầu ban bình an."',
                      '"Family requests pastoral prayer and anointing with oil for peace."',
                    )}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-red-100">
                  <span className="text-xs text-slate-500 font-mono">(469) 555-0199</span>
                  {pastorAssigned ? (
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {bilingual("Đã phân công thăm", "Assigned Pastoral Team")}
                    </span>
                  ) : (
                    <TactileButton
                      variant="gold"
                      size="sm"
                      onClick={() => setPastorAssigned(true)}
                      className="text-xs py-1"
                    >
                      {bilingual("Nhận Đi Thăm & Cầu Nguyện", "Accept Visit & Pray")}
                    </TactileButton>
                  )}
                </div>
              </div>

              {/* Item 2: Facility Room Reservation */}
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                      {bilingual("ĐƠN ĐẶT PHÒNG NHÓM", "ROOM RESERVATION REQUEST")}
                    </span>
                    <span className="text-xs text-slate-500">{bilingual("Nhà Thông Công", "Fellowship Hall")}</span>
                  </div>
                  <h4 className="font-serif font-bold text-slate-900 text-sm mt-2">
                    {bilingual("Tiệc Thông Công & Mừng Tân Tín Hữu (Ban Ẩm Thực)", "New Believer Banquet (Hospitality Ministry)")}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    {bilingual("Chúa Nhật 08/11 • 12:30 PM — 15:00 PM (12 bàn tròn, mở bếp)", "Sunday Nov 8 • 12:30 PM — 3:00 PM (12 round tables, kitchen open)")}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-amber-100">
                  <span className="text-xs text-slate-500">{bilingual("Người đặt: Chấp Sự Minh", "Requested by: Deacon Minh")}</span>
                  {roomApproved ? (
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {bilingual("Đã Duyệt & Khóa Lịch", "Approved & Scheduled")}
                    </span>
                  ) : (
                    <TactileButton
                      variant="primary"
                      size="sm"
                      onClick={() => setRoomApproved(true)}
                      className="text-xs py-1"
                    >
                      {bilingual("Duyệt Sử Dụng Phòng", "Approve Room Booking")}
                    </TactileButton>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ====================================================================== */}
      {/* 2. MINISTRY LEADER VIEW */}
      {/* ====================================================================== */}
      {isLeader && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-scripture text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-amber-800 font-serif">†</span>
              <span>{bilingual("Bảng Nhiệm Vụ Tuần Này Của Trưởng Ban (Leader Action Hub)", "Ministry Leader Weekly Action Hub")}</span>
            </h2>
            <span className="text-xs text-slate-500">Dallas Family Fellowship</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Task 1: Small Group Attendance */}
            <div className="p-5 bg-white rounded-2xl border border-amber-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Users2 className="w-4 h-4 text-amber-700" />
                  {bilingual("Nhóm Tế Bào", "Life Group")}
                </span>
                <span className="text-xs text-emerald-700 font-semibold">{bilingual("12 Thành Viên", "12 Members")}</span>
              </div>
              <h4 className="font-serif font-bold text-slate-900 text-base">
                {bilingual("Điểm Danh Buổi Nhóm Thứ Sáu Tuần Này", "Friday Fellowship Attendance Roster")}
              </h4>
              <p className="text-xs text-slate-600">
                {bilingual('Chủ đề: "Sống Đắc Thắng Giữa Thử Thách". 10 thành viên đã báo có mặt.', 'Topic: "Victorious Living". 10 members confirmed attendance.')}
              </p>
              <div className="pt-2">
                {groupAttendanceLogged ? (
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> {bilingual("Đã Lưu Điểm Danh Hôm Nay!", "Attendance Saved for Today!")}
                  </span>
                ) : (
                  <TactileButton
                    variant="gold"
                    size="sm"
                    onClick={() => setGroupAttendanceLogged(true)}
                    className="w-full text-xs"
                  >
                    {bilingual("1-Chạm Hoàn Tất Điểm Danh", "1-Click Submit Attendance")}
                  </TactileButton>
                )}
              </div>
            </div>

            {/* Task 2: Volunteer Sunday Rostering */}
            <div className="p-5 bg-white rounded-2xl border border-amber-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-indigo-700" />
                  {bilingual("Ban Phụng Vụ", "Worship Ministry")}
                </span>
                <span className="text-xs text-amber-800 font-semibold">{bilingual("Chúa Nhật 08/11", "Sunday Nov 8")}</span>
              </div>
              <h4 className="font-serif font-bold text-slate-900 text-base">
                {bilingual("Ca Trực: Hát Dẫn (Lead Vocal) Lễ 2", "Assigned: Lead Vocal (2nd Service)")}
              </h4>
              <p className="text-xs text-slate-600">
                {bilingual("Tập hát lúc 8:30 AM tại Thánh Đường Lớn. Xin vui lòng xác nhận sớm.", "Sound check & rehearsal at 8:30 AM in the Main Sanctuary.")}
              </p>
              <div className="pt-2">
                {rosterConfirmed ? (
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> {bilingual("Sẵn Sàng Phục Vụ Chúa!", "Confirmed & Ready to Serve!")}
                  </span>
                ) : (
                  <TactileButton
                    variant="primary"
                    size="sm"
                    onClick={() => setRosterConfirmed(true)}
                    className="w-full text-xs"
                  >
                    {bilingual("Xác Nhận Có Mặt (Confirm)", "Confirm Attendance")}
                  </TactileButton>
                )}
              </div>
            </div>

            {/* Task 3: Sermon Discussion Guide */}
            <div className="p-5 bg-white rounded-2xl border border-amber-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-600" />
                  {bilingual("Bài Giảng & Thảo Luận", "Sermon Discussion")}
                </span>
                <span className="text-xs text-slate-500 font-mono">{bilingual("3 Câu Hỏi", "3 Questions")}</span>
              </div>
              <h4 className="font-serif font-bold text-slate-900 text-base">
                {bilingual("Tài Liệu Hướng Dẫn Thảo Luận Nhóm", "Small Group Discussion Outline")}
              </h4>
              <p className="text-xs text-slate-600">
                {bilingual("Bộ câu hỏi áp dụng thực hành theo bài giảng của Mục Sư Chúa Nhật vừa qua.", "Practical discussion prompts from Pastor's Sunday message.")}
              </p>
              <div className="pt-2">
                <Link href="/dashboard/sermons">
                  <TactileButton variant="secondary" size="sm" className="w-full text-xs">
                    {bilingual("Xem Câu Hỏi Thảo Luận →", "View Discussion Prompts →")}
                  </TactileButton>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ====================================================================== */}
      {/* 3. PARENT VIEW (Sunday School Child Safety Check-in) */}
      {/* ====================================================================== */}
      {isParent && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-scripture text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-rose-800 font-serif">†</span>
              <span>{bilingual("An Toàn Lớp Thiếu Nhi & Gia Đình (Sunday School Kids Safety)", "Kids Ministry & Family Devotional Portal")}</span>
            </h2>
            <Link
              href="/dashboard/checkin"
              className="text-xs font-semibold text-rose-800 hover:underline"
            >
              {bilingual("Xem Chi Tiết Lớp Học →", "Classroom Details →")}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Child PIN & Security Badge Card */}
            <div className="p-6 bg-gradient-to-br from-white to-rose-50/60 rounded-2xl border border-rose-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Baby className="w-5 h-5 text-rose-600" />
                  <h3 className="font-serif font-bold text-base text-slate-900">
                    {bilingual("Bé Nguyễn An (4 Tuổi)", "An Nguyen (Age 4)")}
                  </h3>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {bilingual("Đang Trong Lớp Học", "Checked-in")}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-rose-200 shadow-2xs text-center space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-widest text-slate-500 block">
                  {bilingual("MÃ BẢO MẬT ĐÓN TRẺ (PARENT PICKUP PIN)", "SECURE PICKUP PIN CODE")}
                </span>
                <div className="text-4xl font-mono font-bold text-indigo-950 tracking-widest">
                  #4821
                </div>
                <span className="text-[11px] text-rose-700 italic block mt-1">
                  {bilingual("Xuất trình mã này cho giáo viên khi đón bé sau giờ thờ phượng", "Present this security code to teachers when picking up your child")}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <span>{bilingual("Lớp: Mầm Non (Noah's Ark)", "Class: Preschool (Noah's Ark)")}</span>
                <span>{bilingual("Phòng: 102 • Giáo viên: Cô Mai", "Room: 102 • Teacher: Ms. Mai")}</span>
              </div>
            </div>

            {/* Family Devotional Topic */}
            <div className="p-6 bg-white rounded-2xl border border-amber-200 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  {bilingual("Tĩnh Nguyện Gia Đình Tuần Này", "Family Devotion This Week")}
                </span>
                <h4 className="font-serif font-bold text-slate-900 text-base">
                  {bilingual("Chúa Giê-xu Yêu Thương Con Trẻ (Mác 10:14)", "Jesus Loves the Little Children (Mark 10:14)")}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed italic bg-[#FCFBF8] p-3 rounded-lg border border-amber-100">
                  {bilingual(
                    '"Gợi ý bữa cơm tối: Bố mẹ hỏi con tuần này ở lớp đã học bài hát gì, và cùng con cầu nguyện cảm tạ Chúa về mái ấm gia đình."',
                    '"Dinner discussion: Ask your child about the Bible song learned this Sunday, and pray together thanking God for family blessings."',
                  )}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-serif">Sunday School Family Guide</span>
                <Link href="/dashboard/courses">
                  <TactileButton variant="secondary" size="sm" className="text-xs">
                    {bilingual("Tải Bài Học Của Con →", "Download Family Lesson →")}
                  </TactileButton>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ====================================================================== */}
      {/* 4. MEMBER & GENERAL SPIRITUAL SANCTUARY VIEW */}
      {/* ====================================================================== */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Daily Scripture Memory */}
        <BentoCard
          title={bilingual("Ghi Nhớ Lời Chúa Hôm Nay", "Today's Scripture Memory")}
          subtitle={bilingual("Thuộc lòng Lời Chúa để không phạm tội (Thi Thiên 119:11)", "Hiding God's Word in your heart (Psalm 119:11)")}
          badge={
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              {bilingual("Giăng 15:5 • RVV11", "John 15:5 • ESV")}
            </span>
          }
        >
          <div className="mt-3 space-y-3">
            <blockquote className="font-scripture text-base italic text-slate-900 leading-relaxed bg-[#FBF9F5] p-3.5 rounded-xl border border-amber-100">
              {bilingual(
                '"Ta là gốc nho, các con là cành. Ai cứ ở trong Ta và Ta trong người ấy thì sinh ra nhiều quả..."',
                '"I am the vine; you are the branches. Whoever abides in me and I in him, he it is that bears much fruit..."',
              )}
            </blockquote>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <DevotionalStreakBadge />
              <Link
                href="/dashboard/scripture"
                className="text-indigo-900 font-bold hover:underline cursor-pointer"
              >
                {bilingual("Ôn câu gốc (SRS) →", "Review Verses (SRS) →")}
              </Link>
            </div>
          </div>
        </BentoCard>

        {/* Small Group Fellowship */}
        <BentoCard
          title={bilingual("Nhóm Tế Bào Của Bạn", "Your Life Group")}
          subtitle={bilingual("Dallas Family Fellowship • Thứ Sáu 19:30", "Dallas Family Fellowship • Friday 7:30 PM")}
          badge={
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {bilingual("Đã Tham Gia", "Active Member")}
            </span>
          }
        >
          <div className="mt-3 space-y-3 text-xs text-slate-700">
            <div className="p-3 bg-[#FBF9F5] rounded-xl border border-amber-100 space-y-1">
              <div className="font-semibold text-slate-900">{bilingual("Địa điểm tuần này:", "Meeting Location:")}</div>
              <p className="text-slate-600">
                {bilingual("Tư gia Bác Trần Long (Plano, TX) hoặc qua Zoom", "Long Tran Residence (Plano, TX) or via Zoom")}
              </p>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-500 font-serif">{bilingual("Chủ đề: Sống Đắc Thắng", "Topic: Victorious Living")}</span>
              <Link href="/dashboard/groups" className="text-indigo-900 font-bold hover:underline cursor-pointer">
                {bilingual("Chi tiết buổi nhóm →", "Group Details →")}
              </Link>
            </div>
          </div>
        </BentoCard>

        {/* Prayer Sanctuary Wall */}
        <BentoCard
          title={bilingual("Lời Cầu Thay Cho Hội Thánh", "Church Prayer Wall")}
          subtitle={bilingual("Cầu nguyện cho chức vụ & người đau ốm", "Prayers for ministries and the sick")}
          badge={
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1">
              <Heart className="w-3 h-3 fill-rose-600 text-rose-600" /> {bilingual("Cần Cầu Thay", "Intercession Needed")}
            </span>
          }
        >
          <div className="mt-3 space-y-3 text-xs text-slate-700">
            <p className="bg-[#FBF9F5] p-3 rounded-xl border border-amber-100 italic font-serif leading-relaxed text-slate-800">
              {bilingual(
                '"Xin cầu nguyện cho chuyến truyền giáo mùa đông của Ban Thanh Niên và các ca bệnh trong tuần..."',
                '"Please pray for the Youth Winter Mission Trip and members recovering from illness this week..."',
              )}
            </p>
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => {
                  if (!hasPrayed) {
                    setPrayedCount((p) => p + 1);
                    setHasPrayed(true);
                  }
                }}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  hasPrayed
                    ? "bg-amber-100 text-amber-900 border-amber-300"
                    : "bg-white text-indigo-950 border-amber-300/80 hover:bg-amber-50/70"
                }`}
              >
                <span>🙏</span>
                <span>{hasPrayed ? bilingual("Đã Hiệp Nguyện", "Prayed Together") : bilingual("Tôi Hiệp Nguyện", "I Will Pray")}</span>
                <span className="text-[10px] bg-amber-200/70 px-1.5 py-0.5 rounded-full font-bold">
                  {prayedCount}
                </span>
              </button>
              <Link href="/dashboard/prayers" className="text-indigo-900 font-bold hover:underline cursor-pointer">
                {bilingual("Tường cầu thay →", "Prayer Wall →")}
              </Link>
            </div>
          </div>
        </BentoCard>
      </section>
    </div>
  );
}
