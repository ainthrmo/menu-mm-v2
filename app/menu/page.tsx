import type { Metadata } from "next";
import { Suspense } from "react";
import CustomerMenu from "@/components/customerMenu";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ restaurantId?: string; demo?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const restaurantId = params.restaurantId?.trim();
  const isDemo = params.demo === "true" || !restaurantId;

  if (isDemo) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    alternates: {
      canonical: `/menu?restaurantId=${encodeURIComponent(restaurantId)}`,
    },
  };
}

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <Suspense fallback={<div className="min-h-screen bg-[#F8F7F4]" />}>
        <CustomerMenu />
      </Suspense>
    </main>
  );
}
