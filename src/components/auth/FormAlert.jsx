import { CircleAlert, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const tones = {
  error: { icon: CircleAlert, className: "border-rose-500/30 bg-rose-500/10 text-rose-500" },
  success: { icon: CircleCheck, className: "border-emerald-500/30 bg-emerald-500/10 text-[light-dark(#047857,#34d399)]" },
};

/** A message about the whole form, e.g. "Incorrect email or password." */
export default function FormAlert({ message, tone = "error" }) {
  if (!message) return null;
  const { icon: Icon, className } = tones[tone];

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn("flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm", className)}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      {message}
    </div>
  );
}
