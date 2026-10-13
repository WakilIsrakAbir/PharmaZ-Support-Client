import Link from "next/link";
import { PhoneCall } from "lucide-react";
import CallLogs from "@/components/call-logs/CallLogs";
import PageShell from "@/components/ui/PageShell";

export const metadata = {
  title: "Call Logs",
};

export default function CallLogsPage() {
  return (
    <PageShell
      title="Call Logs"
      subtitle="Every call logged, newest first. Open one for the full record."
      actions={
        <Link
          href="/calls/log-call"
          className="flex items-center gap-2 rounded-xl bg-accent-strong px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/30 transition-all hover:-translate-y-0.5 hover:shadow-xl"
        >
          <PhoneCall className="size-4" />
          Log a Call
        </Link>
      }
    >
      <CallLogs />
    </PageShell>
  );
}
