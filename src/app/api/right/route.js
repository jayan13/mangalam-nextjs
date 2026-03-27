import db from '@/lib/db';
import { unstable_cache } from 'next/cache';

const getRightNews = unstable_cache(
  async (limit, offset) => {
    try {

      const [ques] = await db.query(
        'SELECT id FROM node_queue WHERE template IS NOT NULL AND template <> "" AND template  IN ("premium", "pic", "video", "general-right") ORDER BY display_order, id LIMIT ? OFFSET ?',
        [limit, offset]
      );
      if (!ques.length) return { posts: [], totalPosts: 0 };

      const qid = ques[0].id;

      const [posts] = await db.query(
        'SELECT news.id, news.title, news.eng_title, news_image.file_name, CONVERT(news.news_details USING utf8) AS news_details, IF(news_image.title, news_image.title, news.title) AS alt, "" AS url, node_queue.template, node_queue.title AS heading, node_queue.id AS nodeqid, news.district_id, news_category.category_id, "" AS links, "" AS link_title FROM news LEFT JOIN news_image ON news_image.news_id = news.id INNER JOIN sub_queue ON sub_queue.news_id = news.id INNER JOIN node_queue ON node_queue.id = sub_queue.node_queue_id LEFT JOIN news_category ON news_category.news_id = news.id WHERE news.published = 1 AND node_queue.id = ? GROUP BY news.id ORDER BY sub_queue.position',
        [qid]
      );

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
        return { ...post, url };
      });

      const [countResult] = await db.query(
        'SELECT COUNT(*) as total FROM node_queue WHERE template IS NOT NULL AND template <> "" AND template  IN ("premium", "pic", "video", "general-right")'
      );
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
  const limit = parseInt(searchParams.get('limit') || '1');
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
