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
| `npm run build` | Typecheck + production build — run after any edit |
| `npm run lint` | ESLint |
| `npx tsx prisma/seed.ts` | Seed (idempotent — uses `upsert`) |
| `npx prisma generate` | Regenerate client after schema change |
| `npx kill-port 3000` | Kill hung dev server |
| `npx playwright test` | Run all Playwright E2E tests |
| `npx playwright test --ui` | Run tests with interactive browser UI |
| `npx playwright show-report` | View HTML test report |

## Architecture

**Stack:** Next.js 16.2 App Router · Prisma 7 + SQLite (`@prisma/adapter-libsql`) · NextAuth.js 4 JWT credentials · Tailwind CSS v4 · Recharts · Lucide React

**6 models:** User, Doctor, Availability, Appointment, Prescription, Review

**No component library** — pure inline styles (dark theme: `#0a0a0f` bg, `#16161f` cards, `#6366f1` accent).

**Route protection** (middleware.ts — currently warns "middleware is deprecated, use proxy instead"):
- `/dashboard/*` → patient only
- `/doctor/*` → doctor only
- `/admin/*` → admin only

**Auth:** JWT credentials in `lib/auth.ts`. Session token includes `role`. All accounts: `admin123`.

**Prisma adapter:** `PrismaLibSql` in `lib/prisma.ts` — NOT default `prisma-client-js`. Uses `prisma.config.ts` for datasource URL (Prisma 7 convention), not `schema.prisma` `datasource` block.

**Seed:** 1 admin + 1 patient + 12 Pakistani doctors (real names, hospitals) + 5 sample reviews. Passwords all `admin123`.

**Navbar role-links** (`Navbar.tsx`): When logged in, shows only the links relevant to that user's role (patient: Dashboard/Appointments/Prescriptions; doctor: +Availability; admin: +Doctors/Patients/Reports). Public links (How It Works/Specialties) hidden when logged in.

## API routes (`app/api/`)
```
auth/register|login|me|[...nextauth]
doctors/[id]
appointments/[id]
prescriptions/[id]
availability/[doctor-id]/[date]
reviews          # GET with ?doctor_id= (public), ?appointment_id= (check), or session (role-filtered); POST (patient only)
admin/stats      # Dashboard counts (admin)
admin/reports    # Monthly/doctors/patients reports (admin)
```

## Design conventions
- `backgroundColor` not `background` — the shorthand resets `background-image`, killing the grid pattern
- `.grid-bg` class on `<body>` in `layout.tsx` for the subtle grid overlay
- Inline styles over Tailwind classes (project convention, be consistent)
- Lucide React for icons (never emojis)
- Cards: `14-16px` border-radius; sections: `100px 24px` padding
- Use `onMouseEnter`/`onMouseLeave` for hover effects (no CSS hover pseudo-classes with inline styles)

## Key gotchas
- **`useSearchParams()` requires `<Suspense>`** — wrap in boundary
- **SQLite** — no enums, arrays, or JSON columns. Statuses stored as plain strings
- **dev.db is gitignored** — new clones must run `npx tsx prisma/seed.ts`
- **`npm run build`** runs both TypeScript check + Turbopack build — the main verify step
- **npm only** — no yarn/pnpm; `package-lock.json` present
- **Branch name** — `developer` (not `main`)
- **Project root** — code is in `clinic-app/` subdirectory; `AGENTS.md` and `README.md` are at the repo root `F:\clinic_project/`

## Custom agents (OpenCode)

| Agent | File | Purpose |
|-------|------|---------|
| `test-writer` | `.opencode/agents/test-writer.md` | Writes Playwright E2E tests following project conventions |
| `test-runner` | `.opencode/agents/test-runner.md` | Runs Playwright tests, parses output, reports failures |

Config: `opencode.json` at repo root. Agents are in `.opencode/agents/`. Tests are in `clinic-app/tests/`. After changing config or agents, **restart OpenCode**.|
