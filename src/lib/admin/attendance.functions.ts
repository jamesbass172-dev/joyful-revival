import { createServerFn } from "@tanstack/react-start";
import { requireUnlocked } from "./session";
import { getStore, saveAttendance, type AttendanceRecord } from "./store.server";

export const getAttendanceForDay = createServerFn({ method: "GET" })
  .inputValidator((d: { day: string }) => d)
  .handler(async ({ data }) => {
    await requireUnlocked();
    const s = await getStore();
    const students = Array.from(s.students.values());
    return students.map((st) => {
      const rec = s.attendance.get(`${st.id}|${data.day}`);
      return {
        student_id: st.id,
        full_name: st.full_name,
        class: st.class,
        session: st.session,
        status: rec?.status ?? null,
        time_in: rec?.time_in ?? "",
        time_out: rec?.time_out ?? "",
      };
    });
  });

export const setAttendance = createServerFn({ method: "POST" })
  .inputValidator((d: AttendanceRecord) => d)
  .handler(async ({ data }) => {
    await requireUnlocked();
    await saveAttendance(data);
    return { ok: true };
  });
