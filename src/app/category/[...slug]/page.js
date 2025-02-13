
import db from '../../../lib/db';
import InfiniteScroll from '../../components/InfiniteScroll';
import Catnews from '../../components/Catnews';
import Link from 'next/link';
import Image from "next/image";
//import SubcatLink from '../../components/SubcatLink';
import { unstable_cache } from "next/cache";

export async function getCategory(cat_id){
    let [rows] = await db.query('SELECT name,parent_id FROM category where id=?',cat_id);    
    return rows;
  }

  export async function getCategorys(cat_id){
    let [rows] = await db.query('SELECT id,name,concat("/category/",id,"-",REPLACE(LOWER(name)," ","-"),".html") as links FROM category where status=1 and parent_id=? order by list_order',cat_id);    
    return rows;
  }

    
const getCachedCategory = unstable_cache(async (id) => getCategory(id),(id) => [`my-app-category-${id}`],{ revalidate: 360});
const getCachedCategorys = unstable_cache(async (id) => getCategorys(id),(id) => [`my-app-categorys-${id}`],{ revalidate: 360});
const getCachedInitialPosts = unstable_cache(async (id) => getInitialPosts(id), (id) => [`my-app-categorys-posts-${id}`],{ revalidate: 360});

export default async function Home({params}) {
    const urlid= params.slug[0];
    const category_id= urlid.split('-')[0];
    const rows =await getCachedCategory(category_id);
    let cats = await getCachedCategorys(category_id);
    const initialPosts = await getCachedInitialPosts(category_id); 
    let catlink='';
    let bred='';
    let br1='';
    if(rows[0].parent_id)
    {
        let [pcats] = await db.query('SELECT name,id,concat("/category/",id,"-",REPLACE(LOWER(name)," ","-"),".html") as links FROM category where id=?',rows[0].parent_id);
        if(pcats.length)
        {
            br1=<li className="c-navigation-breadcrumbs__item" property="itemListElement" typeof="ListItem">
            <Link className="c-navigation-breadcrumbs__link" href={`${pcats[0].links}`} property="item" typeof="WebPage">
              <span property="name">{pcats[0].name}</span>
            </Link>
            <meta property="position" content="2" />
          </li>;
        }
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
            {br1}
            <li className="c-navigation-breadcrumbs__item" property="itemListElement" typeof="ListItem">
              <span property="name">{rows[0].name}</span>
                <meta property="position" content="3" />
            </li>
          </ol>
        </nav>  
        
    
    if(cats.length){
        
        catlink=<div class="category-sublinks">
            <ul>
            {cats.map((cat,index) => (
                <li key={index}><Link href={`${cat.links}`}>{cat.name}</Link></li>
            ))}    
            </ul>
            </div>;
    }
   
        return (
            <div className='home-news-container'>
                {bred}
               <div className="category-header"><h1>{rows[0].name}</h1>
                {catlink}
               </div>
               <div className='home-news-section' >
                    <Catnews initialPosts={initialPosts} category_id={category_id} />
                    <InfiniteScroll />
               </div>
            </div>
        );
   
    
}

async function getInitialPosts(category_id) {

    let distnewslist=[];
    let [data] = await db.query('SELECT news.id,news.title,news.eng_title,news_image.file_name,CONVERT(news.news_details USING utf8) as "news_details",if(news_image.title,news_image.title,news.title) as alt,"" as url,news_category.category_id FROM news_category inner join news on news.id=news_category.news_id left join news_image on news_image.news_id=news.id where news.published=1 and NOW() between news.effective_date and news.expiry_date and news_category.category_id=?  group by news.id order by news.effective_date DESC limit 0,8', [category_id]);
    //let data=getCachedInitialPosts([category_id]);
    //console.log(data);
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