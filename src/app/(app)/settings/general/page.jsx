import { GeneralView } from "@/components/settings/SettingsViews";
import PageShell from "@/components/ui/PageShell";

export const metadata = {
  title: "General",
};

export default function GeneralSettingsPage() {
  return (
    <PageShell title="General" subtitle="The product's name and colour.">
      <GeneralView />
    </PageShell>
  );
}
