import { ROLES } from "@/config/roles";

/** Team totals at the top of the Users page. */
export default function UserSummary({ summary }) {
  const adminShare = summary.total ? (summary.admins / summary.total) * 100 : 0;

  return (
    <section className="grid gap-6 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:grid-cols-[auto_1fr] sm:divide-x sm:divide-border">
      <div className="sm:pr-8">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Accounts</p>
        <p className="mt-1 text-4xl font-bold tabular-nums">{summary.total}</p>
        <p className="mt-1 text-xs text-muted">{summary.signedInThisMonth} signed in this month</p>
      </div>

      <div className="sm:pl-8">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Access</p>
        <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-border" aria-hidden="true">
          <span className="bg-indigo-500 transition-all" style={{ width: `${adminShare}%` }} />
          <span className="flex-1 bg-amber-500" />
        </div>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
          <Legend color="bg-indigo-500" label={ROLES.admin.label} count={summary.admins} />
          <Legend color="bg-amber-500" label={ROLES.agent.label} count={summary.agents} />
        </ul>
      </div>
    </section>
  );
}

function Legend({ color, label, count }) {
  return (
    <li className="flex items-center gap-2 text-muted">
      <span className={`size-2.5 rounded-sm ${color}`} />
      {label}
      <span className="font-semibold tabular-nums text-foreground">{count}</span>
    </li>
  );
}
