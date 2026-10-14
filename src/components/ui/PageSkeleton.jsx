import Skeleton from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

/**
 * The outline of a typical page (title, a row of tiles, two cards and a list) shown
 * while a page loads, so the layout doesn't jump when the real one arrives.
 */
export default function PageSkeleton() {
  return (
    <div role="status" aria-label="Loading the page" className="page-container py-8">
      <div className="mb-6 border-b border-border pb-5">
        <Skeleton className="h-7 w-48 rounded-lg" />
        <Skeleton className="mt-2 h-4 w-72 max-w-full rounded-md" />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Panel key={index} className="p-4">
            <Skeleton className="h-3 w-16 rounded-md" />
            <Skeleton className="mt-3 h-8 w-20 rounded-lg" />
          </Panel>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <CardSkeleton className="lg:col-span-2">
          <Skeleton className="h-52 rounded-xl" />
        </CardSkeleton>
        <CardSkeleton>
          <div className="space-y-4">
            {[90, 70, 55, 35].map((width) => (
              <div key={width}>
                <Skeleton className="h-3 rounded-md" style={{ width: `${width}%` }} />
                <Skeleton className="mt-2 h-2 rounded-full" />
              </div>
            ))}
          </div>
        </CardSkeleton>
      </div>

      <CardSkeleton className="mt-6">
        <div className="space-y-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="flex items-center gap-4">
              <Skeleton className="size-9 shrink-0 rounded-xl" />
              <Skeleton className="h-4 flex-1 rounded-md" />
              <Skeleton className="hidden h-4 w-24 rounded-md sm:block" />
            </div>
          ))}
        </div>
      </CardSkeleton>

      <span className="sr-only">Loading…</span>
    </div>
  );
}

function Panel({ className, children }) {
  return <div className={cn("rounded-2xl border border-border bg-surface shadow-sm", className)}>{children}</div>;
}

/** Matches the Card component: an icon and title on top, content underneath. */
function CardSkeleton({ className, children }) {
  return (
    <Panel className={className}>
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <Skeleton className="size-9 rounded-xl" />
        <div className="flex-1">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="mt-1.5 h-3 w-48 max-w-full rounded-md" />
        </div>
      </div>
      <div className="p-5">{children}</div>
    </Panel>
  );
}
