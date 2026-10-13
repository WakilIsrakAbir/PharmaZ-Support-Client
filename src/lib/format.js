// A fixed locale keeps the output the same on every machine.
const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
const timeFormat = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
const dateTimeFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
const monthYearFormat = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });

// Each accepts a timestamp, a Date or an ISO string from the API.

/** "Oct 12, 2026" */
export function formatDate(value) {
  return dateFormat.format(new Date(value));
}

/** "10:20 PM" */
export function formatTime(value) {
  return timeFormat.format(new Date(value));
}

/** "Oct 13, 02:34 PM" */
export function formatDateTime(value) {
  return dateTimeFormat.format(new Date(value));
}

/** "October 2026" */
export function formatMonthYear(value) {
  return monthYearFormat.format(new Date(value));
}

/** "Wakil Israk Abir" -> "WI" */
export function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

/** 225 -> "3m 45s", 45 -> "45s" */
export function formatDuration(seconds) {
  if (seconds == null) return "—";
  const minutes = Math.floor(seconds / 60);
  const rest = String(seconds % 60).padStart(2, "0");
  return minutes ? `${minutes}m ${rest}s` : `${seconds}s`;
}
