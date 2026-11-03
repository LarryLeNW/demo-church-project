# AGENTS.md - Context & Hướng dẫn cho AI Agent

Tài liệu này cung cấp ngữ cảnh cốt lõi và mục tiêu dài hạn của dự án **Church LMS & Discipleship Platform** (Nền tảng Quản trị Đào tạo Môn Đồ Hóa, Trường Chúa Nhật & Dâng Hiến Trực Tuyến dành cho các Hội Thánh tại Mỹ / US Churches).

---

## 1. Mục Tiêu Cốt Lõi của Dự Án (Project Mission)

Xây dựng hệ thống toàn diện **All-in-One** giúp các Hội Thánh tại Mỹ (US Churches & Vietnamese-American Ministries):
1. **Môn đồ hóa có hệ thống:** Theo dõi hành trình đức tin từ Tân tín hữu $\rightarrow$ Báp-têm $\rightarrow$ Môn đồ hóa $\rightarrow$ Đào tạo Lãnh đạo mục vụ.
2. **Kho bài giảng & Lớp học trực tuyến:** Tổ chức các lớp học Trường Chúa Nhật (Sunday School), đào tạo Chấp sự, kho bài giảng (Sermon Vault) song ngữ Anh - Việt.
3. **Quản lý Nhóm Nhỏ (Small Groups / Life Groups):** Điểm danh buổi nhóm, chia sẻ câu hỏi thảo luận, tường cầu thay (Prayer Wall) và cảnh báo tín hữu vắng mặt dài ngày (Absentee Alert) để mục sư thăm viếng.
4. **Công cụ thói quen thuộc linh:** Ghi nhớ Lời Chúa (Scripture Memory SRS), Đọc Kinh Thánh hằng ngày (Bible Reading Plan) với chuỗi ngày liên tục (Devotional Streak).
5. **Dâng hiến trực tuyến chuẩn Mỹ (US Giving):** Tích hợp Stripe / ACH Bank Transfer dâng hiến một lần hoặc định kỳ, tự động xuất biên nhận thuế cuối năm theo quy chuẩn **IRS 501(c)(3)**.
6. **Bảo mật & An toàn Nhi đồng:** Hệ thống điểm danh an toàn cho lớp Thiếu nhi (Child Check-in) và quản lý trạng thái kiểm tra an toàn tình nguyện viên.

