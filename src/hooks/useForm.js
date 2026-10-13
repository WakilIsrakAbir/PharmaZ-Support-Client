import { useState } from "react";

/**
 * State and submit handling shared by every form that talks to the API.
 *
 * - `validate(values)` returns { field: message } for anything wrong before sending.
 * - `onSubmit(values)` does the work. If it throws an ApiError, the server's field
 *   messages show under each field and anything else shows above the form.
 */
export function useForm({ initialValues, validate = () => ({}), onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    setValue(event.target.name, event.target.value);
  }

  /** For values that aren't a plain input, e.g. setValue("customFields", {...}). */
  function setValue(name, value, errorName = name) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [errorName]: undefined }));
  }

  function reset(newValues = initialValues) {
    setValues(newValues);
    setErrors({});
    setFormError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const newErrors = validate(values);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(values);
    } catch (error) {
      const fields = error.fields ?? {};
      // A problem with something that isn't a visible field (e.g. a reset link) goes on top.
      // "customFields.branch" belongs to the customFields value.
      const hiddenField = Object.keys(fields).find((name) => !(name.split(".")[0] in values));

      setErrors(fields);
      if (hiddenField) setFormError(fields[hiddenField]);
      else if (Object.keys(fields).length === 0) setFormError(error.message);
    }

    setIsSubmitting(false);
  }

  return { values, errors, formError, isSubmitting, handleChange, setValue, handleSubmit, reset };
}
