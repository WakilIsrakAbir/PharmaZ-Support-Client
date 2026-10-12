import { useLayoutEffect, useSyncExternalStore } from "react";
import { DEFAULT_ACCENT, DEFAULT_MODE, THEME_STORAGE_KEYS } from "@/config/theme";

// Components using this hook re-render whenever the theme changes.
const listeners = new Set();

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function readSetting(key, fallback) {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function saveSetting(key, attribute, value) {
  document.documentElement.setAttribute(attribute, value);

  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage can be blocked (e.g. private browsing). The theme still applies for this visit.
  }

  listeners.forEach((listener) => listener());
}

export function useTheme() {
  // The server can't see localStorage, so it renders with the defaults first.
  const mode = useSyncExternalStore(
    subscribe,
    () => readSetting(THEME_STORAGE_KEYS.mode, DEFAULT_MODE),
    () => DEFAULT_MODE,
  );

  const accent = useSyncExternalStore(
    subscribe,
    () => readSetting(THEME_STORAGE_KEYS.accent, DEFAULT_ACCENT),
    () => DEFAULT_ACCENT,
  );

  // In development React can reset the <html> attributes when it remounts,
  // so we put the saved theme back. In production this changes nothing.
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = readSetting(THEME_STORAGE_KEYS.mode, DEFAULT_MODE);
    root.dataset.accent = readSetting(THEME_STORAGE_KEYS.accent, DEFAULT_ACCENT);
  }, []);

  return {
    mode,
    accent,
    setMode: (value) => saveSetting(THEME_STORAGE_KEYS.mode, "data-theme", value),
    setAccent: (value) => saveSetting(THEME_STORAGE_KEYS.accent, "data-accent", value),
  };
}
