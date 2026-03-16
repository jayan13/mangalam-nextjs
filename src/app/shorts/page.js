import db from '@/lib/db';
import EmbedList from '../components/EmbedList';
import InfiniteScroll from '../components/InfiniteScroll';
import Link from 'next/link';
import Image from "next/image";
import { unstable_cache } from "next/cache";
import { Suspense } from 'react';
import NewsListSkeleton from '../components/skeletons/NewsListSkeleton';

const CATEGORY_ID = 8162; // Shorts live 6162 test local 8067

export const metadata = {
  title: 'Shorts - Mangalam',
  description: 'Latest news shorts and quick updates from Mangalam.'
};

const getCachedInitialPosts = unstable_cache(
  async () => getInitialPosts(CATEGORY_ID),
  () => [`my-app-shorts-posts`],
  { revalidate: 360 }
);

async function EmbedListWrapper() {
  const initialPosts = await getCachedInitialPosts();
  return <EmbedList initialPosts={initialPosts} allids={CATEGORY_ID} />;
}

export default async function ShortsPage() {
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
          <span property="name">Shorts</span>
          <meta property="position" content="2" />
        </li>
      </ol>
    </nav>
  );

  return (
    <div className='home-news-container'>
      {bred}
      <div className="category-header">
        <h1>Shorts</h1>
      </div>
      <div className='home-news-section' >
        <Suspense fallback={<NewsListSkeleton />}>
          <EmbedListWrapper />
        </Suspense>
        <InfiniteScroll />
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
        news.eng_title,
        news_image.file_name,
        CONVERT(news.news_details USING utf8) as news_details,
        IF(news_image.title, news_image.title, news.title) as alt,
        "" as url,
        news_category.category_id
      FROM news_category
      INNER JOIN news ON news.id = news_category.news_id
      LEFT JOIN news_image ON news_image.news_id = news.id
      WHERE news.published = 1
        AND NOW() BETWEEN news.effective_date AND news.expiry_date
        AND news_category.category_id = ?
      GROUP BY news.id
      ORDER BY news.effective_date DESC
      LIMIT 0, 8`;

    const [data] = await db.query(query, [category_id]);

    const processedData = data.map(post => {
      let url = 'detail/' + post.id + '-news-details.html';
      if (post.eng_title) {
        const slug = post.eng_title
          .toString()
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_]+/g, '-')
          .replace(/^-+|-+$/g, '');
        url = 'detail/' + post.id + '-' + slug + '.html';
      }

      return {
        ...post,
        url
      };
    });

    return [processedData];
  } catch (error) {
    console.error('Database error in getInitialPosts (Shorts):', error);
    return [[]];
  }
}
