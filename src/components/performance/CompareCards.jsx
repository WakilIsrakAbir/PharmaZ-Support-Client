import { CircleCheckBig, Hourglass, PhoneCall, Timer } from "lucide-react";
import Bars from "@/components/ui/Bars";
import Card, { Placeholder } from "@/components/ui/Card";
import { formatDuration } from "@/lib/format";
import { formatRate } from "@/lib/performance";

// One card per measure, ranking the picked people side by side
const METRICS = [
  {
    key: "calls",
    icon: PhoneCall,
    title: "Calls handled",
    subtitle: "Calls each person logged",
    value: (agent) => agent.calls,
    text: (agent) => agent.calls.toLocaleString(),
  },
  {
    key: "resolved",
    icon: CircleCheckBig,
    title: "Resolved rate",
    subtitle: "Share of their calls in a closed status",
    max: 1,
    barClass: "bg-emerald-500",
    value: (agent) => agent.resolvedRate ?? 0,
    text: (agent) => formatRate(agent.resolvedRate),
  },
  {
    key: "awaiting",
    icon: Hourglass,
    title: "Awaiting action",
    subtitle: "Calls still open. Fewer isn't always better: it follows volume.",
    barClass: "bg-amber-500",
    value: (agent) => agent.awaiting,
    text: (agent) => agent.awaiting.toLocaleString(),
  },
  {
    key: "average",
    icon: Timer,
    title: "Average call",
    subtitle: "Over calls with a duration recorded",
    value: (agent) => agent.avgSeconds ?? 0,
    text: (agent) => formatDuration(agent.avgSeconds),
  },
];

export default function CompareCards({ agents }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {METRICS.map((metric) => (
        <Card key={metric.key} icon={metric.icon} title={metric.title} subtitle={metric.subtitle}>
          {agents ? (
            <Bars
              max={metric.max}
              rows={agents.map((agent) => ({
                key: agent.id,
                label: agent.name,
                value: metric.value(agent),
                text: metric.text(agent),
                barClass: metric.barClass,
              }))}
            />
          ) : (
            <Placeholder />
          )}
        </Card>
      ))}
    </div>
  );
}
