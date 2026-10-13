"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { CircleCheck, Flag, ListChecks, LoaderCircle, PhoneCall, RotateCcw, Send, UserRound, X } from "lucide-react";
import FormAlert from "@/components/auth/FormAlert";
import { Field, Select, inputClass } from "@/components/ui/FormControls";
import FormSection from "@/components/ui/FormSection";
import { CALL_DIRECTIONS, OTHER_ISSUE } from "@/config/call-log";
import { useProductSetup } from "@/hooks/useProductSetup";
import { api } from "@/lib/api";
import { defaultKey } from "@/lib/product-setup";
import CallTimeBadge from "./CallTimeBadge";
import CustomFieldInputs from "./CustomFieldInputs";
import ProblemAreaPicker from "./ProblemAreaPicker";
import SegmentedControl from "./SegmentedControl";

const EMPTY_FORM = {
  mobile: "",
  customerId: "",
  transactionNo: "",
  area: "",
  issue: "",
  priority: "", // empty means the product's default
  direction: "inbound",
  status: "", // empty means the product's default
  duration: "",
  calledAt: "", // empty means "now"
  outcome: "",
  comments: "",
  customFields: {}, // answers to the product's extra fields, by key
};

// Bangladeshi mobile numbers: 01XXXXXXXXX, optionally starting with +88 or 88
const MOBILE_PATTERN = /^(\+?88)?01[3-9]\d{8}$/;
const DURATION_PATTERN = /^\d{1,3}:[0-5]\d$/;

function validate(form, fields) {
  const errors = {};
  const mobile = form.mobile.replace(/[\s-]/g, "");

  if (!mobile) {
    errors.mobile = "Enter the customer's mobile number.";
  } else if (!MOBILE_PATTERN.test(mobile)) {
    errors.mobile = "That doesn't look like a valid mobile number.";
  }

  if (form.duration && !DURATION_PATTERN.test(form.duration)) {
    errors.duration = "Use minutes and seconds, like 03:45.";
  }

  for (const field of fields) {
    if (field.required && !form.customFields[field.key]?.trim()) {
      errors[`customFields.${field.key}`] = `${field.label} is required.`;
    }
  }

  return errors;
}

/** The form's values in the shape POST /api/calls expects. */
function toRequestBody({ duration, calledAt, area, status, priority, customFields, ...form }) {
  const [minutes, seconds] = duration.split(":").map(Number);

  return {
    ...form,
    area: area || undefined,
    // Left empty, the server uses the product's defaults
    status: status || undefined,
    priority: priority || undefined,
    customFields: Object.fromEntries(Object.entries(customFields).filter(([, value]) => value.trim())),
    durationSeconds: duration ? minutes * 60 + seconds : undefined,
    // The picker gives local time ("2026-10-13T15:20"). Left empty, the server uses "now".
    calledAt: calledAt ? new Date(calledAt).toISOString() : undefined,
  };
}

