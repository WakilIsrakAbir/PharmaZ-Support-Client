/**
 * The frame every page sits in: the shared page width (see `page-container` in
 * globals.css) and, when given, a title row with optional actions on the right.
 */
export default function PageShell({ title, subtitle, actions, children }) {
  return (
    <div className="page-container py-8">
      {title && (
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
          </div>
          {actions}
        </header>
      )}
      {children}
    </div>
  );
}
