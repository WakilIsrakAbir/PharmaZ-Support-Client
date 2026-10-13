import Link from "next/link";
import AuthHeading from "@/components/auth/AuthHeading";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Log in",
};

export default function LoginPage() {
  return (
    <>
      <AuthHeading title="Welcome back" subtitle="Log in to your PharmaZ247 support workspace." />
      <LoginForm />
      <p className="mt-8 text-center text-sm text-muted">
        New to the team?{" "}
        <Link href="/register" className="font-semibold text-accent-text hover:underline">
          Create an account
        </Link>
      </p>
    </>
  );
}
