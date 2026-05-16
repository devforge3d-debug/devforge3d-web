import { Link } from "@tanstack/react-router";
import logo from "@/assets/devforge-logo.png";
import { DiscordButton } from "@/components/DiscordButton";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-border mt-24 bg-card/40">
      <div className="container mx-auto px-4 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <img src={logo} alt="DevForge3D" className="h-10 w-10 rounded-full" />
            <span className="font-display font-bold text-lg tracking-wider">
              DEVFORGE<span className="text-primary">3D</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {t("footer.tagline")}
          </p>
          <DiscordButton size="sm" variant="ghost" />
        </div>

        <div>
          <h4 className="text-sm font-bold mb-3 text-primary">{t("footer.services")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/3d-nyomtatas" className="hover:text-primary">{t("nav.print")}</Link></li>
            <li><Link to="/weboldal-keszites" className="hover:text-primary">{t("nav.web")}</Link></li>
            <li><Link to="/programozas" className="hover:text-primary">{t("nav.code")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold mb-3 text-primary">{t("footer.company")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/referenciak" className="hover:text-primary">{t("nav.refs")}</Link></li>
            <li><Link to="/velemenyek" className="hover:text-primary">{t("nav.reviews")}</Link></li>
            <li><Link to="/kapcsolat" className="hover:text-primary">{t("nav.contact")}</Link></li>
            <li><Link to="/szabalyzat" className="hover:text-primary">{t("footer.policy")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold mb-3 text-primary">{t("footer.founders")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>N4ndiHun</li>
            <li>
              <a href="https://guns.lol/husleves_67" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                husleves
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} DevForge3D Development. {t("footer.rights")}
      </div>
    </footer>
  );
}
