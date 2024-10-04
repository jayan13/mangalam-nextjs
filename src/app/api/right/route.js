import db from '../../../lib/db';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '5');
  const offset = (page - 1) * limit;
  let newslist=[];
  const index=page - 1;
  try {
    // Fetch posts from the database
    let [posts] = await db.query('SELECT news.id,news.title,news.eng_title,news_image.file_name, CONVERT(news.news_details USING utf8) as "news_details",if(news_image.title,news_image.title,news.title) as alt,"" as url FROM news left join news_image on news_image.news_id=news.id where news.published=1 and NOW() between news.effective_date and news.expiry_date group by news.id order by news.effective_date DESC LIMIT ? OFFSET ?', [limit, offset]);

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
           }
       }
    
    newslist[0]=posts;
    // Count total number of posts for pagination
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM  news where news.published=1 and NOW() between news.effective_date and news.expiry_date');
    const totalPosts = countResult[0].total;
    const hasMore = offset + limit < totalPosts;
    return new Response(JSON.stringify({ newslist, hasMore }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Error fetching posts' }), { status: 500 });
  }
}