import db from '@/lib/db';
import { unstable_cache } from 'next/cache';

const getDistrictNews = unstable_cache(
  async (district, limit, offset) => {
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
          news.district_id 
        FROM news 
        LEFT JOIN news_image ON news_image.news_id = news.id 
        WHERE news.published = 1 
          AND NOW() BETWEEN news.effective_date AND news.expiry_date 
          AND news.district_id = ? 
        GROUP BY news.id 
        ORDER BY news.effective_date DESC 
        LIMIT ? OFFSET ?`;

      const [posts] = await db.query(query, [district, limit, offset]);

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
          AND NOW() BETWEEN news.effective_date AND news.expiry_date 
          AND district_id = ?`;

      const [countResult] = await db.query(countQuery, [district]);
      const totalPosts = countResult[0].total;

      return { posts: processedPosts, totalPosts };
    } catch (error) {
      console.error('Database error in getDistrictNews:', error);
      return { posts: [], totalPosts: 0 };
    }
  },
  ['district-news'],
  { revalidate: parseInt(process.env.QUERY_REVALIDATE || '360'), tags: ['district-news'] }
);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '8');
  const district = parseInt(searchParams.get('district') || '12');
  const offset = (page - 1) * limit;

  try {
    const { posts, totalPosts } = await getDistrictNews(district, limit, offset);
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
    return new Response(JSON.stringify({ message: 'Error fetching posts' }), { status: 500 });
  }
}
