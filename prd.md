# Product Requirements Document (PRD)

## Event & Committee Management System

**Version:** 1.0  
**Backend:** NestJS  
**Frontend:** Next.js  
**Database:** MySQL  
**API:** REST API

---

## 1. Product Overview

**Event & Committee Management System** adalah aplikasi berbasis web yang dirancang untuk membantu panitia dalam mengelola perencanaan, persiapan, pelaksanaan, dan pemantauan sebuah event secara terpusat.

Sistem memungkinkan Event Manager untuk membuat event, membentuk divisi, menambahkan anggota panitia, membagikan tugas, menentukan deadline, dan memantau progres pekerjaan. Koordinator divisi dapat mengelola pekerjaan dalam divisinya, sedangkan anggota panitia dapat melihat tugas, memperbarui progres, dan mengirimkan hasil pekerjaan.

Aplikasi dibangun menggunakan arsitektur **REST API dengan NestJS sebagai backend**, yang terpisah dari frontend agar sistem lebih fleksibel untuk dikembangkan di masa depan.

---

# 2. Problem Statement

Dalam proses penyelenggaraan event, koordinasi panitia umumnya dilakukan menggunakan berbagai platform seperti WhatsApp, Google Sheets, Google Drive, dan komunikasi langsung.

Hal tersebut dapat menyebabkan:

- Informasi event tersebar di berbagai platform.
- Tugas dan PIC sulit dipantau.
- Deadline berpotensi terlewat.
- Progres pekerjaan setiap divisi tidak terlihat secara terpusat.
- Ketua panitia harus melakukan follow-up secara manual.
- Riwayat pekerjaan dan progres sulit dilacak.

Diperlukan sebuah sistem terpusat yang dapat mengintegrasikan manajemen event, struktur kepanitiaan, task management, dan monitoring progres.

---

# 3. Product Goals

Tujuan utama aplikasi adalah menyediakan platform terpusat yang memungkinkan panitia untuk:

- Mengelola event.
- Mengatur struktur divisi.
- Mengelola anggota kepanitiaan.
- Membuat dan mendistribusikan task.
- Menentukan PIC dan deadline.
- Memantau progres pekerjaan.
- Mengidentifikasi task yang terlambat.
- Melihat kondisi keseluruhan event melalui dashboard.

---

# 4. Target Users

## 4.1 Administrator

Administrator bertanggung jawab terhadap pengelolaan sistem secara umum.

### Kebutuhan

- Mengelola akun pengguna.
- Melihat seluruh event.
- Mengelola data master.
- Memantau aktivitas sistem.

---

## 4.2 Event Manager / Ketua Panitia

Event Manager bertanggung jawab terhadap keseluruhan event.

### Kebutuhan

- Membuat event.
- Mengelola informasi event.
- Membuat divisi.
- Menentukan koordinator.
- Menambahkan anggota panitia.
- Membuat task.
- Memantau progres seluruh event.
- Melihat task yang mendekati atau melewati deadline.

---

## 4.3 Koordinator Divisi

Koordinator bertanggung jawab terhadap aktivitas dalam divisinya.

### Kebutuhan

- Melihat anggota divisi.
- Membuat task.
- Menentukan PIC.
- Mengatur deadline.
- Memantau progres anggota.
- Melakukan review task.

---

## 4.4 Anggota Panitia

Anggota bertanggung jawab terhadap task yang diberikan.

### Kebutuhan

- Melihat task pribadi.
- Melihat deadline.
- Memperbarui status task.
- Memperbarui progres.
- Mengunggah hasil pekerjaan.
- Mengirim task untuk direview.

---

# 5. User Roles & Permissions

| Feature | Admin | Event Manager | Coordinator | Member |
|---|:---:|:---:|:---:|:---:|
| Manage Users | Ya | Tidak | Tidak | Tidak |
| Create Event | Ya | Ya | Tidak | Tidak |
| Manage Event | Ya | Ya | Terbatas | Tidak |
| Create Division | Ya | Ya | Tidak | Tidak |
| Manage Members | Ya | Ya | Divisi sendiri | Tidak |
| Create Task | Ya | Ya | Ya | Tidak |
| Assign Task | Ya | Ya | Ya | Tidak |
| Update Task | Ya | Ya | Ya | Task sendiri |
| View Event Dashboard | Ya | Ya | Divisi sendiri | Personal |
| View All Divisions | Ya | Ya | Tidak | Tidak |

