import { useState } from "react";
import { api } from "@/lib/api";
import { getRedirectPath } from "@/lib/auth";

/**
 * Shared logic for the login and register forms.
 *
 * - `validate(values)` returns { field: message } for anything wrong before sending.
 * - `toBody(values)` picks what is sent to `endpoint` (e.g. drops "confirm password").
 */
export function useAuthForm({ initialValues, endpoint, validate, toBody = (values) => values }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
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
      await api(endpoint, { method: "POST", body: toBody(values) });
      // A full page load, so proxy.js sees the new login cookie straight away
      window.location.assign(getRedirectPath());
    } catch (error) {
      // Field problems show under each field, anything else above the form
      if (Object.keys(error.fields ?? {}).length > 0) {
        setErrors(error.fields);
      } else {
        setFormError(error.message);
      }
      setIsSubmitting(false);
    }
  }

  return { values, errors, formError, isSubmitting, handleChange, handleSubmit };
}
