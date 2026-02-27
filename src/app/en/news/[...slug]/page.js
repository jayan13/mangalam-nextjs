
import db from '../../../../lib/db';
import { Fragment } from 'react';
import InfiniteScroll from '../../../components/InfiniteScroll';
import SocialSharePopup from "../../../components/SocialSharePopup";
import Printpage from "../../../components/Printpage";
import ListenToArticle from "../../../components/ListenToArticle";
import Image from "next/image";
import Link from 'next/link';
import Script from 'next/script';
import { unstable_cache } from "next/cache";
// import UnibotsAd from "../../../adds/UnibotPlay";
export const revalidate = 3600;
const pageUrl = process.env.BASEURL + '/en/';

async function getDetails(news_id) {
    try {
        let [rows] = await db.query('SELECT news.id,news.title,news.eng_title,news.eng_summary,DATE_FORMAT(news.effective_date, "%d %b %Y, %l:%i %p") as posting_date,news_details as row_news_details,CONVERT(news.news_details USING utf8) as news_details,news.meta_keywords,news.meta_description,news.author,news.author_photo,news.author_profile,columnist.name as columnist,columnist.photo as columnist_photo,columnist.profile as columnist_profile,district.name AS district,news.district_id,c.category_id as category_id FROM news left join columnist on columnist.id=news.columnist_id LEFT JOIN (SELECT category_id,news_id FROM news_category) c ON c.news_id = news.id LEFT JOIN district ON district.id = news.district_id where news.id=? group by news.id', news_id);
        return rows;
    } catch (error) {
        console.error('Database error in getDetails:', error);
        return [];
    }
}

async function getImages(news_id) {
    try {
        let [rows] = await db.query('SELECT file_name FROM news_image where news_id=?', news_id);
        return rows;
    } catch (error) {
        console.error('Database error in getImages:', error);
        return [];
    }
}

async function getTags(news_id) {
    try {
        let [rows] = await db.query('SELECT news_tags.tags_id,tags.name,concat("/en/tags/",news_tags.tags_id,"-",REPLACE(LOWER(tags.name)," ","-"),".html") as url FROM `news_tags` left join `tags` on tags.id=news_tags.tags_id where news_tags.news_id=?', news_id);
        return rows;
    } catch (error) {
        console.error('Database error in getTags:', error);
        return [];
    }
}

async function getCategory(cat_id) {
    try {
        let [rows] = await db.query('SELECT name,parent_id FROM category where id=?', cat_id);
        return rows;
    } catch (error) {
        console.error('Database error in getCategory:', error);
        return [];
    }
}

const getCachedNewsDet = unstable_cache(async (id) => getDetails(id), (id) => [`en-news-${id}`], { revalidate: 3600 });
const getCachedImages = unstable_cache(async (id) => getImages(id), (id) => [`en-images-${id}`], { revalidate: 3600 });
const getCachedTags = unstable_cache(async (id) => getTags(id), (id) => [`en-tags-${id}`], { revalidate: 3600 });
const getCachedCat = unstable_cache(async (id) => getCategory(id), (id) => [`en-bcats-${id}`], { revalidate: 3600 });

function Newd(props) {
    const newsdetails = props.det;
    const val = newsdetails.value;
    const parag = val.split('<br>');
    const text = [];
    for (let i = 0; i < parag.length; i++) {
        text.push(<Fragment key={`p-${i}`}><div className='article' dangerouslySetInnerHTML={{ __html: parag[i] }} /> <br /></Fragment>);
        // Ads removed for now or should be adjusted
    }

    if (newsdetails.url) {
        return (<article key={'imgc' + newsdetails.id}>
            <Image src={process.env.NEXT_PUBLIC_IMAGE_URL + '/' + newsdetails.url} key={'img' + newsdetails.id} alt={newsdetails.title} width={924} height={555} unoptimized={process.env.NEXT_PUBLIC_IMAGE_URL?.includes('mangalam.cms')} />
            {text}
        </article>);
    } else {
        return (<article key={'imgc' + newsdetails.id}>
            {text}
        </article>);
    }
}

function Tags(props) {
    const tgs = props.tgs;
    if (tgs && tgs.length) {
        return (<div className="newsextra-container no-printme">
            <h3>Tags</h3>
            <ul className="tags">
                {tgs.map((newst, index) => (
                    <li key={index}><Link href={`${newst.url}`} className="tag">{newst.name}</Link></li>
                ))}
            </ul>
        </div>
        );
    }
    return null;
}

function Summary(props) {
    const engsum = props.engsum;
    if (engsum) {
        return (<div className="newsextra-container no-printme">
            <h3>English Summary</h3>
            <p>{engsum}</p>
        </div>);
    }
    return null;
}

function Author(props) {
    const nws = props.nws;
    let author = nws.columnist || nws.author;
    let author_photo = nws.columnist_photo || nws.author_photo;
    let author_profile = nws.columnist_profile || nws.author_profile;

    if (author) {
        return (
            <div className="about-author no-printme">
                <h3>About Author:</h3>
                <div className="author-profile">
                    <Image src={process.env.NEXT_PUBLIC_IMAGE_URL + '/' + author_photo} width={80} height={80} alt="Author photo" unoptimized={process.env.NEXT_PUBLIC_IMAGE_URL?.includes('mangalam.cms')} />
                    <div className="author-details">
                        <h4>{author}</h4>
                        <p>{author_profile}</p>
                    </div>
                </div>
            </div>
        );
    }
    return null;
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const urlid = slug[0];
    const news_id = urlid.split('-')[0];
    const rows = await getCachedNewsDet(news_id);
    if (!rows || !rows.length) {
        return {
            title: 'Mangalam-Latest English News',
        }
    }
    return {
        title: rows[0].eng_title || rows[0].title,
        description: rows[0].meta_description,
        keywords: rows[0].meta_keywords,
    }
}

