"use client";

import { LockKeyhole } from "lucide-react";
import Notice from "@/components/ui/Notice";
import Skeleton from "@/components/ui/Skeleton";
import { canManageProduct } from "@/config/roles";
import { useCurrentUser } from "@/hooks/useCurrentUser";

/**
 * Shows `children` to product admins and the super admin only. Everyone else gets a
 * notice, so a link to the page doesn't show them anything. The API checks this too.
 */
export default function AdminGate({ text = "Ask your product admin if you need something here.", children }) {
  const user = useCurrentUser();

  if (!user) return <Skeleton className="h-96 rounded-2xl" />;
  if (!canManageProduct(user)) return <Notice icon={LockKeyhole} title="Admins only" text={text} />;
  return children;
}
