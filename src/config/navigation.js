import {
  Boxes,
  Gauge,
  LayoutDashboard,
  LayoutGrid,
  PhoneCall,
  ScrollText,
  SlidersHorizontal,
  Tags,
  Users,
  UsersRound,
} from "lucide-react";
import { canManageProduct } from "./roles";

/** The super admin's console, above every product. */
const SUPER_ADMIN_GROUP = {
  label: "Super admin",
  items: [
    {
      label: "All products",
      href: "/admin/products",
      description: "Create products and choose their admins",
      icon: Boxes,
    },
    {
      label: "All accounts",
      href: "/admin/users",
      description: "Everyone, in every product",
      icon: UsersRound,
    },
  ],
};

/** The pages inside a product. */
const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/overview/dashboard",
        description: "Live snapshot of support activity",
        icon: LayoutDashboard,
      },
      {
        label: "Performance",
        href: "/overview/performance",
        description: "Agent and team performance metrics",
        icon: Gauge,
      },
    ],
  },
  {
    label: "Calls",
    items: [
      {
        label: "Log a Call",
        href: "/calls/log-call",
        description: "Record a new customer call",
        icon: PhoneCall,
      },
      {
        label: "Logs",
        href: "/calls/logs",
        description: "Browse and search call history",
        icon: ScrollText,
      },
    ],
  },
  {
    label: "Management",
    adminOnly: true,
    items: [
      {
        label: "Users",
        href: "/management/users",
        description: "Manage team members and roles",
        icon: Users,
      },
    ],
  },
  {
    label: "Settings",
    adminOnly: true,
    items: [
      {
        label: "General",
        href: "/settings/general",
        description: "Product name and colour",
        icon: SlidersHorizontal,
      },
      {
        label: "Problem areas",
        href: "/settings/problem-areas",
        description: "Areas and issues on the call form",
        icon: LayoutGrid,
      },
      {
        label: "Statuses & priorities",
        href: "/settings/statuses",
        description: "Options for logging and updating calls",
        icon: Tags,
      },
    ],
  },
];

/**
 * The groups this user may see. Management and Settings are for product admins; the
 * super admin also gets their console, plus the pages of whichever product is open.
 */
export function getNavGroups(user) {
  const productGroups = NAV_GROUPS.filter((group) => !group.adminOnly || canManageProduct(user));
  if (!user?.isSuperAdmin) return productGroups;
  return [SUPER_ADMIN_GROUP, ...(user.product ? productGroups : [])];
}

/** True when `pathname` is `href` itself or a page nested under it. */
export function isActivePath(pathname, href) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * True on the pages that work inside one product (Dashboard, Logs, Settings...), where the
 * super admin gets the product picker beside the title. The console and Profile aren't.
 */
export function isProductPath(pathname) {
  return NAV_GROUPS.some((group) => group.items.some((item) => isActivePath(pathname, item.href)));
}
