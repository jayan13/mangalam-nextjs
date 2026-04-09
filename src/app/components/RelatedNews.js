import db from '../../lib/db';
import Link from 'next/link';
import Newimg from './Newimg';
import { unstable_cache } from "next/cache";
import { getCategoryById } from '@/lib/categories';

async function fetchRelatedNews(news_id, category_id, district_id, isEn) {
    try {
        let query = '';
        let params = [];

        if (category_id) {
            query = `
                SELECT 
                    n.id, 
                    n.title, 
                    n.eng_title, 
                    ni.file_name,
                    COALESCE(ni.title, n.title) AS alt
                FROM (
                    SELECT news_id 
                    FROM news_category 
                    WHERE category_id = ?
                ) nc
                JOIN news n 
                    ON n.id = nc.news_id
                LEFT JOIN news_image ni 
                    ON ni.id = (
                        SELECT MIN(id) 
                        FROM news_image 
                        WHERE news_id = n.id
                    )
                WHERE 
                    n.published = 1
                    AND n.effective_date < NOW()
                    AND n.id != ?
                ORDER BY n.effective_date DESC
                LIMIT 6
            `;
            params = [category_id, news_id];
        } else if (district_id) {
            query = `
                SELECT 
                    n.id, 
                    n.title, 
                    n.eng_title, 
                    ni.file_name,
                    COALESCE(ni.title, n.title) AS alt,
                    nc.category_id
                FROM news n
                LEFT JOIN news_category nc 
                    ON nc.news_id = n.id
                LEFT JOIN news_image ni 
                    ON ni.id = (
                        SELECT MIN(id) 
                        FROM news_image 
                        WHERE news_id = n.id
                    )
                WHERE 
                    n.published = 1
                    AND n.effective_date < NOW()
                    AND n.district_id = ?
                    AND n.id != ?
                ORDER BY n.effective_date DESC
                LIMIT 6
            `;
            params = [district_id, news_id];
        } else {
            return [];
        }

        const [rows] = await db.query(query, params);

        return rows.map(item => {
            let category = (item.category_id) ? getCategoryById(item.category_id).name.toLowerCase().replaceAll(' ', '-').replaceAll(/-+/gi, '-') + '-' : '';
            const slug = item.eng_title
                ? item.eng_title.replace(/[^\w\s]/gi, '').replaceAll(' ', '-').replaceAll(/-+/gi, '-').toLowerCase()
                : 'news-details';
            const pathPrefix = isEn ? '/en-news/detail/' : '/news/detail/';
            return {
                ...item,
                url: `${pathPrefix}${item.id}-${category}${slug}.html`
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
    { revalidate: parseInt(process.env.QUERY_REVALIDATE || '360') }
);

export default async function RelatedNews({ news_id, category_id, district_id, isEn = false }) {
    const relatedPosts = await getCachedRelatedNews(news_id, category_id, district_id, isEn);

    if (!relatedPosts || relatedPosts.length === 0) return null;

    return (
        <div className={`related-news-section ${isEn ? 'en-font' : ''}`} style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '20px', fontWeight: '700' }}>
                {isEn ? 'Related News' : 'ബന്ധപ്പെട്ട വാർത്തകൾ'}
            </h3>
            <div className="related-news-list">
                {relatedPosts.map((post) => (
                    <div key={post.id} className="related-news-item" style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                        <div style={{ flexShrink: 0 }}>
                            <Link href={post.url}>
                                <Newimg news={post} width="120" height="72" />
                            </Link>
                        </div>
                        <div className="related-news-text">
                            <h4 style={{ fontSize: '15px', margin: 0, lineHeight: '1.4', fontWeight: '500' }}>
                                <Link href={post.url} style={{ color: '#333', textDecoration: 'none' }}>
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
