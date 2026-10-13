import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/** `form` lets a button outside the <form> (e.g. in a dialog footer) submit it, by the form's id. */
export default function SubmitButton({ isSubmitting, disabled, submittingText, icon: Icon, fullWidth = true, form, children }) {
  return (
    <button
      type="submit"
      form={form}
      disabled={isSubmitting || disabled}
      className={cn(
        "flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent-strong px-5 py-3 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/30 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:hover:translate-y-0",
        fullWidth && "w-full",
        isSubmitting ? "cursor-wait opacity-80" : "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none",
      )}
    >
      {isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : Icon && <Icon className="size-4" />}
      {isSubmitting ? submittingText : children}
    </button>
  );
}
