import {
  BookUser,
  Building2,
  Calculator,
  CalendarClock,
  KeyRound,
  LifeBuoy,
  Monitor,
  Package,
  PhoneIncoming,
  PhoneOutgoing,
  Receipt,
  Truck,
} from "lucide-react";

// Problem areas follow the PharmaZ247 modules, so agents can file a call
// under the same place the customer sees it in the app.
export const PROBLEM_AREAS = [
  {
    value: "pos",
    label: "POS & Billing",
    icon: Monitor,
    issues: [
      "Can't open or close a shift",
      "Barcode scanner not adding products",
      "Product not found in POS search",
      "Payment split mismatch (Cash / bKash / Nagad / Card)",
      "Discount not applying correctly",
      "Due collection not saving",
      "Held sale missing after Recall",
      "Receipt not printing",
      "POS device token / device not registered",
    ],
  },
  {
    value: "sales",
    label: "Sales & Returns",
    icon: Receipt,
    issues: [
      "Order total is wrong",
      "Can't edit or cancel an order",
      "Sales return or refund failed",
      "Customer due balance is incorrect",
      "Sales missing from history",
    ],
  },
  {
    value: "inventory",
    label: "Inventory & Stock",
    icon: Package,
    issues: [
      "Stock quantity doesn't match shelf",
      "Stock adjustment not saving",
      "Bulk product import failed",
      "Batch or expiry date is wrong",
      "Near-expiry / expired alerts incorrect",
      "Branch-to-branch transfer stuck",
      "Barcode or label printing problem",
      "Cold storage items not tracked",
    ],
  },
  {
    value: "purchase",
    label: "Purchase & GRN",
    icon: Truck,
    issues: [
      "Can't create a purchase order",
      "GRN quantity or price mismatch",
      "Reconciliation stuck on manager review",
      "Purchase return failed",
      "Supplier payable is incorrect",
    ],
  },
  {
    value: "appointments",
    label: "Appointments",
    icon: CalendarClock,
    issues: [
      "Can't book a slot",
      "Doctor schedule or availability wrong",
      "Walk-in token / queue problem",
      "Teleconsultation not connecting",
      "Queue display screen not updating",
    ],
  },
  {
    value: "accounting",
    label: "Accounting & Reports",
    icon: Calculator,
    issues: [
      "Dashboard figures don't match",
      "P&L report looks incorrect",
      "Can't add or edit an expense",
      "Transaction missing from the list",
      "PDF export not working",
    ],
  },
  {
    value: "master-data",
    label: "Customers & Suppliers",
    icon: BookUser,
    issues: [
      "Duplicate customer or supplier",
      "Can't add or edit a customer",
      "Supplier details are wrong",
      "Lookup values missing (category, manufacturer)",
    ],
  },
  {
    value: "setup",
    label: "Branch & Users",
    icon: Building2,
    issues: [
      "Add or edit a branch",
      "DGDA licence expiring / renewal",
      "Add or remove a staff user",
      "Role permissions need changing",
      "Module not enabled for a branch",
    ],
  },
  {
    value: "access",
    label: "Login & Access",
    icon: KeyRound,
    issues: [
      "Can't log in / forgot password",
      "PIN not working or needs reset",
      "Account locked",
      "Can't switch branch",
      "Keeps getting logged out",
    ],
  },
  {
    value: "general",
    label: "General",
    icon: LifeBuoy,
    issues: [
      "App is slow or not loading",
      "Bangla / English display problem",
      "Notifications not arriving",
      "Subscription or billing question",
      "How-to question / training",
      "Feature request",
    ],
  },
];

// Every area also gets this as its last choice.
export const OTHER_ISSUE = "Something else";

export const CALL_DIRECTIONS = [
  { value: "inbound", label: "Inbound", icon: PhoneIncoming },
  { value: "outbound", label: "Outbound", icon: PhoneOutgoing },
];

export const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export const CALL_STATUSES = [
  "Resolved on call",
  "Follow-up needed",
  "Escalated to tech team",
  "Callback scheduled",
  "Customer unreachable",
];
