import { env } from "cloudflare:workers";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    if (body.website) return Response.json({ ok: true });
    const audience = clean(body.audience, 120);
    const rating = Number(body.rating);
    const message = clean(body.message, 1200);
    if (!audience || !Number.isInteger(rating) || rating < 1 || rating > 5 || !message) return Response.json({ error: "Invalid submission" }, { status: 400 });
    await env.DB.prepare("INSERT INTO feedback (id, created_at, audience, rating, message) VALUES (?, ?, ?, ?, ?)")
      .bind(crypto.randomUUID(), Date.now(), audience, rating, message).run();
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Unable to save" }, { status: 500 });
  }
}

function clean(value: unknown, max: number) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }
