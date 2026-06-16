import CategoryPageLayout from "@/components/CategoryPageLayout";
import { fetchByCategory } from "@/lib/api";

export default async function Page() {
  const items = await fetchByCategory("kino");
  return <CategoryPageLayout title="Кино" description="Лучшие фильмы таджикского и мирового кинематографа." items={items} />;
}
