import Link from "next/link";
import { Headset } from "lucide-react";
import { BRAND } from "@/config/brand";

/** The brand mark. `name` shows a product's name instead of the platform's (inside a product). */
export default function Logo({ name = BRAND.name }) {
  return (
    <Link href="/" className="flex min-w-0 items-center gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-linear-to-br from-accent to-accent-strong text-accent-foreground shadow-lg shadow-accent/30">
        <Headset className="size-5" />
      </span>

      <span className="min-w-0 leading-none">
        <span className="block truncate text-[17px] font-extrabold tracking-tight">{name}</span>
        <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
          {BRAND.tagline}
        </span>
      </span>
    </Link>
  );
}
