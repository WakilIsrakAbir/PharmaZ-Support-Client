"use client"; // Error boundaries must be Client Components

import RouteError from "@/components/ui/RouteError";

// A page inside the app broke: the sidebar stays, so people can go somewhere else
export default function AppError({ error, retry }) {
  return <RouteError error={error} retry={retry} />;
}
