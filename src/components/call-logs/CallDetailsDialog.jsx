"use client";

import { useEffect, useRef, useState } from "react";
import { PhoneCall, X } from "lucide-react";
import { CALL_DIRECTIONS, findOption } from "@/config/call-log";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import CallSummary from "./CallSummary";
import EditCallForm from "./EditCallForm";

/** The full record of one call, in a modal. Pass `call={null}` to close it. */
export default function CallDetailsDialog({ call, onClose, onUpdated }) {
  const dialogRef = useRef(null);
  const user = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);

  // A native <dialog> gives us the backdrop, Esc to close and focus trapping for free
  useEffect(() => {
    const dialog = dialogRef.current;
    if (call && !dialog.open) dialog.showModal();
    if (!call && dialog.open) dialog.close();
  }, [call]);

  // Runs for the X button, Esc and clicks on the backdrop alike
  function handleClose() {
    setIsEditing(false);
    onClose();
  }

  function handleSaved(updatedCall) {
    setIsEditing(false);
    onUpdated(updatedCall);
  }

  const canEdit = call && user && (user.role === "admin" || call.createdBy?.id === user.id);
  const direction = call && findOption(CALL_DIRECTIONS, call.direction);

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      onClick={(event) => event.target === event.currentTarget && dialogRef.current.close()}
      aria-labelledby="call-dialog-title"
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-surface p-0 text-foreground shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm open:flex"
    >
      {call && (
        <>
          <header className="relative flex items-center gap-3 border-b border-border bg-linear-to-r from-elevated to-transparent px-6 py-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent-text">
              <PhoneCall className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="call-dialog-title" className="font-semibold">
                {isEditing ? "Update call" : "Call details"}
              </h2>
              <p className="truncate text-xs text-muted">
                {call.mobile} · {direction?.label}
              </p>
            </div>
            <button
              type="button"
              onClick={() => dialogRef.current.close()}
              aria-label="Close"
              className="grid size-9 cursor-pointer place-items-center rounded-lg text-muted transition-colors hover:bg-elevated hover:text-foreground"
            >
              <X className="size-5" />
            </button>
            <span className="absolute bottom-0 left-6 h-0.5 w-12 rounded-full bg-accent" />
          </header>

          {isEditing ? (
            <EditCallForm call={call} onCancel={() => setIsEditing(false)} onSaved={handleSaved} />
          ) : (
            <CallSummary
              call={call}
              canEdit={canEdit}
              onEdit={() => setIsEditing(true)}
              onClose={() => dialogRef.current.close()}
            />
          )}
        </>
      )}
    </dialog>
  );
}
