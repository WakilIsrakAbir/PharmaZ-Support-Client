"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Check, ChevronsUpDown, LoaderCircle, Search } from "lucide-react";
import { isProductPath } from "@/config/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useDismiss } from "@/hooks/useDismiss";
import { api } from "@/lib/api";
import { goTo } from "@/lib/auth";
import { cn } from "@/lib/utils";

// With this many products or more, the list gets a search box
const SEARCH_FROM = 7;

/**
 * The super admin's product picker, beside the title of every page that works inside a
 * product (Dashboard, Logs, Settings...; see PageShell). Switching stays on the same page,
 * in the other product. Product admins and agents have one product, so they never see it.
 */
export default function ProductSwitcher() {
  const user = useCurrentUser();
  const pathname = usePathname();
  if (!user?.isSuperAdmin || !isProductPath(pathname)) return null;

  return <ProductPicker current={user.product} pathname={pathname} />;
}

function ProductPicker({ current, pathname }) {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [opening, setOpening] = useState(null);
  const ref = useRef(null);
  useDismiss(ref, () => setIsOpen(false), isOpen);

  const shown = products?.filter((product) => product.name.toLowerCase().includes(search.trim().toLowerCase()));

  function toggle() {
    setIsOpen(!isOpen);
    // Loaded the first time it opens, so pages cost nothing extra until it's used
    if (!products) {
      api("/admin/products/options")
        .then(({ data }) => setProducts(data))
        .catch((requestError) => setError(requestError.message));
    }
  }

  async function open(product) {
    if (product.id === current?.id) {
      setIsOpen(false);
      return;
    }

    setOpening(product);
    setError("");
    try {
      await api("/admin/open-product", { method: "POST", body: { productId: product.id } });
      // A full load of the same page, so every list, setting and colour starts fresh in
      // the new product. Filters are left behind: they belonged to the old one.
      goTo(pathname);
    } catch (requestError) {
      setError(requestError.message);
      setOpening(null);
    }
  }

  // Up and down arrows move between the products
  function moveFocus(event) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const options = [...ref.current.querySelectorAll("[data-product-option]")];
    const index = options.indexOf(document.activeElement);
    const next = event.key === "ArrowDown" ? index + 1 : index - 1;
    options[(next + options.length) % options.length]?.focus();
  }

  // A quiet context switcher: the page title leads, the product reads as where you are
  return (
    <div ref={ref} className="relative flex min-w-0 items-center gap-3">
      <span aria-hidden="true" className="h-5 w-px shrink-0 bg-border max-sm:hidden" />
      <button
        type="button"
        onClick={toggle}
        disabled={opening !== null}
        aria-expanded={isOpen}
        aria-label={`Viewing ${current?.name ?? "no product"}. Switch product`}
        className="-mx-2 flex h-8 min-w-0 cursor-pointer items-center gap-2 rounded-lg px-2 text-base font-semibold text-muted transition-colors hover:bg-elevated hover:text-foreground aria-expanded:bg-elevated aria-expanded:text-foreground disabled:cursor-wait"
      >
        {/* data-accent gives the dot the product's own colour */}
        <span data-accent={current?.accentColor} className="size-2 shrink-0 rounded-full bg-accent" />
        <span className="truncate">{opening ? `Opening ${opening.name}…` : (current?.name ?? "Choose a product")}</span>
        {opening ? (
          <LoaderCircle className="size-4 shrink-0 animate-spin" />
        ) : (
          <ChevronsUpDown className="size-4 shrink-0 opacity-60" />
        )}
      </button>

      {isOpen && (
        <div
          onKeyDown={moveFocus}
          className="absolute left-0 top-full z-50 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-surface p-1.5 shadow-2xl shadow-black/20"
        >
          <p className="px-3 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Switch product</p>

          {products && products.length >= SEARCH_FROM && (
            <label className="relative mb-1 block">
              <span className="sr-only">Search products</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products"
                autoFocus
                className="w-full rounded-xl bg-elevated/60 py-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted focus:bg-elevated"
              />
            </label>
          )}

          {error && <p className="px-3 py-2 text-xs font-medium text-rose-500">{error}</p>}
          {!products && !error && (
            <p className="flex items-center gap-2 px-3 py-2 text-sm text-muted">
              <LoaderCircle className="size-4 animate-spin" /> Loading…
            </p>
          )}

          <ul className="max-h-72 overflow-y-auto">
            {shown?.map((product) => {
              const isCurrent = product.id === current?.id;
              return (
                <li key={product.id}>
                  <button
                    type="button"
                    data-product-option
                    onClick={() => open(product)}
                    aria-current={isCurrent ? "true" : undefined}
                    className={cn(
                      "flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left outline-none transition-colors hover:bg-elevated focus-visible:bg-elevated",
                      isCurrent && "bg-accent/10 hover:bg-accent/10",
                    )}
                  >
                    <span data-accent={product.accentColor} className="size-2 shrink-0 rounded-full bg-accent" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{product.name}</span>
                      <span className="block truncate font-mono text-xs text-muted">{product.slug}</span>
                    </span>
                    {isCurrent && <Check className="size-4 shrink-0 text-accent-text" />}
                  </button>
                </li>
              );
            })}
            {shown?.length === 0 && <li className="px-3 py-4 text-center text-sm text-muted">No product matches.</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
