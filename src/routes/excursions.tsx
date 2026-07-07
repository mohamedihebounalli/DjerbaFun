import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Compass, Tag } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Clock, MessageCircle } from "lucide-react";

import { useI18n } from "@/lib/i18n";
import { useActivities } from "@/lib/activities";
import { SearchBar, applyFilters, DEFAULT_FILTERS, type Filters } from "@/components/SearchBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { Activity } from "@/lib/activities";

export const Route = createFileRoute("/excursions")({
  component: Excursions,
  head: () => ({
    meta: [
      { title: "Excursions from Djerba — Island Tour, Ksar Ghilane, Sahara" },
      {
        name: "description",
        content:
          "Book full-day and overnight excursions from Djerba: island tour, Ksar Ghilane oasis, and Sahara desert camp. Request your personalized quote via WhatsApp.",
      },
      { property: "og:title", content: "Excursions from Djerba" },
      { property: "og:url", content: "/excursions" },
    ],
    links: [{ rel: "canonical", href: "/excursions" }],
  }),
});

function ExcursionCard({ activity }: { activity: Activity }) {
  const { t } = useI18n();
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-soft card-lift">
      <Link
        to="/activities/$slug"
        params={{ slug: activity.slug }}
        className="relative block aspect-[4/3] overflow-hidden"
      >
        <img
          src={activity.image}
          alt={activity.title}
          loading="lazy"
          width={1200}
          height={800}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {activity.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-accent text-accent-foreground text-xs font-semibold px-2.5 py-1 shadow-soft">
            {activity.badge}
          </span>
        )}
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/85 backdrop-blur px-2.5 py-1 text-xs font-medium text-foreground shadow-soft">
          <Clock className="h-3.5 w-3.5" /> {activity.durationLabel}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg font-semibold leading-tight">
          <Link
            to="/activities/$slug"
            params={{ slug: activity.slug }}
            className="hover:text-primary"
          >
            {activity.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {activity.shortDescription}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {activity.types.slice(0, 3).map((tp) => (
            <Badge key={tp} variant="secondary" className="rounded-full font-normal">
              {t(`type.${tp}`)}
            </Badge>
          ))}
        </div>

        <div className="mt-auto pt-4 flex items-end justify-between gap-3">
          {/* Price on request badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 border border-accent/30 px-3 py-1.5">
            <Tag className="h-3.5 w-3.5 text-accent-foreground" />
            <span className="text-xs font-bold text-accent-foreground">Price on Request</span>
          </div>
          <Button
            asChild
            size="sm"
            className="rounded-full bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90 shadow-soft"
          >
            <a
              href={buildWhatsAppUrl({ activity: activity.title })}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="h-4 w-4" /> {t("card.book")}
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}

function Excursions() {
  const { t } = useI18n();
  const { activities } = useActivities();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const list = useMemo(
    () =>
      applyFilters(
        activities.filter((a) => a.active && a.category === "excursions"),
        filters,
      ),
    [activities, filters],
  );

  return (
    <>
      <section className="bg-hero-gradient text-primary-foreground">
        <div className="container-page py-14 md:py-20">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-semibold uppercase tracking-wider ring-1 ring-white/25">
            <Compass className="h-3.5 w-3.5" /> {t("nav.excursions")}
          </span>
          <h1 className="mt-4 font-display text-4xl md:text-5xl font-extrabold max-w-3xl">
            Beyond the island. Into the Sahara.
          </h1>
          <p className="mt-3 text-white/85 max-w-2xl">
            Full-day cultural tours of Djerba, epic one-day Sahara escapes, and unforgettable
            two-day desert camp adventures — all arranged for you via WhatsApp.
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
            No excursions match your filters. Try resetting them.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((a) => (
              <ExcursionCard key={a.id} activity={a} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
