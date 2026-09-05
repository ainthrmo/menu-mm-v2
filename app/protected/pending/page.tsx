import Link from "next/link";

export default function PendingApprovalPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <section className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 text-xl">
          •
        </div>
        <h1 className="text-2xl font-bold text-[#1e2417]">Your restaurant is under review</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Thanks for signing up for MOSSQR. Your account has been created successfully.
          We’ll activate your restaurant after a quick review.
        </p>
        <p className="mt-4 text-xs font-medium text-slate-400">
          You can sign in again later to check your dashboard.
        </p>
        <Link
          href="/auth/login"
          className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#1b2414] px-5 text-sm font-bold text-[#c8f04a]"
        >
          Back to Login
        </Link>
      </section>
    </main>
  );
}
