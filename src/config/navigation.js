import {
  ClipboardCheck,
  Gauge,
  LayoutDashboard,
  PhoneCall,
  ScrollText,
  ShieldCheck,
  Users,
} from "lucide-react";

export const NAV_GROUPS = [
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
    label: "Audit",
    items: [
      {
        label: "QA",
        href: "/audit/qa",
        description: "Quality assurance reviews",
        icon: ShieldCheck,
      },
      {
        label: "QC",
        href: "/audit/qc",
        description: "Quality control checks",
        icon: ClipboardCheck,
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        label: "Users",
        href: "/management/users",
        description: "Manage team members and roles",
        icon: Users,
      },
    ],
  },
];

/** True when `pathname` is `href` itself or a page nested under it. */
export function isActivePath(pathname, href) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
