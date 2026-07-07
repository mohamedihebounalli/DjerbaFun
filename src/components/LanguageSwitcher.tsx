import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LOCALES, useI18n } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 rounded-full">
          <Globe className="h-4 w-4" />
          <span className="text-base leading-none">{current.flag}</span>
          <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wide">
            {current.code}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {LOCALES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onSelect={() => setLocale(l.code)}
            className="gap-3 cursor-pointer"
          >
            <span className="text-lg leading-none">{l.flag}</span>
            <span className="flex-1">{l.label}</span>
            {l.code === locale && (
              <span className="text-xs text-primary font-semibold">●</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
