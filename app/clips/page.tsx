import CategoryPageLayout from "@/components/CategoryPageLayout";
import { fetchByCategory } from "@/lib/api";

export default async function Page() {
  const items = await fetchByCategory("clips");
  return <CategoryPageLayout title="Клипы" description="Музыкальные клипы таджикских исполнителей." items={items} />;
}
