"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { useForm } from "@/hooks/useForm";
import { api } from "@/lib/api";
import { getRedirectPath, goTo } from "@/lib/auth";
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

async function logIn(values) {
  await api("/auth/login", { method: "POST", body: values });
  await goTo(getRedirectPath());
}

export default function LoginForm() {
  const { values, errors, formError, isSubmitting, handleChange, handleSubmit } = useForm({
    initialValues: { email: "", password: "" },
    validate,
    onSubmit: logIn,
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
        labelAction={
          <Link href="/forgot-password" className="text-xs font-semibold text-accent-text hover:underline">
            Forgot password?
          </Link>
        }
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
