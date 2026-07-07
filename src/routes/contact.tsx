import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  component: () => (
    <section className="container-page py-24 text-center">
      <h1 className="font-display text-4xl font-bold">Contact</h1>
      <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
        Coming next milestone — Google Maps, WhatsApp/phone/email quick links, and a contact form.
      </p>
    </section>
  ),
  head: () => ({ meta: [{ title: "Contact — Djerba Fun" }] }),
});
