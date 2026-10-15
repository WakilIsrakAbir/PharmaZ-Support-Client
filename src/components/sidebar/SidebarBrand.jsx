"use client";

import Link from "next/link";
import { Headset } from "lucide-react";
import { BRAND } from "@/config/brand";
import { SUPER_ADMIN_HOME } from "@/config/routes";
import { useCurrentUser } from "@/hooks/useCurrentUser";

/**
 * The top of the sidebar. The super admin sees the platform's name and goes to All
 * products from it (switching product is the picker beside each page title);
 * everyone else sees the product they work in.
 */
export default function SidebarBrand({ onNavigate }) {
  const user = useCurrentUser();
  const isSuperAdmin = Boolean(user?.isSuperAdmin);
  const name = isSuperAdmin ? BRAND.name : (user?.product?.name ?? "No product yet");

  return (
    <Link
      href={isSuperAdmin ? SUPER_ADMIN_HOME : "/"}
      onClick={onNavigate}
      title={isSuperAdmin ? "All products" : name}
      className="flex min-w-0 items-center gap-3"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-accent-strong shadow-lg shadow-black/20">
        <Headset className="size-5" />
      </span>
      <span className="min-w-0 flex-1 text-left leading-none collapsed:hidden">
        {user ? (
          <span className="block truncate text-[17px] font-extrabold tracking-tight text-white">{name}</span>
        ) : (
          <span className="block h-4 w-28 animate-pulse rounded bg-white/20" />
        )}
        <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75">
          {isSuperAdmin ? "Super admin" : BRAND.tagline}
        </span>
      </span>
    </Link>
  );
}
