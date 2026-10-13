/** The scrolling middle and the button bar, shared by both views of the dialog. */
export function DialogBody({ children }) {
  return <div className="flex-1 space-y-6 overflow-y-auto p-6">{children}</div>;
}

export function DialogFooter({ children }) {
  return <footer className="flex justify-end gap-2 border-t border-border bg-elevated/40 px-6 py-4">{children}</footer>;
}

export const secondaryButtonClass =
  "cursor-pointer rounded-xl border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-elevated";
