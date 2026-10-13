"use client";

import { useState } from "react";
import { Mail, MailCheck } from "lucide-react";
import { useForm } from "@/hooks/useForm";
import { api } from "@/lib/api";
import AuthField from "./AuthField";
import FormAlert from "./FormAlert";
import SubmitButton from "./SubmitButton";

function validate({ email }) {
  return email.trim() ? {} : { email: "Enter your email address." };
}

export default function ForgotPasswordForm() {
  const [sentTo, setSentTo] = useState("");

  const { values, errors, formError, isSubmitting, handleChange, handleSubmit } = useForm({
    initialValues: { email: "" },
    validate,
    onSubmit: async ({ email }) => {
      await api("/auth/forgot-password", { method: "POST", body: { email } });
      setSentTo(email.trim());
    },
  });

  if (sentTo) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-accent/10 text-accent-text">
          <MailCheck className="size-6" />
        </span>
        <h2 className="mt-4 font-semibold">Check your email</h2>
        {/* The server answers the same either way, so we can't say whether the account exists */}
        <p className="mt-2 text-sm text-muted">
          If an account exists for <span className="font-semibold text-foreground">{sentTo}</span>, we&apos;ve sent
          a link to reset your password. It expires in 30 minutes.
        </p>
        <button
          type="button"
          onClick={() => setSentTo("")}
          className="mt-5 cursor-pointer text-sm font-semibold text-accent-text hover:underline"
        >
          Didn&apos;t get it? Try again
        </button>
      </div>
    );
  }

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

      <SubmitButton isSubmitting={isSubmitting} submittingText="Sending link...">
        Send reset link
      </SubmitButton>
    </form>
  );
}
