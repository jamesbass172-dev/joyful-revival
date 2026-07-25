import { createFileRoute, useRouter, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Lock } from "lucide-react";
import { unlockAdmin } from "@/lib/admin/gate.functions";
import { isUnlocked } from "@/lib/admin/session";
import { createServerFn } from "@tanstack/react-start";

const checkGate = createServerFn({ method: "GET" }).handler(async () => ({ unlocked: await isUnlocked() }));

export const Route = createFileRoute("/admin-login")({
  head: () => ({ meta: [{ title: "Admin sign-in — Joyful Montessori" }, { name: "robots", content: "noindex" }] }),
  loader: async () => {
    const { unlocked } = await checkGate();
    if (unlocked) throw redirect({ to: "/admin" });
    return null;
  },
  component: AdminLogin,
});

function AdminLogin() {
  const router = useRouter();
  const unlock = useServerFn(unlockAdmin);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(false);
    setLoading(true);
    try {
      const { ok } = await unlock({ data: { password } });
      if (ok) await router.navigate({ to: "/admin" });
      else setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold text-slate-900">Admin Portal</div>
            <div className="text-xs text-slate-500">Joyful Montessori</div>
          </div>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              autoFocus
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          {error && <p className="text-sm text-red-600">Incorrect password.</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white py-2 rounded-md text-sm font-medium"
          >
            {loading ? "Checking…" : "Unlock"}
          </button>
        </form>
      </div>
    </div>
  );
}