import { Suspense } from 'react';
import NewsDetailSkeleton from '../../../components/skeletons/NewsDetailSkeleton';
import RelatedNews from "../../../components/RelatedNews";

async function NewsContent({ news_id, newses, rdtime, pageUrl }) {
    const newstags = await getTags(news_id);
    const detail = ((newses[0].news_details) ? newses[0].news_details.toString() : (newses[0].row_news_details ? newses[0].row_news_details.toString() : '')).replaceAll("[BREAK]", "").replace(/(?:\r\n|\r|\n)/g, '<br>').split('[IMG]');
    const prows = await getCachedImages(news_id);

    let imgar = prows.map(p => p.file_name);
    let detarry = detail.map((val, i) => ({
        id: news_id + i,
        value: val,
        url: imgar[i] || '',
        title: newses[0].eng_title
    }));

    return (
        <>
            <h1>{newses[0].title}</h1>
            <div className="news-single-meta">
                <div className="single-meta">
                    <p className="news-meta">Authored by <Link href="#" title="author">{(newses[0].author) ? newses[0].author : newses[0].columnist} </Link>| Last updated: {newses[0].posting_date} | {rdtime} min read</p>
                </div>
                <div className="printshare no-printme">
                    <Printpage />
                    <SocialSharePopup url={pageUrl + newses[0].id + '-' + (newses[0].eng_title?.toLowerCase().replace(/\s+/g, '-') || 'news') + '.html'} title={newses[0].title} />
                    <ListenToArticle text={newses[0].eng_summary} />
                </div>
            </div>

            <div key={newses[0].id}>
                {detarry.map((news, index) => <Newd det={news} key={index} />)}
            </div>
            <Summary engsum={newses[0].eng_summary} />
            <Tags tgs={newstags} />
            <Author nws={newses[0]} />

            <RelatedNews
                news_id={news_id}
                category_id={newses[0].category_id}
                district_id={newses[0].district_id}
                isEn={true}
            />
        </>
    );
}

export default async function News({ params }) {
    const { slug } = await params;
    const urlid = slug[0];
    const news_id = urlid.split('-')[0];
    let newses = [];
    let br1 = '';
    let br2 = '';
    let rdtime = 1;

    if (news_id) {
        const rows = await getCachedNewsDet(news_id);
        if (!rows || !rows.length) {
            return <div className="home-news-container en-font"><h1>News not found or database error.</h1></div>;
        }
        newses = rows;
        let ndet = (newses[0].news_details) ? newses[0].news_details.toString() : (newses[0].row_news_details ? newses[0].row_news_details.toString() : '');
        const words = ndet.trim().split(/\s+/).length;
        rdtime = Math.ceil(words / 225);

        if (newses[0].category_id) {
            let cats = await getCachedCat(newses[0].category_id);
            if (cats && cats.length) {
                const catname = cats[0].name;
                const catlink = catname.toLowerCase().replace(/\s+/g, "-");
                br1 = <li className="c-navigation-breadcrumbs__item" property="itemListElement">
                    <Link className="c-navigation-breadcrumbs__link" href={`/en/category/${newses[0].category_id}-${catlink}.html`} property="item">
                        <span property="name">{catname}</span>
                    </Link>
                    <meta property="position" content="2" />
                </li>;

                if (cats[0].parent_id) {
                    let cats2 = await getCachedCat(cats[0].parent_id);
                    if (cats2 && cats2.length) {
                        const catname2 = cats2[0].name;
                        const catlink2 = catname2.toLowerCase().replace(/\s+/g, "-");
                        br2 = <li className="c-navigation-breadcrumbs__item" property="itemListElement">
                            <Link className="c-navigation-breadcrumbs__link" href={`/en/category/${cats[0].parent_id}-${catlink2}.html`} property="item">
                                <span property="name">{catname2}</span>
                            </Link>
                            <meta property="position" content="3" />
                        </li>;
                    }
                }
            }
        }
    }

    return (
        <div className="home-news-container en-font">
            <div className='home-news-section'>
                <div className='singlenews-left'>
                    <div className='single-section-header no-printme'>
                        <nav className="c-navigation-breadcrumbs" aria-label="Breadcrumb" vocab="https://schema.org/">
                            <ol className="c-navigation-breadcrumbs__directory">
                                <li className="c-navigation-breadcrumbs__item" property="itemListElement">
                                    <Link className="c-navigation-breadcrumbs__link" href="/en" property="item">
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
                        <Suspense fallback={<NewsDetailSkeleton />}>
                            <NewsContent news_id={news_id} newses={newses} rdtime={rdtime} pageUrl={pageUrl} />
                        </Suspense>
                    </div>
                </div>
                <InfiniteScroll />
            </div>
        </div>
    );
}
