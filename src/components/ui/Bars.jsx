import { cn } from "@/lib/utils";

/**
 * Labelled horizontal bars, e.g. calls per status.
 * Each row: { key, label, value, text?, barClass? }. `text` is what's printed (defaults to
 * the value). Bars are sized against the biggest value, or against `max` when given
 * (e.g. 1 for rates).
 */
export default function Bars({ rows, max }) {
  const scale = max ?? Math.max(1, ...rows.map((row) => row.value ?? 0));

  return (
    <ul className="space-y-3">
      {rows.map((row) => (
        <li key={row.key}>
          <div className="mb-1 flex items-center justify-between gap-3 text-sm">
            <span className="min-w-0 truncate">{row.label}</span>
            <span className="shrink-0 font-semibold tabular-nums">{row.text ?? row.value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-elevated">
            <div
              className={cn("h-full rounded-full", row.barClass ?? "bg-accent")}
              style={{ width: `${((row.value ?? 0) / scale) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
