"use client";

import { KeyRound } from "lucide-react";
import FormAlert from "./FormAlert";
import PasswordField from "./PasswordField";
import PasswordStrength from "./PasswordStrength";
import SubmitButton from "./SubmitButton";
import { updateCurrentAccount } from "@/hooks/useCurrentUser";
import { useForm } from "@/hooks/useForm";
import { api } from "@/lib/api";

function validate({ currentPassword, newPassword, confirmPassword }) {
  const errors = {};
  if (!currentPassword) errors.currentPassword = "Enter the temporary password you were given.";
  if (newPassword.length < 8) errors.newPassword = "Use at least 8 characters.";
  else if (newPassword === currentPassword) errors.newPassword = "Choose a password of your own.";
  if (confirmPassword !== newPassword) errors.confirmPassword = "Passwords don't match.";
  return errors;
}

/**
 * Replaces the temporary password an admin gave out. Once saved, the server clears
 * mustChangePassword and the app opens.
 */
export default function SetPasswordForm() {
  const { values, errors, formError, isSubmitting, handleChange, handleSubmit } = useForm({
    initialValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
    validate,
    onSubmit: async ({ currentPassword, newPassword }) => {
      const { data } = await api("/auth/me/password", { method: "PATCH", body: { currentPassword, newPassword } });
      updateCurrentAccount(data);
    },
  });

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <FormAlert message={formError} />

      <PasswordField
        id="currentPassword"
        label="Temporary password"
        autoComplete="current-password"
        placeholder="The one your admin gave you"
        value={values.currentPassword}
        onChange={handleChange}
        error={errors.currentPassword}
      />
      <PasswordField
        id="newPassword"
        label="New password"
        autoComplete="new-password"
        placeholder="8+ characters"
        value={values.newPassword}
        onChange={handleChange}
        error={errors.newPassword}
      />
      <PasswordStrength password={values.newPassword} />
      <PasswordField
        id="confirmPassword"
        label="Confirm new password"
        autoComplete="new-password"
        placeholder="Type it again"
        value={values.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
      />

      <SubmitButton isSubmitting={isSubmitting} submittingText="Saving..." icon={KeyRound}>
        Set password and continue
      </SubmitButton>
    </form>
  );
}
