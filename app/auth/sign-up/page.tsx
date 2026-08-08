import { SignUpForm } from "@/components/sign-up-form";
import { AuthPageShell } from "@/components/auth-page-shell";

export default function Page() {
  return (
    <AuthPageShell subtitle="Start building your digital menu">
      <SignUpForm />
    </AuthPageShell>
  );
}
