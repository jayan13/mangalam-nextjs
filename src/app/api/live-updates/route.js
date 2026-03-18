import db from '@/lib/db';
import { unstable_cache } from 'next/cache';

const getLiveUpdatesByCategory = unstable_cache(
  async (categoryId) => {
    try {
      let catId = categoryId;
      if (!catId) {
        const [rows] = await db.query(
          'SELECT id FROM category WHERE UPPER(name) = "LIVE UPDATES" LIMIT 1'
        );
        catId = rows?.[0]?.id || null;
      }

      if (!catId) return [];

      const [posts] = await db.query(
        `SELECT 
          news.id,
          news.title,
          news.eng_title,
          CONVERT(news.news_details USING utf8) AS news_details,          
          news.effective_date
        FROM news_category
        INNER JOIN news ON news.id = news_category.news_id        
        WHERE news.published = 1
          AND NOW() BETWEEN news.effective_date AND news.expiry_date
          AND news_category.category_id = ?
        GROUP BY news.id
        ORDER BY news.effective_date DESC
        LIMIT 30`,
        [catId]
      );

      return posts.map(post => ({
        ...post,
        url: buildUrl(post.id, post.eng_title),
        news_details: SubstringWithoutBreakingWords(post.news_details || '', 240),
      }));
    } catch (error) {
      console.error('Database error in getLiveUpdatesByCategory:', error);
      return [];
    }
  },
  ['live-updates-category'],
  { revalidate: parseInt(process.env.QUERY_REVALIDATE || '360'), tags: ['live-updates-category'] }
);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const categoryParam = searchParams.get('category');
  const categoryId = categoryParam ? parseInt(categoryParam, 10) : null;

  try {
    const updates = await getLiveUpdatesByCategory(Number.isNaN(categoryId) ? null : categoryId);

    return new Response(JSON.stringify({ updates }), {
      status: 200,
      headers: {
        'Cache-Control': `public, s-maxage=${process.env.API_REVALIDATE || '360'}, stale-while-revalidate=60`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('API GET Error:', error);
    return new Response(JSON.stringify({ message: 'Error fetching live updates' }), { status: 500 });
  }
}

function buildUrl(id, engTitle) {
  if (!engTitle) return `detail/${id}-news-details.html`;
  const slug = engTitle
    .toString()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `detail/${id}-${slug}.html`;
}

function SubstringWithoutBreakingWords(str, limit) {
  if (!str) return '';
  if (str.length <= limit) return str;
  let substring = str.substring(0, limit);
  if (str[limit] !== ' ' && substring.lastIndexOf(' ') !== -1) {
    substring = substring.substring(0, substring.lastIndexOf(' '));
  }
  return substring;
}
