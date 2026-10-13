// Small helpers for reading the product setup (see hooks/useProductSetup.js).

/** The status or priority saved under `key`, switched on or not. */
export function findByKey(options = [], key) {
  return options.find((option) => option.key === key);
}

/** The list's default (what a new call gets when nothing is picked). */
export function defaultKey(options = []) {
  return options.find((option) => option.isDefault)?.key ?? "";
}

/**
 * The options a form can offer: the switched-on ones, plus `currentKey` when a call
 * already uses one that has since been switched off (so the form can keep it).
 */
export function selectableOptions(options = [], currentKey) {
  return options.filter((option) => option.isActive || option.key === currentKey);
}

/** Extra fields to show on a call: the active ones, plus switched-off ones it has answers for. */
export function fieldsWithAnswers(fields = [], answers = {}) {
  return fields.filter((field) => field.isActive || answers[field.key] !== undefined);
}

/** An answer as text, e.g. a date as "1 Oct 2026". */
export function formatAnswer(field, value) {
  if (value === undefined || value === null || value === "") return "";
  if (field.type === "date") {
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime())
      ? String(value)
      : date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }
  if (field.type === "number") return Number(value).toLocaleString("en-US", { maximumFractionDigits: 2 });
  return String(value);
}
