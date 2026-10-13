// A fixed locale keeps the output the same on every machine.
const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
const timeFormat = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });

/** "Oct 12, 2026" */
export function formatDate(timestamp) {
  return dateFormat.format(timestamp);
}

/** "10:20 PM" */
export function formatTime(timestamp) {
  return timeFormat.format(timestamp);
}
