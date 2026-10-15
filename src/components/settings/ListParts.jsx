import { ArrowDown, ArrowUp, Check, RotateCcw, Undo2 } from "lucide-react";
import SubmitButton from "@/components/auth/SubmitButton";
import { cn } from "@/lib/utils";

export function IconButton({ label, onClick, disabled, tone = "default", children }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg text-muted transition-colors disabled:cursor-not-allowed disabled:opacity-30",
        tone === "danger" ? "hover:bg-rose-500/10 hover:text-rose-500" : "hover:bg-elevated hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

/** Up and down arrows for reordering. `index` and `count` disable the ends. */
export function MoveButtons({ name, index, count, onMove, disabled }) {
  return (
    <div className="flex shrink-0 flex-col">
      <button
        type="button"
        aria-label={`Move ${name} up`}
        disabled={disabled || index === 0}
        onClick={() => onMove(-1)}
        className="grid h-5 w-7 cursor-pointer place-items-center rounded text-muted transition-colors hover:bg-elevated hover:text-foreground disabled:cursor-not-allowed disabled:opacity-25"
      >
        <ArrowUp className="size-3.5" />
      </button>
      <button
        type="button"
        aria-label={`Move ${name} down`}
        disabled={disabled || index === count - 1}
        onClick={() => onMove(1)}
        className="grid h-5 w-7 cursor-pointer place-items-center rounded text-muted transition-colors hover:bg-elevated hover:text-foreground disabled:cursor-not-allowed disabled:opacity-25"
      >
        <ArrowDown className="size-3.5" />
      </button>
    </div>
  );
}

/**
 * Items that were switched off. They stay on older calls; "Switch on" brings one back.
 * `children(item)` draws each one.
 */
export function SwitchedOffList({ items, title = "Switched off", onRestore, children }) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-xl border border-dashed border-border p-3">
      <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted">
        {title} <span className="font-normal normal-case tracking-normal">· older calls keep these</span>
      </p>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.uid ?? item.id} className="flex items-center gap-3 rounded-lg px-1 py-1 text-sm">
            <span className="min-w-0 flex-1 truncate text-muted">{children(item)}</span>
            <button
              type="button"
              onClick={() => onRestore(item)}
              className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-accent-text transition-colors hover:bg-accent/10"
            >
              <Undo2 className="size-3.5" />
              Switch on
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The footer of an editor: what saving does, and Discard / Save. */
export function SaveBar({ isDirty, isSaving, onDiscard, note }) {
  return (
    <>
      <p className={cn("text-xs", isDirty ? "font-semibold text-amber-500" : "text-muted")}>
        {isDirty ? "You have unsaved changes." : note}
      </p>
      <div className="flex gap-2">
        {isDirty && (
          <button
            type="button"
            onClick={onDiscard}
            disabled={isSaving}
            className="flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-muted transition-colors hover:bg-elevated hover:text-foreground"
          >
            <RotateCcw className="size-4" />
            Discard
          </button>
        )}
        <SubmitButton
          isSubmitting={isSaving}
          disabled={!isDirty}
          submittingText="Saving..."
          icon={Check}
          fullWidth={false}
        >
          Save changes
        </SubmitButton>
      </div>
    </>
  );
}

/** The server names rows like "statuses.2.label"; this picks out row 2's message. */
export function rowError(fields, listName, index) {
  return Object.entries(fields ?? {}).find(([name]) => name.startsWith(`${listName}.${index}.`))?.[1];
}

/** The first message about the list as a whole, or one we can't place on a row. */
export function listError(fields, listName, rowCount) {
  return Object.entries(fields ?? {}).find(([name]) => {
    const [, index] = name.split(".");
    return name.startsWith(listName) && (index === undefined || Number(index) >= rowCount);
  })?.[1];
}
