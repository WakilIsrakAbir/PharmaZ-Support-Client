import { Trash2 } from "lucide-react";
import { formatDate, formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Dash, DirectionLabel, StatusBadge } from "./CallBadges";

const COLUMNS = ["Date & time", "Support person", "Customer ID", "Mobile", "Transaction no.", "Direction", "Status"];

/**
 * `isLoading`: nothing to show yet, so draw placeholder rows.
 * `isRefreshing`: the rows on screen are about to be replaced, so fade them.
 * `onDelete`: given to admins only; adds a column of delete buttons after Status.
 */
export default function CallsTable({ calls, isLoading, isRefreshing, skeletonRows, onOpen, onDelete }) {
  // An empty heading for the delete buttons, read out as "Actions"
  const columns = onDelete ? [...COLUMNS, ""] : COLUMNS;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[60rem] text-left text-sm">
        <thead className="border-b border-border bg-elevated/50">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className={cn(
                  "whitespace-nowrap px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-accent-text",
                  // Status shrinks to its widest badge, so the buttons line up right after it
                  onDelete && column === "Status" && "w-px",
                )}
              >
                {column || <span className="sr-only">Actions</span>}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className={cn("divide-y divide-border transition-opacity", isRefreshing && "opacity-50")}>
          {isLoading
            ? Array.from({ length: skeletonRows }, (_, index) => <SkeletonRow key={index} columns={columns} />)
            : calls.map((call) => <CallRow key={call.id} call={call} onOpen={onOpen} onDelete={onDelete} />)}
        </tbody>
      </table>
    </div>
  );
}

function CallRow({ call, onOpen, onDelete }) {
  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen(call);
    }
  }

  return (
    <tr
      tabIndex={0}
      onClick={() => onOpen(call)}
      onKeyDown={handleKeyDown}
      aria-label={`Open the call with ${call.mobile}`}
      className="cursor-pointer outline-none transition-colors hover:bg-elevated/60 focus-visible:bg-accent/10"
    >
      <td className="whitespace-nowrap px-5 py-3.5">
        <p className="font-semibold">{formatDate(call.calledAt)}</p>
        <p className="text-xs text-muted">{formatTime(call.calledAt)}</p>
      </td>
      <td className="px-5 py-3.5">{call.createdBy?.name ?? <Dash />}</td>
      <td className="px-5 py-3.5">{call.customerId || <Dash />}</td>
      <td className="whitespace-nowrap px-5 py-3.5 tabular-nums">{call.mobile}</td>
      <td className="px-5 py-3.5">{call.transactionNo || <Dash />}</td>
      <td className="px-5 py-3.5">
        <DirectionLabel direction={call.direction} />
      </td>
      <td className="whitespace-nowrap px-5 py-3.5">
        <StatusBadge status={call.status} />
      </td>
      {onDelete && (
        <td className="py-2.5 pl-0 pr-5">
          <button
            type="button"
            title="Delete call"
            aria-label={`Delete the call with ${call.mobile}`}
            // The row opens the call; the button must not
            onClick={(event) => {
              event.stopPropagation();
              onDelete(call);
            }}
            onKeyDown={(event) => event.stopPropagation()}
            className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg text-muted transition-colors hover:bg-rose-500/10 hover:text-rose-500 focus-visible:bg-rose-500/10 focus-visible:text-rose-500"
          >
            <Trash2 className="size-4" />
          </button>
        </td>
      )}
    </tr>
  );
}

function SkeletonRow({ columns }) {
  return (
    <tr>
      {columns.map((column) => (
        <td key={column} className="px-5 py-4">
          <span className="block h-3.5 w-20 animate-pulse rounded bg-elevated" />
        </td>
      ))}
    </tr>
  );
}
