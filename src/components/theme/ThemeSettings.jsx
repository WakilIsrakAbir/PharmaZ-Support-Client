"use client";

import { useEffect, useRef, useState } from "react";
import { Settings, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { useDismiss } from "@/hooks/useDismiss";
import { useTheme } from "@/hooks/useTheme";
import { BRAND } from "@/config/brand";
import { cn } from "@/lib/utils";
import AccentOptions from "./AccentOptions";
import ModeOptions from "./ModeOptions";

export default function ThemeSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const { mode, accent, setMode, setAccent } = useTheme();

  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const closeButtonRef = useRef(null);

  useDismiss(panelRef, () => setIsOpen(false), isOpen);

  // While the panel is open, stop the page behind it from scrolling and move
  // focus inside. When it closes, focus goes back to the settings button.
  useEffect(() => {
    if (!isOpen) return;

    const trigger = triggerRef.current;
    // Fill the space the scrollbar leaves behind, so the page doesn't jump sideways.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      trigger?.focus();
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open theme settings"
        aria-expanded={isOpen}
        className="fixed right-0 top-1/2 z-30 cursor-pointer -translate-y-1/2 rounded-l-2xl bg-accent-strong p-3 text-accent-foreground shadow-lg shadow-accent/40 transition-all duration-300 hover:pr-4"
      >
        <Settings className="size-6 animate-[spin_4s_linear_infinite]" />
      </button>

      <div
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-50 bg-black/50 transition-opacity duration-200",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="theme-settings-title"
        inert={!isOpen}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-120 flex-col border-l border-border bg-surface transition-[translate,box-shadow] duration-300 ease-out",
          isOpen ? "translate-x-0 shadow-2xl" : "translate-x-full",
        )}
      >
        <header className="flex items-center gap-3 bg-accent-strong px-6 py-5 text-accent-foreground">
          <Settings className="size-6 shrink-0" />
          <div className="flex-1">
            <h2 id="theme-settings-title" className="text-lg font-bold">
              Theme & Color Settings
            </h2>
            <p className="text-xs font-medium opacity-80">Personalize your support workspace</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close theme settings"
            className="grid size-9 cursor-pointer place-items-center rounded-lg transition-colors hover:bg-white/15"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="flex-1 space-y-8 overflow-y-auto p-6">
          <SettingsSection icon={Sparkles} title="Display Scheme Mode">
            <ModeOptions value={mode} onChange={setMode} />
          </SettingsSection>

          <SettingsSection icon={SlidersHorizontal} title="Accent Colors">
            <AccentOptions value={accent} onChange={setAccent} />
          </SettingsSection>
        </div>

        <footer className="border-t border-border px-6 py-4 text-center text-xs font-medium text-accent-text">
          {BRAND.name} {BRAND.tagline} • Theme Engine
        </footer>
      </aside>
    </>
  );
}

function SettingsSection({ icon: Icon, title, children }) {
  return (
    <section>
      <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent-text">
        <Icon className="size-4" />
        {title}
      </h3>
      {children}
    </section>
  );
}
