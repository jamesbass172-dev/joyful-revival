import { createServerFn } from "@tanstack/react-start";
import { requireUnlocked } from "./session";
import { getStore, saveSettings } from "./store.server";

export const getSettings = createServerFn({ method: "GET" }).handler(async () => {
  await requireUnlocked();
  const s = await getStore();
  return Object.fromEntries(s.settings.entries()) as Record<string, string>;
});

export const updateSettings = createServerFn({ method: "POST" })
  .inputValidator((d: Record<string, string>) => d)
  .handler(async ({ data }) => {
    await requireUnlocked();
    await saveSettings(data);
    return { ok: true };
  });