---

# 6. Core Features

## 6.1 Authentication & Authorization

Sistem menggunakan autentikasi berbasis **JWT**.

### Fitur

- Register.
- Login.
- Logout.
- Refresh token.
- Get current user profile.
- Role-based access control.

### Roles

```text
ADMIN
EVENT_MANAGER
COORDINATOR
MEMBER
```

NestJS menggunakan:

- `Passport.js`
- JWT Strategy
- Auth Guard
- Roles Guard

---

# 6.2 User Management

Administrator dapat mengelola pengguna.

### Data User

- ID
- Name
- Email
- Password
- Avatar
- Global Role
- Created At
- Updated At

### Fitur

- Create User.
- View Users.
- Update User.
- Delete User.
- Assign Role.

---

# 6.3 Event Management

Event Manager dapat membuat dan mengelola event.

### Data Event

- ID
- Name
- Description
- Start Date
- End Date
- Location
- Status
- Event Manager
- Created At
- Updated At

### Event Status

```text
PLANNING
PREPARATION
ONGOING
COMPLETED
CANCELLED
```

---

# 6.4 Division Management

Setiap event dapat memiliki beberapa divisi.

Contoh:

```text
Technology Festival 2026

├── Acara
├── Publikasi & Dokumentasi
├── Sponsorship
├── Humas
├── Konsumsi
└── Perlengkapan
```

### Data Division

- ID
- Event ID
- Name
- Description
- Coordinator ID
- Created At
- Updated At

---

# 6.5 Committee Member Management

Sistem memungkinkan pengguna menjadi anggota dari sebuah event.

Struktur relasi:

```text
USER
  │
  └── EVENT MEMBER
          │
          ├── EVENT
          │
          └── DIVISION
```

### Data Event Member

- ID
- Event ID
- User ID
- Division ID
- Position
- Joined At

Seorang user dapat bergabung dalam beberapa event.

---

# 6.6 Task Management

Task Management merupakan fitur inti aplikasi.

### Data Task

- ID
- Event ID
- Division ID
- Title
- Description
- Assigned To
- Priority
- Status
- Deadline
- Progress
- Created By
- Created At
- Updated At

### Priority

```text
LOW
MEDIUM
HIGH
URGENT
```

### Task Status

```text
TODO
IN_PROGRESS
IN_REVIEW
COMPLETED
```

### Workflow

```text
TODO
  ↓
IN_PROGRESS
  ↓
IN_REVIEW
  ↓
COMPLETED
```

---

# 6.7 Task Progress & Updates

Setiap task memiliki riwayat progres.

### Data Task Update

- ID
- Task ID
- User ID
- Progress
- Description
- Created At

Contoh:

```text
Progress: 70%

Desain utama telah selesai.
Saat ini sedang menunggu
review dari koordinator.
```

---

# 6.8 File Attachment

Pengguna dapat mengunggah file yang berkaitan dengan task.

Contoh:

- Design file.
- PDF.
- Document.
- Image.
- Proposal.

### Data Attachment

- ID
- Task ID
- User ID
- File Name
- File URL
- File Type
- File Size
- Uploaded At

Untuk versi awal, file dapat disimpan menggunakan local storage. Pada pengembangan selanjutnya dapat menggunakan:

- AWS S3.
- Cloudinary.
- Supabase Storage.

---

# 6.9 Dashboard

Dashboard menampilkan informasi sesuai role pengguna.

## Event Manager Dashboard

Menampilkan:

- Total event.
- Total divisi.
- Total anggota.
- Total task.
- Completed task.
- Task in progress.
- Overdue task.
- Overall event progress.
- Division progress.
- Upcoming deadlines.
- Recent activity.

## Coordinator Dashboard

Menampilkan:

- Jumlah anggota divisi.
- Total task divisi.
- Task belum selesai.
- Task overdue.
- Progress divisi.

## Member Dashboard

Menampilkan:

- My tasks.
- Upcoming deadlines.
- Task in progress.
- Completed tasks.
- Personal progress.

---

# 6.10 Deadline Monitoring

Sistem secara otomatis menentukan kondisi deadline.

