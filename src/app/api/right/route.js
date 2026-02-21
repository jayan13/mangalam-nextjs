import db from '../../../lib/db';
import { unstable_cache } from 'next/cache';

const getRightNews = unstable_cache(
  async (limit, offset) => {
    try {
      // Fetch posts from the database
      let [posts] = await db.query('SELECT news.id,news.title,news.eng_title,news_image.file_name,if(news_image.title,news_image.title,news.title) as alt,"" as url,node_queue.template,node_queue.title as heading FROM news left join news_image on news_image.news_id=news.id inner join sub_queue on sub_queue.news_id=news.id inner join node_queue on node_queue.id=sub_queue.node_queue_id where news.published=1 and node_queue.template is not null and node_queue.template<>"" and node_queue.template in("premium","pic","video","general-right") group by concat(node_queue.id,"-",sub_queue.news_id) order by node_queue.display_order,sub_queue.position LIMIT ? OFFSET ?', [limit, offset]);

      if (posts.length) {
        for (let nws in Object.keys(posts)) {
          if (posts[nws]['eng_title']) {
            let newstit = JSON.stringify(posts[nws]['eng_title']);
            let slug = newstit.toString().replace(/[^\w\s]/gi, '').replaceAll(' ', '-').replaceAll(/-+/gi, '-');
            posts[nws]['url'] = posts[nws]['id'] + '-' + slug + '.html';
          } else {
            posts[nws]['url'] = posts[nws]['id'] + '-news-details' + '.html';
          }
        }
      }

      const [countResult] = await db.query('SELECT  COUNT(DISTINCT(concat(node_queue.id,"-",sub_queue.news_id))) as total FROM news left join news_image on news_image.news_id=news.id inner join sub_queue on sub_queue.news_id=news.id inner join node_queue on node_queue.id=sub_queue.node_queue_id where news.published=1 and node_queue.template is not null and node_queue.template<>"" and node_queue.template in("premium","pic","video","general-right")');
      const totalPosts = countResult[0].total;

      return { posts, totalPosts };
    } catch (error) {
      console.error('Database error in getRightNews:', error);
      return { posts: [], totalPosts: 0 };
    }
  },
  ['right-news'],
  { revalidate: 360, tags: ['right-news'] }
);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '5');
  const offset = (page - 1) * limit;

  try {
    const { posts, totalPosts } = await getRightNews(limit, offset);
    const hasMore = offset + limit < totalPosts;
    return new Response(JSON.stringify({ newslist: [posts], hasMore }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Error fetching posts' }), { status: 500 });
  }
}
