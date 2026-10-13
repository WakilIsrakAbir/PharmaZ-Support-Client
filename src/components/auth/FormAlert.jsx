import { CircleAlert } from "lucide-react";

/** A message about the whole form, e.g. "Incorrect email or password." */
export default function FormAlert({ message }) {
  if (!message) return null;

  return (
    <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-500">
      <CircleAlert className="mt-0.5 size-4 shrink-0" />
      {message}
    </div>
  );
}
