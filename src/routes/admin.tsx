import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Upload, Trash2, Shield, Star, Image as ImageIcon, ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const ADMIN_EMAILS = ["devforge3d@gmail.com", "husleves41@gmail.com"];

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Admin — DevForge3D" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

const CATEGORIES = ["fivem", "3d", "weboldal", "egyeb"] as const;

interface Ref {
  id: string; title: string; description: string | null; category: string;
  image_url: string | null; link_url: string | null;
}
interface Review {
  id: string; user_id: string; rating: number; comment: string; created_at: string;
}

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const emailOk = !!user && ADMIN_EMAILS.includes((user.email || "").toLowerCase());
  const allowed = isAdmin && emailOk;

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  if (loading) {
    return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">{t("refs.loading")}</div>;
  }

  if (!allowed) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-xl text-center">
        <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-3">{t("admin.deniedTitle")}</h1>
        <p className="text-muted-foreground mb-6">
          {t("admin.deniedText")}
        </p>
        <Button asChild variant="outlineGlow"><Link to="/">{t("admin.backHome")}</Link></Button>
      </div>
    );
  }

  return (
    <>
      <section className="bg-hero py-12 grid-bg border-b border-primary/20">
        <div className="container mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs text-primary uppercase tracking-wider mb-3">
            <Shield className="h-3 w-3" /> {t("admin.badge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">{t("admin.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("admin.subtitle")}</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 space-y-12">
        <ReferencesPanel />
        <ReviewsPanel />
      </section>
    </>
  );
}

function ReferencesPanel() {
  const { t } = useI18n();
  const [refs, setRefs] = useState<Ref[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("references").select("*").order("created_at", { ascending: false });
    setRefs(data || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm(t("admin.deleteRef"))) return;
    const { error } = await supabase.from("references").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(t("refs.deleted")); load(); }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <ImageIcon className="h-5 w-5 text-primary" /> {t("admin.refs")}
      </h2>
      <UploadForm onDone={load} />

      {loading ? (
        <p className="text-muted-foreground">{t("refs.loading")}</p>
      ) : refs.length === 0 ? (
        <p className="text-muted-foreground">{t("admin.noRefs")}</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {refs.map((r) => (
            <div key={r.id} className="bg-card border border-border rounded-xl overflow-hidden card-hover">
              <div className="aspect-video bg-muted relative">
                {r.image_url ? (
                  <img src={r.image_url} alt={r.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-10 w-10" />
                  </div>
                )}
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] uppercase bg-background/80 border border-primary/40 text-primary">
                  {t(`cat.${r.category}`) || r.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold">{r.title}</h3>
                {r.description && <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{r.description}</p>}
                <div className="flex justify-between items-center mt-3">
                  {r.link_url ? (
                    <a href={r.link_url} target="_blank" rel="noreferrer" className="text-xs text-primary inline-flex items-center gap-1 hover:underline">
                      {t("refs.open")} <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : <span />}
                  <button onClick={() => remove(r.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UploadForm({ onDone }: { onDone: () => void }) {
  const { user } = useAuth();
  const { t } = useI18n();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("fivem");
  const [linkUrl, setLinkUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    let image_url: string | null = null;
    if (file) {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("references").upload(path, file);
      if (upErr) { toast.error(t("refs.uploadError") + upErr.message); setBusy(false); return; }
      image_url = supabase.storage.from("references").getPublicUrl(path).data.publicUrl;
    }
    const { error } = await supabase.from("references").insert({
      title, description: description || null, category,
      image_url, link_url: linkUrl || null, created_by: user.id,
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success(t("refs.success"));
      setTitle(""); setDescription(""); setLinkUrl(""); setFile(null);
      onDone();
    }
  }

  return (
    <form onSubmit={submit} className="bg-card border border-primary/30 rounded-xl p-6 space-y-4 ring-orange-soft">
      <h3 className="text-lg font-bold flex items-center gap-2"><Upload className="h-5 w-5 text-primary" /> {t("refs.formTitle")}</h3>
      <Input placeholder={t("refs.inputTitle")} value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={120} />
      <Textarea placeholder={t("refs.inputDesc")} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} />
      <div className="grid sm:grid-cols-2 gap-3">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-input border border-border rounded-md px-3 py-2 text-sm">
          {CATEGORIES.map((c) => <option key={c} value={c}>{t(`cat.${c}`)}</option>)}
        </select>
        <Input placeholder={t("refs.inputLink")} value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
      </div>
      <div>
        <label className="text-sm text-muted-foreground block mb-2">{t("refs.image")}</label>
        <input id="reference-image-admin" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="sr-only" />
        <label htmlFor="reference-image-admin" className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4 transition-all hover:border-primary hover:bg-primary/10 hover:[box-shadow:var(--shadow-glow-sm)]">
          <span className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><ImageIcon className="h-5 w-5" /></span>
            <span>
              <span className="block text-sm font-semibold">{file ? `${t("refs.imageSelected")}: ${file.name}` : t("refs.imagePick")}</span>
              <span className="block text-xs text-muted-foreground">{t("refs.imageHint")}</span>
            </span>
          </span>
          <Upload className="h-4 w-4 text-primary" />
        </label>
      </div>
      <Button type="submit" variant="hero" disabled={busy}>{busy ? t("refs.uploading") : t("refs.upload")}</Button>
    </form>
  );
}

function ReviewsPanel() {
  const { t, lang } = useI18n();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
    setReviews(data || []);
    if (data && data.length) {
      const ids = [...new Set(data.map((r) => r.user_id))];
      const { data: ps } = await supabase.from("profiles").select("id,display_name").in("id", ids);
      const map: Record<string, string> = {};
      ps?.forEach((p) => { map[p.id] = p.display_name; });
      setProfiles(map);
    }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm(t("admin.deleteReview"))) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(t("admin.reviewDeleted")); load(); }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Star className="h-5 w-5 text-primary" /> {t("admin.reviews")}
      </h2>
      {loading ? (
        <p className="text-muted-foreground">{t("refs.loading")}</p>
      ) : reviews.length === 0 ? (
        <p className="text-muted-foreground">{t("admin.noReviews")}</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-card border border-border rounded-xl p-4 flex justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{profiles[r.user_id] || t("admin.unknown")}</span>
                  <span className="text-primary text-sm">
                    {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString(lang === "hu" ? "hu-HU" : "en-US")}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{r.comment}</p>
              </div>
              <button onClick={() => remove(r.id)} className="text-muted-foreground hover:text-destructive shrink-0">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
