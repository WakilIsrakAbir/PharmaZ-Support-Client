"use client";

import { useState } from "react";
import { LoaderCircle, ShieldCheck, ShieldMinus, UserPlus } from "lucide-react";
import FormAlert from "@/components/auth/FormAlert";
import SubmitButton from "@/components/auth/SubmitButton";
import { DialogBody, DialogFooter, secondaryButtonClass } from "@/components/ui/DialogParts";
import { Field, inputClass } from "@/components/ui/FormControls";
import Modal from "@/components/ui/Modal";
import NewAccountNotice from "@/components/users/NewAccountNotice";
import { ROLES } from "@/config/roles";
import { useForm } from "@/hooks/useForm";
import { api } from "@/lib/api";
import { timezoneQuery } from "@/lib/format";
import { getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

/** The super admin chooses who runs a product: add admins, or stop someone being one. */
export default function AdminsDialog({ product, isOpen, onClose, onUpdated }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      icon={ShieldCheck}
      title={product ? `${product.name} admins` : "Admins"}
      subtitle="They set the product up and manage its support agents"
      size="lg"
    >
      {product && <AdminsManager product={product} onClose={onClose} onUpdated={onUpdated} />}
    </Modal>
  );
}

function AdminsManager({ product, onClose, onUpdated }) {
  const [added, setAdded] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [error, setError] = useState("");

  const form = useForm({
    initialValues: { name: "", email: "" },
    validate: ({ email }) => (email.trim() ? {} : { email: "Enter their email address." }),
    onSubmit: async (values) => {
      setAdded(null);
      const { data, admin } = await api(`/admin/products/${product.id}/admins${timezoneQuery()}`, { method: "POST", body: values });
      onUpdated(data);
      setAdded(admin);
      form.reset();
    },
  });

  async function removeAdmin(admin) {
    setError("");
    setRemovingId(admin.id);
    try {
      const { data } = await api(`/admin/products/${product.id}/admins/${admin.id}${timezoneQuery()}`, { method: "DELETE" });
      onUpdated(data);
      setConfirmId(null);
    } catch (requestError) {
      setError(requestError.message);
    }
    setRemovingId(null);
  }

  return (
    <>
      <DialogBody>
        <FormAlert message={error} />

        <section>
          <h3 className="mb-2 text-sm font-semibold">
            Current admins <span className="font-normal text-muted">· {product.adminCount}</span>
          </h3>
          {product.admins.length === 0 ? (
            <p className="rounded-xl border border-dashed border-amber-500/40 bg-amber-500/5 px-4 py-4 text-sm text-amber-500">
              This product has no admin yet. Add one below so someone can set it up.
            </p>
          ) : (
            <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
              {product.admins.map((admin) => (
                <li key={admin.id} className="flex items-center gap-3 px-4 py-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-indigo-500/10 text-[11px] font-bold text-indigo-500">
                    {getInitials(admin.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{admin.name}</p>
                    <p className="truncate text-xs text-muted">
                      {admin.email}
                      {admin.mustChangePassword && <span className="text-amber-500"> · hasn&apos;t signed in yet</span>}
                    </p>
                  </div>
                  {confirmId === admin.id ? (
                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setConfirmId(null)}
                        className="cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-semibold text-muted hover:bg-elevated"
                      >
                        Keep
                      </button>
                      <button
                        type="button"
                        onClick={() => removeAdmin(admin)}
                        disabled={removingId !== null}
                        className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-rose-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:cursor-wait"
                      >
                        {removingId === admin.id && <LoaderCircle className="size-3.5 animate-spin" />}
                        Make agent
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmId(admin.id)}
                      title="They stay in the product as a support agent"
                      className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-muted transition-colors hover:bg-rose-500/10 hover:text-rose-500"
                    >
                      <ShieldMinus className="size-3.5" />
                      <span className="max-sm:sr-only">Remove admin</span>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <form id="add-admin-form" onSubmit={form.handleSubmit} noValidate className="space-y-4">
          <h3 className="text-sm font-semibold">Add an admin</h3>
          <FormAlert message={form.formError} />
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminInput form={form} name="name" label="Name" placeholder="Needed for a new account" optional />
            <AdminInput form={form} name="email" label="Email" type="email" placeholder="person@example.com" required />
          </div>
          <p className="text-xs text-muted">
            A support agent already in {product.name} is made an admin. Anyone without an account gets one with a
            temporary password.
          </p>
        </form>

        {added && <NewAccountNotice user={added.user} temporaryPassword={added.temporaryPassword} roleLabel={ROLES.admin.label} />}
      </DialogBody>

      <DialogFooter>
        <button type="button" onClick={onClose} className={secondaryButtonClass}>
          Done
        </button>
        {/* In the footer, outside the <form>, so it points at it by id */}
        <SubmitButton
          form="add-admin-form"
          isSubmitting={form.isSubmitting}
          submittingText="Adding..."
          icon={UserPlus}
          fullWidth={false}
        >
          Add admin
        </SubmitButton>
      </DialogFooter>
    </>
  );
}

function AdminInput({ form, name, label, required, optional, ...inputProps }) {
  const id = `admin-${name}`;
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
