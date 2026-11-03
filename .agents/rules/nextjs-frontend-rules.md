# Next.js Frontend Coding Rules (Base: idhub)

Tài liệu quy chuẩn kiến trúc và phong cách lập trình cho Frontend Next.js, kế thừa trực tiếp từ tiêu chuẩn của `C:\dev\products\idhub`. Mọi mã nguồn giao diện phải tuân thủ nghiêm ngặt các quy tắc dưới đây.

---

## 1. Công Nghệ & Khung Nền Tảng (Core Stack)

* **Next.js App Router (Thư mục `src/app/`):**
  * Tận dụng tối đa **React Server Components (RSC)** cho việc fetch dữ liệu ban đầu và SEO.
  * Chỉ dùng `"use client"` ở ngọn cây component khi thực sự cần: state (`useState`), effect (`useEffect`), event listener, hoặc tương tác giao diện (audio recording, lật flashcard, popups).
* **React 19 & TypeScript 5+:** Không dùng `any`, luôn định nghĩa kiểu tường minh trong `src/types/`.
* **Tailwind CSS v4:** Sử dụng utility classes kết hợp hàm gộp class `cn()` (`src/lib/cn.ts`).
* **Icons:** `lucide-react` (thống nhất `strokeWidth={2}` hoặc `2.25` bo góc mềm mại).

---

## 2. Cấu Trúc Thư Mục Chuẩn (`src/`)

```
src/
├── app/                  # App Router: Layouts, Pages, Error boundaries, Not-found
│   ├── (auth)/           # Route group cho đăng nhập, đăng ký, quên mật khẩu
│   ├── (dashboard)/      # Shell giao diện quản trị của Giáo viên / Trợ giảng
│   ├── (student)/        # Shell giao diện học tập của Học viên (Mobile-first)
│   └── (store)/          # Trang chủ giới thiệu, giỏ hàng, thanh toán VietQR
├── components/
│   ├── ui/               # Primitives: Button, Input, Modal, Badge, Dropdown
│   ├── layout/           # Header, Sidebar, BottomNav (mobile), Footer
│   └── <domain>/         # speaking/, writing/, flashcard/, attendance/
├── lib/
│   ├── api/              # API Client & Services (Kế thừa từ idhub)
│   │   ├── client.ts     # Core fetcher: Tự gắn Bearer token, tự refresh 401
│   │   ├── token-store.ts# Quản lý lưu trữ Access/Refresh token
│   │   └── <services>.ts # auth.ts, courses.ts, classes.ts, finance.ts
│   ├── cn.ts             # Helper gộp className (clsx)
│   ├── dates.ts          # Format ngày tháng định dạng Việt Nam (date-fns hoặc Intl)
│   └── format.ts         # Format tiền tệ (VND: 150.000đ), số điện thoại
└── types/                # Types/Interfaces khớp với Entity và DTO từ Backend
```

---

## 3. Quy Chuẩn API Client (Pattern từ `idhub`)

1. **Khởi tạo API Client tập trung (`src/lib/api/client.ts`):**
   * Tự động nhận diện môi trường: `NEXT_PUBLIC_API_URL` (client-side) và `API_INTERNAL_URL` (server-side).
   * **Cơ chế Refresh Token tự động:** Khi request trả về mã `401 Unauthorized`, interceptor tự động gọi `POST /api/auth/refresh` bằng `refreshToken`. Nếu thành công, lưu lại token mới và retry request ban đầu mà không làm gián đoạn người dùng.
   * **Chuẩn hóa Upload URL (`normalizeUploadedMedia`):** Đảm bảo các link ảnh/audio từ backend localhost được chuyển thành relative path an toàn cho môi trường production/staging.
2. **Xử lý Lỗi Tường Minh (`ApiError`):**
   * Bắt buộc bọc lỗi trả về thành instance `ApiError` chứa `status`, `message`, và `details`.
   * Giao diện UI bắt lỗi và hiển thị thông báo thân thiện (SweetAlert2 / Sonner Toast).

---

## 4. Tích Hợp Phong Cách UX/UI "Playful Sophistication"

Mọi component UI phải tuân thủ hướng dẫn trong [UI_UX_SPECIFICATION.md](file:///C:/dev/products/teacher/UI_UX_SPECIFICATION.md):
* **Nút bấm & Card xúc giác:** Ưu tiên hiệu ứng nảy nhẹ (`shadow-[0_4px_0_0_#0f172a]`, `hover:translate-y-0.5`).
* **Bo góc:** Dùng tối thiểu `rounded-2xl` hoặc `rounded-3xl`.
* **Bảng màu:**
  * Chủ đạo: `#4F46E5` (Indigo Electric)
  * Điểm nhấn hành động / Streak: `#F97316` (Tangerine Spark)
  * Thành tựu: `#10B981` (Cyber Mint)
  * Nền: `#F8FAFC` & Chữ: `#0F172A` (Deep Navy)
* **Mobile-First Touch Target:** Đảm bảo mọi khu vực chạm ngón tay $\ge 44 \times 44\text{px}$.
