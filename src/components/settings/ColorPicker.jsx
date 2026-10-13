"use client";

import { useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { OPTION_COLORS, optionColor } from "@/config/option-colors";
import { useDismiss } from "@/hooks/useDismiss";
import { cn } from "@/lib/utils";

/** A swatch button that opens a small grid of badge colours. */
export default function ColorPicker({ value, onChange, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  useDismiss(ref, () => setIsOpen(false), isOpen);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={`${label}: ${optionColor(value).label}`}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-11 cursor-pointer items-center gap-1.5 rounded-xl border border-border bg-background/40 px-3 transition-colors hover:border-accent/40"
      >
        <span className={cn("size-4 rounded-full", optionColor(value).swatch)} />
        <ChevronDown className="size-3.5 text-muted" />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label={label}
          className="absolute left-0 top-full z-20 mt-1.5 grid w-48 grid-cols-5 gap-1.5 rounded-xl border border-border bg-surface p-2 shadow-xl"
        >
          {Object.entries(OPTION_COLORS).map(([color, { label: colorLabel, swatch }]) => (
            <button
              key={color}
              type="button"
              role="option"
              aria-selected={color === value}
              title={colorLabel}
              aria-label={colorLabel}
              onClick={() => {
                onChange(color);
                setIsOpen(false);
              }}
              className={cn(
                "grid size-7 cursor-pointer place-items-center rounded-full text-white ring-offset-2 ring-offset-surface transition-transform hover:scale-110",
                swatch,
                color === value && "ring-2 ring-foreground/60",
              )}
            >
              {color === value && <Check className="size-3.5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
