import BrandPanel from "@/components/auth/BrandPanel";
import Logo from "@/components/navbar/Logo";

// Login and register: brand panel on the left, form on the right. No navbar.
export default function AuthLayout({ children }) {
  return (
    <div className="grid min-h-screen flex-1 lg:grid-cols-2">
      <BrandPanel />

      <main className="flex flex-col px-6 py-10 sm:px-10">
        <div className="lg:hidden">
          <Logo />
        </div>

        <div className="mx-auto my-auto w-full max-w-md py-10">{children}</div>
      </main>
    </div>
  );
}
