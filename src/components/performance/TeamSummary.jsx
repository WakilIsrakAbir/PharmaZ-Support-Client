import Link from "next/link";
import { Placeholder } from "@/components/ui/Card";
import Sparkline from "@/components/ui/Sparkline";
import { formatDuration } from "@/lib/format";
import { describePeople, formatRange, formatRate } from "@/lib/performance";
import { cn } from "@/lib/utils";

/** The headline card: everyone picked, added together, with calls per day underneath. */
export default function TeamSummary({ report }) {
  if (!report) return <Placeholder height="h-52" />;

  const { team, agents, range, closedStatuses } = report;

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Calls handled between them</p>
          <p className="mt-1 text-5xl font-bold tabular-nums">{team.calls.toLocaleString()}</p>
          <p className="mt-2 truncate text-sm text-muted">
            {describePeople(agents)} · {formatRange(range)}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-5">
          <Stat label="Closed" value={team.closed.toLocaleString()} className="text-emerald-500" />
          <Stat label="Awaiting action" value={team.awaiting.toLocaleString()} className="text-amber-500" />
          <Stat label="Resolved rate" value={formatRate(team.resolvedRate)} />
          <Stat label="Average call" value={formatDuration(team.avgSeconds)} />
          <Stat label="Days reviewed" value={range.days.length} />
        </dl>
      </div>

      <Sparkline
        values={team.daily}
        label={`Calls per day, at most ${Math.max(0, ...team.daily)} in a day`}
        className="mt-5 h-16"
      />

      {closedStatuses.length === 0 && (
        <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm">
          No status is marked “Closes call” yet, so nothing counts as resolved.{" "}
          <Link href="/settings/statuses" className="font-semibold text-accent-text hover:underline">
            Choose them in Settings
          </Link>
        </p>
      )}
    </section>
  );
}

function Stat({ label, value, className }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</dt>
      <dd className={cn("mt-1 text-xl font-bold tabular-nums", className)}>{value}</dd>
    </div>
  );
}
