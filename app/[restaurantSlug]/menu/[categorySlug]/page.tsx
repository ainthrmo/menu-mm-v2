import CategoryMenuView from "@/components/CategoryMenuView";

export default async function RestaurantCategoryPage({
  params,
}: {
  params: Promise<{ restaurantSlug: string; categorySlug: string }>;
}) {
  const { restaurantSlug, categorySlug } = await params;

  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <CategoryMenuView
        restaurantSlug={restaurantSlug}
        categorySlug={categorySlug}
      />
    </main>
  );
}
