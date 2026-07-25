import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getDashboard } from "@/lib/admin/dashboard.functions";
import { Users, TrendingUp, AlertCircle, Cake, Sun, Moon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const dashOpts = queryOptions({ queryKey: ["admin", "dashboard"], queryFn: () => getDashboard() });

export const Route = createFileRoute("/admin/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(dashOpts),
  component: Dashboard,
});

const COLORS = ["#0f172a", "#0891b2", "#f59e0b"];

function fmt(n: number) {
  return "TZS " + n.toLocaleString();
}

function Dashboard() {
  const { data } = useSuspenseQuery(dashOpts);
  const { totals, byClass, upcoming } = data;

  const kpis = [
    { label: "Enrolled", value: totals.enrolled, icon: Users, tint: "bg-slate-900 text-white" },
    { label: "Boys / Girls", value: `${totals.boys} / ${totals.girls}`, icon: Users, tint: "bg-cyan-600 text-white" },
    { label: "Noon session", value: totals.noon, icon: Sun, tint: "bg-amber-500 text-white" },
    { label: "Evening session", value: totals.evening, icon: Moon, tint: "bg-indigo-600 text-white" },
    { label: "Outstanding food", value: totals.outstanding, icon: AlertCircle, tint: "bg-rose-600 text-white" },
    { label: "Monthly income", value: fmt(totals.monthlyIncome), icon: TrendingUp, tint: "bg-emerald-600 text-white" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Overview of enrollment, attendance and finances.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white rounded-lg border border-slate-200 p-4">
              <div className={`h-8 w-8 rounded-md flex items-center justify-center ${k.tint}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="mt-3 text-xs text-slate-500 uppercase tracking-wide">{k.label}</div>
              <div className="text-xl font-semibold text-slate-900 mt-1">{k.value}</div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Enrollment by class</h2>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byClass}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#0f172a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Sex distribution</h2>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[{ name: "Boys", value: totals.boys }, { name: "Girls", value: totals.girls }]}
                  dataKey="value"
                  innerRadius={45}
                  outerRadius={80}
                >
                  {[0, 1].map((i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Fund summary (year-to-date)</h2>
          <dl className="space-y-2 text-sm">
            <Row label="Parent contribution" value={fmt(totals.parentTotal)} />
            <Row label="JOYCO Fund" value={fmt(totals.joycoTotal)} />
            <Row label="Total collected" value={fmt(totals.totalCollected)} strong />
            <Row label="Total required" value={fmt(totals.totalRequired)} />
          </dl>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Cake className="h-4 w-4" /> Upcoming birthdays
          </h2>
          {upcoming.length === 0 ? (
            <p className="text-sm text-slate-500">None in the next 30 days.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {upcoming.map((u) => (
                <li key={u.id} className="py-2 flex items-center justify-between text-sm">
                  <span>{u.name}</span>
                  <span className="text-slate-500">{u.date}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex justify-between py-1">
      <dt className="text-slate-600">{label}</dt>
      <dd className={strong ? "font-semibold text-slate-900" : "text-slate-900"}>{value}</dd>
    </div>
  );
}
