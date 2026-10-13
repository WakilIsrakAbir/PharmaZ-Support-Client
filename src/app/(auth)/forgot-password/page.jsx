import Link from "next/link";
import AuthHeading from "@/components/auth/AuthHeading";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata = {
  title: "Forgot password",
};

export default function ForgotPasswordPage() {
  return (
    <>
      <AuthHeading
        title="Forgot your password?"
        subtitle="Enter the email you sign in with and we'll send you a link to choose a new one."
      />
      <ForgotPasswordForm />
      <p className="mt-8 text-center text-sm text-muted">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-accent-text hover:underline">
          Back to log in
        </Link>
      </p>
    </>
  );
}
