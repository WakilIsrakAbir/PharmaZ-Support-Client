import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const CHECKS = [
  { label: "At least 8 characters", test: (password) => password.length >= 8 },
  { label: "Upper and lower case letters", test: (password) => /[a-z]/.test(password) && /[A-Z]/.test(password) },
  { label: "A number", test: (password) => /\d/.test(password) },
  { label: "A symbol, like ! or #", test: (password) => /[^A-Za-z\d]/.test(password) },
];

const LEVELS = [
  { label: "Too short", bar: "bg-rose-500", text: "text-rose-500" },
  { label: "Weak", bar: "bg-rose-500", text: "text-rose-500" },
  { label: "Fair", bar: "bg-amber-500", text: "text-amber-500" },
  { label: "Good", bar: "bg-sky-500", text: "text-sky-500" },
  { label: "Strong", bar: "bg-emerald-500", text: "text-emerald-500" },
];

/** Bars that fill as the password gets stronger, with an optional checklist of tips. */
export default function PasswordStrength({ password, showChecklist = false }) {
  const results = CHECKS.map((check) => ({ ...check, passed: check.test(password) }));
  // Anything under 8 characters is rejected by the server, so it can't score above zero
  const score = password.length < 8 ? 0 : results.filter((check) => check.passed).length;
  const level = LEVELS[score];

  return (
    <div aria-live="polite">
      <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-widest text-muted">
        Strength
        {password && <span className={cn("normal-case tracking-normal", level.text)}>{level.label}</span>}
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {LEVELS.slice(1).map((_, index) => (
          <span
            key={index}
            className={cn("h-1.5 rounded-full transition-colors", index < score ? level.bar : "bg-border")}
          />
        ))}
      </div>

      {showChecklist && (
        <ul className="mt-4 space-y-2.5 text-sm">
          {results.map(({ label, passed }) => (
            <li key={label} className={cn("flex items-center gap-2.5", passed ? "text-foreground" : "text-muted")}>
              <span
                className={cn(
                  "grid size-5 place-items-center rounded-full border transition-colors",
                  passed ? "border-emerald-500 bg-emerald-500 text-white" : "border-border",
                )}
              >
                {passed && <Check className="size-3" strokeWidth={3} />}
              </span>
              {label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
