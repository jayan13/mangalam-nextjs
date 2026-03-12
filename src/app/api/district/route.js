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
          news.district_id,
          district.name as district_name
        FROM news 
        LEFT JOIN news_image ON news_image.news_id = news.id 
        LEFT JOIN district ON district.id = news.district_id
        WHERE news.published = 1 
          AND NOW() BETWEEN news.effective_date AND news.expiry_date 
          AND ((? = 0 AND news.district_id != 0 AND news.district_id IS NOT NULL) OR (? != 0 AND news.district_id = ?)) 
        GROUP BY news.id 
        ORDER BY news.effective_date DESC 
        LIMIT ? OFFSET ?`;

      const [posts] = await db.query(query, [district, district, district, limit, offset]);

      const processedPosts = posts.map(post => {
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

        let links = "";
        if (post.district_id && post.district_name) {
             const dist_slug = post.district_name.toLowerCase().replace(/ /g, '-');
             links = `/district/${post.district_id}-${dist_slug}.html`;
        }

        return { ...post, url, links, link_title: post.district_name };
      });

      const countQuery = `
        SELECT COUNT(*) as total 
        FROM news 
        WHERE news.published = 1 
          AND NOW() BETWEEN news.effective_date AND news.expiry_date 
          AND ((? = 0 AND district_id != 0 AND district_id IS NOT NULL) OR (? != 0 AND district_id = ?))`;

      const [countResult] = await db.query(countQuery, [district, district, district]);
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
