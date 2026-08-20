import { Suspense, use } from "react";
import CategoryMenuView from "@/components/CategoryMenuView";

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


