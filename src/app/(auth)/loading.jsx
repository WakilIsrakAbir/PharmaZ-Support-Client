import Spinner from "@/components/ui/Spinner";

// Shown in the form's place while a login or password page loads
export default function AuthLoading() {
  return <Spinner className="py-16" />;
}
