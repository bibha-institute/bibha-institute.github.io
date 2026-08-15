import { env } from "cloudflare:workers";

type EmailInput = { to: string; subject: string; html: string; replyTo?: string };

export async function sendEmail(input: EmailInput): Promise<"sent" | "not_configured" | "failed"> {
  const runtime = env as unknown as { RESEND_API_KEY?: string; FROM_EMAIL?: string };
  if (!runtime.RESEND_API_KEY || !runtime.FROM_EMAIL) return "not_configured";
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${runtime.RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({ from: runtime.FROM_EMAIL, to: [input.to], subject: input.subject, html: input.html, reply_to: input.replyTo }),
    });
    return response.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}

export async function sendInterestEmails(signup: { name: string; email: string; role: string; location: string; interests: string; contribution: string }) {
  const runtime = env as unknown as { FOUNDER_EMAIL?: string };
  const founderEmail = runtime.FOUNDER_EMAIL || "";
  const safe = Object.fromEntries(Object.entries(signup).map(([key, value]) => [key, escapeHtml(value)])) as Record<keyof typeof signup, string>;
  const confirmation = await sendEmail({
    to: signup.email,
    subject: "Your interest in the BIBHA Institute founding network is registered",
    html: `<div style="font-family:Arial,sans-serif;max-width:620px;line-height:1.6;color:#123f34"><h1 style="font-family:Georgia,serif;font-weight:400">Thank you, ${safe.name}.</h1><p>Your interest in the BIBHA Institute founding network has been saved.</p><p>This is an early no-clinical-data network pilot—not yet a member account or project acceptance. We will review founding-network responses and contact suitable contributors as the pilot takes shape.</p><p><strong>Your selected role:</strong> ${safe.role}<br><strong>Research interests:</strong> ${safe.interests}</p><p>BIBHA Institute<br><small>Bangladesh Institute for Brain Health and Analytics</small></p></div>`,
  });
  const owner = founderEmail ? await sendEmail({
    to: founderEmail,
    replyTo: signup.email,
    subject: `New BIBHA Institute registration — ${signup.name}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:620px;line-height:1.6"><h2>New founding-network registration</h2><p><strong>Name:</strong> ${safe.name}<br><strong>Email:</strong> ${safe.email}<br><strong>Role:</strong> ${safe.role}<br><strong>Location:</strong> ${safe.location}<br><strong>Interests:</strong> ${safe.interests}</p><p><strong>How they may contribute:</strong><br>${safe.contribution || "Not provided"}</p><p>Open the private Founder Desk to review and track follow-up.</p></div>`,
  }) : "not_configured";
  return { confirmation, owner };
}

export async function sendFeedbackNotification(feedback: { audience: string; rating: number; message: string; email: string }) {
  const runtime = env as unknown as { FOUNDER_EMAIL?: string };
  const founderEmail = runtime.FOUNDER_EMAIL || "";
  if (!founderEmail) return "not_configured";
  return sendEmail({
    to: founderEmail,
    replyTo: feedback.email || undefined,
    subject: `New BIBHA Institute feedback — ${feedback.rating}/5`,
    html: `<div style="font-family:Arial,sans-serif;max-width:620px;line-height:1.6"><h2>New stakeholder feedback</h2><p><strong>Perspective:</strong> ${escapeHtml(feedback.audience)}<br><strong>Rating:</strong> ${feedback.rating}/5${feedback.email ? `<br><strong>Contact:</strong> ${escapeHtml(feedback.email)}` : ""}</p><p>${escapeHtml(feedback.message)}</p></div>`,
  });
}

export async function sendFounderLoginCode(email: string, code: string) {
  return sendEmail({
    to: email,
    subject: "Your BIBHA Founder Desk security code",
    html: `<div style="font-family:Arial,sans-serif;max-width:620px;line-height:1.6;color:#123f34"><p style="font-size:12px;font-weight:700;letter-spacing:.12em">BIBHA INSTITUTE · FOUNDER DESK</p><h1 style="font-family:Georgia,serif;font-weight:400">Your security code is</h1><p style="margin:28px 0;font-size:34px;font-weight:800;letter-spacing:.22em">${escapeHtml(code)}</p><p>This code expires in 10 minutes and can be used only once.</p><p>If you did not request this code, you can safely ignore this email.</p></div>`,
  });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character] || character);
}
