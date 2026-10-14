import { Suspense } from "react";
import PerformanceView from "@/components/performance/PerformanceView";
import { Placeholder } from "@/components/ui/Card";
import PageShell from "@/components/ui/PageShell";

export const metadata = {
  title: "Performance",
};

export default function PerformancePage() {
  return (
    <PageShell title="Review performance" subtitle="How each person on the team is handling calls.">
      {/* The filters are read from the URL, which needs a Suspense boundary */}
      <Suspense fallback={<Placeholder height="h-96" />}>
        <PerformanceView />
      </Suspense>
    </PageShell>
  );
}
