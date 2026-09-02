import type { Metadata } from "next";
import { Suspense, use } from "react";
import CategoryMenuView from "@/components/CategoryMenuView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    alternates: {
      canonical: `/category/${id}`,
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


