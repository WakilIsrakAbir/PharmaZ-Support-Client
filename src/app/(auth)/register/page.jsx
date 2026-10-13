import Link from "next/link";
import AuthHeading from "@/components/auth/AuthHeading";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Create an account",
};

export default function RegisterPage() {
  return (
    <>
      <AuthHeading title="Create your account" subtitle="Join the PharmaZ247 support team workspace." />
      <RegisterForm />
      <p className="mt-8 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-accent-text hover:underline">
          Log in
        </Link>
      </p>
    </>
  );
}
