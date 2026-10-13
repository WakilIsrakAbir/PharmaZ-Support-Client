import { cn } from "@/lib/utils";

/** An on/off toggle. `label` is read out by screen readers. */
export default function Switch({ checked, onChange, label, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border transition-colors disabled:cursor-wait disabled:opacity-60",
        checked ? "border-accent-strong bg-accent-strong" : "border-border bg-elevated",
      )}
    >
      <span
        className={cn(
          "inline-block size-4.5 rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-5.5" : "translate-x-0.5",
        )}
      />
    </button>
  );
}
