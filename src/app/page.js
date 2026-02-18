import db from '../lib/db';
import HomeList from './components/HomeList';
import InfiniteScroll from './components/InfiniteScroll';
import { unstable_cache } from "next/cache";

const getCachedInitialPosts = unstable_cache(async () => getInitialPosts(), ['my-app-home-posts'], { revalidate: 30 });
export default async function HomePage() {
  // Fetch initial posts on the server
  const initialPosts = await getCachedInitialPosts();

  return <div className="home-news-container">
    <div className="home-news-section">
      <HomeList initialPosts={initialPosts} />
      <InfiniteScroll />
    </div>
  </div>;
}

// Helper to fetch initial posts server-side
async function getInitialPosts() {
  const [ques] = await db.query('SELECT id FROM node_queue where template is not null and template<>"" and template not in("premium","pic","video","general-right") order by display_order LIMIT 1 OFFSET 0');
  const qid = ques[0]?.id ? ques[0].id : 0;
  let homenewslist = [];

  let [data] = await db.query('SELECT news.id,news.title,news.eng_title,news_image.file_name,CONVERT(news.news_details USING utf8) as "news_details",if(news_image.title,news_image.title,news.title) as alt,"" as url,node_queue.template,node_queue.title as heading,node_queue.id as nodeqid FROM news left join news_image on news_image.news_id=news.id inner join sub_queue on sub_queue.news_id=news.id inner join node_queue on node_queue.id=sub_queue.node_queue_id where news.published=1 and node_queue.id=? order by sub_queue.position ', [qid]);

  if (!data || data.length === 0) {
      return [];
    }

  if (data.length) {
    for (let nws in Object.keys(data)) {
      if (data[nws]['eng_title']) {
        let newstit = JSON.stringify(data[nws]['eng_title']);
        let slug = newstit.toString().replace(/[^\w\s]/gi, '').replaceAll(' ', '-').replaceAll(/-+/gi, '-');
        data[nws]['url'] = data[nws]['id'] + '-' + slug + '.html';

      } else {
        data[nws]['url'] = data[nws]['id'] + '-news-details' + '.html';
      }
      if (data[nws]['template'] != 'youtubeshorts') {
        data[nws]['news_details'] = SubstringWithoutBreakingWords(data[nws]['news_details'], 160);
      } else {
        data[nws]['news_details'] = convertShortsToEmbed(data[nws]['news_details']);
      }
    }

  }
  //const posts=data;
  //console.log("data="+data.length);
  homenewslist[0] = data;
  return JSON.parse(JSON.stringify(homenewslist));
}


function SubstringWithoutBreakingWords(str, limit) {
  // Check if string length is within the limit
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

function convertShortsToEmbed(url) {
  // Check if the URL contains 'shorts'
  if (url.includes('youtube.com/shorts/')) {
    // Extract the video ID from the YouTube Shorts URL
    const videoId = url.split('shorts/')[1].split('?')[0]; // Get the video ID before any query parameters
    // Construct the embeddable URL
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return embedUrl;
  } else {
    return url;
  }
}