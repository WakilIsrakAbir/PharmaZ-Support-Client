import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-xl border border-border bg-background/40 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted/70 hover:border-accent/40 focus:border-accent focus:ring-4 focus:ring-accent/15";

/**
 * A label, the input passed as children, and an error or help text underneath.
 * `labelAction` sits at the right of the label, e.g. a "Forgot password?" link.
 */
export function Field({ label, htmlFor, required, optional, hint, help, error, labelAction, children }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="flex flex-wrap items-baseline gap-x-1.5 text-sm font-semibold">
          {label}
          {required && <span className="text-rose-500">*</span>}
          {optional && <span className="text-xs font-normal text-muted">(optional)</span>}
          {hint && <span className="text-xs font-normal text-muted">{hint}</span>}
        </label>
        {labelAction}
      </div>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-rose-500">{error}</p>
      ) : (
        help && <p className="mt-1.5 text-xs text-muted">{help}</p>
      )}
    </div>
  );
}

export const selectClass =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition-colors hover:border-accent/40 focus:border-accent focus:ring-4 focus:ring-accent/15 [&>option]:bg-surface [&>option]:text-foreground [&>optgroup]:bg-surface [&>optgroup]:text-foreground";

export function Select({ className, children, ...props }) {
  return (
    <div className="relative">
      <select className={cn(selectClass, "cursor-pointer appearance-none pr-10", className)} {...props}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
    </div>
  );
}