export default function LogCallForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loggedCall, setLoggedCall] = useState(null);
  const mobileRef = useRef(null);
  const { setup, error: setupError } = useProductSetup();

  // New calls can only use what's switched on
  const areas = setup?.areas.filter((area) => area.isActive) ?? null;
  const priorities = setup?.priorities.filter((option) => option.isActive) ?? [];
  const statuses = setup?.statuses.filter((option) => option.isActive) ?? [];
  const fields = setup?.customFields.filter((field) => field.isActive) ?? [];
  const selectedArea = areas?.find((area) => area.id === form.area);
  const issues = selectedArea
    ? [...selectedArea.issues.filter((issue) => issue.isActive).map((issue) => issue.label), OTHER_ISSUE]
    : [];

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  }

  function updateAnswer(key, value) {
    setForm((current) => ({ ...current, customFields: { ...current.customFields, [key]: value } }));
    const name = `customFields.${key}`;
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  }

  function selectArea(area) {
    // A new area has a different list of issues, so clear the old pick.
    setForm((current) => ({ ...current, area, issue: "" }));
  }

  function clearForm() {
    setForm(EMPTY_FORM);
    setErrors({});
    setFormError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const newErrors = validate(form, fields);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.mobile) mobileRef.current?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await api("/calls", { method: "POST", body: toRequestBody(form) });
      setLoggedCall(data);
      clearForm();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      // The server calls the duration "durationSeconds"; the form calls it "duration"
      const { durationSeconds, ...serverErrors } = error.fields ?? {};
      if (durationSeconds) serverErrors.duration = durationSeconds;

      // Problems with a field that has no error slot (e.g. calledAt) go above the form
      // ("customFields.branch" has its own slot under the Details section)
      const hiddenField = Object.keys(serverErrors).find((name) => !(name.split(".")[0] in EMPTY_FORM));

      setErrors(serverErrors);
      if (hiddenField) setFormError(serverErrors[hiddenField]);
      else if (Object.keys(serverErrors).length === 0) setFormError(error.message);
    }

    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Stays at the top while scrolling (under the phone top bar), so "Log call" is always in reach */}
      <div className="sticky top-16 z-30 -mt-4 lg:top-0 flex flex-wrap items-end justify-between gap-4 border-b border-border bg-background/90 pb-5 pt-4 backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Log a Call</h1>
          <p className="mt-1 text-sm text-muted">Capture the customer and the call details.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearForm}
            className="flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-muted transition-colors hover:bg-elevated hover:text-foreground"
          >
            <RotateCcw className="size-4" />
            Clear
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-accent-strong px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/30 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-wait disabled:opacity-80 disabled:hover:translate-y-0"
          >
            {isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />}
            {isSubmitting ? "Logging..." : "Log call"}
          </button>
        </div>
      </div>

      <FormAlert message={formError || (setupError && `Couldn't load the product setup: ${setupError}`)} />

      {loggedCall && (
        <div
          role="status"
          className="flex flex-wrap items-center gap-3 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm"
        >
          <CircleCheck className="size-5 shrink-0 text-accent-text" />
          <p className="flex-1">
            <span className="font-semibold">Call logged</span> for {loggedCall.mobile}
            {loggedCall.issue && <span className="text-muted"> · {loggedCall.issue}</span>}
          </p>
          <Link href="/calls/logs" className="font-semibold text-accent-text hover:underline">
            View in Call Logs
          </Link>
          <button
            type="button"
            onClick={() => setLoggedCall(null)}
            aria-label="Dismiss"
            className="grid size-7 cursor-pointer place-items-center rounded-lg text-muted hover:bg-elevated"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      <div className="space-y-6">
        <FormSection icon={UserRound} title="Customer" subtitle="Who reached out">
          <div className="grid gap-5 md:grid-cols-3">
            <Field
              label="Mobile"
              htmlFor="mobile"
              required
              hint={fields.some((field) => field.required) ? undefined : "the only field this form requires"}
              error={errors.mobile}
            >
              <input
                ref={mobileRef}
                id="mobile"
                type="tel"
                inputMode="tel"
                autoComplete="off"
                placeholder="+8801XXXXXXXXX"
                value={form.mobile}
                onChange={(event) => updateField("mobile", event.target.value)}
                aria-invalid={Boolean(errors.mobile)}
                className={`${inputClass} font-mono aria-invalid:border-rose-500`}
              />
            </Field>
            <Field label="Customer ID" htmlFor="customerId" optional error={errors.customerId}>
              <input
                id="customerId"
                placeholder="e.g. PZ004182"
                value={form.customerId}
                onChange={(event) => updateField("customerId", event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Invoice / Transaction no." htmlFor="transactionNo" optional error={errors.transactionNo}>
              <input
                id="transactionNo"
                placeholder="e.g. INV00418203"
                value={form.transactionNo}
                onChange={(event) => updateField("transactionNo", event.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
        </FormSection>

        <FormSection
          icon={Flag}
          title="Problem"
          subtitle={`Which part of ${setup?.product.name ?? "the product"} they need help with`}
        >
          <ProblemAreaPicker areas={areas} value={form.area} onChange={selectArea} />

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Issue" htmlFor="issue" optional error={errors.issue ?? errors.area}>
              <Select
                id="issue"
                value={form.issue}
                onChange={(event) => updateField("issue", event.target.value)}
                disabled={!selectedArea}
                className="disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">{selectedArea ? "Choose the issue" : "Pick a problem area first"}</option>
                {issues.map((issue) => (
                  <option key={issue} value={issue}>
                    {issue}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Priority" error={errors.priority}>
              <SegmentedControl
                label="Priority"
                options={priorities.map((option) => ({ value: option.key, label: option.label }))}
                value={form.priority || defaultKey(priorities)}
                onChange={(value) => updateField("priority", value)}
              />
            </Field>
          </div>
        </FormSection>

        <FormSection
          icon={PhoneCall}
          title="Call"
          subtitle="What happened on the call"
          action={<CallTimeBadge value={form.calledAt} onChange={(value) => updateField("calledAt", value)} />}
        >
          <div className="grid gap-5 md:grid-cols-3">
            <Field label="Direction">
              <SegmentedControl
                label="Direction"
                options={CALL_DIRECTIONS}
                value={form.direction}
                onChange={(value) => updateField("direction", value)}
              />
            </Field>
            <Field label="Status" htmlFor="status" error={errors.status}>
              <Select
                id="status"
                value={form.status || defaultKey(statuses)}
                onChange={(event) => updateField("status", event.target.value)}
              >
                {statuses.map((status) => (
                  <option key={status.key} value={status.key}>
                    {status.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Duration" htmlFor="duration" hint="(mm:ss)" error={errors.duration}>
              <input
                id="duration"
                inputMode="numeric"
                placeholder="03:45"
                value={form.duration}
                onChange={(event) => updateField("duration", event.target.value)}
                aria-invalid={Boolean(errors.duration)}
                className={`${inputClass} aria-invalid:border-rose-500`}
              />
            </Field>
          </div>

          <Field label="Outcome" htmlFor="outcome" optional error={errors.outcome}>
            <textarea
              id="outcome"
              rows={2}
              placeholder="e.g. Stock re-synced; customer confirmed the count matches"
              value={form.outcome}
              onChange={(event) => updateField("outcome", event.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Comments" htmlFor="comments" optional error={errors.comments}>
            <textarea
              id="comments"
              rows={3}
              placeholder="What was the call about and how was it handled?"
              value={form.comments}
              onChange={(event) => updateField("comments", event.target.value)}
              className={inputClass}
            />
          </Field>
        </FormSection>

        {fields.length > 0 && (
          <FormSection icon={ListChecks} title="Details" subtitle={`What ${setup.product.name} also asks for`}>
            <CustomFieldInputs fields={fields} values={form.customFields} errors={errors} onChange={updateAnswer} />
          </FormSection>
        )}
      </div>
    </form>
  );
}
