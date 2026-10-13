import { FormFieldsView } from "@/components/settings/SettingsViews";
import PageShell from "@/components/ui/PageShell";

export const metadata = {
  title: "Form fields",
};

export default function FormFieldsPage() {
  return (
    <PageShell title="Form fields" subtitle="Extra questions on the Log a Call form.">
      <FormFieldsView />
    </PageShell>
  );
}
