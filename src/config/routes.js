// Kept free of other imports, because proxy.js uses it too.

/** Where users land after logging in. */
export const HOME_PATH = "/overview/dashboard";

/** The super admin's home: every product. */
export const SUPER_ADMIN_HOME = "/admin/products";

/** Pages for logged-out visitors. There's no sign-up: admins create accounts. */
export const AUTH_PAGES = ["/login", "/forgot-password", "/reset-password"];
