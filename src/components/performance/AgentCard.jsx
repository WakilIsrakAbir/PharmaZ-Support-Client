import Bars from "@/components/ui/Bars";
import Sparkline from "@/components/ui/Sparkline";
import { formatDuration, getInitials } from "@/lib/format";
import { describeRole, formatRate } from "@/lib/performance";
import { cn } from "@/lib/utils";

/** One person's period: their numbers, calls per day, and why customers called them. */
export default function AgentCard({ agent }) {
  const header = (
    <header className="flex items-center gap-3 border-b border-border pb-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-xs font-bold text-accent-text">
        {getInitials(agent.name)}
      </span>
      <div className="min-w-0">
        <h3 className="truncate font-semibold">{agent.name}</h3>
        <p className="truncate text-xs text-muted">
          {describeRole(agent)}
          {agent.calls > 0 && ` · ${formatRate(agent.share)} of the calls reviewed`}
        </p>
      </div>
    </header>
  );

  if (agent.calls === 0) {
    return (
      <article className="flex flex-col rounded-2xl border border-dashed border-border p-5">
        {header}
        <p className="flex flex-1 items-center justify-center py-10 text-sm text-muted">No calls logged in these days.</p>
      </article>
    );
  }

  const { kinds, calls } = agent.otherReasons;

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-sm">
      {header}

      <section className="border-b border-border py-4">
        <Label>Calls handled</Label>
        <p className="text-4xl font-bold tabular-nums">{agent.calls.toLocaleString()}</p>
        <dl className="mt-4 grid grid-cols-2 gap-4">
          <Stat label="Resolved" value={formatRate(agent.resolvedRate)} className="text-emerald-500" />
          <Stat label="Awaiting" value={agent.awaiting.toLocaleString()} className="text-amber-500" />
          <Stat label="Average call" value={formatDuration(agent.avgSeconds)} />
          <Stat label="In / out" value={`${agent.inbound} / ${agent.outbound}`} />
        </dl>
      </section>

      <section className="border-b border-border py-4">
        <Label>Day by day</Label>
        <Sparkline values={agent.daily} label={`${agent.name}'s calls per day`} />
      </section>

      <section className="pt-4">
        <Label>Why they called</Label>
        <Bars rows={agent.reasons.map((reason) => ({ key: reason.label, label: reason.label, value: reason.count }))} />
        {kinds > 0 && (
          <p className="mt-3 text-xs text-muted">
            + {kinds} other reason{kinds === 1 ? "" : "s"} ({calls.toLocaleString()} calls)
          </p>
        )}
      </section>
    </article>
  );
}

function Label({ children }) {
  return <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted">{children}</h4>;
}

function Stat({ label, value, className }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className={cn("mt-0.5 font-bold tabular-nums", className)}>{value}</dd>
    </div>
  );
}
