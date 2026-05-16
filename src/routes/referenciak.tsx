import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, ExternalLink, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/referenciak")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Referenciák — DevForge3D" },
      { name: "description", content: "Korábbi projektjeink és munkáink bemutatása." },
    ],
  }),
});

interface Ref {
  id: string;
  title: string;
  description: string | null;
  category: string;
  image_url: string | null;
  link_url: string | null;
  created_at: string;
}

const CATEGORIES = ["fivem", "3d", "weboldal", "egyeb"] as const;

function Page() {
  const { isAdmin, user } = useAuth();
  const { t } = useI18n();
  const [refs, setRefs] = useState<Ref[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("references").select("*").order("created_at", { ascending: false });
    setRefs(data || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm(t("refs.deleteConfirm"))) return;
    const { error } = await supabase.from("references").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(t("refs.deleted")); load(); }
  }

  const filtered = filter === "all" ? refs : refs.filter((r) => r.category === filter);

  return (
    <>
      <section className="bg-hero py-16 grid-bg">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold">{t("refs.title")}</h1>
          <p className="text-muted-foreground mt-4">{t("refs.subtitle")}</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <FilterBtn active={filter === "all"} onClick={() => setFilter("all")}>{t("refs.all")}</FilterBtn>
            {CATEGORIES.map((c) => (
              <FilterBtn key={c} active={filter === c} onClick={() => setFilter(c)}>
                {t(`cat.${c}`)}
              </FilterBtn>
            ))}
          </div>
          {isAdmin && (
            <Button variant="hero" onClick={() => setShowForm(!showForm)}>
              <Plus /> {showForm ? t("refs.close") : t("refs.new")}
            </Button>
          )}
        </div>

        {!user && (
          <p className="text-xs text-muted-foreground mb-4">
            {t("refs.adminOnly")} <Link to="/auth" className="text-primary underline">{t("refs.login")}</Link>
          </p>
        )}

        {showForm && isAdmin && <UploadForm onDone={() => { setShowForm(false); load(); }} />}

        {loading ? (
          <p className="text-center text-muted-foreground py-12">{t("refs.loading")}</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">{t("refs.empty")}</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((r) => (
              <article key={r.id} className="bg-card border border-border rounded-xl overflow-hidden card-hover group relative">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {r.image_url ? (
                    <img src={r.image_url} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <ImageIcon className="h-12 w-12" />
                    </div>
                  )}
                  <span className="absolute top-2 right-2 px-2 py-1 rounded-md text-[10px] uppercase tracking-wider bg-background/80 backdrop-blur border border-primary/40 text-primary">
                    {t(`cat.${r.category}`) || r.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-1">{r.title}</h3>
                  {r.description && <p className="text-sm text-muted-foreground line-clamp-3">{r.description}</p>}
                  <div className="flex items-center justify-between mt-4">
                    {r.link_url ? (
                      <a href={r.link_url} target="_blank" rel="noreferrer" className="text-xs text-primary inline-flex items-center gap-1 hover:underline">
                        {t("refs.open")} <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : <span />}
                    {isAdmin && (
                      <button onClick={() => remove(r.id)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function FilterBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
        active
          ? "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow-sm)]"
          : "bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary"
      }`}
    >
      {children}
    </button>
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
      if (upErr) {
        toast.error(t("refs.uploadError") + upErr.message);
        setBusy(false);
        return;
      }
      image_url = supabase.storage.from("references").getPublicUrl(path).data.publicUrl;
    }
    const { error } = await supabase.from("references").insert({
      title,
      description: description || null,
      category,
      image_url,
      link_url: linkUrl || null,
      created_by: user.id,
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else { toast.success(t("refs.success")); onDone(); }
  }

  return (
    <form onSubmit={submit} className="bg-card border border-primary/30 rounded-xl p-6 mb-8 space-y-4 ring-orange-soft">
      <h3 className="text-xl font-bold flex items-center gap-2"><Upload className="h-5 w-5 text-primary" /> {t("refs.formTitle")}</h3>
      <Input placeholder={t("refs.inputTitle")} value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={120} />
      <Textarea placeholder={t("refs.inputDesc")} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} />
      <div className="grid sm:grid-cols-2 gap-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-input border border-border rounded-md px-3 py-2 text-sm"
        >
          {CATEGORIES.map((c) => <option key={c} value={c}>{t(`cat.${c}`)}</option>)}
        </select>
        <Input placeholder={t("refs.inputLink")} value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
      </div>
      <div>
        <label className="text-sm text-muted-foreground block mb-2">{t("refs.image")}</label>
        <input
          id="reference-image-public"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="sr-only"
        />
        <label htmlFor="reference-image-public" className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4 transition-all hover:border-primary hover:bg-primary/10 hover:[box-shadow:var(--shadow-glow-sm)]">
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
      <Button type="submit" variant="hero" disabled={busy}>
        {busy ? t("refs.uploading") : t("refs.upload")}
      </Button>
    </form>
  );
}
