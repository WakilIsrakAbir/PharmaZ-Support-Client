import { useEffect, useState } from "react";
import { api } from "@/lib/api";

// The last answer for each request, kept for this browser tab. Opening a page (or a filter)
// again shows it straight away while a fresh copy loads in the background. Logging out and
// switching product reload the whole app, which empties it.
const cache = new Map();
const MAX_ENTRIES = 50;

function remember(url, entry) {
  cache.delete(url);
  cache.set(url, entry);
  if (cache.size > MAX_ENTRIES) cache.delete(cache.keys().next().value);
}

const EMPTY = { url: null, requestKey: null, items: [], meta: null, extra: {}, error: "" };

/**
 * One page of a list endpoint, e.g. usePagedList("/calls", "?page=1&limit=10").
 * - Seen before: the saved answer shows at once and is refreshed quietly.
 * - Not seen yet: the previous page stays on screen (isLoading) until the new one arrives.
 * - reload() always fetches, with isLoading on.
 * `extra` holds anything else the endpoint sends next to `data` and `meta`.
 */
export function usePagedList(path, query) {
  const url = `${path}${query}`;
  const [version, setVersion] = useState(0);
  const requestKey = `${url}#${version}`;
  const [result, setResult] = useState(() => {
    const saved = cache.get(url);
    return saved ? { ...EMPTY, ...saved, url, requestKey } : EMPTY;
  });

  useEffect(() => {
    let isCancelled = false;

    api(url)
      .then(({ data, meta, ...extra }) => {
        const entry = { items: data, meta, extra };
        remember(url, entry);
        if (!isCancelled) setResult({ ...entry, url, requestKey, error: "" });
      })
      .catch((error) => {
        if (!isCancelled) setResult((current) => ({ ...current, requestKey, error: error.message }));
      });

    return () => {
      isCancelled = true;
    };
  }, [url, requestKey]);

  // Moved to another page or filter that was seen before: show its saved answer meanwhile
  const saved = result.url !== url ? cache.get(url) : undefined;
  const shown = saved ?? result;

  return {
    items: shown.items,
    meta: shown.meta,
    extra: shown.extra,
    error: result.error,
    isLoading: !saved && result.requestKey !== requestKey,
    reload: () => setVersion((current) => current + 1),
    // Swaps in an edited item without reloading the page
    replaceItem: (updated) => {
      const swap = (items) => items.map((item) => (item.id === updated.id ? updated : item));
      const entry = cache.get(url);
      if (entry) remember(url, { ...entry, items: swap(entry.items) });
      setResult((current) => ({ ...current, items: swap(current.items) }));
    },
  };
}
