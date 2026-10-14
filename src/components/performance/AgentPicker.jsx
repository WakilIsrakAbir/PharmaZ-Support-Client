"use client";

import { useRef, useState } from "react";
import { Check, ChevronDown, Search, UsersRound, X } from "lucide-react";
import { useDismiss } from "@/hooks/useDismiss";
import { describeRole } from "@/lib/performance";
import { cn } from "@/lib/utils";

const SEARCH_FROM = 8;

/**
 * Picks whose performance to review. `selected` is a list of ids, empty meaning everyone.
 * The picked people also show as chips underneath, each with a remove button.
 */
export default function AgentPicker({ people, selected, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  useDismiss(ref, () => setIsOpen(false), isOpen);

  const isEveryone = selected.length === 0;
  // Ids from an old link may belong to people no longer listed; those are left out
  const picked = isEveryone
    ? people.map((person) => person.id)
    : selected.filter((id) => people.length === 0 || people.some((person) => person.id === id));
  const pickedPeople = people.filter((person) => picked.includes(person.id));
  const shown = people.filter((person) => person.name.toLowerCase().includes(search.trim().toLowerCase()));

  // Picking everyone one by one is the same as "Everyone"; the last person can't be removed
  function toggle(id) {
    const next = picked.includes(id) ? picked.filter((item) => item !== id) : [...picked, id];
    if (next.length === 0) return;
    onChange(next.length === people.length ? [] : next);
  }

  return (
    <div className="min-w-0 flex-1">
      <div ref={ref} className="relative">
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-accent/40 bg-accent/10 px-3 py-2.5 text-sm font-semibold text-accent-text transition-colors hover:bg-accent/15 sm:w-64"
        >
          <UsersRound className="size-4 shrink-0" />
          <span className="flex-1 text-left">
            {isEveryone ? "Everyone" : `${picked.length} ${picked.length === 1 ? "person" : "people"}`}
          </span>
          <ChevronDown className={cn("size-4 shrink-0 transition-transform", isOpen && "rotate-180")} />
        </button>

        {isOpen && (
          <div className="absolute left-0 top-full z-20 mt-2 w-full min-w-72 overflow-hidden rounded-2xl border border-border bg-surface shadow-xl sm:w-80">
            {people.length >= SEARCH_FROM && (
              <label className="relative block border-b border-border">
                <span className="sr-only">Search people</span>
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search people"
                  className="w-full bg-transparent py-3 pl-10 pr-3 text-sm outline-none placeholder:text-muted"
                />
              </label>
            )}

            <button
              type="button"
              onClick={() => onChange([])}
              className="flex w-full cursor-pointer items-center justify-between border-b border-border px-4 py-2.5 text-sm font-semibold hover:bg-elevated"
            >
              Everyone
              {isEveryone && <Check className="size-4 text-accent-text" />}
            </button>

            <ul className="max-h-72 overflow-y-auto py-1" aria-label="People">
              {shown.map((person) => {
                const isPicked = picked.includes(person.id);
                return (
                  <li key={person.id}>
                    <label className="flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-elevated">
                      <input
                        type="checkbox"
                        checked={isPicked}
                        disabled={isPicked && picked.length === 1}
                        onChange={() => toggle(person.id)}
                        className="size-4 accent-accent"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{person.name}</span>
                        <span className="block truncate text-xs text-muted">{describeRole(person)}</span>
                      </span>
                    </label>
                  </li>
                );
              })}
              {shown.length === 0 && <li className="px-4 py-6 text-center text-sm text-muted">Nobody matches.</li>}
            </ul>
          </div>
        )}
      </div>

      {!isEveryone && (
        <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Picked people">
          {pickedPeople.map((person) => (
            <li
              key={person.id}
              className="flex items-center gap-1 rounded-full border border-border bg-surface py-1 pl-3 pr-1 text-xs font-semibold"
            >
              {person.name}
              <button
                type="button"
                aria-label={`Remove ${person.name}`}
                disabled={picked.length === 1}
                onClick={() => toggle(person.id)}
                className="grid size-5 cursor-pointer place-items-center rounded-full text-muted hover:bg-elevated hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
              >
                <X className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
