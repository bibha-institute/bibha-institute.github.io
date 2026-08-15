import { env } from "cloudflare:workers";
import { redirect } from "next/navigation";
import { getFounderSession } from "../lib/founder-auth";
import FounderDesk from "./founder-desk";

export const dynamic = "force-dynamic";

export default async function FounderPage() {
  const user = await getFounderSession();
  if (!user) redirect("/founder/login");

  const [interestResult, feedbackResult] = await env.DB.batch([
    env.DB.prepare(`SELECT id, created_at, name, email, role, location, interests, contribution, status, admin_note, followed_up_at, source, confirmation_email_status, owner_email_status FROM interest_signups ORDER BY created_at DESC LIMIT 500`),
    env.DB.prepare(`SELECT id, created_at, audience, rating, message, email, status, source, notification_email_status FROM feedback ORDER BY created_at DESC LIMIT 500`),
  ]);

  return <FounderDesk userName={user.displayName} interest={(interestResult.results || []) as InterestRow[]} feedback={(feedbackResult.results || []) as FeedbackRow[]} />;
}

export type InterestRow = { id: string; created_at: number; name: string; email: string; role: string; location: string; interests: string; contribution: string | null; status: string; admin_note: string | null; followed_up_at: number | null; source: string | null; confirmation_email_status: string; owner_email_status: string };
export type FeedbackRow = { id: string; created_at: number; audience: string; rating: number; message: string; email: string | null; status: string; source: string | null; notification_email_status: string };
