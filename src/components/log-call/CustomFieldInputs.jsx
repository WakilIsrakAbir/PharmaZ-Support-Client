import { Field, Select, inputClass } from "@/components/ui/FormControls";
import { cn } from "@/lib/utils";

/**
 * The product's extra form fields. `values` and `onChange` work by field key;
 * errors come from the server as "customFields.<key>".
 */
export default function CustomFieldInputs({ fields, values, errors, onChange, idPrefix = "field" }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {fields.map((field) => {
        const id = `${idPrefix}-${field.key}`;
        const error = errors[`customFields.${field.key}`];
        const value = values[field.key] ?? "";
        const inputProps = {
          id,
          value,
          onChange: (event) => onChange(field.key, event.target.value),
          "aria-invalid": Boolean(error),
          className: cn(inputClass, "aria-invalid:border-rose-500"),
        };

        return (
          <Field
            key={field.key}
            label={field.label}
            htmlFor={id}
            required={field.required}
            optional={!field.required}
            hint={field.isActive ? undefined : "(no longer in use)"}
            error={error}
          >
            {field.type === "select" ? (
              <Select {...inputProps}>
                <option value="">Choose one</option>
                {/* Keep an answer that's no longer one of the options */}
                {value && !field.options.includes(value) && <option value={value}>{value}</option>}
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            ) : field.type === "number" ? (
              <input type="number" step="any" inputMode="decimal" {...inputProps} />
            ) : field.type === "date" ? (
              <input type="date" {...inputProps} />
            ) : (
              <input type="text" maxLength={500} autoComplete="off" {...inputProps} />
            )}
          </Field>
        );
      })}
    </div>
  );
}

/** Saved answers (numbers included) as the strings the inputs hold. */
export function toInputValues(answers = {}) {
  return Object.fromEntries(Object.entries(answers).map(([key, value]) => [key, String(value)]));
}
