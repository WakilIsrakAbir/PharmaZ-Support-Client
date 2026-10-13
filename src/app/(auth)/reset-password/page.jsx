import Link from "next/link";
import AuthHeading from "@/components/auth/AuthHeading";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata = {
  title: "Reset password",
};

export default function ResetPasswordPage() {
  return (
    <>
      <AuthHeading
        title="Choose a new password"
        subtitle="You'll be logged in once it's saved, and logged out everywhere else."
      />
      <ResetPasswordForm />
      <p className="mt-8 text-center text-sm text-muted">
        Link expired?{" "}
        <Link href="/forgot-password" className="font-semibold text-accent-text hover:underline">
          Get a new one
        </Link>
      </p>
    </>
  );
}
