# Kế Hoạch & Đặc Tả Dự Án: Church LMS & Discipleship Platform (US Market)

Nền tảng Quản trị Đào tạo Môn Đồ Hóa, Trường Chúa Nhật, Nhóm Tế Bào và Dâng Hiến Trực Tuyến dành cho các **Hội Thánh tại Mỹ (US Churches & Vietnamese-American Ministries)**.

---

## 1. Bối Cảnh & Tầm Nhìn Sản Phẩm (Vision & US Market Context)

### 1.1. Bối cảnh Thị trường Hội thánh tại Mỹ
- **Thực trạng:** Các Hội thánh tại Mỹ (cả Hội thánh bản địa và Hội thánh người Việt) gặp khó khăn trong việc:
  1. Theo dõi lộ trình thuộc linh của tín hữu (từ Thân hữu $\rightarrow$ Báp-têm $\rightarrow$ Môn đồ hóa $\rightarrow$ Lãnh đạo mục vụ).
  2. Quản lý lớp Trường Chúa Nhật (Sunday School), tài liệu bài học và bài giảng lưu trữ (Sermon Vault).
  3. Kết nối và chăm sóc các Nhóm nhỏ / Nhóm tế bào (Small Groups / Life Groups) phân tán theo khu vực địa lý.
  4. Thu hút thế hệ trẻ (Gen Z, thanh thiếu niên) qua nền tảng hiện đại, có tính tương tác cao (Gamification, Scripture Memory).
  5. Xử lý Dâng hiến (Tithes & Offerings) trực tuyến và xuất báo cáo tài chính khấu trừ thuế cuối năm theo luật **US 501(c)(3)**.

### 1.2. Các Vai Trò Người Dùng (Target Personas)
1. **Senior Pastor / Church Admin (Mục sư Quản nhiệm / Ban Trị sự):**
   - Xem tổng quan sức khỏe Hội thánh: số lượng tín hữu, tiến độ học Lời Chúa, tình hình dâng hiến và các cảnh báo tín hữu vắng mặt dài ngày.
2. **Ministry Leader / Sunday School Teacher (Trưởng Ban / Giáo viên Trường Chúa Nhật / Trưởng Nhóm Tế bào):**
   - Quản lý lớp học, điểm danh buổi nhóm, gửi tài liệu thảo luận tuần, theo dõi lời cầu thay (Prayer Requests).
3. **Church Member / Disciple (Tín hữu / Môn đồ):**
   - Học các khóa đào tạo môn đồ, đọc Kinh Thánh theo kế hoạch hằng ngày (Bible Reading Plan), ghi nhớ Lời Chúa (Scripture Memory), dâng hiến trực tuyến (Stripe).
4. **Parent (Phụ huynh lớp Thiếu nhi - Sunday School Kids):**
   - Xem bài học Kinh Thánh của con, tài liệu ôn tập gia đình (Family Devotional) và điểm danh an toàn (Child Check-in).

---

## 2. Chi Tiết Các Module Tính Năng (Core Functional Modules)

### Module 1: Lộ Trình Môn Đồ Hóa & Khóa Học Thánh Kinh (Discipleship Pathways)
- **Lộ trình Môn đồ hóa (Spiritual Milestones):**
  - Giai đoạn 1: Lớp Tân tín hữu & Căn bản Thánh Kinh.
  - Giai đoạn 2: Lớp Chuẩn bị Báp-têm & Tuyên xưng Đức tin.
  - Giai đoạn 3: Đào tạo Môn đồ hóa 1-kèm-1 hoặc nhóm nhỏ.
  - Giai đoạn 4: Đào tạo Chấp sự, Trưởng ban, Nhân sự Mục vụ (Leadership Track).
- **Khóa học Video & Kho Bài giảng (Sermon & Lecture Library):**
  - Xem video bài giảng kèm ghi chú tương tác (Interactive Sermon Notes).
  - Tải file bài học PDF, câu hỏi thảo luận nhóm (Discussion Guides).
  - Song ngữ Anh - Việt (Bilingual UI & Content) tối ưu cho Hội thánh đa thế hệ tại Mỹ.

### Module 2: Nhóm Tế Bào & Trường Chúa Nhật (Small Groups & Sunday School)
- **Quản lý Nhóm Nhỏ (Life Groups):**
  - Tìm kiếm nhóm tế bào theo khu vực (Zipcode), độ tuổi (Thanh niên, Gia đình trẻ, Trung tráng niên).
  - Lịch họp nhóm (Online qua Zoom hoặc gặp trực tiếp tại tư gia).
- **Điểm danh & Chăm sóc Tín hữu (Attendance & Care):**
  - Điểm danh buổi học Trường Chúa Nhật / Nhóm tế bào.
  - **Absentee Early Warning (Cảnh báo vắng mặt):** Tín hữu vắng mặt 2-3 tuần liên tiếp $\rightarrow$ Hệ thống cảnh báo tự động gửi đến Mục sư / Trưởng nhóm để liên hệ thăm viếng kịp thời.
- **Tường Cầu Thay (Prayer Request Wall):**
  - Gửi lời cầu thay công khai cho Hội thánh hoặc gửi riêng tư chỉ Mục sư/Ban Cầu nguyện nhìn thấy.
  - Đánh dấu "Đã được Chúa nhậm lời" (Answered Prayers) để khích lệ đức tin cộng đồng.

