# HƯỚNG DẪN TRIỂN KHAI HỆ THỐNG SAM (DEPLOYMENT GUIDE)

Tài liệu này hướng dẫn chi tiết quy trình triển khai mô hình kiến trúc chuẩn:
- **Backend (NestJS 12 ESM + MySQL 8.0):** Triển khai trên **VPS (Ubuntu 22.04/24.04 LTS)** quản lý bằng **PM2** và đảo chiều qua **Nginx Reverse Proxy + SSL Let's Encrypt**.
- **Frontend (Next.js 16 App Router + Tailwind CSS v4):** Triển khai trên **Vercel** với CDN toàn cầu, kết nối API sang domain VPS.

---

## PHẦN 1: TRIỂN KHAI BACKEND LÊN VPS (UBUNTU LINUX)

### 1. Yêu cầu cấu hình tối thiểu VPS
- **Hệ điều hành:** Ubuntu 22.04 hoặc 24.04 LTS (64-bit).
- **Phần cứng:** Tối thiểu 2 vCPU, 2GB RAM (khuyến nghị 4GB RAM nếu chạy cả MySQL trên cùng VPS), 30GB SSD.
- **Tên miền trỏ về IP VPS:** Ví dụ tạo bản ghi DNS `A`: `api.saministry.org` $\rightarrow$ `IP_VPS`.

---

### 2. Chuẩn bị môi trường trên VPS (Chạy bằng quyền root / sudo)

Đăng nhập vào VPS qua SSH:
```bash
ssh root@YOUR_VPS_IP
```

Cập nhật hệ thống:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git build-essential nginx certbot python3-certbot-nginx ufw
```

Cài đặt **Node.js 22 LTS** và **pnpm**:
```bash
# Cài Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Kiểm tra phiên bản
node -v # >= v22.x
npm -v

# Cài pnpm và PM2 toàn cục
sudo npm install -g pnpm pm2
```

---

### 3. Cài đặt và cấu hình cơ sở dữ liệu MySQL 8.0

Cài đặt MySQL Server:
```bash
sudo apt install -y mysql-server
sudo systemctl enable --now mysql
```

Đăng nhập MySQL và tạo Database + User chuyên dụng:
```bash
sudo mysql
```

Chạy các lệnh SQL sau trong cửa sổ MySQL:
```sql
-- Tạo database với bảng mã chuẩn UTF-8 đầy đủ hỗ trợ tiếng Việt có dấu
CREATE DATABASE teacher_lms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tạo user chuyên dụng cho backend (Thay 'MatKhauBaoMat@2026' bằng mật khẩu mạnh của bạn)
CREATE USER 'sam_user'@'localhost' IDENTIFIED BY 'MatKhauBaoMat@2026';

-- Cấp toàn quyền trên database teacher_lms
GRANT ALL PRIVILEGES ON teacher_lms.* TO 'sam_user'@'localhost';
FLUSH PRIVILEGES;

-- Thoát MySQL
EXIT;
```

---

### 4. Tải mã nguồn Backend lên VPS

Khuyến nghị tạo thư mục `/var/www/sam-platform`:
```bash
sudo mkdir -p /var/www/sam-platform
sudo chown -R $USER:$USER /var/www/sam-platform
cd /var/www/sam-platform

# Clone dự án từ Git repository của bạn
git clone YOUR_GIT_REPO_URL .
```

---

### 5. Cấu hình biến môi trường Backend (`backend/.env`)

Tạo file `backend/.env` từ file mẫu:
```bash
cd /var/www/sam-platform/backend
cp .env.example .env
nano .env
```

Điền các thông số môi trường thực tế của bạn:
```env
NODE_ENV=production
PORT=4000
API_PREFIX=api

# Điền domain Vercel và domain chính của bạn (ngăn cách bằng dấu phẩy)
CORS_ORIGIN=https://your-frontend.vercel.app,https://saministry.org,https://www.saministry.org

# MySQL VPS nội bộ
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=sam_user
DB_PASSWORD=MatKhauBaoMat@2026
DB_NAME=teacher_lms
DB_SYNCHRONIZE=true
DB_LOGGING=false

