const GITHUB_PAGES_ORIGIN = "https://bibha-institute.github.io";
const SERVICE_ORIGIN = "https://baire-platform.khalidsaifullahfahim.chatgpt.site";

export function isGitHubPages() {
  return typeof window !== "undefined" && window.location.origin === GITHUB_PAGES_ORIGIN;
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
