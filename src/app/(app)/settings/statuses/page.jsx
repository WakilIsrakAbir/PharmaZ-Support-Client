import { StatusesView } from "@/components/settings/SettingsViews";
import PageShell from "@/components/ui/PageShell";

export const metadata = {
  title: "Statuses & priorities",
};

export default function StatusesPage() {
  return (
    <PageShell title="Statuses & priorities" subtitle="The options agents pick from when they log or update a call.">
      <StatusesView />
    </PageShell>
  );
}
