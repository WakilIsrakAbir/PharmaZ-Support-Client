"use client"; // Error boundaries must be Client Components

import CenteredScreen from "@/components/ui/CenteredScreen";
import RouteError from "@/components/ui/RouteError";

// Errors outside the app shell (login, password reset). Errors in pages with the sidebar
// are caught by app/(app)/error.jsx first.
export default function RootError({ error, retry }) {
  return (
    <CenteredScreen className="max-w-lg">
      <RouteError error={error} retry={retry} />
    </CenteredScreen>
  );
}
