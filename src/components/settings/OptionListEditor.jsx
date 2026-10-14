"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import FormAlert from "@/components/auth/FormAlert";
import FormSection from "@/components/ui/FormSection";
import { inputClass } from "@/components/ui/FormControls";
import { optionColor } from "@/config/option-colors";
import { saveProductSetup } from "@/hooks/useProductSetup";
import { cn } from "@/lib/utils";
import ColorPicker from "./ColorPicker";
import { IconButton, MoveButtons, SaveBar, SwitchedOffList, listError, rowError } from "./ListParts";
import { useDraftList } from "./useDraftList";

const toOption = ({ key, label, color, isDefault, isActive }) => ({ key, label, color, isDefault, isActive });
// Statuses also say whether they close a call
const toStatus = (status) => ({ ...toOption(status), isClosed: Boolean(status.isClosed) });

/**
 * Edits a status or priority list: names, colours, order, the default, and switching
 * options off. `name` is the list's name in the API ("statuses" or "priorities").
 * With `closable`, each option can also be marked as closing the call.
 */
export default function OptionListEditor({ name, noun, icon, title, subtitle, saved, closable = false }) {
  const toDraft = closable ? toStatus : toOption;
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

  function makeDefault(row) {
    draft.setRows((rows) => rows.map((item) => ({ ...item, isDefault: item.uid === row.uid })));
    setNotice("");
  }

  // Switched-off options go to the end, and the default passes to the first one left.
  // A row that was never saved is simply removed.
  function switchOff(row) {
    draft.setRows((rows) => {
      const rest = rows.filter((item) => item.uid !== row.uid);
      if (!row.key) return rest;
      const others = rest.filter((item) => item.isActive);
      const needsDefault = row.isDefault && others.length > 0;
      const updated = rest.map((item) =>
        needsDefault && item.uid === others[0].uid ? { ...item, isDefault: true } : item,
      );
      return [
        ...updated.filter((item) => item.isActive),
        { ...row, isActive: false, isDefault: false },
        ...updated.filter((item) => !item.isActive),
      ];
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

  async function save(event) {
    event.preventDefault();
    setFormError("");
    setNotice("");

    const rows = draft.toSaved();
    const blank = rows.findIndex((row) => !row.label.trim());
    if (blank >= 0) {
      setErrors({ [`${name}.${blank}.label`]: `Give the ${noun} a name.` });
      return;
    }

    setIsSaving(true);
    try {
      const setup = await saveProductSetup(`/${name}`, { body: { [name]: rows } });
      draft.reset(setup[name].map(toDraft));
      setErrors({});
      setNotice("Saved. New calls use these straight away.");
    } catch (error) {
      setErrors(error.fields ?? {});
      setFormError(listError(error.fields, name, rows.length) ?? (error.fields ? "" : error.message));
    }
    setIsSaving(false);
  }

  return (
    <form onSubmit={save} noValidate>
      <FormSection
        icon={icon}
        title={title}
        subtitle={subtitle}
        footer={
          <SaveBar
            isDirty={draft.isDirty}
            isSaving={isSaving}
            onDiscard={() => {
              draft.reset();
              setErrors({});
              setFormError("");
            }}
            note={`The default is what a new call gets. Switched-off ${name} stay on older calls.`}
          />
        }
      >
        <FormAlert message={formError} />
        <FormAlert message={notice} tone="success" />

        <ul className="space-y-2">
          {active.map((row, index) => {
            const error = rowError(errors, name, draft.rows.indexOf(row));
            return (
              <li key={row.uid}>
                <div className="flex items-center gap-2">
                  <MoveButtons
                    name={row.label || `new ${noun}`}
                    index={index}
                    count={active.length}
                    onMove={(step) => draft.move(row.uid, step)}
                  />
                  {/* On phones the name gets its own line, with the colour and Default under it */}
                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                    <ColorPicker
                      label={`${row.label || noun} colour`}
                      value={row.color}
                      onChange={(color) => edit(row, { color })}
                    />
                    <input
                      value={row.label}
                      onChange={(event) => edit(row, { label: event.target.value })}
                      maxLength={40}
                      placeholder={`Name the ${noun}`}
                      aria-label={`${noun} name`}
                      aria-invalid={Boolean(error)}
                      className={cn(
                        inputClass,
                        "h-11 min-w-0 flex-1 py-0 aria-invalid:border-rose-500 max-sm:order-first max-sm:basis-full",
                      )}
                    />
                    {/* A fixed-width slot, so every name box is the same width */}
                    <span className="hidden w-52 shrink-0 justify-end md:flex" aria-hidden="true">
                      <span
                        className={cn(
                          "inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1",
                          optionColor(row.color).badge,
                        )}
                      >
                        <span className="size-1.5 shrink-0 rounded-full bg-current" />
                        <span className="truncate">{row.label || "Preview"}</span>
                      </span>
                    </span>
                    <label
                      className={cn(
                        "flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-xl border px-3 text-xs font-semibold transition-colors",
                        row.isDefault
                          ? "border-accent/50 bg-accent/10 text-accent-text"
                          : "border-border text-muted hover:text-foreground",
                      )}
                    >
                      <input
                        type="radio"
                        name={`${name}-default`}
                        checked={row.isDefault}
                        onChange={() => makeDefault(row)}
                        className="accent-accent"
                      />
                      Default
                    </label>
                    {closable && (
                      <label
                        title="Calls with this status count as resolved on the Performance page"
                        className={cn(
                          "flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-xl border px-3 text-xs font-semibold transition-colors",
                          row.isClosed
                            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-500"
                            : "border-border text-muted hover:text-foreground",
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={row.isClosed}
                          onChange={(event) => edit(row, { isClosed: event.target.checked })}
                          className="accent-emerald-500"
                        />
                        Closes call
                      </label>
                    )}
                  </div>
                  <IconButton
                    label={`Switch off ${row.label || noun}`}
                    tone="danger"
                    onClick={() => switchOff(row)}
                    disabled={active.length === 1}
                  >
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
            draft.add(toDraft({ label: "", color: "slate", isDefault: false, isActive: true }));
            setNotice("");
          }}
          className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-border px-4 py-2.5 text-sm font-semibold text-muted transition-colors hover:border-accent/50 hover:text-accent-text"
        >
          <Plus className="size-4" />
          Add {noun}
        </button>

        <SwitchedOffList items={switchedOff} onRestore={switchOn}>
          {(row) => row.label}
        </SwitchedOffList>
      </FormSection>
    </form>
  );
}
