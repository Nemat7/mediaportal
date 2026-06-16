import CategoryPageLayout from "@/components/CategoryPageLayout";
import { fetchByCategory } from "@/lib/api";

export default async function Page() {
  const items = await fetchByCategory("comedy");
  return <CategoryPageLayout title="Комедия" description="Лучшие комедии — смейтесь от души." items={items} />;
}
