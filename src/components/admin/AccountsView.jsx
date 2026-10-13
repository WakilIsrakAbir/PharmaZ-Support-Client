"use client";

import { useState } from "react";
import { ChevronDown, CloudOff, Search, SearchX } from "lucide-react";
import Notice from "@/components/ui/Notice";
import Pagination from "@/components/ui/Pagination";
import { roleOf } from "@/config/roles";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { usePagedList } from "@/hooks/usePagedList";
import { formatRelative, getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 20;
const COLUMNS = ["Person", "Product", "Access", "Status", "Last seen"];

const ROLE_FILTERS = [
  { value: "", label: "All roles" },
  { value: "super-admin", label: "Super Admin" },
  { value: "admin", label: "Product Admin" },
  { value: "agent", label: "Support Agent" },
];

// Fixed colours, so the three kinds of account never look alike
const ACCESS_STYLES = {
  superAdmin: "bg-rose-500/10 text-rose-500 ring-rose-500/30",
  admin: "bg-indigo-500/10 text-indigo-500 ring-indigo-500/30",
  agent: "bg-amber-500/10 text-amber-500 ring-amber-500/30",
};

/** Every account on the platform, with the product each one works in. */
export default function AccountsView() {
  const [search, setSearch] = useState("");
  const [product, setProduct] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search);
  const params = new URLSearchParams({ page, limit: PAGE_SIZE });
  if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
  if (product) params.set("product", product);
  if (role) params.set("role", role);

  const { items: users, meta, error, isLoading, reload } = usePagedList("/admin/users", `?${params}`);
  // For the product filter
  const { items: products } = usePagedList("/admin/products", "");

  const productOptions = [
    { value: "", label: "All products" },
    ...products.map((item) => ({ value: item.id, label: item.isArchived ? `${item.name} (archived)` : item.name })),
    { value: "none", label: "No product" },
  ];

  const changeFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  let content;
  if (error && !isLoading) {
    content = (
      <Notice icon={CloudOff} title="Couldn't load the accounts" text={error}>
        <button
          type="button"
          onClick={reload}
          className="mt-5 cursor-pointer rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-elevated"
        >
          Try again
        </button>
      </Notice>
    );
  } else if (meta?.total === 0 && !isLoading) {
    content = <Notice icon={SearchX} title="Nobody matches" text="Try a different name, email, product or role." />;
  } else {
    content = (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[52rem] text-left text-sm">
          <thead className="border-b border-border">
            <tr>
              {COLUMNS.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="whitespace-nowrap bg-elevated/50 px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-accent-text first:rounded-tl-2xl last:rounded-tr-2xl"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={cn("divide-y divide-border transition-opacity", isLoading && users.length > 0 && "opacity-50")}>
            {isLoading && users.length === 0
              ? Array.from({ length: 6 }, (_, index) => (
                  <tr key={index}>
                    {COLUMNS.map((column) => (
                      <td key={column} className="px-5 py-4">
                        <span className="block h-3.5 w-24 animate-pulse rounded bg-elevated" />
                      </td>
                    ))}
                  </tr>
                ))
              : users.map((user) => <AccountRow key={user.id} user={user} />)}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-2 shadow-sm lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search name or email address</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={search}
            onChange={(event) => changeFilter(setSearch)(event.target.value)}
            placeholder="Search name or email address"
            className="w-full rounded-xl bg-transparent py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted hover:bg-elevated/60 focus:bg-elevated/60"
          />
        </label>
        <div className="grid grid-cols-2 gap-2 lg:flex lg:border-l lg:border-border lg:pl-2">
          <FilterSelect label="Product" value={product} options={productOptions} onChange={changeFilter(setProduct)} />
          <FilterSelect label="Role" value={role} options={ROLE_FILTERS} onChange={changeFilter(setRole)} />
        </div>
      </div>

      <section className="rounded-2xl border border-border bg-surface shadow-sm">
        {content}
        {meta?.totalPages > 1 && (
          <footer className="flex flex-col items-center justify-between gap-3 border-t border-border px-5 py-3.5 sm:flex-row">
            <p className="text-sm text-muted">
              <span className="font-semibold text-foreground">{meta.total}</span> accounts
            </p>
            <Pagination page={meta.page} totalPages={meta.totalPages} onChange={setPage} />
          </footer>
        )}
      </section>
    </div>
  );
}

function AccountRow({ user }) {
  const accessStyle = user.isSuperAdmin ? ACCESS_STYLES.superAdmin : ACCESS_STYLES[user.role];

  return (
    <tr className="transition-colors hover:bg-elevated/40">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl text-[11px] font-bold ring-0", accessStyle)}>
            {getInitials(user.name)}
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold">{user.name}</p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5">
        {user.product ? (
          <span data-accent={user.product.accentColor} className="flex items-center gap-2">
            <span className="size-2.5 shrink-0 rounded-full bg-accent" />
            <span className="truncate font-medium">{user.product.name}</span>
            {user.product.isArchived && <span className="text-xs text-muted">(archived)</span>}
          </span>
        ) : (
          <span className="text-muted">{user.isSuperAdmin ? "All products" : "None"}</span>
        )}
      </td>
      <td className="px-5 py-3.5">
        <span className={cn("inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1", accessStyle)}>
          {roleOf(user).label}
        </span>
      </td>
      <td className="whitespace-nowrap px-5 py-3.5">
        <AccountStatus user={user} />
      </td>
      <td className="whitespace-nowrap px-5 py-3.5">
        {user.lastLoginAt ? formatRelative(user.lastLoginAt) : <span className="text-muted">Never</span>}
      </td>
    </tr>
  );
}

function AccountStatus({ user }) {
  if (user.mustChangePassword) return <StatusDot className="bg-amber-500" label="Hasn't signed in yet" />;
  if (!user.product && !user.isSuperAdmin) return <StatusDot className="bg-slate-400" label="Not in a product" />;
  if (user.product?.isArchived) return <StatusDot className="bg-slate-400" label="Product archived" />;
  return <StatusDot className="bg-emerald-500" label="Active" />;
}

function StatusDot({ className, label }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn("size-2 rounded-full", className)} />
      {label}
    </span>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <div className="relative">
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "w-full cursor-pointer appearance-none rounded-xl border bg-transparent py-2.5 pl-3 pr-9 text-sm font-semibold outline-none transition-colors hover:bg-elevated/60 focus:border-accent lg:w-48",
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
