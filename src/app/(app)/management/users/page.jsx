import PageShell from "@/components/ui/PageShell";
import UsersView from "@/components/users/UsersView";

export const metadata = {
  title: "Users",
};

export default function UsersPage() {
  return (
    <PageShell title="Users" subtitle="Your product's team. Add support agents, or remove people who've left.">
      <UsersView />
    </PageShell>
  );
}
