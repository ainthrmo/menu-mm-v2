import Link from "next/link";

export default function DisabledRestaurantPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <section className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 text-xl">
          !
        </div>
        <h1 className="text-2xl font-bold text-[#1e2417]">Restaurant access is disabled</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Your MOSSQR restaurant is currently disabled, so dashboard changes are unavailable.
          Please contact MOSSQR support if you believe this was a mistake.
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
