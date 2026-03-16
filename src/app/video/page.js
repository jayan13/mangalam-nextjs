import db from '@/lib/db';
import VideoList from '../components/VideoList';
import Link from 'next/link';
import Image from "next/image";
import { unstable_cache } from "next/cache";
import { Suspense } from 'react';
import NewsListSkeleton from '../components/skeletons/NewsListSkeleton';

const CATEGORY_ID = 8068; // Videos live 8160 test local 8068

export const metadata = {
  title: 'Videos - Mangalam',
  description: 'Latest videos and news reports from Mangalam.'
};

const getCachedInitialPosts = unstable_cache(
  async () => getInitialPosts(CATEGORY_ID),
  [`my-app-videos-posts-${CATEGORY_ID}`],
  { revalidate: 360 }
);

async function VideoListWrapper() {
  const initialPosts = await getCachedInitialPosts();
  return <VideoList initialPosts={initialPosts} allids={CATEGORY_ID} />;
}

export default async function VideoPage() {
  const bred = (
    <nav className="c-navigation-breadcrumbs" aria-label="Breadcrumb" vocab="https://schema.org/">
      <ol className="c-navigation-breadcrumbs__directory">
        <li className="c-navigation-breadcrumbs__item" property="itemListElement">
          <Link className="c-navigation-breadcrumbs__link" href="/" property="item">
            <Image src="/img/icons/home.svg" width={20} height={20} alt="Home" />
            <span className="u-visually-hidden" property="name">Home</span>
          </Link>
          <meta property="position" content="1" />
        </li>
        <li className="c-navigation-breadcrumbs__item" property="itemListElement">
          <span property="name">Videos</span>
          <meta property="position" content="2" />
        </li>
      </ol>
    </nav>
  );

  return (
    <div className='home-news-container'>
      {bred}
      <div className="category-header">
        <h1>Videos</h1>
      </div>
      <div className='home-news-section' >
        <Suspense fallback={<NewsListSkeleton />}>
          <VideoListWrapper />
        </Suspense>
      </div>
    </div>
  );
}

async function getInitialPosts(category_id) {
  try {
    const query = `
      SELECT
        news.id,
        news.title,
        CONVERT(news.news_details USING utf8) as news_details,
        news_category.category_id
      FROM news_category
      INNER JOIN news ON news.id = news_category.news_id
      WHERE news.published = 1
        AND NOW() BETWEEN news.effective_date AND news.expiry_date
        AND news_category.category_id = ?
      GROUP BY news.id
      ORDER BY news.effective_date DESC
      LIMIT 0, 8`;

    const [data] = await db.query(query, [category_id]);

    return [data];
  } catch (error) {
    console.error('Database error in getInitialPosts (Videos):', error);
    return [[]];
  }
}
