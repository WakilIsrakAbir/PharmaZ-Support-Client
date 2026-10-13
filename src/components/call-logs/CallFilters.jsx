import { ArrowRight, CalendarDays, ChevronDown, Search, X } from "lucide-react";
import { CALL_DIRECTIONS } from "@/config/call-log";
import { useProductSetup } from "@/hooks/useProductSetup";
import { DATE_RANGES, toInputDate } from "@/lib/call-filters";
import { cn } from "@/lib/utils";

const withAll = (label, options) => [{ value: "", label }, ...options];

const DIRECTION_OPTIONS = withAll("All directions", CALL_DIRECTIONS);

// Switched-off areas and statuses stay in the filters: older calls still use them
const offLabel = (label, isActive) => (isActive ? label : `${label} (off)`);

export default function CallFilters({ filters, onChange }) {
  const { setup } = useProductSetup();
  const typeOptions = withAll(
    "All types",
    (setup?.areas ?? []).map((area) => ({ value: area.id, label: offLabel(area.name, area.isActive) })),
  );
  const statusOptions = withAll(
    "All statuses",
    (setup?.statuses ?? []).map((status) => ({ value: status.key, label: offLabel(status.label, status.isActive) })),
  );

  return (
    <div className="rounded-2xl border border-border bg-surface p-2 shadow-sm">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search mobile or transaction no.</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={filters.search}
            onChange={(event) => onChange("search", event.target.value)}
            placeholder="Search mobile or transaction no."
            className="w-full rounded-xl bg-transparent py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted hover:bg-elevated/60 focus:bg-elevated/60"
          />
        </label>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex lg:items-center lg:border-l lg:border-border lg:pl-2">
          <FilterSelect
            label="Direction"
            value={filters.direction}
            options={DIRECTION_OPTIONS}
            onChange={(value) => onChange("direction", value)}
          />
          <FilterSelect
            label="Type"
            value={filters.area}
            options={typeOptions}
            onChange={(value) => onChange("area", value)}
          />
          <FilterSelect
            label="Status"
            value={filters.status}
            options={statusOptions}
            onChange={(value) => onChange("status", value)}
          />
          <FilterSelect
            label="Date"
            icon={CalendarDays}
            value={filters.dateRange}
            options={DATE_RANGES}
            onChange={(value) => onChange("dateRange", value)}
          />
        </div>
      </div>

      {filters.dateRange === "custom" && (
        <CustomDateRange fromDate={filters.fromDate} toDate={filters.toDate} onChange={onChange} />
      )}
    </div>
  );
}

/** "From [date] → To [date]", shown under the filters when "Custom range" is picked. */
function CustomDateRange({ fromDate, toDate, onChange }) {
  // Calls can't be logged in the future, so the pickers stop at today
  const today = toInputDate(new Date());

  return (
    <div className="mt-2 flex flex-col gap-3 border-t border-border px-2 pb-1 pt-3 sm:flex-row sm:items-center">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">Custom range</p>

      <div className="flex flex-1 flex-wrap items-center gap-2">
        <DateInput
          label="From"
          value={fromDate}
          max={toDate || today}
          onChange={(value) => onChange("fromDate", value)}
        />
        <ArrowRight className="hidden size-4 text-muted sm:block" />
        <DateInput
          label="To"
          value={toDate}
          min={fromDate}
          max={today}
          onChange={(value) => onChange("toDate", value)}
        />

        {(fromDate || toDate) && (
          <button
            type="button"
            onClick={() => {
              onChange("fromDate", "");
              onChange("toDate", "");
            }}
            className="flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-2 text-xs font-semibold text-muted transition-colors hover:bg-elevated hover:text-foreground"
          >
            <X className="size-3.5" />
            Clear dates
          </button>
        )}
      </div>

      <p className="text-xs text-muted">Both days are included. Leave one empty for an open range.</p>
    </div>
  );
}

function DateInput({ label, value, min, max, onChange }) {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-border bg-background/40 py-1.5 pl-3 pr-2 text-sm transition-colors focus-within:border-accent hover:border-accent/40">
      <span className="text-xs font-semibold text-muted">{label}</span>
      <input
        type="date"
        value={value}
        min={min || undefined}
        max={max || undefined}
        onChange={(event) => onChange(event.target.value)}
        className="cursor-pointer bg-transparent font-semibold outline-none"
      />
    </label>
  );
}

function FilterSelect({ label, icon: Icon, value, options, onChange }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-accent-text" />
      )}
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "w-full cursor-pointer appearance-none rounded-xl border bg-transparent py-2.5 pl-3 pr-9 text-sm font-semibold outline-none transition-colors hover:bg-elevated/60 focus:border-accent",
          Icon && "pl-9",
          // A filter that's switched on is highlighted, so it's clear why rows are missing
          value ? "border-accent/50 bg-accent/10 text-accent-text" : "border-transparent",
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
    </div>
  );
}
