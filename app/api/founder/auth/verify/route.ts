import { isSameOrigin, verifyFounderCode } from "../../../../lib/founder-auth";
import { allowSubmission } from "../../../../lib/rate-limit";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: "Invalid request" }, { status: 403 });
  if (!(await allowSubmission(request, "founder-auth-verify", 12))) return Response.json({ error: "Please wait before trying again" }, { status: 429 });
  const body = await request.json() as Record<string, unknown>;
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 160) : "";
  const code = typeof body.code === "string" ? body.code.trim() : "";
  const session = await verifyFounderCode(email, code);
  if (!session) return Response.json({ error: "Invalid or expired code" }, { status: 401, headers: { "cache-control": "no-store" } });
  return Response.json({ ok: true, expiresAt: session.expiresAt }, { headers: { "cache-control": "no-store", "set-cookie": session.cookie } });
}
