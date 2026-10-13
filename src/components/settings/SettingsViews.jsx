"use client";

import { Flag, Tags } from "lucide-react";
import FormFieldsEditor from "./FormFieldsEditor";
import GeneralSettings from "./GeneralSettings";
import OptionListEditor from "./OptionListEditor";
import ProblemAreasSettings from "./ProblemAreasSettings";
import SetupGate from "./SetupGate";

// One view per Settings page. Each waits for the setup, then edits its part of it.

export function GeneralView() {
  return <SetupGate>{(setup) => <GeneralSettings product={setup.product} />}</SetupGate>;
}

export function ProblemAreasView() {
  return <SetupGate>{(setup) => <ProblemAreasSettings areas={setup.areas} />}</SetupGate>;
}

export function StatusesView() {
  return (
    <SetupGate>
      {(setup) => (
        <div className="space-y-6">
          <OptionListEditor
            name="statuses"
            noun="status"
            icon={Tags}
            title="Call statuses"
            subtitle="Where a call stands, shown as a coloured badge in the logs"
            saved={setup.statuses}
          />
          <OptionListEditor
            name="priorities"
            noun="priority"
            icon={Flag}
            title="Priorities"
            subtitle="How urgent a call is"
            saved={setup.priorities}
          />
        </div>
      )}
    </SetupGate>
  );
}

export function FormFieldsView() {
  return <SetupGate>{(setup) => <FormFieldsEditor saved={setup.customFields} />}</SetupGate>;
}
