# APP Management 

## Tổng quan

Đây là một RESTful API được xây dựng với NestJS và TypeScript, nhằm phục vụ việc quản lý dự án, người dùng và ticket. Hệ thống bao gồm các tính năng như xác thực người dùng (JWT và session-based), khởi tạo dữ liệu mẫu, và các thao tác CRUD cho người dùng, dự án và ticket. API sử dụng TypeORM để quản lý cơ sở dữ liệu, MySQL để lưu cơ sở dữ liệu

## Công nghệ sử dụng

- **Framework:** NestJS
- **Ngôn ngữ:** TypeScript
- **Cơ sở dữ liệu:** TypeORM (MySQL)
- **Xác thực:** JWT và xác thực dựa trên session
- **Validation:** Sử dụng `Validation Pipe` tích hợp sẵn của NestJS
- **Kiểm thử:** Jest

## Cấu trúc dự án

```bash
├── src
│ ├── common
│ │ ├── dto                   # DTO cho dữ liệu vào/ra API
│ │ ├── entities              # Entity TypeORM cho model dữ liệu
│ │ ├── migration             # Các file migration
│ │ └── seeder                # Script để seed dữ liệu
│ ├── components
│ │ ├── auth                  # Module xác thực (JWT, session)
│ │ ├── projects              # Logic và controller liên quan đến dự án
│ │ ├── tickets               # Logic và controller liên quan đến ticket
│ │ └── users                 # Logic và controller liên quan đến người dùng
│ ├── app.controller.ts       # Controller gốc
│ ├── app.module.ts           # Module gốc
│ ├── app.service.ts          # Service gốc
│ ├── data-source.ts          # Cấu hình TypeORM
│ └── main.ts                 # Điểm khởi động ứng dụng
├── .env                      # Biến môi trường

```

## API Endpoints

### Authentication (`/auth`)

| Phương thức | Endpoint                | Mô tả                            |
|------------|-------------------------|----------------------------------|
| POST       | /auth/jwt/login         | Đăng nhập bằng JWT               | 
| POST       | /auth/jwt/logout        | Đăng xuất (JWT)                  | 
| POST       | /auth/refresh           | Làm mới token JWT                | 
| GET        | /auth/jwt/profile       | Lấy thông tin user từ JWT        | 
| GET        | /auth/basic/profile     | Lấy thông tin basic auth         | 
| GET        | /auth/session           | Lấy thông tin session            | 
| POST       | /auth/session/login     | Đăng nhập bằng session           | 
| GET        | /auth/session/profile   | Lấy thông tin user từ session    | 
| GET        | /auth/session/logout    | Đăng xuất (session)              | 

### Users (`/api/users`)

| Phương thức | Endpoint                          | Mô tả                             |
|------------|-----------------------------------|-----------------------------------|
| GET        | /api/users/:id                    | Lấy người dùng theo ID            | 
| GET        | /api/users                        | Lấy danh sách tất cả người dùng   | 
| GET        | /api/users/:id/tickets            | Lấy danh sách ticket của người dùng | 
| POST       | /api/users                        | Tạo người dùng mới                | 
| PATCH      | /api/users/:id                    | Cập nhật thông tin người dùng     | 
| PATCH      | /api/users/:id/password           | Đổi mật khẩu người dùng           | 
| PUT        | /api/users/:id/tickets            | Gán ticket cho người dùng         | 

### Projects (`/api/projects`)

| Phương thức | Endpoint                         | Mô tả                            | 
|------------|----------------------------------|----------------------------------|
| GET        | /api/projects/:id                | Lấy thông tin dự án theo ID      | 
| GET        | /api/projects                    | Lấy tất cả dự án                 | 
| GET        | /api/projects/:id/tickets        | Lấy ticket trong dự án           | 
| POST       | /api/projects                    | Tạo dự án mới                    | 
| PATCH      | /api/projects/:id                | Cập nhật thông tin dự án         | 
| DELETE     | /api/projects/:id                | Xóa dự án                        | 

### Tickets (`/api/tickets`)

| Phương thức | Endpoint               | Mô tả                          |
|------------|------------------------|--------------------------------|
| GET        | /api/tickets           | Lấy tất cả ticket              | 
| GET        | /api/tickets/export    | Xuất ticket (ví dụ: CSV)       | 
| POST       | /api/tickets           | Tạo ticket mới                 | 
| PATCH      | /api/tickets/:id       | Cập nhật thông tin ticket      | 

### Seeder (`/api/seeder`)

| Phương thức | Endpoint              | Mô tả                  |
|------------|-----------------------|-------------------------|
| POST       | /api/seeder/users     | Seed dữ liệu người dùng | 
| POST       | /api/seeder/projects  | Seed dữ liệu dự án      | 
| POST       | /api/seeder/tickets   | Seed dữ liệu ticket     | 

## Cài đặt và khởi chạy

### Clone Repository

```bash
git clone <repository-url>
cd <project-directory>

```

## Cài đặt thư viện

```bash
npm install

```
## Khởi chạy ứng dụng

```bash
npm run start:dev

```