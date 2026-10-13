"use client";

import { Mail, UserRound } from "lucide-react";
import { useAuthForm } from "@/hooks/useAuthForm";
import AuthField from "./AuthField";
import FormAlert from "./FormAlert";
import PasswordField from "./PasswordField";
import SubmitButton from "./SubmitButton";

// The server checks these too; checking here just gives faster feedback.
function validate({ name, email, password, confirmPassword }) {
  const errors = {};
  if (name.trim().length < 2) errors.name = "Enter your name.";
  if (!email.trim()) errors.email = "Enter your email address.";
  if (password.length < 8) errors.password = "Use at least 8 characters.";
  if (confirmPassword !== password) errors.confirmPassword = "Passwords don't match.";
  return errors;
}

export default function RegisterForm() {
  const { values, errors, formError, isSubmitting, handleChange, handleSubmit } = useAuthForm({
    initialValues: { name: "", email: "", password: "", confirmPassword: "" },
    endpoint: "/auth/register",
    validate,
    // The API doesn't need the confirmation, only the password itself
    toBody: ({ name, email, password }) => ({ name, email, password }),
  });

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <FormAlert message={formError} />

      <AuthField
        id="name"
        label="Full name"
        icon={UserRound}
        autoComplete="name"
        placeholder="e.g. Wakil Israk Abir"
        value={values.name}
        onChange={handleChange}
        error={errors.name}
      />

      <AuthField
        id="email"
        label="Email"
        icon={Mail}
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={values.email}
        onChange={handleChange}
        error={errors.email}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <PasswordField
          id="password"
          label="Password"
          autoComplete="new-password"
          placeholder="8+ characters"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
        />
        <PasswordField
          id="confirmPassword"
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Type it again"
          value={values.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />
      </div>

      <SubmitButton isSubmitting={isSubmitting} submittingText="Creating account...">
        Create account
      </SubmitButton>
    </form>
  );
}
