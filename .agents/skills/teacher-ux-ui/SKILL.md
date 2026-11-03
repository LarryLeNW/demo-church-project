---
name: teacher-ux-ui
description: Tiêu chuẩn thiết kế UX/UI Thánh khiết, Trang trọng và Tôn giáo (Sacred Grace & Reverent Serenity) dành cho Church LMS & Discipleship Platform. Tôn vinh Chúa Jesus qua vẻ đẹp thánh thiện, tinh tế và chuẩn công thái học.
---

# Church LMS Sacred UX/UI Design Skill

Skill này định hình ngôn ngữ thiết kế, hệ thống design tokens, phong cách tôn giáo trang nghiêm và các tương tác tôn kính dành riêng cho nền tảng **Church LMS & Discipleship Platform**.

---

## 1. Triết Lý Thiết Kế: "Sacred Grace & Reverent Serenity" (Thánh Khiết, Ân Điển & Uy Nghi)

Mọi chi tiết giao diện đều được xây dựng với tinh thần **Soli Deo Gloria** (Chỉ vì sự vinh hiển của Đức Chúa Trời) và lòng tôn kính sâu sắc đối với **Chúa Cứu Thế Jesus Christ**:
- **TUYỆT ĐỐI KHÔNG:** Dùng hoạt họa nhí nhảnh, hiệu ứng hoạt hình cợt nhả, hoặc màu sắc lòe loẹt làm mất đi sự tôn nghiêm của Lời Chúa và Hội thánh.
- **TUYỆT ĐỐI KHÔNG:** Dùng giao diện SaaS khô cứng, xám xịt vô hồn như phần mềm kế toán.
- **ĐỊNH HƯỚNG CỐT LÕI:** Kết hợp giữa sự **trang trọng cổ điển của Thánh đường** (Cathedral Grace), chất liệu **giấy da Kinh Thánh** (Sacred Parchment), và sự **tinh tế, thanh thoát của ứng dụng thời đại mới**.

---

## 2. Hệ Màu Thánh Kinh "Grace & Light" (Sacred Color System)

| Tên Màu | Mã Hex | Ý Nghĩa Thuộc Linh | Ứng Dụng Trong Giao Diện |
| :--- | :--- | :--- | :--- |
| **Sacred Parchment (Nền chính)** | `#FBF9F5` / `#FFFFFF` | Sự thanh sạch, trang giấy Kinh Thánh cổ xưa | Nền toàn trang, nền thẻ bài học và trang đọc Lời Chúa |
| **Deep Sanctuary Navy (Chữ chính)** | `#0F172A` | Chiều sâu thần thượng, uy nghi của Thiên Đàng | Màu chữ chính, tiêu đề, đường viền trang nhã |
| **Royal Majesty Indigo (Chủ đạo)** | `#3730A3` / `#312E81` | Chiếc áo hoàng gia của Vua muôn vua, ân điển cứu chuộc | Nút hành động chính, thanh điều hướng, huy hiệu chức vụ |
| **Covenant Gold (Điểm nhấn vinh hiển)** | `#B45309` / `#D97706` | Ánh sáng của Chúa, sự công chính, vương miện sự sống | Ngọn lửa tĩnh nguyện, biểu tượng Thập tự giá, nút Dâng hiến |
| **Living Vine Olive (Sự sống tâm linh)** | `#15803D` / `#047857` | Gốc nho và nhánh, trái của Đức Thánh Linh | Đánh dấu hoàn thành môn đồ hóa, lời cầu nguyện được nhậm |
| **Sacrificial Crimson (Huyết chuộc tội)** | `#991B1B` | Tình yêu hy sinh của Chúa Jesus trên Thập tự giá | Thánh Lễ Tiệc Thánh, lời cầu thay khẩn thiết |

---

## 3. Typography & Chi Tiết Biểu Tượng Tôn Giáo

- **Font Tiêu Đề & Câu Gốc:** `Cinzel` hoặc `Playfair Display` (Font Serif cổ điển, đường nét uy nghi như khắc trên đá thánh đường).
- **Font Nội Dung & Giao Diện:** `Be Vietnam Pro` hoặc `Inter` (Rõ ràng, trang nhã, hỗ trợ tiếng Việt có dấu hoàn hảo và font scaling cho tín hữu cao tuổi).
- **Biểu tượng Thánh (Sacred Iconography):**
  - Biểu tượng Thập tự giá thanh mảnh, thanh tao (`†`).
  - Sách Kinh Thánh mở, Bồ câu biểu trưng Thánh Linh, nhành ô-liu hòa bình, chén Tiệc Thánh.
  - Viền mạ vàng tinh xảo: `border border-amber-200/80` hoặc `border-slate-800/20`.

---

## 4. Tương Tác Mang Tính Tôn Kính (Reverent Micro-interactions)

1. **Hiệp Nguyện Cầu Thay (Prayer Pulse):**
   - Khi bấm nút *"Tôi cùng hiệp nguyện 🙏"*, con số tăng lên kèm ánh sáng vàng kim tỏa nhẹ (gentle holy aura), gửi thông điệp bình an đến người xin cầu thay.
2. **Chế Độ Tĩnh Nguyện (Sanctuary Reading Mode):**
   - Khi đọc Lời Chúa hoặc xem bài giảng, thanh điều hướng ẩn êm dịu, nền chuyển sang tông giấy da ấm áp `#FBF9F5`, chữ tăng độ tương phản để tâm linh hoàn toàn tĩnh lặng trước mặt Chúa.
3. **Chuỗi Ngày Đồng Đi Với Chúa (Walk with Christ):**
   - Đếm chuỗi ngày tĩnh nguyện bằng ánh sáng nến thiêng hoặc ngọn lửa Thánh Linh trang trọng, kèm các câu châm ngôn khích lệ đức tin.

---

## 5. Mẫu Component Trang Trọng (Tailwind & HTML)

### Nút Bấm Thánh Khiết (Sacred Reverent Button)
```html
<button class="relative inline-flex items-center justify-center px-6 py-3 text-sm font-semibold tracking-wide text-white transition-all duration-200 bg-indigo-900 rounded-xl border border-amber-500/40 shadow-md shadow-indigo-950/20 hover:bg-indigo-800 hover:border-amber-400 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-amber-400">
  <span class="mr-2 text-amber-300">†</span>
  <span>Bắt Đầu Tĩnh Nguyện</span>
</button>
```

### Thẻ Kinh Thánh Dạng Trang Sách Cổ (Parchment Scripture Card)
```html
<div class="relative p-6 bg-[#FCFBF7] rounded-2xl border border-amber-200/70 shadow-sm shadow-amber-900/5">
  <div class="flex items-center justify-between border-b border-amber-200/50 pb-3 mb-4">
    <span class="font-serif text-xs font-bold tracking-widest uppercase text-amber-800">
      JOHN 3:16 • KINH THÁNH HẰNG NGÀY
    </span>
    <span class="text-amber-700 text-xs">†</span>
  </div>
  <blockquote class="font-serif text-lg leading-relaxed text-slate-800 italic">
    "Vì Đức Chúa Trời yêu thương thế gian, đến nỗi đã ban Con Một của Ngài..."
  </blockquote>
</div>
```
