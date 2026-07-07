import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/land-activities")({
  component: () => (
    <section className="container-page py-24 text-center">
      <h1 className="font-display text-4xl font-bold">Land Activities</h1>
      <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
        Coming next milestone — same layout as Water Activities, with quad, camel, horse riding and safety info.
      </p>
    </section>
  ),
  head: () => ({ meta: [{ title: "Land Activities in Djerba — Quad, Camel, Horse Riding" }] }),
});
