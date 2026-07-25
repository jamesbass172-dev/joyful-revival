import { Link, useRouterState, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import type { ReactNode } from "react";
import { LayoutDashboard, Users, ClipboardCheck, UtensilsCrossed, Settings, Lock } from "lucide-react";
import { lockAdmin } from "@/lib/admin/gate.functions";
import { logoUrl } from "@/content/site-content";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const items: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/attendance", label: "Attendance", icon: ClipboardCheck },
  { to: "/admin/food", label: "Food Contributions", icon: UtensilsCrossed },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const router = useRouter();
  const lock = useServerFn(lockAdmin);

  async function onLock() {
    await lock();
    router.navigate({ to: "/admin-login" });
  }

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <aside className="w-60 shrink-0 border-r border-slate-200 bg-white flex flex-col">
        <div className="px-4 py-5 border-b border-slate-200 flex items-center gap-2">
          <img src={logoUrl} alt="" className="h-8 w-8" />
          <div>
            <div className="text-sm font-semibold leading-tight">Joyful Montessori</div>
            <div className="text-[11px] text-slate-500">Admin Portal</div>
          </div>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {items.map((it) => {
            const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${
                  active
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                {it.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-2 border-t border-slate-200">
          <button
            onClick={onLock}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100"
          >
            <Lock className="h-4 w-4" /> Lock portal
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
