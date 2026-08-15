import { env } from "cloudflare:workers";

export async function allowSubmission(request: Request, scope: string, maximum = 6) {
  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  return allowSubmissionKey(scope, ip, maximum);
}

export async function allowSubmissionKey(scope: string, identifier: string, maximum = 6) {
  const hour = Math.floor(Date.now() / 3_600_000);
  const key = await sha256(`${scope}:${identifier}:${hour}`);
  const db = env.DB;
  await db.prepare(`INSERT INTO submission_limits (key, count, expires_at) VALUES (?, 1, ?)
    ON CONFLICT(key) DO UPDATE SET count = count + 1`).bind(key, (hour + 2) * 3_600_000).run();
  const row = await db.prepare("SELECT count FROM submission_limits WHERE key = ?").bind(key).first<{ count: number }>();
  if (Math.random() < 0.03) await db.prepare("DELETE FROM submission_limits WHERE expires_at < ?").bind(Date.now()).run();
  return (row?.count || 0) <= maximum;
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}
