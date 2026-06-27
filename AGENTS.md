# Pulse — Clinic Appointment System

## Quick start
```bash
cd clinic-app
npm install
cp .env.example .env   # then edit NEXTAUTH_SECRET
npx prisma generate
npx tsx prisma/seed.ts
npm run dev
```

## Commands
| Command | Action |
|---------|--------|
| `npm run dev` | Dev server on :3000 |
| `npm run build` | Typecheck + production build |
| `npm run lint` | ESLint |
| `npx tsx prisma/seed.ts` | Seed 12 doctors + admin + patient |
| `npx prisma generate` | Regenerate client after schema change |

## Architecture

**Stack:** Next.js 16.2 App Router · Prisma 7 + SQLite (via `@prisma/adapter-libsql`) · NextAuth.js 4 JWT credentials · Tailwind CSS v4 · Recharts (admin charts) · Lucide React icons

**No component library** — pure Tailwind CSS with inline styles (dark theme: `#0a0a0f` bg, `#16161f` cards, `#6366f1` accent).

**Route roles** (enforced in `middleware.ts`):
- `/dashboard/*` → `patient` only
- `/doctor/*` → `doctor` only
- `/admin/*` → `admin` only

**Auth:** JWT credentials provider in `lib/auth.ts`. Session token includes `role`. All accounts use password `admin123`.

**Prisma adapter:** `PrismaLibSql` in `lib/prisma.ts` — NOT the default `prisma-client-js` adapter. `DATABASE_URL=file:./dev.db`.

**API routes** at `app/api/`:
- `auth/register|login|me|[...nextauth]`
- `doctors/[id]`, `appointments/[id]`, `prescriptions/[id]`
- `availability/[doctor-id]/[date]`
- `admin/stats` (dashboard counts), `admin/reports` (monthly, doctors, patients)

## Design conventions
- **Dark theme:** background `#0a0a0f`, cards `rgba(22,22,31,0.7)`, borders `rgba(42,42,58,0.6)`, accent `#6366f1`
- **Grid background:** `className="grid-bg"` on `<body>` (layout.tsx) — visible on all routes
- **Always use `backgroundColor` not `background`** in inline styles — `background` shorthand resets `background-image`, killing the grid pattern
- **Inline styles over Tailwind classes** — project convention for consistency
- **Lucide React** for icons, never emojis
- **3sections per page** — padding `100px 24px`, cards `14-16px` border-radius

## Project structure
```
clinic-app/
├── app/              # Next.js App Router pages + API
│   ├── page.tsx      # Landing (hero, specialties, how-it-works, features, CTA)
│   ├── layout.tsx    # Root layout: grid-bg body, Navbar, Footer
│   ├── dashboard/    # Patient routes
│   ├── doctor/       # Doctor routes (dashboard, appointments, availability, prescriptions, profile)
│   ├── admin/        # Admin routes (dashboard, appointments, doctors, patients, reports)
│   ├── doctors/      # Public doctor listing + detail
│   ├── contact/      # Contact page
│   ├── login|register/
│   └── api/          # All backend endpoints
├── components/       # Reusable: Navbar, Footer, DoctorCard, StatsCard, StatusBadge, AppointmentCard
├── lib/              # prisma.ts, auth.ts
├── types/            # TypeScript interfaces
└── prisma/           # schema.prisma, seed.ts
```

## Key gotchas
- **`useSearchParams()` requires a `<Suspense>` wrapper** — wrap in a separate component with `Suspense` boundary
- **SQLite** — no MySQL, no Docker. Schema: User, Doctor, Availability, Appointment, Prescription
- **Seed passwords** — all accounts: `admin123`. Emails: `admin@clinic.com`, `patient@clinic.com`, `abdulbari@clinic.com` etc.
- **dev.db is gitignored** — run `npx tsx prisma/seed.ts` after clone
- **Prisma 7** uses `prisma.config.ts` for datasource URL
- **npm only** — package-lock.json present
- **Dev server conflicts** — kill old process with `npx kill-port 3000` if EADDRINUSE
