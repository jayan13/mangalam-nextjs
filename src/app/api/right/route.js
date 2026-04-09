import db from '@/lib/db';
import { unstable_cache } from 'next/cache';
import { getCategoryById } from '@/lib/categories';

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
        'SELECT n.id,n.title,n.eng_title, ni.file_name, n.news_details, COALESCE(ni.title, n.title) AS alt, "" AS url, nq.template, nq.title AS heading, nq.id AS nodeqid, n.district_id, nc.category_id FROM ( SELECT news_id, position FROM sub_queue WHERE node_queue_id = ?  ORDER BY position ) sq JOIN news n ON n.id = sq.news_id JOIN node_queue nq  ON nq.id = ? LEFT JOIN news_image ni  ON ni.id = (  SELECT MIN(id)        FROM news_image WHERE news_id = n.id ) LEFT JOIN news_category nc  ON nc.id = ( SELECT MIN(id)  FROM news_category  WHERE news_id = n.id   ) WHERE  n.published = 1  AND n.effective_date < NOW() ORDER BY sq.position',
        [qid,qid]
      );

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
