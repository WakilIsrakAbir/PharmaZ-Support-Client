import ProfileView from "@/components/profile/ProfileView";
import PageShell from "@/components/ui/PageShell";

export const metadata = {
  title: "My Profile",
};

export default function ProfilePage() {
  return (
    <PageShell title="My Profile" subtitle="Your account details, and the parts of them you control.">
      <ProfileView />
    </PageShell>
  );
}
