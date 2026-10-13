import { HOME_PATH, SUPER_ADMIN_HOME } from "@/config/routes";
import { api } from "./api";

/**
 * Where to go after logging in: the page the user originally asked for
 * (saved in ?next= by proxy.js), or their home: all products for the super admin,
 * the dashboard for everyone else.
 */
export function getRedirectPath(user) {
  const next = new URLSearchParams(window.location.search).get("next");

  // Only allow paths on this site, never "//other-site.com"
  if (next?.startsWith("/") && !next.startsWith("//")) return next;
  return homePathFor(user);
}

export function homePathFor(user) {
  return user?.isSuperAdmin ? SUPER_ADMIN_HOME : HOME_PATH;
}

/**
 * A full page load, so proxy.js sees the new login cookie straight away.
 * The returned promise never settles, which keeps the form in its "submitting"
 * state until the next page appears.
 */
export function goTo(path) {
  window.location.assign(path);
  return new Promise(() => {});
}

export async function logOut() {
  await api("/auth/logout", { method: "POST" }).catch(() => {});

  // A full page load (not router.push) on purpose: Next.js keeps visited pages alive in
  // memory, and this clears everything the previous user had open, as the Next.js docs
  // recommend for logout.
  goTo("/login");
}
