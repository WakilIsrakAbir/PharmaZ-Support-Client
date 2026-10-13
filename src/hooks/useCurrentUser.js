import { useEffect, useSyncExternalStore } from "react";
import { api } from "@/lib/api";
import { logOut } from "@/lib/auth";

// One shared copy of the logged-in user, so the sidebar and the profile page stay in step:
// saving your name on the profile updates the sidebar straight away.
let currentUser = null;
let request = null;
const listeners = new Set();

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setCurrentUser(user) {
  currentUser = user;
  listeners.forEach((listener) => listener());
}

/**
 * Takes the account the API sent back after a change (name, password...) and keeps the
 * product summary that only /auth/me adds.
 */
export function updateCurrentAccount(account) {
  setCurrentUser({ ...currentUser, ...account, product: currentUser?.product ?? null });
}

function loadCurrentUser() {
  request ??= api("/auth/me")
    .then(({ data }) => setCurrentUser(data))
    .catch((error) => {
      request = null;
      // The cookie exists but the server rejected it (expired, or the password changed)
      if (error.status === 401) logOut();
    });
}

/** The logged-in user, or null while it's still loading. */
export function useCurrentUser() {
  useEffect(() => {
    loadCurrentUser();
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => currentUser,
    () => null,
  );
}
