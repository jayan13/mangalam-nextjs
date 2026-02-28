import db from '../../lib/db';

export const revalidate = 360;
import Link from 'next/link';
import Newimg from '../components/Newimg';
import { unstable_cache } from "next/cache";

async function getCategoryNews(category_id) {
    try {
        const [rows] = await db.query(`
            SELECT 
                news.id, 
                CONVERT(news.title USING utf8) as title, 
                news.eng_title, 
                news_image.file_name,
                IF(news_image.title, news_image.title, news.title) as alt,
                "" as url,
                "" as links,
                "" as link_title,
                category.name as category_name
            FROM news_category 
            INNER JOIN news ON news.id = news_category.news_id 
            LEFT JOIN news_image ON news_image.news_id = news.id 
            LEFT JOIN category ON category.id = news_category.category_id
            WHERE news.published = 1 
            AND NOW() BETWEEN news.effective_date AND news.expiry_date 
            AND news_category.category_id = ? 
            GROUP BY news.id 
            ORDER BY news.effective_date DESC 
            LIMIT 4
        `, [category_id]);

        return rows.map(item => {
            const slug = item.eng_title
                ? item.eng_title.replace(/[^\w\s]/gi, '').replaceAll(' ', '-').replaceAll(/-+/gi, '-').toLowerCase()
                : 'news-details';
            return {
                ...item,
                url: `${item.id}-${slug}.html`,
                links: `/en/category/${item.category_id}-${item.category_name?.toLowerCase().replace(/\s+/g, '-')}.html`,
                link_title: item.category_name
            };
        });
    } catch (error) {
        console.error(`Error fetching news for category ${category_id}:`, error);
        return [];
    }
}

const getCachedCategoryNews = unstable_cache(
    async (id) => getCategoryNews(id),
    (id) => [`en-home-cat-${id}`],
    { revalidate: parseInt(process.env.QUERY_REVALIDATE || '360') }
);

function CategorySection({ posts, category }) {
    if (!posts || posts.length === 0) return null;

    // Use the first post for category name if not available
    const catName = category.name;
    const catSlug = `${category.id}-${category.name.toLowerCase().replace(/\s+/g, '-')}.html`;

    return (
        <div className="home-category home-category-type2 en-font">
            <div className="section-heading section-heading-blue">
                {catName}
            </div>

            <div className="category-bottom">
                <div className="category-bottom-left">
                    {posts.map((post, index) => (
                        <div key={post.id} className="news-item">
                            <figure>
                                <Link href={`/en/news/${post.url}`}>
                                    <Newimg news={post} width="211" height="127" />
                                </Link>
                            </figure>
                            <div className="news-item-text">
                                {/* <p className="category-tag">
                                    <Link href={`/en/category/${catSlug}`} title={catName}>
                                        {catName}
                                    </Link>
                                </p> */}
                                <h3>
                                    <Link href={`/en/news/${post.url}`}>
                                        {post.title}
                                    </Link>
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="read-more-link">
                <Link href={`/en/category/${catSlug}`}>Read More {catName}</Link>
            </div>
        </div>
    );
}

export default async function EnglishHome() {
    const categories = [
        { id: 2458, name: 'KERALA' },
        { id: 2460, name: 'INDIA' },
        { id: 2461, name: 'WORLD' },
        { id: 2462, name: 'ENTERTAINMENT' },
        { id: 2463, name: 'SPORTS' },
        { id: 2466, name: 'BUSINESS' },
        { id: 7697, name: 'LIFE STYLE' }
    ];

    const categoryData = await Promise.all(
        categories.map(async (cat) => ({
            category: cat,
            posts: await getCachedCategoryNews(cat.id)
        }))
    );

    return (
        <div className="home-news-container en-font">
            <div className="home-news-section" style={{ flexDirection: 'column', gap: '20px' }}>
                {categoryData.map(({ category, posts }) => (
                    <CategorySection key={category.id} category={category} posts={posts} />
                ))}
            </div>
        </div>
    );
}
