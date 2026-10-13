"use client";

import { useState } from "react";
import { Check, CircleCheck, IdCard } from "lucide-react";
import FormAlert from "@/components/auth/FormAlert";
import SubmitButton from "@/components/auth/SubmitButton";
import { Field, inputClass } from "@/components/ui/FormControls";
import FormSection from "@/components/ui/FormSection";
import { ROLES } from "@/config/roles";
import { setCurrentUser } from "@/hooks/useCurrentUser";
import { useForm } from "@/hooks/useForm";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

// Bangladeshi mobile numbers: 01XXXXXXXXX, optionally starting with +88 or 88
const PHONE_PATTERN = /^(\+?88)?01[3-9]\d{8}$/;

function validate({ name, email, phone }) {
  const errors = {};
  if (name.trim().length < 2) errors.name = "Enter your name.";
  if (!email.trim()) errors.email = "Enter your email address.";
  if (phone.trim() && !PHONE_PATTERN.test(phone.replace(/[\s-]/g, ""))) {
    errors.phone = "Enter a valid mobile number, like 01712-345678.";
  }
  return errors;
}

const toFormValues = (user) => ({ name: user.name, email: user.email, phone: user.phone ?? "" });

export default function DetailsForm({ user }) {
  const [isSaved, setIsSaved] = useState(false);
  const savedValues = toFormValues(user);

  const { values, errors, formError, isSubmitting, handleChange, handleSubmit, reset } = useForm({
    initialValues: savedValues,
    validate,
    onSubmit: async (formValues) => {
      const { data } = await api("/auth/me", { method: "PATCH", body: formValues });
      setCurrentUser(data); // the navbar picks up the new name too
      reset(toFormValues(data)); // the server trims and lowercases, so show what it stored
      setIsSaved(true);
    },
  });

  const hasChanges = Object.keys(savedValues).some((key) => values[key] !== savedValues[key]);

  const footer = (
    <>
      <FooterStatus hasChanges={hasChanges} isSaved={isSaved} />
      <div className="flex gap-2">
        {hasChanges && (
          <button
            type="button"
            onClick={() => reset(savedValues)}
            className="cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold text-muted transition-colors hover:bg-elevated hover:text-foreground"
          >
            Discard
          </button>
        )}
        <SubmitButton
          isSubmitting={isSubmitting}
          disabled={!hasChanges}
          submittingText="Saving..."
          icon={Check}
          fullWidth={false}
        >
          Save changes
        </SubmitButton>
      </div>
    </>
  );

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormSection
        icon={IdCard}
        title="Your details"
        subtitle="How you appear on the calls you log and the audits you show up in."
        footer={footer}
      >
        <FormAlert message={formError} />

        <div className="grid gap-5 md:grid-cols-2">
          <TextField
            id="name"
            label="Full name"
            autoComplete="name"
            value={values.name}
            onChange={handleChange}
            error={errors.name}
          />
          <TextField
            id="email"
            label="Email address"
            type="email"
            autoComplete="email"
            help="You sign in with this address."
            value={values.email}
            onChange={handleChange}
            error={errors.email}
          />
          <TextField
            id="phone"
            label="Phone number"
            optional
            type="tel"
            autoComplete="tel"
            placeholder="01XXX-XXXXXX"
            help="How colleagues reach you internally."
            value={values.phone}
            onChange={handleChange}
            error={errors.phone}
          />
          <TextField id="role" label="Role" help="Set by an administrator." value={ROLES[user.role].label} disabled />
        </div>
      </FormSection>
    </form>
  );
}

function TextField({ id, label, optional, help, error, ...inputProps }) {
  return (
    <Field label={label} htmlFor={id} optional={optional} help={help} error={error}>
      <input
        id={id}
        name={id}
        aria-invalid={Boolean(error)}
        className={cn(inputClass, "aria-invalid:border-rose-500 disabled:cursor-not-allowed disabled:opacity-60")}
        {...inputProps}
      />
    </Field>
  );
}

function FooterStatus({ hasChanges, isSaved }) {
  if (hasChanges) {
    return (
      <p className="flex items-center gap-2 text-sm text-amber-500">
        <span className="size-2 rounded-full bg-amber-500" />
        You have unsaved changes.
      </p>
    );
  }

  if (isSaved) {
    return (
      <p role="status" className="flex items-center gap-2 text-sm text-[light-dark(#047857,#34d399)]">
        <CircleCheck className="size-4" />
        Changes saved.
      </p>
    );
  }

  return <p className="text-sm text-muted">Everything here is saved.</p>;
}
