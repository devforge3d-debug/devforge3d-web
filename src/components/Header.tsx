import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, LogOut, User as UserIcon, Shield } from "lucide-react";
import logo from "@/assets/devforge-logo.png";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { Button } from "@/components/ui/button";

export function Header() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const { t } = useI18n();

  const navItems = [
    { to: "/", label: t("nav.home") },
    { to: "/3d-nyomtatas", label: t("nav.print") },
    { to: "/weboldal-keszites", label: t("nav.web") },
    { to: "/programozas", label: t("nav.code") },
    { to: "/referenciak", label: t("nav.refs") },
    { to: "/velemenyek", label: t("nav.reviews") },
    { to: "/kapcsolat", label: t("nav.contact") },
  ] as const;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="DevForge3D logó"
            className="h-11 w-11 rounded-full transition-all group-hover:scale-110 group-hover:[box-shadow:var(--shadow-glow-sm)]"
          />
          <div className="hidden sm:block leading-tight">
            <div className="font-display text-lg font-bold tracking-wider">
              DEVFORGE<span className="text-primary">3D</span>
            </div>
            <div className="text-[10px] uppercase text-muted-foreground tracking-widest">
              FiveM Development
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
              <span className="absolute inset-x-3 -bottom-px h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform" />
            </Link>
          ))}
          <div className="ml-2 pl-2 border-l border-border">
            <LanguageSwitch />
          </div>
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          {isAdmin && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs uppercase tracking-wider bg-primary/10 border border-primary/40 text-primary hover:bg-primary/20 hover:[box-shadow:var(--shadow-glow-sm)] transition-all"
            >
              <Shield className="h-3 w-3" /> {t("nav.admin")}
            </Link>
          )}
          {user ? (
            <>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <UserIcon className="h-3 w-3" />
                {user.email}
              </span>
              <Button size="sm" variant="ghost" onClick={signOut} aria-label={t("auth.logout")}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button asChild size="sm" variant="hero">
              <Link to="/auth">{t("auth.login")}</Link>
            </Button>
          )}
        </div>

        <div className="lg:hidden flex items-center gap-2">
          <LanguageSwitch compact />
          <button
            className="p-2 text-foreground"
            onClick={() => setOpen(!open)}
            aria-label="Menü"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-md text-sm hover:bg-muted hover:text-primary"
                activeProps={{ className: "text-primary bg-muted" }}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border mt-2 space-y-2">
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-primary/10 border border-primary/40 text-primary"
                >
                  <Shield className="h-4 w-4" /> {t("nav.admin")}
                </Link>
              )}
              {user ? (
                <Button onClick={() => { signOut(); setOpen(false); }} variant="ghost" className="w-full justify-start">
                  <LogOut className="h-4 w-4 mr-2" /> {t("auth.logout")}
                </Button>
              ) : (
                <Button asChild variant="hero" className="w-full">
                  <Link to="/auth" onClick={() => setOpen(false)}>{t("auth.loginRegister")}</Link>
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
