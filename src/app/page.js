import db from '../lib/db';
import HomeList from './components/HomeList';
import InfiniteScroll from './components/InfiniteScroll';
import { unstable_cache } from "next/cache";

export const revalidate = 360;

const getCachedInitialPosts = unstable_cache(async () => getInitialPosts(), ['my-app-home-posts'], { revalidate: parseInt(process.env.QUERY_REVALIDATE || '360') });
const getCachedLeadPosts = unstable_cache(async () => getLeadFromNodeQueue(), ['my-app-live-updates-lead'], { revalidate: parseInt(process.env.QUERY_REVALIDATE || '360') });
import { Suspense } from 'react';
import HomeListSkeleton from './components/skeletons/NewsListSkeleton';

async function HomeListWrapper() {
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

    let [data] = await db.query('SELECT news.id,news.title,news.eng_title,news_image.file_name,CONVERT(news.news_details USING utf8) as "news_details",if(news_image.title,news_image.title,news.title) as alt,"" as url,node_queue.template,node_queue.title as heading,node_queue.id as nodeqid,news_category.category_id,news.district_id FROM news left join news_image on news_image.news_id=news.id inner join sub_queue on sub_queue.news_id=news.id inner join node_queue on node_queue.id=sub_queue.node_queue_id left join news_category on news_category.news_id=news.id where news.published=1 and NOW() between news.effective_date and news.expiry_date and node_queue.id in(2,4) GROUP BY news.id order by node_queue.id,sub_queue.position ');

    if (!data || data.length === 0) {
      return [];
    }

    if (data.length) {
      for (let nws in Object.keys(data)) {
        if (data[nws]['eng_title']) {
          let newstit = JSON.stringify(data[nws]['eng_title']);
          let slug = newstit.toString().replace(/[^\w\s]/gi, '').replaceAll(' ', '-').replaceAll(/-+/gi, '-');
          data[nws]['url'] = 'detail/' + data[nws]['id'] + '-' + slug + '.html';

        } else {
          data[nws]['url'] = 'detail/' + data[nws]['id'] + '-news-details' + '.html';
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
    const display_from= queues[0].display_order || 0;
    const [posts] = await db.query(
      `SELECT 
        news.id, 
        news.title, 
        news.eng_title, 
        news_image.file_name, 
        CONVERT(news.news_details USING utf8) AS news_details, 
        IF(news_image.title, news_image.title, news.title) AS alt,
        node_queue.title as heading
      FROM news 
      LEFT JOIN news_image ON news_image.news_id = news.id 
      INNER JOIN sub_queue ON sub_queue.news_id = news.id 
      INNER JOIN node_queue ON node_queue.id = sub_queue.node_queue_id 
      WHERE news.published = 1 and NOW() between news.effective_date and news.expiry_date
        AND node_queue.id = ? 
      GROUP BY news.id 
      ORDER BY sub_queue.position`,
      [qid]
    );

    return posts.map(post => ({
      ...post,
      url: buildUrl(post.id, post.eng_title),
      display_from: display_from,
      news_details: SubstringWithoutBreakingWords(post.news_details || '', 240),
    }));
  } catch (error) {
    console.error('Database error in getLeadFromNodeQueue:', error);
    return [];
  }
}


function SubstringWithoutBreakingWords(str, limit) {
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

function buildUrl(id, engTitle) {
  if (!engTitle) return `detail/${id}-news-details.html`;
  const slug = engTitle
    .toString()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `detail/${id}-${slug}.html`;
}

