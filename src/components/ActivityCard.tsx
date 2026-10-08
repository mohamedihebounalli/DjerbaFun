import { Clock, MessageCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { Activity } from "@/lib/activities";
import { startingPrice } from "@/lib/activities";

export function ActivityCard({ activity, className, viewMode = "grid" }: { activity: Activity; className?: string; viewMode?: "grid" | "list" }) {
  const { t } = useI18n();
  const price = startingPrice(activity);

  if (viewMode === "list") {
    return (
      <article className={cn("group flex flex-col sm:flex-row overflow-hidden rounded-2xl bg-card border border-border shadow-soft hover:shadow-md transition-all duration-200", className)}>
        <Link to="/activities/$slug" params={{ slug: activity.slug }} className="relative block w-full sm:w-64 md:w-80 h-48 sm:h-auto shrink-0 overflow-hidden">
          <img
            src={activity.image}
            alt={activity.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {activity.badge && (
            <span className="absolute left-3 top-3 rounded-full bg-accent text-accent-foreground text-xs font-semibold px-2.5 py-1 shadow-soft">
              {activity.badge}
            </span>
          )}
        </Link>

        <div className="flex flex-1 flex-col p-5 justify-between space-y-3">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                {t(`nav.${activity.category}`)}
              </span>
              <div className="text-right">
                {activity.id === "boat-trip" || activity.id === "sunset-boat" ? (
                  <div className="font-display text-sm font-bold text-primary flex flex-col items-end leading-tight">
                    <span>30€ Adult</span>
                    <span className="text-xs font-normal text-muted-foreground">15€ Kids</span>
                  </div>
                ) : (
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {price === null ? "—" : `${price} €`} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/ pers</span>
                  </span>
                )}
              </div>
            </div>

            <h3 className="font-display text-xl font-bold leading-tight">
              <Link to="/activities/$slug" params={{ slug: activity.slug }} className="hover:text-primary">
                {activity.title}
              </Link>
            </h3>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{activity.shortDescription}</p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {activity.types.slice(0, 3).map((tp) => (
                <Badge key={tp} variant="secondary" className="rounded-full font-normal">
                  {t(`type.${tp}`)}
                </Badge>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {activity.durationLabel}
            </span>
            <Link
              to="/activities/$slug"
              params={{ slug: activity.slug }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-medium text-xs sm:text-sm rounded-xl transition-colors"
            >
              Voir détails &rarr;
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={cn("group flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-soft card-lift", className)}>
      <Link to="/activities/$slug" params={{ slug: activity.slug }} className="relative block aspect-[4/3] overflow-hidden">
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
        {activity.durationLabel && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/85 backdrop-blur px-2.5 py-1 text-xs font-medium text-foreground shadow-soft">
            <Clock className="h-3.5 w-3.5" /> {activity.durationLabel}
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg font-semibold leading-tight">
          <Link to="/activities/$slug" params={{ slug: activity.slug }} className="hover:text-primary">
            {activity.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{activity.shortDescription}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {activity.types.slice(0, 3).map((tp) => (
            <Badge key={tp} variant="secondary" className="rounded-full font-normal">
              {t(`type.${tp}`)}
            </Badge>
          ))}
        </div>

        <div className="mt-auto pt-4 flex items-end justify-between gap-3">
          <div>
            {activity.id === "boat-trip" || activity.id === "sunset-boat" ? (
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Tarifs</div>
                <div className="font-display text-sm font-bold text-primary flex flex-wrap items-center gap-1.5 mt-0.5">
                  <span className="whitespace-nowrap">30€ Adult</span>
                  <span className="text-muted-foreground/60 font-normal">|</span>
                  <span className="whitespace-nowrap">15€ Kids</span>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{t("card.from")}</div>
                <div className="font-display text-xl font-bold text-primary">
                  {price === null ? "—" : `${price}€`}
                </div>
              </div>
            )}
          </div>
          <Button
            asChild size="sm"
            className="rounded-full bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90 shadow-soft"
          >
            <a href={buildWhatsAppUrl({ activity: activity.title })} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" /> {t("card.book")}
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}
