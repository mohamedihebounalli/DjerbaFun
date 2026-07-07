import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import jetski from "@/assets/act-jetski.jpg";
import banana from "@/assets/act-banana.jpg";
import parasailing from "@/assets/act-parasailing.jpg";
import boat from "@/assets/act-boat.jpg";
import quad from "@/assets/act-quad.jpg";
import camel from "@/assets/act-camel.jpg";
import horse from "@/assets/act-horse.jpg";
import excursionDjerba from "@/assets/act-excursion-djerba.jpg";
import ksar1d from "@/assets/act-ksar-1d.jpg";
import ksar2d from "@/assets/act-ksar-2d.jpg";

export type Category = "water" | "land" | "excursions";
export type ActivityType = "family" | "adventure" | "couple" | "kids";
export type Difficulty = "Easy" | "Moderate" | "Challenging";

export interface PriceOption {
  label: string;
  price: number | null; // null = price on request
}

export interface ItineraryStep {
  time: string;
  label: string;
  description?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  steps: ItineraryStep[];
}

export interface Activity {
  id: string;
  slug: string;
  category: Category;
  title: string;
  shortDescription: string;
  longDescription: string;
  image: string;
  images: string[]; // gallery: first is hero
  durationMinutes: number;
  durationLabel: string;
  types: ActivityType[];
  options: PriceOption[];
  badge?: string;
  featured?: boolean;
  active: boolean;
  meetingPoint?: string;
  departureLocation?: string;
  difficulty?: Difficulty;
  languages?: string[];
  minAge?: number;
  included: string[];
  excluded: string[];
  itinerary?: ItineraryDay[]; // only for excursions
}

/** Content is versioned so we can migrate stored copies later. */
const SEED_VERSION = 2;
const STORAGE_KEY = "djfun.activities.v2";

