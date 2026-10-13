"use client";

import { useEffect, useRef, useState } from "react";
import { Check, LayoutGrid, Plus, X } from "lucide-react";
import FormAlert from "@/components/auth/FormAlert";
import SubmitButton from "@/components/auth/SubmitButton";
import { DialogBody, DialogFooter, secondaryButtonClass } from "@/components/ui/DialogParts";
import { Field, inputClass } from "@/components/ui/FormControls";
import { AREA_ICONS, DEFAULT_AREA_ICON } from "@/config/area-icons";
import { OTHER_ISSUE } from "@/config/call-log";
import { saveProductSetup } from "@/hooks/useProductSetup";
import { cn } from "@/lib/utils";
import { IconButton, SwitchedOffList } from "./ListParts";

/** Adds a problem area (`area` null) or edits one: name, icon and issues. */
export default function AreaDialog({ area, isOpen, onClose, onSaved }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => event.target === event.currentTarget && dialogRef.current.close()}
      aria-labelledby="area-dialog-title"
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-surface p-0 text-foreground shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm open:flex"
    >
      {/* Mounted only while open, so it starts from the saved area every time */}
      {isOpen && <AreaForm area={area} onCancel={() => dialogRef.current.close()} onSaved={onSaved} />}
    </dialog>
  );
}

let lastUid = 0;
const toRow = (issue) => ({ ...issue, uid: `issue-${++lastUid}` });

