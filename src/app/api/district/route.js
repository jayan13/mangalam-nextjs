import db from '@/lib/db';
import { unstable_cache } from 'next/cache';
import { getCategoryById } from '@/lib/categories';
const getDistrictNews = unstable_cache(
  async (district, limit, offset) => {
    try {
      const query = `SELECT 
            n.id, 
            n.title, 
            n.eng_title, 
            ni.file_name, 
            COALESCE(ni.title, n.title) AS alt, 
            n.district_id,
            d.name AS district_name,
            nc.category_id
        FROM (
            SELECT id, title, eng_title, district_id, effective_date
            FROM news
            WHERE 
                published = 1
                AND effective_date < NOW()
                AND district_id = ?   -- or other condition
            ORDER BY effective_date DESC
            LIMIT ? OFFSET ?
        ) n
        LEFT JOIN district d ON d.id = n.district_id
        LEFT JOIN news_image ni 
            ON ni.id = (
                SELECT MIN(id) FROM news_image WHERE news_id = n.id
            )
        LEFT JOIN news_category nc 
            ON nc.id = (
                SELECT MIN(id) FROM news_category WHERE news_id = n.id
            )
        ORDER BY n.effective_date DESC`;

      const [posts] = await db.query(query, [district, district, district, limit, offset]);

      const processedPosts = posts.map(post => {
        let category = (post.category_id) ? getCategoryById(post.category_id).name.toLowerCase().replaceAll(' ', '-').replaceAll(/-+/gi, '-') + '-' : '';
        let url = 'detail/' + post.id + '-' + category + 'news-details.html';
        if (post.eng_title) {
          const slug = post.eng_title
            .toString()
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_]+/g, '-')
            .replace(/^-+|-+$/g, '');
          url = 'detail/' + post.id + '-' + category + slug + '.html';
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
          AND NOW() > news.effective_date  
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
