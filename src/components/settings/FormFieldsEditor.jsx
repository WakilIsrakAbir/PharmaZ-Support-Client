"use client";

import { useState } from "react";
import { Plus, TextCursorInput, X } from "lucide-react";
import FormAlert from "@/components/auth/FormAlert";
import FormSection from "@/components/ui/FormSection";
import { Select, inputClass } from "@/components/ui/FormControls";
import Switch from "@/components/ui/Switch";
import { saveProductSetup } from "@/hooks/useProductSetup";
import { cn } from "@/lib/utils";
import { IconButton, MoveButtons, SaveBar, SwitchedOffList, listError, rowError } from "./ListParts";
import { useDraftList } from "./useDraftList";

const FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "select", label: "Dropdown" },
  { value: "date", label: "Date" },
];

// While editing, a dropdown's options are one per line in a text box
const toDraft = ({ key, label, type, options, required, isActive }) => ({
  key,
  label,
  type,
  optionsText: options.join("\n"),
  required,
  isActive,
});

const toOptions = (text) =>
  text
    .split("\n")
    .map((option) => option.trim())
    .filter(Boolean);

const toRequestField = ({ optionsText, ...field }) => ({
  ...field,
  options: field.type === "select" ? toOptions(optionsText) : [],
});

/** Extra questions on the Log a Call form, saved with each call. */
export default function FormFieldsEditor({ saved }) {
  const draft = useDraftList(saved.map(toDraft));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const active = draft.rows.filter((row) => row.isActive);
  const switchedOff = draft.rows.filter((row) => !row.isActive);

  function edit(row, changes) {
    draft.update(row.uid, changes);
    setNotice("");
  }

  // A field that was never saved is simply removed; a saved one is switched off
  function switchOff(row) {
    draft.setRows((rows) => {
      const rest = rows.filter((item) => item.uid !== row.uid);
      return row.key ? [...rest, { ...row, isActive: false }] : rest;
    });
    setNotice("");
  }

  function switchOn(row) {
    draft.setRows((rows) => {
      const rest = rows.filter((item) => item.uid !== row.uid);
      return [
        ...rest.filter((item) => item.isActive),
        { ...row, isActive: true },
        ...rest.filter((item) => !item.isActive),
      ];
    });
    setNotice("");
  }

  function checkRows(rows) {
    const found = {};
    rows.forEach((row, index) => {
      if (!row.label.trim()) found[`customFields.${index}.label`] = "Give the field a name.";
      else if (row.type === "select" && toOptions(row.optionsText).length === 0) {
        found[`customFields.${index}.options`] = "A dropdown needs at least one option.";
      }
    });
    return found;
  }

  async function save(event) {
    event.preventDefault();
    setFormError("");
    setNotice("");

    const rows = draft.toSaved();
    const found = checkRows(rows);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setIsSaving(true);
    try {
      const setup = await saveProductSetup("/custom-fields", { body: { customFields: rows.map(toRequestField) } });
      draft.reset(setup.customFields.map(toDraft));
      setNotice("Saved. The Log a Call form shows these straight away.");
    } catch (error) {
      setErrors(error.fields ?? {});
      setFormError(listError(error.fields, "customFields", rows.length) ?? (error.fields ? "" : error.message));
    }
    setIsSaving(false);
  }

  return (
    <form onSubmit={save} noValidate>
      <FormSection
        icon={TextCursorInput}
        title="Extra form fields"
        subtitle="Questions the Log a Call form asks on top of the usual ones"
        footer={
          <SaveBar
            isDirty={draft.isDirty}
            isSaving={isSaving}
            onDiscard={() => {
              draft.reset();
              setErrors({});
              setFormError("");
            }}
            note="A field's type is fixed once saved. Switched-off fields keep their answers on older calls."
          />
        }
      >
        <FormAlert message={formError} />
        <FormAlert message={notice} tone="success" />

        {active.length === 0 && (
          <p className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted">
            No extra fields yet. Add one to ask for something specific to this product, like a branch or an order
            amount.
          </p>
        )}

        <ul className="space-y-3">
          {active.map((row, index) => {
            const error = rowError(errors, "customFields", draft.rows.indexOf(row));
            return (
              <li key={row.uid} className="rounded-xl border border-border bg-background/40 p-3">
                <div className="flex items-start gap-2">
                  <div className="pt-0.5">
                    <MoveButtons
                      name={row.label || "new field"}
                      index={index}
                      count={active.length}
                      onMove={(step) => draft.move(row.uid, step)}
                    />
                  </div>

                  <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-[1fr_10rem_auto] sm:items-center">
                    <input
                      value={row.label}
                      onChange={(event) => edit(row, { label: event.target.value })}
                      maxLength={60}
                      placeholder="Field name, e.g. Branch"
                      aria-label="Field name"
                      aria-invalid={Boolean(error)}
                      className={cn(inputClass, "h-11 py-0 aria-invalid:border-rose-500")}
                    />
                    <Select
                      aria-label="Field type"
                      value={row.type}
                      // The answers already saved would stop making sense
                      disabled={Boolean(row.key)}
                      title={row.key ? "The type can't change once the field is saved" : undefined}
                      onChange={(event) => edit(row, { type: event.target.value })}
                      className="h-11 py-0 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {FIELD_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </Select>
                    <label className="flex items-center gap-2 text-sm font-semibold">
                      <Switch
                        checked={row.required}
                        onChange={(required) => edit(row, { required })}
                        label={`${row.label || "Field"} is required`}
                      />
                      Required
                    </label>

                    {row.type === "select" && (
                      <textarea
                        value={row.optionsText}
                        onChange={(event) => edit(row, { optionsText: event.target.value })}
                        rows={3}
                        placeholder={"One option per line, e.g.\nDhaka\nChittagong"}
                        aria-label={`${row.label || "Dropdown"} options`}
                        className={cn(inputClass, "sm:col-span-3")}
                      />
                    )}
                  </div>

                  <IconButton label={`Remove ${row.label || "field"}`} tone="danger" onClick={() => switchOff(row)}>
                    <X className="size-4" />
                  </IconButton>
                </div>
                {error && <p className="mt-1.5 pl-9 text-xs font-medium text-rose-500">{error}</p>}
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={() => {
            draft.add({ label: "", type: "text", optionsText: "", required: false, isActive: true });
            setNotice("");
          }}
          className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-border px-4 py-2.5 text-sm font-semibold text-muted transition-colors hover:border-accent/50 hover:text-accent-text"
        >
          <Plus className="size-4" />
          Add field
        </button>

        <SwitchedOffList items={switchedOff} onRestore={switchOn}>
          {(row) => `${row.label} · ${FIELD_TYPES.find((type) => type.value === row.type)?.label}`}
        </SwitchedOffList>
      </FormSection>
    </form>
  );
}
