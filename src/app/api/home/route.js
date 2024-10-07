import db from '../../../lib/db';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '1');
  const offset = (page - 1) * limit;
  let homenewslist=[];

  try {
    // Fetch posts from the database
    const [ques] = await db.query('SELECT id FROM node_queue where template is not null and template<>"" and template not in("premium","pic","video","general-right") order by display_order LIMIT ? OFFSET ?', [limit, offset]);
    const qid=ques[0].id;
    
    let [posts] = await db.query('SELECT news.id,news.title,news.eng_title,news_image.file_name,CONVERT(news.news_details USING utf8) AS "news_details",IF(news_image.title, news_image.title, news.title) AS alt,"" AS url,  node_queue.template,node_queue.title AS heading,node_queue.id AS nodeqid,news.district_id,district.name AS district,"" as links,"" as link_title FROM news LEFT JOIN news_image ON news_image.news_id = news.id INNER JOIN sub_queue ON sub_queue.news_id = news.id INNER JOIN node_queue ON node_queue.id = sub_queue.node_queue_id LEFT JOIN district ON district.id = news.district_id  WHERE  news.published = 1 AND node_queue.id = ? ORDER BY sub_queue.position', [qid]);
    if(posts.length)
      {
           for (let nws in Object.keys(posts)) {
               if(posts[nws]['eng_title']){
                   let newstit=JSON.stringify(posts[nws]['eng_title']);
                   let slug=newstit.toString().replace(/[^\w\s]/gi, '').replaceAll(' ','-').replaceAll(/-+/gi, '-');
                   posts[nws]['url']=posts[nws]['id']+'-'+slug+'.html';
                   
               }else{
                posts[nws]['url']=posts[nws]['id']+'-news-details'+'.html';
               }
               if(posts[nws]['template']!='youtubeshorts'){ 
                posts[nws]['news_details']=SubstringWithoutBreakingWords(posts[nws]['news_details'],160);
               }else{
                posts[nws]['news_details']=convertShortsToEmbed(posts[nws]['news_details']);
                
               }
               if(posts[nws]['district_id']){ 
                  posts[nws]['links']='/district/'+posts[nws]['district_id']+'-'+posts[nws]['district']+'.html';
                  posts[nws]['link_title']=posts[nws]['district'];
               }
           }
       }
    homenewslist[0]=posts;
    // Count total number of posts for pagination
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM node_queue where template is not null and template<>"" and template not in("premium","pic","video","general-right")');
    const totalPosts = countResult[0].total;
    const hasMore = offset + limit < totalPosts;
    return new Response(JSON.stringify({ homenewslist, hasMore }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Error fetching posts' }), { status: 500 });
  }
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