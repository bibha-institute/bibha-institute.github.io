import { env } from "cloudflare:workers";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    if (body.company) return Response.json({ ok: true });
    const name = clean(body.name, 100);
    const email = clean(body.email, 160).toLowerCase();
    const role = clean(body.role, 120);
    const location = clean(body.location, 120);
    const interests = clean(body.interests, 240);
    const contribution = clean(body.contribution, 700);
    if (!name || !email.includes("@") || !role || !location || !interests || body.consent !== "yes") return Response.json({ error: "Invalid submission" }, { status: 400 });
    await env.DB.prepare(`INSERT INTO interest_signups (id, created_at, name, email, role, location, interests, contribution, consent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
      ON CONFLICT(email) DO UPDATE SET name = excluded.name, role = excluded.role, location = excluded.location,
      interests = excluded.interests, contribution = excluded.contribution, consent = 1, created_at = excluded.created_at`)
      .bind(crypto.randomUUID(), Date.now(), name, email, role, location, interests, contribution || null).run();
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Unable to save" }, { status: 500 });
  }
}

function clean(value: unknown, max: number) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }
