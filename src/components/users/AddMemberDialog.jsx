"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import FormAlert from "@/components/auth/FormAlert";
import SubmitButton from "@/components/auth/SubmitButton";
import { DialogBody, DialogFooter, secondaryButtonClass } from "@/components/ui/DialogParts";
import { Field, inputClass } from "@/components/ui/FormControls";
import Modal from "@/components/ui/Modal";
import { ROLES } from "@/config/roles";
import { useForm } from "@/hooks/useForm";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import NewAccountNotice from "./NewAccountNotice";

/**
 * Adds a support agent to this product. Someone without an account gets one, with a
 * temporary password shown here once.
 */
export default function AddMemberDialog({ isOpen, onClose, onAdded }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      icon={UserPlus}
      title="Add a support agent"
      subtitle="They can log calls and see this product's call logs"
    >
      <AddMemberForm onClose={onClose} onAdded={onAdded} />
    </Modal>
  );
}

function AddMemberForm({ onClose, onAdded }) {
  const [added, setAdded] = useState(null);

  const { values, errors, formError, isSubmitting, handleChange, handleSubmit } = useForm({
    initialValues: { name: "", email: "" },
    validate: ({ email }) => (email.trim() ? {} : { email: "Enter their email address." }),
    onSubmit: async (formValues) => {
      const result = await api("/users", { method: "POST", body: formValues });
      setAdded(result);
      onAdded(result.data);
    },
  });

  if (added) {
    return (
      <>
        <DialogBody>
          <NewAccountNotice user={added.data} temporaryPassword={added.temporaryPassword} roleLabel={ROLES.agent.label} />
        </DialogBody>
        <DialogFooter>
          <button type="button" onClick={onClose} className={secondaryButtonClass}>
            Done
          </button>
        </DialogFooter>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
      <DialogBody>
        <FormAlert message={formError} />
        <Field label="Name" htmlFor="member-name" optional error={errors.name} help="Needed when they don't have an account yet.">
          <input
            id="member-name"
            name="name"
            autoComplete="off"
            placeholder="e.g. Karim Uddin"
            value={values.name}
            onChange={handleChange}
            aria-invalid={Boolean(errors.name)}
            className={cn(inputClass, "aria-invalid:border-rose-500")}
          />
        </Field>
        <Field label="Email" htmlFor="member-email" required error={errors.email}>
          <input
            id="member-email"
            name="email"
            type="email"
            autoComplete="off"
            placeholder="person@example.com"
            value={values.email}
            onChange={handleChange}
            aria-invalid={Boolean(errors.email)}
            className={cn(inputClass, "aria-invalid:border-rose-500")}
          />
        </Field>
      </DialogBody>
      <DialogFooter>
        <button type="button" onClick={onClose} className={secondaryButtonClass}>
          Cancel
        </button>
        <SubmitButton isSubmitting={isSubmitting} submittingText="Adding..." icon={UserPlus} fullWidth={false}>
          Add agent
        </SubmitButton>
      </DialogFooter>
    </form>
  );
}
