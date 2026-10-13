import { useSyncExternalStore } from "react";
import { SIDEBAR_STORAGE_KEY } from "@/config/sidebar";

// The state lives on <html data-sidebar="open | collapsed">, set before paint by ThemeScript.
const listeners = new Set();

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const readIsCollapsed = () => document.documentElement.dataset.sidebar === "collapsed";

/** Whether the desktop sidebar is folded to icons, and a toggle that remembers the choice. */
export function useSidebar() {
  const isCollapsed = useSyncExternalStore(subscribe, readIsCollapsed, () => false);

  function toggle() {
    const next = readIsCollapsed() ? "open" : "collapsed";
    document.documentElement.dataset.sidebar = next;

    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, next);
    } catch {
      // Storage can be blocked (e.g. private browsing). It still works for this visit.
    }

    listeners.forEach((listener) => listener());
  }

  return { isCollapsed, toggle };
}
