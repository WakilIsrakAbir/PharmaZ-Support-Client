// Colours a status or priority badge can use.
// Keep the values in sync with OPTION_COLORS in server/src/modules/products/product.constants.js.
// Class names are written out in full so Tailwind keeps them.
export const OPTION_COLORS = {
  slate: { label: "Slate", badge: "bg-slate-500/10 text-slate-500 ring-slate-500/30", swatch: "bg-slate-500" },
  emerald: {
    label: "Emerald",
    badge: "bg-emerald-500/10 text-emerald-500 ring-emerald-500/30",
    swatch: "bg-emerald-500",
  },
  teal: { label: "Teal", badge: "bg-teal-500/10 text-teal-500 ring-teal-500/30", swatch: "bg-teal-500" },
  sky: { label: "Sky", badge: "bg-sky-500/10 text-sky-500 ring-sky-500/30", swatch: "bg-sky-500" },
  indigo: { label: "Indigo", badge: "bg-indigo-500/10 text-indigo-500 ring-indigo-500/30", swatch: "bg-indigo-500" },
  violet: { label: "Violet", badge: "bg-violet-500/10 text-violet-500 ring-violet-500/30", swatch: "bg-violet-500" },
  rose: { label: "Rose", badge: "bg-rose-500/10 text-rose-500 ring-rose-500/30", swatch: "bg-rose-500" },
  amber: { label: "Amber", badge: "bg-amber-500/10 text-amber-500 ring-amber-500/30", swatch: "bg-amber-500" },
  orange: { label: "Orange", badge: "bg-orange-500/10 text-orange-500 ring-orange-500/30", swatch: "bg-orange-500" },
  lime: { label: "Lime", badge: "bg-lime-500/10 text-lime-600 ring-lime-500/30", swatch: "bg-lime-500" },
};

export function optionColor(color) {
  return OPTION_COLORS[color] ?? OPTION_COLORS.slate;
}
