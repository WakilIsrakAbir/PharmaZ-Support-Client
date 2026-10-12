import { useSyncExternalStore } from "react";

function subscribe(callback) {
  window.addEventListener("scroll", callback, { passive: true });
  window.addEventListener("resize", callback);

  return () => {
    window.removeEventListener("scroll", callback);
    window.removeEventListener("resize", callback);
  };
}

function getScrollProgress() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollableHeight <= 0) return 0;

  const progress = (window.scrollY / scrollableHeight) * 100;
  return Math.min(100, Math.max(0, progress));
}

/** How far the page has been scrolled, from 0 to 100. */
export function useScrollProgress() {
  return useSyncExternalStore(subscribe, getScrollProgress, () => 0);
}

/** True once the page has been scrolled past `offset` pixels. */
export function useHasScrolled(offset = 8) {
  return useSyncExternalStore(subscribe, () => window.scrollY > offset, () => false);
}
