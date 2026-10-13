import LogCallForm from "@/components/log-call/LogCallForm";
import PageShell from "@/components/ui/PageShell";

export const metadata = {
  title: "Log a Call",
};

// The form draws its own title row, because its buttons belong inside the <form>
export default function LogCallPage() {
  return (
    <PageShell>
      <LogCallForm />
    </PageShell>
  );
}
