import db from '../../../lib/db';
import InfiniteScroll from '../../components/InfiniteScroll';
import Distnews from '../../components/Distnews';
import Link from 'next/link';
import Image from "next/image";
import { unstable_cache } from "next/cache";

export async function getDist(dis_id){
    let [rows] = await db.query('SELECT name FROM district where id=?',dis_id);    
    return rows;
  }
  
const getCachedDistrict = unstable_cache(async (id) => getDist(id), ['my-app-district']);

export async function getDists(){
    let [rows] = await db.query('SELECT id,name,concat(id,"-",LOWER(name)) as links FROM district order by sort_order');    
    return rows;
  }
  
const getCachedDistricts = unstable_cache(async () => getDists(), ['my-app-districts']);

export default async function Home({params}) {
    const urlid= params.slug[0];
    const district_id= urlid.split('-')[0];
    const rows =await getCachedDistrict(district_id);
    const dists=await getCachedDistricts();
    const initialPosts = await getInitialPosts(district_id);
    let catlink='';
    let bred='';
    if(dists.length){
        
        catlink=<div className="category-sublinks">
            <ul>
            {dists.map((cat,index) => (
                <li key={index}><Link href={`/district/${cat.links}.html`}>{cat.name}</Link></li>
            ))}    
            </ul>
            </div>;
    }
    bred=<nav className="c-navigation-breadcrumbs" aria-label="Breadcrumb" vocab="https://schema.org/" typeof="BreadcrumbList">
          <ol className="c-navigation-breadcrumbs__directory">
            <li className="c-navigation-breadcrumbs__item" property="itemListElement" typeof="ListItem">
              <Link className="c-navigation-breadcrumbs__link" href="/" property="item" typeof="WebPage">
                <Image src="/img/icons/home.svg" width={20} height={20} alt="Home" />
                <span className="u-visually-hidden" property="name">Home</span>
              </Link>
              <meta property="position" content="1" />
            </li>
            <li className="c-navigation-breadcrumbs__item" property="itemListElement" typeof="ListItem">
              <span property="name">{rows[0].name}</span>
                <meta property="position" content="3" />
            </li>
          </ol>
        </nav>  

    return (
        <div className='home-news-container'>
            {bred}
           <div className="category-header"><h1>{rows[0].name}</h1>
            {catlink}
           </div>
           <div className='home-news-section' >
                <Distnews initialPosts={initialPosts} district_id={district_id} />
                <InfiniteScroll />
           </div>
        </div> 
    );
}

async function getInitialPosts(district_id) {

    let distnewslist=[];
    let [data] = await db.query('SELECT news.id,news.title,news.eng_title,news_image.file_name,CONVERT(news.news_details USING utf8) as "news_details",if(news_image.title,news_image.title,news.title) as alt,"" as url,news.district_id FROM news left join news_image on news_image.news_id=news.id where news.published=1 and NOW() between news.effective_date and news.expiry_date and news.district_id=?  group by news.id order by news.effective_date DESC limit 0,8', [district_id]);
  
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
               
            data[nws]['news_details']=SubstringWithoutBreakingWords(data[nws]['news_details'],160);
               
           }
  
       }
    //const posts=data;
    //console.log(data);
    distnewslist[0]=data;
    return JSON.parse(JSON.stringify(distnewslist));
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