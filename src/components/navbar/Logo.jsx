import Link from "next/link";
import { Headset } from "lucide-react";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-linear-to-br from-accent to-accent-strong text-accent-foreground shadow-lg shadow-accent/30">
        <Headset className="size-5" />
      </span>

      <span className="leading-none">
        <span className="block text-[17px] font-extrabold tracking-tight">
          SUPPORT<span className="text-accent">.</span>TOOL
        </span>
        <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
          Demo Workspace
        </span>
      </span>
    </Link>
  );
}
