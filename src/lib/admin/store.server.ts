// Persistent data layer for the admin portal.
//
// Two backends, picked automatically at runtime:
//   1. Cloudflare D1  — used whenever a binding named `DB` is available
//                       (see wrangler.toml + migrations/0001_admin.sql).
//   2. JSON snapshot  — used when running on Node (local dev / `vite dev`),
//                       written to .data/admin.json so data survives restarts
//                       and hot reloads.
// If neither is writable we degrade to an in-process map (never silently
// loses data within a request, but is not durable).

export type Student = {
  id: string;
  full_name: string;
  photo_url?: string;
  date_of_birth?: string;
  sex?: "Male" | "Female";
  admission_number?: string;
  admission_date?: string;
  home_address?: string;
  guardian_name?: string;
  guardian_relationship?: string;
  guardian_phone?: string;
  guardian_alt_phone?: string;
  guardian_email?: string;
  guardian_occupation?: string;
  guardian_address?: string;
  emergency_contact?: string;
  class?: "Baby Class" | "P One" | "P Two";
  session?: "Noon" | "Evening";
  status?: "Active" | "Graduated" | "Transferred" | "Withdrawn";
};

export type AttendanceRecord = {
  student_id: string;
  day: string; // YYYY-MM-DD
  status: "Present" | "Absent" | "Sick" | "Permission";
  time_in?: string;
  time_out?: string;
};

export type FoodRecord = {
  student_id: string;
  year: number;
  month: number; // 1..12
  required_amount: number;
  paid_amount: number;
  fund_type: "Parent Contribution" | "JOYCO Fund";
};

export type Store = {
  students: Map<string, Student>;
  attendance: Map<string, AttendanceRecord>; // key: `${student_id}|${day}`
  food: Map<string, FoodRecord>; // key: `${student_id}|${year}|${month}`
  settings: Map<string, string>;
};

type Snapshot = {
  students: Student[];
  attendance: AttendanceRecord[];
  food: FoodRecord[];
  settings: [string, string][];
};

const DEFAULT_SETTINGS: [string, string][] = [
  ["school_name", "Joyful Montessori Nursery & Day Care"],
  ["monthly_food_contribution", "20000"],
  ["academic_year", "2026"],
];

const g = globalThis as unknown as { __joycoStore?: Store; __joycoLoaded?: Promise<Store> };

function emptyStore(): Store {
  return {
    students: new Map(),
    attendance: new Map(),
    food: new Map(),
    settings: new Map(DEFAULT_SETTINGS),
  };
}

/* ------------------------------------------------------------------ D1 --- */

type D1Like = {
  prepare: (sql: string) => {
    bind: (...args: unknown[]) => { run: () => Promise<unknown>; all: () => Promise<{ results?: unknown[] }> };
    run: () => Promise<unknown>;
    all: () => Promise<{ results?: unknown[] }>;
  };
};

function getD1(): D1Like | null {
  const candidates: unknown[] = [
    (globalThis as Record<string, unknown>).DB,
    ((globalThis as Record<string, unknown>).__env__ as Record<string, unknown> | undefined)?.DB,
    (process.env as unknown as Record<string, unknown>)?.DB,
  ];
  for (const c of candidates) {
    if (c && typeof (c as D1Like).prepare === "function") return c as D1Like;
  }
  return null;
}

/* ------------------------------------------------------------- file I/O --- */

const FILE = ".data/admin.json";

async function nodeFs() {
  try {
    const fs = await import("node:fs/promises");
    // Workers ship a virtual fs; probe it before trusting it.
    await fs.mkdir(".data", { recursive: true });
    return fs;
  } catch {
    return null;
  }
}

async function readSnapshot(): Promise<Snapshot | null> {
  const fs = await nodeFs();
  if (!fs) return null;
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as Snapshot;
  } catch {
    return null;
  }
}

async function writeSnapshot(s: Store) {
  const fs = await nodeFs();
  if (!fs) return;
  const snap: Snapshot = {
    students: Array.from(s.students.values()),
    attendance: Array.from(s.attendance.values()),
    food: Array.from(s.food.values()),
    settings: Array.from(s.settings.entries()),
  };
  try {
    await fs.writeFile(FILE, JSON.stringify(snap, null, 2), "utf8");
  } catch {
    /* read-only fs — keep in-memory copy */
  }
}

/* --------------------------------------------------------------- loading -- */

