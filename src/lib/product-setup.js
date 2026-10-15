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
