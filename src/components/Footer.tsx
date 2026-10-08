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
              Island<span className="text-accent"> Experience</span>
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
              <a href="https://www.facebook.com/water.sports.B20" target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-accent">
                <Facebook className="h-4 w-4" /> Facebook
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/water_sports_b20_djerba" target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-accent">
                <Instagram className="h-4 w-4" /> Instagram
              </a>
            </li>
            <li>
              <a href="https://www.tiktok.com/@watersportsb20" target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-accent">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.34 2.88 2.88 0 012.31-4.53 2.66 2.66 0 011.61.53V9.45a6.3 6.3 0 00-1.61-.2 6.33 6.33 0 106.33 6.33V8.66a8.3 8.3 0 003.78 1.48V6.69z"/>
                </svg> TikTok
              </a>
            </li>
            <li>
              <a href="https://maps.app.goo.gl/X7J6M797b5XWuhLu7" target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-accent">
                <MapPin className="h-4 w-4" /> Djerba, Tunisie
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container-page py-5 text-xs text-primary-foreground/70 flex justify-center text-center">
          <span className="font-display uppercase tracking-widest">
            © {new Date().getFullYear()} Website Developed by{" "}
            <a 
              href="https://www.instagram.com/houbarunner/" 
              target="_blank" 
              rel="noreferrer" 
              className="text-accent font-bold hover:underline"
            >
              HoubaRunner
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}