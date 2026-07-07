import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  component: AdminShell,
});

/**
 * Admin layout shell — renders WITHOUT the main Navbar/Footer.
 * Uses a minimal dark-sidebar style layout.
 */
function AdminShell() {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  );
}
