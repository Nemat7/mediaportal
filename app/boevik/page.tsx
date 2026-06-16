import CategoryPageLayout from "@/components/CategoryPageLayout";
import { fetchByCategory } from "@/lib/api";

export default async function Page() {
  const items = await fetchByCategory("boevik");
  return <CategoryPageLayout title="Боевик" description="Захватывающие боевики и экшн-фильмы." items={items} />;
}
