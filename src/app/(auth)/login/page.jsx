import AuthHeading from "@/components/auth/AuthHeading";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Log in",
};

export default function LoginPage() {
  return (
    <>
      <AuthHeading title="Welcome back" subtitle="Log in to your support workspace." />
      <LoginForm />
      <p className="mt-8 text-center text-sm text-muted">
        New to the team? Your product admin creates your account and gives you a temporary password.
      </p>
    </>
  );
}
