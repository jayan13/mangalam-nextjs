import db from '@/lib/db';
import { unstable_cache } from 'next/cache';
import { getCategoryById } from '@/lib/categories';

const getCategoryNews = unstable_cache(
  async (category, limit, offset) => {
    try {
      const query = `
        SELECT 
            n.id, 
            n.title, 
            n.eng_title, 
            ni.file_name,
            COALESCE(ni.title, n.title) AS alt, 
            "" AS url, 
            nc.category_id
        FROM (
            SELECT n.id, n.title, n.eng_title, n.effective_date
            FROM news n
            JOIN news_category nc 
                ON nc.news_id = n.id
            WHERE 
                n.published = 1
                AND n.effective_date < NOW()
                AND nc.category_id IN ( ? )
                
            ORDER BY n.effective_date DESC
            LIMIT ? OFFSET ?
        ) n
        LEFT JOIN news_image ni 
            ON ni.id = (
                SELECT MIN(id) 
                FROM news_image 
                WHERE news_id = n.id
            )
        LEFT JOIN news_category nc 
            ON nc.news_id = n.id
        ORDER BY n.effective_date DESC`;
        
      const [posts] = await db.query(query, [category, limit, offset]);

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
        return { ...post, url };
      });

      const countQuery = `
        SELECT COUNT(*) as total 
        FROM news_category 
        INNER JOIN news ON news.id = news_category.news_id 
        WHERE news.published = 1 
          AND NOW() > news.effective_date 
          AND news_category.category_id IN (?) `;

      const [countResult] = await db.query(countQuery, [category]);
      const totalPosts = countResult[0].total;

      return { posts: processedPosts, totalPosts };
    } catch (error) {
      console.error('Database error in getCategoryNews:', error);
      return { posts: [], totalPosts: 0 };
    }
  },
  ['category-news'],
  { revalidate: parseInt(process.env.QUERY_REVALIDATE || '360'), tags: ['category-news'] }
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
    const { posts, totalPosts } = await getCategoryNews(finalCategory, limit, offset);
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
