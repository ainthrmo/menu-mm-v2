import { LoginForm } from "@/components/login-form";
import { AuthPageShell } from "@/components/auth-page-shell";

export default function Page() {
  return (
    <AuthPageShell subtitle="Sign in to manage your restaurant menu">
      <LoginForm />
    </AuthPageShell>
  );
}
