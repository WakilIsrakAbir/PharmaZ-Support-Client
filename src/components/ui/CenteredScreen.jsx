import Logo from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

/** A whole screen with the logo on top and `children` centred, for pages outside the app shell. */
export default function CenteredScreen({ className, children }) {
  return (
    <main className="flex min-h-screen flex-1 flex-col px-6 py-10 sm:px-10">
      <Logo />
      <div className={cn("mx-auto my-auto w-full max-w-md py-10", className)}>{children}</div>
    </main>
  );
}
