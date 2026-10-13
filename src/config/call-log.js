import { PhoneIncoming, PhoneOutgoing } from "lucide-react";

// Problem areas, statuses, priorities and extra fields belong to each product and come
// from GET /api/product/setup (see hooks/useProductSetup.js). Only these stay fixed.

// Every area also gets this as its last choice.
export const OTHER_ISSUE = "Something else";

// Keep every `value` in sync with server/src/modules/calls/call.constants.js.
export const CALL_DIRECTIONS = [
  { value: "inbound", label: "Inbound", icon: PhoneIncoming, className: "text-teal-500" },
  { value: "outbound", label: "Outbound", icon: PhoneOutgoing, className: "text-sky-500" },
];

/** Looks up an option by its value, e.g. findOption(CALL_DIRECTIONS, "inbound"). */
export function findOption(options, value) {
  return options.find((option) => option.value === value);
}
