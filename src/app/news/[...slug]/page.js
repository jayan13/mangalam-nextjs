
import db from '../../../lib/db';
import { Fragment } from 'react';
import InfiniteScroll from '../../components/InfiniteScroll';
import SocialSharePopup from "../../components/SocialSharePopup";
import Printpage from "../../components/Printpage";
import ListenToArticle from "../../components/ListenToArticle";
import Image from "next/image";
import Link from 'next/link';
import Script from 'next/script';
import { unstable_cache } from "next/cache";
import UnibotsAd from "../../adds/UnibotPlay";

const pageUrl = process.env.BASEURL + '/';

export async function getDetails(news_id) {
  try {
    let [rows] = await db.query('SELECT news.id,news.title,news.eng_title,news.eng_summary,DATE_FORMAT(news.effective_date, "%d %b %Y, %l:%i %p") as posting_date,news_details as row_news_details,CONVERT(news.news_details USING utf8) as news_details,concat("/news/",news.id,"-",REPLACE(LOWER(news.eng_title)," ","-"),".html") as url,news.meta_keywords,news.meta_description,news.author,news.author_photo,news.author_profile,columnist.name as columnist,columnist.photo as columnist_photo,columnist.profile as columnist_profile,district.name AS district,news.district_id,c.category_id as category_id FROM news left join columnist on columnist.id=news.columnist_id LEFT JOIN (SELECT category_id,news_id FROM news_category) c ON c.news_id = news.id LEFT JOIN district ON district.id = news.district_id where news.id=? group by news.id', news_id);
    return rows;
  } catch (error) {
    console.error('Database error in getDetails:', error);
    return [];
  }
}

export async function getImages(news_id) {
  try {
    let [rows] = await db.query('SELECT file_name FROM news_image where news_id=?', news_id);
    return rows;
  } catch (error) {
    console.error('Database error in getImages:', error);
    return [];
  }
}

export async function getTags(news_id) {
  try {
    let [rows] = await db.query('SELECT news_tags.tags_id,tags.name,concat("/tags/",news_tags.tags_id,"-",REPLACE(LOWER(tags.name)," ","-"),".html") as url FROM `news_tags` left join `tags` on tags.id=news_tags.tags_id where news_tags.news_id=?', news_id);
    return rows;
  } catch (error) {
    console.error('Database error in getTags:', error);
    return [];
  }
}

export async function getCategory(cat_id) {
  try {
    let [rows] = await db.query('SELECT name,parent_id FROM category where id=?', cat_id);
    return rows;
  } catch (error) {
    console.error('Database error in getCategory:', error);
    return [];
  }
}

const getCachedNewsDet = unstable_cache(async (id) => getDetails(id), (id) => [`my-app-news-${id}`], { revalidate: 360 });
const getCachedImages = unstable_cache(async (id) => getImages(id), (id) => [`my-app-images-${id}`], { revalidate: 360 });
const getCachedTags = unstable_cache(async (id) => getTags(id), (id) => [`my-app-tags-${id}`], { revalidate: 360 });
const getCachedCat = unstable_cache(async (id) => getCategory(id), (id) => [`my-app-bcats-${id}`], { revalidate: 360 });

function Newd(props) {
  const newsdetails = props.det;

  const val = newsdetails.value;
  const parag = val.split('<br>');
  const text = [];
  for (let i = 0; i < parag.length; i++) {
    text.push(<Fragment key={`p-${i}`}><div className='article' dangerouslySetInnerHTML={{ __html: parag[i] }} /> <br /></Fragment>);

    if (i == 0) {
      text.push(<UnibotsAd key="unibot-ad" />);
    }
    if (i == 1) {
      text.push(<Fragment key="mgid-ad"><div id="M830015ScriptRootC1358041"></div><Script async="async" src="https://jsc.mgid.com/m/a/mangalam.com.1358041.js"></Script></Fragment>);
    }
  }

  if (newsdetails.url) {
    return (<article key={'imgc' + newsdetails.id}>
      <Image src={process.env.NEXT_PUBLIC_IMAGE_URL + '/' + newsdetails.url} key={'img' + newsdetails.id} alt={newsdetails.title} width={924} height={555} unoptimized={true} />
      {text}
    </article>);
  } else {
    return (<article key={'imgc' + newsdetails.id}>
      {text}
    </article>);
  }



  //return ( (newsdetails.url)? <article key={'imgc'+newsdetails.id}> <Image src={'/'+newsdetails.url} key={'img'+newsdetails.id} alt={newsdetails.title} width={924} height={555}/>  <p className='article' key={newsdetails.id} dangerouslySetInnerHTML={{ __html: newsdetails.value }} /></article> : <article key={'imgc'+newsdetails.id}><p className='article' key={newsdetails.id} dangerouslySetInnerHTML={{ __html: newsdetails.value }} /></article>);
}

function Tags(props) {
  const tgs = props.tgs;
  if (tgs.length) {
    return (<div className="newsextra-container no-printme">
      <h3>Tags</h3>
      <ul className="tags">
        {tgs.map((newst, index) => (
          <li key={index}><Link href={`${newst.url}`} className="tag">{newst.name}</Link></li>
        ))}
      </ul>
    </div>
    );
  } else {
    return ('');
  }

}

function Summay(props) {
  const engsum = props.engsum;
  if (engsum) {
    return (<div className="newsextra-container no-printme">
      <h3>English Summary</h3>
      <p>{engsum}</p>
    </div>);
  } else {
    return ('');
  }

}

