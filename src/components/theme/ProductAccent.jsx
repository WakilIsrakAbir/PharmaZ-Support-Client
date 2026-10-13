"use client";

import { useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { setProductAccent } from "@/hooks/useTheme";

/** Colours the app in the product's accent, unless the person picked their own. Renders nothing. */
export default function ProductAccent() {
  const user = useCurrentUser();
  const color = user?.product?.accentColor;

  useEffect(() => {
    if (user) setProductAccent(color ?? null);
  }, [user, color]);

  return null;
}
