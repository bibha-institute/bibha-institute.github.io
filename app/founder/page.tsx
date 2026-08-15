import { env } from "cloudflare:workers";
import Link from "next/link";
import { chatGPTSignOutPath } from "../chatgpt-auth";
import { requireFounder } from "../lib/founder-auth";
import FounderDesk from "./founder-desk";

export const dynamic = "force-dynamic";

export default async function FounderPage() {
  const user = await requireFounder("/founder");
  if (!user) return <AccessDenied />;

  const [interestResult, feedbackResult] = await env.DB.batch([
    env.DB.prepare(`SELECT id, created_at, name, email, role, location, interests, contribution, status, admin_note, followed_up_at, source, confirmation_email_status, owner_email_status FROM interest_signups ORDER BY created_at DESC LIMIT 500`),
    env.DB.prepare(`SELECT id, created_at, audience, rating, message, email, status, source, notification_email_status FROM feedback ORDER BY created_at DESC LIMIT 500`),
  ]);

  return <FounderDesk userName={user.displayName} interest={(interestResult.results || []) as InterestRow[]} feedback={(feedbackResult.results || []) as FeedbackRow[]} />;
}

function AccessDenied() {
  return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#f4f1e9" }}><section style={{ maxWidth: 560, padding: 40, background: "white", border: "1px solid #d7d8cf" }}><p style={{ color: "#1f6a54", fontWeight: 800, letterSpacing: ".12em", fontSize: 11 }}>FOUNDER DESK</p><h1 style={{ fontFamily: "Georgia,serif", fontWeight: 400 }}>This account is not authorized.</h1><p>The Founder Desk is restricted to the BIBHA Institute site owner. No registration data has been shown.</p><p><Link href={chatGPTSignOutPath("/founder")}>Sign out and use the owner account →</Link></p><p><Link href="/">Return to the public website</Link></p></section></main>;
}

export type InterestRow = { id: string; created_at: number; name: string; email: string; role: string; location: string; interests: string; contribution: string | null; status: string; admin_note: string | null; followed_up_at: number | null; source: string | null; confirmation_email_status: string; owner_email_status: string };
export type FeedbackRow = { id: string; created_at: number; audience: string; rating: number; message: string; email: string | null; status: string; source: string | null; notification_email_status: string };
