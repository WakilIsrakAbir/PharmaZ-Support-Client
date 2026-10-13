"use client";

import { useRef, useState } from "react";
import { EllipsisVertical } from "lucide-react";
import { useDismiss } from "@/hooks/useDismiss";
import { cn } from "@/lib/utils";

/**
 * A ⋮ button with a small menu. `items`: [{ label, icon, onClick, tone: "danger" }].
 * `opensUp` flips it above the button, for rows near the bottom of a card.
 */
export default function ActionMenu({ label, items, opensUp, buttonClassName }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  useDismiss(menuRef, () => setIsOpen(false), isOpen);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={label}
        aria-expanded={isOpen}
        className={cn(
          "grid size-8 cursor-pointer place-items-center rounded-lg text-muted transition-colors hover:bg-elevated hover:text-foreground",
          buttonClassName,
        )}
      >
        <EllipsisVertical className="size-4" />
      </button>

      <div
        role="menu"
        className={cn(
          "absolute right-0 z-20 w-52 rounded-xl border border-border bg-surface p-1.5 text-foreground shadow-xl shadow-black/10 transition-all duration-150",
          opensUp ? "bottom-full mb-1 origin-bottom-right" : "top-full mt-1 origin-top-right",
          isOpen ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0",
        )}
      >
        {items.map(({ label: itemLabel, icon: Icon, onClick, tone }) => (
          <button
            key={itemLabel}
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              onClick();
            }}
            className={cn(
              "flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
              tone === "danger" ? "text-rose-500 hover:bg-rose-500/10" : "hover:bg-elevated",
            )}
          >
            <Icon className="size-4" />
            {itemLabel}
          </button>
        ))}
      </div>
    </div>
  );
}
