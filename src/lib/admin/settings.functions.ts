import { createServerFn } from "@tanstack/react-start";
import { requireUnlocked } from "./session";
import { store } from "./store.server";

export const getSettings = createServerFn({ method: "GET" }).handler(async () => {
  await requireUnlocked();
  return Object.fromEntries(store().settings.entries());
});

export const updateSettings = createServerFn({ method: "POST" })
  .inputValidator((d: Record<string, string>) => d)
  .handler(async ({ data }) => {
    await requireUnlocked();
    const s = store();
    for (const [k, v] of Object.entries(data)) s.settings.set(k, String(v));
    return { ok: true };
  });