### Module 3: Công Cụ Thói Quen Thuộc Linh (Spiritual Habit & Scripture Memory)
- **Hệ thống Ghi nhớ Lời Chúa (Scripture Memory SRS):**
  - Ứng dụng thuật toán lặp lại ngắt quãng (SRS) giúp tín hữu ghi nhớ các câu Kinh Thánh nền tảng.
  - Hỗ trợ các bản dịch Kinh Thánh phổ biến tại Mỹ: ESV, NIV, KJV, NLT và Bản Truyền Thống RVV11 (Tiếng Việt).
- **Kế hoạch Đọc Kinh Thánh Hằng Ngày (Daily Bible Reading Plan):**
  - Đọc Kinh Thánh trọn năm (Bible in One Year) hoặc theo chủ đề.
  - Nhật ký Tĩnh nguyện cá nhân (Devotional Journaling) kèm tính năng lưu riêng tư.
- **Gamification Thuộc Linh:**
  - Chuỗi ngày tĩnh nguyện liên tục (Devotional Streak).
  - Huy hiệu hoàn thành sách Kinh Thánh hoặc khóa học.

### Module 4: Dâng Hiến Trực Tuyến & Biên Nhận Thuế US (Giving & 501(c)(3) Tax Statements)
- **Cổng Thanh Toán Mỹ (Stripe & ACH Bank Transfer):**
  - Dâng hiến qua thẻ Visa/Mastercard/Amex, Apple Pay, Google Pay hoặc chuyển khoản ngân hàng ACH (phí thấp).
  - Dâng hiến một lần (One-time) hoặc Dâng hiến tự động định kỳ (Recurring Giving: Hàng tuần, Ngày 1 & 15 hàng tháng).
  - Phân loại quỹ dâng: Quỹ Tổng hội (General Tithes), Quỹ Truyền giáo (Missions), Quỹ Xây dựng (Building Fund), Quỹ Bác ái (Benevolence).
- **Báo cáo Thuế Cuối Năm (End-of-Year Giving Statements):**
  - Tự động xuất file PDF báo cáo tổng kết dâng hiến cả năm hợp lệ để khai thuế khấu trừ từ thiện tại Mỹ (IRS Charitable Contribution Deduction).

### Module 5: Truyền Thông & Thông Báo Đa Kênh (US Communications)
- **Tích hợp SMS (Twilio) & Email (Resend / SendGrid):**
  - Gửi tin nhắn SMS nhắc giờ nhóm, thông báo khẩn từ Mục sư.
  - Email Newsletter hàng tuần tổng hợp bài giảng Chủ nhật và lịch sinh hoạt.
- **Bản tin Hội thánh (Church Bulletin):**
  - Tờ chương trình thờ phượng điện tử cập nhật hàng tuần trên mobile.

### Module 6: Bảo Mật & An Toàn Nhi Đồng (Security & Child Safety Compliance)
- **Bảo vệ Trẻ em (Child Check-in & Volunteer Clearance):**
  - Hệ thống Check-in in mã an toàn cho phụ huynh khi gửi con vào lớp Sunday School.
  - Quản lý trạng thái kiểm tra lý lịch an toàn (Background Check Status) của các tình nguyện viên dạy thiếu nhi theo luật bang tại Mỹ.
- **Phân quyền chặt chẽ (RBAC):**
  - Chỉ Mục sư Quản nhiệm và Thủ quỹ (Treasurer) mới được xem số liệu dâng hiến chi tiết của từng cá nhân.

---

## 3. Kiến Trúc Thực Thể Dữ Liệu (Core Database Entities)

1. `users`: `id (uuid)`, `email`, `phone`, `passwordHash`, `fullName`, `role` (SeniorPastor, MinistryLeader, Member, Guest), `avatarUrl`, `campusId`, `isActive`.
2. `spiritual_profiles`: `id`, `userId`, `salvationDate`, `baptismDate`, `membershipStatus`, `currentStage` (Seeker, Believer, Disciple, Leader).
3. `courses`: `id`, `title`, `slug`, `description`, `thumbnailUrl`, `category` (Theology, Discipleship, Leadership, Marriage), `language` (en, vi), `isPublished`.
4. `lessons`: `id`, `courseId`, `title`, `videoUrl`, `duration`, `studyGuideUrl`, `orderIndex`.
5. `lesson_progress`: `id`, `userId`, `lessonId`, `isCompleted`, `notes`.
6. `small_groups`: `id`, `name`, `leaderId`, `meetingSchedule`, `meetingLocation`, `zoomLink`, `zipcode`, `category` (Youth, YoungAdults, Families, Seniors).
7. `group_members`: `id`, `groupId`, `userId`, `joinedDate`, `role` (Leader, Core, Member).
8. `attendances`: `id`, `groupId` / `classId`, `userId`, `sessionDate`, `status` (Present, Absent, Excused), `notes`.
9. `scripture_memory`: `id`, `userId`, `verseReference` (e.g. "John 3:16"), `verseText`, `translation` (NIV, ESV, RVV11), `intervalDays`, `nextReviewDate`, `easeFactor`.
10. `prayer_requests`: `id`, `userId`, `title`, `content`, `isConfidential` (Pastor only), `isAnswered`, `praiseReport`, `createdAt`.
11. `donations`: `id`, `userId`, `amount`, `fundType` (Tithes, Missions, Building), `frequency` (OneTime, Weekly, Monthly), `stripePaymentIntentId`, `status`, `createdAt`.
12. `tax_receipts`: `id`, `userId`, `taxYear`, `totalAmount`, `pdfReceiptUrl`, `issuedAt`.
