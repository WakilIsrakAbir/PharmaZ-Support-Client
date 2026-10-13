import { useEffect, useState } from "react";
import { api } from "@/lib/api";

/**
 * One page of a list endpoint, e.g. usePagedList("/calls", "?page=1&limit=10").
 * The previous page stays on screen while the next one loads.
 * `extra` holds anything else the endpoint sends next to `data` and `meta`.
 */
export function usePagedList(path, query) {
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState({ requestKey: null, items: [], meta: null, extra: {}, error: "" });
  const requestKey = `${path}${query}#${version}`;

  useEffect(() => {
    let isCancelled = false;

    api(`${path}${query}`)
      .then(({ data, meta, ...extra }) => {
        if (!isCancelled) setResult({ requestKey, items: data, meta, extra, error: "" });
      })
      .catch((error) => {
        if (!isCancelled) setResult((current) => ({ ...current, requestKey, error: error.message }));
      });

    return () => {
      isCancelled = true;
    };
  }, [path, query, requestKey]);

  return {
    items: result.items,
    meta: result.meta,
    extra: result.extra,
    error: result.error,
    isLoading: result.requestKey !== requestKey,
    reload: () => setVersion((current) => current + 1),
    // Swaps in an edited item without reloading the page
    replaceItem: (updated) =>
      setResult((current) => ({
        ...current,
        items: current.items.map((item) => (item.id === updated.id ? updated : item)),
      })),
  };
}
