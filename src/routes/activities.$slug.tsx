import { createFileRoute, useParams } from "@tanstack/react-router";
import { useActivities } from "@/lib/activities";

export const Route = createFileRoute("/activities/$slug")({
  component: ActivityDetail,
  head: () => ({ meta: [{ title: "Activity — Djerba Fun" }] }),
});

function ActivityDetail() {
  const { slug } = useParams({ from: "/activities/$slug" });
  const { activities } = useActivities();
  const activity = activities.find((a) => a.slug === slug);

  if (!activity) {
    return (
      <section className="container-page py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Activity not found</h1>
        <p className="mt-3 text-muted-foreground">The activity “{slug}” doesn’t exist.</p>
      </section>
    );
  }

  return (
    <section className="container-page py-14">
      <h1 className="font-display text-4xl font-bold">{activity.title}</h1>
      <p className="mt-2 text-muted-foreground">{activity.shortDescription}</p>
      <p className="mt-6 text-sm text-muted-foreground">
        Full detail page (gallery, calendar, itinerary, booking panel) is scheduled for Milestone 2.
      </p>
    </section>
  );
}
