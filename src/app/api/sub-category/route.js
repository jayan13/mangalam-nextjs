import db from '@/lib/db';
import { unstable_cache } from 'next/cache';

const getSubCategoryNews = unstable_cache(
  async (limit, offset) => {
    try {
      const query = `
        SELECT 
          news.id, 
          news.title, 
          news.eng_title, 
          news_image.file_name, 
          CONVERT(news.news_details USING utf8) as news_details, 
          IF(news_image.title, news_image.title, news.title) as alt, 
          "" as url 
        FROM news 
        LEFT JOIN news_image ON news_image.news_id = news.id 
        WHERE news.published = 1 
          AND NOW() BETWEEN news.effective_date AND news.expiry_date 
        GROUP BY news.id 
        ORDER BY news.effective_date DESC 
        LIMIT ? OFFSET ?`;

      const [posts] = await db.query(query, [limit, offset]);

      const processedPosts = posts.map(post => {
        let url = post.id + '-news-details.html';
        if (post.eng_title) {
          const slug = post.eng_title
            .toString()
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_]+/g, '-')
            .replace(/^-+|-+$/g, '');
          url = post.id + '-' + slug + '.html';
        }
        return { ...post, url };
      });

      const countQuery = `
        SELECT COUNT(*) as total 
        FROM news 
        WHERE news.published = 1 
          AND NOW() BETWEEN news.effective_date AND news.expiry_date`;

      const [countResult] = await db.query(countQuery);
      const totalPosts = countResult[0].total;

      return { posts: processedPosts, totalPosts };
    } catch (error) {
      console.error('Database error in getSubCategoryNews:', error);
      return { posts: [], totalPosts: 0 };
    }
  },
  ['subcategory-news'],
  { revalidate: parseInt(process.env.QUERY_REVALIDATE || '360'), tags: ['subcategory-news'] }
);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = (page - 1) * limit;

  try {
    const { posts, totalPosts } = await getSubCategoryNews(limit, offset);
    const hasMore = offset + limit < totalPosts;
    return new Response(JSON.stringify({ posts, hasMore }), {
      status: 200,
      headers: {
        'Cache-Control': `public, s-maxage=${process.env.API_REVALIDATE || '360'}, stale-while-revalidate=60`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('API GET Error:', error);
    return new Response(JSON.stringify({ message: 'Error fetching posts' }), { status: 500 });
  }
}
