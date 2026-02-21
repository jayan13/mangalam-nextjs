import db from '../../../lib/db';
import { unstable_cache } from 'next/cache';

const getTagNews = unstable_cache(
  async (tag, limit, offset) => {
    try {
      // Fetch posts from the database
      let [posts] = await db.query('SELECT news.id,news.title,news.eng_title,news_image.file_name,CONVERT(news.news_details USING utf8) as "news_details",if(news_image.title,news_image.title,news.title) as alt,"" as url,news_tags.tags_id FROM news_tags inner join news on news.id=news_tags.news_id left join news_image on news_image.news_id=news.id where news.published=1 and NOW() between news.effective_date and news.expiry_date and news_tags.tags_id=?  group by news.id order by news.effective_date DESC LIMIT ? OFFSET ?', [tag, limit, offset]);

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

      const [countResult] = await db.query('SELECT COUNT(*) as total FROM  news_tags inner join news on news.id=news_tags.news_id where news.published=1 and NOW() between news.effective_date and news.expiry_date and news_tags.tags_id= ?', [tag]);
      const totalPosts = countResult[0].total;

      return { posts, totalPosts };
    } catch (error) {
      console.error('Database error in getTagNews:', error);
      return { posts: [], totalPosts: 0 };
    }
  },
  ['tag-news'],
  { revalidate: 360, tags: ['tag-news'] }
);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '8');
  const tag = parseInt(searchParams.get('tag') || '12');
  const offset = (page - 1) * limit;

  try {
    const { posts, totalPosts } = await getTagNews(tag, limit, offset);
    const hasMore = offset + limit < totalPosts;
    return new Response(JSON.stringify({ distnewslist: [posts], hasMore }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Error fetching posts' }), { status: 500 });
  }
}