# JWT Secret (Chuỗi ngẫu nhiên dài >= 32 ký tự)
JWT_ACCESS_SECRET=c2FtX2FjY2Vzc19zZWNyZXRfa2V5X3ZlcnlfbG9uZ19hbmRfc2VjdXJlXzIwMjY=
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=c2FtX3JlZnJlc2hfc2VjdXJldF9rZXlfdmVyeV9sb25nX2FuZF9zZWN1cmVfMjAyNg==
JWT_REFRESH_EXPIRES_IN=7d

# Tài khoản Admin Quản Nhiệm khởi tạo ban đầu
ADMIN_EMAIL=pastor@saministry.org
ADMIN_PASSWORD=PastorSAM@2026!
ADMIN_NAME=Senior Pastor
```
*(Nhấn `Ctrl + O` $\rightarrow$ `Enter` để lưu, `Ctrl + X` để thoát nano).*

---

### 6. Cài đặt thư viện & Build mã nguồn Backend

Từ thư mục gốc dự án:
```bash
cd /var/www/sam-platform
pnpm install --frozen-lockfile

# Build mã nguồn backend sang JavaScript biên dịch
pnpm --filter backend run build
```

Kiểm tra thư mục `backend/dist/main.js` đã được tạo thành công.

---

### 7. Khởi chạy Backend với PM2 (Tự động chạy ngầm & Khởi động lại)

Tạo file cấu hình PM2 tại `/var/www/sam-platform/ecosystem.config.cjs`:
```bash
nano /var/www/sam-platform/ecosystem.config.cjs
```
Dán nội dung sau:
```javascript
module.exports = {
  apps: [
    {
      name: 'sam-backend',
      cwd: '/var/www/sam-platform/backend',
      script: 'dist/main.js',
      instances: 'max', // Chạy cluster tận dụng tối đa CPU
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      }
    }
  ]
};
```

Khởi chạy ứng dụng:
```bash
pm2 start /var/www/sam-platform/ecosystem.config.cjs
pm2 save
pm2 startup
# Chạy dòng lệnh sudo env PATH... mà pm2 in ra màn hình để kích hoạt khởi động cùng OS
```

Kiểm tra trạng thái chạy:
```bash
pm2 status
curl http://localhost:4000/api/health
```
*(Nếu trả về `{"status":"ok",...}` là backend đã chạy thành công).*

---

### 8. Cấu hình Nginx Reverse Proxy & SSL HTTPS Miễn Phí

Tạo cấu hình Nginx cho API:
```bash
sudo nano /etc/nginx/sites-available/sam-backend
```
Dán nội dung cấu hình sau (Thay `api.saministry.org` bằng domain phụ thực tế của bạn):
```nginx
server {
    listen 80;
    server_name api.saministry.org;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 90;
    }
}
```

Kích hoạt cấu hình và kiểm tra Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/sam-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Cài chứng chỉ SSL HTTPS miễn phí tự động gia hạn với Certbot:
```bash
sudo certbot --nginx -d api.saministry.org
```
*(Chọn cấu hình tự động chuyển hướng HTTP $\rightarrow$ HTTPS).*

Kiểm tra API trên trình duyệt: `https://api.saministry.org/api/health`.

---

### 9. Cấu hình tường lửa VPS (UFW)
Chỉ mở các cổng cần thiết để bảo vệ VPS:
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
sudo ufw status
```

---

## PHẦN 2: TRIỂN KHAI FRONTEND LÊN VERCEL

### 1. Đẩy mã nguồn lên GitHub/GitLab
Đảm bảo mã nguồn dự án của bạn đã được push lên GitHub:
```bash
git add .
git commit -m "feat: complete SAM platform ready for production deploy"
git push origin main
```

---

### 2. Tạo Project trên Vercel
1. Đăng nhập vào [Vercel.com](https://vercel.com/) bằng tài khoản GitHub của bạn.
2. Nhấn nút **Add New...** $\rightarrow$ **Project**.
3. Chọn Repository dự án của bạn và nhấn **Import**.

---

### 3. Cấu hình Dự án trên Vercel (Rất quan trọng cho Monorepo)

Tại màn hình cấu hình dự án Vercel (**Configure Project**):

1. **Framework Preset:** Chọn `Next.js`.
2. **Root Directory:** Nhấn **Edit** và chọn thư mục `frontend` (vì dự án là monorepo).
3. **Build and Output Settings:**
   - **Build Command:** Để mặc định (`next build`) hoặc `pnpm run build`.
   - **Install Command:** Để mặc định (`pnpm install`).
4. **Environment Variables (Biến môi trường):**
   Thêm các biến môi trường sau:

| Tên biến (Key) | Giá trị (Value) | Ghi chú |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://api.saministry.org/api` | Đường dẫn API Backend VPS có SSL |
| `API_INTERNAL_URL` | `https://api.saministry.org/api` | Dùng cho Next.js Server Components |
| `API_PROXY_ORIGIN` | `https://api.saministry.org` | Dùng cho Next.js rewrite nếu cần |

