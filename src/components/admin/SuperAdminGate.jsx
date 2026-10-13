"use client";

import { LockKeyhole } from "lucide-react";
import Notice from "@/components/ui/Notice";
import { useCurrentUser } from "@/hooks/useCurrentUser";

/** The console is the super admin's; anyone else who opens its URL gets told so. */
export default function SuperAdminGate({ children }) {
  const user = useCurrentUser();

  if (!user) return <div className="h-96 animate-pulse rounded-2xl bg-elevated" />;
  if (!user.isSuperAdmin) {
    return <Notice icon={LockKeyhole} title="Super admin only" text="This page is for the person who runs the platform." />;
  }
  return children;
}
