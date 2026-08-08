import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { AuthPageShell } from "@/components/auth-page-shell";

export default function Page() {
  return (
    <AuthPageShell subtitle="We'll send you a reset link">
      <ForgotPasswordForm />
    </AuthPageShell>
  );
}
