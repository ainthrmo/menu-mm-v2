import type { Metadata } from "next";
import { Suspense, use } from "react";
import CategoryMenuView from "@/components/CategoryMenuView";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ restaurantId?: string; demo?: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const query = await searchParams;
  const restaurantId = query.restaurantId?.trim();
  const isDemo = query.demo === "true" || !restaurantId;

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
      canonical: `/category/${id}?restaurantId=${encodeURIComponent(restaurantId)}`,
    },
  };
}

function CategoryContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <CategoryMenuView categorySlug={id} />;
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <Suspense fallback={<div className="min-h-screen bg-[#F8F7F4]" />}>
        <CategoryContent params={params} />
      </Suspense>
    </main>
  );
}
