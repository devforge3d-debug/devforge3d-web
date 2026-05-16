import { createFileRoute, Link } from "@tanstack/react-router";
import { Box, Code2, Globe, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DiscordButton } from "@/components/DiscordButton";
import { useI18n } from "@/lib/i18n";
import logo from "@/assets/devforge-logo.png";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "DevForge3D Development — FiveM Team" },
      { name: "description", content: "FiveM development csapat. 3D nyomtatás, weboldalak, egyedi szkriptek és digitális megoldások egy helyen." },
    ],
  }),
});

const services = [
  { to: "/3d-nyomtatas", icon: Box, titleKey: "home.service.print.title", descKey: "home.service.print.desc" },
  { to: "/programozas", icon: Code2, titleKey: "home.service.code.title", descKey: "home.service.code.desc" },
  { to: "/weboldal-keszites", icon: Globe, titleKey: "home.service.web.title", descKey: "home.service.web.desc" },
  { to: "/referenciak", icon: TrendingUp, titleKey: "home.service.digital.title", descKey: "home.service.digital.desc" },
] as const;

function Home() {
  const { t } = useI18n();
  return (
    <>
      {/* HERO */}
      <section className="relative bg-hero overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs text-primary uppercase tracking-wider">
                <Sparkles className="h-3 w-3" /> {t("home.badge")}
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-[1.05]">
                <span className="text-foreground">DEVFORGE</span>
                <span className="text-gradient">3D</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                {t("home.subtitle")}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="hero" size="xl">
                  <Link to="/kapcsolat">
                    {t("home.cta.contact")} <ArrowRight className="ml-1" />
                  </Link>
                </Button>
                <Button asChild variant="outlineGlow" size="xl">
                  <Link to="/referenciak">{t("home.cta.refs")}</Link>
                </Button>
                <DiscordButton size="lg" />
              </div>
              <div className="flex gap-6 pt-4 text-sm text-muted-foreground">
                <div>
                  <div className="text-2xl font-bold text-primary">2</div>
                  {t("home.stat.founders")}
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">100%</div>
                  {t("home.stat.team")}
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">∞</div>
                  {t("home.stat.opp")}
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl animate-pulse-glow" />
                <img
                  src={logo}
                  alt="DevForge3D logó"
                  className="relative w-72 md:w-96 rounded-full animate-float ring-orange-soft"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold">{t("home.services")}</h2>
          <p className="text-muted-foreground mt-3">{t("home.servicesSub")}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="group bg-card border border-border rounded-xl p-6 card-hover relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/30 transition-all" />
              <s.icon className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <h3 className="text-lg font-bold mb-2">{t(s.titleKey)}</h3>
              <p className="text-sm text-muted-foreground">{t(s.descKey)}</p>
              <div className="mt-4 text-xs text-primary inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {t("home.details")} <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FOUNDERS */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">{t("home.team")}</h2>
          <p className="text-muted-foreground mt-3">{t("home.teamSub")}</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {[
            { name: "N4ndiHun", href: null as string | null },
            { name: "husleves", href: "https://guns.lol/husleves_67" },
          ].map(({ name, href }) => {
            const inner = (
              <>
                <div className="mx-auto h-24 w-24 rounded-full bg-[image:var(--gradient-primary)] flex items-center justify-center text-3xl font-bold text-primary-foreground mb-4 glow-sm">
                  {name[0]}
                </div>
                <h3 className="text-2xl font-bold">{name}</h3>
                <p className="text-sm text-primary uppercase tracking-wider mt-1">{t("home.coFounder")}</p>
              </>
            );
            return href ? (
              <a key={name} href={href} target="_blank" rel="noreferrer" className="bg-card border border-border rounded-xl p-8 card-hover text-center block">
                {inner}
              </a>
            ) : (
              <div key={name} className="bg-card border border-border rounded-xl p-8 card-hover text-center">
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-card border border-primary/30 rounded-2xl p-10 md:p-16 text-center bg-hero relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("home.cta.title")}</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              {t("home.cta.text")}
            </p>
            <Button asChild size="xl" variant="hero">
              <Link to="/kapcsolat">{t("home.cta.contact2")} <ArrowRight /></Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