Chi tiết nghiệp vụ đầy đủ: [PROJECT_GOAL.md](file:///C:/dev/products/teacher/PROJECT_GOAL.md).  
Lộ trình Sprint kỹ thuật chi tiết: [MASTER_DEVELOPMENT_PLAN.md](file:///C:/dev/products/teacher/MASTER_DEVELOPMENT_PLAN.md).

---

## 2. Các Vai Trò Người Dùng (User Roles & RBAC)

- **Senior Pastor / Church Admin (Mục sư / Ban Trị sự):** Toàn quyền cấu hình hệ thống, quản lý tín hữu, các mục vụ, báo cáo tài chính dâng hiến và xuất chứng từ thuế 501(c)(3).
- **Ministry Leader / Sunday School Teacher (Trưởng ban / Giáo viên):** Quản lý lớp học, nhóm nhỏ tế bào, điểm danh, nhận xét bài học, duyệt lời cầu thay. Tuyệt đối **không xem** dữ liệu dâng hiến cá nhân của tín hữu.
- **Member / Disciple (Tín hữu / Môn đồ):** Xem bài học, đọc Kinh Thánh hằng ngày, ôn câu gốc ghi nhớ Lời Chúa, gửi lời cầu thay, dâng hiến và tải biên nhận thuế.
- **Parent (Phụ huynh):** Điểm danh an toàn cho con tại lớp Thiếu nhi, nhận bài học gia đình hàng tuần.

---

## 3. Kiến Trúc Tính Năng Cốt Lõi (Core Modules)

1. **Discipleship & Christian Education Module:** Khóa học video, bài học Kinh Thánh, ghi chú bài giảng tương tác, song ngữ Anh - Việt.
2. **Small Groups & Pastoral Care Module:** Danh sách nhóm nhỏ, điểm danh, Tường cầu thay (Prayer Wall), Cảnh báo vắng mặt (Absentee Alert).
3. **Spiritual Habits & Scripture Memory (SRS):** Ôn câu gốc Lời Chúa theo thuật toán ngắt quãng, kế hoạch đọc Kinh Thánh trọn năm.
4. **Giving & US 501(c)(3) Tax Statements:** Dâng hiến Stripe/ACH, dâng hiến định kỳ, xuất file PDF báo cáo thuế khấu trừ từ thiện.
5. **Multi-channel Communication:** SMS Twilio, Email Newsletter Resend/SendGrid, bản tin điện tử (Church Bulletin).
6. **Child Safety Check-in:** In tem an toàn phụ huynh - con nhỏ lớp Trường Chúa Nhật.

---

## 4. Nguyên Tắc Thiết Kế UX/UI: "Sacred Grace & Reverent Serenity" (Thánh Khiết & Uy Nghi)

Giao diện được thiết kế theo phong cách tôn giáo trang nghiêm, thánh khiết, thanh tao và tôn vinh Chúa Cứu Thế Jesus Christ (**Soli Deo Gloria**):
- Đọc chi tiết tại [UI_UX_SPECIFICATION.md](file:///C:/dev/products/teacher/UI_UX_SPECIFICATION.md) và kích hoạt skill `teacher-ux-ui`.
- **Tuyệt đối không dùng** hoạt họa nhí nhảnh, sticker cợt nhả hay nút bấm game thô kệch.
- **Tông màu Thánh Kinh:** **Sacred Parchment (`#FBF9F5`)** nền giấy ngà, **Royal Majesty Indigo (`#312E81`)** hoàng gia thánh khiết, **Covenant Gold (`#B45309`, `#D97706`)** ánh vinh hiển và mão triều thiên, **Living Vine Olive (`#15803D`)** sự sống tâm linh, và **Sacrificial Crimson (`#991B1B`)** tình yêu hy sinh trên thập tự giá.
- **Font chữ:** Font Serif cổ điển uy nghi (`Playfair Display` / `Cinzel`) cho tiêu đề và Lời Chúa; font Sans-serif trang nhã (`Be Vietnam Pro` / `Inter`) cho giao diện.
- **Công thái học tôn giáo:** Chuẩn WCAG 2.1 AA, nút chạm lớn $\ge 48\text{px}$, hỗ trợ phóng to cỡ chữ cho Mục sư, Chấp sự và Tín hữu cao niên, chế độ Tĩnh nguyện toàn màn hình (Sanctuary Reading Mode).

---

## 5. Quy Chuẩn Code Kế Thừa Từ Base `idhub`

Mọi mã nguồn Backend (NestJS 12 ESM) và Frontend (Next.js 16 + React 19) tiếp tục tuân thủ nghiêm ngặt 2 bộ quy tắc:
1. **[Backend NestJS Rules](file:///C:/dev/products/teacher/.agents/rules/nestjs-backend-rules.md):** 100% relative imports đuôi `.js`, bảo vệ mặc định bằng `JwtAuthGuard` & `RolesGuard`, bảo mật hash mật khẩu/token.
2. **[Frontend Next.js Rules](file:///C:/dev/products/teacher/.agents/rules/nextjs-frontend-rules.md):** Next.js App Router, API Client tự động xoay vòng refresh token, Tailwind CSS v4.

---

## 6. Quy Chuẩn Review Code

- **[Backend Review Rules](file:///C:/dev/products/teacher/.agents/rules/backend-review-rules.md)**
- **[Frontend Review Rules](file:///C:/dev/products/teacher/.agents/rules/frontend-review-rules.md)**
