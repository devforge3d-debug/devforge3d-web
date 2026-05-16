import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/szabalyzat")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Általános Szabályzat — DevForge3D" },
      { name: "description", content: "DevForge3D általános szabályzat, ÁSZF és felhasználási feltételek." },
    ],
  }),
});

const sections = Array.from({ length: 10 }, (_, index) => ({
  title: `policy.s${index + 1}.title`,
  body: `policy.s${index + 1}.body`,
}));

function Page() {
  const { t, lang } = useI18n();
  return (
    <>
      <section className="bg-hero py-16 grid-bg">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold">{t("policy.title")}</h1>
          <p className="text-muted-foreground mt-4">{t("policy.effective")}: {new Date().toLocaleDateString(lang === "hu" ? "hu-HU" : "en-US")}</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto space-y-5">
          {sections.map((s) => (
            <div key={s.title} className="bg-card border border-border rounded-xl p-6 card-hover">
              <h2 className="text-lg font-bold text-primary mb-2">{t(s.title)}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(s.body)}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
