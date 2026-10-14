import { Suspense } from "react";
import PerformanceView from "@/components/performance/PerformanceView";
import AdminGate from "@/components/ui/AdminGate";
import { Placeholder } from "@/components/ui/Card";
import PageShell from "@/components/ui/PageShell";

export const metadata = {
  title: "Performance",
};

export default function PerformancePage() {
  return (
    <PageShell title="Review performance" subtitle="How each person on the team is handling calls.">
      <AdminGate text="Only product admins can review the team's performance.">
        {/* The filters are read from the URL, which needs a Suspense boundary */}
        <Suspense fallback={<Placeholder height="h-96" />}>
          <PerformanceView />
        </Suspense>
      </AdminGate>
    </PageShell>
  );
}
