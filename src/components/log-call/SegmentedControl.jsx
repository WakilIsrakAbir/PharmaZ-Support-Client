import { cn } from "@/lib/utils";

export default function SegmentedControl({ label, options, value, onChange }) {
  return (
    <div role="group" aria-label={label} className="flex gap-1 rounded-xl border border-border bg-elevated p-1">
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all",
              isActive ? "bg-surface text-accent-text shadow-sm" : "text-muted hover:text-foreground",
            )}
          >
            {Icon && <Icon className="size-4" />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
