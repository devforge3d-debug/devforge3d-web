import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { StarRating } from "./StarRating";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface Review {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles?: { display_name: string } | null;
}

export function Reviews() {
  const { user, isAdmin } = useAuth();
  const { t, lang } = useI18n();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [myReview, setMyReview] = useState<Review | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    const { data: r } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (r && r.length) {
      const ids = [...new Set(r.map((x) => x.user_id))];
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, display_name")
        .in("id", ids);
      const map = new Map(profs?.map((p) => [p.id, p]) || []);
      const enriched = r.map((x) => ({ ...x, profiles: map.get(x.user_id) || null }));
      setReviews(enriched);
      const mine = enriched.find((x) => x.user_id === user?.id) || null;
      setMyReview(mine);
      if (mine) {
        setRating(mine.rating);
        setComment(mine.comment);
      }
    } else {
      setReviews([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [user?.id]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (comment.trim().length < 5) {
      toast.error(t("reviews.min"));
      return;
    }
    setSubmitting(true);
    const payload = { user_id: user.id, rating, comment: comment.trim() };
    const { error } = myReview
      ? await supabase.from("reviews").update(payload).eq("id", myReview.id)
      : await supabase.from("reviews").insert(payload);
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(myReview ? t("reviews.updated") : t("reviews.thanks"));
      // Fire-and-forget email notification
      fetch("/api/public/notify-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "review",
          name: user.email?.split("@")[0] || "Felhasználó",
          email: user.email,
          rating,
          comment: comment.trim(),
        }),
      }).catch(() => {});
      load();
    }
  }

  async function remove(id: string) {
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(t("reviews.deleted")); load(); }
  }

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h2 className="text-4xl font-bold mb-3">{t("reviews.title")}</h2>
        <p className="text-muted-foreground">{t("reviews.subtitle")}</p>
        {reviews.length > 0 && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <StarRating value={Math.round(avg)} size={28} />
            <span className="text-2xl font-bold text-gradient">{avg.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">({reviews.length} {t("reviews.count")})</span>
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto bg-card border border-border rounded-xl p-6 mb-10 card-hover">
        <h3 className="text-xl font-bold mb-4">
          {user ? (myReview ? t("reviews.edit") : t("reviews.write")) : t("reviews.write")}
        </h3>
        {!user ? (
          <p className="text-muted-foreground text-sm">
            {t("reviews.loginPrefix")} <Link to="/auth" className="text-primary underline">{t("reviews.loginLink")}</Link>.
            ({t("reviews.onePerUser")})
          </p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">{t("reviews.rating")}</label>
              <StarRating value={rating} interactive onChange={setRating} size={32} />
            </div>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("reviews.placeholder")}
              maxLength={1000}
              rows={4}
              required
            />
            <Button type="submit" variant="hero" disabled={submitting}>
              {myReview ? t("reviews.update") : t("reviews.submit")}
            </Button>
          </form>
        )}
      </div>

      <div className="grid gap-4 max-w-3xl mx-auto">
        {loading ? (
          <p className="text-center text-muted-foreground">{t("reviews.loading")}</p>
        ) : reviews.length === 0 ? (
          <p className="text-center text-muted-foreground">{t("reviews.empty")}</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="bg-card border border-border rounded-lg p-5 card-hover">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-[image:var(--gradient-primary)] flex items-center justify-center text-sm font-bold text-primary-foreground">
                    {r.profiles?.display_name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{r.profiles?.display_name || t("reviews.user")}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString(lang === "hu" ? "hu-HU" : "en-US")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StarRating value={r.rating} size={16} />
                  {(isAdmin || r.user_id === user?.id) && (
                    <button onClick={() => remove(r.id)} className="text-muted-foreground hover:text-destructive p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed">{r.comment}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
