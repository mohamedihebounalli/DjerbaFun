import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";

import { ActivityCard } from "./ActivityCard";
import type { Activity } from "@/lib/activities";
import { useI18n } from "@/lib/i18n";

interface ActivityListProps {
  list: Activity[];
}

export function ActivityList({ list }: ActivityListProps) {
  const { t } = useI18n();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="space-y-6">
      {/* Header with counter and toggles */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <p className="text-sm text-muted-foreground font-medium">
          {list.length} {t("search.results")}
        </p>

        {/* Toggle Grid / List */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-xl">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              viewMode === "grid"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Vue Grille"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Grille</span>
          </button>

          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              viewMode === "list"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Vue Liste"
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Liste</span>
          </button>
        </div>
      </div>

      {/* Dynamic rendering */}
      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No activities match your filters. Try resetting them.
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              : "flex flex-col gap-4"
          }
        >
          {list.map((a) => (
            <ActivityCard key={a.id} activity={a} viewMode={viewMode} />
          ))}
        </div>
      )}
    </div>
  );
}
