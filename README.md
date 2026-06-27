# Pulse — Clinic Appointment System

> **Full-stack clinic management system** built with Next.js 16, Prisma 7, SQLite, NextAuth.js, and Tailwind CSS v4.  
> Patients book doctors, doctors manage schedules & prescriptions, admins oversee everything.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16.2 (App Router, Turbopack) |
| **Database** | SQLite via `@prisma/adapter-libsql` |
| **ORM** | Prisma 7 (with `prisma.config.ts`) |
| **Auth** | NextAuth.js v4 (JWT, credentials provider) |
| **Styling** | Tailwind CSS v4 + inline styles |
| **Charts** | Recharts (admin reports) |
| **Icons** | Lucide React |
| **Email** | Nodemailer (installed, configurable) |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env — set NEXTAUTH_SECRET to a random string:
#   NEXTAUTH_SECRET=your-random-secret-here

# 3. Generate Prisma client & seed database
npx prisma generate
npx tsx prisma/seed.ts

# 4. Start dev server
npm run dev        # → http://localhost:3000
```

### Seed Accounts

All accounts use password **`admin123`**.

| Role | Email | Name |
|------|-------|------|
| **Admin** | `admin@clinic.com` | — |
| **Patient** | `patient@clinic.com` | Ali Ahmed |
| **Doctor** | `abdulbari@clinic.com` | Dr. Abdul Bari Khan (Cardiologist) |
| **Doctor** | `adeebrizvi@clinic.com` | Dr. Adeebul Hasan Rizvi (Urologist) |
| **Doctor** | `asmahumayun@clinic.com` | Dr. Asma Humayun (Dermatologist) |
| **Doctor** | `nadeemsheikh@clinic.com` | Dr. Nadeem Ahmed Sheikh (Neurologist) |
| **Doctor** | `muhammadirfan@clinic.com` | Dr. Muhammad Irfan (Orthopedic Surgeon) |
| **Doctor** | `faisalsultan@clinic.com` | Dr. Faisal Sultan (Internal Medicine) |
| **Doctor** | `javedakram@clinic.com` | Dr. Javed Akram (Endocrinologist) |
| **Doctor** | `rizwanachaudhri@clinic.com` | Dr. Rizwana Chaudhri (Gynecologist) |
| **Doctor** | `shabnamrizvi@clinic.com` | Dr. Shabnam Rizvi (Ophthalmologist) |
| **Doctor** | `muhammadalijan@clinic.com` | Dr. Muhammad Ali Jan (Pediatrician) |
| **Doctor** | `aamirzaman@clinic.com` | Dr. Aamir Zaman (Psychiatrist) |
| **Doctor** | `farahnaaz@clinic.com` | Dr. Farah Naaz (ENT Specialist) |

---

## Project Architecture

```
clinic-app/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Landing page
│   ├── layout.tsx          # Root layout (grid-bg, Navbar, Footer, Providers)
│   ├── globals.css         # Dark theme, CSS variables, grid-bg, animations
│   ├── providers.tsx       # SessionProvider
│   ├── middleware.ts       # Route protection by role
│   ├── login|register/     # Auth pages
│   ├── contact/            # Contact page
│   ├── doctors/            # Public doctor listing & detail
│   ├── dashboard/          # Patient routes (protected)
│   ├── doctor/             # Doctor routes (protected)
│   ├── admin/              # Admin routes (protected)
│   └── api/                # REST API routes
├── components/             # Reusable UI components
│   ├── Navbar.tsx          # Role-aware navigation
│   ├── Footer.tsx          # Global footer
│   ├── DoctorCard.tsx      # Doctor listing card
│   ├── AppointmentCard.tsx # Appointment summary card
│   ├── ui/
│   │   └── StatusBadge.tsx # Status pill (pending/confirmed/completed/cancelled)
│   └── dashboard/
│       └── StatsCard.tsx   # Dashboard stat card (optional link)
├── lib/
│   ├── prisma.ts           # Prisma client (singleton, LibSQL adapter)
│   └── auth.ts             # NextAuth config (credentials, JWT)
├── types/
│   └── index.ts            # TypeScript interfaces
└── prisma/
    ├── schema.prisma       # Database schema (6 models)
    ├── seed.ts             # 14 users + 5 sample reviews
    └── dev.db              # SQLite database (gitignored)
