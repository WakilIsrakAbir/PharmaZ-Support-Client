import Link from "next/link";
import { cn } from "@/lib/utils";

export default function NavItemLink({ item, isActive, onSelect }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onSelect}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-xl p-2.5 transition-colors",
        isActive ? "bg-accent/10" : "hover:bg-elevated",
      )}
    >
      <span
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-lg transition-colors",
          isActive
            ? "bg-accent-strong text-accent-foreground shadow-md shadow-accent/30"
            : "bg-accent/10 text-accent-text group-hover:bg-accent/20",
        )}
      >
        <Icon className="size-4.5" />
      </span>

      <span className="min-w-0">
        <span className={cn("block text-sm font-semibold", isActive ? "text-accent-text" : "text-foreground")}>
          {item.label}
        </span>
        <span className="block truncate text-xs text-muted">{item.description}</span>
      </span>
    </Link>
  );
}
