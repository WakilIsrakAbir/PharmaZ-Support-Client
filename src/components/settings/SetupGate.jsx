"use client";

import { CloudOff } from "lucide-react";
import AdminGate from "@/components/ui/AdminGate";
import Notice from "@/components/ui/Notice";
import Skeleton from "@/components/ui/Skeleton";
import { useProductSetup } from "@/hooks/useProductSetup";

/**
 * Settings pages are for the product's admins. Shows the page (`children(setup)`)
 * once the user and the product setup have loaded.
 */
export default function SetupGate({ children }) {
  return (
    <AdminGate text="Ask your product admin if something here needs changing.">
      <WithSetup>{children}</WithSetup>
    </AdminGate>
  );
}

function WithSetup({ children }) {
  const { setup, error } = useProductSetup();

  if (error && !setup) {
    return <Notice icon={CloudOff} title="Couldn't load the setup" text={error} />;
  }
  if (!setup) {
    return <Skeleton className="h-96 rounded-2xl" />;
  }

  return children(setup);
}
