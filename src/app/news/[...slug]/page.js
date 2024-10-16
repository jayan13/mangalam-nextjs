
import db from '../../../lib/db';
import InfiniteScroll from '../../components/InfiniteScroll';
import Image from "next/image";
import Link from 'next/link';
import { unstable_cache } from "next/cache";

 export async function getDetails(news_id){
    let [rows] = await db.query('SELECT news.id,news.title,news.eng_title,DATE_FORMAT(news.effective_date, "%d %b %Y, %l:%i %p") as posting_date,CONVERT(news.news_details USING utf8) as news_details,news.meta_keywords,news.meta_description,news.author,news.author_photo,columnist.name as columnist,district.name AS district,news.district_id,c.category_id as category_id FROM news left join columnist on columnist.id=news.columnist_id LEFT JOIN (SELECT category_id,news_id FROM news_category) c ON c.news_id = news.id LEFT JOIN district ON district.id = news.district_id where news.id=? group by news.id',news_id);    
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
    //const [rows] = await db.query('SELECT COALESCE(eng_title,title) as title,meta_description FROM news where id=? ',news_id);
    const tit=(rows[0]['eng_title']!='')? rows[0]['eng_title'] :'Mangalam-Latest Kerala News';
    const des=(rows[0]['meta_description']!='')? rows[0].meta_description :'Mangalam-Latest Kerala News, Malayalam News,  Politics, Malayalam Cinema, Sports';
    //console.log(news_id+'title'+tit);
    return {
      title: tit,
      description: des
    }
  }
  
export default async function News({params}) {
    
    const urlid= params.slug[0];
    const news_id= urlid.split('-')[0];
    let newses=[];
    let detail=[];
    let detarry=[];
    let br1='';
    let br2='';
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

        if(newses[0].category_id)
        {
          let [cats] = await db.query('SELECT name,parent_id FROM category where id=?',newses[0].category_id);
          const catname=cats[0].name;
          const catlink=catname.replace(" ", "-");
          br1=<li className="c-navigation-breadcrumbs__item" property="itemListElement" typeof="ListItem">
                <Link className="c-navigation-breadcrumbs__link" href={`/category/${newses[0].category_id}-${catlink}.html`} property="item" typeof="WebPage">
                  <span property="name">{catname}</span>
                </Link>
                <meta property="position" content="2" />
              </li>;

          if(cats[0].parent_id)
          {
            let [cats2] = await db.query('SELECT name FROM category where id=?',cats[0].parent_id);
            const catname2=cats2[0].name;
            const catlink2=catname2.replace(" ", "-");
            br2=<li className="c-navigation-breadcrumbs__item" property="itemListElement" typeof="ListItem">
                  <Link className="c-navigation-breadcrumbs__link" href={`/category/${cats[0].parent_id}-${catlink2}.html`} property="item" typeof="WebPage">
                    <span property="name">{catname2}</span>
                  </Link>
                  <meta property="position" content="3" />
                </li>;
          }
          
        }else if(newses[0].district_id)
        {
          br1=<li className="c-navigation-breadcrumbs__item" property="itemListElement" typeof="ListItem">
              <Link className="c-navigation-breadcrumbs__link" href={`/district/${newses[0].district_id}-${newses[0].district}.html`} property="item" typeof="WebPage">
                <span property="name">{newses[0].district}</span>
              </Link>
              <meta property="position" content="2" />
              </li>;
        }
        
    }

    return ( 
        <div className="home-news-container">
          <div className='home-news-section'> 
            <div className='singlenews-left'>
              <div className='single-section-header'>

                      <nav className="c-navigation-breadcrumbs" aria-label="Breadcrumb" vocab="https://schema.org/" typeof="BreadcrumbList">
                        <ol className="c-navigation-breadcrumbs__directory">
                          <li className="c-navigation-breadcrumbs__item" property="itemListElement" typeof="ListItem">
                            <Link className="c-navigation-breadcrumbs__link" href="/" property="item" typeof="WebPage">
                              <Image src="/img/icons/home.svg" width={20} height={20} alt="Home" />
                              <span className="u-visually-hidden" property="name">Home</span>
                            </Link>
                            <meta property="position" content="1" />
                          </li>
                          {br1}
                          {br2}
                        </ol>
                      </nav>
                
              </div>
              <div className='single-news-content'>                    
                <h1>{newses[0].title}</h1> 
                <div class="news-single-meta">
                <p className="news-meta">Authored by <Link href="#" title="title text">{(newses[0].author)?newses[0].author:newses[0].columnist} </Link>| Last updated: {newses[0].posting_date} | 3 min read</p>
                <div class="printshare">
                <a href="#" title="Print News"><Image src="/img/icons/printer.svg" width={32} height={32} alt="Print" /></a>
                <a href="#" title="Share News"><Image src="/img/icons/share.svg" width={32} height={32} alt="Share" /></a>
                <a href="#" title="Listen News" class="listen-news"><Image src="/img/icons/play-icon-small.svg" width={9} height={12} alt="Share" /> Start Listen</a>
                </div>
                </div>
                
                  <div key={newses[0].id}> 
                  {detarry.map((news,index) => <Newd det={news} key={index}  />)}
                  </div>
                  {/* English Summary */}
                  <div class="newsextra-container">
                    <h3>English Summary</h3>
                    <p>Gold prices are at an all-time high! Before you buy gold jewelry, understand the factors influencing price, from taxes and HUID to making charges, insurance, and smart savings schemes.</p>
                  </div>
                  {/* English Summary Closed */}

                  {/*Tags*/}
                  <div class="newsextra-container">
                    <h3>Tags</h3>
                  <ul class="tags">
  <li><a href="#" class="tag">KERALAM</a></li>
  <li><a href="#" class="tag">INDIA</a></li>
  <li><a href="#" class="tag">POLITICS</a></li>
  <li><a href="#" class="tag">MALAYALAM</a></li>
</ul>
</div>
 {/*Tags Closed*/}

{/* About the Author */}
<div class="about-author">
 <h3>About Author:</h3>
<div class="author-profile">
 <Image src="/img/icons/author.png" width={80} height={80} alt="Author photo" />
 <div class="author-details">
 <h4>പ്രണവ് മേലേതിൽ</h4>
 <p>പതിനൊന്ന് വർഷമായി മാധ്യമപ്രവർത്തകൻ. ലൈഫ്‌സ്റ്റൈൽ, എന്റർടെയ്ൻമെന്റ്, ഗാഡ്ജറ്റ്സ്, ഓട്ടോമൊബൈൽ തുടങ്ങിയ മേഖലകളിൽ ലേഖനങ്ങളെഴുതുന്നു.</p>
 </div>
</div>
</div>

{/* About the Author Closed*/}
              </div>                     
            </div>
            
            <InfiniteScroll />
            
          </div>
        </div>
    );
}