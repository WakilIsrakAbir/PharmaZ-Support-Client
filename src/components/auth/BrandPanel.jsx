import { ClipboardCheck, Headset, PhoneCall, TrendingUp } from "lucide-react";

const highlights = [
  { icon: PhoneCall, title: "Log calls in seconds", text: "Only a mobile number is required to save a call." },
  { icon: ClipboardCheck, title: "Every PharmaZ247 module", text: "File issues under POS, Inventory, Purchase and more." },
  { icon: TrendingUp, title: "Quality you can measure", text: "QA, QC and performance in one place." },
];

/** The coloured left half of the login and register pages. */
export default function BrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-linear-to-br from-accent-strong to-accent p-12 text-accent-foreground lg:flex lg:flex-col">
      {/* Soft background shapes */}
      <div className="absolute -right-24 -top-24 size-96 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-20 size-96 rounded-full bg-black/10 blur-3xl" />

      <div className="relative flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
          <Headset className="size-5" />
        </span>
        <span className="leading-none">
          <span className="block text-lg font-extrabold tracking-tight">PharmaZ.247</span>
          <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] opacity-80">
            Support Tool
          </span>
        </span>
      </div>

      <div className="relative my-auto max-w-md py-12">
        <h2 className="text-4xl font-bold leading-tight">Support every pharmacy, one call at a time.</h2>
        <p className="mt-4 text-base opacity-85">
          The workspace the PharmaZ247 support team uses to log calls, track issues and keep quality high.
        </p>

        <ul className="mt-10 space-y-5">
          {highlights.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/15 ring-1 ring-white/20">
                <Icon className="size-5" />
              </span>
              <span>
                <span className="block font-semibold">{title}</span>
                <span className="block text-sm opacity-80">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-xs opacity-70">© 2026 PharmaZ247. All rights reserved.</p>
    </aside>
  );
}
