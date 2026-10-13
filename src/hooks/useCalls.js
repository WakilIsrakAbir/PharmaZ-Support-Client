import { useEffect, useState } from "react";
import { api } from "@/lib/api";

/**
 * One page of calls from GET /api/calls, for a query like "?page=1&limit=10".
 * The previous page stays on screen while the next one loads.
 */
export function useCalls(query) {
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState({ requestKey: null, calls: [], meta: null, error: "" });
  const requestKey = `${query}#${version}`;

  useEffect(() => {
    let isCancelled = false;

    api(`/calls${query}`)
      .then(({ data, meta }) => {
        if (!isCancelled) setResult({ requestKey, calls: data, meta, error: "" });
      })
      .catch((error) => {
        if (!isCancelled) setResult((current) => ({ ...current, requestKey, error: error.message }));
      });

    return () => {
      isCancelled = true;
    };
  }, [query, requestKey]);

  return {
    calls: result.calls,
    meta: result.meta,
    error: result.error,
    isLoading: result.requestKey !== requestKey,
    reload: () => setVersion((current) => current + 1),
    // Swaps in an edited call without reloading the page
    replaceCall: (updated) =>
      setResult((current) => ({
        ...current,
        calls: current.calls.map((call) => (call.id === updated.id ? updated : call)),
      })),
  };
}
