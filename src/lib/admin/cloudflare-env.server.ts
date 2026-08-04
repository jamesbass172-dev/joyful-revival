import { AsyncLocalStorage } from "node:async_hooks";

type D1Statement = {
  bind: (...args: unknown[]) => D1Statement;
  run: () => Promise<unknown>;
  all: () => Promise<{ results?: unknown[] }>;
};

export type D1Database = {
  prepare: (sql: string) => D1Statement;
};

type CloudflareBindings = {
  DB?: D1Database;
};

const requestBindings = new AsyncLocalStorage<CloudflareBindings>();

export function withCloudflareBindings<T>(env: unknown, operation: () => T): T {
  console.log("ENV KEYS:", Reflect.ownKeys(env as object));
  console.log("ENV:", env);

  return requestBindings.run((env ?? {}) as CloudflareBindings, operation);
}

export function getCloudflareDatabase(): D1Database | null {
  const store = requestBindings.getStore();

  console.log("Cloudflare binding store exists:", Boolean(store));
  console.log("DB binding exists:", Boolean(store?.DB));

  return store?.DB ?? null;
}