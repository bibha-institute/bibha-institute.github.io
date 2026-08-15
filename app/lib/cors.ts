const ALLOWED_PUBLIC_ORIGINS = new Set([
  "https://kingkhalid310.github.io",
]);

function corsHeaders(request: Request) {
  const headers = new Headers();
  const origin = request.headers.get("origin");
  if (origin && ALLOWED_PUBLIC_ORIGINS.has(origin)) {
    headers.set("access-control-allow-origin", origin);
    headers.set("access-control-allow-methods", "POST, OPTIONS");
    headers.set("access-control-allow-headers", "content-type");
    headers.set("access-control-max-age", "86400");
    headers.set("vary", "Origin");
  }
  return headers;
}

export function publicJson(request: Request, body: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  corsHeaders(request).forEach((value, key) => headers.set(key, value));
  return Response.json(body, { ...init, headers });
}

export function publicPreflight(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}
