import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3">
      <button
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={cn(
          "grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground shadow-lift transition-all",
          showTop ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none translate-y-3",
        )}
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      <a
        aria-label="Book on WhatsApp"
        href={buildWhatsAppUrl({ activity: "General inquiry" })}
        target="_blank" rel="noreferrer"
        className="group relative grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lift float-slow hover:scale-105 transition-transform"
      >
        <span className="absolute inset-0 rounded-full bg-whatsapp opacity-40 animate-ping" aria-hidden />
        <MessageCircle className="relative h-6 w-6" />
      </a>
    </div>
  );
}
