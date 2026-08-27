# Product Requirements Document (PRD)

# Event & Committee Management System

## 1. Product Overview

**Event & Committee Management System** adalah aplikasi berbasis web yang dirancang untuk membantu panitia dalam mengelola proses perencanaan, pelaksanaan, dan pemantauan sebuah event. Sistem ini menjadi pusat pengelolaan informasi terkait event, divisi, anggota panitia, pembagian tugas, deadline, dan progres pekerjaan. Dengan sistem ini, ketua panitia dan koordinator divisi dapat memantau perkembangan persiapan event secara lebih terstruktur, sementara anggota panitia dapat mengetahui tugas dan tanggung jawab mereka dalam satu platform.

## 2. Problem Statement

Dalam proses penyelenggaraan sebuah event, koordinasi antar panitia sering dilakukan melalui berbagai platform seperti WhatsApp, Google Sheets, Google Drive, dan komunikasi secara langsung. Kondisi ini menyebabkan informasi tersebar, tugas sulit dipantau, deadline berpotensi terlewat, serta ketua atau koordinator mengalami kesulitan dalam mengetahui progres persiapan event secara keseluruhan.

Diperlukan sebuah sistem terpusat yang dapat membantu mengelola struktur kepanitiaan, pembagian tugas, deadline, serta memantau progres pekerjaan setiap divisi dan anggota.

## 3. Product Goal

Tujuan utama aplikasi ini adalah menyediakan platform terpusat untuk membantu panitia event dalam:

- Mengelola data event.
- Mengatur struktur divisi dan anggota kepanitiaan.
- Membuat dan mendistribusikan tugas.
- Memantau status dan progres pekerjaan.
- Mengontrol deadline.
- Memberikan gambaran progres persiapan event melalui dashboard.

## 4. Target User

### 4.1 Administrator

Administrator bertanggung jawab terhadap pengelolaan sistem secara keseluruhan.

Kebutuhan utama:

- Mengelola akun pengguna.
- Melihat seluruh event.
- Mengelola data sistem.

### 4.2 Event Manager / Ketua Panitia

Pengguna yang bertanggung jawab atas keseluruhan pelaksanaan event.

Kebutuhan utama:

- Membuat dan mengelola event.
- Membuat divisi.
- Menentukan koordinator.
- Menambahkan anggota panitia.
- Memantau progres seluruh divisi.
- Mengidentifikasi tugas yang mendekati atau melewati deadline.

### 4.3 Koordinator Divisi

Pengguna yang bertanggung jawab terhadap satu divisi.

Kebutuhan utama:

- Melihat anggota divisi.
- Membuat dan membagikan tugas.
- Menentukan PIC.
- Memantau progres tugas divisi.
- Melakukan review pekerjaan.

### 4.4 Anggota Panitia

Pengguna yang menerima dan mengerjakan tugas.

Kebutuhan utama:

- Melihat tugas pribadi.
- Melihat deadline.
- Memperbarui status tugas.
- Mengunggah hasil pekerjaan.
- Memberikan informasi progres.

## 5. User Roles dan Permissions

| Fitur | Admin | Event Manager | Koordinator | Anggota |
|---|:---:|:---:|:---:|:---:|
| Kelola User | Ya | Tidak | Tidak | Tidak |
| Membuat Event | Ya | Ya | Tidak | Tidak |
| Mengelola Event | Ya | Ya | Terbatas | Tidak |
| Membuat Divisi | Ya | Ya | Tidak | Tidak |
| Mengelola Anggota | Ya | Ya | Divisi sendiri | Tidak |
| Membuat Task | Ya | Ya | Ya | Tidak |
| Assign Task | Ya | Ya | Ya | Tidak |
| Update Task | Ya | Ya | Ya | Task sendiri |
| Melihat Dashboard Event | Ya | Ya | Divisi sendiri | Pribadi |
| Melihat Semua Divisi | Ya | Ya | Tidak | Tidak |

## 6. Core Features

### 6.1 Authentication & User Management

Sistem menyediakan autentikasi pengguna untuk memastikan setiap pengguna memiliki akses sesuai dengan perannya.

Fitur:

- Login.
- Logout.
- Registrasi pengguna oleh administrator.
- Manajemen profil.
- Role-based access control.

