import { Check } from "lucide-react";
import { THEME_MODES } from "@/config/theme";
import { cn } from "@/lib/utils";
import OptionCard from "./OptionCard";

export default function ModeOptions({ value, onChange }) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-3">
      {THEME_MODES.map((mode) => {
        const Icon = mode.icon;
        const isActive = value === mode.value;

        return (
          <OptionCard key={mode.value} isActive={isActive} onClick={() => onChange(mode.value)}>
            <span className="flex items-center gap-1.5">
              <Icon className={cn("size-3.5 shrink-0", isActive ? "text-accent-text" : "text-muted")} />
              <span className="text-xs font-semibold whitespace-nowrap">{mode.label}</span>
              {isActive && <Check className="ml-auto size-3.5 shrink-0 text-accent-text" />}
            </span>
            <span className="mt-1 block text-[11px] leading-snug text-muted">{mode.description}</span>
          </OptionCard>
        );
      })}
    </div>
  );
}
