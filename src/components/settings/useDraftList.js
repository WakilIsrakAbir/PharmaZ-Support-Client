import { useState } from "react";

// Rows get a local id so React can track them, including new rows that have no key yet
let lastUid = 0;
const withUid = (item) => ({ ...item, uid: `row-${++lastUid}` });
const withoutUid = ({ uid: _uid, ...item }) => item;

/**
 * An editable copy of a saved list (statuses, priorities, form fields). Nothing reaches
 * the server until the page saves; `reset` starts again from a saved version.
 */
export function useDraftList(saved) {
  const [baseline, setBaseline] = useState(saved);
  const [rows, setRows] = useState(() => saved.map(withUid));

  const isDirty = JSON.stringify(rows.map(withoutUid)) !== JSON.stringify(baseline);

  function update(uid, changes) {
    setRows((current) => current.map((row) => (row.uid === uid ? { ...row, ...changes } : row)));
  }

  /** Moves a row up (-1) or down (+1) among the rows that are switched on. */
  function move(uid, step) {
    setRows((current) => {
      const active = current.filter((row) => row.isActive);
      const from = active.findIndex((row) => row.uid === uid);
      const to = from + step;
      if (from < 0 || to < 0 || to >= active.length) return current;

      [active[from], active[to]] = [active[to], active[from]];
      return [...active, ...current.filter((row) => !row.isActive)];
    });
  }

  function add(item) {
    setRows((current) => [...current, withUid(item)]);
  }

  function reset(newSaved = baseline) {
    setBaseline(newSaved);
    setRows(newSaved.map(withUid));
  }

  return { rows, setRows, isDirty, update, move, add, reset, toSaved: () => rows.map(withoutUid) };
}