```

---

## Route Map

### Public Routes (no auth required)

| Path | Description |
|------|-------------|
| `/` | Landing page — hero, specialties, how-it-works, features, CTA |
| `/login` | Sign in with email & password |
| `/register` | Create a patient account |
| `/contact` | Contact form + developer info |
| `/doctors` | Browse all doctors with search & filtering |
| `/doctors/[id]` | Doctor detail — bio, reviews, availability |

### Patient Routes (`/dashboard/*`)

| Path | Description |
|------|-------------|
| `/dashboard` | Dashboard — stats bar, next appointment widget, recent prescriptions, quick links |
| `/dashboard/appointments` | View & manage appointments — filter tabs (All/Upcoming/Completed/Cancelled), cancel pending, rate completed |
| `/dashboard/book/[doctor-id]` | Book an appointment — select date, time slot, add reason |
| `/dashboard/prescriptions` | View your prescriptions |
| `/dashboard/profile` | Edit your profile |

### Doctor Routes (`/doctor/*`)

| Path | Description |
|------|-------------|
| `/doctor/dashboard` | Dashboard — average rating, recent feedback, today's appointments, quick links |
| `/doctor/appointments` | View & manage appointments — confirm, complete, cancel |
| `/doctor/availability` | Set weekly availability schedule |
| `/doctor/prescriptions` | Write & manage prescriptions |
| `/doctor/profile` | Edit your profile |

### Admin Routes (`/admin/*`)

| Path | Description |
|------|-------------|
| `/admin/dashboard` | Dashboard — total counts, appointment breakdown, revenue |
| `/admin/appointments` | View all appointments — filter tabs (All/Today/Month) + status filter |
| `/admin/doctors` | Manage doctors — list, add, activate/deactivate |
| `/admin/patients` | Manage patients — list, click for details |
| `/admin/reports` | Reports — revenue chart, doctor performance table, patient history, reviews — CSV export per section |

---

## API Endpoints

All API routes are under `/api/` and require authentication (via NextAuth session) except where noted.

| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/auth/register` | POST | Register a new patient |
| `/api/auth/login` | POST | Login (returns user + session) |
| `/api/auth/me` | GET | Current user profile |
| `/api/auth/[...nextauth]` | GET, POST | NextAuth handler |
| `/api/doctors` | GET | List all doctors (public) |
| `/api/doctors/[id]` | GET, PUT | Doctor detail (public GET), update (admin) |
| `/api/appointments` | GET, POST | List (role-filtered), create |
| `/api/appointments/[id]` | GET, PUT, PATCH | Manage single appointment |
| `/api/availability` | POST | Create availability |
| `/api/availability/[doctor-id]` | GET, PUT | Get/update doctor's weekly schedule |
| `/api/availability/[doctor-id]/[date]` | GET | Available time slots for a date |
| `/api/prescriptions` | GET, POST | List (role-filtered), create |
| `/api/prescriptions/[id]` | GET, PUT | Single prescription |
| `/api/reviews` | GET, POST | Reviews (GET with `?doctor_id=` for public, `?appointment_id=` for check) |
| `/api/admin/stats` | GET | Dashboard counts (admin only) |
| `/api/admin/reports` | GET | Monthly/doctors/patients reports (admin only) |

---

## Database Schema (6 Models)

```prisma
User      1──1  Doctor
User      1──N  Appointment   (as patient)
User      1──N  Prescription
User      1──N  Review        (as patient)
Doctor    1──N  Availability
Doctor    1──N  Appointment
Doctor    1──N  Prescription
Doctor    1──N  Review
Appointment 1──1 Prescription (optional)
Appointment 1──1 Review       (optional)
```

### Appointment Statuses

| Status | Meaning |
|--------|---------|
| `pending` | Patient booked, awaiting doctor confirmation |
| `confirmed` | Doctor confirmed the slot |
| `completed` | Appointment fulfilled |
| `cancelled` | Cancelled by patient or doctor |

---

## Commands

```bash
npm run dev       # Start dev server on port 3000
npm run build     # TypeScript check + production build
npm run start     # Start production server
npm run lint      # Run ESLint
npx prisma generate   # Regenerate Prisma client after schema changes
npx tsx prisma/seed.ts  # Seed database (idempotent)
npx kill-port 3000      # Kill dev server (if EADDRINUSE)
```

---

## Configuration

### Environment Variables (`.env`)

```env
DATABASE_URL=file:./dev.db
NEXTAUTH_SECRET=generate-a-random-secret-here
NEXTAUTH_URL=http://localhost:3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| **SQLite over MySQL** | No MySQL/PostgreSQL required — zero setup, portable `dev.db` file |
| **LibSQL adapter** | `@prisma/adapter-libsql` instead of `better-sqlite3` (native addon failed on Windows) |
| **Inline styles** | Project convention: consistency across all components |
| **`backgroundColor` not `background`** | The `background` shorthand resets `background-image`, killing the `.grid-bg` pattern |
| **JWT credentials auth** | Simple, no database sessions needed, role stored in token |
| **Prisma 7 config file** | Uses `prisma.config.ts` instead of embedded `datasource` block |

---

## Design System

### Theme

```css
-- Dark background:  #0a0a0f
-- Card background:  rgba(22, 22, 31, 0.7)
-- Card border:      rgba(42, 42, 58, 0.6)
-- Accent:           #6366f1 (indigo)
-- Text primary:     #f0f0ff
-- Text secondary:   #8888aa
-- Text muted:       #555570
```

### Conventions

- Use `backgroundColor` in inline styles, never `background` (shorthand resets grid)
- Use Lucide React icons, never emojis
- Cards: `14-16px` border-radius, `20-24px` padding
- Section padding: `100px 24px`
- `grid-bg` class on `<body>` provides subtle grid overlay visible on all routes

---

## Important Gotchas

1. **`useSearchParams()` requires `<Suspense>`** — wrap components using it in a `Suspense` boundary.

2. **`background` vs `backgroundColor`** — Inline `background` shorthand overrides the `background-image` from `.grid-bg`. Always use `backgroundColor` for inline color.

3. **SQLite limitations** — No enums, no arrays, no JSON columns. Status is stored as plain strings.

4. **Prisma 7 config** — Database URL is configured in `prisma.config.ts`, not in `schema.prisma`.

5. **Dev.db is gitignored** — New developers must run `npx tsx prisma/seed.ts` to create the database.

6. **Next.js 16 middleware** — Uses the deprecated `middleware.ts` convention. Future Next.js versions will use `proxy` instead.

7. **All passwords are `admin123`** — For development only. Change in production.

---

## Deployment

### Build for Production

```bash
npm run build
npm run start      # Runs on port 3000 (configure via PORT env)
```

### Deploy to Vercel (recommended)

1. Push to GitHub
2. Import repo in Vercel
3. Set environment variables in Vercel dashboard
4. Build command: `npx prisma generate && npm run build`
5. Note: SQLite won't persist on Vercel's serverless functions — swap to PostgreSQL or Turso (LibSQL) for production

### Swap to Production Database

For production, replace SQLite with PostgreSQL or Turso:

```bash
# Install PostgreSQL driver
npm install @prisma/adapter-pg
```

Update `prisma.config.ts`:
```ts
export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
})
```

Update `schema.prisma` provider to `postgresql` and reconnect the adapter in `lib/prisma.ts`.

---

## Project Structure Conventions

- **Pages**: One directory per route, `page.tsx` for the component
- **API routes**: Named with `route.ts` (Next.js App Router convention)
- **Components**: PascalCase, one component per file, in `components/`
- **Types**: Centralized in `types/index.ts`
- **Auth config**: In `lib/auth.ts` — shared by middleware, API routes, and pages
- **Prisma client**: Singleton in `lib/prisma.ts` (hot-reload safe in development)

---

## Extending the Project

### Add a New Page

```bash
# Create the route directory
mkdir app/your-route
# Create the page file
touch app/your-route/page.tsx
```

### Add a New API Endpoint

```bash
mkdir app/api/your-resource
touch app/api/your-resource/route.ts
```

### Add a New Model

1. Add model to `prisma/schema.prisma`
2. Run `npx prisma generate`
3. Create API routes in `app/api/`
4. Create UI pages in `app/`

### Suggested Enhancements

- **Notifications**: Email reminders via Nodemailer (already installed)
- **Payment tracking**: Add fee/payment fields to Appointment model
- **Medical records**: File upload for lab reports, X-rays, etc.
- **Availability calendar**: Visual calendar view for admin
- **WebSockets**: Real-time notifications for appointment updates (Socket.io or Server-Sent Events)

---

## License

MIT — built as a portfolio project.

---

*Built with Next.js, Prisma, SQLite, and Tailwind CSS.*
