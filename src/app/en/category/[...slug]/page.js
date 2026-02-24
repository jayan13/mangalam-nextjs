
import db from '../../../../lib/db';
import InfiniteScroll from '../../../components/InfiniteScroll';
import Catnews from '../../../components/Catnews';
import Link from 'next/link';
import Image from "next/image";
import { unstable_cache } from "next/cache";
import { Suspense } from 'react';
import NewsListSkeleton from '../../../components/skeletons/NewsListSkeleton';

async function getCategory(cat_id) {
    try {
        let [rows] = await db.query('SELECT name,parent_id,id FROM category where id=?', cat_id);
        return rows;
    } catch (error) {
        console.error('Database error in getCategory:', error);
        return [];
    }
}

async function getCategoryByName(cat_name) {
    try {
        const cleanName = cat_name.replace('.html', '');
        const [rows] = await db.query(
            'SELECT name, parent_id, id FROM category WHERE status=1 AND (REPLACE(LOWER(name), " ", "-") = ? OR REPLACE(REPLACE(LOWER(name), " ", "-"), "(", "") = ?)',
            [cleanName, cleanName]
        );
        return rows;
    } catch (error) {
        console.error('Database error in getCategoryByName:', error);
        return [];
    }
}

async function getCategorys(cat_id) {
    try {
        let [rows] = await db.query('SELECT id,name,concat("/en/category/",id,"-",REPLACE(LOWER(name)," ","-"),".html") as links FROM category where status=1 and parent_id=? order by list_order', cat_id);
        return rows;
    } catch (error) {
        console.error('Database error in getCategorys:', error);
        return [];
    }
}

async function getCategoryDetail(cat_id) {
    try {
        let [rows] = await db.query('SELECT name,id,concat("/en/category/",id,"-",REPLACE(LOWER(name)," ","-"),".html") as links FROM category where id=?', cat_id);
        return rows;
    } catch (error) {
        console.error('Database error in getCategoryDetail:', error);
        return [];
    }
}

async function getInitialPosts(category_id) {
    try {
        let distnewslist = [];
        let [data] = await db.query('SELECT news.id,news.title,news.eng_title,news_image.file_name,CONVERT(news.news_details USING utf8) as "news_details",if(news_image.title,news_image.title,news.title) as alt,"" as url,news_category.category_id FROM news_category inner join news on news.id=news_category.news_id left join news_image on news_image.news_id=news.id where news.published=1 and NOW() between news.effective_date and news.expiry_date and news_category.category_id=?  group by news.id order by news.effective_date DESC limit 0,8', [category_id]);

        if (data.length) {
            for (let nws in Object.keys(data)) {
                if (data[nws]['eng_title']) {
                    let newstit = JSON.stringify(data[nws]['eng_title']);
                    let slug = newstit.toString().replace(/[^\w\s]/gi, '').replaceAll(' ', '-').replaceAll(/-+/gi, '-').toLowerCase();
                    data[nws]['url'] = `/en/news/${data[nws]['id']}-${slug}.html`;
                } else {
                    data[nws]['url'] = `/en/news/${data[nws]['id']}-news-details.html`;
                }
                data[nws]['news_details'] = SubstringWithoutBreakingWords(data[nws]['news_details'], 160);
            }
        }
        distnewslist[0] = data;
        return JSON.parse(JSON.stringify(distnewslist));
    } catch (error) {
        console.error('Database error in getInitialPosts:', error);
        return [[]];
    }
}

function SubstringWithoutBreakingWords(str, limit) {
    if (!str) return "";
    if (str.length <= limit) return str;
    let substring = str.substring(0, limit);
    if (str[limit] !== ' ' && substring.lastIndexOf(' ') !== -1) {
        substring = substring.substring(0, substring.lastIndexOf(' '));
    }
    return substring;
}

const getCachedCategory = unstable_cache(async (id) => getCategory(id), (id) => [`en-category-${id}`], { revalidate: 360 });
const getCachedCategoryByName = unstable_cache(async (name) => getCategoryByName(name), (name) => [`en-category-name-${name}`], { revalidate: 360 });
const getCachedCategorys = unstable_cache(async (id) => getCategorys(id), (id) => [`en-categorys-${id}`], { revalidate: 360 });
const getCachedInitialPosts = unstable_cache(async (id) => getInitialPosts(id), (id) => [`en-categorys-posts-${id}`], { revalidate: 360 });
const getCachedCategoryDetail = unstable_cache(async (id) => getCategoryDetail(id), (id) => [`en-category-detail-${id}`], { revalidate: 360 });

async function CatnewsWrapper({ category_id }) {
    const initialPosts = await getCachedInitialPosts(category_id);
    // We need to ensure Catnews uses the correct /en/news prefix
    // Since Catnews is a client component or a shared component, we might need to adjust it or 
    // ensure the URLs are correctly passed in initialPosts.
    return <Catnews initialPosts={initialPosts} category_id={category_id} />;
}

export default async function EnCategoryPage({ params }) {
    const { slug } = await params;
    const urlid = slug[0];
    const parts = urlid.split('-');
    const idValue = parseInt(parts[0]);

    let rows = [];
    let category_id = null;

    if (!isNaN(idValue)) {
        category_id = idValue;
        rows = await getCachedCategory(category_id);
    }

    if ((!rows || !rows.length) && urlid) {
        rows = await getCachedCategoryByName(urlid);
        if (rows && rows.length) {
            category_id = rows[0].id;
        }
    }

    if (!rows || !rows.length || !category_id) {
        return <div className="home-news-container en-font"><h1>Category not found or database error.</h1></div>;
    }

    let cats = await getCachedCategorys(category_id);
    let catlink = '';
    let bred = '';
    let br1 = '';

    if (rows[0].parent_id) {
        const pcats = await getCachedCategoryDetail(rows[0].parent_id);
        if (pcats && pcats.length) {
            br1 = <li className="c-navigation-breadcrumbs__item" property="itemListElement">
                <Link className="c-navigation-breadcrumbs__link" href={`${pcats[0].links}`} property="item">
                    <span property="name">{pcats[0].name}</span>
                </Link>
                <meta property="position" content="2" />
            </li>;
        }
    }

    bred = <nav className="c-navigation-breadcrumbs en-font" aria-label="Breadcrumb" vocab="https://schema.org/">
        <ol className="c-navigation-breadcrumbs__directory">
            <li className="c-navigation-breadcrumbs__item" property="itemListElement">
                <Link className="c-navigation-breadcrumbs__link" href="/en" property="item">
                    <Image src="/img/icons/home.svg" width={20} height={20} alt="Home" />
                    <span className="u-visually-hidden" property="name">Home</span>
                </Link>
                <meta property="position" content="1" />
            </li>
            {br1}
            <li className="c-navigation-breadcrumbs__item" property="itemListElement">
                <span property="name">{rows[0].name}</span>
                <meta property="position" content="3" />
            </li>
        </ol>
    </nav>

    if (cats.length) {
        catlink = <div className="category-sublinks en-font">
            <ul>
                {cats.map((cat, index) => (
                    <li key={index}><Link href={`${cat.links}`}>{cat.name}</Link></li>
                ))}
            </ul>
        </div>;
    }

    return (
        <div className='home-news-container en-font'>
            {bred}
            <div className="category-header"><h1>{rows[0].name}</h1>
                {catlink}
            </div>
            <div className='home-news-section' >
                <Suspense fallback={<NewsListSkeleton />}>
                    <CatnewsWrapper category_id={category_id} />
                </Suspense>
                <InfiniteScroll />
            </div>
        </div>
    );
}
