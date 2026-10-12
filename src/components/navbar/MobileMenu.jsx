"use client";

import { useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_GROUPS, isActivePath } from "@/config/navigation";
import { useDismiss } from "@/hooks/useDismiss";
import { cn } from "@/lib/utils";
import NavItemLink from "./NavItemLink";

export default function MobileMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const panelId = useId();

  useDismiss(menuRef, () => setIsOpen(false), isOpen);

  return (
    <div ref={menuRef} className="lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="grid size-10 cursor-pointer place-items-center rounded-xl border border-border bg-surface/60 transition-colors hover:border-accent/40"
      >
        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      <nav
        id={panelId}
        aria-label="Mobile"
        className={cn(
          "absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-border bg-surface px-4 py-5 shadow-xl transition-all duration-200 sm:px-6",
          isOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0",
        )}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-2.5 text-[11px] font-bold uppercase tracking-wider text-muted">
                {group.label}
              </p>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <NavItemLink
                      item={item}
                      isActive={isActivePath(pathname, item.href)}
                      onSelect={() => setIsOpen(false)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}
