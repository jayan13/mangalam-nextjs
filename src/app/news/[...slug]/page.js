
import db from '../../../lib/db';
import InfiniteScroll from '../../components/InfiniteScroll';
import Image from "next/image";
//import { Metadata } from 'next';
import { unstable_cache } from "next/cache";

 export async function getDetails(news_id){
    let [rows] = await db.query('SELECT news.id,news.title,news.eng_title,DATE_FORMAT(news.effective_date, "%d %b %Y, %l:%i %p") as posting_date,CONVERT(news.news_details USING utf8) as "news_details",news.meta_keywords,news.meta_description,news.author,news.author_photo,columnist.name as columnist FROM news left join columnist on columnist.id=news.columnist_id where news.id=?',news_id);    
    return rows;
}

export async function getImages(news_id){
  let [rows] = await db.query('SELECT file_name FROM news_image where news_id=?',news_id);    
  return rows;
}

const getCachedNewsDet = unstable_cache(async (id) => getDetails(id), ['my-app-news']);
const getCachedImages = unstable_cache(async (id) => getImages(id), ['my-app-images']);

  function Newd(props) {
    const newsdetails= props.det;
    return ( (newsdetails.url)? <article key={'imgc'+newsdetails.id}> <Image src={'/'+newsdetails.url} key={'img'+newsdetails.id} alt={newsdetails.title} width={924} height={555}/>  <p className='article' key={newsdetails.id} dangerouslySetInnerHTML={{ __html: newsdetails.value }} /></article> : <article key={'imgc'+newsdetails.id}><p className='article' key={newsdetails.id} dangerouslySetInnerHTML={{ __html: newsdetails.value }} /></article>);
  }

  export async function generateMetadata({ params }) {
    const urlid= params.slug[0];
    const news_id= urlid.split('-')[0];
    const rows =await getCachedNewsDet(news_id);
    //const [rows] = await db.query('SELECT eng_title FROM news where id=? ',news_id);
    return {
      title: rows[0].eng_title,
    }
  }

export default async function News({params}) {
    
    const urlid= params.slug[0];
    const news_id= urlid.split('-')[0];
    let newses=[];
    let detail=[];
    let detarry=[];
    if (news_id){
        
        //const [rows] = await db.query('SELECT * FROM news where id=? ',news_id);
        const rows =await getCachedNewsDet(news_id);
        newses=rows       
        detail=newses[0].news_details.toString().replaceAll("[BREAK]","").replace(/(?:\r\n|\r|\n)/g, '<br>').split('[IMG]');
        //const [prows] = await db.query('SELECT file_name FROM news_image where news_id=? ',news_id);
        const prows =await getCachedImages(news_id);
        
        let imgar=[];
        for(let p of prows)
        { 
            imgar.push(p.file_name);
        }
        for (const [i, val] of detail.entries()) {
            let imgurl='';
            if(imgar[i])
            {
                imgurl=imgar[i];
            }
            detarry.push({ id: news_id+i, value: val,url:imgurl,title:newses[0].eng_title });
        }
        //console.log(detarry);
    }
    return ( 
        <div class="home-news-container">
          <div className='home-news-section'> 
            <div className='singlenews-left'>                     
              <h1>{newses[0].title}</h1> 
                <p class="news-meta">Authored by <a href="#" title="title text">{(newses[0].author)?newses[0].author:newses[0].columnist} </a>| {newses[0].posting_date}</p>
                  <div key={newses[0].id}> 
                  {detarry.map((news) => <Newd det={news} />)}
                  </div>                    
            </div>
            <div className='home-news-section-right'>
            <InfiniteScroll />
            </div> 
          </div>
        </div>
    );
}