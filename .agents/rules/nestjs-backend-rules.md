# NestJS Backend Coding Rules (Base: idhub)

Tài liệu quy chuẩn kiến trúc và phong cách lập trình cho Backend NestJS, kế thừa trực tiếp từ tiêu chuẩn của `C:\dev\products\idhub\backend`. Mọi mã nguồn backend phải tuân thủ nghiêm ngặt các quy tắc dưới đây.

---

## 1. Môi trường & Hệ thống Module ESM (BẮT BUỘC)

* **ESM Native (`"type": "module"` trong `package.json`):**
  * Dự án chạy theo chuẩn ES Modules hiện đại.
  * **QUY TẮC SỐNG CÒN:** Tất cả import tương đối nội bộ (relative imports) **BẮT BUỘC** phải có đuôi mở rộng `.js` (kể cả khi file nguồn là `.ts`).
  * *Ví dụ đúng:*
    ```typescript
    import { AppModule } from './app.module.js';
    import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';
    import { CreateUserDto } from './dto/create-user.dto.js';
    ```
  * *Ví dụ sai (sẽ gây lỗi crash runtime trên Node ESM):*
    ```typescript
    import { AppModule } from './app.module'; // LỖI THIẾU .js
    ```
* **Tooling:**
  * Dùng `oxlint` cho linting siêu tốc: `npm run lint` (`oxlint src/ test/`).
  * Dùng `vitest` thay cho Jest cho unit & e2e testing.

---

## 2. Cấu Trúc Thư Mục & Phân Tách Domain

Cấu trúc `src/` theo hướng Modular Monolith:
```
src/
├── auth/                 # Xác thực, JWT, Refresh Token, Passwords
├── common/               # Dùng chung toàn hệ thống
│   ├── decorators/       # @Public(), @Roles(), @CurrentUser()
│   ├── dto/              # PaginationDto, BaseFilterDto
│   ├── entities/         # BaseEntity (id, createdAt, updatedAt)
│   ├── filters/          # AllExceptionsFilter (bảo mật lỗi SQL)
│   ├── guards/           # JwtAuthGuard, RolesGuard
│   └── utils/            # Helper formats, crypto
├── config/               # env.validation.ts (class-validator cho biến môi trường)
├── database/             # TypeORM database configuration
├── uploads/              # Xử lý lưu trữ file media, audio bài tập
├── <domain-modules>/     # courses/, classes/, assignments/, finance/
├── app.module.ts         # Module gốc đăng ký global pipes, guards, filters
└── main.ts               # Entry point, Swagger, CORS, Static assets
```

---

## 3. Database & TypeORM Guidelines

1. **Entity Design:**
   * Sử dụng UUID (`@PrimaryGeneratedColumn('uuid')`) hoặc ID số chuẩn thống nhất theo domain.
   * Luôn có `@CreateDateColumn()` và `@UpdateDateColumn()`.
   * Trường nhạy cảm (mật khẩu `passwordHash`, `refreshTokenHash`) **BẮT BUỘC** phải có decorator `@Exclude()` để không bao giờ bị lộ ra JSON trả về client.
2. **Serialization:**
   * Luôn kích hoạt `ClassSerializerInterceptor` ở tầng toàn cục (`APP_INTERCEPTOR`).
3. **Repository Pattern:**
   * Sử dụng `@InjectRepository(Entity)` trong constructor của Service.
   * Tận dụng QueryBuilder hoặc Relations khi cần load dữ liệu liên kết, tránh N+1 queries.

---

## 4. Xác Thực & Phân Quyền (Auth & RBAC)

1. **Bảo vệ mặc định (Secure by Default):**
   * Hệ thống đăng ký `JwtAuthGuard` và `RolesGuard` ở mức **Global**.
   * Mọi API endpoint đều được bảo vệ mặc định.
   * Để mở public một endpoint (như login, register, catalog công khai), dùng decorator `@Public()`.
2. **Cơ chế Token Kép (Access Token & Refresh Token):**
   * Access Token có thời hạn ngắn (15 - 30 phút).
   * Refresh Token xoay vòng (rotating refresh token) lưu hash trong database.
   * Khi client gọi `POST /api/auth/refresh`, hủy refresh token cũ và cấp cặp token mới.
3. **Phân quyền Role-based:**
   * Dùng decorator `@Roles(Role.Admin, Role.Teacher, Role.TA)`.

---

## 5. Validation & Exception Handling

1. **ValidationPipe Toàn Cục:**
   * Cấu hình bắt buộc:
     ```typescript
     new ValidationPipe({
       whitelist: true,              // Tự động loại bỏ các trường không định nghĩa trong DTO
       forbidNonWhitelisted: true,  // Báo lỗi 400 nếu truyền thừa trường
       transform: true,              // Tự động convert kiểu dữ liệu theo DTO
       transformOptions: { enableImplicitConversion: false },
       exceptionFactory: (errors) =>
         new BadRequestException(
           `Dữ liệu không hợp lệ: ${[...new Set(validationErrorPaths(errors))].join(', ')}`,
         ),
     })
     ```
2. **AllExceptionsFilter:**
   * Tuyệt đối không để lộ stack trace hoặc thông tin bảng cơ sở dữ liệu (MySQL / Postgres error) ra client.
   * Chuyển đổi các mã lỗi ngoại lệ thành JSON format chuẩn với thông báo tiếng Việt thân thiện.

---

## 6. API Documentation (Swagger)

* Mọi Controller đều phải được chú thích:
  * `@ApiTags('Tên Module')`
  * `@ApiOperation({ summary: 'Mô tả tóm tắt hành động' })`
  * `@ApiResponse({ status: 200, description: '...' })`
  * `@ApiBearerAuth()` đối với các route cần đăng nhập.
* Swagger chỉ hiển thị ở môi trường phát triển (`NODE_ENV !== 'production'`) tại `/docs`.
