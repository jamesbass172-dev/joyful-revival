## Admin Portal — Joyful Montessori Nursery

Scoped from your answers: **core modules only**, **Cloudflare D1** backend, **password-gated `/admin`**.

### What ships in this pass

1. **Password gate at `/admin`**
   - Server-side shared-password gate (`SITE_ADMIN_PASSWORD` + `SESSION_SECRET` in env). Encrypted session cookie via `useSession`, timing-safe compare. No client-side auth.
   - `/admin/login` form → sets session → redirects to `/admin`. "Lock" button clears session.

2. **Admin shell**
   - Sidebar nav: Dashboard · Students · Attendance · Food Contributions · Settings. Distinct visual style from the public site (dense data UI, tables, cards).
   - Reused shadcn/ui primitives already installed. No new heavy deps.

3. **Core modules (per spec §1–§4)**
   - **Dashboard**: totals (enrolled, boys/girls, noon/evening, outstanding food, monthly income, upcoming birthdays). Recharts bar/pie for enrollment by class/sex.
   - **Students**: list + create/edit form matching the spec's fields (personal, guardian, academic). Auto Student ID (`JM####`), auto age from DOB. Search by name/parent/phone/admission #.
   - **Attendance**: per-day roster with Present/Absent/Sick/Permission + optional time in/out. Weekly summary + attendance % per student.
   - **Food Contributions**: per-student monthly grid (Jan–Dec) with Required / Paid / Balance / Status / Fund Type (Parent Contribution or JOYCO Fund). Totals row.

4. **Persistence: Cloudflare D1**
   - D1 schema (SQL migration file at `migrations/0001_admin.sql`): `students`, `attendance`, `food_contributions`, `settings`.
   - Data layer via `env.DB` bound as `DB` in `wrangler.toml`. Server functions in `src/lib/admin/*.functions.ts` do all reads/writes; UI never touches env.
   - `wrangler.toml` gets a commented `[[d1_databases]]` block ready to uncomment after you run `wrangler d1 create joyco-admin` locally.

### What's NOT in this pass (per "core modules only")

Fees, JOYCO Fund ledger, Parent Contributions ledger, Assessments, Communication, Gallery, Reports, Receipts, Notifications, full role-based accounts, Analytics beyond dashboard KPIs. Structure leaves room to add each as its own route + table later.

### Vendor lock-in notes

- **Cloudflare D1**: portable SQLite dialect. If you leave Cloudflare, migrations run as-is on any SQLite (e.g. Turso, libSQL, local file).
- **`@tanstack/react-start/server` `useSession`**: standard open-source, no Cloudflare-specific.
- **Recharts, shadcn/ui, Zod, Lucide**: all OSS, no lock-in.
- **Nothing Lovable-specific added.** (Existing `@lovable.dev/vite-tanstack-config` in `devDependencies` is unchanged — still the same trade-off flagged earlier.)

### Manual step required after I ship

Because Lovable's sandbox can't provision Cloudflare D1 for you, you'll run once from your machine:

```
wrangler d1 create joyco-admin        # copy the printed database_id
wrangler d1 execute joyco-admin --file=migrations/0001_admin.sql --remote
```

Then paste the `database_id` into `wrangler.toml` (I'll leave a clearly marked placeholder). **Until you do this, the admin UI runs in a local-only fallback mode** (in-memory on the server per-request) so you can click through the UI in the Lovable preview — but data won't persist. The moment `env.DB` is bound, it uses D1 automatically. This is the only way to honor "D1 + no Lovable provisioning" without me creating vendor coupling.

### Secrets I'll request via the secrets tool

- `SITE_ADMIN_PASSWORD` — you set the value
- `SESSION_SECRET` — auto-generated 32-char

### File plan

```text
src/routes/admin/route.tsx              layout + password gate (beforeLoad)
src/routes/admin/login.tsx              login form
src/routes/admin/index.tsx              dashboard
src/routes/admin/students.tsx           list
src/routes/admin/students.new.tsx       create form
src/routes/admin/students.$id.tsx       edit form
src/routes/admin/attendance.tsx         daily roster
src/routes/admin/food.tsx               monthly grid
src/routes/admin/settings.tsx           school config
src/components/admin/AdminShell.tsx     sidebar layout
src/lib/admin/session.ts                shared session config + requireUnlocked()
src/lib/admin/db.ts                     D1 accessor w/ in-memory fallback
src/lib/admin/students.functions.ts     list/get/create/update/delete
src/lib/admin/attendance.functions.ts   get-by-date / upsert
src/lib/admin/food.functions.ts         get-by-student-year / upsert
src/lib/admin/dashboard.functions.ts    aggregate KPIs
src/lib/admin/gate.functions.ts         unlock/lock server fns
migrations/0001_admin.sql               D1 schema
wrangler.toml                           add commented [[d1_databases]] block
```

Approve and I'll build it.