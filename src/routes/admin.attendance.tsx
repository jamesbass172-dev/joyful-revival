import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient, queryOptions } from "@tanstack/react-query";
import { useState } from "react";
import { getAttendanceForDay, setAttendance } from "@/lib/admin/attendance.functions";

const today = () => new Date().toISOString().slice(0, 10);
const opts = (day: string) => queryOptions({ queryKey: ["admin", "attendance", day], queryFn: () => getAttendanceForDay({ data: { day } }) });

export const Route = createFileRoute("/admin/attendance")({
  loader: ({ context }) => context.queryClient.ensureQueryData(opts(today())),
  component: AttendancePage,
});

const STATUSES = ["Present", "Absent", "Sick", "Permission"] as const;
type Status = (typeof STATUSES)[number];

const colors: Record<Status, string> = {
  Present: "bg-emerald-600 text-white",
  Absent: "bg-rose-600 text-white",
  Sick: "bg-amber-500 text-white",
  Permission: "bg-indigo-600 text-white",
};

function AttendancePage() {
  const [day, setDay] = useState(today());
  const { data } = useSuspenseQuery(opts(day));
  const qc = useQueryClient();

  async function mark(student_id: string, status: Status) {
    await setAttendance({ data: { student_id, day, status, time_in: status === "Present" ? new Date().toTimeString().slice(0, 5) : undefined } });
    qc.invalidateQueries({ queryKey: ["admin", "attendance", day] });
  }

  const counts = STATUSES.map((s) => ({ status: s, n: data.filter((d) => d.status === s).length }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Attendance</h1>
          <p className="text-sm text-slate-500">Tap a status for each student.</p>
        </div>
        <input
          type="date"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className="px-3 py-2 rounded-md border border-slate-300 text-sm"
        />
      </div>

      <div className="grid grid-cols-4 gap-3">
        {counts.map((c) => (
          <div key={c.status} className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="text-xs uppercase text-slate-500">{c.status}</div>
            <div className="text-2xl font-semibold mt-1">{c.n}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left px-3 py-2 text-xs uppercase">Student</th>
              <th className="text-left px-3 py-2 text-xs uppercase">Class</th>
              <th className="text-left px-3 py-2 text-xs uppercase">Session</th>
              <th className="text-left px-3 py-2 text-xs uppercase">Mark</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.student_id} className="border-t border-slate-100">
                <td className="px-3 py-2 font-medium">{row.full_name}</td>
                <td className="px-3 py-2 text-slate-600">{row.class}</td>
                <td className="px-3 py-2 text-slate-600">{row.session}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-1">
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        onClick={() => mark(row.student_id, s)}
                        className={`px-2.5 py-1 rounded text-xs font-medium transition ${row.status === s ? colors[s] : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && <tr><td colSpan={4} className="text-center py-10 text-slate-400">Register students first.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
