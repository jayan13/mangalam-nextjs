
import db from '../../../lib/db';
import InfiniteScroll from '../../components/InfiniteScroll';
import SocialSharePopup from "../../components/SocialSharePopup";
import Printpage from "../../components/Printpage";
import ListenToArticle from "../../components/ListenToArticle";
import Image from "next/image";
import Link from 'next/link';
import { unstable_cache } from "next/cache";

const pageUrl = process.env.BASEURL+'/';

 export async function getDetails(news_id){
    let [rows] = await db.query('SELECT news.id,news.title,news.eng_title,news.eng_summary,DATE_FORMAT(news.effective_date, "%d %b %Y, %l:%i %p") as posting_date,CONVERT(news.news_details USING utf8) as news_details,concat("/news/",news.id,"-",REPLACE(LOWER(news.eng_title)," ","-"),".html") as url,news.meta_keywords,news.meta_description,news.author,news.author_photo,news.author_profile,columnist.name as columnist,columnist.photo as columnist_photo,columnist.profile as columnist_profile,district.name AS district,news.district_id,c.category_id as category_id FROM news left join columnist on columnist.id=news.columnist_id LEFT JOIN (SELECT category_id,news_id FROM news_category) c ON c.news_id = news.id LEFT JOIN district ON district.id = news.district_id where news.id=? group by news.id',news_id);    
    return rows;
}

export async function getImages(news_id){
  let [rows] = await db.query('SELECT file_name FROM news_image where news_id=?',news_id);    
  return rows;
}

export async function getTags(news_id){
  let [rows] = await db.query('SELECT news_tags.tags_id,tags.name,concat("/tags/",news_tags.tags_id,"-",REPLACE(LOWER(tags.name)," ","-"),".html") as url FROM `news_tags` left join `tags` on tags.id=news_tags.tags_id where news_tags.news_id=?',news_id);    
  return rows;
}

export async function getCategory(cat_id){
  let [rows] = await db.query('SELECT name,parent_id FROM category where id=?',cat_id);    
  return rows;
}

const getCachedNewsDet = unstable_cache(async (id) => getDetails(id), (id) => [`my-app-news-${id}`],{ revalidate: 360});
const getCachedImages = unstable_cache(async (id) => getImages(id), (id) => [`my-app-images-${id}`],{ revalidate: 360});
const getCachedTags = unstable_cache(async (id) => getTags(id), (id) => [`my-app-tags-${id}`],{ revalidate: 360});
const getCachedCat = unstable_cache(async (id) => getCategory(id), (id) => [`my-app-bcats-${id}`],{ revalidate: 360});

  function Newd(props) {
    const newsdetails= props.det;
    return ( (newsdetails.url)? <article key={'imgc'+newsdetails.id}> <Image src={'/'+newsdetails.url} key={'img'+newsdetails.id} alt={newsdetails.title} width={924} height={555}/>  <p className='article' key={newsdetails.id} dangerouslySetInnerHTML={{ __html: newsdetails.value }} /></article> : <article key={'imgc'+newsdetails.id}><p className='article' key={newsdetails.id} dangerouslySetInnerHTML={{ __html: newsdetails.value }} /></article>);
  }

  function Tags(props)
  {
    const tgs= props.tgs;
    if(tgs.length)
    {
      return (<div className="newsextra-container no-printme">
        <h3>Tags</h3>
        <ul className="tags">
        {tgs.map((newst, index) => (
            <li key={index}><Link href={`${newst.url}`} className="tag">{newst.name}</Link></li>
             ))}   
        </ul>
        </div>
      );
    }else{
      return ('');
    }

  }

  function Summay(props)
  {
    const engsum= props.engsum;
    if(engsum)
    {
      return (<div className="newsextra-container no-printme">
        <h3>English Summary</h3>
        <p>{engsum}</p>
      </div>);
    }else{
      return ('');
    }
    
  }

  function Auther(props)
  {
    const nws= props.nws;
    let author='';
    let author_photo='';
    let author_profile='';
    if(nws.columnist)
    {
      author=nws.columnist;
      author_photo=nws.columnist_photo;
      author_profile=nws.columnist_profile;

    }else{

      author=nws.author;
      author_photo=nws.author_photo;
      author_profile=nws.author_profile;

    }
    
    if(author)
    {
      return (
        <div className="about-author no-printme">
          <h3>About Author:</h3>
          <div className="author-profile">
            <Image src={'/'+author_photo} width={80} height={80} alt="Author photo" />
            <div className="author-details">
              <h4>{author}</h4>
              <p>{author_profile}</p>
            </div>
          </div>
        </div>
      );
    }else{
      return ('');
    }
    

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
    let newstags=[];
    let rdtime=1;
    
   
    if (news_id){
        
        //const [rows] = await db.query('SELECT * FROM news where id=? ',news_id);
        const rows =await getCachedNewsDet(news_id);
        newses=rows;
        newstags =await getCachedTags(news_id);
        detail=newses[0].news_details.toString().replaceAll("[BREAK]","").replace(/(?:\r\n|\r|\n)/g, '<br>').split('[IMG]');
        //const [prows] = await db.query('SELECT file_name FROM news_image where news_id=? ',news_id);
        const text = newses[0].news_details;
        const wpm = 225;
        const words = text.trim().split(/\s+/).length;
        rdtime = Math.ceil(words / wpm);
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
          
          //let [cats] = await db.query('SELECT name,parent_id FROM category where id=?',newses[0].category_id);
          let cats = await getCachedCat(newses[0].category_id);
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
            //let [cats2] = await db.query('SELECT name FROM category where id=?',cats[0].parent_id);
            let cats2 = await getCachedCat(cats[0].parent_id);
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
              <div className='single-section-header no-printme'>

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
              <div className='single-news-content' id='news-content-print'>                    
                <h1>{newses[0].title}</h1> 
                <div className="news-single-meta">
                  <div className="single-meta">
                    <p className="news-meta">Authored by <Link href="#" title="title text">{(newses[0].author)?newses[0].author:newses[0].columnist} </Link>| Last updated: {newses[0].posting_date} | {rdtime} min read</p>
                  </div>
                  <div className="printshare no-printme">
                    <Printpage />
                    <SocialSharePopup url={pageUrl+newses[0].url} title={newses[0].title} />  
                    <ListenToArticle text={newses[0].eng_summary} />
                  </div>
                </div>
                
                  <div key={newses[0].id}> 
                  {detarry.map((news,index) => <Newd det={news} key={index}  />)}
                  </div>
                  <Summay engsum={newses[0].eng_summary} />
                  <Tags tgs={newstags} />
                  <Auther nws={newses[0]} /> 
              </div>                     
            </div>
            
            <InfiniteScroll />
            
          </div>
        </div>
    );
}