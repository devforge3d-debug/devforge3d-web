import { createFileRoute, Link } from "@tanstack/react-router";
import { Code2, Database, Server, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/programozas")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Fejlesztés és Programozás — DevForge3D" },
      { name: "description", content: "Egyedi FiveM szkriptek, integrációk, automatizáció és komplex rendszerek fejlesztése." },
    ],
  }),
});

function Page() {
  const { t } = useI18n();
  const features = [
    { icon: Server, title: t("service.code.feature1.title"), desc: t("service.code.feature1.desc") },
    { icon: Database, title: t("service.code.feature2.title"), desc: t("service.code.feature2.desc") },
    { icon: Wrench, title: t("service.code.feature3.title"), desc: t("service.code.feature3.desc") },
  ];
  
  return (
    <>
      <section className="bg-hero py-20 grid-bg">
        <div className="container mx-auto px-4 text-center">
          <Code2 className="mx-auto h-16 w-16 text-primary mb-4" strokeWidth={1.5} />
          <h1 className="text-5xl font-bold">{t("service.code.title")}</h1>
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
          <h2 className="text-2xl font-bold mb-4">{t("service.code.listTitle")}</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {["Lua", "JavaScript", "Node.js", "Python", "MySQL", "PostgreSQL", "ESX", "OXMySQL"].map((t) => (
              <span key={t} className="px-3 py-1 text-xs rounded-full bg-secondary border border-border text-foreground/80 hover:border-primary hover:text-primary transition-colors">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="hero" size="lg">
              <Link to="/kapcsolat">{t("service.code.cta")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
