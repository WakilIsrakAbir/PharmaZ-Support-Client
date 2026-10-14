"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CloudOff, UsersRound } from "lucide-react";
import FormAlert from "@/components/auth/FormAlert";
import Notice from "@/components/ui/Notice";
import { usePagedList } from "@/hooks/usePagedList";
import { readFilters, toPerformanceQuery, toSearch } from "@/lib/performance";
import { cn } from "@/lib/utils";
import AgentCard from "./AgentCard";
import CompareCards from "./CompareCards";
import PerformanceFilters from "./PerformanceFilters";
import TeamSummary from "./TeamSummary";

/** Reviews how each picked person handled calls over the chosen days. */
export default function PerformanceView() {
  const router = useRouter();
  const pathname = usePathname();
  const filters = readFilters(useSearchParams());
  const { items, extra, error, isLoading, reload } = usePagedList("/performance", toPerformanceQuery(filters));
  // `items` is the report once loaded (the hook starts with an empty list)
  const report = items?.team ? items : null;

  function changeFilters(changes) {
    router.replace(`${pathname}?${toSearch({ ...filters, ...changes })}`, { scroll: false });
  }

  if (error && !report) {
    return (
      <Notice icon={CloudOff} title="Couldn't load performance" text={error}>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={reload}
            className="cursor-pointer rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-elevated"
          >
            Try again
          </button>
          <button
            type="button"
            onClick={() => router.replace(pathname)}
            className="cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold text-muted hover:bg-elevated hover:text-foreground"
          >
            Reset filters
          </button>
        </div>
      </Notice>
    );
  }

  return (
    <div className="space-y-6">
      <PerformanceFilters
        filters={filters}
        people={extra.people ?? []}
        isLoading={isLoading}
        onChange={changeFilters}
        onRefresh={reload}
      />
      <FormAlert message={error} />

      {report?.agents.length === 0 ? (
        <Notice icon={UsersRound} title="Nobody to review" text="Add agents to the product and their calls show up here." />
      ) : (
        <div className={cn("space-y-6 transition-opacity", isLoading && report && "opacity-60")}>
          <TeamSummary report={report} />
          <CompareCards agents={report?.agents} />
          {report && (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {report.agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
