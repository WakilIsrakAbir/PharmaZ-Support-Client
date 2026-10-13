"use client";

import { useScrollProgress } from "@/hooks/useScroll";

export default function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.75">
      <div
        className="h-full origin-left bg-linear-to-r from-accent-strong via-accent to-accent-text shadow-[0_0_12px_var(--accent)] transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </div>
  );
}
