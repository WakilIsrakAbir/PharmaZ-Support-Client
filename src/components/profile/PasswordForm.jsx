"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
import FormAlert from "@/components/auth/FormAlert";
import PasswordField from "@/components/auth/PasswordField";
import PasswordStrength from "@/components/auth/PasswordStrength";
import SubmitButton from "@/components/auth/SubmitButton";
import FormSection from "@/components/ui/FormSection";
import { updateCurrentAccount } from "@/hooks/useCurrentUser";
import { useForm } from "@/hooks/useForm";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";

const EMPTY_FORM = { currentPassword: "", newPassword: "", confirmPassword: "" };

function validate({ currentPassword, newPassword, confirmPassword }) {
  const errors = {};
  if (!currentPassword) errors.currentPassword = "Enter your current password.";
  if (newPassword.length < 8) errors.newPassword = "Use at least 8 characters.";
  else if (newPassword === currentPassword) errors.newPassword = "Choose a password you aren't using now.";
  if (confirmPassword !== newPassword) errors.confirmPassword = "Passwords don't match.";
  return errors;
}

export default function PasswordForm({ passwordChangedAt }) {
  const [isChanged, setIsChanged] = useState(false);

  const { values, errors, formError, isSubmitting, handleChange, handleSubmit, reset } = useForm({
    initialValues: EMPTY_FORM,
    validate,
    onSubmit: async ({ currentPassword, newPassword }) => {
      const { data } = await api("/auth/me/password", { method: "PATCH", body: { currentPassword, newPassword } });
      updateCurrentAccount(data);
      reset();
      setIsChanged(true);
    },
  });

  function handleFieldChange(event) {
    setIsChanged(false);
    handleChange(event);
  }

  const footer = (
    <>
      <p className="text-sm text-muted">
        {passwordChangedAt
          ? `Last changed on ${formatDate(passwordChangedAt)}.`
          : "You haven't changed it since your account was created."}
      </p>
      <SubmitButton isSubmitting={isSubmitting} submittingText="Updating..." icon={KeyRound} fullWidth={false}>
        Update password
      </SubmitButton>
    </>
  );

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormSection
        icon={KeyRound}
        title="Password"
        subtitle="Changing it logs you out on your other devices. You stay logged in here."
        footer={footer}
      >
        <FormAlert message={formError} />
        <FormAlert
          tone="success"
          message={isChanged && "Password updated. Any other device using your account has been logged out."}
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
          <div className="space-y-5">
            <PasswordField
              id="currentPassword"
              label="Current password"
              autoComplete="current-password"
              value={values.currentPassword}
              onChange={handleFieldChange}
              error={errors.currentPassword}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <PasswordField
                id="newPassword"
                label="New password"
                autoComplete="new-password"
                placeholder="8+ characters"
                value={values.newPassword}
                onChange={handleFieldChange}
                error={errors.newPassword}
              />
              <PasswordField
                id="confirmPassword"
                label="Confirm new password"
                autoComplete="new-password"
                placeholder="Type it again"
                value={values.confirmPassword}
                onChange={handleFieldChange}
                error={errors.confirmPassword}
              />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-elevated/50 p-4">
            <PasswordStrength password={values.newPassword} showChecklist />
          </div>
        </div>
      </FormSection>
    </form>
  );
}
