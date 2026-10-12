import { Check } from "lucide-react";
import { ACCENT_COLORS } from "@/config/theme";
import OptionCard from "./OptionCard";

export default function AccentOptions({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {ACCENT_COLORS.map((accent) => {
        const isActive = value === accent.value;

        return (
          <OptionCard
            key={accent.value}
            isActive={isActive}
            onClick={() => onChange(accent.value)}
            className="flex items-center gap-2.5"
          >
            {/* data-accent gives this dot its own --accent, so every swatch shows its real color */}
            <span
              data-accent={accent.value}
              className="size-3.5 shrink-0 rounded-full bg-accent shadow-[0_0_10px_var(--accent)]"
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold">{accent.label}</span>
              <span className="block truncate text-[11px] text-muted">{accent.description}</span>
            </span>
            {isActive && <Check className="size-4 shrink-0 text-accent-text" />}
          </OptionCard>
        );
      })}
    </div>
  );
}
