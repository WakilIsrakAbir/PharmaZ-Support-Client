import { areaIcon } from "@/config/area-icons";
import { cn } from "@/lib/utils";

const GRID = "grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-5";

/** The product's problem areas as cards. `areas` is null while the setup is loading. */
export default function ProblemAreaPicker({ areas, value, onChange }) {
  if (!areas) {
    return (
      <div className={GRID} aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="h-21 animate-pulse rounded-xl bg-elevated" />
        ))}
      </div>
    );
  }

  if (areas.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-4 py-5 text-center text-sm text-muted">
        No problem areas are set up yet. A product admin can add them under Settings → Problem areas.
      </p>
    );
  }

  return (
    <div role="group" aria-label="Problem area" className={GRID}>
      {areas.map((area) => {
        const Icon = areaIcon(area.icon);
        const isActive = value === area.id;

        return (
          <button
            key={area.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(area.id)}
            className={cn(
              "flex cursor-pointer flex-col items-start gap-2.5 rounded-xl border p-3 text-left transition-all duration-200",
              isActive
                ? "border-accent bg-accent/10 shadow-md shadow-accent/10"
                : "border-border bg-background/40 hover:-translate-y-0.5 hover:border-accent/40",
            )}
          >
            <span
              className={cn(
                "grid size-8 place-items-center rounded-lg transition-colors",
                isActive ? "bg-accent-strong text-accent-foreground" : "bg-accent/10 text-accent-text",
              )}
            >
              <Icon className="size-4" />
            </span>
            <span className="text-[13px] font-semibold leading-tight">{area.name}</span>
          </button>
        );
      })}
    </div>
  );
}
