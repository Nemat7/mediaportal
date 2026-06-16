import CategoryPageLayout from "@/components/CategoryPageLayout";
import { fetchNew } from "@/lib/api";

export default async function Page() {
  const items = await fetchNew();
  return <CategoryPageLayout title="Новинки" description="Свежий контент — только что добавлено." items={items} />;
}
