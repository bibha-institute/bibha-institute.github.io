const GITHUB_PAGES_ORIGIN = "https://kingkhalid310.github.io";
const GITHUB_PAGES_BASE = "/bibha-institute";
const SERVICE_ORIGIN = "https://baire-platform.khalidsaifullahfahim.chatgpt.site";

export function isGitHubPages() {
  return typeof window !== "undefined" && window.location.origin === GITHUB_PAGES_ORIGIN;
}

export function apiEndpoint(path: string) {
  return isGitHubPages() ? `${SERVICE_ORIGIN}${path}` : path;
}

export function publicHref(path: "/" | "/privacy" | "/founder" | "/#feedback") {
  if (!isGitHubPages()) return path;
  if (path === "/") return `${GITHUB_PAGES_BASE}/`;
  if (path === "/privacy") return `${GITHUB_PAGES_BASE}/privacy/`;
  if (path === "/#feedback") return `${GITHUB_PAGES_BASE}/#feedback`;
  return `${SERVICE_ORIGIN}/founder`;
}
