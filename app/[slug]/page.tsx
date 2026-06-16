import { notFound } from "next/navigation";
import CategoryPageLayout from "@/components/CategoryPageLayout";
import { fetchByCategory } from "@/lib/api";
import { categories, getCategoryLabel } from "@/lib/data";

const DESCRIPTIONS: Record<string, string> = {
  kino:     "Лучшие фильмы таджикского и мирового кинематографа.",
  serialy:  "Популярные сериалы на любой вкус.",
  comedy:   "Смешные комедии для отличного настроения.",
  boevik:   "Захватывающие боевики и экшн-фильмы.",
  podcasts: "Интересные подкасты на разные темы.",
  show:     "Лучшие шоу и развлекательные программы.",
  clips:    "Музыкальные клипы и видеозарисовки.",
};

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const isKnown = categories.some((c) => c.slug === slug);
  if (!isKnown) notFound();

  const items = await fetchByCategory(slug);
  return (
    <CategoryPageLayout
      title={getCategoryLabel(slug)}
      description={DESCRIPTIONS[slug]}
      items={items}
    />
  );
}
