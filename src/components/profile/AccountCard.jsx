"use client";

import { useState } from "react";
import { Check, Copy, ShieldCheck } from "lucide-react";
import { roleOf } from "@/config/roles";
import { formatDateTime, formatMonthYear, getInitials } from "@/lib/format";

/** The coloured card at the top of the profile: who you are and facts you can't edit. */
export default function AccountCard({ user }) {
  const role = roleOf(user);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-accent-strong to-accent text-accent-foreground shadow-xl shadow-accent/20">
      <div aria-hidden className="bg-crosshatch absolute inset-0 opacity-[0.07]" />
      <div aria-hidden className="absolute -right-24 -top-24 size-80 rounded-full bg-white/15 blur-3xl" />

      <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] opacity-75">Your account</p>

          <div className="mt-4 flex items-center gap-4 sm:gap-5">
            <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-white/15 text-2xl font-extrabold ring-1 ring-white/30 backdrop-blur sm:size-20 sm:text-3xl">
              {getInitials(user.name)}
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">{user.name}</h2>
              <p className="truncate text-sm opacity-85">{user.email}</p>
            </div>
          </div>

          <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/25">
            <span className="size-1.5 rounded-full bg-current" />
            {role.label}
          </span>
        </div>

        <dl className="divide-y divide-white/15 lg:w-80 lg:border-l lg:border-white/15 lg:pl-8">
          <Fact label="Member since">{formatMonthYear(user.createdAt)}</Fact>
          <Fact label="Last sign-in">{user.lastLoginAt ? formatDateTime(user.lastLoginAt) : "—"}</Fact>
          <Fact label="Account ID">
            <CopyableId id={user.id} />
          </Fact>
        </dl>
      </div>

      <p className="relative flex items-start gap-2.5 border-t border-white/15 px-6 py-4 text-sm sm:px-8">
        <ShieldCheck className="mt-0.5 size-4 shrink-0" />
        {role.description}{" "}
        {user.isSuperAdmin ? "This is the platform owner's account." : "Your access level is set by an administrator."}
      </p>
    </section>
  );
}

function Fact({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-6 py-3 first:pt-0 last:pb-0">
      <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] opacity-75">{label}</dt>
      <dd className="font-mono text-sm font-semibold">{children}</dd>
    </div>
  );
}

function CopyableId({ id }) {
  const [isCopied, setIsCopied] = useState(false);
  const Icon = isCopied ? Check : Copy;

  async function copy() {
    try {
      await navigator.clipboard.writeText(id);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    } catch {
      // Clipboard access can be blocked; the ID is still visible in the tooltip
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      title={id}
      aria-label={isCopied ? "Account ID copied" : "Copy account ID"}
      className="flex cursor-pointer items-center gap-2 rounded-md transition-opacity hover:opacity-80"
    >
      {id.slice(0, 6)}…{id.slice(-4)}
      <Icon className="size-3.5" />
    </button>
  );
}
