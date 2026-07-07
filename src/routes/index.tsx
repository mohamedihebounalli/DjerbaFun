import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight, MessageCircle, Wallet, ShieldCheck, Users, Star,
  Waves, Mountain, Bus, Quote, ChevronDown,
} from "lucide-react";

import heroImg from "@/assets/hero-djerba.jpg";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useI18n } from "@/lib/i18n";
import { useActivities } from "@/lib/activities";
import { ActivityCard } from "@/components/ActivityCard";
import { SearchBar, applyFilters, DEFAULT_FILTERS, type Filters } from "@/components/SearchBar";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Djerba Fun — Book Water, Land & Sahara Activities in Djerba" },
      { name: "description", content: "Jet ski, parasailing, quad, camel rides, boat trips and Sahara excursions in Djerba. Instant WhatsApp booking, no online payment." },
      { property: "og:title", content: "Djerba Fun — Activities in Djerba" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

function Home() {
  const { t } = useI18n();
  const { activities } = useActivities();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const visibleActivities = useMemo(
    () => applyFilters(activities.filter((a) => a.active), filters),
    [activities, filters],
  );
  const popular = useMemo(
    () => activities.filter((a) => a.active && a.featured).slice(0, 6),
    [activities],
  );

  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImg}
          alt="Djerba beach with turquoise water"
          width={1920}
          height={1080}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/60 via-primary/30 to-background" />
        <div className="container-page pt-20 pb-28 md:pt-28 md:pb-40 text-primary-foreground">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-semibold uppercase tracking-wider ring-1 ring-white/25">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Djerba, Tunisia
            </span>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.05] drop-shadow-md">
              {t("hero.title")}
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl">
              {t("hero.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-lift h-12 px-6 font-semibold">
                <a href="#categories">{t("hero.cta")} <ArrowRight className="h-4 w-4" /></a>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full bg-white/10 backdrop-blur text-white border-white/30 hover:bg-white/20 h-12 px-6">
                <a href={buildWhatsAppUrl({ activity: "General inquiry" })} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
        {/* Floating search — desktop overlap */}
        <div className="container-page relative -mt-16 md:-mt-20 pb-10">
          <SearchBar filters={filters} onChange={setFilters} onReset={() => setFilters(DEFAULT_FILTERS)} />
          
          {/* Fix: Kept in DOM with visibility toggle to reserve space and prevent bg image layout shifting */}
          <div 
            className={`mt-3 text-sm text-muted-foreground transition-opacity duration-150 ${
              (filters.q || filters.type !== "any" || filters.duration !== "any" || filters.maxPrice < 300) 
                ? "opacity-100" 
                : "opacity-0 pointer-events-none select-none"
            }`}
          >
            {visibleActivities.length} {t("search.results")}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="container-page py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold">{t("why.title")}</h2>
          <p className="mt-3 text-muted-foreground">{t("why.subtitle")}</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { icon: MessageCircle, key: "instant" },
            { icon: Wallet, key: "prices" },
            { icon: Users, key: "team" },
            { icon: ShieldCheck, key: "safe" },
            { icon: Star, key: "rated" },
          ].map(({ icon: Icon, key }) => (
            <div key={key} className="rounded-2xl bg-card border border-border p-5 card-lift">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{t(`why.${key}`)}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t(`why.${key}Desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="container-page py-8 md:py-16">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold">{t("cat.title")}</h2>
          <p className="mt-3 text-muted-foreground">{t("cat.subtitle")}</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <CategoryCard to="/water-activities" icon={<Waves className="h-6 w-6" />} title={t("cat.water")} desc={t("cat.waterDesc")} tone="ocean" />
          <CategoryCard to="/land-activities" icon={<Mountain className="h-6 w-6" />} title={t("cat.land")} desc={t("cat.landDesc")} tone="sand" />
          <CategoryCard to="/excursions" icon={<Bus className="h-6 w-6" />} title={t("cat.excursions")} desc={t("cat.excursionsDesc")} tone="primary" />
        </div>
      </section>

      {/* POPULAR */}
      <section className="container-page py-16 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">{t("popular.title")}</h2>
            <p className="mt-2 text-muted-foreground">{t("popular.subtitle")}</p>
          </div>
          <Link to="/water-activities" className="inline-flex items-center gap-1 text-primary font-semibold hover:underline">
            {t("popular.viewAll")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((a) => <ActivityCard key={a.id} activity={a} />)}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="bg-primary-soft/50">
        <div className="container-page py-16 md:py-24">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center">{t("reviews.title")}</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {REVIEWS.map((r, i) => (
              <figure key={i} className="rounded-2xl bg-card border border-border p-6 shadow-soft">
                <div className="flex items-center gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}
                </div>
                <Quote className="mt-3 h-5 w-5 text-primary/40" />
                <blockquote className="mt-2 text-sm leading-relaxed text-foreground/90">"{r.text}"</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground font-semibold">
                    {r.name.charAt(0)}
                  </span>
                  <div>
                    <div className="font-semibold text-sm">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.origin} · Google review</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">{t("faq.title")}</h2>
            <p className="mt-3 text-muted-foreground">
              {t("hero.subtitle")}
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {[1, 2, 3, 4].map((n) => (
              <AccordionItem key={n} value={`q${n}`} className="border-border">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  <span className="flex items-center gap-3">
                    <ChevronDown className="h-4 w-4 text-primary shrink-0 hidden" />
                    {t(`faq.q${n}`)}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{t(`faq.a${n}`)}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
}

function CategoryCard({
  to, icon, title, desc, tone,
}: {
  to: "/water-activities" | "/land-activities" | "/excursions";
  icon: React.ReactNode; title: string; desc: string;
  tone: "ocean" | "sand" | "primary";
}) {
  const toneClass =
    tone === "ocean" ? "from-ocean/25 to-primary/15" :
    tone === "sand" ? "from-accent/25 to-accent-soft" :
    "from-primary/20 to-primary-soft";
  return (
    <Link to={to} className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-soft card-lift">
      <div className={`absolute inset-0 bg-gradient-to-br ${toneClass} opacity-70`} aria-hidden />
      <div className="relative">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-soft text-primary">{icon}</div>
        <h3 className="mt-5 font-display text-2xl font-bold">{title}</h3>
        <p className="mt-2 text-sm text-foreground/70 max-w-xs">{desc}</p>
        <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
          Explore <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

const REVIEWS = [
  { name: "Léa M.", origin: "Paris, France", text: "Booking via WhatsApp took 30 seconds. The jet ski safari was the highlight of our week — will definitely come back!" },
  { name: "Marco R.", origin: "Milano, Italia", text: "Fantastic team, honest prices. The sunset boat trip was magical. Highly recommended." },
  { name: "Anna K.", origin: "Warszawa, Polska", text: "Perfect for families. Our kids loved the banana boat and camel ride. Everything was well organised." },
];