import { createFounderCode, configuredFounderEmail, isSameOrigin } from "../../../../lib/founder-auth";
import { sendFounderLoginCode } from "../../../../lib/email";
import { allowSubmission, allowSubmissionKey } from "../../../../lib/rate-limit";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: "Invalid request" }, { status: 403 });
  if (!(await allowSubmission(request, "founder-auth-request", 4))) return Response.json({ error: "Please wait before trying again" }, { status: 429 });
  const body = await request.json() as Record<string, unknown>;
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 160) : "";
  if (!(await allowSubmissionKey("founder-auth-email", email || "empty", 4))) return Response.json({ error: "Please wait before trying again" }, { status: 429 });
  const code = await createFounderCode(email);
  if (code) {
    const delivery = await sendFounderLoginCode(configuredFounderEmail(), code);
    if (delivery !== "sent") return Response.json({ error: "Unable to send code" }, { status: 503 });
  }
  return Response.json({ ok: true }, { headers: { "cache-control": "no-store" } });
}
