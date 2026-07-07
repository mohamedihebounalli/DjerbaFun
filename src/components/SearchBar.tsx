import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useI18n } from "@/lib/i18n";
import type { ActivityType } from "@/lib/activities";

export interface Filters {
  q: string;
  maxPrice: number;
  duration: "any" | "short" | "mid" | "long";
  type: "any" | ActivityType;
}

export const DEFAULT_FILTERS: Filters = {
  q: "", maxPrice: 300, duration: "any", type: "any",
};

export function SearchBar({
  filters, onChange, onReset,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  onReset: () => void;
}) {
  const { t } = useI18n();
  return (
    <div className="rounded-3xl border border-border bg-card/90 backdrop-blur p-4 md:p-5 shadow-lift">
      <div className="grid gap-4 md:grid-cols-12 md:items-end">
        <div className="md:col-span-4">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("search.title")}
          </label>
          <div className="relative mt-1.5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={filters.q}
              onChange={(e) => onChange({ ...filters, q: e.target.value })}
              placeholder={t("search.placeholder")}
              className="pl-9 h-11 rounded-full border-border bg-background"
            />
          </div>
        </div>

        <div className="md:col-span-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("search.price")}: <span className="text-primary">{filters.maxPrice}€</span>
          </label>
          <div className="mt-4 px-1">
            <Slider
              value={[filters.maxPrice]}
              min={10} max={300} step={5}
              onValueChange={(v) => onChange({ ...filters, maxPrice: v[0] })}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("search.duration")}
          </label>
          <Select
            value={filters.duration}
            onValueChange={(v) => onChange({ ...filters, duration: v as Filters["duration"] })}
          >
            <SelectTrigger className="mt-1.5 h-11 rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">{t("search.any")}</SelectItem>
              <SelectItem value="short">{t("duration.short")}</SelectItem>
              <SelectItem value="mid">{t("duration.mid")}</SelectItem>
              <SelectItem value="long">{t("duration.long")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("search.type")}
          </label>
          <Select
            value={filters.type}
            onValueChange={(v) => onChange({ ...filters, type: v as Filters["type"] })}
          >
            <SelectTrigger className="mt-1.5 h-11 rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">{t("search.any")}</SelectItem>
              <SelectItem value="family">{t("type.family")}</SelectItem>
              <SelectItem value="adventure">{t("type.adventure")}</SelectItem>
              <SelectItem value="couple">{t("type.couple")}</SelectItem>
              <SelectItem value="kids">{t("type.kids")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-1">
          <Button
            variant="outline" onClick={onReset}
            className="w-full h-11 rounded-full"
            aria-label={t("search.reset")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function applyFilters<T extends {
  title: string; shortDescription: string;
  durationMinutes: number; types: string[];
  options: { price: number | null }[];
}>(items: T[], f: Filters): T[] {
  const q = f.q.trim().toLowerCase();
  return items.filter((a) => {
    if (q && !`${a.title} ${a.shortDescription}`.toLowerCase().includes(q)) return false;
    const minPrice = Math.min(
      ...a.options.map((o) => (typeof o.price === "number" ? o.price : Infinity)),
    );
    // Price-on-request items pass unless the user explicitly filters very low; keep them visible.
    if (Number.isFinite(minPrice) && minPrice > f.maxPrice) return false;
    if (f.duration === "short" && a.durationMinutes >= 30) return false;
    if (f.duration === "mid" && (a.durationMinutes < 30 || a.durationMinutes > 120)) return false;
    if (f.duration === "long" && a.durationMinutes < 180) return false;
    if (f.type !== "any" && !a.types.includes(f.type)) return false;
    return true;
  });
}
