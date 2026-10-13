"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { ChevronUp, LogOut, Palette, UserRound } from "lucide-react";
import { openThemeSettings } from "@/components/theme/ThemeSettings";
import { roleOf } from "@/config/roles";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useDismiss } from "@/hooks/useDismiss";
import { logOut } from "@/lib/auth";
import { getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

/** The signed-in user at the bottom of the sidebar, with a menu that opens upwards. */
export default function SidebarProfile({ onNavigate }) {
  const user = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const menuId = useId();

  useDismiss(menuRef, () => setIsOpen(false), isOpen);

  return (
    <div ref={menuRef} className="relative">
      <div
        id={menuId}
        className={cn(
          "absolute bottom-full left-0 z-10 mb-2 w-60 origin-bottom-left rounded-2xl border border-border bg-surface p-1.5 text-foreground shadow-2xl shadow-black/30 transition-all duration-200",
          isOpen ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0",
        )}
      >
        <div className="border-b border-border px-3 py-2.5">
          <p className="truncate text-sm font-semibold">{user?.name}</p>
          <p className="truncate text-xs text-muted">{user?.email}</p>
        </div>
        <Link
          href="/profile"
          onClick={() => {
            setIsOpen(false);
            onNavigate?.();
          }}
          className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-elevated"
        >
          <UserRound className="size-4 text-accent-text" />
          My Profile
        </Link>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            onNavigate?.();
            openThemeSettings();
          }}
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-elevated"
        >
          <Palette className="size-4 text-accent-text" />
          Appearance
        </button>
        <button
          type="button"
          onClick={logOut}
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-500 transition-colors hover:bg-rose-500/10"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </div>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open profile menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        title={user?.name}
        className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-2 text-left transition-colors hover:bg-white/10 collapsed:justify-center collapsed:border-transparent collapsed:bg-transparent"
      >
        <span className="relative grid size-9 shrink-0 place-items-center rounded-xl bg-white text-xs font-bold text-accent-strong">
          {user ? getInitials(user.name) : ""}
          <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-sidebar bg-emerald-500" />
        </span>
        <span className="min-w-0 flex-1 leading-tight collapsed:hidden">
          {user ? (
            <>
              <span className="block truncate text-sm font-semibold text-white">{user.name}</span>
              <span className="block truncate text-[11px] text-white/75">{roleOf(user).label}</span>
            </>
          ) : (
            <>
              <span className="block h-3 w-24 animate-pulse rounded bg-white/15" />
              <span className="mt-1.5 block h-2.5 w-16 animate-pulse rounded bg-white/10" />
            </>
          )}
        </span>
        <ChevronUp
          className={cn("size-4 text-white/55 transition-transform collapsed:hidden", !isOpen && "rotate-180")}
        />
      </button>
    </div>
  );
}
