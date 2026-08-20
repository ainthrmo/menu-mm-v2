import CategoryMenuView from "@/components/CategoryMenuView";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;

  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <CategoryMenuView categorySlug={categorySlug} />
    </main>
  );
}
