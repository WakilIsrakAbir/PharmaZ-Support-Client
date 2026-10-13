import { Moon, Sun, Zap } from "lucide-react";

export const THEME_STORAGE_KEYS = {
  mode: "support-tool:theme-mode",
  accent: "support-tool:theme-accent",
  // The product's own colour, used until the person picks an accent themselves
  productAccent: "support-tool:product-accent",
};

export const DEFAULT_MODE = "dark";
export const DEFAULT_ACCENT = "emerald";

export const THEME_MODES = [
  { value: "light", label: "Light Mode", description: "Fresh Mountain Sage", icon: Sun },
  { value: "dark", label: "Dark Mode", description: "Obsidian Tech Night", icon: Moon },
  { value: "system", label: "Auto", description: "System Preference", icon: Zap },
];

// The actual colors live in globals.css under [data-accent="..."].
export const ACCENT_COLORS = [
  { value: "emerald", label: "Emerald Pine", description: "Mountain Forest" },
  { value: "teal", label: "Teal", description: "Ocean Breeze" },
  { value: "indigo", label: "Indigo", description: "Classic Blue" },
  { value: "sky", label: "Brand Sky", description: "Vibrant Cyan" },
  { value: "rose", label: "Rose", description: "Coral Crimson" },
  { value: "purple", label: "Purple", description: "Royal Violet" },
  { value: "amber", label: "Amber", description: "Warm Gold" },
];
