import { formatDate, formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Dash, DirectionLabel, StatusBadge } from "./CallBadges";

const COLUMNS = ["Date & time", "Support person", "Customer ID", "Mobile", "Transaction no.", "Direction", "Status"];

/**
 * `isLoading`: nothing to show yet, so draw placeholder rows.
 * `isRefreshing`: the rows on screen are about to be replaced, so fade them.
 */
export default function CallsTable({ calls, isLoading, isRefreshing, skeletonRows, onOpen }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[60rem] text-left text-sm">
        <thead className="border-b border-border bg-elevated/50">
          <tr>
            {COLUMNS.map((column) => (
              <th
                key={column}
                scope="col"
                className="whitespace-nowrap px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-accent-text"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className={cn("divide-y divide-border transition-opacity", isRefreshing && "opacity-50")}>
          {isLoading
            ? Array.from({ length: skeletonRows }, (_, index) => <SkeletonRow key={index} />)
            : calls.map((call) => <CallRow key={call.id} call={call} onOpen={onOpen} />)}
        </tbody>
      </table>
    </div>
  );
}

function CallRow({ call, onOpen }) {
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
      <td className="px-5 py-3.5">
        <StatusBadge status={call.status} />
      </td>
    </tr>
  );
}

function SkeletonRow() {
  return (
    <tr>
      {COLUMNS.map((column) => (
        <td key={column} className="px-5 py-4">
          <span className="block h-3.5 w-20 animate-pulse rounded bg-elevated" />
        </td>
      ))}
    </tr>
  );
}
