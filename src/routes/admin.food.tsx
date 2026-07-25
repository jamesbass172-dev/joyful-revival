import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient, queryOptions } from "@tanstack/react-query";
import { useState } from "react";
import { getFoodGrid, setFoodRecord } from "@/lib/admin/food.functions";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const opts = (year: number) => queryOptions({ queryKey: ["admin", "food", year], queryFn: () => getFoodGrid({ data: { year } }) });

export const Route = createFileRoute("/admin/food")({
  loader: ({ context }) => context.queryClient.ensureQueryData(opts(new Date().getFullYear())),
  component: FoodPage,
});

type Cell = { student_id: string; year: number; month: number; required_amount: number; paid_amount: number; fund_type: "Parent Contribution" | "JOYCO Fund"; full_name: string };

function FoodPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const { data } = useSuspenseQuery(opts(year));
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Cell | null>(null);

  const totals = { required: 0, paid: 0, parent: 0, joyco: 0 };
  data.forEach((r) => r.months.forEach((m) => {
    totals.required += m.required_amount;
    totals.paid += m.paid_amount;
    if (m.fund_type === "JOYCO Fund") totals.joyco += m.paid_amount;
    else totals.parent += m.paid_amount;
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Food Contributions</h1>
          <p className="text-sm text-slate-500">Click a cell to record a payment.</p>
        </div>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="px-3 py-2 border border-slate-300 rounded-md text-sm">
          {[year - 1, year, year + 1].map((y) => <option key={y}>{y}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <Kpi label="Required" value={totals.required} />
        <Kpi label="Collected" value={totals.paid} />
        <Kpi label="Parent Contribution" value={totals.parent} />
        <Kpi label="JOYCO Fund" value={totals.joyco} />
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left px-2 py-2 sticky left-0 bg-slate-50">Student</th>
              {MONTHS.map((m) => <th key={m} className="px-1 py-2 text-center">{m}</th>)}
              <th className="px-2 py-2 text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              const bal = row.months.reduce((s, m) => s + (m.required_amount - m.paid_amount), 0);
              return (
                <tr key={row.student_id} className="border-t border-slate-100">
                  <td className="px-2 py-1.5 font-medium sticky left-0 bg-white">{row.full_name}</td>
                  {row.months.map((m) => {
                    const status = m.paid_amount === 0 ? "empty" : m.paid_amount >= m.required_amount ? "full" : "partial";
                    const bg = status === "full" ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" : status === "partial" ? "bg-amber-100 text-amber-800 hover:bg-amber-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200";
                    return (
                      <td key={m.month} className="p-0.5">
                        <button
                          onClick={() => setEditing({ ...m, student_id: row.student_id, year, full_name: row.full_name })}
                          className={`w-full h-9 rounded text-[11px] ${bg}`}
                          title={`${m.fund_type} • Paid ${m.paid_amount} / ${m.required_amount}`}
                        >
                          {m.paid_amount > 0 ? m.paid_amount.toLocaleString() : "—"}
                        </button>
                      </td>
                    );
                  })}
                  <td className={`px-2 py-1.5 text-right font-medium ${bal > 0 ? "text-rose-600" : "text-emerald-600"}`}>{bal.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editing && <FoodDialog initial={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); qc.invalidateQueries({ queryKey: ["admin"] }); }} />}
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="text-xs uppercase text-slate-500">{label}</div>
      <div className="text-lg font-semibold mt-1">TZS {value.toLocaleString()}</div>
    </div>
  );
}

function FoodDialog({ initial, onClose, onSaved }: { initial: Cell; onClose: () => void; onSaved: () => void }) {
  const [required, setRequired] = useState(initial.required_amount);
  const [paid, setPaid] = useState(initial.paid_amount);
  const [fund, setFund] = useState(initial.fund_type);
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await setFoodRecord({ data: { student_id: initial.student_id, year: initial.year, month: initial.month, required_amount: required, paid_amount: paid, fund_type: fund } });
    onSaved();
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="bg-white rounded-lg w-full max-w-md">
        <div className="p-5 border-b border-slate-200">
          <h2 className="font-semibold">{initial.full_name}</h2>
          <p className="text-xs text-slate-500">{MONTHS[initial.month - 1]} {initial.year}</p>
        </div>
        <div className="p-5 space-y-3">
          <label className="block">
            <span className="text-xs text-slate-600 block mb-1">Required amount (TZS)</span>
            <input type="number" value={required} onChange={(e) => setRequired(Number(e.target.value))} className="w-full px-2 py-1.5 rounded border border-slate-300 text-sm" />
          </label>
          <label className="block">
            <span className="text-xs text-slate-600 block mb-1">Amount paid (TZS)</span>
            <input type="number" value={paid} onChange={(e) => setPaid(Number(e.target.value))} className="w-full px-2 py-1.5 rounded border border-slate-300 text-sm" />
          </label>
          <label className="block">
            <span className="text-xs text-slate-600 block mb-1">Fund type</span>
            <select value={fund} onChange={(e) => setFund(e.target.value as Cell["fund_type"])} className="w-full px-2 py-1.5 rounded border border-slate-300 text-sm">
              <option>Parent Contribution</option>
              <option>JOYCO Fund</option>
            </select>
          </label>
          <div className="text-xs text-slate-500">
            Status: {paid >= required && required > 0 ? "Paid" : paid > 0 ? "Partially Paid" : "Not Paid"} · Balance: TZS {(required - paid).toLocaleString()}
          </div>
        </div>
        <div className="p-4 border-t border-slate-200 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-md hover:bg-slate-100">Cancel</button>
          <button type="submit" disabled={saving} className="px-4 py-2 text-sm rounded-md bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50">
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
