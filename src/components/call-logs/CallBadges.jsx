import { CALL_DIRECTIONS, findOption } from "@/config/call-log";
import { optionColor } from "@/config/option-colors";
import { useProductSetup } from "@/hooks/useProductSetup";
import { findByKey } from "@/lib/product-setup";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }) {
  const { setup } = useProductSetup();
  return <OptionBadge option={findByKey(setup?.statuses, status)} value={status} />;
}

export function PriorityBadge({ priority }) {
  const { setup } = useProductSetup();
  return <OptionBadge option={findByKey(setup?.priorities, priority)} value={priority} />;
}

/** A status or priority in its colour. A key the setup doesn't know is shown as it is. */
function OptionBadge({ option, value }) {
  if (!value) return <Dash />;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1",
        optionColor(option?.color).badge,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {option?.label ?? value}
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
