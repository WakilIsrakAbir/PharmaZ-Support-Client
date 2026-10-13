import AccountsView from "@/components/admin/AccountsView";
import SuperAdminGate from "@/components/admin/SuperAdminGate";
import PageShell from "@/components/ui/PageShell";

export const metadata = {
  title: "All accounts",
};

export default function AccountsPage() {
  return (
    <PageShell title="All accounts" subtitle="Everyone on the platform, and the product each of them works in.">
      <SuperAdminGate>
        <AccountsView />
      </SuperAdminGate>
    </PageShell>
  );
}