function AreaForm({ area, onCancel, onSaved }) {
  const [name, setName] = useState(area?.name ?? "");
  const [icon, setIcon] = useState(area?.icon ?? DEFAULT_AREA_ICON);
  const [issues, setIssues] = useState(() => (area?.issues ?? []).map(toRow));
  const [newIssue, setNewIssue] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const active = issues.filter((issue) => issue.isActive);
  const switchedOff = issues.filter((issue) => !issue.isActive);

  function editIssue(uid, changes) {
    setIssues((current) => current.map((issue) => (issue.uid === uid ? { ...issue, ...changes } : issue)));
  }

  // Saved issues are switched off (older calls use them); new ones are just dropped
  function removeIssue(issue) {
    if (issue.id) editIssue(issue.uid, { isActive: false });
    else setIssues((current) => current.filter((item) => item.uid !== issue.uid));
  }

  function addIssue() {
    const label = newIssue.trim();
    if (!label) return;
    if (issues.some((issue) => issue.label.toLowerCase() === label.toLowerCase())) {
      setErrors({ issues: `"${label}" is already in the list.` });
      return;
    }
    setIssues((current) => [...current, toRow({ label, isActive: true })]);
    setNewIssue("");
    setErrors({});
  }

  async function save(event) {
    event.preventDefault();
    setFormError("");

    if (!name.trim()) {
      setErrors({ name: "Give the problem area a name." });
      return;
    }
    if (issues.some((issue) => !issue.label.trim())) {
      setErrors({ issues: "Every issue needs some text. Remove the empty ones." });
      return;
    }

    const body = {
      name,
      icon,
      issues: issues.map(({ id, label, isActive }) => ({ ...(id && { id }), label, isActive })),
    };

    setIsSaving(true);
    try {
      if (area) await saveProductSetup(`/areas/${area.id}`, { method: "PATCH", body });
      else await saveProductSetup("/areas", { method: "POST", body });
      onSaved(area ? `${name.trim()} was saved.` : `${name.trim()} was added to the Log a Call form.`);
    } catch (error) {
      const fields = error.fields ?? {};
      setErrors(fields);
      const placed = Object.keys(fields).filter((key) => key === "name" || key.startsWith("issues"));
      if (placed.length === 0) setFormError(error.message);
      setIsSaving(false);
    }
  }

  const issueError = Object.entries(errors).find(([key]) => key.startsWith("issues"))?.[1];

  return (
    <form onSubmit={save} noValidate className="flex min-h-0 flex-1 flex-col">
      <header className="relative flex items-center gap-3 border-b border-border bg-linear-to-r from-elevated to-transparent px-6 py-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent-text">
          <LayoutGrid className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="area-dialog-title" className="font-semibold">
            {area ? `Edit ${area.name}` : "Add a problem area"}
          </h2>
          <p className="truncate text-xs text-muted">A card on the Log a Call form, and the issues listed under it</p>
        </div>
        <IconButton label="Close" onClick={onCancel}>
          <X className="size-5" />
        </IconButton>
        <span className="absolute bottom-0 left-6 h-0.5 w-12 rounded-full bg-accent" />
      </header>

      <DialogBody>
        <FormAlert message={formError} />

        <Field label="Name" htmlFor="area-name" required error={errors.name}>
          <input
            id="area-name"
            value={name}
            maxLength={60}
            placeholder="e.g. Billing & Payments"
            onChange={(event) => {
              setName(event.target.value);
              setErrors((current) => ({ ...current, name: undefined }));
            }}
            aria-invalid={Boolean(errors.name)}
            className={cn(inputClass, "aria-invalid:border-rose-500")}
          />
        </Field>

        <Field label="Icon">
          <IconPicker value={icon} onChange={setIcon} />
        </Field>

        <Field label="Issues" hint={`· agents can always pick "${OTHER_ISSUE}" too`} error={issueError}>
          <ul className="space-y-2">
            {active.map((issue) => (
              <li key={issue.uid} className="flex items-center gap-2">
                <input
                  value={issue.label}
                  maxLength={120}
                  aria-label="Issue"
                  onChange={(event) => editIssue(issue.uid, { label: event.target.value })}
                  className={cn(inputClass, "h-11 py-0")}
                />
                <IconButton label={`Remove "${issue.label}"`} tone="danger" onClick={() => removeIssue(issue)}>
                  <X className="size-4" />
                </IconButton>
              </li>
            ))}
          </ul>

          <div className={cn("flex gap-2", active.length > 0 && "mt-2")}>
            <input
              value={newIssue}
              maxLength={120}
              placeholder="Add an issue, e.g. Card payment declined"
              aria-label="New issue"
              onChange={(event) => setNewIssue(event.target.value)}
              onKeyDown={(event) => {
                // Enter adds the issue instead of saving the whole form
                if (event.key === "Enter") {
                  event.preventDefault();
                  addIssue();
                }
              }}
              className={cn(inputClass, "h-11 py-0")}
            />
            <button
              type="button"
              onClick={addIssue}
              disabled={!newIssue.trim()}
              className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-border px-4 text-sm font-semibold transition-colors hover:bg-elevated disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="size-4" />
              Add
            </button>
          </div>
        </Field>

        <SwitchedOffList
          items={switchedOff}
          title="Switched-off issues"
          onRestore={(issue) => editIssue(issue.uid, { isActive: true })}
        >
          {(issue) => issue.label}
        </SwitchedOffList>
      </DialogBody>

      <DialogFooter>
        <button type="button" onClick={onCancel} className={secondaryButtonClass}>
          Cancel
        </button>
        <SubmitButton isSubmitting={isSaving} submittingText="Saving..." icon={Check} fullWidth={false}>
          {area ? "Save changes" : "Add area"}
        </SubmitButton>
      </DialogFooter>
    </form>
  );
}

function IconPicker({ value, onChange }) {
  return (
    <div role="radiogroup" aria-label="Icon" className="grid grid-cols-7 gap-1.5 sm:grid-cols-10 md:grid-cols-14">
      {Object.entries(AREA_ICONS).map(([name, Icon]) => {
        const isSelected = name === value;
        return (
          <button
            key={name}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={name.replaceAll("-", " ")}
            title={name.replaceAll("-", " ")}
            onClick={() => onChange(name)}
            className={cn(
              "grid aspect-square cursor-pointer place-items-center rounded-lg border transition-colors",
              isSelected
                ? "border-accent bg-accent-strong text-accent-foreground"
                : "border-border text-muted hover:border-accent/40 hover:text-accent-text",
            )}
          >
            <Icon className="size-4" />
          </button>
        );
      })}
    </div>
  );
}
