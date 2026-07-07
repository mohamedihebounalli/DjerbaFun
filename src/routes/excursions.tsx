import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/excursions")({
  component: () => (
    <section className="container-page py-24 text-center">
      <h1 className="font-display text-4xl font-bold">Excursions</h1>
      <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
        Coming next milestone — Djerba island tour and Ksar Ghilane 1-day / 2-day trips with itinerary timelines.
      </p>
    </section>
  ),
  head: () => ({ meta: [{ title: "Excursions from Djerba — Island Tour, Ksar Ghilane, Sahara" }] }),
});