Data pengguna:

- Nama.
- Email.
- Password.
- Foto profil.
- Role.

### 6.2 Event Management

Event Manager dapat membuat dan mengelola event.

Informasi event:

- Nama event.
- Deskripsi.
- Tanggal pelaksanaan.
- Lokasi.
- Ketua panitia.
- Status event.

Status:

- Planning.
- Preparation.
- Ongoing.
- Completed.

Contoh:

```text
Nama Event     : Technology Festival 2026
Tanggal        : 15 Desember 2026
Lokasi         : Makassar
Status         : Preparation
Ketua Panitia  : Anggi Rifqiadi
```

### 6.3 Division Management

Setiap event dapat memiliki beberapa divisi.

Contoh:

```text
Technology Festival 2026

- Acara
- Publikasi & Dokumentasi
- Sponsorship
- Humas
- Konsumsi
- Perlengkapan
```

Informasi divisi:

- Nama divisi.
- Deskripsi.
- Koordinator.
- Jumlah anggota.
- Jumlah task.
- Progress divisi.

### 6.4 Committee Member Management

Event Manager dapat menambahkan anggota ke dalam event dan menempatkannya pada divisi tertentu.

Setiap anggota memiliki:

- Nama.
- Email.
- Divisi.
- Jabatan.
- Status keanggotaan.

Contoh struktur:

```text
EVENT
│
├── DIVISI ACARA
│   ├── Koordinator
│   ├── Anggota 1
│   └── Anggota 2
│
├── DIVISI PUBLIKASI
│   ├── Koordinator
│   ├── Anggota 1
│   └── Anggota 2
│
└── DIVISI SPONSORSHIP
    ├── Koordinator
    └── Anggota
```

### 6.5 Task Management

Task Management merupakan fitur utama aplikasi.

Setiap task memiliki:

- Judul.
- Deskripsi.
- Event.
- Divisi.
- PIC.
- Deadline.
- Prioritas.
- Status.
- Lampiran.

#### Priority

- Low
- Medium
- High
- Urgent

#### Status

```text
To Do
   ↓
In Progress
   ↓
Review
   ↓
Completed
```

Contoh:

```text
Judul:
Membuat Poster Open Registration

Divisi:
Publikasi & Dokumentasi

PIC:
Anggi

Priority:
High

Deadline:
20 September 2026

Status:
In Progress
```

### 6.6 Task Detail & Progress

Setiap task memiliki halaman detail yang menampilkan:

- Informasi task.
- PIC.
- Deadline.
- Status.
- Prioritas.
- Deskripsi.
- Lampiran.
- Riwayat perubahan.

Anggota dapat:

- Mengubah status.
- Menambahkan progres.
- Mengunggah hasil pekerjaan.

Contoh:

```text
Progress: 70%

Update:
Desain utama telah selesai dan sedang
menunggu revisi dari koordinator.
```

### 6.7 Dashboard

Dashboard memberikan gambaran umum mengenai kondisi event.

#### Dashboard Event Manager

Menampilkan:

- Total divisi.
- Total anggota.
- Total task.
- Task selesai.
- Task dalam proses.
- Task terlambat.
- Progress keseluruhan event.
- Progress setiap divisi.
- Task yang mendekati deadline.
- Task yang overdue.
- Aktivitas terbaru.

Contoh:

```text
TOTAL DIVISI       8
TOTAL PANITIA      45
TOTAL TASK         72
TASK COMPLETED     38

OVERALL PROGRESS

████████████░░░░░░ 65%
```

### 6.8 Deadline Monitoring

Sistem memberikan indikator terhadap deadline tugas.

| Kondisi | Status |
|---|---|
| Deadline masih lama | Normal |
| Deadline ≤ 3 hari | Upcoming |
| Deadline hari ini | Due Today |
| Melewati deadline | Overdue |

Task overdue ditampilkan secara khusus pada dashboard Event Manager dan Koordinator.

### 6.9 Timeline Event

Sistem menyediakan timeline sederhana untuk melihat tahapan persiapan event.

