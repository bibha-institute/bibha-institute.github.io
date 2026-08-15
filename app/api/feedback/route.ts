import { env } from "cloudflare:workers";
import { sendFeedbackNotification } from "../../lib/email";
import { allowSubmission } from "../../lib/rate-limit";
import { publicJson, publicPreflight } from "../../lib/cors";

export async function OPTIONS(request: Request) { return publicPreflight(request); }

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    if (body.website) return publicJson(request, { ok: true });
    if (!validTiming(body.submittedAt) || !(await allowSubmission(request, "feedback", 8))) return publicJson(request, { error: "Please wait before trying again" }, { status: 429 });
    const audience = clean(body.audience, 120);
    const rating = Number(body.rating);
    const message = clean(body.message, 1200);
    const email = clean(body.email, 160).toLowerCase();
    const source = clean(body.source, 180);
    if (email && !email.includes("@")) return publicJson(request, { error: "Invalid email" }, { status: 400 });
    if (!audience || !Number.isInteger(rating) || rating < 1 || rating > 5 || !message) return publicJson(request, { error: "Invalid submission" }, { status: 400 });
    const id = crypto.randomUUID();
    await env.DB.prepare("INSERT INTO feedback (id, created_at, audience, rating, message, email, status, source) VALUES (?, ?, ?, ?, ?, ?, 'new', ?)")
      .bind(id, Date.now(), audience, rating, message, email || null, source || null).run();
    const notification = await sendFeedbackNotification({ audience, rating, message, email });
    await env.DB.prepare("UPDATE feedback SET notification_email_status = ? WHERE id = ?").bind(notification, id).run();
    return publicJson(request, { ok: true });
  } catch {
    return publicJson(request, { error: "Unable to save" }, { status: 500 });
  }
}

function clean(value: unknown, max: number) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }
function validTiming(value: unknown) {
  const started = Number(value);
  return Number.isFinite(started) && Date.now() - started >= 1200 && Date.now() - started < 86_400_000;
}
