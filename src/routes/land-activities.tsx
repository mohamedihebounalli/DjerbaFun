import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Mountain } from "lucide-react";

import { useI18n } from "@/lib/i18n";
import { useActivities } from "@/lib/activities";
import { ActivityCard } from "@/components/ActivityCard";
import { SearchBar, applyFilters, DEFAULT_FILTERS, type Filters } from "@/components/SearchBar";

export const Route = createFileRoute("/land-activities")({
  component: LandActivities,
  head: () => ({
    meta: [
      { title: "Land Activities in Djerba — Quad, Camel Ride, Horse Riding" },
      {
        name: "description",
        content:
          "Book quad biking, camel rides, horse riding and more land adventures in Djerba. Instant WhatsApp booking, professional guides.",
      },
      { property: "og:title", content: "Land Activities in Djerba" },
      { property: "og:url", content: "/land-activities" },
    ],
    links: [{ rel: "canonical", href: "/land-activities" }],
  }),
});

function LandActivities() {
  const { t } = useI18n();
  const { activities } = useActivities();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const list = useMemo(
    () => applyFilters(activities.filter((a) => a.active && a.category === "land"), filters),
    [activities, filters],
  );

  return (
    <>
      <section className="bg-hero-gradient text-primary-foreground">
        <div className="container-page py-14 md:py-20">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-semibold uppercase tracking-wider ring-1 ring-white/25">
            <Mountain className="h-3.5 w-3.5" /> {t("nav.land")}
          </span>
          <h1 className="mt-4 font-display text-4xl md:text-5xl font-extrabold max-w-3xl">
            Ride, roam, explore on land.
          </h1>
          <p className="mt-3 text-white/85 max-w-2xl">
            Quad bikes through palm groves, camel rides along the shoreline, and horse riding at
            sunrise — Djerba's land adventures await.
          </p>
        </div>
      </section>

      <section className="container-page -mt-8 md:-mt-10 relative z-10">
        <SearchBar
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(DEFAULT_FILTERS)}
        />
      </section>

      <section className="container-page py-12 md:py-16">
        <div className="text-sm text-muted-foreground mb-6">
          {list.length} {t("search.results")}
        </div>
        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            No activities match your filters. Try resetting them.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((a) => (
              <ActivityCard key={a.id} activity={a} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
