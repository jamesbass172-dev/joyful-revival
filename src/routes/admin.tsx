import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { checkAdminGate } from "@/lib/admin/gate.functions";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Portal — Joyful Montessori" }, { name: "robots", content: "noindex" }] }),
  beforeLoad: async () => {
    const { unlocked } = await checkAdminGate();
    if (!unlocked) throw redirect({ to: "/admin-login" });
  },
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
