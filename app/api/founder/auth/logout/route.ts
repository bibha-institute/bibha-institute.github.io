import { clearFounderCookie, destroyFounderSession, isSameOrigin } from "../../../../lib/founder-auth";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return new Response("Invalid request", { status: 403 });
  await destroyFounderSession(request);
  return new Response(null, { status: 303, headers: { location: "/founder/login", "set-cookie": clearFounderCookie(), "cache-control": "no-store" } });
}
