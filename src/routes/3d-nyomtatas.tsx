import { createFileRoute, Link } from "@tanstack/react-router";
import { Box, Layers, Cog, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/3d-nyomtatas")({
  component: Page,
  head: () => ({
    meta: [
      { title: "3D Nyomtatás és Tervezés — DevForge3D" },
      { name: "description", content: "Egyedi 3D modellek, prototípusok és nyomtatás profi minőségben." },
    ],
  }),
});

function Page() {
  const { t } = useI18n();
  const features = [
    { icon: Layers, title: t("service.print.feature1.title"), desc: t("service.print.feature1.desc") },
    { icon: Cog, title: t("service.print.feature2.title"), desc: t("service.print.feature2.desc") },
    { icon: Box, title: t("service.print.feature3.title"), desc: t("service.print.feature3.desc") },
  ];
  const items = ["service.print.item1", "service.print.item2", "service.print.item3", "service.print.item4", "service.print.item5"];
  return (
    <>
      <section className="bg-hero py-20 grid-bg">
        <div className="container mx-auto px-4 text-center">
          <Box className="mx-auto h-16 w-16 text-primary mb-4" strokeWidth={1.5} />
          <h1 className="text-5xl font-bold">{t("service.print.title")}</h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            {t("service.print.subtitle")}
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
          <h2 className="text-2xl font-bold mb-4">{t("service.print.listTitle")}</h2>
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
              <Link to="/kapcsolat">{t("service.print.cta")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
