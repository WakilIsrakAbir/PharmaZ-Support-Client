// Filters and formats for the Performance page. The filters live in the URL
// (?from=2026-07-01&to=2026-07-31&agents=id1,id2), so a view can be shared or bookmarked.

import { roleOf } from "@/config/roles";
import { toInputDate } from "@/lib/call-filters";
import { timezoneQuery } from "@/lib/format";

/** The longest period the API reports on. Keep in sync with MAX_DAYS in performance.validator.js. */
export const MAX_DAYS = 92;

export const DATE_PRESETS = [
  { value: "this-month", label: "This month" },
  { value: "last-month", label: "Last month" },
  { value: "last-7-days", label: "Last 7 days" },
  { value: "last-30-days", label: "Last 30 days" },
  { value: "last-90-days", label: "Last 90 days" },
];

/** { from, to } as "YYYY-MM-DD" for a preset, in the viewer's own calendar. Reads the clock. */
export function presetRange(preset) {
  const now = new Date();
  const [year, month, day] = [now.getFullYear(), now.getMonth(), now.getDate()];
  const range = (from, to = now) => ({ from: toInputDate(from), to: toInputDate(to) });
  const daysAgo = (days) => new Date(year, month, day - days);

  switch (preset) {
    case "last-month":
      return range(new Date(year, month - 1, 1), new Date(year, month, 0));
    case "last-7-days":
      return range(daysAgo(6));
    case "last-30-days":
      return range(daysAgo(29));
    case "last-90-days":
      return range(daysAgo(89));
    default:
      return range(new Date(year, month, 1));
  }
}

/** The preset matching `from`–`to`, or "custom". */
export function matchingPreset({ from, to }) {
  return DATE_PRESETS.find((preset) => {
    const range = presetRange(preset.value);
    return range.from === from && range.to === to;
  })?.value ?? "custom";
}

/** "2026-07-30" plus 3 days -> "2026-08-02" */
export function addDays(dateKey, days) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

/** The filters in the URL. Without dates, the page shows this month; without agents, everyone. */
export function readFilters(searchParams) {
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const agents = (searchParams.get("agents") ?? "").split(",").filter(Boolean);
  return from && to ? { from, to, agents } : { ...presetRange("this-month"), agents };
}

/** "from=...&to=...&agents=..." for the page's URL. */
export function toSearch({ from, to, agents }) {
  const params = new URLSearchParams({ from, to });
  if (agents.length) params.set("agents", agents.join(","));
  return params.toString();
}

/** The API's query string, with the viewer's timezone so days split at their midnight. */
export function toPerformanceQuery(filters) {
  return `${timezoneQuery()}&${toSearch(filters)}`;
}

/** 0.4012 -> "40.1%", null -> "—" */
export function formatRate(rate) {
  return rate == null ? "—" : `${(rate * 100).toFixed(1)}%`;
}

const dayFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** "1 Jul 2026 – 31 Jul 2026" */
export function formatRange({ from, to }) {
  const format = (key) => dayFormat.format(new Date(`${key}T00:00:00Z`));
  return from === to ? format(from) : `${format(from)} – ${format(to)}`;
}

/** "Tanha", "Tanha and Shanto", "Tanha, Shanto and 2 others" */
export function describePeople(people) {
  const names = people.map((person) => person.name);
  if (names.length <= 2) return names.join(" and ") || "Nobody";
  const others = names.length - 2;
  return `${names[0]}, ${names[1]} and ${others} other${others === 1 ? "" : "s"}`;
}

/** "Support Agent", or "Support Agent · left the team" for someone no longer in the product. */
export function describeRole(person) {
  const { label } = roleOf(person);
  return person.isMember || person.isSuperAdmin ? label : `${label} · left the team`;
}
