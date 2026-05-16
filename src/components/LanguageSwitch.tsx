import { useI18n, type Lang } from "@/lib/i18n";
import { Languages } from "lucide-react";

export function LanguageSwitch({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useI18n();

  const opt = (l: Lang, label: string) => {
    const active = lang === l;
    return (
      <button
        key={l}
        onClick={() => setLang(l)}
        aria-pressed={active}
        className={[
          "relative z-10 flex items-center justify-center rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-300",
          active
            ? "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow-sm)]"
            : "text-muted-foreground hover:text-primary",
        ].join(" ")}
      >
        <span>{label}</span>
      </button>
    );
  };

  return (
    <div
      className="relative inline-flex items-center gap-1 rounded-full border border-primary/30 bg-card/80 p-1.5 backdrop-blur-xl shadow-[inset_0_0_18px_color-mix(in_oklab,var(--primary)_10%,transparent)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/70 hover:[box-shadow:var(--shadow-glow-sm)]"
      role="group"
      aria-label="Language"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
        <Languages className="h-3.5 w-3.5" />
      </span>
      {opt("hu", "HU")}
      {opt("en", "EN")}
    </div>
  );
}
