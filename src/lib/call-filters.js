// Turns the filters on the Call Logs page into the API's query string.

export const DATE_RANGES = [
  { value: "", label: "Any date" },
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last-7-days", label: "Last 7 days" },
  { value: "last-30-days", label: "Last 30 days" },
  { value: "this-month", label: "This month" },
  { value: "custom", label: "Custom range" },
];

// fromDate / toDate are "YYYY-MM-DD" from the date inputs, used when dateRange is "custom"
export const EMPTY_FILTERS = { search: "", direction: "", area: "", status: "", dateRange: "", fromDate: "", toDate: "" };

const DAY = 86_400_000;

/** "2026-10-05" -> midnight on that day, in the agent's own time zone. */
function parseDay(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** A Date -> "2026-10-05", the format date inputs use. */
export function toInputDate(date) {
  const pad = (number) => String(number).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** { from, to } for the chosen range: from is inclusive, to is exclusive. */
function getDateRange({ dateRange, fromDate, toDate }) {
  // Return before reading the clock: "Any date" is what the server pre-renders
  if (!dateRange) return {};

  if (dateRange === "custom") {
    // Picked the wrong way round? Swap them rather than showing nothing.
    const [first, last] = fromDate && toDate && fromDate > toDate ? [toDate, fromDate] : [fromDate, toDate];
    return {
      from: first ? parseDay(first) : undefined,
      // Both days count, so stop at the start of the day after `last`
      to: last ? new Date(parseDay(last).getTime() + DAY) : undefined,
    };
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const daysAgo = (days) => new Date(startOfToday.getTime() - days * DAY);
  const tomorrow = daysAgo(-1);

  switch (dateRange) {
    case "today":
      return { from: startOfToday, to: tomorrow };
    case "yesterday":
      return { from: daysAgo(1), to: startOfToday };
    case "last-7-days":
      return { from: daysAgo(6), to: tomorrow };
    case "last-30-days":
      return { from: daysAgo(29), to: tomorrow };
    case "this-month":
      return { from: new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1), to: tomorrow };
    default:
      return {};
  }
}

/** True when any filter narrows the list (custom dates only count once a day is picked). */
export function hasActiveFilters({ dateRange, fromDate, toDate, ...filters }) {
  const hasDates = dateRange === "custom" ? Boolean(fromDate || toDate) : Boolean(dateRange);
  return hasDates || Object.values(filters).some((value) => value.trim());
}

/** "?page=2&limit=10&status=resolved&from=..." with only the filters that are set. */
export function toCallsQuery({ dateRange, fromDate, toDate, ...filters }, page, limit) {
  const { from, to } = getDateRange({ dateRange, fromDate, toDate });
  const params = new URLSearchParams({ page, limit });

  for (const [name, value] of Object.entries(filters)) {
    if (value.trim()) params.set(name, value.trim());
  }
  if (from) params.set("from", from.toISOString());
  if (to) params.set("to", to.toISOString());

  return `?${params}`;
}
