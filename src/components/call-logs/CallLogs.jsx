"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, PhoneOff, RotateCw, SearchX } from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Pagination from "@/components/ui/Pagination";
import { canManageProduct } from "@/config/roles";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePagedList } from "@/hooks/usePagedList";
import { api } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { EMPTY_FILTERS, hasActiveFilters, toCallsQuery } from "@/lib/call-filters";
import CallDetailsDialog from "./CallDetailsDialog";
import CallFilters from "./CallFilters";
import CallsTable from "./CallsTable";

const PAGE_SIZES = [10, 20, 50];
const numberFormat = new Intl.NumberFormat("en-US");
const NOT_DELETING = { call: null, isWorking: false, error: "" };

export default function CallLogs() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [openCall, setOpenCall] = useState(null);
  const [deleting, setDeleting] = useState(NOT_DELETING);
  // Only admins may delete calls; the API checks this too
  const canDelete = canManageProduct(useCurrentUser());

  // Wait until the agent stops typing before searching
  const search = useDebouncedValue(filters.search);
  const {
    items: calls,
    meta,
    error,
    isLoading,
    reload,
    replaceItem: replaceCall,
  } = usePagedList("/calls", toCallsQuery({ ...filters, search }, page, pageSize));

  const hasFilters = hasActiveFilters(filters);

  function changeFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
    setPage(1); // a different set of calls starts again from the first page
  }

  function changePageSize(size) {
    setPageSize(size);
    setPage(1);
  }

  function clearFilters() {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  }

  function handleUpdated(call) {
    replaceCall(call);
    setOpenCall(call);
  }

  async function deleteCall() {
    setDeleting((current) => ({ ...current, isWorking: true, error: "" }));
    try {
      await api(`/calls/${deleting.call.id}`, { method: "DELETE" });
      setDeleting(NOT_DELETING);
      // Deleted the only call on a later page: step back instead of showing an empty page
      if (calls.length === 1 && page > 1) setPage(page - 1);
      else reload();
    } catch (error) {
      setDeleting((current) => ({ ...current, isWorking: false, error: error.message }));
    }
  }

  let content;
  if (error && !isLoading) {
    content = (
      <EmptyState icon={PhoneOff} title="Couldn't load the calls" text={error}>
        <button type="button" onClick={reload} className={emptyActionClass}>
          <RotateCw className="size-4" />
          Try again
        </button>
      </EmptyState>
    );
  } else if (meta?.total === 0 && !isLoading && hasFilters) {
    content = (
      <EmptyState icon={SearchX} title="No calls match these filters" text="Try a different search or date.">
        <button type="button" onClick={clearFilters} className={emptyActionClass}>
          Clear filters
        </button>
      </EmptyState>
    );
  } else if (meta?.total === 0 && !isLoading) {
    content = (
      <EmptyState icon={PhoneOff} title="No calls logged yet" text="Calls you log will show up here.">
        <Link href="/calls/log-call" className={emptyActionClass}>
          Log a call
        </Link>
      </EmptyState>
    );
  } else {
    content = (
      <CallsTable
        calls={calls}
        isLoading={isLoading && calls.length === 0}
        isRefreshing={isLoading && calls.length > 0}
        skeletonRows={pageSize}
        onOpen={setOpenCall}
        onDelete={canDelete ? (call) => setDeleting({ ...NOT_DELETING, call }) : undefined}
      />
    );
  }

  return (
    <div className="space-y-4">
      <CallFilters filters={filters} onChange={changeFilter} />

      <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        {content}

        {meta?.total > 0 && (
          <footer className="flex flex-col items-center justify-between gap-3 border-t border-border px-5 py-3.5 sm:flex-row">
            <div className="flex items-center gap-4 text-sm text-muted">
              <p>
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {(meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)}
                </span>{" "}
                of <span className="font-semibold text-foreground">{numberFormat.format(meta.total)}</span>
              </p>
              <PageSizeSelect value={pageSize} onChange={changePageSize} />
            </div>

            <Pagination page={meta.page} totalPages={meta.totalPages} onChange={setPage} />
          </footer>
        )}
      </section>

      <CallDetailsDialog call={openCall} onClose={() => setOpenCall(null)} onUpdated={handleUpdated} />

      <ConfirmDialog
        isOpen={Boolean(deleting.call)}
        title="Delete this call?"
        confirmText="Delete call"
        isWorking={deleting.isWorking}
        error={deleting.error}
        onConfirm={deleteCall}
        onCancel={() => setDeleting(NOT_DELETING)}
      >
        {deleting.call && (
          <>
            The call with <span className="font-semibold text-foreground">{deleting.call.mobile}</span> on{" "}
            {formatDateTime(deleting.call.calledAt)} is removed for good, from the logs, the dashboard and
            performance. This can&apos;t be undone.
          </>
        )}
      </ConfirmDialog>
    </div>
  );
}

function PageSizeSelect({ value, onChange }) {
  return (
    <label className="relative flex items-center gap-2">
      <span className="hidden sm:inline">Rows</span>
      <select
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label="Rows per page"
        className="cursor-pointer appearance-none rounded-lg border border-border bg-surface py-1 pl-2.5 pr-7 text-sm font-semibold text-foreground outline-none hover:bg-elevated focus:border-accent [&>option]:bg-surface [&>option]:text-foreground"
      >
        {PAGE_SIZES.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 size-3.5" />
    </label>
  );
}

const emptyActionClass =
  "mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-elevated";

function EmptyState({ icon: Icon, title, text, children }) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-accent/10 text-accent-text">
        <Icon className="size-6" />
      </span>
      <h2 className="mt-4 font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted">{text}</p>
      {children}
    </div>
  );
}
