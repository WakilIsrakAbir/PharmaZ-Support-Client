import { cn } from "@/lib/utils";

const WIDTH = 100;
const HEIGHT = 32;

/**
 * A small line chart of `values` (e.g. calls per day), filling the width it's given.
 * `label` describes it for screen readers.
 */
export default function Sparkline({ values, label, className }) {
  const max = Math.max(1, ...values);
  const step = values.length > 1 ? WIDTH / (values.length - 1) : WIDTH;
  // Keep a little room at the top and bottom so the line isn't clipped
  const points = (values.length > 1 ? values : [values[0] ?? 0, values[0] ?? 0]).map(
    (value, index) => `${(index * step).toFixed(2)},${(HEIGHT - 2 - (value / max) * (HEIGHT - 4)).toFixed(2)}`,
  );
  const line = `M${points.join(" L")}`;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      role="img"
      aria-label={label}
      className={cn("h-12 w-full overflow-visible text-accent", className)}
    >
      <path d={`${line} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z`} className="fill-current opacity-10" />
      <path
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
