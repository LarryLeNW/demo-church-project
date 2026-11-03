# Quy Chuẩn Review Code Frontend (Next.js & UI/UX Review Rules)

Bộ tiêu chuẩn đánh giá mã nguồn bắt buộc (Code Review Checklist) cho toàn bộ Frontend Next.js, kế thừa kiến trúc từ `C:\dev\products\idhub` và tiêu chuẩn thiết kế [Playful Sophistication](file:///C:/dev/products/teacher/UI_UX_SPECIFICATION.md). Mọi Pull Request, component UI hoặc trang mới phải được kiểm tra theo danh sách này.

---

## 1. Kiến Trúc Next.js & React 19

- [ ] **Tối ưu Server Components (RSC):**
  - Mặc định các file page và layout là Server Component để tận dụng render phía máy chủ và SEO.
  - Chỉ thêm `"use client"` ở component nhỏ nhất có tương tác (interactive leaf), ví dụ: nút bấm mở modal, trình ghi âm Speaking, thẻ lật Flashcard, widget tính chuỗi ngày Streak.
  - **Không** bọc `"use client"` ở toàn bộ file page lớn nếu bên trong có thể tách thành các Server Component con.
- [ ] **Type Safety Tuyệt Đối (Không Dùng `any`):**
  - Mọi prop của component, dữ liệu trả về từ API đều phải có interface/type rõ ràng trong `src/types/`.
  - Không ép kiểu cưỡng bức `as any` để né tránh lỗi TypeScript.

---

## 2. Chuẩn Tích Hợp API Client (Theo Mẫu `idhub`)

- [ ] **Dùng đúng `apiClient` (`src/lib/api/client.ts`):**
  - Tuyệt đối không tự tiện dùng `fetch()` trần hoặc cài thêm thư viện `axios` gây phình bundle.
  - Đảm bảo request tự động được gán Bearer Token và hỗ trợ tự làm mới token xoay vòng (rotating refresh token) khi gặp lỗi 401.
- [ ] **Xử lý Đầy Đủ 4 Trạng Thái Giao Diện (State Coverage):**
  - [ ] **Loading State:** Có hiển thị Skeleton loader bo góc mềm mại thay vì spinner giật cục làm nhảy layout.
  - [ ] **Empty State:** Khi không có dữ liệu (chưa có bài tập, chưa có học sinh), hiển thị mascot hoặc thông báo thân thiện kèm nút hành động.
  - [ ] **Error State:** Bắt `ApiError` và hiển thị thông báo lỗi tiếng Việt dễ hiểu qua Toast hoặc Alert.
  - [ ] **Success State:** Phản hồi tức thì khi thao tác thành công (ví dụ: thông báo lưu thành công, hiệu ứng confetti khi nộp bài).

---

## 3. Thẩm Mỹ "Playful Sophistication" (Cute, Độc Lạ, Bắt Mắt)

- [ ] **Hiệu Ứng Xúc Giác Nổi Bật (Tactile Pop Buttons & Cards):**
  - Nút bấm chính có viền đậm `border-2 border-slate-900` và bóng vật lý `shadow-[0_4px_0_0_#0f172a]`.
  - Có hiệu ứng bấm nảy vật lý: `hover:translate-y-0.5`, `active:translate-y-1 active:shadow-none`.
- [ ] **Bo Góc Hào Phóng (Smooth Radii):**
  - Khối thẻ, modal, khung bài tập đạt tối thiểu `rounded-2xl` (16px) hoặc `rounded-3xl` (24px). Tuyệt đối không dùng bo góc nhọn hoắt gây cảm giác căng thẳng.
- [ ] **Bảng Màu Chuẩn (Không Lòe Loẹt, Không Khô Khan):**
  - Màu chủ đạo: **Indigo Electric (`#4F46E5`)**.
  - Màu điểm nhấn hành động / Streak: **Tangerine Spark (`#F97316`)**.
  - Màu trạng thái hoàn thành: **Cyber Mint (`#10B981`)**.
  - Nền trang: `#F8FAFC` sạch sẽ; Văn bản chính: **Deep Navy (`#0F172A`)** (không dùng xám nhạt mờ mắt).
- [ ] **Bố Cục Bento Grid:**
  - Dashboard học sinh & giáo viên phân chia khối thông minh, rõ ràng, không dồn cục thông tin.

---

## 4. Công Thái Học UX & Khả Năng Tiếp Cận (Accessibility & UX Safety)

- [ ] **Diện Tích Chạm Trên Mobile (Touch Target):**
  - Mọi nút bấm, icon bấm được trên màn hình cảm ứng điện thoại phải đạt kích thước tối thiểu **$44 \times 44\text{px}$** (chuẩn Fitts' Law / WCAG).
- [ ] **Độ Tương Phản Màu Sắc (WCAG 2.1 AA):**
  - Tỉ lệ tương phản giữa chữ và nền luôn $\ge 4.5:1$. Tuyệt đối không dùng chữ xám nhạt trên nền trắng.
- [ ] **Chống Mất Dữ Liệu Học Viên (Safety Guard):**
  - Trình soạn thảo bài luận Writing có tự động lưu nháp (auto-save).
  - Có cảnh báo ngăn chặn rời trang (`beforeunload` hoặc router event) khi học viên đang thu âm Speaking dở dang.
- [ ] **Zero Cumulative Layout Shift (CLS = 0):**
  - Tất cả hình ảnh và video player đều có kích thước khung hình cố định (aspect-ratio), không làm giật khung khi tải xong media.

---

## 5. Dọn Dẹp Tài Nguyên & Chống Rò Rỉ Bộ Nhớ (Memory Cleanup)

- [ ] **Dọn dẹp `useEffect`:**
  - Mọi `setInterval`, `setTimeout`, hoặc event listener thêm vào window/document phải có hàm cleanup return tương ứng.
- [ ] **Giải Phóng Luồng Media (Audio/Microphone):**
  - Trình ghi âm Speaking phải gọi `stream.getTracks().forEach(track => track.stop())` khi component unmount hoặc khi ghi âm xong, tránh giữ quyền micro trên trình duyệt gây hao pin và vi phạm bảo mật.
