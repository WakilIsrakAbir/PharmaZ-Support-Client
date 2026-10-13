// Keep the keys in sync with USER_ROLES in server/src/modules/auth/user.model.js.
export const ROLES = {
  agent: {
    label: "Support Agent",
    description: "Logs calls and follows up with customers.",
  },
  admin: {
    label: "Product Admin",
    description: "Sets up the product and manages its support agents.",
  },
};

// Not a product role: the super admin sits above every product
export const SUPER_ADMIN = {
  label: "Super Admin",
  description: "Runs every product: creates them, appoints their admins and can open any of them.",
};

/** The label and description to show for this person. */
export function roleOf(user) {
  return user?.isSuperAdmin ? SUPER_ADMIN : (ROLES[user?.role] ?? ROLES.agent);
}

/** Product admins and the super admin can manage the product. */
export function canManageProduct(user) {
  return user?.role === "admin" || Boolean(user?.isSuperAdmin);
}
