import { CALL_DIRECTIONS, CALL_STATUSES, findOption } from "@/config/call-log";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }) {
  const option = findOption(CALL_STATUSES, status);
  if (!option) return <Dash />;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1",
        option.className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {option.label}
    </span>
  );
}

export function DirectionLabel({ direction }) {
  const option = findOption(CALL_DIRECTIONS, direction);
  if (!option) return <Dash />;
  const Icon = option.icon;

  return (
    <span className={cn("inline-flex items-center gap-1.5 font-semibold", option.className)}>
      <Icon className="size-4" />
      {option.label}
    </span>
  );
}

/** Stands in for a value that wasn't recorded. */
export function Dash() {
  return (
    <span className="text-muted" aria-label="Not recorded">
      —
    </span>
  );
}
