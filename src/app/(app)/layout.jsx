import Navbar from "@/components/navbar/Navbar";

// Every page a logged-in user sees: navbar on top, page below.
export default function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
    </>
  );
}
