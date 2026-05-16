import { createFileRoute, Link } from "@tanstack/react-router";
import { Globe, Smartphone, Zap, Search, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/weboldal-keszites")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Weboldal készítés — DevForge3D" },
      { name: "description", content: "Modern, gyors, reszponzív weboldalak FiveM szerverekhez és vállalkozásokhoz." },
    ],
  }),
});

function Page() {
  const { t } = useI18n();
  const features = [
    { icon: Smartphone, title: t("service.web.feature1.title"), desc: t("service.web.feature1.desc") },
    { icon: Zap, title: t("service.web.feature2.title"), desc: t("service.web.feature2.desc") },
    { icon: Search, title: t("service.web.feature3.title"), desc: t("service.web.feature3.desc") },
  ];
  const items = ["service.web.item1", "service.web.item2", "service.web.item3", "service.web.item4", "service.web.item5"];
  return (
    <>
      <section className="bg-hero py-20 grid-bg">
        <div className="container mx-auto px-4 text-center">
          <Globe className="mx-auto h-16 w-16 text-primary mb-4" strokeWidth={1.5} />
          <h1 className="text-5xl font-bold">{t("service.web.title")}</h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            {t("service.web.subtitle")}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="bg-card border border-border rounded-xl p-6 card-hover">
              <f.icon className="h-10 w-10 text-primary mb-3" strokeWidth={1.5} />
              <h3 className="font-bold text-lg mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-3xl mx-auto bg-card border border-border rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">{t("service.web.listTitle")}</h2>
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                {t(item)}
              </li>
            ))}
          </ul>
          <div className="mt-8 text-center">
            <Button asChild variant="hero" size="lg">
              <Link to="/kapcsolat">{t("service.web.cta")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
