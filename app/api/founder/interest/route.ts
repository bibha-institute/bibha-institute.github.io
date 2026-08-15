import { env } from "cloudflare:workers";
import { isFounderRequest } from "../../../lib/founder-auth";

const allowedStatuses = new Set(["new", "reviewing", "contacted", "shortlisted", "closed"]);

export async function PATCH(request: Request) {
  if (!(await isFounderRequest())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json() as Record<string, unknown>;
  const id = clean(body.id, 80);
  const status = clean(body.status, 30);
  const adminNote = clean(body.adminNote, 1200);
  if (!id || !allowedStatuses.has(status)) return Response.json({ error: "Invalid update" }, { status: 400 });
  const now = Date.now();
  await env.DB.prepare(`UPDATE interest_signups SET status = ?, admin_note = ?, updated_at = ?, followed_up_at = CASE WHEN ? = 'contacted' THEN ? ELSE followed_up_at END WHERE id = ?`)
    .bind(status, adminNote || null, now, status, now, id).run();
  return Response.json({ ok: true, updatedAt: now });
}

function clean(value: unknown, max: number) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }
