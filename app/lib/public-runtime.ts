const GITHUB_PAGES_ORIGINS = new Set([
  "https://bibha-institute.github.io",
  "https://bibha.medics-global.com",
]);
const SERVICE_ORIGIN = "https://baire-platform.khalidsaifullahfahim.chatgpt.site";

export function isGitHubPages() {
  return typeof window !== "undefined" && GITHUB_PAGES_ORIGINS.has(window.location.origin);
}

export function apiEndpoint(path: string) {
  return isGitHubPages() ? `${SERVICE_ORIGIN}${path}` : path;
}

export function publicHref(path: "/" | "/privacy" | "/founder" | "/#feedback") {
  if (!isGitHubPages()) return path;
  if (path === "/") return "/";
  if (path === "/privacy") return "/privacy/";
  if (path === "/#feedback") return "/#feedback";
  return `${SERVICE_ORIGIN}/founder`;
}
