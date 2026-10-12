import { DEFAULT_ACCENT, DEFAULT_MODE, THEME_STORAGE_KEYS } from "@/config/theme";

// Runs while the HTML is still loading, before the first paint,
// so the page never flashes the default theme before the saved one.
const script = `
try {
  const root = document.documentElement;
  root.dataset.theme = localStorage.getItem("${THEME_STORAGE_KEYS.mode}") || "${DEFAULT_MODE}";
  root.dataset.accent = localStorage.getItem("${THEME_STORAGE_KEYS.accent}") || "${DEFAULT_ACCENT}";
} catch {}
`;

export default function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
