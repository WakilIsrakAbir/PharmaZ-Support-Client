import ProductsView from "@/components/admin/ProductsView";
import SuperAdminGate from "@/components/admin/SuperAdminGate";
import PageShell from "@/components/ui/PageShell";

export const metadata = {
  title: "All products",
};

export default function ProductsPage() {
  return (
    <PageShell title="All products" subtitle="Every product on the platform. Open one to work inside it.">
      <SuperAdminGate>
        <ProductsView />
      </SuperAdminGate>
    </PageShell>
  );
}
