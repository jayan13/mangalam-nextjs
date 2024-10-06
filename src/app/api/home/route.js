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
    
    let [posts] = await db.query('SELECT news.id,news.title,news.eng_title,news_image.file_name,CONVERT(news.news_details USING utf8) as "news_details",if(news_image.title,news_image.title,news.title) as alt,"" as url,node_queue.template,node_queue.title as heading,node_queue.id as nodeqid FROM news left join news_image on news_image.news_id=news.id inner join sub_queue on sub_queue.news_id=news.id inner join node_queue on node_queue.id=sub_queue.node_queue_id where news.published=1 and node_queue.id=? order by sub_queue.position ', [qid]);
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
               posts[nws]['news_details']=SubstringWithoutBreakingWords(posts[nws]['news_details'],160);
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