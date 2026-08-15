import { env } from "cloudflare:workers";
import { sendInterestEmails } from "../../lib/email";
import { allowSubmission } from "../../lib/rate-limit";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    if (body.company) return Response.json({ ok: true });
    if (!validTiming(body.submittedAt) || !(await allowSubmission(request, "interest", 5))) return Response.json({ error: "Please wait before trying again" }, { status: 429 });
    const name = clean(body.name, 100);
    const email = clean(body.email, 160).toLowerCase();
    const role = clean(body.role, 120);
    const location = clean(body.location, 120);
    const interests = clean(body.interests, 240);
    const contribution = clean(body.contribution, 700);
    const source = clean(body.source, 180);
    if (!name || !email.includes("@") || !role || !location || !interests || body.consent !== "yes") return Response.json({ error: "Invalid submission" }, { status: 400 });
    const now = Date.now();
    const id = crypto.randomUUID();
    await env.DB.prepare(`INSERT INTO interest_signups (id, created_at, name, email, role, location, interests, contribution, consent, consent_version, status, updated_at, source)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, '2026-08-bibha-v2.1', 'new', ?, ?)
      ON CONFLICT(email) DO UPDATE SET name = excluded.name, role = excluded.role, location = excluded.location,
      interests = excluded.interests, contribution = excluded.contribution, consent = 1, consent_version = excluded.consent_version,
      updated_at = excluded.updated_at, source = excluded.source`)
      .bind(id, now, name, email, role, location, interests, contribution || null, now, source || null).run();
    const emailStatus = await sendInterestEmails({ name, email, role, location, interests, contribution });
    await env.DB.prepare(`UPDATE interest_signups SET confirmation_email_status = ?, owner_email_status = ? WHERE email = ?`)
      .bind(emailStatus.confirmation, emailStatus.owner, email).run();
    return Response.json({ ok: true, confirmation: emailStatus.confirmation });
  } catch {
    return Response.json({ error: "Unable to save" }, { status: 500 });
  }
}

function clean(value: unknown, max: number) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }
function validTiming(value: unknown) {
  const started = Number(value);
  return Number.isFinite(started) && Date.now() - started >= 1800 && Date.now() - started < 86_400_000;
}
