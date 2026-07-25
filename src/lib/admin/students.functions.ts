import { createServerFn } from "@tanstack/react-start";
import { requireUnlocked } from "./session";
import { store, nextStudentId, type Student } from "./store.server";

export const listStudents = createServerFn({ method: "GET" }).handler(async () => {
  await requireUnlocked();
  return Array.from(store().students.values()).sort((a, b) => a.id.localeCompare(b.id));
});

export const getStudent = createServerFn({ method: "GET" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await requireUnlocked();
    return store().students.get(data.id) ?? null;
  });

export const upsertStudent = createServerFn({ method: "POST" })
  .inputValidator((d: Partial<Student> & { full_name: string }) => d)
  .handler(async ({ data }) => {
    await requireUnlocked();
    const s = store();
    const id = data.id ?? nextStudentId();
    const existing = s.students.get(id);
    const merged: Student = { status: "Active", ...(existing ?? {}), ...data, id };
    s.students.set(id, merged);
    return merged;
  });

export const deleteStudent = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await requireUnlocked();
    store().students.delete(data.id);
    return { ok: true };
  });
