import { Archive, ArchiveRestore, ArrowRight, LoaderCircle, Pencil, ShieldAlert, ShieldCheck } from "lucide-react";
import ActionMenu from "@/components/ui/ActionMenu";
import { formatRelative, getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * One product on the super admin's home: who runs it, how big its team is and how busy
 * it is. Everything inside uses the product's own colour (data-accent).
 */
export default function ProductCard({ product, isOpening, onOpen, onEdit, onAdmins, onArchive }) {
  const { isArchived } = product;

  return (
    <article
      data-accent={product.accentColor}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all duration-200",
        isArchived ? "opacity-75" : "hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10",
      )}
    >
      <div className={cn("relative h-20 bg-linear-to-br from-accent-strong to-accent", isArchived && "grayscale")}>
        <div aria-hidden className="bg-crosshatch absolute inset-0 opacity-10" />
        <div className="absolute right-3 top-3">
          <ActionMenu
            label={`Actions for ${product.name}`}
            buttonClassName="text-white/90 hover:bg-white/20 hover:text-white"
            items={[
              { label: "Edit details", icon: Pencil, onClick: onEdit },
              { label: "Manage admins", icon: ShieldCheck, onClick: onAdmins },
              isArchived
                ? { label: "Restore", icon: ArchiveRestore, onClick: onArchive }
                : { label: "Archive", icon: Archive, onClick: onArchive, tone: "danger" },
            ]}
          />
        </div>
      </div>

      <div className="-mt-8 flex flex-1 flex-col px-5 pb-5">
        <span
          className={cn(
            "relative grid size-14 place-items-center rounded-2xl bg-surface text-lg font-extrabold text-accent-text shadow-md ring-4 ring-surface",
            isArchived && "grayscale",
          )}
        >
          {productInitials(product.name)}
        </span>

        <div className="mt-3 min-w-0">
          <h3 className="flex items-center gap-2">
            <span className="truncate text-lg font-bold tracking-tight">{product.name}</span>
            {isArchived && (
              <span className="shrink-0 rounded-md bg-elevated px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted">
                Archived
              </span>
            )}
          </h3>
          <p className="truncate font-mono text-xs text-muted">{product.slug}</p>
          <p className="mt-2 line-clamp-2 min-h-10 text-sm text-muted">{product.description || "No description yet."}</p>
        </div>

        <dl className="mt-4 grid grid-cols-3 divide-x divide-border rounded-xl border border-border bg-background/40 text-center">
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
              className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-semibold transition-colors hover:bg-elevated"
            >
              <ArchiveRestore className="size-4" />
              Restore
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpen}
              disabled={isOpening}
              className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl bg-accent-strong px-3.5 py-2 text-sm font-semibold text-accent-foreground shadow-md shadow-accent/30 transition-all hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-80"
            >
              Open dashboard
              {isOpening ? <LoaderCircle className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
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
