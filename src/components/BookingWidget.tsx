import { useState, useEffect, useRef } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageCircle, CalendarDays, Users, MapPin, Tag, Clock, Map, HelpCircle, ArrowLeft, XCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { Activity } from "@/lib/activities";
import { startingPrice } from "@/lib/activities";
import { format } from "date-fns";

interface BookingWidgetProps {
  activity: Activity;
}

export function BookingWidget({ activity }: BookingWidgetProps) {
  const basePrice = startingPrice(activity);
  const isBasePriceOnRequest = basePrice === null;

  const validOptions = activity.options.filter(o => o.label);
  const hasOptions = validOptions.length > 1;

  const [selectedOption, setSelectedOption] = useState(hasOptions ? validOptions[0].label : "");
  const currentOption = validOptions.find(o => o.label === selectedOption);
  const displayPrice = hasOptions && currentOption && currentOption.price !== null ? currentOption.price : basePrice;
  const isPriceOnRequest = hasOptions && currentOption ? currentOption.price === null : isBasePriceOnRequest;

  const [date, setDate] = useState<Date | undefined>();
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState("0");
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [showDateError, setShowDateError] = useState(false);

  // Name states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showNameError, setShowNameError] = useState(false);

  // Modal pickup location state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [knowsPickup, setKnowsPickup] = useState<boolean | null>(null);
  const [pickupCheckpoint, setPickupCheckpoint] = useState("");
  const [customPickup, setCustomPickup] = useState("");
  const [mapCoords, setMapCoords] = useState("33.8055,10.9904");

  const mapInstanceRef = useRef<any>(null);
  const markerInstanceRef = useRef<any>(null);

  const popularHotels = [
    "Hasdrubal Thalassa & Spa Djerba",
    "Radisson Blu Palace Resort & Spa",
    "Iberostar Mehari Djerba",
    "Robinson Club Djerba Bahiya",
    "Royal Garden Palace",
    "Fiesta Beach Djerba",
    "TUI BLUE Palm Beach Palace",
    "Djerba Plaza Thalasso & Spa",
    "Seabel Rym Beach Djerba",
    "Club Med Djerba la Douce",
    "Hotel Cesar Thalasso",
    "Sentido Djerba Beach",
    "Vincci Helios Beach",
    "Houmt Souk Medina (Central)",
    "Midoun Town Center",
    "Guellala Village",
    "Other Hotel / Specify on WhatsApp"
  ];

  const checkPoints = [
    { label: "Sidi Mahrez Beach (Water Sports Base)", coords: "https://maps.google.com/?q=33.8267,10.9886" },
    { label: "Yati Beach (Near Radisson Blu)", coords: "https://maps.google.com/?q=33.8239,11.0267" },
    { label: "Houmt Souk Marina (Pirate Ships)", coords: "https://maps.google.com/?q=33.8821,10.8601" },
    { label: "Midoun Center (Carrefour Parking)", coords: "https://maps.google.com/?q=33.8055,10.9904" },
    { label: "Djerba Explore Park (Crocodile Farm)", coords: "https://maps.google.com/?q=33.8184,11.0422" },
    { label: "Custom Hotel / Location (Select Below)", coords: "custom" }
  ];

  useEffect(() => {
    if (!isModalOpen || knowsPickup !== true) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      return;
    }

    const loadLeaflet = () => {
      return new Promise<void>((resolve) => {
        if ((window as any).L) {
          resolve();
          return;
        }

        if (!document.getElementById("leaflet-css")) {
          const link = document.createElement("link");
          link.id = "leaflet-css";
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          document.head.appendChild(link);
        }

        const script = document.createElement("script");
        script.id = "leaflet-js";
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = () => resolve();
        document.head.appendChild(script);
      });
    };

    loadLeaflet().then(() => {
      const L = (window as any).L;
      if (!L) return;

      const mapEl = document.getElementById("leaflet-pickup-map");
      if (!mapEl) return;

      let lat = 33.8055;
      let lng = 10.9904;
      const selectedObj = checkPoints.find((c) => c.label === pickupCheckpoint);
      if (selectedObj && selectedObj.coords !== "custom") {
        const match = selectedObj.coords.match(/q=([\d.-]+),([\d.-]+)/);
        if (match) {
          lat = parseFloat(match[1]);
          lng = parseFloat(match[2]);
        }
      }

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const map = L.map("leaflet-pickup-map").setView([lat, lng], 13);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);

      const customIcon = L.divIcon({
        className: 'custom-pin-icon',
        html: `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground border-2 border-background shadow-lg"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      const marker = L.marker([lat, lng], { draggable: true, icon: customIcon }).addTo(map);
      markerInstanceRef.current = marker;

      setMapCoords(`${lat.toFixed(6)},${lng.toFixed(6)}`);

      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        setMapCoords(`${pos.lat.toFixed(6)},${pos.lng.toFixed(6)}`);
      });

      map.on("click", (e: any) => {
        marker.setLatLng(e.latlng);
        setMapCoords(`${e.latlng.lat.toFixed(6)},${e.latlng.lng.toFixed(6)}`);
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isModalOpen, knowsPickup, pickupCheckpoint]);

  const handleBookClick = () => {
    let hasError = false;
    if (!date) {
      setShowDateError(true);
      hasError = true;
    }
    if (!firstName.trim() || !lastName.trim()) {
      setShowNameError(true);
      hasError = true;
    }
    if (hasError) return;

    setShowDateError(false);
    setShowNameError(false);
    setKnowsPickup(null);
    setPickupCheckpoint("");
    setCustomPickup("");
    setIsModalOpen(true);
  };

  const proceedBooking = (usePickup: boolean, locationText?: string) => {
    let finalPickup = "";
    if (usePickup && locationText) {
      finalPickup = locationText;
    }

    const waUrl = buildWhatsAppUrl({
      activity: activity.title,
      option: hasOptions ? selectedOption : undefined,
      date: date ? format(date, "dd/MM/yyyy") : "",
      adults: Number(adults),
      children: Number(children),
      pickupLocation: finalPickup,
      customerName: `${firstName.trim()} ${lastName.trim()}`,
    });

    window.open(waUrl, "_blank");
    setIsModalOpen(false);
  };

  return (
    <div className="rounded-3xl border border-border bg-card shadow-lift p-6 space-y-5">
      {/* Price header */}
      <div>
        {isPriceOnRequest ? (
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 border border-accent/30 px-4 py-2">
            <Tag className="h-4 w-4 text-accent-foreground" />
            <span className="font-display text-sm font-semibold text-accent-foreground">
              Price on Request
            </span>
          </div>
        ) : (
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              From
            </p>
            <p className="font-display text-4xl font-extrabold text-primary">
              {displayPrice}€
              <span className="text-base font-normal text-muted-foreground"> / person</span>
            </p>
          </div>
        )}
      </div>

      <div className="w-full h-px bg-border" />

      {/* Option picker */}
      {hasOptions && (
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">
            <Clock className="h-3.5 w-3.5" /> Choose option
          </label>
          <div 
            className="grid gap-2 bg-muted/60 p-1 rounded-2xl border border-border"
            style={{ gridTemplateColumns: `repeat(${validOptions.length}, minmax(0, 1fr))` }}
          >
            {validOptions.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setSelectedOption(opt.label)}
                className={`py-2.5 px-2 text-xs font-bold rounded-xl transition-all ${
                  selectedOption === opt.label
                    ? "bg-background text-primary shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground border border-transparent"
                }`}
              >
                <div className="truncate">{opt.label}</div>
                {opt.price && <div className="text-[10px] font-medium opacity-90 mt-0.5">{opt.price}€</div>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Date picker */}
      <div className={`rounded-2xl p-2 transition-all ${showDateError ? "border-2 border-destructive/50 bg-destructive/5 animate-pulse" : ""}`}>
        <label className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide mb-2 ${showDateError ? "text-destructive font-bold animate-bounce" : "text-muted-foreground"}`}>
          <CalendarDays className="h-3.5 w-3.5" /> Choose a date *
        </label>
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              setDate(d);
              if (d) setShowDateError(false);
            }}
            disabled={{ before: new Date() }}
            className="rounded-xl border border-border bg-card"
          />
        </div>
        {date && (
          <p className="mt-2 text-center text-sm font-medium text-primary">
            📅 {format(date, "EEEE, d MMMM yyyy")}
          </p>
        )}
        {showDateError && (
          <p className="mt-2 text-center text-xs font-bold text-destructive">
            ⚠️ Please choose a date before booking
          </p>
        )}
      </div>

      {/* Name Input Fields */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="booking-firstname" className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide mb-1.5 ${showNameError && !firstName.trim() ? "text-destructive font-bold" : "text-muted-foreground"}`}>
              First Name (Prénom) *
            </label>
            <Input
              id="booking-firstname"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                if (e.target.value.trim()) setShowNameError(false);
              }}
              placeholder="e.g. John"
              className={`h-11 rounded-full ${showNameError && !firstName.trim() ? "border-destructive bg-destructive/5" : ""}`}
            />
          </div>
          <div>
            <label htmlFor="booking-lastname" className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide mb-1.5 ${showNameError && !lastName.trim() ? "text-destructive font-bold" : "text-muted-foreground"}`}>
              Last Name (Nom) *
            </label>
            <Input
              id="booking-lastname"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                if (e.target.value.trim()) setShowNameError(false);
              }}
              placeholder="e.g. Doe"
              className={`h-11 rounded-full ${showNameError && !lastName.trim() ? "border-destructive bg-destructive/5" : ""}`}
            />
          </div>
        </div>
        {showNameError && (!firstName.trim() || !lastName.trim()) && (
          <p className="text-xs font-bold text-destructive">
            ⚠️ Please fill in both your First Name and Last Name
          </p>
        )}
      </div>

      {/* Adults / Children */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
            <Users className="h-3.5 w-3.5" /> Adults
          </label>
          <Select value={adults} onValueChange={setAdults}>
            <SelectTrigger id="booking-adults" className="h-11 rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} adult{n > 1 ? "s" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
            <Users className="h-3.5 w-3.5" /> Children
          </label>
          <Select value={children} onValueChange={setChildren}>
            <SelectTrigger id="booking-children" className="h-11 rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n === 0 ? "No children" : `${n} child${n > 1 ? "ren" : ""}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Hotel pickup removed since it's chosen via modal */}

      {/* Inquiry fields for price-on-request */}
      {isPriceOnRequest && (
        <div className="space-y-3 rounded-2xl bg-accent-soft/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Your contact (optional)
          </p>
          <Input
            value={inquiryName}
            onChange={(e) => setInquiryName(e.target.value)}
            placeholder="Your name"
            className="h-10 rounded-full bg-card"
          />
          <Input
            value={inquiryEmail}
            onChange={(e) => setInquiryEmail(e.target.value)}
            placeholder="Email (optional)"
            className="h-10 rounded-full bg-card"
          />
        </div>
      )}

      {/* WhatsApp CTA */}
      <Button
        onClick={handleBookClick}
        size="lg"
        className="w-full rounded-full bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90 shadow-soft font-semibold text-base h-14"
      >
        <MessageCircle className="h-5 w-5 mr-2" />
        Book via WhatsApp
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Instant confirmation · No online payment
      </p>

      {/* Pickup Location Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl rounded-[2rem] p-8 gap-8">
          <DialogHeader className="text-center sm:text-center">
            <DialogTitle className="font-display text-2xl md:text-3xl font-extrabold flex flex-col items-center gap-3 text-center justify-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <HelpCircle className="h-8 w-8 animate-bounce" />
              </div>
              Do you know where you want to be picked up?
            </DialogTitle>
          </DialogHeader>
 
          {knowsPickup === null && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <Button
                variant="outline"
                onClick={() => proceedBooking(false)}
                className="h-44 rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 border-2 border-dashed p-6 transition-all cursor-pointer"
              >
                <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
                  <XCircle className="h-7 w-7 text-muted-foreground" />
                </div>
                <span className="font-bold text-xl">No, specify later</span>
                <span className="text-xs text-muted-foreground text-center">
                  Proceed to book via WhatsApp directly
                </span>
              </Button>
              <Button
                onClick={() => setKnowsPickup(true)}
                className="h-44 rounded-3xl flex flex-col items-center justify-center gap-3 bg-primary text-primary-foreground hover:bg-primary/95 border-2 border-primary p-6 transition-all shadow-md shadow-primary/10 cursor-pointer"
              >
                <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center">
                  <MapPin className="h-7 w-7 text-white" />
                </div>
                <span className="font-bold text-xl">Yes, pick me up</span>
                <span className="text-xs text-primary-foreground/80 text-center">
                  Select a meeting point on the map
                </span>
              </Button>
            </div>
          )}

          {knowsPickup === true && (
            <div className="space-y-4 mt-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setKnowsPickup(null)}
                  className="h-8 px-2 text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Select Checkpoint / Meeting Point
                </label>
                <Select value={pickupCheckpoint} onValueChange={setPickupCheckpoint}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Choose a checkpoint..." />
                  </SelectTrigger>
                  <SelectContent>
                    {checkPoints.map((cp) => (
                      <SelectItem key={cp.label} value={cp.label}>
                        {cp.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {pickupCheckpoint && (
                <div className="space-y-1">
                  <span className="text-[11px] text-muted-foreground italic block">
                    📍 You can click on the map or drag the pin to change your exact pickup spot
                  </span>
                  <div className="rounded-2xl overflow-hidden border border-border h-[220px] w-full relative z-10">
                    <div id="leaflet-pickup-map" className="w-full h-full" style={{ minHeight: "220px" }}></div>
                  </div>
                </div>
              )}

              {pickupCheckpoint && checkPoints.find(c => c.label === pickupCheckpoint)?.coords === "custom" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Select Hotel / Location Name
                  </label>
                  <Select value={customPickup} onValueChange={setCustomPickup}>
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue placeholder="Choose a hotel..." />
                    </SelectTrigger>
                    <SelectContent>
                      {popularHotels.map((hotel) => (
                        <SelectItem key={hotel} value={hotel}>
                          {hotel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button
                disabled={!pickupCheckpoint || (checkPoints.find(c => c.label === pickupCheckpoint)?.coords === "custom" && !customPickup)}
                onClick={() => {
                  const selectedObj = checkPoints.find(c => c.label === pickupCheckpoint);
                  const locationText = selectedObj?.coords === "custom"
                    ? customPickup
                    : `${pickupCheckpoint} (Pinned Coords: https://maps.google.com/?q=${mapCoords})`;
                  proceedBooking(true, locationText);
                }}
                className="w-full h-12 rounded-xl bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90 font-bold"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Confirm & Book
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
