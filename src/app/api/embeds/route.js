import db from '@/lib/db';
import { unstable_cache } from 'next/cache';

const getCategoryEmbeds = unstable_cache(
  async (category, limit, offset) => {
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
          AND news_category.category_id IN (?) 
        GROUP BY news.id 
        ORDER BY news.effective_date DESC 
        LIMIT ? OFFSET ?`;
      const [posts] = await db.query(query, [category, limit, offset]);

      const countQuery = `
        SELECT COUNT(*) as total 
        FROM news_category 
        INNER JOIN news ON news.id = news_category.news_id 
        WHERE news.published = 1 
          AND NOW() BETWEEN news.effective_date AND news.expiry_date 
          AND news_category.category_id IN (?) `;

      const [countResult] = await db.query(countQuery, [category]);
      const totalPosts = countResult[0].total;

      return { posts, totalPosts };
    } catch (error) {
      console.error('Database error in getCategoryEmbeds:', error);
      return { posts: [], totalPosts: 0 };
    }
  },
  ['category-embeds'],
  { revalidate: parseInt(process.env.QUERY_REVALIDATE || '360'), tags: ['category-embeds'] }
);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '8');
  const categoryParam = searchParams.get('category') || '12';

  let category;
  if (categoryParam === 'undefined' || !categoryParam) {
    category = [12];
  } else if (categoryParam.includes(',')) {
    category = categoryParam.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
  } else {
    category = [parseInt(categoryParam)].filter(id => !isNaN(id));
  }

  // Ensure we have at least one valid category ID
  const finalCategory = category.length > 0 ? category : [12];
  const offset = (page - 1) * limit;

  try {
    const { posts, totalPosts } = await getCategoryEmbeds(finalCategory, limit, offset);
    const hasMore = offset + limit < totalPosts;
    return new Response(JSON.stringify({ distnewslist: [posts], hasMore }), {
      status: 200,
      headers: {
        'Cache-Control': `public, s-maxage=${process.env.API_REVALIDATE || '360'}, stale-while-revalidate=60`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('API GET Error:', error);
    return new Response(JSON.stringify({ message: 'Error fetching embeds' }), { status: 500 });
  }
}
