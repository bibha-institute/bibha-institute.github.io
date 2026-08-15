import { env } from "cloudflare:workers";
import { getChatGPTUser, requireChatGPTUser } from "../chatgpt-auth";

function founderEmail() {
  const runtime = env as unknown as { FOUNDER_EMAIL?: string };
  return (runtime.FOUNDER_EMAIL || "").trim().toLowerCase();
}

export async function requireFounder(returnTo = "/founder") {
  const user = await requireChatGPTUser(returnTo);
  if (!founderEmail() || user.email.trim().toLowerCase() !== founderEmail()) return null;
  return user;
}

export async function isFounderRequest() {
  const user = await getChatGPTUser();
  return Boolean(user && founderEmail() && user.email.trim().toLowerCase() === founderEmail());
}
