"use client";

import { useState } from "react";
import { ArrowRight, CalendarDays, ChevronDown, RefreshCw } from "lucide-react";
import { toInputDate } from "@/lib/call-filters";
import { DATE_PRESETS, MAX_DAYS, addDays, matchingPreset, presetRange } from "@/lib/performance";
import { cn } from "@/lib/utils";
import AgentPicker from "./AgentPicker";

/** Who and which days to review, plus Refresh. `onChange` takes the filters that changed. */
export default function PerformanceFilters({ filters, people, isLoading, onChange, onRefresh }) {
  const [isCustom, setIsCustom] = useState(() => matchingPreset(filters) === "custom");
  const preset = isCustom ? "custom" : matchingPreset(filters);

  function pickPreset(value) {
    setIsCustom(value === "custom");
    if (value !== "custom") onChange(presetRange(value));
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-2 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <AgentPicker people={people} selected={filters.agents} onChange={(agents) => onChange({ agents })} />

        <div className="relative">
          <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-accent-text" />
          <select
            aria-label="Period"
            value={preset}
            onChange={(event) => pickPreset(event.target.value)}
            className="w-full cursor-pointer appearance-none rounded-xl border border-border bg-transparent py-2.5 pl-9 pr-9 text-sm font-semibold outline-none transition-colors hover:bg-elevated/60 focus:border-accent sm:w-48 [&>option]:bg-surface [&>option]:text-foreground"
          >
            {DATE_PRESETS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
            <option value="custom">Custom range</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-elevated disabled:cursor-wait"
        >
          <RefreshCw className={cn("size-4", isLoading && "animate-spin")} />
          Refresh
        </button>
      </div>

      {isCustom && <CustomRange from={filters.from} to={filters.to} onChange={onChange} />}
    </div>
  );
}

/** Two date pickers, kept in order and at most MAX_DAYS apart. */
function CustomRange({ from, to, onChange }) {
  const today = toInputDate(new Date());
  const latestTo = addDays(from, MAX_DAYS - 1) < today ? addDays(from, MAX_DAYS - 1) : today;

  return (
    <div className="mt-2 flex flex-col gap-3 border-t border-border px-2 pb-1 pt-3 sm:flex-row sm:items-center">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <DateInput label="From" value={from} min={addDays(to, -(MAX_DAYS - 1))} max={to} onChange={(value) => onChange({ from: value })} />
        <ArrowRight className="hidden size-4 text-muted sm:block" />
        <DateInput label="To" value={to} min={from} max={latestTo} onChange={(value) => onChange({ to: value })} />
      </div>
      <p className="text-xs text-muted">Both days are included, up to {MAX_DAYS} days.</p>
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
        min={min}
        max={max}
        required
        // Typed dates can land outside min/max, so only valid ones are passed on
        onChange={(event) => {
          const next = event.target.value;
          if (next && next >= min && next <= max) onChange(next);
        }}
        className="cursor-pointer bg-transparent font-semibold outline-none"
      />
    </label>
  );
}
