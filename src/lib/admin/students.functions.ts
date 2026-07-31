import { createServerFn } from "@tanstack/react-start";
import { requireUnlocked } from "./session";
import { getStore, saveStudent, removeStudent, nextStudentId, type Student } from "./store.server";

export const listStudents = createServerFn({ method: "GET" }).handler(async (): Promise<Student[]> => {
  await requireUnlocked();
  const s = await getStore();
  return Array.from(s.students.values()).sort((a, b) => a.id.localeCompare(b.id));
});

export const getStudent = createServerFn({ method: "GET" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }): Promise<Student | null> => {
    await requireUnlocked();
    const s = await getStore();
    return s.students.get(data.id) ?? null;
  });

export const upsertStudent = createServerFn({ method: "POST" })
  .inputValidator((d: Partial<Student> & { full_name: string }) => d)
  .handler(async ({ data }): Promise<Student> => {
    await requireUnlocked();
    const s = await getStore();
    const id = data.id ?? (await nextStudentId());
    const existing = s.students.get(id);
    const merged: Student = { status: "Active", ...(existing ?? {}), ...data, id };
    await saveStudent(merged);
    return merged;
  });

export const deleteStudent = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await requireUnlocked();
    await removeStudent(data.id);
    return { ok: true };
  });
