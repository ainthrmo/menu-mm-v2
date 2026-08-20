import CustomerMenu from "@/components/customerMenu";

export default async function RestaurantMenuPage({
  params,
}: {
  params: Promise<{ restaurantSlug: string }>;
}) {
  const { restaurantSlug } = await params;

  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <CustomerMenu restaurantSlug={restaurantSlug} />
    </main>
  );
}
