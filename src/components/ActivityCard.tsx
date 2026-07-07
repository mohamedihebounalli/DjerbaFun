import { Clock, MessageCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { Activity } from "@/lib/activities";
import { startingPrice } from "@/lib/activities";

export function ActivityCard({ activity }: { activity: Activity }) {
  const { t } = useI18n();
  const price = startingPrice(activity);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-soft card-lift">
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
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/85 backdrop-blur px-2.5 py-1 text-xs font-medium text-foreground shadow-soft">
          <Clock className="h-3.5 w-3.5" /> {activity.durationLabel}
        </div>
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
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{t("card.from")}</div>
            <div className="font-display text-xl font-bold text-primary">
              {price === null ? "—" : `${price}€`}
            </div>
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
