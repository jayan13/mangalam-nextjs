import db from '../lib/db';
import HomeList from './components/HomeList';
import InfiniteScroll from './components/InfiniteScroll';
import { getCategoryById } from '../lib/categories';
import { unstable_cache } from "next/cache";

// This segment cache successfully caches the ENTIRE page (HTML + DB Queries) for 360s.
export const revalidate = 360;

import { Suspense } from 'react';
import HomeListSkeleton from './components/skeletons/NewsListSkeleton';

const getCachedInitialPosts = unstable_cache(async () => getInitialPosts(), ['my-app-home-posts'], { revalidate: parseInt(process.env.QUERY_REVALIDATE || '350') });
const getCachedLeadPosts = unstable_cache(async () => getLeadFromNodeQueue(), ['my-app-live-updates-lead'], { revalidate: parseInt(process.env.QUERY_REVALIDATE || '350') });

/* 
 * WARNING: Do NOT wrap these functions in Next.js `unstable_cache` if you are using `export const revalidate = 360;`.
 * Using both causes a "stale-while-revalidate race condition". The 360s page cache will trigger a rebuild and ask the 
 * 360s data cache for data. The data cache will return STALE data (since it also expired) and the page will wrongly cache 
 * the old data for ANOTHER 6 minutes! Simply calling the DB directly here perfectly syncs with the page cache.
 */
async function HomeListWrapper() {
  //const initialPosts = await getInitialPosts();
  //const leadItems = await getLeadFromNodeQueue();
  const initialPosts = await getCachedInitialPosts();
  const leadItems = await getCachedLeadPosts();
  return <HomeList initialPosts={initialPosts} leadItems={leadItems} />;
}

export default async function HomePage() {
  return (
    <div className="home-news-container">
      <div className="home-news-section">
        <Suspense fallback={<HomeListSkeleton />}>
          <HomeListWrapper />
        </Suspense>
        <InfiniteScroll />
      </div>
    </div>
  );
}

// Helper to fetch initial posts server-side
async function getInitialPosts() {
  let homenewslist = [];
  try {
    //console.log("getInitialPosts");
    let [data] = await db.query(`SELECT 
        n.id,
        n.title,
        n.eng_title,
        ni.file_name,
        n.news_details,
        COALESCE(ni.title, n.title) AS alt,
        nq.template,
        nq.title AS heading,
        nq.id AS nodeqid,
        nc.category_id,
        n.district_id
    FROM (
        SELECT news_id, node_queue_id, position
        FROM sub_queue
        WHERE node_queue_id IN (2,4)
        ORDER BY node_queue_id, position
    ) sq
    JOIN news n ON n.id = sq.news_id
    JOIN node_queue nq ON nq.id = sq.node_queue_id
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
        AND n.effective_date <= NOW()
        AND n.expiry_date >= NOW()
    ORDER BY 
        sq.node_queue_id,
        sq.position`);

    if (!data || data.length === 0) {
      return [];
    }

    if (data.length) {
      for (let nws in Object.keys(data)) {
        let category = (data[nws]['category_id']) ? getCategoryById(data[nws]['category_id']).name.toLowerCase().replaceAll(' ', '-').replaceAll(/-+/gi, '-') + '-' : '';

        if (data[nws]['eng_title']) {
          let newstit = JSON.stringify(data[nws]['eng_title']).trim();
          let slug = newstit.toString().replace(/[^\w\s]/gi, '').replaceAll(' ', '-').replaceAll(/-+/gi, '-');
          data[nws]['url'] = 'detail/' + data[nws]['id'] + '-' + category + slug + '.html';

        } else {
          data[nws]['url'] = 'detail/' + data[nws]['id'] + '-' + category + 'news-details' + '.html';
        }
        data[nws]['template'] = 'top';

        data[nws]['news_details'] = SubstringWithoutBreakingWords(data[nws]['news_details'], 160);
      }

      //const posts=data;
      //console.log("data="+JSON.stringify(data));
      homenewslist[0] = data;
      return JSON.parse(JSON.stringify(homenewslist));

    }
  }
  catch (error) {
    console.error("DB CONNECTION FAILED:", error);
    return []; // prevent SSR crash
  }
  return [];
}

async function getLeadFromNodeQueue() {
  try {
    const [queues] = await db.query(
      'SELECT id,display_order FROM node_queue WHERE template = "live-updates" ORDER BY display_order LIMIT 1'
    );
    if (!queues.length) return [];

    const qid = queues[0].id;
    const display_from = queues[0].display_order || 0;
    const [posts] = await db.query(
      `SELECT 
          n.id, 
          n.title, 
          n.eng_title, 
          ni.file_name, 
          n.news_details, 
          COALESCE(ni.title, n.title) AS alt,
          nq.title AS heading,
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
          AND n.effective_date <= NOW()
          AND n.expiry_date >= NOW()
      ORDER BY sq.position`,
      [qid, qid]
    );

    return posts.map(post => ({
      ...post,
      url: buildUrl(post.id, post.eng_title, post.category_id),
      display_from: display_from,
      news_details: SubstringWithoutBreakingWords(post.news_details || '', 240),
    }));
  } catch (error) {
    console.error('Database error in getLeadFromNodeQueue:', error);
    return [];
  }
}


function SubstringWithoutBreakingWords(str, limit) {
  if (Buffer.isBuffer(str)) str = str.toString("utf8");
  if (typeof str !== "string") str = String(str || "");
  // Check if string length is within the limit
  if (!str) return "";
  if (str.length <= limit) {
    return str;
  }

  // Get the substring up to the limit
  let substring = str.substring(0, limit);

  // Check if the substring ends in the middle of a word
  if (str[limit] !== ' ' && substring.lastIndexOf(' ') !== -1) {
    // Find the last space before the character limit
    substring = substring.substring(0, substring.lastIndexOf(' '));
  }

  return substring;
}

function buildUrl(id, engTitle, category_id) {
  let category = (category_id) ? getCategoryById(category_id).name.toString().toLowerCase().replaceAll(' ', '-').replaceAll(/-+/gi, '-') + '-' : '';
  if (!engTitle) return `detail/${id}-${category}news-details.html`;

  const slug = engTitle.trim()
    .toString()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `detail/${id}-${category}${slug}.html`;
}

