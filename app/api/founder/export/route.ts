import { env } from "cloudflare:workers";
import { isFounderRequest } from "../../../lib/founder-auth";

export async function GET(request: Request) {
  if (!(await isFounderRequest(request))) return new Response("Unauthorized", { status: 401 });
  const result = await env.DB.prepare(`SELECT created_at, name, email, role, location, interests, contribution, status, admin_note, followed_up_at, source, confirmation_email_status, owner_email_status FROM interest_signups ORDER BY created_at DESC`).all<Record<string, unknown>>();
  const columns = ["created_at", "name", "email", "role", "location", "interests", "contribution", "status", "admin_note", "followed_up_at", "source", "confirmation_email_status", "owner_email_status"];
  const rows = [columns.join(","), ...(result.results || []).map(row => columns.map(column => csvCell(row[column])).join(","))];
  return new Response(rows.join("\n"), {
    headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="bibha-founding-network-${new Date().toISOString().slice(0, 10)}.csv"`, "cache-control": "no-store" },
  });
}

function csvCell(value: unknown) {
  let text = value == null ? "" : String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}
