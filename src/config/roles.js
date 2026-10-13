// Keep the keys in sync with USER_ROLES in server/src/modules/auth/user.model.js.
export const ROLES = {
  agent: {
    label: "Support Agent",
    description: "Log calls and follow up with pharmacies.",
  },
  admin: {
    label: "Administrator",
    description: "Full control, including user management.",
  },
};
