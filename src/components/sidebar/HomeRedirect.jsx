"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { homePathFor } from "@/lib/auth";

/** Sends the super admin to all products, and everyone else to their dashboard. */
export default function HomeRedirect() {
  const user = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace(homePathFor(user));
  }, [user, router]);

  return <div className="page-container py-8" aria-busy="true" />;
}
