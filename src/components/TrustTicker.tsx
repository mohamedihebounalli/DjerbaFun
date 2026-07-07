import { useI18n } from "@/lib/i18n";

export function TrustTicker() {
  const { t } = useI18n();
  const items = [t("ticker.clients"), t("ticker.activities"), t("ticker.fast")];
  const row = [...items, ...items, ...items, ...items];
  return (
    <div className="w-full overflow-hidden bg-primary text-primary-foreground text-xs sm:text-sm">
      <div className="flex whitespace-nowrap ticker-track py-2 will-change-transform">
        {row.map((text, i) => (
          <span key={i} className="mx-6 inline-flex items-center gap-2 font-medium">
            {text}
            <span className="text-accent">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
