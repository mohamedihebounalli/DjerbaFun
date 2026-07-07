import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import {
  Clock,
  Globe,
  Users,
  MapPin,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Gauge,
  Baby,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useActivities } from "@/lib/activities";
import { ImageGallery } from "@/components/ImageGallery";
import { BookingWidget } from "@/components/BookingWidget";
import { ExcursionTimeline } from "@/components/ExcursionTimeline";

export const Route = createFileRoute("/activities/$slug")({
  component: ActivityDetail,
  head: () => ({ meta: [{ title: "Activity — Djerba Fun" }] }),
});

function MetaBadge({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card px-4 py-3 text-center min-w-[90px]">
      <Icon className="h-5 w-5 text-primary" />
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
      <span className="text-sm font-semibold font-display leading-tight">{value}</span>
    </div>
  );
}

const difficultyColor: Record<string, string> = {
  Easy: "bg-green-100 text-green-800 border-green-200",
  Moderate: "bg-amber-100 text-amber-800 border-amber-200",
  Challenging: "bg-red-100 text-red-800 border-red-200",
};

function ActivityDetail() {
  const { slug } = useParams({ from: "/activities/$slug" });
  const { activities } = useActivities();
  const activity = activities.find((a) => a.slug === slug);

  if (!activity) {
    return (
      <section className="container-page py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Activity not found</h1>
        <p className="mt-3 text-muted-foreground">The activity "{slug}" doesn't exist.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Go home
        </Link>
      </section>
    );
  }

  const isExcursion = activity.category === "excursions";
  const galleryImages = activity.images?.length ? activity.images : [activity.image];

  return (
    <>
      {/* Breadcrumb */}
      <div className="container-page pt-6 pb-2">
        <Link
          to={
            activity.category === "water"
              ? "/water-activities"
              : activity.category === "land"
                ? "/land-activities"
                : "/excursions"
          }
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          {activity.category === "water"
            ? "Water Activities"
            : activity.category === "land"
              ? "Land Activities"
              : "Excursions"}
        </Link>
      </div>

      <div className="container-page pb-20">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          {/* ─── LEFT COLUMN ─────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-8">
            {/* Title */}
            <div>
              {activity.badge && (
                <span className="inline-block mb-3 rounded-full bg-accent/15 border border-accent/30 px-3 py-1 text-xs font-bold text-accent-foreground uppercase tracking-wide">
                  {activity.badge}
                </span>
              )}
              <h1 className="font-display text-3xl md:text-4xl font-extrabold">
                {activity.title}
              </h1>
              <p className="mt-2 text-muted-foreground text-lg">{activity.shortDescription}</p>
            </div>

            {/* Gallery */}
            <ImageGallery images={galleryImages} alt={activity.title} />

            {/* Metadata badges */}
            <div className="flex flex-wrap gap-3">
              <MetaBadge icon={Clock} label="Duration" value={activity.durationLabel} />
              {activity.languages && activity.languages.length > 0 && (
                <MetaBadge
                  icon={Globe}
                  label="Languages"
                  value={activity.languages.join(" · ")}
                />
              )}
              {activity.minAge !== undefined && (
                <MetaBadge
                  icon={Baby}
                  label="Min. Age"
                  value={activity.minAge === 0 ? "All ages" : `${activity.minAge}+`}
                />
              )}
              {activity.difficulty && (
                <div
                  className={`flex flex-col items-center gap-1 rounded-2xl border px-4 py-3 text-center min-w-[90px] ${difficultyColor[activity.difficulty]}`}
                >
                  <Gauge className="h-5 w-5" />
                  <span className="text-xs font-medium">Difficulty</span>
                  <span className="text-sm font-semibold font-display">{activity.difficulty}</span>
                </div>
              )}
              {activity.departureLocation && (
                <MetaBadge icon={MapPin} label="Departure" value={activity.departureLocation} />
              )}
            </div>

            {/* Description or Timeline */}
            <div>
              <h2 className="font-display text-xl font-bold mb-3">About this experience</h2>
              {isExcursion && activity.itinerary && activity.itinerary.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">{activity.longDescription}</p>
                  <ExcursionTimeline itinerary={activity.itinerary} />
                </div>
              ) : (
                <p className="text-muted-foreground leading-relaxed">{activity.longDescription}</p>
              )}
            </div>

            {/* Included / Excluded */}
            {(activity.included?.length > 0 || activity.excluded?.length > 0) && (
              <div>
                <h2 className="font-display text-xl font-bold mb-4">What's included</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Included */}
                  <div className="rounded-2xl border border-green-200 bg-green-50/50 p-5">
                    <h3 className="text-sm font-bold text-green-700 uppercase tracking-wide mb-3">
                      ✓ Included
                    </h3>
                    <ul className="space-y-2.5">
                      {activity.included.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Excluded */}
                  <div className="rounded-2xl border border-red-200 bg-red-50/50 p-5">
                    <h3 className="text-sm font-bold text-red-700 uppercase tracking-wide mb-3">
                      ✗ Not included
                    </h3>
                    <ul className="space-y-2.5">
                      {activity.excluded.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm">
                          <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Meeting point / map placeholder */}
            {activity.meetingPoint && (
              <div>
                <h2 className="font-display text-xl font-bold mb-4">Meeting point</h2>
                <div className="rounded-2xl border border-border overflow-hidden">
                  {/* Map placeholder */}
                  <div className="relative h-52 bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="h-12 w-12 rounded-full bg-primary/10 border-4 border-primary/30 flex items-center justify-center mx-auto mb-3">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <p className="font-display font-bold text-foreground">
                        {activity.meetingPoint}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Djerba, Tunisia</p>
                    </div>
                    {/* Decorative grid lines */}
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage:
                          "linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                      }}
                    />
                  </div>
                  <div className="p-4 bg-card flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold">{activity.meetingPoint}</p>
                      {activity.departureLocation && (
                        <p className="text-xs text-muted-foreground">{activity.departureLocation}</p>
                      )}
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/${encodeURIComponent(activity.meetingPoint + " Djerba Tunisia")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-auto text-xs text-primary hover:underline font-semibold flex-shrink-0"
                    >
                      Open in Maps →
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Options / price list */}
            {activity.options.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-bold mb-4">Available options</h2>
                <div className="space-y-2">
                  {activity.options.map((opt, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
                    >
                      <span className="text-sm font-medium">{opt.label}</span>
                      {opt.price !== null ? (
                        <span className="font-display font-bold text-primary">{opt.price}€</span>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="rounded-full text-xs bg-accent/15 text-accent-foreground border border-accent/30"
                        >
                          Price on Request
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {activity.types.map((tp) => (
                <Badge key={tp} variant="secondary" className="rounded-full">
                  {tp.charAt(0).toUpperCase() + tp.slice(1)}
                </Badge>
              ))}
              <Badge variant="outline" className="rounded-full">
                {activity.category === "water"
                  ? "🌊 Water"
                  : activity.category === "land"
                    ? "🏔️ Land"
                    : "🧭 Excursion"}
              </Badge>
            </div>
          </div>

          {/* ─── RIGHT COLUMN (sticky booking widget) ────────────────────── */}
          <div className="lg:w-[380px] xl:w-[420px] flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <BookingWidget activity={activity} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
