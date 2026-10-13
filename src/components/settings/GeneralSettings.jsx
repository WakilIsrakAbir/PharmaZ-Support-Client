"use client";

import { useState } from "react";
import { Check, Package } from "lucide-react";
import FormAlert from "@/components/auth/FormAlert";
import SubmitButton from "@/components/auth/SubmitButton";
import AccentOptions from "@/components/theme/AccentOptions";
import { Field, inputClass } from "@/components/ui/FormControls";
import FormSection from "@/components/ui/FormSection";
import { setCurrentUser, useCurrentUser } from "@/hooks/useCurrentUser";
import { useForm } from "@/hooks/useForm";
import { saveProductSetup } from "@/hooks/useProductSetup";

/** The product's name, description and colour. */
export default function GeneralSettings({ product }) {
  const user = useCurrentUser();
  const [notice, setNotice] = useState("");

  const { values, errors, formError, isSubmitting, handleChange, setValue, handleSubmit } = useForm({
    initialValues: { name: product.name, description: product.description ?? "", accentColor: product.accentColor },
    validate: ({ name }) => (name.trim() ? {} : { name: "Give the product a name." }),
    onSubmit: async (formValues) => {
      setNotice("");
      const { product: saved } = await saveProductSetup("", { method: "PATCH", body: formValues });
      // The sidebar shows the product's name, and the app uses its colour
      setCurrentUser({ ...user, product: { ...user.product, name: saved.name, accentColor: saved.accentColor } });
      setNotice("Saved.");
    },
  });

  function change(event) {
    handleChange(event);
    setNotice("");
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormSection
        icon={Package}
        title="Product"
        subtitle="How the product appears to its team"
        footer={
          <>
            <p className="text-xs text-muted">Product slug: {product.slug}</p>
            <SubmitButton isSubmitting={isSubmitting} submittingText="Saving..." icon={Check} fullWidth={false}>
              Save changes
            </SubmitButton>
          </>
        }
      >
        <FormAlert message={formError} />
        <FormAlert message={notice} tone="success" />

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Name" htmlFor="product-name" required error={errors.name}>
            <input
              id="product-name"
              name="name"
              maxLength={60}
              value={values.name}
              onChange={change}
              aria-invalid={Boolean(errors.name)}
              className={`${inputClass} aria-invalid:border-rose-500`}
            />
          </Field>
          <Field label="Description" htmlFor="product-description" optional error={errors.description}>
            <input
              id="product-description"
              name="description"
              maxLength={200}
              placeholder="e.g. Pharmacy management system"
              value={values.description}
              onChange={change}
              className={inputClass}
            />
          </Field>
        </div>

        <Field
          label="Colour"
          error={errors.accentColor}
          help="Used for everyone in the product who hasn't picked their own accent colour."
        >
          <AccentOptions
            value={values.accentColor}
            onChange={(accentColor) => {
              setValue("accentColor", accentColor);
              setNotice("");
            }}
            className="sm:grid-cols-3 lg:grid-cols-4"
          />
        </Field>
      </FormSection>
    </form>
  );
}
