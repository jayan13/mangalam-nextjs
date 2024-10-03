import db from '../../lib/db';
import Link from 'next/link';
import Image from "next/image";
import { unstable_cache } from "next/cache";

const fetchData = unstable_cache(async () => {
    const [rows] = await db.query('SELECT news.id,news.title,news.eng_title,news_image.file_name, CONVERT(news.news_details USING utf8) as "news_details",if(news_image.title,news_image.title,news.title) as alt,"" as url FROM news left join news_image on news_image.news_id=news.id where news.published=1 and NOW() between news.effective_date and news.expiry_date group by news.id order by news.effective_date DESC limit 0,10');
    return rows;
  }, ['news-list'],{ revalidate: 60 }); // Cache data for 60 seconds

  function Newimg(props) {
    const newsimage= props.news;
    return ( (newsimage.file_name!=null)? <Image src={'/'+newsimage.file_name} alt="A portrait of me" width="600" height="362" loading="lazy"  /> : <div>No Image</div>);
  }

export default async function Users() {
    const data = await fetchData();
    //console.log(data);
    //const [rows] = await db.query('SELECT id,title,eng_title FROM news ');
    //'uploads/author';
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
    

    const rows=data;
   

    
    return (
        
        <div className="home-news-section">
        <div className="news-item">
        <ul> 
            {rows.map((news) => (
                <li key={news.id}>
                    
                    <figure>
                    <Newimg news={news}/>
                    </figure>
                    <Link href={`/news/${news.url}`}>
                    <h3>   {news.title} </h3>
                    </Link>
                </li>
            ))}
        </ul>
        </div>
    </div>
    );
}


