import { cn } from "@/lib/utils";

export default function OptionCard({ isActive, className, children, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      className={cn(
        "rounded-xl border p-3 text-left transition-all duration-200",
        isActive
          ? "border-accent bg-accent/10 shadow-lg shadow-accent/10"
          : "border-border bg-elevated hover:-translate-y-0.5 hover:border-accent/40",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
