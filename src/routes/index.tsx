import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect, useCallback } from "react";
import {
  ArrowRight, MessageCircle, Wallet, ShieldCheck, Users, Star,
  Waves, Mountain, Bus, Quote, ChevronDown, ChevronLeft, ChevronRight,
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
      { title: "Island Experience — Book Water, Land & Sahara Activities in Djerba" },
      { name: "description", content: "Jet ski, parasailing, quad, camel rides, boat trips and Sahara excursions in Djerba. Instant WhatsApp booking, no online payment." },
      { property: "og:title", content: "Island Experience — Activities in Djerba" },
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
          <div className="text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold">{t("reviews.title")}</h2>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
              <span className="flex gap-0.5 text-accent">
                {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-3.5 w-3.5 fill-current" />)}
              </span>
              <span className="font-semibold text-foreground">5.0 sur 5</span>
              — Basé sur les avis Google vérifiés
            </p>
          </div>
          <ReviewsCarousel />
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

// ─── Google Reviews Data ──────────────────────────────────────────────────────
const REVIEWS: { author: string; rating: number; comment: string; tag?: string }[] = [
  { author: "Karima Abdiche", rating: 5, comment: "Sortie jet ski au coucher de soleil incroyable avec rencontre des dauphins. Merci à toute l'équipe de B20 et particulièrement à Yasmine, qui met vraiment tout en place pour que la sortie soit inoubliable. Je recommande à 100%.", tag: "Local Guide" },
  { author: "Martin Chenoix", rating: 5, comment: "Station Nautique à recommander... tout se fait en famille, très chouette ambiance avec pas mal de choses à découvrir avec des prix très raisonnables. Matériel récent et entretenu." },
  { author: "Stephen BACQUE", rating: 5, comment: "Superbe sortie bateau, ambiance incroyable, spot magnifique, mer translucide. Une équipe familiale très attentionné et sympathique.", tag: "Local Guide" },
  { author: "Laurine", rating: 5, comment: "Super expérience ! La propriétaire est vraiment géniale, accueillante et très sympathique, tout comme toute son équipe. Les activités étaient au top et la plage est magnifique. Je recommande sans hésiter, merci pour ce super moment !" },
  { author: "vdb sandra", rating: 5, comment: "Merci à Pascaline! Un super bon moment, j'ai adoré! Merci a Jasmine aussi et aux autres 🩷", tag: "Local Guide" },
  { author: "Muriel Treguer", rating: 5, comment: "Exceptionnel. Incroyable balade en jet-ski. Equipe génial. Demander Saber à la plage", tag: "Local Guide" },
  { author: "mimi mimi", rating: 5, comment: "expérience plus que formidable équipe accueillant souriant .. ma chère pascale est une merveille... on a passé une journée inoubliable avec toutes les activités disponible en toute sécurité.. merci et à la prochaine nchallah ... personnellemet je recommande" },
  { author: "Ana Lino", rating: 5, comment: "I took the boat trip to the castle and it was incredible. Probably one of the best parts of my vacation in Djerba. Very nice staff, responsible pilots and free time to swim on beautiful clear water!", tag: "Local Guide" },
  { author: "Simon", rating: 5, comment: "Incroyable souvenir laisser en moi après cette activité en jetski ! L'équipe franchement au top, très accueillante. Les paysages sont magnifiques, et sans parler des dauphins vu lors de la balade 🤩🤩🤩" },
  { author: "Xavier Declerck", rating: 5, comment: "Une superbe expérience, C'était la première fois que nous faisions du jet ski. Les explications sont claires, la balade au top, nous avons passé un excellent moment." },
  { author: "Asma Ben Mahmoud", rating: 5, comment: "Nous tenons à exprimer notre profonde gratitude à l'agence Sport Nautique B20 pour avoir organisé une expérience de balade en mer si exceptionnelle. Du début à la fin, tout a été parfaitement orchestré." },
  { author: "Osmani Noumad", rating: 5, comment: "Balade en jet et bateau top, nous avons vu des dauphins pendant notre balade et surtout un grand merci à Pascale et sa fille pour l accueil je recommande." },
  { author: "Magali Berger", rating: 5, comment: "Nous sommes parti sur le bateau jusque sur 1 petite île magnifique ou nous avons pu nous baigner. Sur la chemin nous n'avons pas eu la chance de voir les dauphins 🐬 mais nous avons passé un très bon moment. Le personnel est très sympa...", tag: "Local Guide" },
  { author: "orianne leclaire", rating: 5, comment: "Je vous recommande cette base nautique qui est incroyable avec des personnes extraordinaires la main sur le cœur et qui vous feront toujours passer un super bon moment. Ambiance au top :D" },
  { author: "Camille Desbois Flament", rating: 5, comment: "Un superbe accueil familial et aussi très arrangeant. Nous avons durant notre séjour à Djerba pu expérimenter le parachute ascensionnel avec une vue imprenable sur la mer turquoise que nous offre la nature. Accompagner d'un personnel très attentionné.", tag: "Local Guide" },
  { author: "Houda Assou", rating: 5, comment: "Super balade à jet ski. Nous avons eu la chance de voir les dauphins. La maman et sa fille sont très professionnelles. Merci.", tag: "Local Guide" },
  { author: "Amine Knis", rating: 5, comment: "Une belle expérience avec la B20, un grand merci à Salim Knis et à sa maman, ainsi qu'à Yasmine et son équipe des personnes professionnelles, accueillantes et bienveillantes. Je vous le conseille très fortement." },
  { author: "Gurvan", rating: 5, comment: "Guides et personnel de la base nautique super agréable. Explications claires au niveau du maniement des jets skis, pendant la pause de la balade ils avais prévues des boissons. La sortie est accompagné d'un bateau si vous voulez aussi." },
  { author: "Batiste Servoin", rating: 5, comment: "Balade en jet ski avec les dauphins. La balade en jet ski était super bien. L'équipe au top on a passé un super moment." },
  { author: "Anne Dubois", rating: 5, comment: "Une expérience incroyable chez Pascal Jetski ! 🚤✨ Équipe au top du top, super accueillante et très professionnelle.", tag: "Local Guide" },
  { author: "Célia HALM", rating: 5, comment: "Super balade en jet ski. Notre balade a été décalée suite au mauvais temps, pour que l'on puissent profiter aux maximum. La gérante est d'une grande gentillesse et préfère vendre des activités de qualités, ce qui est rare en Tunisie.", tag: "Local Guide" },
  { author: "MOURAD belgacem", rating: 5, comment: "C'était parfait arrivé sur la plage en 4x4 en famille, exploration d'île déserte, c'était génial. Merci à tous." },
  { author: "Julie Jomaux", rating: 5, comment: "Superbe expérience de jet ski à 7h du matin, avons eu la chance de voir les dauphins 🤩 Merci à la super équipe familiale !" },
  { author: "Carole Grandis", rating: 5, comment: "Super équipe merci à Yasmine pour ce tour en jet ski formidable avec en prime des dauphins que demander de plus. Merci à Pascaline, Selim et ali. Nous avons passé un super moment en faisant aussi du parachute ascensionnel.", tag: "Local Guide" },
  { author: "kadhem kacem", rating: 5, comment: "Very Good experience, the service was good, we were lucky we saw the Dolphins. The Jet ski and the boat were excellent. Yasmine and the whole team was very kind." },
  { author: "Julie Dumas", rating: 5, comment: "Merci à Pascaline et son équipe souriante pour la sortie en jet ski. Bons équipements, entreprise familiale, on reviendra ☀️", tag: "Local Guide" },
  { author: "Fayssal El jélé-jélé", rating: 5, comment: "Un accueille super, des jets skis hyper qualitatifs ! Un business familial au top. Allez-y les yeux fermés!", tag: "Local Guide" },
  { author: "Clémentine Ben Messaoud", rating: 5, comment: "Nous avons fait la ballade en mer (bateau et jet ski) pour aller à la rencontre des dauphins puis le parachute ascensionnel - c'était extra! Pascale et son équipe sont au top! Je recommande à 100%." },
  { author: "Hélène vermeire benz", rating: 5, comment: "Nous avons pris un bateau pour 2 personnes et découvert des endroits magnifiques loin des touristes." },
  { author: "barbe rousse", rating: 5, comment: "Très bel accueil et activité au top ! Mes deux enfants ont vraiment kiffé et moi également. L'équipe ainsi que la gérante sont vraiment sympa et parle tous très bien français.", tag: "Local Guide" },
  { author: "Nathan", rating: 5, comment: "Sous une chaleur accablante nous avons pu faire une chouette balade en Jet ski! Les personnes avec qui nous avons communiquer sont d'une profonde gentillesse !", tag: "Local Guide" },
  { author: "Vladimir Ristevski", rating: 5, comment: "Very very good experience. They have 2 jet skis, parachute boat ride, and many other water rides. Pascale (owner) speaks English, German and French. Boat crew is very fun, all local Tunisian people. Must try.", tag: "Local Guide" },
  { author: "bilel boulem", rating: 5, comment: "Merci pour ces bons moments passés avec vous equipe au top on sait regalé je recommande fortement si vous voulez passe un super moment dans un cadre magnifique merci Yasmine Salim et la maman pour votre reactivité." },
  { author: "Benoit Petit", rating: 5, comment: "Super sympathique et très pros. Nous conseillons vivement. Merci pour nos 100 élèves. Bonne continuation à vous." },
  { author: "Alexandre", rating: 5, comment: "Équipe au top. Les jets skis sont neufs… je recommande !" },
  { author: "Marius Motury", rating: 5, comment: "Mérite plus de visibilité car le moment était super ! J'ai pus faire 1h30 de jet ski en toute liberté avec un mono super sympathique où nous étions qu'à 2. C'est en famille et Pascale la maman est super gentille." },
  { author: "Yvon Perret", rating: 5, comment: "Une jolie ballade en mer avec arrêt dans un lagon agréable et retour. 1h 30de ballade pour une somme très raisonnable. Possibilité de suivre le bateau en Jet-ski pour les amateurs.", tag: "Local Guide" },
  { author: "Najla Ben Slimene", rating: 5, comment: "On a vécu une expérience unique avec leur équipe professionnelle. Ils sont aux petits soins de leurs clients. Une dame très gentille était avec les enfants sur le bateau.", tag: "Local Guide" },
  { author: "Olivia Graphiste", rating: 5, comment: "✨ Un immense merci à Sport Nautiques - B20 pour cette super expérience ! Mes deux garçons ont adoré — à chaque séance, ils reviennent avec le sourire 😃. Un accueil chaleureux, une équipe au top menée par Pascaline." },
  { author: "Stece 35", rating: 5, comment: "Toutes l équipes très gentil Activite au top je recommande à 100%" },
  { author: "Quentin Rulmont", rating: 5, comment: "Super expérience, on a vu un dauphin de près! Petite île à côté magnifique et guides très sympa!" },
  { author: "N. R.", rating: 5, comment: "Un accueil avec le sourire, une équipe à l'écoute et rassurante, ma fille et moi avons vécu une expérience jetski incroyable avec une vue digne du paradis ! Je recommande ++++++ Merci encore à vous !", tag: "Local Guide" },
  { author: "Amelka Soja", rating: 5, comment: "The best experience of my life!! Me and my boyfriend rented one jetski for 1.5h and it was great. the service is the best in the world. Thanks to the guide we managed to see the deflins!! I recommend❤️" },
  { author: "Houssem Eddine", rating: 5, comment: "Superbe experience avec B20. Selim est super gentil ainsi que toute la famille de B20. Merci pour la balade et la baignade." },
  { author: "Ludivine Awth", rating: 5, comment: "Superbe expérience avec la base nautique B20. Balade d'1h30 en bateau avec une pause baignade, un endroit idyllique avec une eau turquoise et translucide à couper le souffle !" },
  { author: "Yassine Knis", rating: 5, comment: "Super expérience ! Des moments incroyables et magique ☀️😎" },
  { author: "Cathy", rating: 5, comment: "Un entreprise familiale accueillante, mélange Européen/Tunisien, de belles histoires. Nous y avons fait du jet ski..." },
  { author: "Heda Rni", rating: 5, comment: "Super expérience ! Une entreprise familiale accueillante et chaleureuse. Nous avons fait du parachute avec en bonus une petite balade en bateau le long des côtes." },
  { author: "Aurelie Milovanow", rating: 5, comment: "2 excursions avec eux : une en bateau avec des Jetski qui nous suivait, direction les dauphins plus la lagune, c'était tellement bien équipe au top !", tag: "Local Guide" },
  { author: "Pascale Knis", rating: 5, comment: "Experience inoubliable ! Très bon service avec des personnes chaleureuses. Bel endroit autant pour vous baignez que pour faire des activités nautiques!! Highly recommanded!" },
  { author: "Karim Knis", rating: 5, comment: "Super activités ! Surtout la balade en mer et le parachute 😍✅" },
  { author: "Ce Le KLTS", rating: 5, comment: "Superbe excursion en mer en compagnie de dauphins .🐬 Parachute ascensionnel à faire absolument ! Contact très agréable 👍" },
  { author: "Chloe Charlet", rating: 5, comment: "Ma première fois en jet ski, c'était fabuleux,le personnel très gentil ! Je recommande !" },
  { author: "Kamel Bourguiba", rating: 5, comment: "Une base nautique impeccable avec une bonne ambiance, merciii à la patronne qui déchire, merci aussi au pilote qui nous a fais découvrir des magnifiques endroit 🙏🏻" },
];

// ─── Reviews Carousel ─────────────────────────────────────────────────────────
const CARDS_PER_PAGE_DESKTOP = 3;
const MAPS_URL = "https://www.google.com/maps/place/Water+Sports+-+B20/@33.7637547,11.0245021,1041m/data=!3m1!1e3!4m6!3m5!1s0x13aa971a0d94ba89:0x2b9f88f6dfe0c54c!8m2!3d33.7637547!4d11.0245021!16s%2Fg%2F11hzcvbfft?entry=ttu&g_ep=EgoyMDI2MDkzMC4wIKXMDSoASAFQAw%3D%3D";

function ReviewsCarousel() {
  const [page, setPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect viewport width to switch cards-per-page
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);
    handler(mq);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const perPage = isMobile ? 1 : CARDS_PER_PAGE_DESKTOP;
  const totalPages = Math.ceil(REVIEWS.length / perPage);

  // Infinite loop: always wraps around
  const prev = useCallback(() => setPage((p) => (p - 1 + totalPages) % totalPages), [totalPages]);
  const next = useCallback(() => setPage((p) => (p + 1) % totalPages), [totalPages]);

  // Reset page index when perPage changes to avoid out-of-range
  useEffect(() => { setPage(0); }, [perPage]);

  // Auto-advance every 6 s
  useEffect(() => {
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next]);

  const slice = REVIEWS.slice(page * perPage, page * perPage + perPage);

  return (
    <div className="mt-10">
      {/* Cards */}
      <div className="grid gap-5 md:grid-cols-3">
        {slice.map((r, i) => (
          <a
            key={`${page}-${i}`}
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl bg-card border border-border p-6 shadow-soft flex flex-col cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30"
          >
            {/* Stars */}
            <div className="flex items-center gap-1 text-accent">
              {Array.from({ length: 5 }).map((_, k) => (
                <Star key={k} className="h-4 w-4 fill-current" />
              ))}
            </div>
            {/* Quote icon */}
            <Quote className="mt-3 h-5 w-5 text-primary/40 shrink-0" />
            {/* Review text */}
            <blockquote className="mt-2 text-sm leading-relaxed text-foreground/90 flex-1">
              "{r.comment}"
            </blockquote>
            {/* Footer */}
            <div className="mt-5 flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground font-semibold uppercase text-sm">
                {r.author.charAt(0)}
              </span>
              <div className="min-w-0">
                <div className="font-semibold text-sm truncate">{r.author}</div>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  {/* Google badge */}
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-semibold text-blue-700 leading-none">
                    <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" aria-hidden>
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Avis Google
                  </span>
                  {r.tag && (
                    <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary leading-none">
                      {r.tag}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Navigation — arrows only, no counter, no dots */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={prev}
          aria-label="Avis précédents"
          className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card shadow-soft transition hover:bg-primary hover:text-primary-foreground hover:border-primary"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          aria-label="Avis suivants"
          className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card shadow-soft transition hover:bg-primary hover:text-primary-foreground hover:border-primary"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}