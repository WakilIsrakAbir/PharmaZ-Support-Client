import { LoaderCircle } from "lucide-react";
import { ROLES } from "@/config/roles";
import { formatDate, formatRelative, getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";
import UserActions from "./UserActions";

const COLUMNS = ["Person", "Access", "Joined", "Last seen", ""];

// Fixed colours, not the accent, so the two roles never look alike
const ROLE_STYLES = {
  admin: { badge: "bg-indigo-500/10 text-indigo-500 ring-indigo-500/30", avatar: "bg-indigo-500/10 text-indigo-500" },
  agent: { badge: "bg-amber-500/10 text-amber-500 ring-amber-500/30", avatar: "bg-amber-500/10 text-amber-500" },
};

export default function UsersTable({
  users,
  currentUserId,
  isSuperAdmin,
  busyUserId,
  isLoading,
  isRefreshing,
  skeletonRows,
  onChangeRole,
  onRemove,
}) {
  return (
    // Only phones scroll sideways; elsewhere the row menus must not be clipped by a scroll box
    <div className="max-md:overflow-x-auto">
      <table className="w-full text-left text-sm max-md:min-w-[44rem]">
        <thead className="border-b border-border">
          <tr>
            {COLUMNS.map((column) => (
              <th
                key={column || "actions"}
                scope="col"
                className="relative whitespace-nowrap bg-elevated/50 px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-accent-text first:rounded-tl-2xl last:rounded-tr-2xl"
              >
                {column || <span className="sr-only">Actions</span>}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className={cn("divide-y divide-border transition-opacity", isRefreshing && "opacity-50")}>
          {isLoading
            ? Array.from({ length: skeletonRows }, (_, index) => <SkeletonRow key={index} />)
            : users.map((user, index) => (
                <UserRow
                  key={user.id}
                  user={user}
                  // The bottom rows open their menu upwards, so it stays inside the card
                  menuOpensUp={users.length > 3 && index >= users.length - 2}
                  isYou={user.id === currentUserId}
                  isSuperAdmin={isSuperAdmin}
                  isBusy={user.id === busyUserId}
                  onChangeRole={onChangeRole}
                  onRemove={onRemove}
                />
              ))}
        </tbody>
      </table>
    </div>
  );
}

function UserRow({ user, isYou, isSuperAdmin, isBusy, menuOpensUp, onChangeRole, onRemove }) {
  return (
    <tr className="transition-colors hover:bg-elevated/40">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-xl text-[11px] font-bold",
              ROLE_STYLES[user.role]?.avatar,
            )}
          >
            {getInitials(user.name)}
          </span>
          <div className="min-w-0">
            <p className="flex items-center gap-2 font-semibold">
              <span className="truncate">{user.name}</span>
              {isYou && (
                <span className="rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-500">
                  You
                </span>
              )}
            </p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <span className={cn("inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1", ROLE_STYLES[user.role]?.badge)}>
          {ROLES[user.role]?.label}
        </span>
      </td>
      <td className="whitespace-nowrap px-5 py-3.5 text-muted">{formatDate(user.createdAt)}</td>
      <td className="whitespace-nowrap px-5 py-3.5">
        {user.lastLoginAt ? formatRelative(user.lastLoginAt) : <span className="text-muted">Never</span>}
      </td>
      <td className="w-14 px-3 py-3.5 text-right">
        {/* Nobody acts on their own account here */}
        {isBusy ? (
          <LoaderCircle className="ml-auto mr-2 size-4 animate-spin text-muted" />
        ) : (
          !isYou && (
            <UserActions
              user={user}
              isSuperAdmin={isSuperAdmin}
              opensUp={menuOpensUp}
              onChangeRole={onChangeRole}
              onRemove={onRemove}
            />
          )
        )}
      </td>
    </tr>
  );
}

function SkeletonRow() {
  return (
    <tr>
      {COLUMNS.map((column) => (
        <td key={column || "actions"} className="px-5 py-4">
          <span className="block h-3.5 w-20 animate-pulse rounded bg-elevated" />
        </td>
      ))}
    </tr>
  );
}
