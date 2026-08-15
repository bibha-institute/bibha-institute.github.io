import { env } from "cloudflare:workers";
import { headers } from "next/headers";

const COOKIE_NAME = "__Host-bibha_founder_session";
const CODE_LIFETIME_MS = 10 * 60 * 1000;
const SESSION_LIFETIME_MS = 12 * 60 * 60 * 1000;
const MAX_CODE_ATTEMPTS = 5;

type RuntimeEnv = {
  FOUNDER_AUTH_EMAIL?: string;
  FOUNDER_SESSION_SECRET?: string;
};

export type FounderSession = {
  displayName: string;
  email: string;
  expiresAt: number;
};

function runtime() {
  return env as unknown as RuntimeEnv;
}

export function configuredFounderEmail() {
  return (runtime().FOUNDER_AUTH_EMAIL || "").trim().toLowerCase();
}

function sessionSecret() {
  return (runtime().FOUNDER_SESSION_SECRET || "").trim();
}

export function founderAuthConfigured() {
  return Boolean(configuredFounderEmail() && sessionSecret());
}

export async function createFounderCode(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!founderAuthConfigured() || normalizedEmail !== configuredFounderEmail()) return null;
  const code = randomSixDigitCode();
  const now = Date.now();
  const codeHash = await hmacHex(`code:${normalizedEmail}:${code}`);
  await env.DB.batch([
    env.DB.prepare("DELETE FROM founder_auth_codes WHERE email = ? OR expires_at < ?").bind(normalizedEmail, now),
    env.DB.prepare("INSERT INTO founder_auth_codes (id, email, code_hash, created_at, expires_at, attempts) VALUES (?, ?, ?, ?, ?, 0)")
      .bind(crypto.randomUUID(), normalizedEmail, codeHash, now, now + CODE_LIFETIME_MS),
  ]);
  return code;
}

export async function verifyFounderCode(email: string, code: string) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!founderAuthConfigured() || normalizedEmail !== configuredFounderEmail() || !/^\d{6}$/.test(code)) return null;
  const now = Date.now();
  const row = await env.DB.prepare(`SELECT id, code_hash, attempts, expires_at FROM founder_auth_codes
    WHERE email = ? AND consumed_at IS NULL ORDER BY created_at DESC LIMIT 1`)
    .bind(normalizedEmail).first<{ id: string; code_hash: string; attempts: number; expires_at: number }>();
  if (!row || row.expires_at < now || row.attempts >= MAX_CODE_ATTEMPTS) return null;
  const candidateHash = await hmacHex(`code:${normalizedEmail}:${code}`);
  if (!constantTimeEqual(candidateHash, row.code_hash)) {
    await env.DB.prepare("UPDATE founder_auth_codes SET attempts = attempts + 1 WHERE id = ?").bind(row.id).run();
    return null;
  }
  const token = randomToken();
  const tokenHash = await hmacHex(`session:${token}`);
  const expiresAt = now + SESSION_LIFETIME_MS;
  await env.DB.batch([
    env.DB.prepare("UPDATE founder_auth_codes SET consumed_at = ? WHERE id = ?").bind(now, row.id),
    env.DB.prepare("INSERT INTO founder_sessions (token_hash, email, created_at, expires_at, last_seen_at) VALUES (?, ?, ?, ?, ?)")
      .bind(tokenHash, normalizedEmail, now, expiresAt, now),
    env.DB.prepare("DELETE FROM founder_sessions WHERE expires_at < ?").bind(now),
  ]);
  return { cookie: sessionCookie(token, SESSION_LIFETIME_MS / 1000), expiresAt };
}

export async function getFounderSession(request?: Request): Promise<FounderSession | null> {
  if (!founderAuthConfigured()) return null;
  const cookieHeader = request ? request.headers.get("cookie") : (await headers()).get("cookie");
  const token = readCookie(cookieHeader, COOKIE_NAME);
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const tokenHash = await hmacHex(`session:${token}`);
  const now = Date.now();
  const row = await env.DB.prepare("SELECT email, expires_at FROM founder_sessions WHERE token_hash = ?")
    .bind(tokenHash).first<{ email: string; expires_at: number }>();
  if (!row || row.expires_at < now || row.email !== configuredFounderEmail()) {
    if (row) await env.DB.prepare("DELETE FROM founder_sessions WHERE token_hash = ?").bind(tokenHash).run();
    return null;
  }
  if (Math.random() < 0.1) {
    await env.DB.prepare("UPDATE founder_sessions SET last_seen_at = ? WHERE token_hash = ?").bind(now, tokenHash).run();
  }
  return { displayName: "Khalid Saifullah", email: row.email, expiresAt: row.expires_at };
}

export async function isFounderRequest(request: Request) {
  return Boolean(await getFounderSession(request));
}

export async function destroyFounderSession(request: Request) {
  const token = readCookie(request.headers.get("cookie"), COOKIE_NAME);
  if (token && /^[a-f0-9]{64}$/.test(token) && founderAuthConfigured()) {
    const tokenHash = await hmacHex(`session:${token}`);
    await env.DB.prepare("DELETE FROM founder_sessions WHERE token_hash = ?").bind(tokenHash).run();
  }
}

export function clearFounderCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return Boolean(origin && origin === new URL(request.url).origin);
}

function sessionCookie(token: string, maxAgeSeconds: number) {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${Math.floor(maxAgeSeconds)}`;
}

function readCookie(header: string | null, name: string) {
  if (!header) return "";
  for (const part of header.split(";")) {
    const [key, ...valueParts] = part.trim().split("=");
    if (key === name) return valueParts.join("=");
  }
  return "";
}

function randomToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
}

function randomSixDigitCode() {
  const upperBound = 0x1_0000_0000 - (0x1_0000_0000 % 1_000_000);
  const values = new Uint32Array(1);
  do crypto.getRandomValues(values); while (values[0] >= upperBound);
  return String(values[0] % 1_000_000).padStart(6, "0");
}

async function hmacHex(value: string) {
  const secret = sessionSecret();
  if (!secret) return "";
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(signature), byte => byte.toString(16).padStart(2, "0")).join("");
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return mismatch === 0;
}
