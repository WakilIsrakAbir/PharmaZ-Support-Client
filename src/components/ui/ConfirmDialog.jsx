"use client";

import { useEffect, useRef } from "react";
import { LoaderCircle, TriangleAlert } from "lucide-react";

/**
 * "Are you sure?" for actions that can't be undone. Open while `isOpen` is true;
 * Esc, Cancel or a click outside calls `onCancel`.
 */
export default function ConfirmDialog({ isOpen, title, children, confirmText, isWorking, error, onConfirm, onCancel }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onCancel}
      onClick={(event) => event.target === event.currentTarget && !isWorking && dialogRef.current.close()}
      aria-labelledby="confirm-dialog-title"
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-border bg-surface p-0 text-foreground shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      {isOpen && (
        <div className="p-6">
          <div className="flex gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-rose-500/10 text-rose-500">
              <TriangleAlert className="size-5" />
            </span>
            <div>
              <h2 id="confirm-dialog-title" className="font-semibold">
                {title}
              </h2>
              <div className="mt-1.5 text-sm text-muted">{children}</div>
              {error && <p className="mt-3 text-sm font-medium text-rose-500">{error}</p>}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => dialogRef.current.close()}
              disabled={isWorking}
              className="cursor-pointer rounded-xl border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-elevated disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isWorking}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-600/30 transition-colors hover:bg-rose-700 disabled:cursor-wait disabled:opacity-80"
            >
              {isWorking && <LoaderCircle className="size-4 animate-spin" />}
              {confirmText}
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