5. Nhấn nút **Deploy**.

Sau 1 - 2 phút, Vercel sẽ biên dịch xong và cung cấp URL truy cập (Ví dụ: `https://your-frontend.vercel.app`).

---

### 4. Gắn Domain Tùy Chỉnh trên Vercel (Tùy chọn)
Nếu bạn muốn dùng domain riêng như `saministry.org` hoặc `app.saministry.org`:
1. Vào tab **Settings** của dự án trên Vercel $\rightarrow$ Chọn mục **Domains**.
2. Nhập domain (ví dụ `saministry.org` hoặc `app.saministry.org`) $\rightarrow$ Nhấn **Add**.
3. Cập nhật bản ghi DNS tại nhà cung cấp quản lý tên miền theo hướng dẫn của Vercel (bản ghi `CNAME` hoặc `A`).

---

### 5. Kết nối CORS giữa Vercel và VPS
Sau khi có domain Vercel (ví dụ: `https://your-frontend.vercel.app` hoặc `https://saministry.org`):

1. Quay lại terminal VPS:
   ```bash
   nano /var/www/sam-platform/backend/.env
   ```
2. Cập nhật lại dòng `CORS_ORIGIN`:
   ```env
   CORS_ORIGIN=https://your-frontend.vercel.app,https://saministry.org,https://www.saministry.org
   ```
3. Khởi động lại backend trên VPS để nhận CORS mới:
   ```bash
   pm2 restart sam-backend
   ```

Bây giờ Frontend trên Vercel và Backend trên VPS đã kết nối thông suốt, cookie token và dữ liệu truyền tải an toàn 100% qua HTTPS!

---

## PHẦN 3: QUY TRÌNH CẬP NHẬT MÃ NGUỒN SAU NÀY (CI/CD)

### 1. Khi cập nhật Frontend:
Chỉ cần commit và push code lên GitHub:
```bash
git push origin main
```
Vercel sẽ tự động phát hiện thay đổi và build phiên bản mới ngay lập tức không gián đoạn dịch vụ.

### 2. Khi cập nhật Backend trên VPS:
Tạo script cập nhật nhanh trên VPS tại `/var/www/sam-platform/update.sh`:
```bash
nano /var/www/sam-platform/update.sh
```
Nội dung script:
```bash
#!/bin/bash
set -e
echo "🚀 Đang kéo mã nguồn mới nhất..."
cd /var/www/sam-platform
git pull origin main

echo "📦 Cài đặt thư viện..."
pnpm install --frozen-lockfile

echo "🔨 Biên dịch Backend..."
pnpm --filter backend run build

echo "♻️ Khởi động lại dịch vụ PM2..."
pm2 restart sam-backend

echo "✅ Cập nhật Backend hoàn tất!"
```

Cấp quyền thực thi:
```bash
chmod +x /var/www/sam-platform/update.sh
```

Mỗi lần bạn đẩy code backend mới lên GitHub, chỉ cần đăng nhập VPS và gõ lệnh:
```bash
/var/www/sam-platform/update.sh
```

---

## PHẦN 4: LỆNH HỮU ÍCH QUẢN TRỊ TRÊN VPS

| Lệnh | Ý nghĩa |
| :--- | :--- |
| `pm2 status` | Xem trạng thái các tiến trình backend |
| `pm2 logs sam-backend` | Xem log lỗi và log truy cập theo thời gian thực |
| `pm2 restart sam-backend` | Khởi động lại backend |
| `sudo systemctl status nginx` | Xem trạng thái máy chủ Nginx |
| `sudo nginx -t` | Kiểm tra cú pháp file cấu hình Nginx |
| `sudo certbot renew --dry-run` | Kiểm tra tự động gia hạn chứng chỉ SSL |
| `sudo mysqldump -u sam_user -p teacher_lms > backup_$(date +%F).sql` | Sao lưu cơ sở dữ liệu |
