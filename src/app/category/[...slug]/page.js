import db from '@/lib/db';
import InfiniteScroll from '../../components/InfiniteScroll';
import Catnews from '../../components/Catnews';
import Link from 'next/link';
import Image from "next/image";
import { unstable_cache } from "next/cache";
import { getCategoryById, getSubCategories, getCategoryBySlug } from '@/lib/categories';
import { Suspense } from 'react';
import NewsListSkeleton from '../../components/skeletons/NewsListSkeleton';

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const urlid = slug[0];
  const parts = urlid.split('-');
  const idValue = parseInt(parts[0]);

  let category = null;
  if (!isNaN(idValue)) {
    category = getCategoryById(idValue);
  } else if (urlid) {
    category = getCategoryBySlug(urlid.replace('.html', ''));
  }

  if (category) {
    return {
      title: `${category.name} - Mangalam`,
      description: `Latest news and updates from ${category.name} category on Mangalam.`
    };
  }
  return { title: 'Category - Mangalam' };
}

const getCachedInitialPosts = unstable_cache(
  async (id) => getInitialPosts(id),
  (id) => [`my-app-categorys-posts-${id}`],
  { revalidate: parseInt(process.env.QUERY_REVALIDATE || '360') }
);

async function CatnewsWrapper({ category_id }) {
  const initialPosts = await getCachedInitialPosts(category_id);
  return <Catnews initialPosts={initialPosts} category_id={category_id} />;
}

export default async function Home({ params }) {
  const { slug } = await params;
  const urlid = slug[0];

  const parts = urlid.split('-');
  let category_id = parseInt(parts[0]);
  let category = null;

  if (!isNaN(category_id)) {
    category = getCategoryById(category_id);
  }

  if (!category && urlid) {
    category = getCategoryBySlug(urlid.replace('.html', ''));
    if (category) category_id = category.id;
  }

  if (!category || !category_id) {
    return <div className="home-news-container"><h1>Category not found.</h1></div>;
  }

  const subCategories = category.children || [];
  let catlink = '';
  let bred = '';
  let br1 = '';

  if (category.parent_id) {
    const parentCategory = getCategoryById(category.parent_id);
    if (parentCategory) {
      br1 = (
        <li className="c-navigation-breadcrumbs__item" property="itemListElement">
          <Link className="c-navigation-breadcrumbs__link" href={parentCategory.link} property="item">
            <span property="name">{parentCategory.name}</span>
          </Link>
          <meta property="position" content="2" />
        </li>
      );
    }
  }

  bred = (
    <nav className="c-navigation-breadcrumbs" aria-label="Breadcrumb" vocab="https://schema.org/">
      <ol className="c-navigation-breadcrumbs__directory">
        <li className="c-navigation-breadcrumbs__item" property="itemListElement">
          <Link className="c-navigation-breadcrumbs__link" href="/" property="item">
            <Image src="/img/icons/home.svg" width={20} height={20} alt="Home" />
            <span className="u-visually-hidden" property="name">Home</span>
          </Link>
          <meta property="position" content="1" />
        </li>
        {br1}
        <li className="c-navigation-breadcrumbs__item" property="itemListElement">
          <span property="name">{category.name}</span>
          <meta property="position" content="3" />
        </li>
      </ol>
    </nav>
  );

  if (subCategories.length) {
    catlink = (
      <div className="category-sublinks">
        <ul>
          {subCategories.map((sub, index) => (
            <li key={index}>
              <Link href={sub.link}>{sub.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className='home-news-container'>
      {bred}
      <div className="category-header"><h1>{category.name}</h1>
        {catlink}
      </div>
      <div className='home-news-section' >
        <Suspense fallback={<NewsListSkeleton />}>
          <CatnewsWrapper category_id={category_id} />
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
      let url = '/news/' + post.id + '-news-details.html';
      if (post.eng_title) {
        const slug = post.eng_title
          .toString()
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_]+/g, '-')
          .replace(/^-+|-+$/g, '');
        url = '/news/' + post.id + '-' + slug + '.html';
      }

      return {
        ...post,
        url,
        news_details: SubstringWithoutBreakingWords(post.news_details || '', 160)
      };
    });

    return [processedData];
  } catch (error) {
    console.error('Database error in getInitialPosts:', error);
    return [[]];
  }
}

function SubstringWithoutBreakingWords(str, limit) {
  // Check if string length is within the limit
  if (str.length <= limit) {
    return str;
  }

  // Get the substring up to the limit
  let substring = str.substring(0, limit);

  // Check if the substring ends in the middle of a word
  if (str[limit] !== ' ' && substring.lastIndexOf(' ') !== -1) {
    // Find the last space before the character limit
    substring = substring.substring(0, substring.lastIndexOf(' '));
  }

  return substring;
}