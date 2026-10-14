"use client";

import { useEffect } from "react";
import Link from "next/link";
import { House, RotateCw, ServerCrash, WifiOff } from "lucide-react";
import ErrorScreen, { primaryButtonClass, secondaryButtonClass } from "@/components/ui/ErrorScreen";
import { useIsOffline } from "@/hooks/useIsOffline";

/**
 * What every error boundary shows (see app/error.jsx, app/(app)/error.jsx and
 * app/global-error.jsx). `retry` re-renders the part of the page that failed.
 */
export default function RouteError({ error, retry }) {
  const isOffline = useIsOffline();

  useEffect(() => {
    // Shows up in the browser console; server errors are logged under the same digest
    console.error(error);
  }, [error]);

  return (
    <ErrorScreen
      code={isOffline ? "Offline" : "500"}
      icon={isOffline ? WifiOff : ServerCrash}
      title={isOffline ? "You're offline" : "Something went wrong"}
      text={
        isOffline
          ? "This page needs a connection. Check your internet, then try again."
          : "This page ran into a problem it couldn't recover from. Trying again usually fixes it. If it keeps happening, let your admin know."
      }
      reference={error?.digest}
      details={error?.stack ?? error?.message}
    >
      <button type="button" onClick={() => retry()} className={primaryButtonClass}>
        <RotateCw className="size-4" />
        Try again
      </button>
      <Link href="/" className={secondaryButtonClass}>
        <House className="size-4" />
        Go to home
      </Link>
    </ErrorScreen>
  );
}
