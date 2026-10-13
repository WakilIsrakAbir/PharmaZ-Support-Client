import DashboardView from "@/components/dashboard/DashboardView";
import PageShell from "@/components/ui/PageShell";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <PageShell title="Dashboard" subtitle="How support is going, at a glance.">
      <DashboardView />
    </PageShell>
  );
}
