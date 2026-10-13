import { ShieldCheck, UserMinus, UserRound } from "lucide-react";
import ActionMenu from "@/components/ui/ActionMenu";

/**
 * The ⋮ menu on a user row. Product admins can remove support agents; the super admin
 * can also change who is an admin. Renders nothing when there's nothing to offer.
 */
export default function UserActions({ user, isSuperAdmin, opensUp, onChangeRole, onRemove }) {
  const isAdmin = user.role === "admin";
  const items = [];

  if (isSuperAdmin) {
    items.push({
      label: isAdmin ? "Make support agent" : "Make admin",
      icon: isAdmin ? UserRound : ShieldCheck,
      onClick: () => onChangeRole(user, isAdmin ? "agent" : "admin"),
    });
  }
  if (isSuperAdmin || !isAdmin) {
    items.push({ label: "Remove from product", icon: UserMinus, onClick: () => onRemove(user), tone: "danger" });
  }

  if (items.length === 0) return null;
  return <ActionMenu label={`Actions for ${user.name}`} items={items} opensUp={opensUp} />;
}
