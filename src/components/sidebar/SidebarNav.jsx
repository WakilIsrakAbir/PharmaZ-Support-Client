"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNavGroups, isActivePath } from "@/config/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { cn } from "@/lib/utils";

/** The grouped links. `onNavigate` lets the phone drawer close itself after a tap. */
export default function SidebarNav({ onNavigate }) {
  const pathname = usePathname();
  const groups = getNavGroups(useCurrentUser());

  return (
    <nav aria-label="Main" className="space-y-6">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/70 collapsed:hidden">
            {group.label}
          </p>
          {/* Folded to icons, a thin line stands in for the group name */}
          <span className="mx-auto mb-3 hidden h-px w-8 bg-white/15 collapsed:block" />

          <ul className="space-y-1">
            {group.items.map((item) => (
              <li key={item.href}>
                <SidebarLink item={item} isActive={isActivePath(pathname, item.href)} onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function SidebarLink({ item, isActive, onNavigate }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      // Shows the name on hover when only the icon is visible
      title={item.label}
      className={cn(
        "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors collapsed:justify-center collapsed:px-0",
        isActive ? "bg-white text-slate-900 shadow-lg shadow-black/20" : "text-white/90 hover:bg-white/15 hover:text-white",
      )}
    >
      {isActive && <span className="absolute -left-3 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-white" />}
      <Icon className={cn("size-[18px] shrink-0", isActive && "text-accent-strong")} />
      <span className="truncate collapsed:sr-only">{item.label}</span>
    </Link>
  );
}
