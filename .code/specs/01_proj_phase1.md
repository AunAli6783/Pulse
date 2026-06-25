# Clinic Doctor Appointment System — Requirements Spec

## Project Overview
A full-stack web application for managing doctor appointments,
patient records, and clinic operations built with Next.js,
Node.js, MySQL, and JWT authentication.

---

## Tech Stack
- Frontend: Next.js 14 (App Router)
- Backend: Next.js API Routes
- Database: MySQL with Prisma ORM
- Auth: NextAuth.js with JWT
- Styling: Tailwind CSS
- Email: Nodemailer (appointment reminders)
- PDF: React-PDF (prescriptions)

---

## Roles

### 1. Patient
- Register and login
- Book appointments
- View own appointment history
- Cancel upcoming appointments
- View prescriptions

### 2. Doctor
- Login (created by admin only)
- Set available time slots
- View upcoming appointments
- Mark appointments complete
- Write prescriptions

### 3. Admin
- Full dashboard access
- Manage doctors (add, edit, delete)
- Manage patients
- View all appointments
- View reports and analytics

---

## Database Schema

### users
```
id            INT PRIMARY KEY AUTO_INCREMENT
name          VARCHAR(255)
email         VARCHAR(255) UNIQUE
password      VARCHAR(255)
role          ENUM('patient', 'doctor', 'admin')
phone         VARCHAR(20)
created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### doctors
```
id            INT PRIMARY KEY AUTO_INCREMENT
user_id       INT FK → users.id
specialization VARCHAR(255)
qualification  VARCHAR(255)
experience     INT
fee            DECIMAL(10,2)
bio            TEXT
avatar         VARCHAR(255)
is_active      BOOLEAN DEFAULT true
```

### availability
```
id            INT PRIMARY KEY AUTO_INCREMENT
doctor_id     INT FK → doctors.id
day_of_week   ENUM('Mon','Tue','Wed','Thu','Fri','Sat','Sun')
start_time    TIME
end_time      TIME
slot_duration INT DEFAULT 30 (minutes)
```

### appointments
```
id            INT PRIMARY KEY AUTO_INCREMENT
patient_id    INT FK → users.id
doctor_id     INT FK → doctors.id
appointment_date DATE
appointment_time TIME
status        ENUM('pending','confirmed','completed','cancelled')
reason        TEXT
notes         TEXT
created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### prescriptions
```
id            INT PRIMARY KEY AUTO_INCREMENT
appointment_id INT FK → appointments.id
doctor_id     INT FK → doctors.id
patient_id    INT FK → users.id
medicines     JSON
instructions  TEXT
created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

---

## Pages and Routes

### Public Pages
```
/                  → Landing page (hero, doctors list, about)
/login             → Login page
/register          → Patient registration
/doctors           → Browse all doctors
/doctors/[id]      → Doctor detail + book appointment
```

### Patient Pages (protected)
```
/dashboard                  → Patient dashboard
/dashboard/appointments     → My appointments list
/dashboard/book/[doctor-id] → Book appointment
/dashboard/prescriptions    → My prescriptions
/dashboard/profile          → Edit profile
```

### Doctor Pages (protected)
```
/doctor/dashboard           → Doctor dashboard + today's appointments
/doctor/appointments        → All appointments
/doctor/availability        → Set available time slots
/doctor/prescriptions       → Write and view prescriptions
/doctor/profile             → Edit profile
```

### Admin Pages (protected)
```
/admin/dashboard            → Stats overview
/admin/doctors              → Manage doctors
/admin/doctors/add          → Add new doctor
/admin/patients             → Manage patients
/admin/appointments         → All appointments
/admin/reports              → Analytics and reports
```

---

## API Routes

### Auth
```
POST /api/auth/register       → patient registration
POST /api/auth/login          → login all roles
POST /api/auth/logout         → logout
GET  /api/auth/me             → get current user
```

### Doctors
```
GET  /api/doctors             → list all active doctors
GET  /api/doctors/[id]        → single doctor detail
POST /api/doctors             → admin: add doctor
PUT  /api/doctors/[id]        → admin: update doctor
DELETE /api/doctors/[id]      → admin: delete doctor
```

### Availability
```
GET  /api/availability/[doctor-id]          → get doctor slots
GET  /api/availability/[doctor-id]/[date]   → get free slots for date
POST /api/availability                      → doctor: set availability
PUT  /api/availability/[id]                 → doctor: update slot
```

### Appointments
```
GET  /api/appointments              → list (filtered by role)
GET  /api/appointments/[id]         → single appointment
POST /api/appointments              → patient: book appointment
PUT  /api/appointments/[id]         → update status
DELETE /api/appointments/[id]       → cancel appointment
```

### Prescriptions
```
GET  /api/prescriptions             → list (filtered by role)
GET  /api/prescriptions/[id]        → single prescription
POST /api/prescriptions             → doctor: create prescription
```

### Admin
```
GET  /api/admin/stats               → dashboard stats
GET  /api/admin/reports             → appointment analytics
```

---

## Core Features

### 1. Authentication
- JWT tokens stored in httpOnly cookies
- Role-based route protection
- Session expiry handling
- Password hashing with bcrypt

### 2. Appointment Booking Flow
```
Patient selects doctor
→ selects date from calendar
→ system shows available time slots
→ patient selects slot and enters reason
→ appointment created with status: pending
→ doctor confirms → status: confirmed
→ email notification sent to patient
→ appointment day → doctor marks complete
→ doctor writes prescription (optional)
```

### 3. Doctor Availability
- Doctor sets weekly schedule
- System auto-generates time slots
- Booked slots hidden from calendar
- Doctor can block specific dates

### 4. Prescription System
- Doctor selects medicines (name, dosage, frequency)
- Adds instructions
- Patient can view and download as PDF

### 5. Admin Dashboard Stats
```
- Total patients registered
- Total appointments today
- Total appointments this month
- Revenue this month (appointments × fee)
- Most booked doctors
- Appointment status breakdown (chart)
```

---

## UI Components Needed

```
Navbar              → role-aware navigation
DoctorCard          → doctor listing card
AppointmentCard     → appointment status card
Calendar            → date picker for booking
TimeSlotPicker      → available slots grid
StatusBadge         → pending/confirmed/completed/cancelled
PrescriptionForm    → add medicines dynamically
StatsCard           → admin dashboard metric
DataTable           → sortable filterable table
Modal               → confirm/cancel dialogs
```

---

## Environment Variables

```
DATABASE_URL=mysql://user:password@localhost:3306/clinic_db
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

---

## Folder Structure

```
clinic-app/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (patient)/
│   │   └── dashboard/
│   ├── (doctor)/
│   │   └── doctor/
│   ├── (admin)/
│   │   └── admin/
│   ├── doctors/
│   └── api/
├── components/
│   ├── ui/
│   ├── forms/
│   └── dashboard/
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   └── email.ts
├── prisma/
│   └── schema.prisma
└── types/
    └── index.ts
```

---

## Implementation Order (Tasks)

```
Phase 1 — Foundation
  1. Project setup (Next.js + Tailwind + Prisma + MySQL)
  2. Database schema and migrations
  3. Authentication system (register, login, JWT)
  4. Role-based middleware

Phase 2 — Core Features
  5. Doctor listing and detail pages
  6. Doctor availability setup
  7. Appointment booking flow
  8. Appointment management (confirm, cancel, complete)

Phase 3 — Extended Features
  9. Prescription system
  10. Email notifications
  11. Patient dashboard
  12. Doctor dashboard

Phase 4 — Admin
  13. Admin dashboard with stats
  14. Doctor management CRUD
  15. Patient management
  16. Reports and analytics

Phase 5 — Polish
  17. PDF prescription download
  18. Responsive design
  19. Loading states and error handling
  20. Final testing
```