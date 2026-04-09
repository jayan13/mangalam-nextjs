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
        `SELECT 
            n.id, 
            n.title, 
            n.eng_title, 
            ni.file_name, 
            n.news_details, 
            COALESCE(ni.title, n.title) AS alt, 
            nq.template, 
            nq.title AS heading, 
            nq.id AS nodeqid, 
            n.district_id, 
            nc.category_id
        FROM (
            SELECT news_id, position
            FROM sub_queue
            WHERE node_queue_id = ?
            ORDER BY position
        ) sq
        JOIN news n ON n.id = sq.news_id
        JOIN node_queue nq ON nq.id = ?
        LEFT JOIN news_image ni 
            ON ni.id = (
                SELECT MIN(id) FROM news_image WHERE news_id = n.id
            )
        LEFT JOIN news_category nc 
            ON nc.id = (
                SELECT MIN(id) FROM news_category WHERE news_id = n.id
            )
        WHERE 
            n.published = 1
            AND n.effective_date < NOW()
        ORDER BY sq.position`,
        [qid, qid]
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
  if (Buffer.isBuffer(str)) str = str.toString("utf8");
  if (typeof str !== "string") str = String(str || "");
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
  if (Buffer.isBuffer(input)) input = input.toString("utf8");
  if (typeof input !== "string") input = String(input || "");

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
