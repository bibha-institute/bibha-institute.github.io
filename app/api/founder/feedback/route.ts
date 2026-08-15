import { env } from "cloudflare:workers";
import { isFounderRequest, isSameOrigin } from "../../../lib/founder-auth";

export async function PATCH(request: Request) {
  if (!isSameOrigin(request) || !(await isFounderRequest(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json() as Record<string, unknown>;
  const id = typeof body.id === "string" ? body.id.trim().slice(0, 80) : "";
  const status = body.status === "reviewed" ? "reviewed" : body.status === "new" ? "new" : "";
  if (!id || !status) return Response.json({ error: "Invalid update" }, { status: 400 });
  await env.DB.prepare("UPDATE feedback SET status = ? WHERE id = ?").bind(status, id).run();
  return Response.json({ ok: true });
}
