import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: AdminIndex,
  // Server-side redirect is not possible (auth is client-only); we handle it client-side in the component.
});

function AdminIndex() {
  // Client-side: redirect to login or dashboard based on session.
  if (typeof window !== "undefined") {
    try {
      const session = sessionStorage.getItem("djfun.admin.session");
      if (session === "1") {
        window.location.replace("/admin/dashboard");
      } else {
        window.location.replace("/admin/login");
      }
    } catch {
      window.location.replace("/admin/login");
    }
  }
  return null;
}
