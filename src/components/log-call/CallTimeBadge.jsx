"use client";

import { useRef } from "react";
import { CalendarDays, Clock } from "lucide-react";
import { useCurrentMinute } from "@/hooks/useCurrentMinute";
import { formatDate, formatTime } from "@/lib/format";

/**
 * Shows when the call happened. Until the agent picks a time it follows the
 * clock, so a call logged right after hanging up needs no extra step.
 */
export default function CallTimeBadge({ value, onChange }) {
  const inputRef = useRef(null);
  const now = useCurrentMinute();
  const time = value ? new Date(value).getTime() : now;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => inputRef.current?.showPicker()}
        aria-label="Change call date and time"
        className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface px-3 py-1.5 transition-colors hover:border-accent/40"
      >
        <span className="text-right leading-tight">
          <span className="block text-xs font-bold">{time ? formatDate(time) : "—"}</span>
          <span className="flex items-center justify-end gap-1 text-[11px] text-muted">
            <Clock className="size-3" />
            {time ? formatTime(time) : "--:--"}
            {!value && <span className="font-semibold text-accent-text">· now</span>}
          </span>
        </span>
        <CalendarDays className="size-5 text-accent-text" />
      </button>

      <input
        ref={inputRef}
        type="datetime-local"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        tabIndex={-1}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0"
      />
    </div>
  );
}
