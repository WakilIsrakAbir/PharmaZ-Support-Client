import { ProblemAreasView } from "@/components/settings/SettingsViews";
import PageShell from "@/components/ui/PageShell";

export const metadata = {
  title: "Problem areas",
};

export default function ProblemAreasPage() {
  return (
    <PageShell title="Problem areas" subtitle="What customers call about, and the issues under each area.">
      <ProblemAreasView />
    </PageShell>
  );
}
