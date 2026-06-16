import CategoryPageLayout from "@/components/CategoryPageLayout";
import { fetchByCategory } from "@/lib/api";

export default async function Page() {
  const items = await fetchByCategory("podcasts");
  return <CategoryPageLayout title="Подкасты" description="Интересные беседы, интервью и образовательный контент." items={items} />;
}
