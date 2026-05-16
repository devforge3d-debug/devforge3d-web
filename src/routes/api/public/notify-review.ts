import { createFileRoute } from "@tanstack/react-router";

const NOTIFY_TO = ["husleves41@gmail.com", "devforge3d@gmail.com"];
const FROM = "DevForge3D <onboarding@resend.dev>";

async function send(subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY missing");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({ from: FROM, to: NOTIFY_TO, subject, html }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Resend ${res.status}: ${t}`);
  }
  return res.json();
}

function esc(s: string) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export const Route = createFileRoute("/api/public/notify-review")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            type?: "review" | "contact";
            name?: string;
            email?: string;
            rating?: number;
            comment?: string;
            message?: string;
          };
          const type = body.type === "contact" ? "contact" : "review";
          const name = esc(body.name || "Névtelen");
          const email = esc(body.email || "-");

          let subject: string;
          let html: string;

          if (type === "review") {
            const rating = Number(body.rating) || 0;
            const stars = "★".repeat(rating) + "☆".repeat(Math.max(0, 5 - rating));
            subject = `Új vélemény (${rating}/5) — ${name}`;
            html = `
              <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:20px;">
                <h2 style="color:#e85d3a;">Új vélemény érkezett</h2>
                <p><b>Felhasználó:</b> ${name}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Értékelés:</b> ${stars} (${rating}/5)</p>
                <p><b>Vélemény:</b></p>
                <blockquote style="border-left:3px solid #e85d3a;padding:10px 15px;background:#f5f5f5;">${esc(body.comment || "")}</blockquote>
              </div>`;
          } else {
            subject = `Új kapcsolatfelvétel — ${name}`;
            html = `
              <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:20px;">
                <h2 style="color:#e85d3a;">Új kapcsolatfelvétel</h2>
                <p><b>Név:</b> ${name}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Üzenet:</b></p>
                <blockquote style="border-left:3px solid #e85d3a;padding:10px 15px;background:#f5f5f5;">${esc(body.message || "")}</blockquote>
              </div>`;
          }

          await send(subject, html);
          return Response.json({ ok: true });
        } catch (e) {
          console.error("notify-review failed", e);
          return Response.json(
            { ok: false, error: e instanceof Error ? e.message : "unknown" },
            { status: 500 },
          );
        }
      },
    },
  },
});
