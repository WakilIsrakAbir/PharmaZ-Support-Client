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

// Until the person picks an accent, the product's colour is used (then the app's default)
function defaultAccent() {
  return readSetting(THEME_STORAGE_KEYS.productAccent, DEFAULT_ACCENT);
}

/** Remembers the product's colour and shows it, unless the person picked their own accent. */
export function setProductAccent(color) {
  try {
    if (color) localStorage.setItem(THEME_STORAGE_KEYS.productAccent, color);
    else localStorage.removeItem(THEME_STORAGE_KEYS.productAccent);
  } catch {
    // Storage blocked: the colour still applies below, just not before the next first paint
  }

  document.documentElement.dataset.accent = readSetting(THEME_STORAGE_KEYS.accent, color || DEFAULT_ACCENT);
  listeners.forEach((listener) => listener());
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
    () => readSetting(THEME_STORAGE_KEYS.accent, defaultAccent()),
    () => DEFAULT_ACCENT,
  );

  // In development React can reset the <html> attributes when it remounts,
  // so we put the saved theme back. In production this changes nothing.
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = readSetting(THEME_STORAGE_KEYS.mode, DEFAULT_MODE);
    root.dataset.accent = readSetting(THEME_STORAGE_KEYS.accent, defaultAccent());
  }, []);

  return {
    mode,
    accent,
    setMode: (value) => saveSetting(THEME_STORAGE_KEYS.mode, "data-theme", value),
    setAccent: (value) => saveSetting(THEME_STORAGE_KEYS.accent, "data-accent", value),
  };
}
