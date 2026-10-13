"use client";

import { useState } from "react";
import { Check, ClipboardCopy, Copy, KeyRound, UserCheck } from "lucide-react";

/**
 * Shown once after adding someone. A new account comes with a temporary password that
 * is never shown again, so it can be copied here and passed on. Someone who already
 * had an account keeps their own password.
 */
export default function NewAccountNotice({ user, temporaryPassword, roleLabel }) {
  if (!temporaryPassword) {
    return (
      <div className="flex gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm">
        <UserCheck className="mt-0.5 size-5 shrink-0 text-emerald-500" />
        <p>
          <span className="font-semibold">{user.name}</span> is now a {roleLabel}. They already had an account, so they
          sign in with their usual password.
        </p>
      </div>
    );
  }

  const loginUrl = typeof window === "undefined" ? "/login" : `${window.location.origin}/login`;
  const details = `Sign in at: ${loginUrl}\nEmail: ${user.email}\nTemporary password: ${temporaryPassword}`;

  return (
    <div className="overflow-hidden rounded-xl border border-accent/40">
      <div className="flex gap-3 bg-accent/10 p-4 text-sm">
        <KeyRound className="mt-0.5 size-5 shrink-0 text-accent-text" />
        <p>
          <span className="font-semibold">{user.name}</span>&apos;s account is ready. Give them these sign-in details.
          The password is <span className="font-semibold">shown only this once</span>; they&apos;ll choose their own
          when they first sign in.
        </p>
      </div>
      <dl className="divide-y divide-border">
        <Row label="Email" value={user.email} />
        <Row label="Temporary password" value={temporaryPassword} isSecret />
      </dl>
      <div className="border-t border-border p-3">
        <CopyButton text={details} icon={ClipboardCopy} label="Copy sign-in details" copiedLabel="Sign-in details copied" />
      </div>
    </div>
  );
}

function Row({ label, value, isSecret }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <dt className="w-24 shrink-0 text-xs text-muted sm:w-36">{label}</dt>
      <dd className={isSecret ? "flex-1 font-mono text-base font-bold tracking-wide" : "min-w-0 flex-1 truncate text-sm font-semibold"}>
        {value}
      </dd>
      <CopyButton text={value} label={`Copy ${label.toLowerCase()}`} compact />
    </div>
  );
}

function CopyButton({ text, label, copiedLabel = "Copied", icon: Icon = Copy, compact }) {
  const [isCopied, setIsCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    } catch {
      // Clipboard blocked (e.g. not https): the text is on screen to copy by hand
    }
  }

  const ShownIcon = isCopied ? Check : Icon;
  if (compact) {
    return (
      <button
        type="button"
        onClick={copy}
        aria-label={isCopied ? "Copied" : label}
        title={label}
        className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg text-muted transition-colors hover:bg-elevated hover:text-foreground"
      >
        <ShownIcon className="size-4" />
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-elevated px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-accent/10 hover:text-accent-text"
    >
      <ShownIcon className="size-4" />
      {isCopied ? copiedLabel : label}
    </button>
  );
}
