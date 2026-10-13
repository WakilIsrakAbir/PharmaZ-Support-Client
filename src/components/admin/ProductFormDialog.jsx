"use client";

import { useState } from "react";
import { ArrowRight, Check, Package, PackagePlus, ShieldCheck } from "lucide-react";
import FormAlert from "@/components/auth/FormAlert";
import SubmitButton from "@/components/auth/SubmitButton";
import { DialogBody, DialogFooter, secondaryButtonClass } from "@/components/ui/DialogParts";
import { Field, inputClass } from "@/components/ui/FormControls";
import Modal from "@/components/ui/Modal";
import NewAccountNotice from "@/components/users/NewAccountNotice";
import { productInitials } from "./ProductCard";
import { ROLES } from "@/config/roles";
import { ACCENT_COLORS } from "@/config/theme";
import { useForm } from "@/hooks/useForm";
import { api } from "@/lib/api";
import { timezoneQuery } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Creates a product with its first admin (`product` null), or edits a product's name,
 * description and colour.
 */
export default function ProductFormDialog({ product, isOpen, onClose, onSaved, onOpenProduct }) {
  const isNew = !product;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      icon={isNew ? PackagePlus : Package}
      title={isNew ? "Create a product" : `Edit ${product.name}`}
      subtitle={isNew ? "It gets its own team, setup and dashboard" : "Name, description and colour"}
      size="lg"
    >
      {isNew ? (
        <CreateProductForm onCancel={onClose} onSaved={onSaved} onOpenProduct={onOpenProduct} />
      ) : (
        <EditProductForm product={product} onCancel={onClose} onSaved={onSaved} />
      )}
    </Modal>
  );
}

function CreateProductForm({ onCancel, onSaved, onOpenProduct }) {
  // After saving, the dialog shows the new admin's sign-in details
  const [created, setCreated] = useState(null);

  const form = useForm({
    initialValues: { name: "", description: "", accentColor: "emerald", adminName: "", adminEmail: "" },
    validate: ({ name, adminEmail }) => ({
      ...(name.trim().length < 2 && { name: "Give the product a name (at least 2 characters)." }),
      ...(!adminEmail.trim() && { adminEmail: "Enter the admin's email address." }),
    }),
    onSubmit: async ({ adminName, adminEmail, ...product }) => {
      try {
        const result = await api(`/admin/products${timezoneQuery()}`, {
          method: "POST",
          body: { ...product, admin: { name: adminName, email: adminEmail } },
        });
        setCreated(result);
        onSaved(result.data);
      } catch (error) {
        // The server names the admin's fields "admin.name" / "admin.email"
        if (error.fields) {
          error.fields = Object.fromEntries(
            Object.entries(error.fields).map(([key, value]) => [
              { "admin.name": "adminName", "admin.email": "adminEmail" }[key] ?? key,
              value,
            ]),
          );
        }
        throw error;
      }
    },
  });

  if (created) {
    return (
      <>
        <DialogBody>
          <div className="flex items-center gap-3 rounded-xl bg-elevated/60 p-4">
            <span
              data-accent={created.data.accentColor}
              className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-sm font-bold text-white"
            >
              {productInitials(created.data.name)}
            </span>
            <div className="min-w-0">
              <p className="truncate font-semibold">{created.data.name} is ready</p>
              <p className="text-xs text-muted">Its admin can now set up problem areas and add support agents.</p>
            </div>
          </div>
          <NewAccountNotice
            user={created.admin.user}
            temporaryPassword={created.admin.temporaryPassword}
            roleLabel={ROLES.admin.label}
          />
        </DialogBody>
        <DialogFooter>
          <button type="button" onClick={onCancel} className={secondaryButtonClass}>
            Done
          </button>
          <button
            type="button"
            onClick={() => onOpenProduct(created.data)}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-accent-strong px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/30"
          >
            Open dashboard
            <ArrowRight className="size-4" />
          </button>
        </DialogFooter>
      </>
    );
  }

  return (
    <ProductFields form={form} onCancel={onCancel} submitText="Create product">
      <fieldset className="space-y-4 rounded-xl border border-border p-4">
        <legend className="flex items-center gap-2 px-1.5 text-sm font-semibold">
          <ShieldCheck className="size-4 text-accent-text" />
          First admin
        </legend>
        <p className="-mt-1 text-xs text-muted">
          They set the product up and add its support agents. If they don&apos;t have an account yet, one is made with
          a temporary password for you to pass on.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput form={form} name="adminName" label="Name" placeholder="e.g. Nusrat Jahan" optional />
          <TextInput form={form} name="adminEmail" label="Email" type="email" placeholder="admin@example.com" required />
        </div>
      </fieldset>
    </ProductFields>
  );
}

function EditProductForm({ product, onCancel, onSaved }) {
  const form = useForm({
    initialValues: { name: product.name, description: product.description ?? "", accentColor: product.accentColor },
    validate: ({ name }) => (name.trim().length < 2 ? { name: "Give the product a name (at least 2 characters)." } : {}),
    onSubmit: async (values) => {
      const { data } = await api(`/admin/products/${product.id}${timezoneQuery()}`, { method: "PATCH", body: values });
      onSaved(data);
      onCancel();
    },
  });

  return <ProductFields form={form} onCancel={onCancel} submitText="Save changes" />;
}

/** Name, description and colour, shared by both forms. `children` adds fields below. */
function ProductFields({ form, onCancel, submitText, children }) {
  const { values, errors, formError, isSubmitting, setValue, handleSubmit } = form;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
      <DialogBody>
        <FormAlert message={formError} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput form={form} name="name" label="Product name" placeholder="e.g. Clinic Desk" required />
          <TextInput form={form} name="description" label="Description" placeholder="What it is, in a few words" optional />
        </div>

        <Field label="Colour" error={errors.accentColor} help="The product's sidebar and buttons use it.">
          <div role="radiogroup" aria-label="Colour" className="flex flex-wrap gap-2">
            {ACCENT_COLORS.map((color) => {
              const isSelected = values.accentColor === color.value;
              return (
                <button
                  key={color.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setValue("accentColor", color.value)}
                  data-accent={color.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors",
                    isSelected ? "border-accent bg-accent/10 text-accent-text" : "border-border hover:border-accent/50",
                  )}
                >
                  <span className="grid size-4 place-items-center rounded-full bg-accent text-white">
                    {isSelected && <Check className="size-3" />}
                  </span>
                  {color.label}
                </button>
              );
            })}
          </div>
        </Field>

        {children}
      </DialogBody>

      <DialogFooter>
        <button type="button" onClick={onCancel} className={secondaryButtonClass}>
          Cancel
        </button>
        <SubmitButton isSubmitting={isSubmitting} submittingText="Saving..." icon={Check} fullWidth={false}>
          {submitText}
        </SubmitButton>
      </DialogFooter>
    </form>
  );
}

function TextInput({ form, name, label, required, optional, ...inputProps }) {
  const id = `product-${name}`;
  const error = form.errors[name];
  return (
    <Field label={label} htmlFor={id} required={required} optional={optional} error={error}>
      <input
        id={id}
        name={name}
        value={form.values[name]}
        onChange={form.handleChange}
        aria-invalid={Boolean(error)}
        autoComplete="off"
        className={cn(inputClass, "aria-invalid:border-rose-500")}
        {...inputProps}
      />
    </Field>
  );
}
