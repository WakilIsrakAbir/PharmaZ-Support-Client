"use client";

import { useState } from "react";
import { LayoutGrid, Pencil, Plus, Trash2 } from "lucide-react";
import FormAlert from "@/components/auth/FormAlert";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import FormSection from "@/components/ui/FormSection";
import Switch from "@/components/ui/Switch";
import { areaIcon } from "@/config/area-icons";
import { saveProductSetup } from "@/hooks/useProductSetup";
import { cn } from "@/lib/utils";
import AreaDialog from "./AreaDialog";
import { IconButton, MoveButtons } from "./ListParts";

const NOT_DELETING = { area: null, isWorking: false, error: "" };

/**
 * The cards on the Log a Call form. Switching an area on or off and reordering save
 * straight away; adding and editing happen in a dialog.
 */
export default function ProblemAreasSettings({ areas }) {
  // null: closed, "new": adding, otherwise the area being edited
  const [editing, setEditing] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [deleting, setDeleting] = useState(NOT_DELETING);

  async function run(id, path, options, message) {
    setError("");
    setNotice("");
    setBusyId(id);
    try {
      await saveProductSetup(path, options);
      if (message) setNotice(message);
    } catch (requestError) {
      setError(requestError.message);
    }
    setBusyId(null);
  }

  function toggle(area, isActive) {
    const message = isActive
      ? `${area.name} is back on the Log a Call form.`
      : `${area.name} is switched off. Older calls keep it.`;
    run(area.id, `/areas/${area.id}`, { method: "PATCH", body: { isActive } }, message);
  }

  async function deleteArea() {
    const { area } = deleting;
    setDeleting((current) => ({ ...current, isWorking: true, error: "" }));
    try {
      await saveProductSetup(`/areas/${area.id}`, { method: "DELETE" });
      setDeleting(NOT_DELETING);
      setError("");
      setNotice(`${area.name} was deleted. Older calls still show it.`);
    } catch (requestError) {
      setDeleting((current) => ({ ...current, isWorking: false, error: requestError.message }));
    }
  }

  function move(area, step) {
    const ids = areas.map((item) => item.id);
    const from = ids.indexOf(area.id);
    [ids[from], ids[from + step]] = [ids[from + step], ids[from]];
    run(area.id, "/areas/order", { body: { ids } });
  }

  return (
    <>
      <FormSection
        icon={LayoutGrid}
        title="Problem areas"
        subtitle="The cards agents pick from, each with its own list of issues"
        action={
          <button
            type="button"
            onClick={() => setEditing("new")}
            className="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-accent-strong px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/30 transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            <Plus className="size-4" />
            <span className="max-sm:sr-only">Add area</span>
          </button>
        }
      >
        <FormAlert message={error} />
        <FormAlert message={notice} tone="success" />

        {areas.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
            No problem areas yet. Add the parts of the product customers call about, like Billing or Login.
          </p>
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
            {areas.map((area, index) => {
              const Icon = areaIcon(area.icon);
              const issueCount = area.issues.filter((issue) => issue.isActive).length;
              const isBusy = busyId === area.id;

              return (
                <li
                  key={area.id}
                  className={cn(
                    "flex items-center gap-3 bg-background/40 px-3 py-3 transition-opacity",
                    isBusy && "opacity-60",
                  )}
                >
                  <MoveButtons
                    name={area.name}
                    index={index}
                    count={areas.length}
                    onMove={(step) => move(area, step)}
                    disabled={busyId !== null}
                  />
                  <span
                    className={cn(
                      "grid size-10 shrink-0 place-items-center rounded-xl max-sm:hidden",
                      area.isActive ? "bg-accent/10 text-accent-text" : "bg-elevated text-muted",
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn("truncate font-semibold", !area.isActive && "text-muted line-through decoration-1")}
                    >
                      {area.name}
                    </p>
                    <p className="text-xs text-muted">
                      {issueCount} {issueCount === 1 ? "issue" : "issues"}
                      {!area.isActive && " · switched off"}
                    </p>
                  </div>
                  <Switch
                    checked={area.isActive}
                    onChange={(isActive) => toggle(area, isActive)}
                    label={`${area.name} is on the Log a Call form`}
                    disabled={isBusy}
                  />
                  <IconButton label={`Edit ${area.name}`} onClick={() => setEditing(area)}>
                    <Pencil className="size-4" />
                  </IconButton>
                  <IconButton
                    label={`Delete ${area.name}`}
                    tone="danger"
                    onClick={() => setDeleting({ ...NOT_DELETING, area })}
                    disabled={isBusy}
                  >
                    <Trash2 className="size-4" />
                  </IconButton>
                </li>
              );
            })}
          </ul>
        )}
      </FormSection>

      <AreaDialog
        area={editing === "new" ? null : editing}
        isOpen={editing !== null}
        onClose={() => setEditing(null)}
        onSaved={(message) => {
          setEditing(null);
          setError("");
          setNotice(message);
        }}
      />

      <ConfirmDialog
        isOpen={Boolean(deleting.area)}
        title={`Delete ${deleting.area?.name}?`}
        confirmText="Delete area"
        isWorking={deleting.isWorking}
        error={deleting.error}
        onConfirm={deleteArea}
        onCancel={() => setDeleting(NOT_DELETING)}
      >
        The area and its issues are removed from the Log a Call form for good. Calls already logged with it keep
        showing its name and issue. To hide it for a while instead, switch it off. This can&apos;t be undone.
      </ConfirmDialog>
    </>
  );
}
