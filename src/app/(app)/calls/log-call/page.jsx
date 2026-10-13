import LogCallForm from "@/components/log-call/LogCallForm";

export const metadata = {
  title: "Log a Call",
};

export default function LogCallPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <LogCallForm />
    </div>
  );
}
