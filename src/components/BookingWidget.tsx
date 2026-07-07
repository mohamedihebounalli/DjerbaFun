import { useState } from "react";
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
import { MessageCircle, CalendarDays, Users, MapPin, Tag } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { Activity } from "@/lib/activities";
import { startingPrice } from "@/lib/activities";
import { format } from "date-fns";

interface BookingWidgetProps {
  activity: Activity;
}

export function BookingWidget({ activity }: BookingWidgetProps) {
  const price = startingPrice(activity);
  const isPriceOnRequest = price === null;

  const [date, setDate] = useState<Date | undefined>();
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState("0");
  const [hotel, setHotel] = useState("");
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");

  const waUrl = buildWhatsAppUrl({
    activity: activity.title,
    date: date ? format(date, "dd/MM/yyyy") : "",
    adults: Number(adults),
    children: Number(children),
    hotel,
  });

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
              {price}€
              <span className="text-base font-normal text-muted-foreground"> / person</span>
            </p>
          </div>
        )}
      </div>

      <div className="w-full h-px bg-border" />

      {/* Date picker */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
          <CalendarDays className="h-3.5 w-3.5" /> Choose a date
        </label>
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={{ before: new Date() }}
            className="rounded-xl border border-border"
          />
        </div>
        {date && (
          <p className="mt-2 text-center text-sm font-medium text-primary">
            📅 {format(date, "EEEE, d MMMM yyyy")}
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

      {/* Hotel pickup */}
      <div>
        <label
          htmlFor="booking-hotel"
          className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5"
        >
          <MapPin className="h-3.5 w-3.5" /> Hotel / Location
        </label>
        <Input
          id="booking-hotel"
          value={hotel}
          onChange={(e) => setHotel(e.target.value)}
          placeholder="e.g. Hasdrubal Thalassa Hotel"
          className="h-11 rounded-full"
        />
      </div>

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
        asChild
        size="lg"
        className="w-full rounded-full bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90 shadow-soft font-semibold text-base h-14"
      >
        <a href={waUrl} target="_blank" rel="noreferrer">
          <MessageCircle className="h-5 w-5 mr-2" />
          Book via WhatsApp
        </a>
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Instant confirmation · No online payment
      </p>
    </div>
  );
}
