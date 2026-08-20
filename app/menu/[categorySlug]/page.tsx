import { Suspense, use } from "react";
import CategoryMenuView from "@/components/CategoryMenuView";

function CategorySlugContent({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = use(params);
  return <CategoryMenuView categorySlug={categorySlug} />;
}

export default function CategorySlugPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <Suspense fallback={<div className="min-h-screen bg-[#F8F7F4]" />}>
        <CategorySlugContent params={params} />
      </Suspense>
    </main>
  );
}


