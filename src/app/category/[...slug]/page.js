
import db from '../../../lib/db';
import InfiniteScroll from '../../components/InfiniteScroll';
import Image from "next/image";
import Link from 'next/link';
import { unstable_cache } from "next/cache";

export async function getCategory(cat_id){
    let [rows] = await db.query('SELECT name,parent_id FROM category where id=?',cat_id);    
    return rows;
  }

  export async function getCategorys(cat_id){
    let [rows] = await db.query('SELECT id,name,REPLACE(concat(id,"-",LOWER(name))," ","-") as links FROM category where status=1 and parent_id=? order by list_order',cat_id);    
    return rows;
  }
  
const getCachedCategory = unstable_cache(async (id) => getCategory(id), ['my-app-category']);
const getCachedCategorys = unstable_cache(async (id) => getCategorys(id), ['my-app-categorys']);

export default async function Home({params}) {
    const urlid= params.slug[0];
    const category_id= urlid.split('-')[0];
    const rows =await getCachedCategory(category_id);
    let cats = await getCachedCategorys(category_id); 
    let catlink='';
    if(cats.length){
        
        catlink=<div class="category-sublinks">
            <ul>
            {cats.map((cat,index) => (
                <li key={index}><Link href={`/category/${cat.links}.html`}>{cat.name}</Link></li>
            ))}    
            </ul>
            </div>;
    }

    return (
        <div className='home-news-container'>
           <div className="category-header"><h1>{rows[0].name}</h1>
            {catlink}
           </div>
           <div className='home-news-section' >
                <div className='home-news-section-left'>
                    
                </div>
                <div className='home-news-section-right'>
                <InfiniteScroll />
                </div>

           </div>
        </div>
    );
}
