"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Boxes, Check, ChevronsUpDown, Headset, LoaderCircle } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useDismiss } from "@/hooks/useDismiss";
import { HOME_PATH, SUPER_ADMIN_HOME } from "@/config/routes";
import { api } from "@/lib/api";
import { goTo } from "@/lib/auth";
import { cn } from "@/lib/utils";

/**
 * The product you're working in, at the top of the sidebar. For the super admin it
 * is also a switcher between products.
 */
export default function SidebarBrand({ onNavigate }) {
  const user = useCurrentUser();
  if (user?.isSuperAdmin) return <ProductSwitcher product={user.product} onNavigate={onNavigate} />;

  return (
    <Link href="/" onClick={onNavigate} className="flex min-w-0 items-center gap-3" title={user?.product?.name}>
      <BrandMark />
      <BrandText user={user} name={user?.product?.name ?? "No product yet"} caption="Support Tool" />
    </Link>
  );
}

function BrandMark() {
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-accent-strong shadow-lg shadow-black/20">
      <Headset className="size-5" />
    </span>
  );
}

function BrandText({ user, name, caption }) {
  return (
    <span className="min-w-0 flex-1 text-left leading-none collapsed:hidden">
      {user ? (
        <span className="block truncate text-[17px] font-extrabold tracking-tight text-white">{name}</span>
      ) : (
        <span className="block h-4 w-28 animate-pulse rounded bg-white/20" />
      )}
      <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75">{caption}</span>
    </span>
  );
}

function ProductSwitcher({ product, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState(null);
  const [error, setError] = useState("");
  const [openingId, setOpeningId] = useState(null);
  const ref = useRef(null);
  useDismiss(ref, () => setIsOpen(false), isOpen);

  function toggle() {
    setIsOpen(!isOpen);
    // Loaded on first open, so the sidebar costs nothing until it's needed
    if (!products) {
      api("/admin/products")
        .then(({ data }) => setProducts(data.filter((item) => !item.isArchived)))
        .catch((requestError) => setError(requestError.message));
    }
  }

  async function open(id) {
    setOpeningId(id);
    try {
      await api("/admin/open-product", { method: "POST", body: { productId: id } });
      // A full load, so every page and cached setup starts fresh in the new product
      await goTo(HOME_PATH);
    } catch (requestError) {
      setError(requestError.message);
      setOpeningId(null);
    }
  }

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-label="Switch product"
        title={product ? `${product.name} — switch product` : "Switch product"}
        className="flex w-full cursor-pointer items-center gap-3 rounded-xl p-1 -m-1 transition-colors hover:bg-white/10 collapsed:justify-center"
      >
        <BrandMark />
        <BrandText user name={product?.name ?? "No product open"} caption="Super admin" />
        <ChevronsUpDown className="size-4 shrink-0 text-white/70 collapsed:hidden" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-2xl border border-border bg-surface p-1.5 text-foreground shadow-2xl shadow-black/30">
          <p className="px-3 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Open a product</p>
          {error && <p className="px-3 py-2 text-xs text-rose-500">{error}</p>}
          {!products && !error && (
            <p className="flex items-center gap-2 px-3 py-2 text-sm text-muted">
              <LoaderCircle className="size-4 animate-spin" /> Loading...
            </p>
          )}
          <ul className="max-h-72 overflow-y-auto">
            {products?.map((item) => {
              const isCurrent = item.id === product?.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => (isCurrent ? setIsOpen(false) : open(item.id))}
                    disabled={openingId !== null}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-elevated disabled:cursor-wait"
                  >
                    {/* data-accent gives the dot that product's own colour */}
                    <span data-accent={item.accentColor} className="size-2.5 shrink-0 rounded-full bg-accent" />
                    <span className={cn("min-w-0 flex-1 truncate", isCurrent && "font-semibold")}>{item.name}</span>
                    {openingId === item.id ? (
                      <LoaderCircle className="size-4 animate-spin text-muted" />
                    ) : (
                      isCurrent && <Check className="size-4 text-accent-text" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          <Link
            href={SUPER_ADMIN_HOME}
            onClick={() => {
              setIsOpen(false);
              onNavigate?.();
            }}
            className="mt-1 flex items-center gap-3 rounded-xl border-t border-border px-3 py-2.5 text-sm font-semibold text-accent-text transition-colors hover:bg-elevated"
          >
            <Boxes className="size-4" />
            All products
          </Link>
        </div>
      )}
    </div>
  );
}
