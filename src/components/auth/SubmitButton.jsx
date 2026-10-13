import { LoaderCircle } from "lucide-react";

export default function SubmitButton({ isSubmitting, children, submittingText }) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent-strong px-5 py-3 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/30 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-wait disabled:opacity-80 disabled:hover:translate-y-0"
    >
      {isSubmitting && <LoaderCircle className="size-4 animate-spin" />}
      {isSubmitting ? submittingText : children}
    </button>
  );
}
