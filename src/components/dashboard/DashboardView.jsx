"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CloudOff,
  Flag,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  Tags,
  Trophy,
} from "lucide-react";
import { StatusBadge } from "@/components/call-logs/CallBadges";
import Notice from "@/components/ui/Notice";
import { optionColor } from "@/config/option-colors";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePagedList } from "@/hooks/usePagedList";
import { useProductSetup } from "@/hooks/useProductSetup";
import { formatRelative, getInitials, timezoneQuery } from "@/lib/format";
import { findByKey } from "@/lib/product-setup";
import { cn } from "@/lib/utils";

const PERIODS = [
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
];

const dayFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

/** The product's dashboard: how busy support is, and where the calls come from. */
export default function DashboardView() {
  const user = useCurrentUser();
  const [days, setDays] = useState(30);
  const { items, error, isLoading, reload } = usePagedList("/dashboard", `${timezoneQuery()}&days=${days}`);
  const dashboard = items?.totals ? items : null;

  if (error && !dashboard) {
    return (
      <Notice icon={CloudOff} title="Couldn't load the dashboard" text={error}>
        <button
          type="button"
          onClick={reload}
          className="mt-5 cursor-pointer rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-elevated"
        >
          Try again
        </button>
      </Notice>
    );
  }

  if (dashboard?.totals.allTime === 0) {
    return (
      <Notice icon={PhoneCall} title="No calls yet" text="Once the team logs calls, this page shows how support is going.">
        <Link
          href="/calls/log-call"
          className="mt-5 flex items-center gap-2 rounded-xl bg-accent-strong px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/30"
        >
          <PhoneCall className="size-4" />
          Log the first call
        </Link>
      </Notice>
    );
  }

  const periodLabel = `last ${days} days`;

  return (
    <div className={cn("space-y-6 transition-opacity", isLoading && dashboard && "opacity-60")}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {user?.product ? (
            <>
              <span className="font-semibold text-foreground">{user.product.name}</span> · charts cover the {periodLabel}
            </>
          ) : (
            <span className="inline-block h-4 w-48 animate-pulse rounded bg-elevated" />
          )}
        </p>
        <div role="group" aria-label="Period" className="flex gap-1 rounded-xl border border-border bg-surface p-1">
          {PERIODS.map((period) => (
            <button
              key={period.days}
              type="button"
              aria-pressed={days === period.days}
              onClick={() => setDays(period.days)}
              className={cn(
                "cursor-pointer rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors",
                days === period.days ? "bg-accent-strong text-accent-foreground" : "text-muted hover:text-foreground",
              )}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile label="Today" value={dashboard?.totals.today} highlight />
        <Tile label="Last 7 days" value={dashboard?.totals.last7Days} />
        <Tile label="This month" value={dashboard?.totals.thisMonth} />
        <Tile label="All time" value={dashboard?.totals.allTime} />
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card icon={CalendarDays} title="Calls per day" subtitle={`The ${periodLabel}`} className="xl:col-span-2">
          {dashboard ? <DailyChart daily={dashboard.daily} /> : <Placeholder height="h-56" />}
        </Card>
        <Card icon={Tags} title="By status" subtitle={`Calls in the ${periodLabel}`}>
          {dashboard ? <StatusBreakdown rows={dashboard.byStatus} /> : <Placeholder />}
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Card icon={Flag} title="Problem areas" subtitle="What customers call about">
          {dashboard ? <AreaBreakdown rows={dashboard.byArea} /> : <Placeholder />}
        </Card>
        <Card icon={Trophy} title="Busiest agents" subtitle={`Calls logged in the ${periodLabel}`}>
          {dashboard ? <AgentList rows={dashboard.byAgent} /> : <Placeholder />}
        </Card>
        <Card icon={PhoneCall} title="Direction" subtitle="Who called whom" className="lg:col-span-2 xl:col-span-1">
          {dashboard ? <DirectionSplit split={dashboard.byDirection} /> : <Placeholder />}
        </Card>
      </div>

      <Card
        icon={PhoneCall}
        title="Latest calls"
        subtitle="The most recent, newest first"
        action={
          <Link href="/calls/logs" className="flex items-center gap-1.5 text-sm font-semibold text-accent-text hover:underline">
            All call logs
            <ArrowRight className="size-4" />
          </Link>
        }
      >
        {dashboard ? <RecentCalls calls={dashboard.recent} /> : <Placeholder />}
      </Card>
    </div>
  );
}

function Tile({ label, value, highlight }) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-4 shadow-sm",
        highlight ? "border-accent/40 bg-accent/10" : "border-border bg-surface",
      )}
    >
      <p className={cn("text-xs font-semibold", highlight ? "text-accent-text" : "text-muted")}>{label}</p>
      {value === undefined ? (
        <span className="mt-2 block h-8 w-16 animate-pulse rounded bg-elevated" />
      ) : (
        <p className="mt-1 text-3xl font-bold tabular-nums">{value.toLocaleString()}</p>
      )}
      <p className="text-xs text-muted">calls</p>
    </div>
  );
}

