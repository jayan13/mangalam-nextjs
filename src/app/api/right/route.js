import db from '@/lib/db';
import { unstable_cache } from 'next/cache';

const getRightNews = unstable_cache(
  async (limit, offset) => {
    try {
      const query = `
        SELECT 
          news.id, 
          news.title, 
          news.eng_title, 
          news_image.file_name, 
          IF(news_image.title, news_image.title, news.title) as alt, 
          "" as url, 
          node_queue.template, 
          node_queue.title as heading 
        FROM news 
        LEFT JOIN news_image ON news_image.news_id = news.id 
        INNER JOIN sub_queue ON sub_queue.news_id = news.id 
        INNER JOIN node_queue ON node_queue.id = sub_queue.node_queue_id 
        WHERE news.published = 1 
          AND node_queue.template IS NOT NULL 
          AND node_queue.template <> "" 
          AND node_queue.template IN ("premium", "pic", "video", "general-right") 
        GROUP BY CONCAT(node_queue.id, "-", sub_queue.news_id) 
        ORDER BY node_queue.display_order, sub_queue.position 
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
        SELECT COUNT(DISTINCT(CONCAT(node_queue.id, "-", sub_queue.news_id))) as total 
        FROM news 
        LEFT JOIN news_image ON news_image.news_id = news.id 
        INNER JOIN sub_queue ON sub_queue.news_id = news.id 
        INNER JOIN node_queue ON node_queue.id = sub_queue.node_queue_id 
        WHERE news.published = 1 
          AND node_queue.template IS NOT NULL 
          AND node_queue.template <> "" 
          AND node_queue.template IN ("premium", "pic", "video", "general-right")`;

      const [countResult] = await db.query(countQuery);
      const totalPosts = countResult[0].total;

      return { posts: [processedPosts], totalPosts };
    } catch (error) {
      console.error('Database error in getRightNews:', error);
      return { posts: [], totalPosts: 0 };
    }
  },
  ['right-news'],
  { revalidate: parseInt(process.env.QUERY_REVALIDATE || '360'), tags: ['right-news'] }
);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '5');
  const offset = (page - 1) * limit;

  try {
    const { posts, totalPosts } = await getRightNews(limit, offset);
    const hasMore = offset + limit < totalPosts;

    return new Response(JSON.stringify({ newslist: posts, hasMore }), {
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
