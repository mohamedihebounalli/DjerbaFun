import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, ShieldCheck } from "lucide-react";

import logo from "@/assets/DjerbaFunLogo.png";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function Navbar() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const links: { to: string; label: string }[] = [
    { to: "/", label: t("nav.home") },
    { to: "/water-activities", label: t("nav.water") },
    { to: "/land-activities", label: t("nav.land") },
    { to: "/excursions", label: t("nav.excursions") },
    { to: "/contact", label: t("nav.contact") },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border shadow-soft"
          : "bg-background/60 backdrop-blur-sm",
      )}
    >
      <div className="container-page flex h-16 items-center gap-4">
        <Link to="/" className="flex items-center group">
          <img
            src={logo}
            alt="Djerba Fun"
            className="h-10 w-auto object-contain"
          />
        </Link>


        <nav className="hidden lg:flex items-center gap-1 ml-6">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "text-primary bg-primary-soft" }}
              inactiveProps={{ className: "text-foreground/80 hover:text-primary hover:bg-primary-soft/60" }}
              className="px-3 py-2 rounded-full text-sm font-medium transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher />

          {/* Admin shortcut icon — always goes to login; login redirects to dashboard on success */}
          <Link
            to="/admin/login"
            aria-label="Admin login"
            title="Admin login"
            className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground/40 hover:text-primary hover:bg-primary/10 transition-all"
          >
            <ShieldCheck className="h-4 w-4" />
          </Link>
          <Button
            asChild
            size="sm"
            className="hidden sm:inline-flex rounded-full bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90 shadow-soft"
          >
            <a href={buildWhatsAppUrl({ activity: "General inquiry" })} target="_blank" rel="noreferrer">
              {t("nav.book")}
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="container-page py-3 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{ className: "text-primary bg-primary-soft" }}
                inactiveProps={{ className: "text-foreground/80" }}
                className="px-3 py-3 rounded-lg text-sm font-medium"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={buildWhatsAppUrl({ activity: "General inquiry" })}
              target="_blank" rel="noreferrer"
              className="mt-2 px-3 py-3 rounded-lg text-sm font-semibold bg-whatsapp text-whatsapp-foreground text-center"
            >
              {t("nav.book")}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
