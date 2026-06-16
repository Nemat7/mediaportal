import HeroSlider from "@/components/HeroSlider";
import CategoryRow from "@/components/CategoryRow";
import InlineSidebar from "@/components/InlineSidebar";
import RightSidebar from "@/components/RightSidebar";
import ContinueWatching from "@/components/ContinueWatching";
import { fetchHero, fetchAll, fetchByCategory, fetchPopular, fetchNew } from "@/lib/api";

export default async function HomePage() {
  const [heroItems, allVideos, popular, newVideos, kino, serialy, comedy, boevik, podcasts, show, clips] =
    await Promise.all([
      fetchHero(),
      fetchAll(),
      fetchPopular(),
      fetchNew(),
      fetchByCategory("kino"),
      fetchByCategory("serialy"),
      fetchByCategory("comedy"),
      fetchByCategory("boevik"),
      fetchByCategory("podcasts"),
      fetchByCategory("show"),
      fetchByCategory("clips"),
    ]);

  return (
    <>
      <HeroSlider items={heroItems} />
      <div className="home-layout">
        <div className="home-left"><InlineSidebar /></div>
        <main style={{ minWidth: 0 }}>
          <ContinueWatching />
          <CategoryRow title="Популярное"  slug="popular"  items={popular} />
          <CategoryRow title="Новинки"     slug="new"      items={newVideos} />
          <CategoryRow title="Кино"        slug="kino"     items={kino} />
          <CategoryRow title="Сериалы"     slug="serialy"  items={serialy} />
          <CategoryRow title="Комедия"     slug="comedy"   items={comedy} />
          <CategoryRow title="Боевик"      slug="boevik"   items={boevik} />
          <CategoryRow title="Подкасты"    slug="podcasts" items={podcasts} />
          <CategoryRow title="Шоу"         slug="show"     items={show} />
          <CategoryRow title="Клипы"       slug="clips"    items={clips} />
        </main>
        <div className="home-right"><RightSidebar items={allVideos} /></div>
      </div>
    </>
  );
}