| Kondisi | Status |
|---|---|
| Deadline masih lama | Normal |
| ≤ 3 hari | Upcoming |
| Hari ini | Due Today |
| Melewati deadline | Overdue |

Overdue task akan muncul secara khusus pada dashboard Event Manager dan Coordinator.

---

# 6.11 Event Timeline

Sistem menyediakan timeline sederhana untuk melihat tahapan event.

Contoh:

```text
AUGUST
│
├── Pembentukan Panitia
├── Pembagian Divisi
└── Penyusunan Konsep

SEPTEMBER
│
├── Open Registration
├── Promosi
└── Sponsorship

OCTOBER
│
├── Technical Meeting
├── Finalisasi Acara
└── Persiapan Venue

NOVEMBER
│
└── EVENT DAY
```

Timeline dapat dikembangkan menjadi Gantt Chart pada versi selanjutnya.

---

# 7. System Architecture

Arsitektur aplikasi menggunakan pendekatan client-server.

```text
┌─────────────────────┐
│      Frontend       │
│                     │
│       Next.js       │
│       Tailwind      │
└──────────┬──────────┘
           │
           │ REST API
           ▼
┌─────────────────────┐
│       Backend       │
│                     │
│       NestJS        │
│                     │
│ ┌─────────────────┐ │
│ │ Auth Module     │ │
│ │ Users Module    │ │
│ │ Events Module   │ │
│ │ Divisions Module│ │
│ │ Tasks Module    │ │
│ │ Dashboard Module│ │
│ └─────────────────┘ │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│      Database       │
│                     │
│     PostgreSQL      │
└─────────────────────┘
```

---

# 8. Backend Architecture

NestJS menggunakan pendekatan modular.

```text
src/
│
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── dto/
│   ├── guards/
│   └── strategies/
│
├── users/
│
├── events/
│
├── divisions/
│
├── event-members/
│
├── tasks/
│
├── task-updates/
│
├── attachments/
│
├── dashboard/
│
├── common/
│   ├── decorators/
│   ├── guards/
│   └── filters/
│
├── prisma/
│
├── app.module.ts
└── main.ts
```

---

# 9. Database Design

Database menggunakan **PostgreSQL**.

ORM yang direkomendasikan:

```text
Prisma ORM
```

## 9.1 Users

```text
id
name
email
password
avatar
role
created_at
updated_at
```

## 9.2 Events

```text
id
name
description
start_date
end_date
location
status
manager_id
created_at
updated_at
```

## 9.3 Divisions

```text
id
event_id
name
description
coordinator_id
created_at
updated_at
```

## 9.4 Event Members

```text
id
event_id
user_id
division_id
position
created_at
updated_at
```

## 9.5 Tasks

```text
id
event_id
division_id
title
description
assigned_to
created_by
priority
status
deadline
progress
created_at
updated_at
```

## 9.6 Task Updates

```text
id
task_id
user_id
progress
description
created_at
```

## 9.7 Attachments

```text
id
task_id
user_id
file_name
file_url
file_type
file_size
created_at
```

---

# 10. Database Relationships

```text
USERS
 │
 ├───────────────┐
 │               │
 ▼               ▼
EVENTS      EVENT_MEMBERS
 │               │
 │               │
 ▼               ▼
DIVISIONS ◄──── USERS
 │
 ▼
TASKS
 │
 ├───────────────┐
 │               │
 ▼               ▼
TASK_UPDATES   ATTACHMENTS
```

### Relasi

- Satu User dapat mengikuti banyak Event.
- Satu Event memiliki banyak Division.
- Satu Division memiliki banyak Event Member.
- Satu Event memiliki banyak Task.
- Satu Division memiliki banyak Task.
- Satu User dapat memiliki banyak Task.
- Satu Task memiliki banyak Task Update.
- Satu Task memiliki banyak Attachment.

---

# 11. API Requirements

API menggunakan REST API.

## Authentication

```text
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
GET    /auth/me
```

## Users

```text
GET    /users
GET    /users/:id
POST   /users
PATCH  /users/:id
DELETE /users/:id
```

## Events

```text
GET    /events
GET    /events/:id
POST   /events
PATCH  /events/:id
DELETE /events/:id
```

## Divisions

```text
GET    /events/:eventId/divisions
POST   /events/:eventId/divisions
GET    /divisions/:id
PATCH  /divisions/:id
DELETE /divisions/:id
```

