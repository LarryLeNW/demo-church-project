# Bản Kế Hoạch & Thiết Kế UX/UI: Church LMS & Discipleship Platform
> **Phong cách cốt lõi:** *Sacred Grace & Reverent Serenity* — Thánh khiết, trang trọng, uy nghi và tôn vinh Chúa Cứu Thế Jesus Christ. Độc đáo, thanh tao, chuẩn công thái học và khả năng tiếp cận WCAG 2.1 AA.

---

## 1. Triết Lý Thiết Kế: "Soli Deo Gloria" (Chỉ Vì Sự Vinh Hiển Của Đức Chúa Trời)

Nền tảng phục vụ Hội Thánh Chúa, các Mục sư, Tín hữu và con dân Ngài tại Mỹ:
- **Tôn vinh Chúa Jesus:** Mọi chi tiết thiết kế từ phông chữ, khoảng trắng đến màu sắc đều gợi lên sự thánh khiết, ân điển, tình yêu thương và quyền năng của Chúa.
- **Tránh hai thái cực sai lầm:**
  1. *Không dùng phong cách cợt nhả, nhí nhảnh (tránh icon hoạt hình, nút bấm game thiếu nghiêm túc).*
  2. *Không dùng phong cách phần mềm văn phòng xám xịt, khô cứng, thiếu sức sống tâm linh.*
- **Cảm hứng kiến trúc & văn hóa Cơ Đốc:**
  * **Ánh sáng Thiên Thượng (Divine Light):** Sự ấm áp của ánh nến thờ phượng, ánh bình minh phục sinh.
  * **Trang Sách Kinh Thánh Cổ (Sacred Parchment):** Tông màu giấy da ngà, viền chỉ vàng tế nhị mang lại sự thư thái và trang nghiêm khi đọc Lời Chúa.
  * **Sự Trang Nghiêm của Thánh Đường (Cathedral Elegance):** Bố cục cân đối, đường nét thanh thoát, tạo không gian tĩnh lặng để tín hữu tương giao với Chúa.

---

## 2. Hệ Thống Màu Sắc Thánh Kinh (Sacred Biblical Palette)

Hệ màu được xây dựng dựa trên các biểu tượng thuộc linh trong Kinh Thánh với tỉ lệ vàng **60 - 30 - 10**:

| Vai trò | Tên màu | Mã Hex | Tailwind Class | Ý nghĩa Kinh Thánh & Ứng dụng thực tế |
| :--- | :--- | :--- | :--- | :--- |
| **Theme Chính (Primary)** | SAM Brand Primary | `#F17F34` / `#DE6D22` | `bg-[#F17F34]`, `text-[#F17F34]`, `bg-primary` | Màu cam/amber chủ đạo thương hiệu Spiritual Advance Ministry (`saministry.org`). Dùng cho nút hành động chính, active navigation, focus ring và điểm nhấn trung tâm. |
| **Nền Tảng (60%)** | Sacred Parchment | `#FBF9F5` & `#FFFFFF` | `bg-[#FBF9F5]`, `bg-white` | Màu giấy da cuộn chép Kinh Thánh. Tạo cảm giác bình an, dịu mắt khi suy ngẫm Lời Chúa sáng sớm. |
| **Văn Bản & Viền** | Sanctuary Midnight | `#0F172A` | `text-slate-900`, `border-slate-800` | Chiều sâu thánh khiết, màu mực đen ánh xanh của các bản thảo Kinh Thánh cổ. Tương phản sắc nét tuyệt đối. |
| **Tông Phụ (Secondary)** | Royal Majesty Indigo | `#312E81` / `#3730A3` | `bg-indigo-900`, `text-indigo-900` | Sắc áo hoàng gia của Vua muôn vua (Jesus King of kings), thẩm quyền Lời Chúa. Dùng cho Header phụ, thẻ quản trị. |
| **Điểm Nhấn 1** | Covenant Gold | `#B45309` / `#D97706` | `bg-amber-600`, `text-amber-600` | Ánh sáng vinh hiển, ngọn lửa Đức Thánh Linh, mão triều thiên sự sống. Dùng cho chuỗi Tĩnh nguyện, biểu tượng vinh quang. |
| **Điểm Nhấn 2** | Living Vine Olive | `#15803D` / `#047857` | `bg-emerald-700`, `text-emerald-700` | Nhành nho sự sống (*Giăng 15:5*), sự tăng trưởng đức tin. Dùng cho trạng thái "Đã nhậm lời cầu nguyện", hoàn thành khóa học. |
| **Điểm Nhấn 3** | Sacrificial Crimson | `#991B1B` | `bg-rose-800`, `text-rose-800` | Dấu huyết chuộc tội của Chúa Jesus trên Thập tự giá. Dùng trang nghiêm cho Lễ Tiệc Thánh và lời cầu thay khẩn thiết. |

