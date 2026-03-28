import db from '../../../lib/db';
import { unstable_cache } from 'next/cache';
import { getDistrictById } from '@/lib/districts';
import { getCategoryById } from '@/lib/categories';

const getHomeNews = unstable_cache(
  async (limit, offset) => {
    try {
      const [ques] = await db.query(
        'SELECT id FROM node_queue WHERE template IS NOT NULL AND template <> "" AND template NOT IN ("premium", "pic", "video", "general-right","live-updates") ORDER BY display_order, id LIMIT ? OFFSET ?',
        [limit, offset]
      );

      if (!ques.length) return { homenewslist: [], totalPosts: 0 };

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

        let newsDetails = post.news_details || '';
        if (post.template !== 'youtubeshorts') {
          newsDetails = SubstringWithoutBreakingWords(newsDetails, 160);
        } else {
          newsDetails = convertShortsToEmbed(newsDetails);
        }

        let links = post.links;
        let linkTitle = post.link_title;
        if (post.district_id) {
          const district = getDistrictById(post.district_id);
          if (district) {
            links = `/district/${district.id}-${district.slug}.html`;
            linkTitle = district.name;
          }
        } else if (post.category_id) {
          const category = getCategoryById(post.category_id);
          if (category) {
            links = `/category/${category.id}-${category.slug}.html`;
            linkTitle = category.name;
          }
        }

        return { ...post, url, news_details: newsDetails, links, link_title: linkTitle };
      });

      const [countResult] = await db.query(
        'SELECT COUNT(*) as total FROM node_queue WHERE template IS NOT NULL AND template <> "" AND template NOT IN ("premium", "pic", "video", "general-right","live-updates")'
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

function convertShortsToEmbed(input) {
  if (!input) return '';

  // Case 1: Full iframe code
  if (input.includes('<iframe')) {
    const match = input.match(/embed\/([^"?\s/]+)/);
    if (match && match[1]) {
      return match[1];
    }
  }

  // Case 2: YouTube Shorts URL
  if (input.includes('youtube.com/shorts/')) {
    return input.split('shorts/')[1].split(/[?& /]/)[0];
  }

  // Case 3: Standard YouTube URL
  if (input.includes('youtube.com/watch?v=')) {
    return input.split('v=')[1].split(/[& ]/)[0];
  }
  if (input.includes('youtu.be/')) {
    return input.split('be/')[1].split(/[?& ]/)[0];
  }

  return input;
}