async function loadFromD1(db: D1Like): Promise<Store> {
  const s = emptyStore();
  const students = (await db.prepare("SELECT * FROM students").all()).results ?? [];
  for (const row of students as Student[]) s.students.set(row.id, row);
  const att = (await db.prepare("SELECT * FROM attendance").all()).results ?? [];
  for (const row of att as AttendanceRecord[]) s.attendance.set(`${row.student_id}|${row.day}`, row);
  const food = (await db.prepare("SELECT * FROM food_contributions").all()).results ?? [];
  for (const row of food as FoodRecord[]) s.food.set(`${row.student_id}|${row.year}|${row.month}`, row);
  const settings = (await db.prepare("SELECT key, value FROM settings").all()).results ?? [];
  for (const row of settings as { key: string; value: string }[]) s.settings.set(row.key, row.value);
  return s;
}

async function load(): Promise<Store> {
  const db = getD1();
  if (db) {
    try {
      return await loadFromD1(db);
    } catch {
      /* table missing / migration not applied — fall through */
    }
  }
  const snap = await readSnapshot();
  const s = emptyStore();
  if (snap) {
    for (const st of snap.students ?? []) s.students.set(st.id, st);
    for (const a of snap.attendance ?? []) s.attendance.set(`${a.student_id}|${a.day}`, a);
    for (const f of snap.food ?? []) s.food.set(`${f.student_id}|${f.year}|${f.month}`, f);
    for (const [k, v] of snap.settings ?? []) s.settings.set(k, v);
  }
  return s;
}

/** Returns the store, loading it from the durable backend exactly once. */
export async function getStore(): Promise<Store> {
  if (g.__joycoStore) return g.__joycoStore;
  if (!g.__joycoLoaded) {
    g.__joycoLoaded = load().then((s) => {
      g.__joycoStore = s;
      return s;
    });
  }
  return g.__joycoLoaded;
}

/* --------------------------------------------------------------- writing -- */

const STUDENT_COLS = [
  "id", "full_name", "photo_url", "date_of_birth", "sex", "admission_number", "admission_date",
  "home_address", "guardian_name", "guardian_relationship", "guardian_phone", "guardian_alt_phone",
  "guardian_email", "guardian_occupation", "guardian_address", "emergency_contact",
  "class", "session", "status",
] as const;

export async function saveStudent(st: Student) {
  const s = await getStore();
  s.students.set(st.id, st);
  const db = getD1();
  if (db) {
    const values = STUDENT_COLS.map((c) => (st as Record<string, unknown>)[c] ?? null);
    await db
      .prepare(
        `INSERT OR REPLACE INTO students (${STUDENT_COLS.join(",")}) VALUES (${STUDENT_COLS.map(() => "?").join(",")})`,
      )
      .bind(...values)
      .run();
    return;
  }
  await writeSnapshot(s);
}

export async function removeStudent(id: string) {
  const s = await getStore();
  s.students.delete(id);
  for (const key of Array.from(s.attendance.keys())) if (key.startsWith(`${id}|`)) s.attendance.delete(key);
  for (const key of Array.from(s.food.keys())) if (key.startsWith(`${id}|`)) s.food.delete(key);
  const db = getD1();
  if (db) {
    await db.prepare("DELETE FROM students WHERE id = ?").bind(id).run();
    return;
  }
  await writeSnapshot(s);
}

export async function saveAttendance(rec: AttendanceRecord) {
  const s = await getStore();
  s.attendance.set(`${rec.student_id}|${rec.day}`, rec);
  const db = getD1();
  if (db) {
    await db
      .prepare(
        "INSERT OR REPLACE INTO attendance (student_id, day, status, time_in, time_out) VALUES (?,?,?,?,?)",
      )
      .bind(rec.student_id, rec.day, rec.status, rec.time_in ?? null, rec.time_out ?? null)
      .run();
    return;
  }
  await writeSnapshot(s);
}

export async function saveFood(rec: FoodRecord) {
  const s = await getStore();
  s.food.set(`${rec.student_id}|${rec.year}|${rec.month}`, rec);
  const db = getD1();
  if (db) {
    await db
      .prepare(
        "INSERT OR REPLACE INTO food_contributions (student_id, year, month, required_amount, paid_amount, fund_type) VALUES (?,?,?,?,?,?)",
      )
      .bind(rec.student_id, rec.year, rec.month, rec.required_amount, rec.paid_amount, rec.fund_type)
      .run();
    return;
  }
  await writeSnapshot(s);
}

export async function saveSettings(entries: Record<string, string>) {
  const s = await getStore();
  for (const [k, v] of Object.entries(entries)) s.settings.set(k, String(v));
  const db = getD1();
  if (db) {
    for (const [k, v] of Object.entries(entries)) {
      await db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?,?)").bind(k, String(v)).run();
    }
    return;
  }
  await writeSnapshot(s);
}

export async function nextStudentId(): Promise<string> {
  const s = await getStore();
  let max = 0;
  for (const id of s.students.keys()) {
    const n = Number(id.replace(/[^0-9]/g, ""));
    if (n > max) max = n;
  }
  return `JM${String(max + 1).padStart(4, "0")}`;
}
