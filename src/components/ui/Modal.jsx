"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const SIZES = { md: "max-w-lg", lg: "max-w-2xl" };

/**
 * A native <dialog> with a header. Open while `isOpen` is true; Esc, the X or a click
 * outside call `onClose`. The content is only mounted while open, so forms inside
 * start fresh every time. Use DialogBody / DialogFooter (DialogParts.jsx) inside.
 */
export default function Modal({ isOpen, onClose, icon: Icon, title, subtitle, size = "md", children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => event.target === event.currentTarget && dialogRef.current.close()}
      aria-label={title}
      className={cn(
        "m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-surface p-0 text-foreground shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm open:flex",
        SIZES[size],
      )}
    >
      {isOpen && (
        <>
          <header className="relative flex items-center gap-3 border-b border-border bg-linear-to-r from-elevated to-transparent px-6 py-4">
            {Icon && (
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent-text">
                <Icon className="size-5" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <h2 className="truncate font-semibold">{title}</h2>
              {subtitle && <p className="truncate text-xs text-muted">{subtitle}</p>}
            </div>
            <button
              type="button"
              onClick={() => dialogRef.current.close()}
              aria-label="Close"
              className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg text-muted transition-colors hover:bg-elevated hover:text-foreground"
            >
              <X className="size-5" />
            </button>
            <span className="absolute bottom-0 left-6 h-0.5 w-12 rounded-full bg-accent" />
          </header>
          {children}
        </>
      )}
    </dialog>
  );
}
