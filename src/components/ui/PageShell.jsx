import ProductSwitcher from "@/components/ui/ProductSwitcher";

/**
 * The frame every page sits in: the shared page width (see `page-container` in
 * globals.css) and, when given, a title row with optional actions on the right.
 * On product pages the super admin also gets the product picker beside the title.
 */
export default function PageShell({ title, subtitle, actions, children }) {
  return (
    <div className="page-container py-8">
      {title && (
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
              <ProductSwitcher />
            </div>
            {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
          </div>
          {actions}
        </header>
      )}
      {children}
    </div>
  );
}
