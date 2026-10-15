import { Archive, ArchiveRestore, ArrowRight, LoaderCircle, Pencil, ShieldAlert, ShieldCheck, Trash2 } from "lucide-react";
import ActionMenu from "@/components/ui/ActionMenu";
import { formatRelative, getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * One product on the super admin's home: who runs it, how big its team is and how busy
 * it is. The card follows the app's colour, so every card matches whatever theme is
 * picked; the product's own colour is the small dot by its name.
 */
export default function ProductCard({ product, isOpening, onOpen, onEdit, onAdmins, onArchive, onDelete }) {
  const { isArchived } = product;

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all duration-200",
        isArchived ? "opacity-75" : "hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md",
      )}
    >
      {/* Clean, minimalist header without loud gradients or crosshatch patterns */}
      <header className="border-b border-border/60 p-5">
        <div className="flex items-center gap-3.5">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-border bg-elevated text-base font-bold text-foreground">
            {productInitials(product.name)}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="flex items-center gap-2">
              <span className="truncate text-base font-semibold text-foreground">{product.name}</span>
              {isArchived && (
                <span className="shrink-0 rounded-md bg-elevated px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted">
                  Archived
                </span>
              )}
            </h3>
            <p className="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-muted">
              {/* data-accent gives the dot the product's own colour */}
              <span
                data-accent={product.accentColor}
                title="The product's colour"
                className="size-2 shrink-0 rounded-full bg-accent ring-1 ring-border"
              />
              <span className="truncate font-mono">{product.slug}</span>
            </p>
          </div>
          <ActionMenu
            label={`Actions for ${product.name}`}
            buttonClassName="text-muted hover:bg-elevated hover:text-foreground"
            items={[
              { label: "Edit details", icon: Pencil, onClick: onEdit },
              { label: "Manage admins", icon: ShieldCheck, onClick: onAdmins },
              // Deleting is offered only once a product is archived, so a live one can't be wiped by mistake
              ...(isArchived
                ? [
                    { label: "Restore", icon: ArchiveRestore, onClick: onArchive },
                    { label: "Delete for good", icon: Trash2, onClick: onDelete, tone: "danger" },
                  ]
                : [{ label: "Archive", icon: Archive, onClick: onArchive, tone: "danger" }]),
            ]}
          />
        </div>
      </header>

      <div className="flex flex-1 flex-col p-5 pt-4">
        <p className="line-clamp-2 min-h-10 text-sm text-muted">{product.description || "No description yet."}</p>

        <dl className="mt-4 grid grid-cols-3 divide-x divide-border rounded-xl border border-border bg-elevated/40 text-center">
          <Stat label="Agents" value={product.agentCount} />
          <Stat label="Today" value={product.callsToday} />
          <Stat label="All calls" value={product.callsTotal} />
        </dl>

        <AdminLine product={product} onAdmins={onAdmins} />

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
          <p className="min-w-0 truncate text-xs text-muted">
            {product.lastCallAt ? `Last call ${formatRelative(product.lastCallAt)}` : "No calls yet"}
          </p>
          {isArchived ? (
            <button
              type="button"
              onClick={onArchive}
              className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-elevated"
            >
              <ArchiveRestore className="size-4" />
              Restore
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpen}
              disabled={isOpening}
              className="group/btn flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-border bg-elevated px-3.5 py-2 text-sm font-medium text-foreground transition-all hover:bg-elevated/80 active:scale-[0.98] disabled:cursor-wait disabled:opacity-80"
            >
              Open dashboard
              {isOpening ? (
                <LoaderCircle className="size-4 animate-spin text-muted" />
              ) : (
                <ArrowRight className="size-4 text-muted transition-transform group-hover/btn:translate-x-0.5" />
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

/** "Pharmacy Plus" -> "PP", "PharmaZ247" -> "PH" */
export function productInitials(name) {
  return name.trim().includes(" ") ? getInitials(name) : name.slice(0, 2).toUpperCase();
}

function Stat({ label, value }) {
  return (
    <div className="px-2 py-2.5">
      <dd className="text-lg font-bold tabular-nums">{value.toLocaleString()}</dd>
      <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted">{label}</dt>
    </div>
  );
}

function AdminLine({ product, onAdmins }) {
  if (product.adminCount === 0) {
    return (
      <button
        type="button"
        onClick={onAdmins}
        className="my-4 flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-amber-500/50 bg-amber-500/5 px-3 py-2 text-left text-xs font-semibold text-amber-500 transition-colors hover:bg-amber-500/10"
      >
        <ShieldAlert className="size-4 shrink-0" />
        No admin yet: add one so it can be set up
      </button>
    );
  }

  const [first] = product.admins;
  const others = product.adminCount - 1;
  return (
    <button
      type="button"
      onClick={onAdmins}
      className="my-4 flex min-w-0 cursor-pointer items-center gap-2 rounded-xl px-1 py-1 text-left text-sm transition-colors hover:text-accent-text"
      title="Manage admins"
    >
      <ShieldCheck className="size-4 shrink-0 text-accent-text" />
      <span className="min-w-0 truncate">
        <span className="font-semibold">{first.name}</span>
        {others > 0 && <span className="text-muted"> and {others} more</span>}
        {first.mustChangePassword && others === 0 && <span className="text-amber-500"> · not signed in yet</span>}
      </span>
    </button>
  );
}
