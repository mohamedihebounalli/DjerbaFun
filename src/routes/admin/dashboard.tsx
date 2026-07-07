import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  LogOut,
  LayoutDashboard,
  Waves,
  Mountain,
  Compass,
  MessageSquare,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useActivities } from "@/lib/activities";
import { startingPrice } from "@/lib/activities";
import type { Activity } from "@/lib/activities";
import { ActivityModal } from "@/components/ActivityModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
  head: () => ({ meta: [{ title: "Admin Dashboard — Djerba Fun" }] }),
});

const CATEGORY_ICON = {
  water: <Waves className="h-4 w-4" />,
  land: <Mountain className="h-4 w-4" />,
  excursions: <Compass className="h-4 w-4" />,
};

const CATEGORY_COLOR: Record<string, string> = {
  water: "bg-blue-100 text-blue-800 border-blue-200",
  land: "bg-amber-100 text-amber-800 border-amber-200",
  excursions: "bg-purple-100 text-purple-800 border-purple-200",
};

function MetricCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-display font-extrabold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const { activities, upsert, remove, reset } = useActivities();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Activity | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<"all" | "water" | "land" | "excursions">(
    "all",
  );
  const [resetConfirm, setResetConfirm] = useState(false);

  // Guard: redirect to login if not authenticated
  if (!isLoggedIn) {
    navigate({ to: "/admin/login" });
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  const handleEdit = (a: Activity) => {
    setEditing(a);
    setModalOpen(true);
  };

  const handleNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      remove(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
    }
  };

  const handleReset = () => {
    if (resetConfirm) {
      reset();
      setResetConfirm(false);
    } else {
      setResetConfirm(true);
    }
  };

  const waterCount = activities.filter((a) => a.category === "water" && a.active).length;
  const landCount = activities.filter((a) => a.category === "land" && a.active).length;
  const excursionCount = activities.filter((a) => a.category === "excursions" && a.active).length;
  const draftCount = activities.filter((a) => !a.active).length;

  const filtered =
    categoryFilter === "all" ? activities : activities.filter((a) => a.category === categoryFilter);

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card">
        <div className="px-6 py-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
              <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <p className="font-display text-sm font-bold">Djerba Fun</p>
              <p className="text-xs text-muted-foreground">Back-Office v1.0</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-3 py-2">
            Navigation
          </p>
          <button
            onClick={() => setCategoryFilter("all")}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${categoryFilter === "all" ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"}`}
          >
            <LayoutDashboard className="h-4 w-4" /> All Activities
          </button>
          <button
            onClick={() => setCategoryFilter("water")}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${categoryFilter === "water" ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"}`}
          >
            <Waves className="h-4 w-4" /> Water Activities
          </button>
          <button
            onClick={() => setCategoryFilter("land")}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${categoryFilter === "land" ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"}`}
          >
            <Mountain className="h-4 w-4" /> Land Activities
          </button>
          <button
            onClick={() => setCategoryFilter("excursions")}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${categoryFilter === "excursions" ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"}`}
          >
            <Compass className="h-4 w-4" /> Excursions
          </button>
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ChevronRight className="h-4 w-4 rotate-180" /> View public site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-xl font-bold">Activities Dashboard</h1>
            <p className="text-xs text-muted-foreground">{activities.length} total activities</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Mobile logout */}
            <button
              onClick={handleLogout}
              className="lg:hidden flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
            <Button
              onClick={handleNew}
              id="admin-add-activity"
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-1.5" /> Add New Activity
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6 overflow-auto">
          {/* Metric cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              icon={<Waves className="h-5 w-5 text-blue-600" />}
              label="Water Activities"
              value={waterCount}
              color="bg-blue-50"
            />
            <MetricCard
              icon={<Mountain className="h-5 w-5 text-amber-600" />}
              label="Land Activities"
              value={landCount}
              color="bg-amber-50"
            />
            <MetricCard
              icon={<Compass className="h-5 w-5 text-purple-600" />}
              label="Excursions"
              value={excursionCount}
              color="bg-purple-50"
            />
            <MetricCard
              icon={<MessageSquare className="h-5 w-5 text-whatsapp" />}
              label="Draft / Hidden"
              value={draftCount}
              color="bg-muted"
            />
          </div>

          {/* Reset / data controls */}
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {filtered.length} of {activities.length} activities shown
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className={`rounded-full text-xs ${resetConfirm ? "border-destructive text-destructive" : ""}`}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              {resetConfirm ? "Confirm reset?" : "Reset to defaults"}
            </Button>
          </div>

          {/* Activities table */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            {/* Table header */}
            <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-5 py-3 border-b border-border text-xs font-semibold uppercase tracking-wide text-muted-foreground bg-muted/40">
              <span>Activity</span>
              <span>Category</span>
              <span>Price</span>
              <span>Status</span>
              <span className="text-right">Actions</span>
            </div>

            {filtered.length === 0 && (
              <div className="py-16 text-center text-muted-foreground text-sm">
                No activities in this category.
              </div>
            )}

            <ul className="divide-y divide-border">
              {filtered.map((a) => {
                const price = startingPrice(a);
                return (
                  <li
                    key={a.id}
                    className="grid md:grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-5 py-4 hover:bg-muted/30 transition-colors"
                  >
                    {/* Title */}
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{a.title}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {a.shortDescription}
                      </p>
                    </div>

                    {/* Category */}
                    <Badge
                      className={`rounded-full text-xs hidden md:inline-flex border gap-1.5 ${CATEGORY_COLOR[a.category]}`}
                    >
                      {CATEGORY_ICON[a.category]}
                      {a.category.charAt(0).toUpperCase() + a.category.slice(1)}
                    </Badge>

                    {/* Price */}
                    <span className="text-sm font-semibold hidden md:block">
                      {price !== null ? (
                        <span className="text-primary">{price}€</span>
                      ) : (
                        <span className="text-muted-foreground text-xs">On Request</span>
                      )}
                    </span>

                    {/* Status */}
                    <div className="hidden md:block">
                      {a.active ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 border border-green-200 px-2.5 py-1 text-xs font-semibold">
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted text-muted-foreground border border-border px-2.5 py-1 text-xs font-semibold">
                          <XCircle className="h-3 w-3" /> Draft
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => handleEdit(a)}
                        className="h-8 w-8 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary flex items-center justify-center transition-colors"
                        aria-label={`Edit ${a.title}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${
                          deleteConfirm === a.id
                            ? "bg-destructive text-destructive-foreground"
                            : "hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                        }`}
                        aria-label={
                          deleteConfirm === a.id ? `Confirm delete ${a.title}` : `Delete ${a.title}`
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Footer note */}
          <p className="text-xs text-center text-muted-foreground">
            Data stored in localStorage · Changes sync live to all public pages · Ready to plug into
            Sanity CMS
          </p>
        </main>
      </div>

      {/* Modal */}
      <ActivityModal
        open={modalOpen}
        editing={editing}
        onClose={() => setModalOpen(false)}
        onSave={upsert}
      />
    </div>
  );
}
