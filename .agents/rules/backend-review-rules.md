# Quy Chuẩn Review Code Backend (NestJS Review Rules)

Bộ tiêu chuẩn đánh giá mã nguồn bắt buộc (Code Review Checklist) cho toàn bộ Backend NestJS, kế thừa kiến trúc từ `C:\dev\products\idhub\backend`. Mọi Pull Request, tính năng mới hoặc chỉnh sửa code backend phải được kiểm tra theo danh sách này trước khi nghiệm thu.

---

## 1. Kiểm Tra Cú Pháp & Hệ Thống ESM (Checklist Sống Còn)

- [ ] **100% Relative Imports có đuôi `.js`:**
  - Mọi câu lệnh import file nội bộ (service, controller, dto, entity, guard, utils) **bắt buộc** phải kết thúc bằng `.js`.
  - *Ví dụ đúng:* `import { User } from './entities/user.entity.js';`
  - *Ví dụ sai:* `import { User } from './entities/user.entity';` $\rightarrow$ **Reject ngay lập tức**.
- [ ] **Không Cyclic Dependency:** Không import chéo luẩn quẩn giữa các module/service (nếu cần, phải dùng `forwardRef()`).
- [ ] **Linter sạch lỗi:** Chạy `npm run lint` (`oxlint`) không có warning hoặc error.

---

## 2. Bảo Mật & Phân Quyền (Security & Auth)

- [ ] **Mặc định bảo vệ (Default Protected):**
  - Mọi route đều được bảo vệ tự động bởi `JwtAuthGuard` toàn cục.
  - Endpoint nào thực sự dành cho khách vãng lai/công khai (Login, Register, Xem danh mục khóa học, Placement Test) thì **phải có decorator `@Public()`**.
- [ ] **Kiểm tra Phân Quyền (`@Roles`):**
  - Các route quản trị (quản lý doanh thu, tạo khóa học, xóa học sinh) phải có `@Roles(Role.Admin, Role.Teacher)`.
  - Tuyệt đối ngăn chặn Trợ giảng (TA) truy cập các API báo cáo tài chính/sổ quỹ (`FinanceModule`).
- [ ] **Không Lộ Thông Tin Nhạy Cảm:**
  - Các trường mật khẩu (`passwordHash`), mã làm mới token (`refreshTokenHash`), secret key phải luôn có decorator `@Exclude()` của `class-transformer`.
  - Controller trả về object phải kích hoạt serialization hoặc dựa vào `ClassSerializerInterceptor` toàn cục.
- [ ] **Bảo vệ Dữ liệu Đầu vào (Validation):**
  - Mọi Body/Query/Param đều phải có class DTO tương ứng.
  - DTO sử dụng đầy đủ các decorator của `class-validator` (`@IsString()`, `@IsEmail()`, `@IsNotEmpty()`, `@Min()`, v.v.).

---

## 3. Cơ Sở Dữ Liệu & TypeORM (Performance & Integrity)

- [ ] **Tránh Lỗi N+1 Query:**
  - Tuyệt đối không dùng vòng lặp `for` / `forEach` / `map` để gọi query database lặp đi lặp lại.
  - Sử dụng `relations` trong options hoặc `leftJoinAndSelect` của `QueryBuilder`.
- [ ] **Toàn vẹn Giao dịch (Database Transactions):**
  - Các luồng xử lý liên quan đến tài chính, học phí, điểm danh trừ số buổi học, kích hoạt đơn hàng phải được bọc trong Transaction (`QueryRunner` hoặc `dataSource.transaction`).
- [ ] **Khóa ngoại & Cascade:**
  - Kiểm tra các quan hệ `OneToMany`, `ManyToOne` đã khai báo đúng `onDelete: 'CASCADE'` hoặc `onDelete: 'SET NULL'` để tránh dữ liệu mồ côi (orphaned records).
- [ ] **Index cho tìm kiếm:**
  - Các cột thường xuyên filter/search (`email`, `phone`, `status`, `courseId`, `classId`) phải có đánh Index (`@Index()`).

---

## 4. Xử Lý Lỗi & Ngoại Lệ (Exception Handling)

- [ ] **Không Rò Rỉ Lỗi SQL:**
  - Không bọc `try/catch` rồi trả nguyên object error của MySQL/Postgres về client.
  - Phải ném ra các exception chuẩn của NestJS (`BadRequestException`, `NotFoundException`, `ForbiddenException`, `ConflictException`).
- [ ] **Thông báo Tiếng Việt Thân Thiện:**
  - Thông báo lỗi người dùng nhận được phải rõ nghĩa, ví dụ: *"Số điện thoại này đã được đăng ký"* thay vì *"Duplicate entry for key users_phone_unique"*.

---

## 5. Tài Liệu Swagger (API Documentation)

- [ ] **Đầy đủ Annotations Swagger:**
  - Controller có `@ApiTags('Tên Nhóm')` và `@ApiBearerAuth()`.
  - Mỗi action có `@ApiOperation({ summary: '...' })`.
  - Có khai báo mã phản hồi `@ApiResponse({ status: 200, ... })` và kiểu dữ liệu trả về (`type`).
