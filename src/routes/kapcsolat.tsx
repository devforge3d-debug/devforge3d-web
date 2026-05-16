import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle, Globe, Copy, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useState } from "react";
import { toast } from "sonner";

const CONTACT_EMAIL = "info@devforge3d.hu";

export const Route = createFileRoute("/kapcsolat")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Kapcsolat — DevForge3D" },
      { name: "description", content: "Lépj kapcsolatba a DevForge3D csapatával — Discord, email, weboldal." },
    ],
  }),
});

function Page() {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  async function copyEmail(e: React.MouseEvent) {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      toast.success(t("contact.copied") || "Email copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy failed");
    }
  }

  return (
    <>
      <section className="bg-hero py-16 grid-bg">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold">{t("contact.title")}</h1>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-xl p-6 card-hover text-center group relative">
            <Mail className="h-10 w-10 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
            <h3 className="font-bold mb-1">Email</h3>
            <div className="flex items-center justify-center gap-2 mt-2">
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm text-primary hover:underline select-all">{CONTACT_EMAIL}</a>
              <button
                onClick={copyEmail}
                aria-label="Copy email"
                className="p-1.5 rounded-md border border-border hover:border-primary hover:text-primary transition-all hover:[box-shadow:var(--shadow-glow-sm)]"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
          <a href="https://discord.gg/PXGYhvbVH" target="_blank" rel="noreferrer" className="bg-card border border-border rounded-xl p-6 card-hover text-center group">
            <MessageCircle className="h-10 w-10 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
            <h3 className="font-bold mb-1">Discord</h3>
            <p className="text-sm text-primary">{t("contact.discordServer")}</p>
          </a>
          <a href="https://devforge3d.hu" target="_blank" rel="noreferrer" className="bg-card border border-border rounded-xl p-6 card-hover text-center group">
            <Globe className="h-10 w-10 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
            <h3 className="font-bold mb-1">{t("contact.website")}</h3>
            <p className="text-sm text-primary">devforge3d.hu</p>
          </a>
        </div>

        <div className="mt-12 max-w-2xl mx-auto bg-card border border-border rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">{t("contact.founders")}</h2>
          <div className="flex justify-center gap-8 mt-4 text-muted-foreground">
            <div>
              <div className="text-primary text-xl font-bold">N4ndiHun</div>
              <div className="text-xs uppercase tracking-wider">Founder</div>
            </div>
            <a href="https://guns.lol/husleves_67" target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity">
              <div className="text-primary text-xl font-bold">husleves</div>
              <div className="text-xs uppercase tracking-wider">Founder</div>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