const SEED: Activity[] = [
  // ─── WATER ────────────────────────────────────────────────────────────────
  {
    id: "jetski",
    slug: "jet-ski-djerba",
    category: "water",
    title: "Jet Ski",
    shortDescription: "Feel the rush of the open sea on a solo or tandem jet ski.",
    longDescription:
      "Strap on your life jacket and blast across the turquoise waters of Djerba at full throttle. Our modern Sea-Doo jet skis are maintained daily and equipped with safety cut-off switches. Choose a short 15-minute blast, a half-hour cruise along the coastline, or our iconic 1h30 Safari route that takes you past flamingo sandbanks and deserted coves. Full briefing provided — no experience needed.",
    image: jetski,
    images: [jetski, parasailing, banana],
    durationMinutes: 30,
    durationLabel: "15 min – 1 h 30",
    types: ["adventure", "couple"],
    badge: "Best seller",
    featured: true,
    active: true,
    meetingPoint: "Sidi Mahrez beach",
    departureLocation: "Sidi Mahrez beach, Djerba",
    difficulty: "Moderate",
    languages: ["FR", "EN", "IT", "DE", "PL"],
    minAge: 16,
    options: [
      { label: "15 min", price: 30 },
      { label: "30 min", price: 50 },
      { label: "Safari 1 h 30", price: 90 },
    ],
    included: [
      "Life jacket & safety briefing",
      "Certified instructor on duty",
      "Fuel & equipment maintenance",
      "Liability insurance",
    ],
    excluded: [
      "Hotel pick-up (available on request)",
      "Personal accident insurance",
      "Gratuities",
    ],
  },
  {
    id: "banana",
    slug: "banana-boat-djerba",
    category: "water",
    title: "Banana Boat",
    shortDescription: "Fun-packed ride perfect for friends and family.",
    longDescription:
      "Hold on tight as our speedboat drags you and your group across the waves on a giant inflatable banana! Expect twists, turns, and plenty of splashing. This is the ultimate group activity — guaranteed laughs for all ages. Up to 6 riders per session. Life jackets included, swim gear recommended.",
    image: banana,
    images: [banana, jetski, boat],
    durationMinutes: 15,
    durationLabel: "15 min",
    types: ["family", "kids"],
    active: true,
    meetingPoint: "Sidi Mahrez beach",
    departureLocation: "Sidi Mahrez beach, Djerba",
    difficulty: "Easy",
    languages: ["FR", "EN", "IT"],
    minAge: 6,
    options: [{ label: "15 min", price: 15 }],
    included: [
      "Life jackets for all riders",
      "Safety briefing",
      "Up to 6 riders per banana",
    ],
    excluded: ["Swimwear (bring your own)", "Personal photography"],
  },
  {
    id: "sofa",
    slug: "sofa-ride-djerba",
    category: "water",
    title: "Sofa Ride",
    shortDescription: "Hold tight on this bouncy inflatable towed by a speedboat.",
    longDescription:
      "The Sofa Ride is Djerba's most hilarious inflatable experience. Sit comfortably on a giant inflatable sofa — until the speedboat picks up speed and turns you sideways! Perfect for small groups wanting big laughs without requiring any swimming skill. Life jackets always provided.",
    image: banana,
    images: [banana, jetski, boat],
    durationMinutes: 15,
    durationLabel: "15 min",
    types: ["family", "adventure"],
    active: true,
    meetingPoint: "Sidi Mahrez beach",
    departureLocation: "Sidi Mahrez beach, Djerba",
    difficulty: "Easy",
    languages: ["FR", "EN", "IT", "DE"],
    minAge: 8,
    options: [{ label: "15 min", price: 15 }],
    included: ["Life jackets", "Safety briefing", "Towel service"],
    excluded: ["Swimwear", "Personal photography"],
  },
  {
    id: "parasailing",
    slug: "parasailing-djerba",
    category: "water",
    title: "Parasailing",
    shortDescription: "Fly above the turquoise sea and enjoy an unbeatable view of Djerba.",
    longDescription:
      "Soar up to 80 metres above the Mediterranean and drink in Djerba's iconic panorama — the Roman causeway, the flamingo lagoons, and endless turquoise sea below. Our parasailing boat handles take-off and landing smoothly from the deck, so you never even need to get wet. Tandem option available for couples.",
    image: parasailing,
    images: [parasailing, jetski, boat],
    durationMinutes: 20,
    durationLabel: "~20 min flight",
    types: ["couple", "adventure"],
    badge: "Iconic",
    featured: true,
    active: true,
    meetingPoint: "Sidi Mahrez beach",
    departureLocation: "Sidi Mahrez beach, Djerba",
    difficulty: "Easy",
    languages: ["FR", "EN", "IT", "DE", "PL"],
    minAge: 14,
    options: [{ label: "1 flight", price: 40 }],
    included: [
      "Full harness & safety equipment",
      "Deck launch (no water entry needed)",
      "Certified crew",
      "Photo from the boat (on request)",
    ],
    excluded: [
      "Personal aerial photography",
      "Hotel transfer",
    ],
  },
  {
    id: "boat-trip",
    slug: "boat-trip-djerba",
    category: "water",
    title: "Boat Trip",
    shortDescription: "Traditional pirate boat ride along the coast.",
    longDescription:
      "Embark on a classic pirate-style wooden boat cruise along Djerba's stunning coastline. Enjoy the sea breeze, the turquoise waters, and a guided commentary on the island's maritime history. Stop for a swim in open water and cool off before heading back. Great for families.",
    image: boat,
    images: [boat, parasailing, jetski],
    durationMinutes: 90,
    durationLabel: "1 h 30",
    types: ["family", "couple"],
    active: true,
    meetingPoint: "Houmt Souk marina",
    departureLocation: "Houmt Souk marina, Djerba",
    difficulty: "Easy",
    languages: ["FR", "EN", "IT", "DE", "PL"],
    minAge: 4,
    options: [{ label: "1 h 30", price: 30 }],
    included: [
      "Life jackets",
      "Swimming stop",
      "On-board commentary",
    ],
    excluded: ["Food & drinks", "Hotel pickup"],
  },
  {
    id: "vip-boat",
    slug: "vip-boat-trip-djerba",
    category: "water",
    title: "VIP Boat Trip",
    shortDescription: "Private 3 h charter with snorkeling stop and refreshments.",
    longDescription:
      "Treat yourself to a fully private 3-hour motorboat charter. Your personal captain navigates to the most beautiful spots along the Djerba coastline. Snorkelling equipment is provided, and complimentary soft drinks and snacks are served on board. Perfect for honeymooners, celebrations, or any group wanting a premium day out.",
    image: boat,
    images: [boat, parasailing, jetski],
    durationMinutes: 180,
    durationLabel: "3 h",
    types: ["couple", "family"],
    badge: "VIP",
    featured: true,
    active: true,
    meetingPoint: "Houmt Souk marina",
    departureLocation: "Houmt Souk marina, Djerba",
    difficulty: "Easy",
    languages: ["FR", "EN", "IT", "DE", "PL"],
    minAge: 0,
    options: [{ label: "3 h private", price: 300 }],
    included: [
      "Private captain & crew",
      "Snorkelling equipment",
      "Soft drinks & snacks",
      "Life jackets",
      "Hotel pickup (Djerba zone)",
    ],
    excluded: ["Alcoholic beverages", "Underwater photography gear"],
  },
  {
    id: "sunset-boat",
    slug: "sunset-boat-djerba",
    category: "water",
    title: "Sunset Boat Trip",
    shortDescription: "Cruise into the sunset — the most romantic hour in Djerba.",
    longDescription:
      "As the sun dips toward the horizon, paint the Mediterranean sky in gold and crimson from the deck of our sunset cruiser. This 2-hour evening cruise departs around 17:30 and returns at dusk. A glass of sparkling juice is offered on board. Popular for couples, groups, and anyone who wants to end the day memorably.",
    image: boat,
    images: [boat, parasailing, jetski],
    durationMinutes: 120,
    durationLabel: "~2 h",
    types: ["couple"],
    active: true,
    meetingPoint: "Houmt Souk marina",
    departureLocation: "Houmt Souk marina, Djerba",
    difficulty: "Easy",
    languages: ["FR", "EN", "IT"],
    minAge: 0,
    options: [{ label: "Sunset cruise", price: null }],
    included: [
      "Welcome drink",
      "Life jackets",
      "Sunset route along Djerba coast",
    ],
    excluded: ["Dinner", "Hotel pickup"],
  },

  // ─── LAND ─────────────────────────────────────────────────────────────────
  {
    id: "quad",
    slug: "quad-djerba",
    category: "land",
    title: "Quad",
    shortDescription: "Off-road quad ride across palm groves and beaches.",
    longDescription:
      "Jump on one of our powerful 125cc or 250cc quad bikes and tear through Djerba's diverse landscapes — golden beaches, ancient palm groves, and dusty desert tracks. Our 1h30 circuit passes through local villages and scenic coastline viewpoints. The half-day option adds a deep-desert stretch and a Berber tea stop. Helmets, gloves, and goggles provided. No licence required.",
    image: quad,
    images: [quad, camel, horse],
    durationMinutes: 90,
    durationLabel: "1 h 30 – Half day",
    types: ["adventure", "couple"],
    badge: "Best Seller",
    featured: true,
    active: true,
    meetingPoint: "Djerba Explore area",
    departureLocation: "Djerba Explore, Zone Touristique",
    difficulty: "Moderate",
    languages: ["FR", "EN", "IT", "DE"],
    minAge: 16,
    options: [
      { label: "1 h 30", price: 30 },
      { label: "Half day", price: 60 },
    ],
    included: [
      "Helmet, gloves & goggles",
      "Safety briefing & training lap",
      "Guide escort throughout",
      "Fuel",
    ],
    excluded: [
      "Personal accident insurance",
      "Hotel pickup (available +5€)",
      "Gratuities",
    ],
  },
  {
    id: "horse",
    slug: "horse-riding-djerba",
    category: "land",
    title: "Horse Riding",
    shortDescription: "Beach ride at sunrise or sunset — beginners welcome.",
    longDescription:
      "Ride along Djerba's beautiful sandy shores on a gentle, well-trained horse. Our certified instructors cater to all levels — from total beginners to experienced riders. The 1-hour route follows the beach at a calm pace, perfect for families and couples. Early morning and late afternoon slots offer the best light and cooler temperatures.",
    image: horse,
    images: [horse, camel, quad],
    durationMinutes: 60,
    durationLabel: "1 h",
    types: ["family", "couple"],
    active: true,
    meetingPoint: "Sidi Mahrez beach",
    departureLocation: "Sidi Mahrez beach, Djerba",
    difficulty: "Easy",
    languages: ["FR", "EN", "IT"],
    minAge: 8,
    options: [{ label: "1 h", price: 15 }],
    included: [
      "Certified riding instructor",
      "Safety helmet",
      "Horse equipment & saddle",
      "Beginners welcome — no experience needed",
    ],
    excluded: ["Riding boots (bring closed-toe shoes)", "Photos"],
  },
  {
    id: "camel",
    slug: "camel-ride-djerba",
    category: "land",
    title: "Camel Ride",
    shortDescription: "Classic Djerba experience along the shoreline.",
    longDescription:
      "Experience the timeless tradition of camel riding along Djerba's iconic shoreline. Our friendly, well-cared-for dromedaries are led by experienced handlers who ensure a safe and enjoyable experience. A 1-hour ride covers the beach and palm grove trail — a must-do cultural experience for all ages.",
    image: camel,
    images: [camel, horse, quad],
    durationMinutes: 60,
    durationLabel: "1 h",
    types: ["family", "kids"],
    active: true,
    meetingPoint: "Sidi Mahrez beach",
    departureLocation: "Sidi Mahrez beach, Djerba",
    difficulty: "Easy",
    languages: ["FR", "EN", "IT", "DE", "PL"],
    minAge: 4,
    options: [{ label: "1 h", price: 20 }],
    included: [
      "Experienced handler escort",
      "Traditional saddle & blanket",
      "All ages and abilities welcome",
    ],
    excluded: ["Photography service", "Hotel pickup"],
  },

  // ─── EXCURSIONS ───────────────────────────────────────────────────────────
  {
    id: "tour-djerba",
    slug: "tour-ile-djerba",
    category: "excursions",
    title: "Tour de l'île de Djerba",
    shortDescription: "Full day discovering Houmt Souk, El Ghriba, Guellala and more.",
    longDescription:
      "Djerba is a treasure trove of culture, history, and beauty — and this full-day island tour reveals it all. From the ancient Roman road and the famous El Ghriba synagogue to the potters' village of Guellala and the bustling Houmt Souk market, you'll experience the island's soul. A traditional Tunisian lunch is included mid-day, and your guide provides fascinating historical commentary throughout.",
    image: excursionDjerba,
    images: [excursionDjerba, boat, camel],
    durationMinutes: 480,
    durationLabel: "Full day",
    types: ["family", "couple"],
    badge: "Culture",
    active: true,
    meetingPoint: "Your hotel lobby",
    departureLocation: "Hotel pickup across Djerba",
    difficulty: "Easy",
    languages: ["FR", "EN", "IT", "DE", "PL"],
    minAge: 0,
    options: [{ label: "Full day", price: null }],
    included: [
      "Hotel pickup & drop-off",
      "Air-conditioned minibus",
      "Licensed multilingual guide",
      "Houmt Souk market visit",
      "Guellala Pottery Village",
      "Traditional Tunisian lunch",
      "El Ghriba synagogue entry",
    ],
    excluded: [
      "Personal shopping",
      "Drinks beyond lunch",
      "Tips for guide & driver",
    ],
    itinerary: [
      {
        day: 1,
        title: "Tour de l'île de Djerba",
        steps: [
          {
            time: "08:30",
            label: "Hotel Pickup",
            description: "Your guide meets you at your hotel lobby. Board the air-conditioned minibus.",
          },
          {
            time: "09:15",
            label: "Roman Road & Coastal Viewpoint",
            description: "Drive along the ancient Roman paved road connecting the island to the mainland — a 2,000-year-old marvel still in use today.",
          },
          {
            time: "10:30",
            label: "Guellala Pottery Village",
            description: "Visit artisan workshops where local potters craft terracotta using techniques unchanged for centuries. Browse and purchase authentic pieces.",
          },
          {
            time: "12:30",
            label: "Houmt Souk Market & Lunch",
            description: "Explore the lively medina market, then sit down to a traditional Tunisian lunch featuring fresh fish, harissa, and Djerba pastries.",
          },
          {
            time: "15:00",
            label: "Fadhloun Mosque & El Ghriba Synagogue",
            description: "Visit two of Djerba's most iconic religious sites — the photogenic Fadhloun Mosque and the El Ghriba, one of the oldest synagogues in the world.",
          },
          {
            time: "17:00",
            label: "Return to Hotel",
            description: "Comfortable ride back to your hotel, arriving before evening.",
          },
        ],
      },
    ],
  },
  {
    id: "ksar-1d",
    slug: "ksar-ghilane-day-trip",
    category: "excursions",
    title: "Ksar Ghilane Day Trip",
    shortDescription: "One-day Sahara escape: oasis, dunes and hot spring.",
    longDescription:
      "An epic one-day journey from Djerba into the heart of the Tunisian Sahara. Your adventure begins with an early departure in a 4×4 convoy, crossing the desert gate at Douz before arriving at the legendary Ksar Ghilane oasis — a natural hot spring pool set among towering sand dunes. Swim, ride camels or quads in the dunes, enjoy a Bedouin lunch under a tent, and be back at your hotel before nightfall.",
    image: ksar1d,
    images: [ksar1d, ksar2d, excursionDjerba],
    durationMinutes: 720,
    durationLabel: "1 day",
    types: ["adventure", "couple"],
    badge: "Desert Adventure",
    active: true,
    meetingPoint: "Your hotel lobby",
    departureLocation: "Hotel pickup across Djerba",
    difficulty: "Moderate",
    languages: ["FR", "EN", "IT", "DE"],
    minAge: 8,
    options: [{ label: "1 day", price: null }],
    included: [
      "Hotel pickup & drop-off",
      "4×4 convoy transport",
      "Licensed desert guide",
      "Ksar Ghilane hot spring swim",
      "Bedouin lunch in desert tent",
      "Camel or quad ride (30 min)",
    ],
    excluded: [
      "Personal drinks & snacks beyond lunch",
      "Tips",
      "Optional quad upgrade (payable on site)",
    ],
    itinerary: [
      {
        day: 1,
        title: "Ksar Ghilane Day Trip",
        steps: [
          {
            time: "07:00",
            label: "Early Departure from Djerba",
            description: "Pickup from your hotel in an air-conditioned 4×4. Journey south through Tunisian landscapes.",
          },
          {
            time: "09:30",
            label: "Desert Gate at Douz",
            description: "Arrive at the gateway to the Sahara. Here the asphalt ends and the sand dunes begin. Switch to off-road mode.",
          },
          {
            time: "11:30",
            label: "Swim in Ksar Ghilane Hot Spring",
            description: "Arrive at the legendary oasis. Plunge into the warm natural hot spring pool surrounded by towering golden dunes.",
          },
          {
            time: "13:00",
            label: "Bedouin Lunch",
            description: "A traditional Tunisian lunch served in an authentic Bedouin tent — couscous, merguez, fresh salads, and Saharan mint tea.",
          },
          {
            time: "14:30",
            label: "Camel or Quad Ride in the Dunes",
            description: "Choose your desert adventure — a slow, majestic camel ride or an exhilarating quad blast across the dunes.",
          },
          {
            time: "18:30",
            label: "Arrival Back at Hotel",
            description: "Return journey across the desert, arriving at your Djerba hotel in time for dinner.",
          },
        ],
      },
    ],
  },
  {
    id: "ksar-2d",
    slug: "ksar-ghilane-2-days",
    category: "excursions",
    title: "Ksar Ghilane 2 Days",
    shortDescription: "Two-day desert adventure with Berber camp overnight.",
    longDescription:
      "The ultimate Sahara experience — two full days and a magical night under the stars in a traditional Berber desert camp. Day 1 follows the same epic route to Ksar Ghilane, then as the sun sets over the dunes you'll gather around a campfire for a starlit dinner. Day 2 brings a sunrise camel trek, breakfast in the desert, and a leisurely drive back. An unforgettable adventure for all ages.",
    image: ksar2d,
    images: [ksar2d, ksar1d, excursionDjerba],
    durationMinutes: 2880,
    durationLabel: "2 days",
    types: ["adventure", "couple"],
    badge: "Overnight",
    featured: true,
    active: true,
    meetingPoint: "Your hotel lobby",
    departureLocation: "Hotel pickup across Djerba",
    difficulty: "Moderate",
    languages: ["FR", "EN", "IT", "DE", "PL"],
    minAge: 10,
    options: [{ label: "2 days", price: null }],
    included: [
      "Hotel pickup & drop-off",
      "4×4 transport (both days)",
      "Licensed desert guide",
      "Ksar Ghilane hot spring",
      "Bedouin lunch (Day 1)",
      "Berber camp overnight stay",
      "Campfire dinner under the stars",
      "Sunrise camel trek",
      "Desert breakfast (Day 2)",
    ],
    excluded: [
      "Personal alcoholic beverages",
      "Tips",
      "Travel insurance",
      "Charging cables (limited electricity at camp)",
    ],
    itinerary: [
      {
        day: 1,
        title: "Day 1 — Journey into the Sahara",
        steps: [
          {
            time: "07:00",
            label: "Departure from Djerba",
            description: "Early pickup from your hotel in a 4×4 convoy. The adventure begins.",
          },
          {
            time: "09:30",
            label: "Desert Gate at Douz",
            description: "Cross the threshold into the Sahara — tarmac gives way to golden sand.",
          },
          {
            time: "11:30",
            label: "Ksar Ghilane Hot Spring",
            description: "Swim in the warm natural oasis pool, surrounded by towering dunes.",
          },
          {
            time: "13:00",
            label: "Bedouin Lunch",
            description: "Traditional Tunisian feast in a desert tent — couscous, grilled meats, and mint tea.",
          },
          {
            time: "15:00",
            label: "Quad & Camel Ride in the Dunes",
            description: "Free time to explore the dunes by quad or camel.",
          },
          {
            time: "18:00",
            label: "Check-in to Berber Desert Camp",
            description: "Settle into your traditional Berber tent — lanterns, rugs, and all the ambiance of the Sahara.",
          },
          {
            time: "20:30",
            label: "Campfire Dinner Under the Stars",
            description: "Gather around the fire for a Berber dinner as the Milky Way appears overhead.",
          },
        ],
      },
      {
        day: 2,
        title: "Day 2 — Sunrise & Return",
        steps: [
          {
            time: "06:00",
            label: "Sunrise Camel Trek",
            description: "Rise before dawn and ride into the dunes to watch the Sahara sun rise in silence.",
          },
          {
            time: "08:00",
            label: "Desert Breakfast",
            description: "Fresh bread, olive oil, honey, cheese and coffee served at camp.",
          },
          {
            time: "09:30",
            label: "Visit Ksar Ghilane Ruins",
            description: "Explore the ancient Roman fort ruins at the edge of the oasis.",
          },
          {
            time: "11:00",
            label: "Return Journey Begins",
            description: "Load up the 4×4s and head north through the desert back toward Djerba.",
          },
          {
            time: "15:00",
            label: "Arrival at Hotel",
            description: "Return to your hotel with memories that will last a lifetime.",
          },
        ],
      },
    ],
  },
];

