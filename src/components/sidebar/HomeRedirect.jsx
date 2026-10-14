"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/Spinner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { homePathFor } from "@/lib/auth";

/** Sends the super admin to all products, and everyone else to their dashboard. */
export default function HomeRedirect() {
  const user = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace(homePathFor(user));
  }, [user, router]);

  return <Spinner label="Opening your home page…" className="py-32" />;
}
