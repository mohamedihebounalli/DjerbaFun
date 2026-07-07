import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, MapPin, MessageCircle, Waves } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-24 border-t border-border bg-primary text-primary-foreground">
      <div className="container-page py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground">
              <Waves className="h-5 w-5" />
            </span>
            <span className="font-display text-2xl font-bold">
              Djerba<span className="text-accent"> Fun</span>
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm text-primary-foreground/80">{t("footer.tagline")}</p>
        </div>

        <div>
          <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-accent">
            {t("footer.explore")}
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/" className="hover:text-accent">{t("nav.home")}</Link></li>
            <li><Link to="/water-activities" className="hover:text-accent">{t("nav.water")}</Link></li>
            <li><Link to="/land-activities" className="hover:text-accent">{t("nav.land")}</Link></li>
            <li><Link to="/excursions" className="hover:text-accent">{t("nav.excursions")}</Link></li>
            <li><Link to="/contact" className="hover:text-accent">{t("nav.contact")}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-accent">
            {t("footer.follow")}
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-accent">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </li>
            <li>
              <a href="https://instagram.com" target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-accent">
                <Instagram className="h-4 w-4" /> Instagram
              </a>
            </li>
            <li>
              <a href="https://facebook.com" target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-accent">
                <Facebook className="h-4 w-4" /> Facebook
              </a>
            </li>
            <li>
              <a href="https://maps.google.com/?q=Djerba" target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-accent">
                <MapPin className="h-4 w-4" /> Google Maps
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container-page py-5 text-xs text-primary-foreground/70 flex flex-wrap items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} Djerba Fun. {t("footer.rights")}</span>
          <span>Made with ♥ in Djerba, Tunisia.</span>
        </div>
      </div>
    </footer>
  );
}
