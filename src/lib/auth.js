import { HOME_PATH } from "@/config/routes";
import { api } from "./api";

/**
 * Where to go after logging in: the page the user originally asked for
 * (saved in ?next= by proxy.js), or the dashboard.
 */
export function getRedirectPath() {
  const next = new URLSearchParams(window.location.search).get("next");

  // Only allow paths on this site, never "//other-site.com"
  return next?.startsWith("/") && !next.startsWith("//") ? next : HOME_PATH;
}

export async function logOut() {
  await api("/auth/logout", { method: "POST" }).catch(() => {});

  // A full page load (not router.push) on purpose: Next.js keeps visited pages alive in
  // memory, and this clears everything the previous user had open, as the Next.js docs
  // recommend for logout.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.assign("/login");
}
