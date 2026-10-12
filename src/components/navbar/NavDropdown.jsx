"use client";

import { useId } from "react";
import { ChevronDown } from "lucide-react";
import { isActivePath } from "@/config/navigation";
import { cn } from "@/lib/utils";
import NavItemLink from "./NavItemLink";

export default function NavDropdown({ group, pathname, isOpen, onToggle, onClose }) {
  const panelId = useId();
  const isActive = group.items.some((item) => isActivePath(pathname, item.href));

  return (
    <li className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className={cn(
          "flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
          isActive
            ? "border-accent/40 bg-accent/15 text-accent-text"
            : "border-transparent text-foreground/75 hover:bg-elevated hover:text-foreground",
          isOpen && !isActive && "bg-elevated text-foreground",
        )}
      >
        {group.label}
        <ChevronDown className={cn("size-3.5 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      <div
        id={panelId}
        className={cn(
          "absolute left-1/2 top-full z-10 mt-3 w-80 -translate-x-1/2 rounded-2xl border border-border bg-surface p-2 shadow-xl shadow-black/10 transition-all duration-200",
          isOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
        )}
      >
        <ul className="space-y-1">
          {group.items.map((item) => (
            <li key={item.href}>
              <NavItemLink item={item} isActive={isActivePath(pathname, item.href)} onSelect={onClose} />
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
