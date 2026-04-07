import db from '@/lib/db';
import { unstable_cache } from "next/cache";
import Link from 'next/link';
import Image from "next/image";
import { Suspense } from 'react';
import InfiniteScroll from '../components/InfiniteScroll';
import Distnews from '../components/Distnews';
import DistrictNav from '../components/DistrictNav';
import NewsListSkeleton from '../components/skeletons/NewsListSkeleton';

export const revalidate = 360;

async function getInitialPosts(district_id) {
    try {
        let distnewslist = [];
        // district_id = 0 means all districts
        const query = `
            SELECT 
                news.id,
                news.title,
                news.eng_title,
                news_image.file_name,
                news.news_details,
                if(news_image.title, news_image.title, news.title) as alt,
                "" as url,
                news.district_id 
            FROM news 
            LEFT JOIN news_image ON news_image.news_id = news.id 
            WHERE news.published = 1 
              AND NOW() BETWEEN news.effective_date AND news.expiry_date 
              AND (? = 0 OR news.district_id = ?) 
            GROUP BY news.id 
            ORDER BY news.effective_date DESC 
            LIMIT 0, 8
        `;
        const [data] = await db.query(query, [district_id, district_id]);

        if (data.length) {
            data.forEach(item => {
                let url = 'detail/' + item.id + '-news-details.html';
                if (item.eng_title) {
                    const slug = item.eng_title
                        .toString()
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/[\s_]+/g, '-')
                        .replace(/^-+|-+$/g, '');
                    url = 'detail/' + item.id + '-' + slug + '.html';
                }
                item['url'] = url;
                item['news_details'] = SubstringWithoutBreakingWords(item['news_details'] || '', 160);
            });
        }
        distnewslist[0] = data;
        return JSON.parse(JSON.stringify(distnewslist));
    } catch (error) {
        console.error('Database error in getInitialPosts:', error);
        return [[]];
    }
}

function SubstringWithoutBreakingWords(str, limit) {
  if (Buffer.isBuffer(str)) str = str.toString("utf8");
  if (typeof str !== "string") str = String(str || "");
    if (str.length <= limit) return str;
    let substring = str.substring(0, limit);
    if (str[limit] !== ' ' && substring.lastIndexOf(' ') !== -1) {
        substring = substring.substring(0, substring.lastIndexOf(' '));
    }
    return substring;
}

const getCachedInitialPosts = unstable_cache(
    async (id) => getInitialPosts(id),
    (id) => [`district-news-initial-${id}`],
    { revalidate: 360 }
);

async function DistnewsWrapper({ district_id }) {
    const initialPosts = await getCachedInitialPosts(district_id);
    return <Distnews initialPosts={initialPosts} district_id={district_id} />;
}

export default async function DistrictLandingPage() {
    const district_id = 0; // All districts
    const pageTitle = "Districts";

    const bred = (
        <nav className="c-navigation-breadcrumbs" aria-label="Breadcrumb" vocab="https://schema.org/">
            <ol className="c-navigation-breadcrumbs__directory">
                <li className="c-navigation-breadcrumbs__item" property="itemListElement">
                    <Link className="c-navigation-breadcrumbs__link" href="/" property="item">
                        <Image src="/img/icons/home.svg" width={20} height={20} alt="Home" />
                        <span className="u-visually-hidden" property="name">Home</span>
                    </Link>
                    <meta property="position" content="1" />
                </li>
                <li className="c-navigation-breadcrumbs__item" property="itemListElement">
                    <span property="name">{pageTitle}</span>
                    <meta property="position" content="2" />
                </li>
            </ol>
        </nav>
    );

    return (
        <div className='home-news-container'>
            {bred}
            <div className="category-header">
                <h1>{pageTitle}</h1>
                <DistrictNav />
            </div>
            <div className='home-news-section' >
                <Suspense fallback={<NewsListSkeleton />}>
                    <DistnewsWrapper district_id={district_id} />
                </Suspense>
                <InfiniteScroll />
            </div>
        </div>
    );
}
