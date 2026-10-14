import { cn } from "@/lib/utils";

/**
 * The body of an error or "not found" page: a large code, an icon, what happened, and
 * what to do next (`children`: the buttons). `reference` is shown so people can quote it
 * to support; `details` (the raw message) only appears while developing.
 */
export default function ErrorScreen({ code, icon: Icon, title, text, reference, details, tone = "danger", children }) {
  const isDanger = tone === "danger";

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-16 text-center">
      <div className="relative">
        <p
          aria-hidden="true"
          className={cn(
            "select-none bg-linear-to-b from-foreground/15 to-transparent bg-clip-text font-black tracking-tighter text-transparent",
            String(code).length > 3 ? "text-6xl sm:text-7xl" : "text-8xl sm:text-9xl",
          )}
        >
          {code}
        </p>
        <span
          className={cn(
            "absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl bg-surface shadow-lg ring-1",
            isDanger ? "text-rose-500 shadow-rose-500/15 ring-rose-500/30" : "text-accent-text shadow-accent/15 ring-accent/30",
          )}
        >
          <Icon className="size-7" />
        </span>
      </div>

      <h1 className="mt-2 text-2xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>

      {children && <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>}

      {reference && (
        <p className="mt-8 text-xs text-muted">
          Reference: <code className="rounded-md bg-elevated px-1.5 py-0.5 font-mono">{reference}</code>
        </p>
      )}

      {details && process.env.NODE_ENV === "development" && (
        <details className="mt-6 w-full rounded-xl border border-border bg-surface text-left text-xs">
          <summary className="cursor-pointer px-4 py-3 font-semibold text-muted">Details (only shown while developing)</summary>
          <pre className="overflow-x-auto whitespace-pre-wrap border-t border-border px-4 py-3 font-mono text-rose-500">
            {details}
          </pre>
        </details>
      )}
    </div>
  );
}

/** The two button styles error pages use. */
export const primaryButtonClass =
  "flex cursor-pointer items-center gap-2 rounded-xl bg-accent-strong px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/30 transition-opacity hover:opacity-90";
export const secondaryButtonClass =
  "flex cursor-pointer items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-elevated";