interface ActivitiesContextValue {
  activities: Activity[];
  setActivities: (a: Activity[]) => void;
  upsert: (a: Activity) => void;
  remove: (id: string) => void;
  reset: () => void;
}

const ActivitiesContext = createContext<ActivitiesContextValue | null>(null);

export function ActivitiesProvider({ children }: { children: ReactNode }) {
  const [activities, setActivitiesState] = useState<Activity[]>(SEED);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { version: number; data: Activity[] };
        if (parsed.version === SEED_VERSION && Array.isArray(parsed.data)) {
          setActivitiesState(parsed.data);
        }
      }
    } catch {}
  }, []);

  const persist = (data: Activity[]) => {
    setActivitiesState(data);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: SEED_VERSION, data }));
    } catch {}
  };

  const value = useMemo<ActivitiesContextValue>(() => ({
    activities,
    setActivities: persist,
    upsert: (a) => {
      const idx = activities.findIndex((x) => x.id === a.id);
      const next = idx >= 0 ? activities.map((x) => (x.id === a.id ? a : x)) : [...activities, a];
      persist(next);
    },
    remove: (id) => persist(activities.filter((a) => a.id !== id)),
    reset: () => persist(SEED),
  }), [activities]);

  return <ActivitiesContext.Provider value={value}>{children}</ActivitiesContext.Provider>;
}

export function useActivities() {
  const ctx = useContext(ActivitiesContext);
  if (!ctx) throw new Error("useActivities must be used within ActivitiesProvider");
  return ctx;
}

/** Cheapest numeric price across options; null if all options are price-on-request. */
export function startingPrice(a: Activity): number | null {
  const numeric = a.options.map((o) => o.price).filter((p): p is number => typeof p === "number");
  return numeric.length ? Math.min(...numeric) : null;
}
