

import db from '../../../lib/db';
import InfiniteScroll from '../../components/InfiniteScroll';
import Image from "next/image";
import Link from 'next/link';
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
    let catlink='';
    if(dists.length){
        
        catlink=<div class="category-sublinks">
            <ul>
            {dists.map((cat,index) => (
                <li key={index}><Link href={`/district/${cat.links}.html`}>{cat.name}</Link></li>
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
