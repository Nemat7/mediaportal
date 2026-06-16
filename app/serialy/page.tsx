import CategoryPageLayout from "@/components/CategoryPageLayout";
import { fetchByCategory } from "@/lib/api";

export default async function Page() {
  const items = await fetchByCategory("serialy");
  return <CategoryPageLayout title="Сериалы" description="Многосерийные истории, от которых невозможно оторваться." items={items} />;
}
