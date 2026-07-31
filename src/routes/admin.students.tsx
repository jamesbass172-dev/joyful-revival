import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient, queryOptions } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Search, Trash2, Pencil } from "lucide-react";
import { listStudents, upsertStudent, deleteStudent } from "@/lib/admin/students.functions";
import type { Student } from "@/lib/admin/store.server";

const opts = queryOptions({ queryKey: ["admin", "students"], queryFn: () => listStudents() });

export const Route = createFileRoute("/admin/students")({
  loader: ({ context }) => context.queryClient.ensureQueryData(opts),
  component: StudentsPage,
});

function calcAge(dob?: string) {
  if (!dob) return "";
  const d = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return `${age}y`;
}

function StudentsPage() {
  const { data } = useSuspenseQuery(opts);
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Partial<Student> | null>(null);

  const filtered = data.filter((s) => {
    const t = `${s.full_name} ${s.guardian_name ?? ""} ${s.guardian_phone ?? ""} ${s.admission_number ?? ""}`.toLowerCase();
    return t.includes(q.toLowerCase());
  });

  async function onDelete(id: string) {
    if (!confirm("Delete this student?")) return;
    await deleteStudent({ data: { id } });
    qc.invalidateQueries({ queryKey: ["admin"] });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Students</h1>
          <p className="text-sm text-slate-500">{data.length} registered.</p>
        </div>
        <button
          onClick={() => setEditing({})}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-md text-sm"
        >
          <Plus className="h-4 w-4" /> New student
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="p-3 border-b border-slate-200 flex items-center gap-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            placeholder="Search by name, guardian, phone, admission #"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="flex-1 text-sm outline-none"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <Th>Photo</Th><Th>ID</Th><Th>Name</Th><Th>Sex</Th><Th>Age</Th><Th>Class</Th><Th>Session</Th><Th>Guardian</Th><Th>Phone</Th><Th>Status</Th><Th></Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <Td><Avatar src={s.photo_url} name={s.full_name} /></Td>
                  <Td className="font-mono text-xs">{s.id}</Td>
                  <Td className="font-medium">{s.full_name}</Td>
                  <Td>{s.sex ?? ""}</Td>
                  <Td>{calcAge(s.date_of_birth)}</Td>
                  <Td>{s.class ?? ""}</Td>
                  <Td>{s.session ?? ""}</Td>
                  <Td>{s.guardian_name ?? ""}</Td>
                  <Td>{s.guardian_phone ?? ""}</Td>
                  <Td>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${s.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                      {s.status ?? "Active"}
                    </span>
                  </Td>
                  <Td>
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => setEditing(s)} className="p-1.5 hover:bg-slate-200 rounded"><Pencil className="h-3.5 w-3.5" /></button>
                      <button onClick={() => onDelete(s.id)} className="p-1.5 hover:bg-rose-100 text-rose-600 rounded"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </Td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={10} className="text-center py-10 text-slate-400">No students found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editing && <StudentDialog initial={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); qc.invalidateQueries({ queryKey: ["admin"] }); }} />}
    </div>
  );
}

function Th({ children }: { children?: React.ReactNode }) {
  return <th className="text-left font-medium px-3 py-2 text-xs uppercase tracking-wide">{children}</th>;
}
function Td({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2 ${className}`}>{children}</td>;
}

function StudentDialog({ initial, onClose, onSaved }: { initial: Partial<Student>; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<Partial<Student>>(initial);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof Student>(k: K, v: Student[K] | undefined) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.full_name) return;
    setSaving(true);
    try {
      await upsertStudent({ data: { ...form, full_name: form.full_name } });
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto"
      >
        <div className="p-5 border-b border-slate-200">
          <h2 className="font-semibold">{form.id ? `Edit ${form.id}` : "New student"}</h2>
        </div>
        <div className="p-5 grid grid-cols-2 gap-3">
          <Field label="Full name" required><input required value={form.full_name ?? ""} onChange={(e) => set("full_name", e.target.value)} className={input} /></Field>
          <Field label="Sex"><select value={form.sex ?? ""} onChange={(e) => set("sex", (e.target.value || undefined) as Student["sex"])} className={input}><option value="">—</option><option>Male</option><option>Female</option></select></Field>
          <Field label="Date of birth"><input type="date" value={form.date_of_birth ?? ""} onChange={(e) => set("date_of_birth", e.target.value)} className={input} /></Field>
          <Field label="Admission number"><input value={form.admission_number ?? ""} onChange={(e) => set("admission_number", e.target.value)} className={input} /></Field>
          <Field label="Admission date"><input type="date" value={form.admission_date ?? ""} onChange={(e) => set("admission_date", e.target.value)} className={input} /></Field>
          <Field label="Home address"><input value={form.home_address ?? ""} onChange={(e) => set("home_address", e.target.value)} className={input} /></Field>
          <Field label="Class"><select value={form.class ?? ""} onChange={(e) => set("class", (e.target.value || undefined) as Student["class"])} className={input}><option value="">—</option><option>Baby Class</option><option>P One</option><option>P Two</option></select></Field>
          <Field label="Session"><select value={form.session ?? ""} onChange={(e) => set("session", (e.target.value || undefined) as Student["session"])} className={input}><option value="">—</option><option>Noon</option><option>Evening</option></select></Field>
          <Field label="Status"><select value={form.status ?? "Active"} onChange={(e) => set("status", e.target.value as Student["status"])} className={input}><option>Active</option><option>Graduated</option><option>Transferred</option><option>Withdrawn</option></select></Field>
          <div className="col-span-2 border-t border-slate-100 pt-3 mt-2 text-xs font-semibold text-slate-500 uppercase">Guardian</div>
          <Field label="Guardian name"><input value={form.guardian_name ?? ""} onChange={(e) => set("guardian_name", e.target.value)} className={input} /></Field>
          <Field label="Relationship"><input value={form.guardian_relationship ?? ""} onChange={(e) => set("guardian_relationship", e.target.value)} className={input} /></Field>
          <Field label="Phone"><input value={form.guardian_phone ?? ""} onChange={(e) => set("guardian_phone", e.target.value)} className={input} /></Field>
          <Field label="Alt phone"><input value={form.guardian_alt_phone ?? ""} onChange={(e) => set("guardian_alt_phone", e.target.value)} className={input} /></Field>
          <Field label="Email"><input value={form.guardian_email ?? ""} onChange={(e) => set("guardian_email", e.target.value)} className={input} /></Field>
          <Field label="Occupation"><input value={form.guardian_occupation ?? ""} onChange={(e) => set("guardian_occupation", e.target.value)} className={input} /></Field>
          <Field label="Address"><input value={form.guardian_address ?? ""} onChange={(e) => set("guardian_address", e.target.value)} className={input} /></Field>
          <Field label="Emergency contact"><input value={form.emergency_contact ?? ""} onChange={(e) => set("emergency_contact", e.target.value)} className={input} /></Field>
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

const input = "w-full px-2 py-1.5 rounded border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-slate-600 block mb-1">{label}{required && <span className="text-rose-500"> *</span>}</span>
      {children}
    </label>
  );
}
