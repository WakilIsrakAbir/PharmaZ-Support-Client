"use client";

import { HOME_PATH } from "@/config/routes";
import { useForm } from "@/hooks/useForm";
import { api } from "@/lib/api";
import { goTo } from "@/lib/auth";
import FormAlert from "./FormAlert";
import PasswordField from "./PasswordField";
import PasswordStrength from "./PasswordStrength";
import SubmitButton from "./SubmitButton";

function validate({ password, confirmPassword }) {
  const errors = {};
  if (password.length < 8) errors.password = "Use at least 8 characters.";
  if (confirmPassword !== password) errors.confirmPassword = "Passwords don't match.";
  return errors;
}

async function resetPassword({ password }) {
  // The token comes from the link in the email: /reset-password?token=...
  const token = new URLSearchParams(window.location.search).get("token") ?? "";

  // The server logs the user in, so go straight to the app
  await api("/auth/reset-password", { method: "POST", body: { token, password } });
  await goTo(HOME_PATH);
}

export default function ResetPasswordForm() {
  const { values, errors, formError, isSubmitting, handleChange, handleSubmit } = useForm({
    initialValues: { password: "", confirmPassword: "" },
    validate,
    onSubmit: resetPassword,
  });

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <FormAlert message={formError} />

      <PasswordField
        id="password"
        label="New password"
        autoComplete="new-password"
        placeholder="8+ characters"
        value={values.password}
        onChange={handleChange}
        error={errors.password}
      />

      <PasswordStrength password={values.password} />

      <PasswordField
        id="confirmPassword"
        label="Confirm new password"
        autoComplete="new-password"
        placeholder="Type it again"
        value={values.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
      />

      <SubmitButton isSubmitting={isSubmitting} submittingText="Saving...">
        Save new password
      </SubmitButton>
    </form>
  );
}
