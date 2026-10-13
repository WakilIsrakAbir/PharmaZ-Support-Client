import AccessGate from "@/components/sidebar/AccessGate";
import MobileSidebar from "@/components/sidebar/MobileSidebar";
import Sidebar from "@/components/sidebar/Sidebar";
import ProductAccent from "@/components/theme/ProductAccent";
import ScrollProgress from "@/components/ui/ScrollProgress";

// Every page a logged-in user sees: sidebar on the left, page on the right.
export default function AppLayout({ children }) {
  return (
    <AccessGate>
      <div className="flex min-h-screen">
        <ProductAccent />
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <ScrollProgress />
          <MobileSidebar />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </AccessGate>
  );
}
