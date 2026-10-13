import { useEffect, useSyncExternalStore } from "react";
import { api } from "@/lib/api";
import { logOut } from "@/lib/auth";

// One shared copy of the logged-in user, so the navbar and the profile page stay in step:
// saving your name on the profile updates the navbar straight away.
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