---

## 3. Kiểu Dáng & Biểu Tượng Tôn Giáo Đặc Trưng (Visual Signatures)

### 3.1. Nút Bấm "Sacred Reverence" (Trang Nghiêm & Tinh Tế)
- Nút bấm bo góc nhẹ nhàng `rounded-xl` (12px), nền xanh hoàng gia `bg-indigo-900` hoặc vàng kim cổ `bg-amber-600`.
- Viền chỉ mạ vàng mảnh tinh xảo `border border-amber-400/40`, đổ bóng mờ trang trọng `shadow-md shadow-indigo-950/20`.
- Biểu tượng Thập tự giá thanh mảnh (`†`) đứng đầu nhãn nút tạo điểm nhấn đức tin thanh tao.

### 3.2. Bố Cục Bảng Thánh (Sanctuary Bento Grid)
- Bố cục chia khối trang nghiêm, khoảng cách thoáng đãng, phân chia 4 khu vực trung tâm:
  1. *Câu Gốc Nền Tảng Hôm Nay (Daily Scripture).*
  2. *Lộ Trình Đọc Kinh Thánh (Bible Reading Progress).*
  3. *Buổi Nhóm Tế Bào Sắp Tới (Small Group Fellowship).*
  4. *Tường Cầu Thay Cho Hội Thánh (Prayer Requests).*

### 3.3. Thẻ Ghi Nhớ Câu Gốc (Leather Bookmark Scripture Card)
- Thiết kế như dải ruy-băng hoặc thẻ kẹp sách Kinh Thánh bằng da cổ điển.
- Font chữ Serif trang trọng cổ kính (`Playfair Display` / `Cinzel`), có nút phát âm audio đọc câu gốc bằng giọng truyền cảm, ấm áp.

### 3.4. Tường Cầu Thay (Prayer Sanctuary Wall)
- Lời cầu nguyện hiển thị trên nền giấy ngà với viền mạ vàng thanh lịch.
- Nút bấm **"Tôi Cùng Hiệp Nguyện 🙏"**: Khi bấm, vòng hào quang vàng ấm (gentle halo aura) phát sáng nhẹ nhàng, con số nhảy tăng và gửi lời chúc phước bình an đến người cầu xin.

### 3.5. Khu Vực Dâng Hiến (Honor the Lord with Giving)
- Trích dẫn câu Lời Chúa khích lệ: *"Hãy lấy tài vật và hoa quả đầu mùa của con mà tôn vinh Đức Giê-hô-va" (Châm ngôn 3:9)*.
- Giao diện dâng hiến Stripe / ACH trang trọng, tối giản, minh bạch các quỹ (Thập phân, Truyền giáo, Xây dựng).

---

## 4. Công Thái Học UX & Phục Vụ Con Dân Chúa Mọi Lứa Tuổi

1. **Thân thiện với Tín hữu Cao Niên (Senior-Friendly Accessibility):**
   - Hỗ trợ công cụ phóng to cỡ chữ (A- / A+) trực tiếp trên thanh điều hướng để các Mục sư hưu trí, Chấp sự và Phụ lão đọc Kinh Thánh rõ ràng, không mỏi mắt.
   - Diện tích chạm cảm ứng tối thiểu **$48 \times 48\text{px}$**, không bao giờ bấm nhầm.
2. **Chế Độ Tĩnh Nguyện Chuyên Tâm (Sanctuary Focus Mode):**
   - Khi tín hữu mở đọc một phân đoạn Kinh Thánh hoặc học bài giảng, hệ thống cung cấp nút bấm bật chế độ toàn màn hình: ẩn mọi thông báo, chuyển nền sang màu trang sách êm dịu giúp tâm trí tập trung trọn vẹn vào Lời Ngài.
3. **Bảo Mật Lời Cầu Nguyện Riêng Tư (Pastoral Confidentiality):**
   - Tín hữu có thể chọn mục *"Chỉ gửi riêng cho Mục sư Quản nhiệm"*. Lời tâm sự sâu kín được mã hóa và bảo vệ tuyệt đối, thể hiện sự kính trọng đời tư và lương tâm thuộc linh.

---

## 5. Cấu Hình Font Chữ & Thiết Lập Frontend

- **Font Tiêu đề & Kinh Thánh:** `Playfair Display` kết hợp `Cinzel` (Google Fonts).
- **Font Giao diện & Thân bài:** `Be Vietnam Pro` (tiếng Việt chuẩn mực) & `Inter` (tiếng Anh bản địa).
- **Biểu tượng:** `lucide-react` kết hợp các ký hiệu Thánh thanh tao (Cross `†`, Dove, Olive branch, Open Bible).
