import CategoryPageLayout from "@/components/CategoryPageLayout";
import { fetchByCategory } from "@/lib/api";

export default async function Page() {
  const items = await fetchByCategory("show");
  return <CategoryPageLayout title="Шоу" description="Телешоу, ток-шоу и развлекательные программы." items={items} />;
}
