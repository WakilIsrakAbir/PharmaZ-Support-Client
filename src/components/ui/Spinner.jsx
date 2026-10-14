import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A spinning circle for waits with nothing to sketch yet (a redirect, a first load).
 * `label` is shown under it; screen readers hear it either way.
 */
export default function Spinner({ label = "Loading…", showLabel = false, className }) {
  return (
    <div role="status" className={cn("flex flex-col items-center gap-3 text-accent-text", className)}>
      <LoaderCircle aria-hidden="true" className="size-8 animate-spin" />
      <span className={showLabel ? "text-sm font-medium text-muted" : "sr-only"}>{label}</span>
    </div>
  );
}