function Card({ icon: Icon, title, subtitle, action, className, children }) {
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

function Placeholder({ height = "h-40" }) {
  return <div className={cn("animate-pulse rounded-xl bg-elevated", height)} />;
}

function Empty({ children }) {
  return <p className="py-6 text-center text-sm text-muted">{children}</p>;
}

/** One bar per day. Every few days get a date underneath, so the axis stays readable. */
function DailyChart({ daily }) {
  const busiest = Math.max(...daily.map((day) => day.count));
  const max = Math.max(1, busiest);
  const labelEvery = Math.ceil(daily.length / 7);
  const total = daily.reduce((sum, day) => sum + day.count, 0);

  return (
    <figure>
      <figcaption className="sr-only">
        {total} calls over {daily.length} days, at most {busiest} in a day.
      </figcaption>
      <div className="flex h-56 items-end gap-[2px] border-b border-border sm:gap-1" aria-hidden="true">
        {daily.map((day) => (
          <div key={day.date} className="group relative flex h-full flex-1 items-end">
            <div
              className="w-full rounded-t-[3px] bg-accent/70 transition-colors group-hover:bg-accent-strong"
              style={{ height: `${(day.count / max) * 100}%`, minHeight: day.count ? 3 : 0 }}
            />
            <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[11px] font-semibold text-background group-hover:block">
              {dayFormat.format(new Date(day.date))}: {day.count}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-[2px] sm:gap-1" aria-hidden="true">
        {daily.map((day, index) => (
          <span key={day.date} className="flex-1 overflow-visible whitespace-nowrap text-[10px] text-muted">
            {(daily.length - 1 - index) % labelEvery === 0 ? dayFormat.format(new Date(day.date)) : ""}
          </span>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">
        Busiest day: <span className="font-semibold text-foreground">{busiest}</span> calls
      </p>
    </figure>
  );
}

function Bars({ rows }) {
  const max = Math.max(1, ...rows.map((row) => row.count));
  return (
    <ul className="space-y-3">
      {rows.map((row) => (
        <li key={row.key}>
          <div className="mb-1 flex items-center justify-between gap-3 text-sm">
            <span className="min-w-0 truncate">{row.label}</span>
            <span className="font-semibold tabular-nums">{row.count}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-elevated">
            <div className={cn("h-full rounded-full", row.barClass)} style={{ width: `${(row.count / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function StatusBreakdown({ rows }) {
  const { setup } = useProductSetup();
  if (rows.length === 0) return <Empty>No calls in this period.</Empty>;

  return (
    <Bars
      rows={rows.map(({ status, count }) => {
        const option = findByKey(setup?.statuses, status);
        return {
          key: status ?? "none",
          label: option?.label ?? status ?? "No status",
          count,
          barClass: optionColor(option?.color).swatch,
        };
      })}
    />
  );
}

function AreaBreakdown({ rows }) {
  if (rows.length === 0) return <Empty>No calls in this period.</Empty>;
  return (
    <Bars
      rows={rows.map(({ area, count }) => ({
        key: area ?? "none",
        label: area ?? "No area picked",
        count,
        barClass: area ? "bg-accent" : "bg-slate-400",
      }))}
    />
  );
}

function AgentList({ rows }) {
  if (rows.length === 0) return <Empty>No calls in this period.</Empty>;
  return (
    <ol className="space-y-3">
      {rows.map((agent, index) => (
        <li key={agent.id} className="flex items-center gap-3">
          <span className="w-4 text-right text-xs font-bold text-muted">{index + 1}</span>
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent/10 text-[11px] font-bold text-accent-text">
            {getInitials(agent.name)}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm font-semibold">{agent.name ?? "Removed account"}</span>
          <span className="text-sm font-semibold tabular-nums">{agent.count}</span>
        </li>
      ))}
    </ol>
  );
}

function DirectionSplit({ split }) {
  const inbound = split.inbound ?? 0;
  const outbound = split.outbound ?? 0;
  const total = inbound + outbound;
  if (total === 0) return <Empty>No calls in this period.</Empty>;
  const inboundShare = Math.round((inbound / total) * 100);

  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full bg-elevated" aria-hidden="true">
        <span className="bg-teal-500" style={{ width: `${inboundShare}%` }} />
        <span className="flex-1 bg-sky-500" />
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <dt className="flex items-center gap-1.5 text-xs font-semibold text-teal-500">
            <PhoneIncoming className="size-4" />
            Inbound
          </dt>
          <dd className="mt-1 text-2xl font-bold tabular-nums">{inbound}</dd>
          <dd className="text-xs text-muted">{inboundShare}% of calls</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 text-xs font-semibold text-sky-500">
            <PhoneOutgoing className="size-4" />
            Outbound
          </dt>
          <dd className="mt-1 text-2xl font-bold tabular-nums">{outbound}</dd>
          <dd className="text-xs text-muted">{100 - inboundShare}% of calls</dd>
        </div>
      </dl>
    </div>
  );
}

function RecentCalls({ calls }) {
  return (
    <ul className="divide-y divide-border">
      {calls.map((call) => (
        <li key={call.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3 first:pt-0 last:pb-0">
          <span className="w-28 shrink-0 font-mono text-sm font-semibold">{call.mobile}</span>
          <span className="min-w-0 flex-1 truncate text-sm">
            {call.areaName ?? <span className="text-muted">No area</span>}
            {call.issue && <span className="text-muted"> · {call.issue}</span>}
          </span>
          <StatusBadge status={call.status} />
          <span className="shrink-0 whitespace-nowrap text-right text-xs text-muted sm:w-44 max-sm:text-left">
            {call.createdBy?.name} · {formatRelative(call.calledAt)}
          </span>
        </li>
      ))}
    </ul>
  );
}
