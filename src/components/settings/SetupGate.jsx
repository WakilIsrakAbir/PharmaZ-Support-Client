"use client";

import { CloudOff, LockKeyhole } from "lucide-react";
import Notice from "@/components/ui/Notice";
import { canManageProduct } from "@/config/roles";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useProductSetup } from "@/hooks/useProductSetup";

/**
 * Settings pages are for the product's admins. Shows the page (`children(setup)`)
 * once the user and the product setup have loaded.
 */
export default function SetupGate({ children }) {
  const user = useCurrentUser();
  const { setup, error } = useProductSetup();

  if (user && !canManageProduct(user)) {
    return (
      <Notice icon={LockKeyhole} title="Admins only" text="Ask your product admin if something here needs changing." />
    );
  }
  if (error && !setup) {
    return <Notice icon={CloudOff} title="Couldn't load the setup" text={error} />;
  }
  if (!user || !setup) {
    return <div className="h-96 animate-pulse rounded-2xl bg-elevated" />;
  }

  return children(setup);
}
