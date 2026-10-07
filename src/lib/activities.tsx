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
  difficulty?: Difficulty;
  languages?: string[];
  minAge?: number;
  included: string[];
  excluded: string[];
  itinerary?: ItineraryDay[]; // only for excursions
}

/** Content is versioned so we can migrate stored copies later. */
const SEED_VERSION = 12;
const STORAGE_KEY = "djfun.activities.v12";

const SEED: Activity[] = [
  // ─── WATER ────────────────────────────────────────────────────────────────
  {
    id: "banana",
    slug: "banana-boat-djerba",
    category: "water",
    title: "Banana Boat",
    shortDescription: "Fun-packed ride perfect for friends and family.",
    longDescription:
      "Enjoy a fun and exciting ride on the Mediterranean Sea with our Banana Boat experience. Pulled by a speedboat along the coast of Djerba, you’ll experience the thrill of the waves, splashes, and turns while sharing a memorable moment with family or friends. No previous experience is required. Our team provides the necessary safety equipment and instructions before the ride, ensuring a safe and enjoyable experience for everyone.",
    image: banana,
    images: [banana, jetski, boat],
    durationMinutes: 15,
    durationLabel: "15 min",
    types: ["family", "kids"],
    active: true,
    meetingPoint: "Sidi Mahrez beach",
    difficulty: "Easy",
    languages: ["FR", "EN", "IT"],
    minAge: 6,
    options: [{ label: "15 min", price: 15 }],
    included: [
      "Life jackets for all riders",
      "Safety briefing",
      "Minimum 4 personnes",
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
      "Glide across the Mediterranean waters of Djerba on our Sofa Ride. Towed by a speedboat, enjoy the sensation of moving effortlessly over the waves while feeling the speed and energy of the sea around you. Whether you’re looking for a shared experience with friends or a memorable activity with family, the Sofa Ride offers a unique way to enjoy the open water and discover the coastline from a different perspective.",
    image: banana,
    images: [banana, jetski, boat],
    durationMinutes: 0,
    durationLabel: "",
    types: ["family", "adventure"],
    active: true,
    meetingPoint: "Sidi Mahrez beach",
    difficulty: "Easy",
    languages: ["FR", "EN", "IT", "DE"],
    minAge: 8,
    options: [{ label: "Sofa Ride", price: 15 }],
    included: ["Life jackets", "Safety briefing", "Minimum 2 personnes"],
    excluded: ["Swimwear", "Personal photography"],
  },
  {
    id: "boat-trip",
    slug: "boat-trip-djerba",
    category: "water",
    title: "Boat Trip",
    shortDescription: "Boat excursion along the coast to discover dolphins and the lagoon.",
    longDescription:
      "Join us on a 1.5-hour boat excursion to discover the natural beauty of Djerba's coastline. Cruise along the sea in search of dolphins and admire the elegant flamingos that can often be seen in their natural habitat.\nDuring the trip, enjoy breathtaking coastal views and a relaxing swimming stop at the lagoon, where you can take a refreshing dip in the crystal-clear waters.\nA perfect experience for families, couples, and friends looking to combine nature, relaxation, and unforgettable moments at sea.",
    image: boat,
    images: [boat, parasailing, jetski],
    durationMinutes: 90,
    durationLabel: "1 h 30",
    types: ["family", "couple", "kids"],
    active: true,
    meetingPoint: "Houmt Souk marina",
    difficulty: "Easy",
    languages: ["FR", "EN", "IT", "DE", "PL"],
    minAge: 1,
    options: [
      { label: "Adult (Adulte)", price: 30 },
      { label: "Kids (Enfant)", price: 15 },
    ],
    included: [
      "Tarifs : 30€ adult / 15€ kids (All ages welcome, baby <= 1)",
      "Life jackets",
      "Swimming stop at the lagoon",
      "Dolphin & flamingo watching",
    ],
    excluded: ["Food & drinks", "Hotel pickup"],
  },
  {
    id: "sunset-boat",
    slug: "sunset-boat-djerba",
    category: "water",
    title: "Sunset Boat Trip",
    shortDescription: "Cruise into the sunset through the lagoon — romantic and peaceful.",
    longDescription:
      "Experience the beauty of Djerba at sunset with a relaxing boat trip through the lagoon. As the sun goes down, enjoy the warm colors of the sky reflected on the calm waters and take in the peaceful surroundings. This experience can be enjoyed privately with your family or as part of a small group, making it perfect for couples, families, and friends looking for a quiet and memorable moment on the water. A beautiful way to end the day and enjoy the natural beauty of Djerba’s lagoon.",
    image: boat,
    images: [boat, parasailing, jetski],
    durationMinutes: 90,
    durationLabel: "1 h 30",
    types: ["couple", "family"],
    active: true,
    meetingPoint: "Houmt Souk marina",
    difficulty: "Easy",
    languages: ["FR", "EN", "IT"],
    minAge: 1,
    options: [
      { label: "Adult (Adulte)", price: 30 },
      { label: "Kids (Enfant)", price: 15 },
    ],
    included: [
      "Tarifs : 30€ adult / 15€ kids (1h30 sunset tour)",
      "Welcome drink",
      "Life jackets",
      "Sunset route along Djerba lagoon",
    ],
    excluded: ["Dinner", "Hotel pickup"],
  },
  {
    id: "jetski",
    slug: "jet-ski-djerba",
    category: "water",
    title: "Jet Ski",
    shortDescription: "Feel the rush of the open sea on a solo or tandem jet ski.",
    longDescription:
      "Discover the excitement of Jet Skiing in the crystal-clear waters of Djerba. Whether you're looking for adventure, speed, or simply a unique way to enjoy the Mediterranean Sea, this experience is perfect for you. No previous experience is required. Choose between a 15 or 30-minute Jet Ski ride directly in front of our station, ideal for enjoying the thrill of the open water at your own pace. For a more immersive experience, join our 1.5-hour guided Jet Ski tour along the beautiful Djerba coastline. Discover the coast from the sea, with the opportunity to encounter dolphins in their natural environment, followed by a relaxing stop at the lagoon to enjoy its clear waters and peaceful surroundings. Whether you choose a short ride or a guided excursion, enjoy a safe and memorable experience on the Mediterranean Sea.",
    image: jetski,
    images: [jetski, parasailing, banana],
    durationMinutes: 30,
    durationLabel: "15 min – 1 h 30",
    types: ["adventure", "couple"],
    badge: "Best seller",
    featured: true,
    active: true,
    meetingPoint: "Sidi Mahrez beach",
    difficulty: "Moderate",
    languages: ["FR", "EN", "IT", "DE", "PL"],
    minAge: 16,
    options: [
      { label: "15 min", price: 30 },
      { label: "30 min", price: 50 },
      { label: "Trip to Laguna 1h30", price: 90 },
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
    id: "catamaran-dolphin",
    slug: "catamaran-dolphin-cruise-djerba",
    category: "water",
    title: "Catamaran Dolphin Cruise",
    shortDescription: "2-hour catamaran cruise along the coast of Djerba in search of dolphins.",
    longDescription:
      "Enjoy a 2-hour catamaran adventure along the coast of Djerba. Sail across the turquoise waters in search of dolphins and admire the island from a unique perspective.\n\nThe excursion includes a 30-minute swimming stop offshore and complimentary soft drinks on board.\n\nDeparture times: 10:00 AM & 2:00 PM.\n\nA relaxing and unforgettable sea experience for all ages.",
    image: boat,
    images: [boat, parasailing, jetski],
    durationMinutes: 120,
    durationLabel: "2 h",
    types: ["family", "couple", "kids"],
    featured: true,
    active: true,
    meetingPoint: "Sidi Mahrez beach",
    difficulty: "Easy",
    languages: ["FR", "EN", "IT", "DE", "PL"],
    minAge: 0,
    options: [{ label: "2 h", price: 35 }],
    included: [
      "Complimentary soft drinks on board",
      "Sécurité à bord : Gilets de sauvetage pour tous les passagers",
      "Bouées de sécurité",
      "Présence d’un maître-nageur sauveteur",
    ],
    excluded: ["Hotel pickup", "Alcoholic beverages"],
  },
  {
    id: "parasailing",
    slug: "parasailing-djerba",
    category: "water",
    title: "Parasailing",
    shortDescription: "Fly above the turquoise sea and enjoy an unbeatable view of Djerba.",
    longDescription:
      "Enjoy the freedom of flying above the Mediterranean with our boat-towed parasailing experience. Sit back, relax, and let our professional team take care of everything while you enjoy the stunning views of Djerba’s coastline from the air. Our spacious parasailing boat is powered by two 200 HP Yamaha engines, offering a comfortable and reliable experience on the water. No previous experience is required — simply enjoy the flight, the sea breeze, and the panoramic views. Friends and family are also welcome to come along and watch the experience from the boat for €10 per person. Fly, relax, and enjoy Djerba from a whole new perspective.",
    image: parasailing,
    images: [parasailing, jetski, boat],
    durationMinutes: 20,
    durationLabel: "~20 min flight",
    types: ["couple", "adventure"],
    badge: "Iconic",
    featured: true,
    active: true,
    meetingPoint: "Sidi Mahrez beach",
    difficulty: "Easy",
    languages: ["FR", "EN", "IT", "DE", "PL"],
    minAge: 3,
    options: [{ label: "1 flight", price: 40 }],
    included: [
      "Full harness & safety equipment",
      "Certified crew",
      "Photo from the boat (on request)",
    ],
    excluded: [
      "Personal aerial photography",
      "Hotel transfer",
    ],
  },
  {
    id: "water-ski-wakeboard",
    slug: "water-ski-wakeboard-djerba",
    category: "water",
    title: "Water Ski & Wakeboard",
    shortDescription: "Experience the thrill of gliding across the Mediterranean behind a speedboat.",
    longDescription:
      "Experience the thrill of gliding across the Mediterranean with a 30-minute Water Ski or Wakeboard session. Get pulled behind the boat, feel the speed of the water, and enjoy an exciting ride along the coast of Djerba.\n\nWhether you are trying it for the first time or already have experience, our team will provide the necessary guidance and equipment for a safe and enjoyable session.",
    image: boat,
    images: [boat, jetski, parasailing],
    durationMinutes: 30,
    durationLabel: "30 min",
    types: ["adventure", "couple"],
    active: true,
    meetingPoint: "Sidi Mahrez beach",
    difficulty: "Moderate",
    languages: ["FR", "EN", "IT", "DE", "PL"],
    minAge: 10,
    options: [{ label: "30 min", price: 50 }],
    included: [
      "Water Ski or Wakeboard equipment",
      "Life jacket & safety briefing",
      "Professional boat driver & instructor",
      "Fuel included",
    ],
    excluded: ["Swimwear", "Personal photography"],
  },
  {
    id: "scuba-diving",
    slug: "scuba-diving-djerba",
    category: "water",
    title: "Scuba Diving Experience in Djerba",
    shortDescription: "Discover the underwater world of Djerba with a qualified instructor.",
    longDescription:
      "Discover the underwater world of Djerba with an unforgettable scuba diving experience, accompanied by a qualified instructor.\n\nHow the Activity Works:\n\n• Equipment Preparation\nYour diving equipment is prepared before the activity.\n\n• Safety Briefing\nYour instructor will explain the basics of scuba diving, essential techniques, and safety instructions before your dive.\n\n• Boat Trip\nBoard the boat and head to the selected diving site off the coast of Djerba.\n\n• Scuba Dive\nExplore the underwater world of Djerba with your instructor in complete safety. The dive lasts approximately 30 to 50 minutes, depending on your breathing and air consumption underwater.\n\n• Return\nAfter your underwater adventure, return by boat and enjoy an unforgettable experience discovering the marine life and underwater landscapes of Djerba.",
    image: boat,
    images: [boat, parasailing, jetski],
    durationMinutes: 120,
    durationLabel: "2 h",
    types: ["adventure", "couple"],
    featured: true,
    active: true,
    meetingPoint: "Sidi Mahrez beach",
    difficulty: "Moderate",
    languages: ["FR", "EN", "IT", "DE", "PL"],
    minAge: 10,
    options: [{ label: "2 h", price: 50 }],
    included: [
      "Full scuba diving equipment",
      "Qualified instructor accompaniment",
      "Safety briefing & boat trip to diving site",
      "30 to 50 min underwater dive",
    ],
    excluded: ["Personal underwater photography", "Hotel pickup"],
  },
  {
    id: "vip-boat",
    slug: "vip-boat-trip-djerba",
    category: "water",
    title: "VIP Boat Trip",
    shortDescription: "Private charter along the coast with dolphin watching and lagoon swim.",
    longDescription:
      "Enjoy a private boat trip along the beautiful coastline of Djerba, perfect for families and groups of friends. Cruise comfortably aboard our spacious boat, powered by two 200 HP Yamaha engines, and discover the island from the sea. During the trip, explore the coastline, enjoy the open sea, and keep an eye out for dolphins in their natural environment. The excursion also includes a swimming stop at the lagoon, where you can relax, swim, and enjoy the crystal-clear waters. A private and relaxing experience, ideal for sharing unforgettable moments at sea with your family or friends.",
    image: boat,
    images: [boat, parasailing, jetski],
    durationMinutes: 180,
    durationLabel: "3 h",
    types: ["couple", "family"],
    badge: "VIP",
    featured: true,
    active: true,
    meetingPoint: "Houmt Souk marina",
    difficulty: "Easy",
    languages: ["FR", "EN", "IT", "DE", "PL"],
    minAge: 0,
    options: [{ label: "3 h private", price: 300 }],
    included: [
      "Private captain & crew",
      "Soft drinks & snacks",
      "Life jackets",
      "Hotel pickup (Djerba zone)",
    ],
    excluded: ["Alcoholic beverages", "Underwater photography gear"],
  },

  // ─── LAND ─────────────────────────────────────────────────────────────────
  {
    id: "camel",
    slug: "camel-ride-djerba",
    category: "land",
    title: "Camel Ride",
    shortDescription: "1-hour sunset camel ride along the beautiful beaches of Djerba.",
    longDescription:
      "Discover Djerba in a unique and traditional way with a 1-hour camel ride along the island’s beautiful beaches.\n\nAfter a short introduction and safety briefing, set off with an experienced local guide and enjoy a peaceful ride along the sandy shores as the sun slowly sets over the sea.\n\nTake in the beautiful coastal scenery, feel the gentle rhythm of the camel and enjoy the warm colors of the sunset over the Mediterranean.\n\nPerfect for families, couples and travelers looking for an authentic and relaxing experience, this camel ride offers a memorable way to discover the natural beauty of Djerba at sunset.",
    image: camel,
    images: [camel, horse, quad],
    durationMinutes: 60,
    durationLabel: "1 h",
    types: ["family", "kids"],
    active: true,
    meetingPoint: "Sidi Mahrez beach",
    difficulty: "Easy",
    languages: ["FR", "EN", "IT", "DE", "PL"],
    minAge: 4,
    options: [{ label: "1 h", price: 15 }],
    included: [
      "Experienced local guide escort",
      "Traditional saddle & equipment",
      "Safety briefing",
      "Sunset coastal route",
    ],
    excluded: ["Photography service", "Hotel pickup"],
  },
  {
    id: "horse",
    slug: "horse-riding-djerba",
    category: "land",
    title: "Horse Riding",
    shortDescription: "1-hour sunset horseback ride along Djerba's sandy shores.",
    longDescription:
      "Discover the beauty of Djerba on horseback with a 1-hour sunset ride along the island’s beautiful beaches.\n\nAfter a short safety briefing, set off with an experienced local guide and enjoy a peaceful ride along the sandy shores as the sun slowly sets over the sea.\n\nTake in the stunning views, feel the sea breeze and enjoy the magical colors of the sunset while riding along the beaches of Djerba.\n\nPerfect for couples, families and anyone looking for a relaxing and memorable experience, this horseback ride offers a unique way to discover the natural beauty of Djerba at sunset.",
    image: horse,
    images: [horse, camel, quad],
    durationMinutes: 60,
    durationLabel: "1 h",
    types: ["family", "couple"],
    active: true,
    meetingPoint: "Sidi Mahrez beach",
    difficulty: "Easy",
    languages: ["FR", "EN", "IT"],
    minAge: 8,
    options: [{ label: "1 h", price: 20 }],
    included: [
      "Experienced local guide",
      "Safety helmet & equipment",
      "Horse equipment & saddle",
      "Sunset beach ride",
    ],
    excluded: ["Riding boots (bring closed-toe shoes)", "Photos"],
  },
  {
    id: "quad",
    slug: "quad-djerba",
    category: "land",
    title: "Quad",
    shortDescription: "1.5-hour quad bike adventure towards Djerba's famous lagoon.",
    longDescription:
      "Discover Djerba from a different perspective with this 1.5-hour quad bike adventure towards the famous lagoon.\n\nCombining adrenaline, nature and local discovery, this experience is perfect for travelers looking for an exciting adventure while keeping plenty of time to enjoy the rest of their day in Djerba.\n\nYour adventure begins with a safety briefing before setting off with a local guide through a variety of landscapes, including sandy trails, beaches, dunes and the beautiful lagoon.\n\nAlong the way, enjoy a relaxing break at the lagoon to take in the scenery, capture some photos and enjoy the peaceful surroundings.\n\nThis 1.5-hour adventure is the perfect balance of excitement, discovery and relaxation — ideal for anyone who wants to experience the natural beauty of Djerba in a short but unforgettable excursion.",
    image: quad,
    images: [quad, camel, horse],
    durationMinutes: 90,
    durationLabel: "1 h 30",
    types: ["adventure", "couple"],
    badge: "Best Seller",
    featured: true,
    active: true,
    meetingPoint: "Djerba Explore area",
    difficulty: "Moderate",
    languages: ["FR", "EN", "IT", "DE"],
    minAge: 16,
    options: [{ label: "1 h 30", price: 30 }],
    included: [
      "30€ per quad",
      "Helmet, gloves & goggles",
      "Safety briefing & training lap",
      "Local guide escort throughout",
      "Fuel included",
      "Relaxing break at the lagoon",
    ],
    excluded: [
      "Personal accident insurance",
      "Hotel pickup (available +5€)",
      "Gratuities",
    ],
  },
  {
    id: "buggy",
    slug: "buggy-djerba",
    category: "land",
    title: "Buggy",
    shortDescription: "1.5-hour buggy adventure through Djerba's beautiful landscapes.",
    longDescription:
      "Discover Djerba in an exciting way with this 1.5-hour buggy adventure through the island’s beautiful landscapes.\n\nAfter a short safety briefing, set off with an experienced local guide and explore sandy tracks, coastal paths and the natural surroundings of Djerba.\n\nEnjoy the thrill of driving a buggy while discovering the island away from the usual tourist routes. Along the way, take a short break to admire the scenery and capture some memorable photos.\n\nPerfect for adventure seekers, couples and friends, this 1.5-hour buggy experience combines fun, adrenaline and discovery in a unique Djerba adventure.",
    image: quad,
    images: [quad, camel, horse],
    durationMinutes: 90,
    durationLabel: "1 h 30",
    types: ["adventure", "couple", "family"],
    featured: true,
    active: true,
    meetingPoint: "Djerba Explore area",
    difficulty: "Moderate",
    languages: ["FR", "EN", "IT", "DE"],
    minAge: 16,
    options: [{ label: "1 h 30", price: 60 }],
    included: [
      "60€ per buggy",
      "Safety equipment & goggles",
      "Safety briefing",
      "Experienced local guide",
      "Fuel included",
    ],
    excluded: ["Personal accident insurance", "Hotel pickup", "Gratuities"],
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
