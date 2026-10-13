"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Hourglass, KeyRound, LayoutGrid, LogOut } from "lucide-react";
import AuthHeading from "@/components/auth/AuthHeading";
import SetPasswordForm from "@/components/auth/SetPasswordForm";
import Logo from "@/components/ui/Logo";
import { SUPER_ADMIN_HOME } from "@/config/routes";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { logOut } from "@/lib/auth";

/**
 * Decides what a logged-in person may see:
 * - an account still on its temporary password sets a new one first;
 * - someone outside any product waits for access;
 * - the super admin's console works without a product open.
 */
export default function AccessGate({ children }) {
  const user = useCurrentUser();
  const pathname = usePathname();

  // Still loading: render the app, the pages show their own loading state
  if (!user) return children;

  if (user.mustChangePassword) {
    return (
      <Screen>
        <div className="mb-6 grid size-12 place-items-center rounded-2xl bg-accent/10 text-accent-text">
          <KeyRound className="size-6" />
        </div>
        <AuthHeading
          title="Set your password"
          subtitle={`Welcome, ${user.name.split(" ")[0]}. Your account was made with a temporary password; choose your own to continue.`}
        />
        <SetPasswordForm />
        <SignOut />
      </Screen>
    );
  }

  if (user.product || (user.isSuperAdmin && pathname.startsWith("/admin"))) return children;

  if (user.isSuperAdmin) {
    return (
      <Message icon={LayoutGrid} title="No products yet">
        Create the first product, give it an admin, and its dashboard opens here.
        <Link
          href={SUPER_ADMIN_HOME}
          className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-xl bg-accent-strong px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/30"
        >
          <LayoutGrid className="size-4" />
          Go to all products
        </Link>
      </Message>
    );
  }

  return (
    <Message icon={Hourglass} title="Waiting for access">
      Your account ({user.email}) isn&apos;t part of an active product right now. Ask your product admin, or the super
      admin, to add you, then refresh this page.
      <SignOut />
    </Message>
  );
}

function Screen({ children }) {
  return (
    <main className="flex min-h-screen flex-col px-6 py-10 sm:px-10">
      <Logo />
      <div className="mx-auto my-auto w-full max-w-md py-10">{children}</div>
    </main>
  );
}

function Message({ icon: Icon, title, children }) {
  return (
    <Screen>
      <div className="text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent/10 text-accent-text">
          <Icon className="size-7" />
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">{title}</h1>
        <div className="mt-2 text-sm text-muted">{children}</div>
      </div>
    </Screen>
  );
}

function SignOut() {
  return (
    <button
      type="button"
      onClick={logOut}
      className="mx-auto mt-6 flex cursor-pointer items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-elevated"
    >
      <LogOut className="size-4" />
      Sign out
    </button>
  );
}
