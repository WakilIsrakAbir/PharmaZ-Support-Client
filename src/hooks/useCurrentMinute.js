import { useSyncExternalStore } from "react";

function subscribe(callback) {
  const timer = setInterval(callback, 1000);
  return () => clearInterval(timer);
}

// Rounded to the minute, so components only re-render when the minute changes.
function getCurrentMinute() {
  return Math.floor(Date.now() / 60_000) * 60_000;
}

/**
 * The current time (as a timestamp), kept up to date every minute.
 * Returns null on the server, because the page is prerendered ahead of time.
 */
export function useCurrentMinute() {
  return useSyncExternalStore(subscribe, getCurrentMinute, () => null);
}
