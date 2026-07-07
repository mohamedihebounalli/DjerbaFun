import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import jetski from "@/assets/act-jetski.jpg";
import banana from "@/assets/act-banana.jpg";
import parasailing from "@/assets/act-parasailing.jpg";
import boat from "@/assets/act-boat.jpg";
import quad from "@/assets/act-quad.jpg";
import camel from "@/assets/act-camel.jpg";
import horse from "@/assets/act-horse.jpg";

export type Category = "water" | "land" | "excursions";
export type ActivityType = "family" | "adventure" | "couple" | "kids";

export interface PriceOption {
  label: string;
  price: number | null; // null = price on request
}

export interface Activity {
  id: string;
  slug: string;
  category: Category;
  title: string;
  shortDescription: string;
  image: string;
  durationMinutes: number; // approximate for filtering
  durationLabel: string;
  types: ActivityType[];
  options: PriceOption[];
  badge?: string;
  featured?: boolean;
  active: boolean;
  meetingPoint?: string;
}

/** Content is versioned so we can migrate stored copies later. */
const SEED_VERSION = 1;
const STORAGE_KEY = "djfun.activities.v1";

const SEED: Activity[] = [
  {
    id: "jetski",
    slug: "jet-ski-djerba",
    category: "water",
    title: "Jet Ski",
    shortDescription: "Feel the rush of the open sea on a solo or tandem jet ski.",
    image: jetski,
    durationMinutes: 30,
    durationLabel: "15 min – 1 h 30",
    types: ["adventure", "couple"],
    badge: "Best seller",
    featured: true,
    active: true,
    meetingPoint: "Sidi Mahrez beach",
    options: [
      { label: "15 min", price: 30 },
      { label: "30 min", price: 50 },
      { label: "Safari 1 h 30", price: 90 },
    ],
  },
  {
    id: "banana",
    slug: "banana-boat-djerba",
    category: "water",
    title: "Banana Boat",
    shortDescription: "Fun-packed ride perfect for friends and family.",
    image: banana,
    durationMinutes: 15,
    durationLabel: "15 min",
    types: ["family", "kids"],
    active: true,
    meetingPoint: "Sidi Mahrez beach",
    options: [{ label: "15 min", price: 15 }],
  },
  {
    id: "sofa",
    slug: "sofa-ride-djerba",
    category: "water",
    title: "Sofa Ride",
    shortDescription: "Hold tight on this bouncy inflatable towed by a speedboat.",
    image: banana,
    durationMinutes: 15,
    durationLabel: "15 min",
    types: ["family", "adventure"],
    active: true,
    meetingPoint: "Sidi Mahrez beach",
    options: [{ label: "15 min", price: 15 }],
  },
  {
    id: "parasailing",
    slug: "parasailing-djerba",
    category: "water",
    title: "Parasailing",
    shortDescription: "Fly above the turquoise sea and enjoy an unbeatable view of Djerba.",
    image: parasailing,
    durationMinutes: 20,
    durationLabel: "~20 min flight",
    types: ["couple", "adventure"],
    badge: "Iconic",
    featured: true,
    active: true,
    meetingPoint: "Sidi Mahrez beach",
    options: [{ label: "1 flight", price: 40 }],
  },
  {
    id: "boat-trip",
    slug: "boat-trip-djerba",
    category: "water",
    title: "Boat Trip",
    shortDescription: "Traditional pirate boat ride along the coast.",
    image: boat,
    durationMinutes: 90,
    durationLabel: "1 h 30",
    types: ["family", "couple"],
    active: true,
    meetingPoint: "Houmt Souk marina",
    options: [{ label: "1 h 30", price: 30 }],
  },
  {
    id: "vip-boat",
    slug: "vip-boat-trip-djerba",
    category: "water",
    title: "VIP Boat Trip",
    shortDescription: "Private 3 h charter with snorkeling stop and refreshments.",
    image: boat,
    durationMinutes: 180,
    durationLabel: "3 h",
    types: ["couple", "family"],
    badge: "VIP",
    featured: true,
    active: true,
    meetingPoint: "Houmt Souk marina",
    options: [{ label: "3 h private", price: 300 }],
  },
  {
    id: "sunset-boat",
    slug: "sunset-boat-djerba",
    category: "water",
    title: "Sunset Boat Trip",
    shortDescription: "Cruise into the sunset — the most romantic hour in Djerba.",
    image: boat,
    durationMinutes: 120,
    durationLabel: "~2 h",
    types: ["couple"],
    active: true,
    meetingPoint: "Houmt Souk marina",
    options: [{ label: "Sunset cruise", price: null }],
  },
  {
    id: "quad",
    slug: "quad-djerba",
    category: "land",
    title: "Quad",
    shortDescription: "Off-road quad ride across palm groves and beaches.",
    image: quad,
    durationMinutes: 90,
    durationLabel: "1 h 30 – Half day",
    types: ["adventure", "couple"],
    badge: "Adventure",
    featured: true,
    active: true,
    meetingPoint: "Djerba Explore area",
    options: [
      { label: "1 h 30", price: 30 },
      { label: "Half day", price: 60 },
    ],
  },
  {
    id: "horse",
    slug: "horse-riding-djerba",
    category: "land",
    title: "Horse Riding",
    shortDescription: "Beach ride at sunrise or sunset — beginners welcome.",
    image: horse,
    durationMinutes: 60,
    durationLabel: "1 h",
    types: ["family", "couple"],
    active: true,
    meetingPoint: "Sidi Mahrez beach",
    options: [{ label: "1 h", price: 15 }],
  },
  {
    id: "camel",
    slug: "camel-ride-djerba",
    category: "land",
    title: "Camel Ride",
    shortDescription: "Classic Djerba experience along the shoreline.",
    image: camel,
    durationMinutes: 60,
    durationLabel: "1 h",
    types: ["family", "kids"],
    active: true,
    meetingPoint: "Sidi Mahrez beach",
    options: [{ label: "1 h", price: 20 }],
  },
  {
    id: "tour-djerba",
    slug: "tour-ile-djerba",
    category: "excursions",
    title: "Tour of Djerba Island",
    shortDescription: "Full day discovering Houmt Souk, El Ghriba, Guellala and more.",
    image: boat,
    durationMinutes: 480,
    durationLabel: "Full day",
    types: ["family", "couple"],
    active: true,
    options: [{ label: "Full day", price: null }],
  },
  {
    id: "ksar-1d",
    slug: "ksar-ghilane-day-trip",
    category: "excursions",
    title: "Ksar Ghilane Day Trip",
    shortDescription: "One-day Sahara escape: oasis, dunes and hot spring.",
    image: quad,
    durationMinutes: 720,
    durationLabel: "1 day",
    types: ["adventure", "couple"],
    active: true,
    options: [{ label: "1 day", price: null }],
  },
  {
    id: "ksar-2d",
    slug: "ksar-ghilane-2-days",
    category: "excursions",
    title: "Ksar Ghilane 2 Days",
    shortDescription: "Two-day desert adventure with Berber camp overnight.",
    image: camel,
    durationMinutes: 2880,
    durationLabel: "2 days",
    types: ["adventure", "couple"],
    badge: "Overnight",
    active: true,
    options: [{ label: "2 days", price: null }],
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
