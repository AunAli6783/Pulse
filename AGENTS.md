# Pulse — Clinic Appointment System

## Quick start
```bash
cd clinic-app
npm install
cp .env.example .env   # edit NEXTAUTH_SECRET
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
| `npx prisma generate` | Regenerate client after schema change |
| `npx prisma db push` | Sync schema to SQLite without migration |
| `npx tsx prisma/seed.ts` | Seed (idempotent `upsert`) |
| `npx playwright test tests/cases/` | All 47 E2E tests |
| `npx playwright test tests/cases/03-doctors.spec.ts` | Single file |
| `npx playwright test -g "test name"` | Single test by name |

## Architecture

**Stack:** Next.js 16.2 App Router · Prisma 7 + SQLite (`@prisma/adapter-libsql`) · NextAuth.js 4 JWT credentials · Tailwind CSS v4 · Recharts · Lucide React

**7 models:** User, Doctor, Availability, Appointment, Prescription, Review, MedicalRecord

**No component library** — pure inline styles (dark theme: `#0a0a0f` bg, `#16161f` cards, `#6366f1` accent).

**Route protection** (`middleware.ts` — deprecation warning):
- `/dashboard/*` → patient only
- `/doctor/*` → doctor only
- `/admin/*` → admin only

**Auth:** JWT credentials in `lib/auth.ts`. Session token includes `role`.

## Gotchas

- **Patient password: `admin231`** — user changed it from seed default `admin123`. Doctor & admin still `admin123`.
- **Login redirect chain**: form submit `signIn` + `router.push('/')` → home page `useEffect` detects session → `router.push('/{role-dashboard}')`. Final URL: `/dashboard`, `/doctor/dashboard`, or `/admin/dashboard`.
- **Inputs use `<label>` not `placeholder`** — use `page.fill('input[type="email"]', val)` in Playwright tests.
- **`backgroundColor` not `background`** — shorthand resets `background-image`, killing the grid pattern.
- **`.grid-bg` on `<body>`** in `layout.tsx`. Inline styles everywhere; no Tailwind classes in components.
- **Lucide React icons only** — never emojis.
- **Hover effects** use `onMouseEnter`/`onMouseLeave` event handlers, not CSS pseudo-classes.
- **`useSearchParams()` requires `<Suspense>`** boundary wrapper.
- **SQLite** — no enums, arrays, or JSON columns. Statuses are plain strings. Medical record files stored as base64.
- **PrismaLibSql adapter** in `lib/prisma.ts` — not default `prisma-client-js`. `prisma.config.ts` sets datasource URL, not `schema.prisma` `datasource` block.
- **`npm run build`** runs TypeScript check + Turbopack build — the main verify step.
- **Branch:** `developer` (not `main`).
- **Code root:** `clinic-app/` subdirectory. `AGENTS.md` and `opencode.json` at repo root `F:\clinic_project/`.

## Tests

Tests in `tests/cases/` (11 spec files, 47 tests). Config at `playwright.config.ts` (auto-starts dev server, 1 worker, Chromium only). Summary in `tests/summary/`.

**Custom agents** (registered in `opencode.json`):
| Agent | File | Purpose |
|-------|------|---------|
| `test-writer` | `.opencode/agents/test-writer.md` | Writes tests ONLY for changed code (uses `git diff`) |
| `test-runner` | `.opencode/agents/test-runner.md` | Runs only affected tests, retries only failures, writes summary on 100% pass |

After changing config or agents, **restart OpenCode**.

## Seed accounts

| Role | Email | Password |
|------|-------|----------|
| Patient | patient@clinic.com | admin231 |
| Doctor | abdulbari@clinic.com | admin123 |
| Admin | admin@clinic.com | admin123 |
