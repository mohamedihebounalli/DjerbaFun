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
const SEED_VERSION = 14;
const STORAGE_KEY = "djfun.activities.v14";

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
      "Enjoy a 2-hour catamaran adventure along the coast of Djerba. Sail across the turquoise waters in search of dolphins and admire the island from a unique perspective.\nThe excursion includes a 30-minute swimming stop offshore and complimentary soft drinks on board.\nDeparture times: 10:00 AM & 2:00 PM.\nA relaxing and unforgettable sea experience for all ages.",
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
      "Discover the underwater world of Djerba with an unforgettable scuba diving experience, accompanied by a qualified instructor.\nHow the Activity Works:\n• Equipment Preparation: Your diving equipment is prepared before the activity.  \n• Safety Briefing: Your instructor will explain the basics of scuba diving, essential techniques, and safety instructions before your dive.  \n• Boat Trip: Board the boat and head to the selected diving site off the coast of Djerba.  \n• Scuba Dive: Explore the underwater world of Djerba with your instructor in complete safety. The dive lasts approximately 30 to 50 minutes, depending on your breathing and air consumption underwater.  \n• Return: After your underwater adventure, return by boat and enjoy an unforgettable experience discovering the marine life and underwater landscapes of Djerba.",    image: boat,
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
    id: "tour-ile-djerba-demi",
    slug: "tour-ile-djerba-demi",
    category: "excursions",
    title: "EXCURSION TOUR DE L'ILE DE DJERBA UNE DEMI-JOURNÉE",
    shortDescription: "Explorez la fascinante île de Djerba en demi-journée grâce à notre programme de visite soigneusement conçu.",
    longDescription: "Explorez la fascinante île de Djerba en demi-journée grâce à notre programme de visite soigneusement conçu.\n\nProgramme :\n• 07h30 : Prise en charge sur votre lieu de séjour à Djerba.\n• Mosquée souterraine : Une expérience unique dans un trésor caché de l'île pour plonger dans son histoire et sa spiritualité.\n• Village des potiers de Guelalla & Musée : Découverte de l'art millénaire de la poterie et démonstration traditionnelle.\n• La Synagogue de la Ghriba : Visite de la plus ancienne synagogue du Maghreb, un site historique majeur.\n• Village d'Erriadh (DjerbaHood) : Découverte du Street Art avec plus de 100 fresques réalisées par des artistes du monde entier.\n• 12h30 : Retour et dépose à votre lieu de séjour.",
    image: excursionDjerba,
    images: [excursionDjerba],
    durationMinutes: 300,
    durationLabel: "Demi-journée",
    types: ["family", "couple"],
    badge: "Culture",
    active: true,
    meetingPoint: "Prise en charge à votre lieu de séjour",
    difficulty: "Easy",
    languages: ["FR", "EN", "IT", "DE"],
    minAge: 0,
    options: [{ label: "Adulte", price: 40 }],
    included: [
      "Prise en charge et retour à l'hôtel",
      "Visite de la Mosquée souterraine",
      "Visite du Village des potiers de Guelalla & Musée",
      "Visite de la Synagogue de la Ghriba",
      "Découverte d'Erriadh (DjerbaHood)"
    ],
    excluded: [
      "Boissons",
      "Achats personnels et pourboires"
    ]
  },
  {
    id: "tour-ile-djerba-journee",
    slug: "tour-ile-djerba-journee",
    category: "excursions",
    title: "EXCURSION TOUR DE L'ILE DE DJERBA UNE JOURNÉE",
    shortDescription: "Découvrez l'authenticité et la richesse culturelle de Djerba lors d'une journée complète.",
    longDescription: "Découvrez l'authenticité et la richesse culturelle de Djerba.\n\nProgramme :\n• 07h30 : Prise en charge sur votre lieu de séjour à Djerba.\n• Matinée Culturelle : Visite de la mosquée souterraine, exploration du village et musée de Guelalla, puis visite de la plus ancienne synagogue du Maghreb et découverte des fresques d'Erriadh (DjerbaHood).\n• Déjeuner Repas de Poisson : Pause culinaire dans un restaurant spécialisé pour savourer la cuisine locale.\n• Temps libre à Houmt Souk : Exploration du marché traditionnel, shopping souvenirs et immersion dans la vie locale.\n• Côte Ouest & Côte Sauvage : Visite du site pittoresque de Sidi Jmour et découverte de la côte sauvage.\n• 16h30 : Retour à votre lieu de séjour.",
    image: excursionDjerba,
    images: [excursionDjerba],
    durationMinutes: 540,
    durationLabel: "Journée complète",
    types: ["family", "couple"],
    badge: "Culture",
    active: true,
    meetingPoint: "Prise en charge à votre lieu de séjour",
    difficulty: "Easy",
    languages: ["FR", "EN", "IT", "DE"],
    minAge: 0,
    options: [{ label: "Adulte", price: 50 }],
    included: [
      "Prise en charge et retour à l'hôtel",
      "Transports",
      "Visites guidées",
      "Déjeuner spécialité poissons"
    ],
    excluded: [
      "Boissons autres que l'eau",
      "Achats personnels et pourboires"
    ]
  },
  {
    id: "ksar-ghilane-journee",
    slug: "ksar-ghilane-journee",
    category: "excursions",
    title: "EXCURSION DJERBA KSAR GHILANE : UNE JOURNÉE DANS LE DÉSERT DU SAHARA",
    shortDescription: "Une journée d'aventure inoubliable avec découverte de l'oasis, des dunes et des sources chaudes.",
    longDescription: "Plongez dans le désert tunisien pour une aventure saharienne d'une journée à Ksar Ghilane.\n\nProgramme :\n1. Départ de Djerba & Chaussée Romaine : Traversée de la voie romaine reliant l'île au continent.\n2. Route vers le Grand Erg Oriental : Traversée des champs d'oliviers et pause café en route vers le désert.\n3. Arrivée à l'Oasis de Ksar Ghilane : Découverte des premières dunes du Sahara.\n4. Déjeuner & Source Chaude : Déjeuner typique au pied des dunes et baignade relaxante dans la source chaude naturelle à 32°C.\n5. Visite du Ksar Hallouf : Découverte d'un très ancien grenier berbère et de son architecture traditionnelle.\n6. Retour à Djerba.",
    image: ksar1d,
    images: [ksar1d],
    durationMinutes: 720,
    durationLabel: "1 Journée",
    types: ["adventure", "family", "couple"],
    badge: "Désert",
    active: true,
    meetingPoint: "Prise en charge à votre lieu de séjour",
    difficulty: "Moderate",
    languages: ["FR", "EN", "IT", "DE"],
    minAge: 5,
    options: [{ label: "Adulte", price: 65 }],
    included: [
      "Transport privé en véhicule 4x4 ou microbus",
      "Services d'un guide agréé ONTT",
      "Déjeuner au restaurant au pied des dunes",
      "Droits d'entrées aux visites prévues"
    ],
    excluded: [
      "Vols nationaux / internationaux",
      "Boissons autres que l'eau",
      "Activités optionnelles en extra",
      "Pourboires et achats personnels"
    ]
  },
  {
    id: "ksar-ghilane-2jours",
    slug: "ksar-ghilane-2jours",
    category: "excursions",
    title: "EXCURSION KSAR GHILANE 2 JOURS ET UNE NUIT DANS LE DÉSERT",
    shortDescription: "Passez une nuit magique sous les étoiles dans un campement saharien de charme.",
    longDescription: "L'expérience saharienne ultime avec une nuit sous les étoiles en campement traditionnel berbère.\n\nJOUR 1 : Djerba > Chaussée Romaine > Tataouine > Désert\n• 07h30 : Départ de Djerba en 4x4 privé.\n• Photo au lac salé Sebkhet el Melah.\n• Tataouine & Ksar Ouled Soltane : Visite du marché local et des greniers fortifiés.\n• Déjeuner & Villages Berbères : Repas à Guermassa/Ksar Hadada (décor Star Wars), puis visite guidée du village perché de Chenini.\n• Oasis de Ksar Ghilane : Baignade dans la source chaude à 32°C.\n• Activités optionnelles (sur place) : Quad vers le fort romain Tisavar (30€/h) ou dromadaire dans les dunes (15€/h).\n• Nuit au Campement (Zmela ou similaire) : Transfert dans les dunes, installation en tente privée (vrais lits), cuisson du pain de sable (mella), dîner traditionnel et soirée au coin du feu.\n\nJOUR 2 : Ksar Ghilane > Tamezret > Matmata > Djerba\n• Petit-déjeuner face aux dunes du Sahara.\n• Tamezret : Escale dans ce village berbère et déjeuner authentique chez l'habitant.\n• Matmata : Visite des maisons troglodytiques creusées dans la terre et rencontre avec les habitants.\n• Fin d'après-midi : Retour à Djerba et dépose à votre hôtel, maison d'hôtes ou aéroport.",
    image: ksar2d,
    images: [ksar2d],
    durationMinutes: 2880,
    durationLabel: "2 Jours / 1 Nuit",
    types: ["adventure", "couple", "family"],
    badge: "Overnight",
    featured: true,
    active: true,
    meetingPoint: "Prise en charge à votre lieu de séjour",
    difficulty: "Moderate",
    languages: ["FR", "EN", "IT", "DE"],
    minAge: 5,
    options: [{ label: "Adulte", price: 155 }],
    included: [
      "Transport Privé en 4x4 confortable",
      "Chauffeur-guide agréé ONTT",
      "Pension Complète (du déjeuner J1 au déjeuner J2, dîner inclus)",
      "Nuit en campement saharien de charme (tente privée avec vrais lits)",
      "Toutes les visites mentionnées"
    ],
    excluded: [
      "Boissons autres que l'eau",
      "Activités optionnelles sur place",
      "Pourboires & achats personnels"
    ],
    itinerary: [
      {
        day: 1,
        title: "Djerba > Chaussée Romaine > Tataouine > Désert",
        steps: [
          {
            time: "07:30",
            label: "Départ de Djerba",
            description: "Départ en 4x4 privé."
          },
          {
            time: "Matin",
            label: "Tataouine & Lac Salé",
            description: "Photo au lac salé Sebkhet el Melah. Visite du marché local de Tataouine et des greniers fortifiés (Ksar Ouled Soltane)."
          },
          {
            time: "Midi",
            label: "Villages Berbères",
            description: "Repas à Guermassa/Ksar Hadada (décor Star Wars), puis visite guidée du village perché de Chenini."
          },
          {
            time: "Après-midi",
            label: "Oasis de Ksar Ghilane",
            description: "Baignade dans la source chaude à 32°C. Possibilité d'activités optionnelles (quad, dromadaire)."
          },
          {
            time: "Soir",
            label: "Nuit au Campement",
            description: "Transfert dans les dunes, installation en tente privée. Cuisson du pain de sable (mella), dîner traditionnel et soirée au coin du feu."
          }
        ]
      },
      {
        day: 2,
        title: "Ksar Ghilane > Tamezret > Matmata > Djerba",
        steps: [
          {
            time: "Matin",
            label: "Réveil saharien",
            description: "Petit-déjeuner face aux dunes du Sahara."
          },
          {
            time: "Midi",
            label: "Tamezret",
            description: "Escale dans le village berbère de Tamezret et déjeuner authentique chez l'habitant."
          },
          {
            time: "Après-midi",
            label: "Matmata",
            description: "Visite des maisons troglodytiques creusées dans la terre et rencontre avec les habitants."
          },
          {
            time: "Fin de journée",
            label: "Retour",
            description: "Retour à Djerba et dépose à votre hôtel, maison d'hôtes ou aéroport."
          }
        ]
      }
    ]
  }

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