function Auther(props) {
  const nws = props.nws;
  let author = '';
  let author_photo = '';
  let author_profile = '';
  if (nws.columnist) {
    author = nws.columnist;
    author_photo = nws.columnist_photo;
    author_profile = nws.columnist_profile;

  } else {

    author = nws.author;
    author_photo = nws.author_photo;
    author_profile = nws.author_profile;

  }

  if (author) {
    return (
      <div className="about-author no-printme">
        <h3>About Author:</h3>
        <div className="author-profile">
          <Image src={process.env.NEXT_PUBLIC_IMAGE_URL + '/' + author_photo} width={80} height={80} alt="Author photo" unoptimized={true} />
          <div className="author-details">
            <h4>{author}</h4>
            <p>{author_profile}</p>
          </div>
        </div>
      </div>
    );
  } else {
    return ('');
  }


}


export async function generateMetadata({ params }) {
  const { slug } = await params;
  const urlid = slug[0];
  const news_id = urlid.split('-')[0];
  const rows = await getCachedNewsDet(news_id);
  if (!rows || !rows.length) {
    return {
      title: 'Mangalam-Latest Kerala News',
      description: 'Mangalam-Latest Kerala News, Malayalam News, Politics, Malayalam Cinema, Sports'
    }
  }
  const tit = (rows[0]['eng_title'] != '') ? rows[0]['eng_title'] : 'Mangalam-Latest Kerala News';
  const des = (rows[0]['meta_description'] != '') ? rows[0].meta_description : 'Mangalam-Latest Kerala News, Malayalam News,  Politics, Malayalam Cinema, Sports';
  //console.log(news_id+'title'+tit);
  return {
    title: tit,
    description: des
  }
}

export default async function News({ params }) {

  const { slug } = await params;
  const urlid = slug[0];
  const news_id = urlid.split('-')[0];
  let newses = [];
  let detail = [];
  let detarry = [];
  let br1 = '';
  let br2 = '';
  let newstags = [];
  let rdtime = 1;


  if (news_id) {

    //const [rows] = await db.query('SELECT * FROM news where id=? ',news_id);
    const rows = await getCachedNewsDet(news_id);
    if (!rows || !rows.length) {
      return <div className="home-news-container"><h1>News not found or database error.</h1></div>;
    }
    newses = rows;
    newstags = await getCachedTags(news_id);
    let ndet = (newses[0].news_details) ? newses[0].news_details.toString() : (newses[0].row_news_details ? newses[0].row_news_details.toString() : '');
    detail = ndet.replaceAll("[BREAK]", "").replace(/(?:\r\n|\r|\n)/g, '<br>').split('[IMG]');
    const text = ndet;
    const wpm = 225;
    const words = text.trim().split(/\s+/).length;
    rdtime = Math.ceil(words / wpm);
    const prows = await getCachedImages(news_id);

    let imgar = [];
    for (let p of prows) {
      imgar.push(p.file_name);
    }
    for (const [i, val] of detail.entries()) {
      let imgurl = '';
      if (imgar[i]) {
        imgurl = imgar[i];
      }

      detarry.push({ id: news_id + i, value: val, url: imgurl, title: newses[0].eng_title });
    }

    if (newses[0].category_id) {

      //let [cats] = await db.query('SELECT name,parent_id FROM category where id=?',newses[0].category_id);
      let cats = await getCachedCat(newses[0].category_id);
      const catname = cats[0].name;
      const catlink = catname.replace(" ", "-");
      br1 = <li className="c-navigation-breadcrumbs__item" property="itemListElement">
        <Link className="c-navigation-breadcrumbs__link" href={`/category/${newses[0].category_id}-${catlink}.html`} property="item">
          <span property="name">{catname}</span>
        </Link>
        <meta property="position" content="2" />
      </li>;

      if (cats[0].parent_id) {
        //let [cats2] = await db.query('SELECT name FROM category where id=?',cats[0].parent_id);
        let cats2 = await getCachedCat(cats[0].parent_id);
        const catname2 = cats2[0].name;
        const catlink2 = catname2.replace(" ", "-");
        br2 = <li className="c-navigation-breadcrumbs__item" property="itemListElement">
          <Link className="c-navigation-breadcrumbs__link" href={`/category/${cats[0].parent_id}-${catlink2}.html`} property="item">
            <span property="name">{catname2}</span>
          </Link>
          <meta property="position" content="3" />
        </li>;
      }

    } else if (newses[0].district_id) {
      br1 = <li className="c-navigation-breadcrumbs__item" property="itemListElement">
        <Link className="c-navigation-breadcrumbs__link" href={`/district/${newses[0].district_id}-${newses[0].district}.html`} property="item">
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

            <nav className="c-navigation-breadcrumbs" aria-label="Breadcrumb" vocab="https://schema.org/">
              <ol className="c-navigation-breadcrumbs__directory">
                <li className="c-navigation-breadcrumbs__item" property="itemListElement">
                  <Link className="c-navigation-breadcrumbs__link" href="/" property="item">
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
                <p className="news-meta">Authored by <Link href="#" title="title text">{(newses[0].author) ? newses[0].author : newses[0].columnist} </Link>| Last updated: {newses[0].posting_date} | {rdtime} min read</p>
              </div>
              <div className="printshare no-printme">
                <Printpage />
                <SocialSharePopup url={pageUrl + newses[0].url} title={newses[0].title} />
                <ListenToArticle text={newses[0].eng_summary} />
              </div>
            </div>

            <div key={newses[0].id}>
              {detarry.map((news, index) => <Newd det={news} key={index} />)}
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