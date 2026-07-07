import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Waves } from "lucide-react";

import { useI18n } from "@/lib/i18n";
import { useActivities } from "@/lib/activities";
import { ActivityCard } from "@/components/ActivityCard";
import { SearchBar, applyFilters, DEFAULT_FILTERS, type Filters } from "@/components/SearchBar";

export const Route = createFileRoute("/water-activities")({
  component: WaterActivities,
  head: () => ({
    meta: [
      { title: "Water Activities in Djerba — Jet Ski, Boat Trips, Parasailing" },
      { name: "description", content: "Book jet ski, banana boat, parasailing, sunset cruises and VIP boat trips in Djerba. Instant WhatsApp booking." },
      { property: "og:title", content: "Water Activities in Djerba" },
      { property: "og:url", content: "/water-activities" },
    ],
    links: [{ rel: "canonical", href: "/water-activities" }],
  }),
});

function WaterActivities() {
  const { t } = useI18n();
  const { activities } = useActivities();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const list = useMemo(
    () => applyFilters(activities.filter((a) => a.active && a.category === "water"), filters),
    [activities, filters],
  );

  return (
    <>
      <section className="bg-hero-gradient text-primary-foreground">
        <div className="container-page py-14 md:py-20">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-semibold uppercase tracking-wider ring-1 ring-white/25">
            <Waves className="h-3.5 w-3.5" /> {t("nav.water")}
          </span>
          <h1 className="mt-4 font-display text-4xl md:text-5xl font-extrabold max-w-3xl">
            {t("cat.waterHeadline")}
          </h1>
          <p className="mt-3 text-white/85 max-w-2xl">{t("cat.waterLead")}</p>
        </div>
      </section>

      <section className="container-page -mt-8 md:-mt-10 relative z-10">
        <SearchBar filters={filters} onChange={setFilters} onReset={() => setFilters(DEFAULT_FILTERS)} />
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
            {list.map((a) => <ActivityCard key={a.id} activity={a} />)}
          </div>
        )}
      </section>
    </>
  );
}