## Event Members

```text
GET    /events/:eventId/members
POST   /events/:eventId/members
PATCH  /event-members/:id
DELETE /event-members/:id
```

## Tasks

```text
GET    /tasks
GET    /tasks/:id
POST   /tasks
PATCH  /tasks/:id
DELETE /tasks/:id
```

## Task Updates

```text
GET    /tasks/:taskId/updates
POST   /tasks/:taskId/updates
```

## Dashboard

```text
GET /dashboard
GET /dashboard/event/:eventId
GET /dashboard/division/:divisionId
```

---

# 12. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js |
| Styling | Tailwind CSS |
| Backend | NestJS |
| Runtime | Node.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT + Passport |
| API | REST API |
| Validation | class-validator |
| Documentation | Swagger |
| File Storage | Local / Cloudinary |
| Charts | Recharts / Chart.js |

---

# 13. Non-Functional Requirements

## Performance

- API harus memberikan respons yang cepat untuk penggunaan normal.
- Dashboard menggunakan query agregasi yang efisien.
- Pagination digunakan pada daftar data besar.

## Security

- Password menggunakan hashing.
- Authentication menggunakan JWT.
- Endpoint dilindungi menggunakan Guard.
- Authorization berdasarkan role.
- Input divalidasi menggunakan DTO dan `class-validator`.

## Scalability

Arsitektur modular NestJS memungkinkan fitur baru ditambahkan tanpa mengubah keseluruhan aplikasi.

Contoh pengembangan:

```text
Notification Module
Chat Module
Meeting Module
Budget Module
Attendance Module
Analytics Module
```

---

# 14. MVP Scope

Versi pertama aplikasi mencakup:

### Authentication

- Login.
- JWT authentication.
- Role-based authorization.

### Event Management

- Create event.
- Update event.
- Delete event.
- Event detail.

### Committee Management

- Create division.
- Assign coordinator.
- Add members.

### Task Management

- Create task.
- Assign PIC.
- Update status.
- Update progress.
- Deadline monitoring.

### Dashboard

- Event progress.
- Task statistics.
- Overdue task.
- Upcoming deadline.

### File Attachment

- Upload attachment pada task.

---

# 15. Future Development

Fitur berikut tidak wajib masuk MVP:

- Real-time notification menggunakan WebSocket.
- In-app notification.
- Email notification.
- WhatsApp reminder.
- Real-time chat.
- Meeting management.
- Attendance management.
- Budget management.
- Gantt Chart.
- Google Calendar integration.
- Mobile application.
- AI task recommendation.

---

# 16. Success Criteria

Mini project dianggap berhasil apabila sistem mampu:

1. Mengautentikasi pengguna berdasarkan role.
2. Membuat dan mengelola event.
3. Membuat struktur divisi.
4. Menambahkan anggota panitia.
5. Menentukan koordinator.
6. Membuat dan membagikan task.
7. Memperbarui progres task.
8. Mengidentifikasi task yang mendekati deadline.
9. Menampilkan task yang overdue.
10. Menampilkan progres event melalui dashboard.

---

# 17. Development Flow

```text
PHASE 1
Project Setup
│
├── NestJS
├── PostgreSQL
├── Prisma
└── Authentication
        │
        ▼
PHASE 2
Core Data
│
├── Users
├── Events
├── Divisions
└── Members
        │
        ▼
PHASE 3
Task Management
│
├── Create Task
├── Assign Task
├── Update Progress
└── Deadline
        │
        ▼
PHASE 4
Dashboard
│
├── Statistics
├── Progress
└── Deadline Monitoring
        │
        ▼
PHASE 5
Frontend Integration
        │
        ▼
PHASE 6
Testing & Deployment
```

## 18. Summary

Event & Committee Management System merupakan aplikasi manajemen kepanitiaan berbasis web dengan arsitektur **Next.js sebagai frontend, NestJS sebagai REST API backend, PostgreSQL sebagai database, dan Prisma sebagai ORM**. Fokus utama versi MVP adalah menyediakan sistem terpusat untuk mengelola event, divisi, anggota panitia, task, progres pekerjaan, dan deadline melalui dashboard yang dapat diakses berdasarkan role masing-masing pengguna.