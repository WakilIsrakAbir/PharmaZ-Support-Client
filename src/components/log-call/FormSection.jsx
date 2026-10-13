export default function FormSection({ icon: Icon, title, subtitle, action, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <header className="relative flex items-center gap-3 border-b border-border bg-linear-to-r from-elevated to-transparent px-5 py-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent-text">
          <Icon className="size-5" />
        </span>
        <div className="flex-1">
          <h2 className="font-semibold">{title}</h2>
          <p className="text-xs text-muted">{subtitle}</p>
        </div>
        {action}
        <span className="absolute bottom-0 left-5 h-0.5 w-12 rounded-full bg-accent" />
      </header>

      <div className="space-y-5 p-5">{children}</div>
    </section>
  );
}
