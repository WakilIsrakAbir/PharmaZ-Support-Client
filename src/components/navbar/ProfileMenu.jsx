"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { useDismiss } from "@/hooks/useDismiss";
import { cn } from "@/lib/utils";

// Placeholder user until authentication is connected.
const currentUser = {
  name: "Demo User",
  role: "Support Agent",
  email: "demo.user@example.com",
};

export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const panelId = useId();

  useDismiss(menuRef, () => setIsOpen(false), isOpen);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open profile menu"
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex cursor-pointer items-center gap-2.5 rounded-full border border-border bg-surface/60 p-1 transition-colors hover:border-accent/40 md:pr-3"
      >
        <Avatar className="size-8 text-xs" />
        <span className="hidden text-left leading-tight md:block">
          <span className="block text-sm font-semibold">{currentUser.name}</span>
          <span className="block text-[11px] text-muted">{currentUser.role}</span>
        </span>
        <ChevronDown
          className={cn("hidden size-4 text-muted transition-transform duration-200 md:block", isOpen && "rotate-180")}
        />
      </button>

      <div
        id={panelId}
        className={cn(
          "absolute right-0 top-full z-10 mt-3 w-64 origin-top-right rounded-2xl border border-border bg-surface p-2 shadow-xl shadow-black/10 transition-all duration-200",
          isOpen ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0",
        )}
      >
        <div className="flex items-center gap-3 rounded-xl bg-elevated p-3">
          <Avatar className="size-10 text-sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{currentUser.name}</p>
            <p className="truncate text-xs text-muted">{currentUser.email}</p>
          </div>
        </div>

        <div className="mt-2 space-y-1">
          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-elevated"
          >
            <UserRound className="size-4 text-accent-text" />
            My Profile
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-500 transition-colors hover:bg-rose-500/10"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

function Avatar({ className }) {
  const initials = currentUser.name
    .split(" ")
    .map((word) => word[0])
    .join("");

  return (
    <span
      className={cn(
        "relative grid shrink-0 place-items-center rounded-full bg-linear-to-br from-accent to-accent-strong font-bold text-accent-foreground",
        className,
      )}
    >
      {initials}
      <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-surface bg-emerald-500" />
    </span>
  );
}
