// In-memory fallback store used until a Cloudflare D1 binding named `DB`
// is wired up in wrangler.toml. Data persists only within a single Worker
// isolate — good enough to demo the UI, not for production.

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

type Store = {
  students: Map<string, Student>;
  attendance: Map<string, AttendanceRecord>; // key: `${student_id}|${day}`
  food: Map<string, FoodRecord>; // key: `${student_id}|${year}|${month}`
  settings: Map<string, string>;
  seeded: boolean;
};

const g = globalThis as unknown as { __joycoStore?: Store };

function makeStore(): Store {
  const s: Store = {
    students: new Map(),
    attendance: new Map(),
    food: new Map(),
    settings: new Map([
      ["school_name", "Joyful Montessori Nursery & Day Care"],
      ["monthly_food_contribution", "20000"],
      ["academic_year", "2026"],
    ]),
    seeded: false,
  };
  seed(s);
  return s;
}

function seed(s: Store) {
  if (s.seeded) return;
  const demo: Student[] = [
    { id: "JM0001", full_name: "Anna John", date_of_birth: "2022-03-15", sex: "Female", class: "P One", session: "Noon", admission_number: "A-101", admission_date: "2026-01-10", guardian_name: "Mary John", guardian_phone: "+255 700 000 001", status: "Active" },
    { id: "JM0002", full_name: "David Mwakasege", date_of_birth: "2021-08-02", sex: "Male", class: "P Two", session: "Noon", admission_number: "A-102", admission_date: "2026-01-11", guardian_name: "Joseph Mwakasege", guardian_phone: "+255 700 000 002", status: "Active" },
    { id: "JM0003", full_name: "Grace Kimario", date_of_birth: "2023-01-12", sex: "Female", class: "Baby Class", session: "Evening", admission_number: "A-103", admission_date: "2026-02-01", guardian_name: "Neema Kimario", guardian_phone: "+255 700 000 003", status: "Active" },
    { id: "JM0004", full_name: "Emmanuel Peter", date_of_birth: "2022-11-20", sex: "Male", class: "P One", session: "Evening", admission_number: "A-104", admission_date: "2026-02-15", guardian_name: "Peter Msigwa", guardian_phone: "+255 700 000 004", status: "Active" },
    { id: "JM0005", full_name: "Zainabu Ally", date_of_birth: "2023-05-05", sex: "Female", class: "Baby Class", session: "Noon", admission_number: "A-105", admission_date: "2026-03-01", guardian_name: "Ally Hamisi", guardian_phone: "+255 700 000 005", status: "Active" },
  ];
  demo.forEach((d) => s.students.set(d.id, d));
  // Seed some food contributions
  demo.forEach((d, i) => {
    for (let m = 1; m <= 6; m++) {
      s.food.set(`${d.id}|2026|${m}`, {
        student_id: d.id,
        year: 2026,
        month: m,
        required_amount: 20000,
        paid_amount: m <= 4 ? 20000 : m === 5 ? 10000 : 0,
        fund_type: i % 3 === 0 ? "JOYCO Fund" : "Parent Contribution",
      });
    }
  });
  s.seeded = true;
}

export function store(): Store {
  if (!g.__joycoStore) g.__joycoStore = makeStore();
  return g.__joycoStore;
}

export function nextStudentId(): string {
  const s = store();
  let max = 0;
  for (const id of s.students.keys()) {
    const n = Number(id.replace(/[^0-9]/g, ""));
    if (n > max) max = n;
  }
  return `JM${String(max + 1).padStart(4, "0")}`;
}
