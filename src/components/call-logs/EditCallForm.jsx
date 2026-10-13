import { Check } from "lucide-react";
import FormAlert from "@/components/auth/FormAlert";
import SubmitButton from "@/components/auth/SubmitButton";
import CustomFieldInputs, { toInputValues } from "@/components/log-call/CustomFieldInputs";
import { Field, Select, inputClass } from "@/components/ui/FormControls";
import { useForm } from "@/hooks/useForm";
import { useProductSetup } from "@/hooks/useProductSetup";
import { api } from "@/lib/api";
import { fieldsWithAnswers, selectableOptions } from "@/lib/product-setup";
import { DialogBody, DialogFooter, secondaryButtonClass } from "@/components/ui/DialogParts";

/** Changes how a call ended up, its notes and its extra fields. Who, when and what can't change. */
export default function EditCallForm({ call, onCancel, onSaved }) {
  const { setup } = useProductSetup();
  const savedAnswers = toInputValues(call.customFields);
  const fields = fieldsWithAnswers(setup?.customFields, call.customFields);

  const { values, errors, formError, isSubmitting, handleChange, setValue, handleSubmit } = useForm({
    initialValues: {
      status: call.status ?? "",
      priority: call.priority ?? "",
      outcome: call.outcome ?? "",
      comments: call.comments ?? "",
      customFields: savedAnswers,
    },
    onSubmit: async ({ customFields, ...formValues }) => {
      const body = { ...formValues, ...changedAnswers(savedAnswers, customFields) };
      const { data } = await api(`/calls/${call.id}`, { method: "PATCH", body });
      onSaved(data);
    },
  });

  return (
    <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
      <DialogBody>
        <FormAlert message={formError} />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Status" htmlFor="edit-status" error={errors.status}>
            <OptionSelect
              id="edit-status"
              name="status"
              value={values.status}
              options={setup?.statuses}
              onChange={handleChange}
            />
          </Field>
          <Field label="Priority" htmlFor="edit-priority" error={errors.priority}>
            <OptionSelect
              id="edit-priority"
              name="priority"
              value={values.priority}
              options={setup?.priorities}
              onChange={handleChange}
            />
          </Field>
        </div>

        {fields.length > 0 && (
          <CustomFieldInputs
            idPrefix="edit-field"
            fields={fields}
            values={values.customFields}
            errors={errors}
            onChange={(key, value) =>
              setValue("customFields", { ...values.customFields, [key]: value }, `customFields.${key}`)
            }
          />
        )}

        <Field label="Outcome" htmlFor="edit-outcome" optional error={errors.outcome}>
          <textarea
            id="edit-outcome"
            name="outcome"
            rows={2}
            placeholder="How did it end?"
            value={values.outcome}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>

        <Field label="Comments" htmlFor="edit-comments" optional error={errors.comments}>
          <textarea
            id="edit-comments"
            name="comments"
            rows={4}
            placeholder="Anything the next person should know"
            value={values.comments}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>
      </DialogBody>

      <DialogFooter>
        <button type="button" onClick={onCancel} className={secondaryButtonClass}>
          Cancel
        </button>
        <SubmitButton isSubmitting={isSubmitting} submittingText="Saving..." icon={Check} fullWidth={false}>
          Save changes
        </SubmitButton>
      </DialogFooter>
    </form>
  );
}

/** A status or priority picker. A call can keep an option that has since been switched off. */
function OptionSelect({ value, options, ...props }) {
  return (
    <Select value={value} {...props}>
      {!value && <option value="">Not set</option>}
      {selectableOptions(options, value).map((option) => (
        <option key={option.key} value={option.key}>
          {option.isActive ? option.label : `${option.label} (no longer in use)`}
        </option>
      ))}
    </Select>
  );
}

/**
 * Only the answers that changed are sent, so a call logged before a field became
 * required can still be updated. An emptied answer is sent as null, which clears it.
 */
function changedAnswers(saved, edited) {
  const changed = Object.entries(edited).filter(([key, value]) => value !== (saved[key] ?? ""));
  if (changed.length === 0) return {};
  return { customFields: Object.fromEntries(changed.map(([key, value]) => [key, value === "" ? null : value])) };
}
