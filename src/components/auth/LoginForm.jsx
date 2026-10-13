"use client";

import { Mail } from "lucide-react";
import { useAuthForm } from "@/hooks/useAuthForm";
import AuthField from "./AuthField";
import FormAlert from "./FormAlert";
import PasswordField from "./PasswordField";
import SubmitButton from "./SubmitButton";

function validate({ email, password }) {
  const errors = {};
  if (!email.trim()) errors.email = "Enter your email address.";
  if (!password) errors.password = "Enter your password.";
  return errors;
}

export default function LoginForm() {
  const { values, errors, formError, isSubmitting, handleChange, handleSubmit } = useAuthForm({
    initialValues: { email: "", password: "" },
    endpoint: "/auth/login",
    validate,
  });

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <FormAlert message={formError} />

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

      <PasswordField
        id="password"
        label="Password"
        autoComplete="current-password"
        placeholder="Your password"
        value={values.password}
        onChange={handleChange}
        error={errors.password}
      />

      <SubmitButton isSubmitting={isSubmitting} submittingText="Logging in...">
        Log in
      </SubmitButton>
    </form>
  );
}
