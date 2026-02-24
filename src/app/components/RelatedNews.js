import db from '../../lib/db';
import Link from 'next/link';
import Newimg from './Newimg';
import { unstable_cache } from "next/cache";

async function fetchRelatedNews(news_id, category_id, district_id, isEn) {
    try {
        let query = '';
        let params = [];

        if (category_id) {
            query = `
                SELECT 
                    news.id, 
                    CONVERT(news.title USING utf8) as title, 
                    news.eng_title, 
                    news_image.file_name,
                    IF(news_image.title, news_image.title, news.title) as alt
                FROM news_category 
                INNER JOIN news ON news.id = news_category.news_id 
                LEFT JOIN news_image ON news_image.news_id = news.id 
                WHERE news.published = 1 
                AND NOW() BETWEEN news.effective_date AND news.expiry_date 
                AND news_category.category_id = ? 
                AND news.id != ?
                GROUP BY news.id 
                ORDER BY news.effective_date DESC 
                LIMIT 5
            `;
            params = [category_id, news_id];
        } else if (district_id) {
            query = `
                SELECT 
                    news.id, 
                    CONVERT(news.title USING utf8) as title, 
                    news.eng_title, 
                    news_image.file_name,
                    IF(news_image.title, news_image.title, news.title) as alt
                FROM news 
                LEFT JOIN news_image ON news_image.news_id = news.id 
                WHERE news.published = 1 
                AND NOW() BETWEEN news.effective_date AND news.expiry_date 
                AND news.district_id = ? 
                AND news.id != ?
                GROUP BY news.id 
                ORDER BY news.effective_date DESC 
                LIMIT 5
            `;
            params = [district_id, news_id];
        } else {
            return [];
        }

        const [rows] = await db.query(query, params);

        return rows.map(item => {
            const slug = item.eng_title
                ? item.eng_title.replace(/[^\w\s]/gi, '').replaceAll(' ', '-').replaceAll(/-+/gi, '-').toLowerCase()
                : 'news-details';
            const pathPrefix = isEn ? '/en/news/' : '/news/';
            return {
                ...item,
                url: `${pathPrefix}${item.id}-${slug}.html`
            };
        });
    } catch (error) {
        console.error('Error fetching related news:', error);
        return [];
    }
}

const getCachedRelatedNews = unstable_cache(
    async (news_id, category_id, district_id, isEn) => fetchRelatedNews(news_id, category_id, district_id, isEn),
    (news_id, category_id, district_id, isEn) => [`related-news-${news_id}-${category_id}-${district_id}-${isEn}`],
    { revalidate: 360 }
);

export default async function RelatedNews({ news_id, category_id, district_id, isEn = false }) {
    const relatedPosts = await getCachedRelatedNews(news_id, category_id, district_id, isEn);

    if (!relatedPosts || relatedPosts.length === 0) return null;

    return (
        <div className={`related-news-section ${isEn ? 'en-font' : ''}`} style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '20px', fontWeight: '700' }}>
                {isEn ? 'Related News' : 'ബന്ധപ്പെട്ട വാർത്തകൾ'}
            </h3>
            <div className="related-news-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {relatedPosts.map((post) => (
                    <div key={post.id} className="related-news-item" style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ flexShrink: 0 }}>
                            <Link href={post.url}>
                                <Newimg news={post} width="120" height="72" />
                            </Link>
                        </div>
                        <div className="related-news-text">
                            <h4 style={{ fontSize: '16px', margin: 0, lineHeight: '1.4' }}>
                                <Link href={post.url} style={{ color: '#000', textDecoration: 'none' }}>
                                    {post.title}
                                </Link>
                            </h4>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
