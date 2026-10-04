import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import CustomerMenu from "@/components/customerMenu";
import { TableProvider } from "@/components/TableContext";

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

// Signals to Next.js that this route is dynamic so generateMetadata
// (which reads searchParams) is not blocked during prerendering.
async function DynamicMarker() {
  await connection();
  return null;
}

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <Suspense>
        <DynamicMarker />
      </Suspense>
      <Suspense fallback={<div className="min-h-screen bg-[#F8F7F4]" />}>
        <TableProvider>
          <CustomerMenu />
        </TableProvider>
      </Suspense>
    </main>
  );
}
