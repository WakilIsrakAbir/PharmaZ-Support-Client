import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const GAP = "…";

/**
 * The page numbers to show: always the first and last page, plus the pages
 * around the current one. 20 pages, on page 9 -> 1 … 8 9 10 … 20
 */
function getPageItems(page, totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);
  if (page <= 4) return [1, 2, 3, 4, 5, GAP, totalPages];
  if (page >= totalPages - 3) {
    return [1, GAP, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, GAP, page - 1, page, page + 1, GAP, totalPages];
}

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="flex items-center gap-1">
      <PageButton onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="Previous page">
        <ChevronLeft className="size-4" />
      </PageButton>

      {getPageItems(page, totalPages).map((item, index) =>
        item === GAP ? (
          <span key={`gap-${index}`} className="w-6 text-center text-sm text-muted">
            {GAP}
          </span>
        ) : (
          <PageButton
            key={item}
            onClick={() => onChange(item)}
            isActive={item === page}
            aria-current={item === page ? "page" : undefined}
            aria-label={`Page ${item}`}
          >
            {item}
          </PageButton>
        ),
      )}

      <PageButton onClick={() => onChange(page + 1)} disabled={page === totalPages} aria-label="Next page">
        <ChevronRight className="size-4" />
      </PageButton>
    </nav>
  );
}

function PageButton({ isActive, className, ...props }) {
  return (
    <button
      type="button"
      className={cn(
        "grid h-9 min-w-9 cursor-pointer place-items-center rounded-full px-2 text-sm font-semibold tabular-nums transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        isActive
          ? "bg-accent-strong text-accent-foreground shadow-md shadow-accent/30"
          : "text-muted hover:bg-elevated hover:text-foreground disabled:hover:bg-transparent",
        className,
      )}
      {...props}
    />
  );
}
