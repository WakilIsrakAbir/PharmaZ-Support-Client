import Skeleton from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

/** A panel with an icon, title and subtitle on top, and an optional action on the right. */
export default function Card({ icon: Icon, title, subtitle, action, className, children }) {
  return (
    <section className={cn("flex flex-col rounded-2xl border border-border bg-surface shadow-sm", className)}>
      <header className="flex items-center gap-3 border-b border-border px-5 py-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent-text">
          <Icon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold">{title}</h2>
          <p className="truncate text-xs text-muted">{subtitle}</p>
        </div>
        {action}
      </header>
      <div className="flex-1 p-5">{children}</div>
    </section>
  );
}

/** A grey block shown while a card's content loads. */
export function Placeholder({ height = "h-40" }) {
  return <Skeleton className={height} />;
}

/** One line of text for a card with nothing to show. */
export function Empty({ children }) {
  return <p className="py-6 text-center text-sm text-muted">{children}</p>;
}