```text
AGUSTUS
│
├── Pembentukan Panitia
├── Pembagian Divisi
└── Penyusunan Konsep

SEPTEMBER
│
├── Open Registration
├── Promosi
└── Sponsorship

OKTOBER
│
├── Technical Meeting
├── Finalisasi Acara
└── Persiapan Venue

NOVEMBER
│
└── EVENT DAY
```

## 7. User Flow

### Event Manager

```text
Login
  ↓
Dashboard
  ↓
Create Event
  ↓
Create Division
  ↓
Add Committee Members
  ↓
Assign Coordinator
  ↓
Create Tasks
  ↓
Monitor Progress
  ↓
Event Completed
```

### Koordinator

```text
Login
  ↓
Division Dashboard
  ↓
View Members
  ↓
Create Task
  ↓
Assign PIC
  ↓
Monitor Progress
  ↓
Review Task
```

### Anggota

```text
Login
  ↓
My Dashboard
  ↓
View Assigned Tasks
  ↓
Start Task
  ↓
Update Progress
  ↓
Submit for Review
  ↓
Task Completed
```

## 8. Database Requirements

### users

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

### events

```text
id
name
description
event_date
location
status
manager_id
created_at
updated_at
```

### divisions

```text
id
event_id
name
description
coordinator_id
created_at
updated_at
```

### event_members

```text
id
event_id
user_id
division_id
position
created_at
updated_at
```

### tasks

```text
id
event_id
division_id
title
description
assigned_to
priority
status
deadline
progress
created_at
updated_at
```

### task_updates

```text
id
task_id
user_id
progress
description
created_at
updated_at
```

### task_attachments

```text
id
task_id
user_id
file_name
file_path
created_at
updated_at
```

## 9. Database Relationship

```text
USERS
 │
 ├──────────────┐
 │              │
 ▼              ▼
EVENTS      EVENT_MEMBERS
 │              │
 │              │
 ▼              ▼
DIVISIONS ◄──── USERS
 │
 ▼
TASKS
 │
 ├───────────────┐
 ▼               ▼
TASK_UPDATES  TASK_ATTACHMENTS
```

Relasi utama:

- Satu Event memiliki banyak Division.
- Satu Event memiliki banyak Member.
- Satu Division memiliki banyak Member.
- Satu Division memiliki banyak Task.
- Satu User dapat memiliki banyak Task.
- Satu Task dapat memiliki banyak Update.
- Satu Task dapat memiliki banyak Attachment.

## 10. Non-Functional Requirements

### Performance

- Dashboard harus dapat dimuat dengan cepat pada penggunaan normal.
- Sistem mampu menangani beberapa event dan banyak task.

### Security

- Password harus dienkripsi.
- Setiap fitur dibatasi berdasarkan role pengguna.
- Pengguna tidak dapat mengakses data yang tidak memiliki izin.

### Usability

- Interface sederhana dan mudah dipahami.
- Tampilan responsif untuk desktop dan mobile.
- Status dan deadline mudah terlihat.

## 11. Technology Recommendation

| Komponen | Teknologi |
|---|---|
| Backend | Laravel |
| Frontend | Blade |
| Styling | Tailwind CSS |
| Database | MySQL |
| Authentication | Laravel Authentication |
| Authorization | Laravel Policy / Middleware |
| Charts | Chart.js |
| File Storage | Laravel Storage |

## 12. MVP Scope

### Fitur Wajib

- Authentication.
- Role management.
- Event management.
- Division management.
- Committee member management.
- Task management.
- Task progress.
- Deadline monitoring.
- Dashboard.
- Timeline sederhana.

### Pengembangan Selanjutnya

Fitur berikut tidak perlu masuk dalam versi pertama:

- Real-time chat.
- Notifikasi WhatsApp.
- Notifikasi email otomatis.
- Attendance management.
- Budget management.
- Meeting management.
- Gantt Chart kompleks.
- Integrasi Google Calendar.
- Mobile application.

## 13. Success Criteria

Mini project dianggap berhasil apabila pengguna dapat:

1. Membuat sebuah event.
2. Membuat beberapa divisi.
3. Menambahkan anggota panitia.
4. Menentukan koordinator setiap divisi.
5. Membuat dan mendistribusikan task.
6. Memantau progres pekerjaan.
7. Mengidentifikasi task yang mendekati atau melewati deadline.
8. Melihat progres keseluruhan event melalui dashboard.
