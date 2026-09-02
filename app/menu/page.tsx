import type { Metadata } from "next";
import { Suspense } from "react";
import CustomerMenu from "@/components/customerMenu";

export const metadata: Metadata = {
  alternates: {
    canonical: "/menu",
  },
};

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <Suspense fallback={<div className="min-h-screen bg-[#F8F7F4]" />}>
        <CustomerMenu />
      </Suspense>
    </main>
  );
}
