"use client";

import { useState } from "react";
import { ChevronDown, LockKeyhole, RotateCw, Search, SearchX, UserPlus, UserX } from "lucide-react";
import FormAlert from "@/components/auth/FormAlert";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Notice from "@/components/ui/Notice";
import Pagination from "@/components/ui/Pagination";
import { ROLES, canManageProduct } from "@/config/roles";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { usePagedList } from "@/hooks/usePagedList";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import AddMemberDialog from "./AddMemberDialog";
import UserSummary from "./UserSummary";
import UsersTable from "./UsersTable";

const PAGE_SIZE = 20;
const ROLE_OPTIONS = [{ value: "", label: "All roles" }, ...Object.entries(ROLES).map(([value, role]) => ({ value, label: role.label }))];

export default function UsersView() {
  const currentUser = useCurrentUser();

  // The API refuses non-admins anyway; this just explains it instead of showing errors
  if (!currentUser) return <div className="h-96 animate-pulse rounded-2xl bg-elevated" />;
  if (!canManageProduct(currentUser)) {
    return (
      <Notice icon={LockKeyhole} title="Admins only" text="Ask an administrator if you need to manage users." />
    );
  }

  return <UsersManager currentUserId={currentUser.id} isSuperAdmin={Boolean(currentUser.isSuperAdmin)} />;
}

// Product admins add and remove support agents; the super admin also decides who is an admin
function UsersManager({ currentUserId, isSuperAdmin }) {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [busyUserId, setBusyUserId] = useState(null);
  const [actionError, setActionError] = useState("");
  const [userToRemove, setUserToRemove] = useState(null);
  const [removeError, setRemoveError] = useState("");
  const [isRemoving, setIsRemoving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [notice, setNotice] = useState("");

  const debouncedSearch = useDebouncedValue(search);
  const params = new URLSearchParams({ page, limit: PAGE_SIZE });
  if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
  if (role) params.set("role", role);

  const { items: users, meta, extra, error, isLoading, reload } = usePagedList("/users", `?${params}`);

  async function changeRole(user, newRole) {
    setActionError("");
    setBusyUserId(user.id);
    try {
      await api(`/users/${user.id}`, { method: "PATCH", body: { role: newRole } });
      reload(); // the summary counts change too
    } catch (requestError) {
      setActionError(requestError.message);
    }
    setBusyUserId(null);
  }

  function askToRemove(user) {
    setRemoveError("");
    setUserToRemove(user);
  }

  async function confirmRemove() {
    setIsRemoving(true);
    try {
      await api(`/users/${userToRemove.id}`, { method: "DELETE" });
      setUserToRemove(null);
      // Removing the last person on a page moves back one page
      if (users.length === 1 && page > 1) setPage(page - 1);
      else reload();
    } catch (requestError) {
      setRemoveError(requestError.message);
    }
    setIsRemoving(false);
  }

  let content;
  if (error && !isLoading) {
    content = (
      <Notice icon={UserX} title="Couldn't load the users" text={error}>
        <ActionButton onClick={reload}>Try again</ActionButton>
      </Notice>
    );
  } else if (meta?.total === 0 && !isLoading) {
    content = (
      <Notice icon={SearchX} title="Nobody matches" text="Try a different name, email or role.">
        <ActionButton
          onClick={() => {
            setSearch("");
            setRole("");
            setPage(1);
          }}
        >
          Clear filters
        </ActionButton>
      </Notice>
    );
  } else {
    content = (
      <UsersTable
        users={users}
        currentUserId={currentUserId}
        isSuperAdmin={isSuperAdmin}
        busyUserId={busyUserId}
        isLoading={isLoading && users.length === 0}
        isRefreshing={isLoading && users.length > 0}
        skeletonRows={5}
        onChangeRole={changeRole}
        onRemove={askToRemove}
      />
    );
  }

  return (
    <div className="space-y-4">
      {extra.summary && <UserSummary summary={extra.summary} />}

      <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-2 shadow-sm sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search name or email address</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search name or email address"
            className="w-full rounded-xl bg-transparent py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted hover:bg-elevated/60 focus:bg-elevated/60"
          />
        </label>

        <div className="flex items-center gap-2 sm:border-l sm:border-border sm:pl-2">
          <div className="relative flex-1">
            <select
              aria-label="Role"
              value={role}
              onChange={(event) => {
                setRole(event.target.value);
                setPage(1);
              }}
              className={cn(
                "w-full cursor-pointer appearance-none rounded-xl border bg-transparent py-2.5 pl-3 pr-9 text-sm font-semibold outline-none transition-colors hover:bg-elevated/60 focus:border-accent",
                role ? "border-accent/50 bg-accent/10 text-accent-text" : "border-transparent",
              )}
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          </div>

          <button
            type="button"
            onClick={reload}
            aria-label="Refresh"
            title="Refresh"
            className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-xl text-muted transition-colors hover:bg-elevated hover:text-foreground"
          >
            <RotateCw className={cn("size-4", isLoading && "animate-spin")} />
          </button>

          <button
            type="button"
            onClick={() => {
              setNotice("");
              setIsAdding(true);
            }}
            aria-label="Add agent"
            className="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-accent-strong px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-md shadow-accent/30 transition-all hover:-translate-y-0.5"
          >
            <UserPlus className="size-4" />
            <span className="hidden sm:inline">Add agent</span>
          </button>
        </div>
      </div>

      <FormAlert message={actionError} />
      <FormAlert tone="success" message={notice} />

      <section className="rounded-2xl border border-border bg-surface shadow-sm">
        {content}

        {meta?.totalPages > 1 && (
          <footer className="flex flex-col items-center justify-between gap-3 border-t border-border px-5 py-3.5 sm:flex-row">
            <p className="text-sm text-muted">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {(meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)}
              </span>{" "}
              of <span className="font-semibold text-foreground">{meta.total}</span>
            </p>
            <Pagination page={meta.page} totalPages={meta.totalPages} onChange={setPage} />
          </footer>
        )}
      </section>

      <AddMemberDialog
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        onAdded={(user) => {
          // The dialog stays open to show their sign-in details
          setNotice(`${user.name} was added as a support agent.`);
          reload();
        }}
      />

      <ConfirmDialog
        isOpen={Boolean(userToRemove)}
        title={`Remove ${userToRemove?.name}?`}
        confirmText="Remove"
        isWorking={isRemoving}
        error={removeError}
        onConfirm={confirmRemove}
        onCancel={() => !isRemoving && setUserToRemove(null)}
      >
        They lose access to this product straight away. Their account stays, so you can add them back later, and
        the calls they logged stay in Call Logs.
      </ConfirmDialog>
    </div>
  );
}

function ActionButton({ onClick, children }) {
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
