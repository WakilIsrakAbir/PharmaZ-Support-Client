import { PROBLEM_AREAS } from "@/config/call-log";
import { cn } from "@/lib/utils";

export default function ProblemAreaPicker({ value, onChange }) {
  return (
    <div role="group" aria-label="Problem area" className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-5">
      {PROBLEM_AREAS.map((area) => {
        const Icon = area.icon;
        const isActive = value === area.value;

        return (
          <button
            key={area.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(area.value)}
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
            <span className="text-[13px] font-semibold leading-tight">{area.label}</span>
          </button>
        );
      })}
    </div>
  );
}
