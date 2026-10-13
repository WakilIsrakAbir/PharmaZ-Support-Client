"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import AccountCard from "./AccountCard";
import DetailsForm from "./DetailsForm";
import PasswordForm from "./PasswordForm";

export default function ProfileView() {
  const user = useCurrentUser();

  if (!user) return <ProfileSkeleton />;

  return (
    <div className="space-y-6">
      <AccountCard user={user} />
      <DetailsForm user={user} />
      <PasswordForm passwordChangedAt={user.passwordChangedAt} />
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading your profile">
      <div className="h-64 animate-pulse rounded-3xl bg-elevated" />
      <div className="h-80 animate-pulse rounded-2xl bg-elevated" />
      <div className="h-80 animate-pulse rounded-2xl bg-elevated" />
    </div>
  );
}
