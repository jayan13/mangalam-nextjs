import db from '../lib/db';
import HomeList from './components/HomeList';
import InfiniteScroll from './components/InfiniteScroll';
export default async function HomePage() {
  // Fetch initial posts on the server
  const initialPosts = await getInitialPosts();

  return   <div className="home-news-container">
    <div className="home-news-section">
      <div className="home-news-section-left">
        <HomeList initialPosts={initialPosts} />
      </div>
      
        <InfiniteScroll />
      
  </div>
  </div>;
}

// Helper to fetch initial posts server-side
async function getInitialPosts() {
  let [data] = await db.query('SELECT news.id,news.title,news.eng_title,news_image.file_name, CONVERT(news.news_details USING utf8) as "news_details",if(news_image.title,news_image.title,news.title) as alt,"" as url FROM news left join news_image on news_image.news_id=news.id where news.published=1 and NOW() between news.effective_date and news.expiry_date group by news.id order by news.effective_date DESC LIMIT 10');
  if(data.length)
    {
         for (let nws in Object.keys(data)) {
             if(data[nws]['eng_title']){
                 let newstit=JSON.stringify(data[nws]['eng_title']);
                 let slug=newstit.toString().replace(/[^\w\s]/gi, '').replaceAll(' ','-').replaceAll(/-+/gi, '-');
                 data[nws]['url']=data[nws]['id']+'-'+slug+'.html';
                 
             }else{
                 data[nws]['url']=data[nws]['id']+'-news-details'+'.html';
             }
         }
     }
  //const posts=data;
  //console.log(data);
  return JSON.parse(JSON.stringify(data));
}
 

