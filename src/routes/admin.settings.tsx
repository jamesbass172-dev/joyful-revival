import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient, queryOptions } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { getSettings, updateSettings } from "@/lib/admin/settings.functions";

const opts = queryOptions({ queryKey: ["admin", "settings"], queryFn: () => getSettings() });

export const Route = createFileRoute("/admin/settings")({
  loader: ({ context }) => context.queryClient.ensureQueryData(opts),
  component: SettingsPage,
});

function SettingsPage() {
  const { data } = useSuspenseQuery(opts);
  const qc = useQueryClient();
  const [form, setForm] = useState<Record<string, string>>(data);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => setForm(data), [data]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await updateSettings({ data: form });
    qc.invalidateQueries({ queryKey: ["admin", "settings"] });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const fields: { key: string; label: string; type?: string }[] = [
    { key: "school_name", label: "School name" },
    { key: "address", label: "Address" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "monthly_food_contribution", label: "Monthly food contribution (TZS)", type: "number" },
    { key: "academic_year", label: "Academic year" },
  ];

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500">School information and defaults.</p>
      </div>
      <form onSubmit={submit} className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
        {fields.map((f) => (
          <label key={f.key} className="block">
            <span className="text-xs text-slate-600 block mb-1">{f.label}</span>
            <input
              type={f.type ?? "text"}
              value={form[f.key] ?? ""}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
            />
          </label>
        ))}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm hover:bg-slate-800 disabled:opacity-50">
            {saving ? "Saving…" : "Save"}
          </button>
          {saved && <span className="text-sm text-emerald-600">Saved</span>}
        </div>
      </form>
    </div>
  );
}
