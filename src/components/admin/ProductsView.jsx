"use client";

import { useState } from "react";
import { Boxes, ChevronDown, CloudOff, PackagePlus, PhoneCall, Search, SearchX, UsersRound } from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Notice from "@/components/ui/Notice";
import { usePagedList } from "@/hooks/usePagedList";
import { HOME_PATH } from "@/config/routes";
import { api } from "@/lib/api";
import { goTo } from "@/lib/auth";
import { timezoneQuery } from "@/lib/format";
import { cn } from "@/lib/utils";
import AdminsDialog from "./AdminsDialog";
import ProductCard from "./ProductCard";
import ProductFormDialog from "./ProductFormDialog";

/** The super admin's home: every product, and the way into each one. */
export default function ProductsView() {
  const { items: products, extra, error, isLoading, reload, replaceItem } = usePagedList("/admin/products", timezoneQuery());
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  // { type: "create" | "edit" | "admins" | "archive", product }
  const [dialog, setDialog] = useState(null);
  const [openingId, setOpeningId] = useState(null);
  const [archiveError, setArchiveError] = useState("");
  const [isArchiving, setIsArchiving] = useState(false);

  const close = () => setDialog(null);
  // Plain values, read once: the React Compiler mishandles `dialog?.x` inside callbacks
  const dialogType = dialog ? dialog.type : null;
  const dialogProduct = dialog?.product ?? null;
  // The admins dialog follows the list, so it shows changes as they're saved
  const adminsProduct =
    dialogType === "admins" ? (products.find((item) => item.id === dialogProduct.id) ?? dialogProduct) : null;
  const matches = (product) =>
    `${product.name} ${product.slug} ${product.description}`.toLowerCase().includes(search.trim().toLowerCase());
  const active = products.filter((product) => !product.isArchived && matches(product));
  const archived = products.filter((product) => product.isArchived && matches(product));

  async function openProduct(product) {
    setOpeningId(product.id);
    try {
      await api("/admin/open-product", { method: "POST", body: { productId: product.id } });
      // A full load: the sidebar, setup and pages all switch to the opened product
      await goTo(HOME_PATH);
    } catch (requestError) {
      setArchiveError(requestError.message);
      setOpeningId(null);
    }
  }

  async function toggleArchive() {
    const product = dialogProduct;
    setIsArchiving(true);
    try {
      const { data } = await api(`/admin/products/${product.id}${timezoneQuery()}`, {
        method: "PATCH",
        body: { isArchived: !product.isArchived },
      });
      replaceItem(data);
      close();
    } catch (requestError) {
      setArchiveError(requestError.message);
    }
    setIsArchiving(false);
  }

  const cards = (list) => (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {list.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isOpening={openingId === product.id}
          onOpen={() => openProduct(product)}
          onEdit={() => setDialog({ type: "edit", product })}
          onAdmins={() => setDialog({ type: "admins", product })}
          onArchive={() => {
            setArchiveError("");
            setDialog({ type: "archive", product });
          }}
        />
      ))}
    </div>
  );

  let content;
  if (error && products.length === 0) {
    content = (
      <Notice icon={CloudOff} title="Couldn't load the products" text={error}>
        <OutlineButton onClick={reload}>Try again</OutlineButton>
      </Notice>
    );
  } else if (isLoading && products.length === 0) {
    content = (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <div key={index} className="h-80 animate-pulse rounded-2xl bg-elevated" />
        ))}
      </div>
    );
  } else if (products.length === 0) {
    content = (
      <Notice icon={Boxes} title="No products yet" text="Create the first one and choose who runs it.">
        <CreateButton onClick={() => setDialog({ type: "create" })} className="mt-5" />
      </Notice>
    );
  } else if (active.length === 0 && archived.length === 0) {
    content = (
      <Notice icon={SearchX} title="No product matches" text="Try another name.">
        <OutlineButton onClick={() => setSearch("")}>Clear search</OutlineButton>
      </Notice>
    );
  } else {
    content = (
      <div className="space-y-8">
        {active.length > 0 ? cards(active) : <p className="text-sm text-muted">No active product matches.</p>}

        {archived.length > 0 && (
          <section>
            <button
              type="button"
              onClick={() => setShowArchived(!showArchived)}
              aria-expanded={showArchived}
              className="mb-4 flex cursor-pointer items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-foreground"
            >
              <ChevronDown className={cn("size-4 transition-transform", !showArchived && "-rotate-90")} />
              Archived ({archived.length})
            </button>
            {showArchived && cards(archived)}
          </section>
        )}
      </div>
    );
  }

  const summary = extra.summary;

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryTile icon={Boxes} label="Active products" value={summary?.products} note={summary?.archived ? `${summary.archived} archived` : null} />
        <SummaryTile icon={UsersRound} label="People in products" value={summary?.people} />
        <SummaryTile icon={PhoneCall} label="Calls today" value={summary?.callsToday} />
        <SummaryTile icon={PhoneCall} label="Calls, all time" value={summary?.callsTotal} />
      </section>

      <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-2 shadow-sm sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search products</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products"
            className="w-full rounded-xl bg-transparent py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted hover:bg-elevated/60 focus:bg-elevated/60"
          />
        </label>
        <CreateButton onClick={() => setDialog({ type: "create" })} />
      </div>

      {archiveError && !dialog && <p className="text-sm font-medium text-rose-500">{archiveError}</p>}

      {content}

      <ProductFormDialog
        isOpen={dialogType === "create" || dialogType === "edit"}
        product={dialogType === "edit" ? dialogProduct : null}
        onClose={close}
        onSaved={dialogType === "edit" ? replaceItem : reload}
        onOpenProduct={openProduct}
      />

      <AdminsDialog
        isOpen={dialogType === "admins"}
        product={adminsProduct}
        onClose={close}
        onUpdated={replaceItem}
      />

      <ConfirmDialog
        isOpen={dialogType === "archive"}
        title={dialogProduct?.isArchived ? `Restore ${dialogProduct.name}?` : `Archive ${dialogProduct?.name}?`}
        confirmText={dialogProduct?.isArchived ? "Restore" : "Archive"}
        isWorking={isArchiving}
        error={archiveError}
        onConfirm={toggleArchive}
        onCancel={() => !isArchiving && close()}
      >
        {dialogProduct?.isArchived
          ? "Its admin and agents can sign in and work in it again."
          : "Its admin and agents lose access straight away. Nothing is deleted: calls, setup and people stay, and you can restore it any time."}
      </ConfirmDialog>
    </div>
  );
}

function SummaryTile({ icon: Icon, label, value, note }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <div className="flex items-center gap-2 text-muted">
        <Icon className="size-4 text-accent-text" />
        <p className="truncate text-xs font-semibold">{label}</p>
      </div>
      {value === undefined ? (
        <span className="mt-2 block h-8 w-16 animate-pulse rounded bg-elevated" />
      ) : (
        <p className="mt-1.5 text-3xl font-bold tabular-nums">{value.toLocaleString()}</p>
      )}
      {note && <p className="mt-0.5 text-xs text-muted">{note}</p>}
    </div>
  );
}

function CreateButton({ onClick, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent-strong px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-md shadow-accent/30 transition-all hover:-translate-y-0.5",
        className,
      )}
    >
      <PackagePlus className="size-4" />
      Create product
    </button>
  );
}

function OutlineButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-5 cursor-pointer rounded-xl border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-elevated"
    >
      {children}
    </button>
  );
}
