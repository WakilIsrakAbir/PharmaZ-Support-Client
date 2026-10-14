"use client"; // Error boundaries must be Client Components

import ThemeScript from "@/components/theme/ThemeScript";
import CenteredScreen from "@/components/ui/CenteredScreen";
import RouteError from "@/components/ui/RouteError";
import { DEFAULT_ACCENT, DEFAULT_MODE } from "@/config/theme";
import "./globals.css";

// The last line of defence: the root layout itself failed, so this page replaces it and
// brings its own <html>, styles and theme
export default function GlobalError({ error, retry }) {
  return (
    <html lang="en" data-theme={DEFAULT_MODE} data-accent={DEFAULT_ACCENT} suppressHydrationWarning>
      <head>
        <title>Something went wrong</title>
        <ThemeScript />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <CenteredScreen className="max-w-lg">
          <RouteError error={error} retry={retry} />
        </CenteredScreen>
      </body>
    </html>
  );
}
