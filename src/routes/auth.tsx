import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import logo from "@/assets/devforge-logo.png";

export const Route = createFileRoute("/auth")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Belépés / Regisztráció — DevForge3D" },
      { name: "description", content: "Jelentkezz be vagy regisztrálj a DevForge3D fiókoddal." },
    ],
  }),
});

function Page() {
  const { user } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/" });
  }, [user, navigate]);

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "register" && password !== passwordConfirm) {
      toast.error(t("auth.passwordMismatch"));
      return;
    }
    setBusy(true);
    if (mode === "register") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
          data: { display_name: displayName || email.split("@")[0] },
        },
      });
      if (error) toast.error(error.message);
      else toast.success(t("auth.success.register"));
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
      else toast.success(t("auth.success.login"));
    }
    setBusy(false);
  }

  const mismatch = mode === "register" && passwordConfirm.length > 0 && password !== passwordConfirm;

  return (
    <section className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12 bg-hero grid-bg">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 ring-orange-soft">
        <div className="text-center mb-6">
          <img src={logo} alt="DevForge3D" className="h-16 w-16 mx-auto rounded-full mb-3" />
          <h1 className="text-2xl font-bold">
            {mode === "login" ? t("auth.welcomeBack") : t("auth.register")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "login" ? t("auth.signInToAccount") : t("auth.createAccount")}
          </p>
        </div>

        <form onSubmit={handle} className="space-y-4">
          {mode === "register" && (
            <div>
              <Label htmlFor="name">{t("auth.displayName")}</Label>
              <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={40} />
            </div>
          )}
          <div>
            <Label htmlFor="email">{t("auth.email")}</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">{t("auth.password")}</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          {mode === "register" && (
            <div>
              <Label htmlFor="password2">{t("auth.passwordConfirm")}</Label>
              <Input
                id="password2"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                minLength={6}
                className={mismatch ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {mismatch && (
                <p className="text-xs text-destructive mt-1">{t("auth.passwordMismatch")}</p>
              )}
            </div>
          )}
          <Button type="submit" variant="hero" className="w-full" size="lg" disabled={busy || mismatch}>
            {busy ? t("auth.processing") : mode === "login" ? t("auth.login") : t("auth.register")}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          {mode === "login" ? (
            <>
              {t("auth.noAccount")}{" "}
              <button onClick={() => setMode("register")} className="text-primary hover:underline">
                {t("auth.registerNow")}
              </button>
            </>
          ) : (
            <>
              {t("auth.haveAccount")}{" "}
              <button onClick={() => { setMode("login"); setPasswordConfirm(""); }} className="text-primary hover:underline">
                {t("auth.login")}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
