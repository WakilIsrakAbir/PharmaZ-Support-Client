import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { logOut } from "@/lib/auth";

/** The logged-in user, or null while it's still loading. */
export function useCurrentUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    api("/auth/me")
      .then(({ data }) => {
        if (!isCancelled) setUser(data);
      })
      .catch((error) => {
        // The cookie exists but the server rejected it (expired or invalid), so start over
        if (error.status === 401) logOut();
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  return user;
}
