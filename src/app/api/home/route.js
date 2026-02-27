import db from '../../../lib/db';
import { unstable_cache } from 'next/cache';

const getHomeNews = unstable_cache(
  async (limit, offset) => {
    try {
      const [ques] = await db.query(
        'SELECT id FROM node_queue WHERE template IS NOT NULL AND template <> "" AND template NOT IN ("premium", "pic", "video", "general-right") ORDER BY display_order LIMIT ? OFFSET ?',
        [limit, offset]
      );

      if (!ques.length) return { homenewslist: [], totalPosts: 0 };

      const qid = ques[0].id;

      const [posts] = await db.query(
        'SELECT news.id, news.title, news.eng_title, news_image.file_name, CONVERT(news.news_details USING utf8) AS news_details, IF(news_image.title, news_image.title, news.title) AS alt, "" AS url, node_queue.template, node_queue.title AS heading, node_queue.id AS nodeqid, news.district_id, district.name AS district, "" AS links, "" AS link_title FROM news LEFT JOIN news_image ON news_image.news_id = news.id INNER JOIN sub_queue ON sub_queue.news_id = news.id INNER JOIN node_queue ON node_queue.id = sub_queue.node_queue_id LEFT JOIN district ON district.id = news.district_id WHERE news.published = 1 AND node_queue.id = ? ORDER BY sub_queue.position',
        [qid]
      );

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

        let newsDetails = post.news_details || '';
        if (post.template !== 'youtubeshorts') {
          newsDetails = SubstringWithoutBreakingWords(newsDetails, 160);
        } else {
          newsDetails = convertShortsToEmbed(newsDetails);
        }

        let links = post.links;
        let linkTitle = post.link_title;
        if (post.district_id) {
          links = '/district/' + post.district_id + '-' + post.district + '.html';
          linkTitle = post.district;
        }

        return { ...post, url, news_details: newsDetails, links, link_title: linkTitle };
      });

      const [countResult] = await db.query(
        'SELECT COUNT(*) as total FROM node_queue WHERE template IS NOT NULL AND template <> "" AND template NOT IN ("premium", "pic", "video", "general-right")'
      );
      const totalPosts = countResult[0].total;

      return { homenewslist: [processedPosts], totalPosts };
    } catch (error) {
      console.error('Database error in getHomeNews:', error);
      return { homenewslist: [], totalPosts: 0 };
    }
  },
  ['home-news'],
  { revalidate: parseInt(process.env.QUERY_REVALIDATE || '360'), tags: ['home-news'] }
);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '1');
  const offset = (page - 1) * limit;

  try {
    const { homenewslist, totalPosts } = await getHomeNews(limit, offset);
    const hasMore = offset + limit < totalPosts;
    return new Response(JSON.stringify({ homenewslist, hasMore }), {
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

function SubstringWithoutBreakingWords(str, limit) {
  if (!str) return '';
  if (str.length <= limit) {
    return str;
  }
  let substring = str.substring(0, limit);
  if (str[limit] !== ' ' && substring.lastIndexOf(' ') !== -1) {
    substring = substring.substring(0, substring.lastIndexOf(' '));
  }
  return substring;
}

function convertShortsToEmbed(url) {
  if (url && url.includes('youtube.com/shorts/')) {
    const videoId = url.split('shorts/')[1].split('?')[0];
    return videoId;
  } else {
    return url;
  }
}
