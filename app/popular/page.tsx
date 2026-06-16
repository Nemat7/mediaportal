import CategoryPageLayout from "@/components/CategoryPageLayout";
import { fetchPopular } from "@/lib/api";

export default async function Page() {
  const items = await fetchPopular();
  return <CategoryPageLayout title="Популярное" description="Самое популярное на платформе прямо сейчас." items={items} />;
}
