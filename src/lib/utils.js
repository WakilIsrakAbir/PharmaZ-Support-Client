/** Joins class names together, skipping any falsy values. */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
