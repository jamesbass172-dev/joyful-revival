import { createServerFn } from "@tanstack/react-start";
import { requireUnlocked } from "./session";
import { getStore } from "./store.server";

export const getDashboard = createServerFn({ method: "GET" }).handler(async () => {
  await requireUnlocked();
  const s = await getStore();
  const students = Array.from(s.students.values()).filter((x) => x.status !== "Withdrawn");
  const boys = students.filter((x) => x.sex === "Male").length;
  const girls = students.filter((x) => x.sex === "Female").length;
  const noon = students.filter((x) => x.session === "Noon").length;
  const evening = students.filter((x) => x.session === "Evening").length;

  const now = new Date();
  const year = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  let totalRequired = 0;
  let totalCollected = 0;
  let parentTotal = 0;
  let joycoTotal = 0;
  let outstandingCount = 0;
  const outstandingBy = new Map<string, number>();

  for (const st of students) {
    let balance = 0;
    for (let m = 1; m <= currentMonth; m++) {
      const rec = s.food.get(`${st.id}|${year}|${m}`);
      const req = rec?.required_amount ?? 20000;
      const paid = rec?.paid_amount ?? 0;
      totalRequired += req;
      totalCollected += paid;
      balance += req - paid;
      if (rec?.fund_type === "JOYCO Fund") joycoTotal += paid;
      else parentTotal += paid;
    }
    if (balance > 0) {
      outstandingCount++;
      outstandingBy.set(st.id, balance);
    }
  }

  // Monthly income this month
  let monthlyIncome = 0;
  for (const st of students) {
    const rec = s.food.get(`${st.id}|${year}|${currentMonth}`);
    monthlyIncome += rec?.paid_amount ?? 0;
  }

  // Upcoming birthdays (next 30 days)
  const upcoming: { id: string; name: string; date: string }[] = [];
  const soon = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  for (const st of students) {
    if (!st.date_of_birth) continue;
    const d = new Date(st.date_of_birth);
    const thisYear = new Date(now.getFullYear(), d.getMonth(), d.getDate());
    const next = thisYear < now ? new Date(now.getFullYear() + 1, d.getMonth(), d.getDate()) : thisYear;
    if (next <= soon) upcoming.push({ id: st.id, name: st.full_name, date: next.toISOString().slice(0, 10) });
  }
  upcoming.sort((a, b) => a.date.localeCompare(b.date));

  // By class breakdown
  const classes = ["Baby Class", "P One", "P Two"] as const;
  const byClass = classes.map((c) => ({
    name: c,
    value: students.filter((s2) => s2.class === c).length,
  }));

  return {
    totals: {
      enrolled: students.length,
      boys,
      girls,
      noon,
      evening,
      outstanding: outstandingCount,
      monthlyIncome,
      totalCollected,
      totalRequired,
      parentTotal,
      joycoTotal,
    },
    byClass,
    upcoming: upcoming.slice(0, 6),
  };
});
