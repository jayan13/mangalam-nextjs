import db from '../lib/db';

export const revalidate = 3600; // Cache sitemap for 1 hour

const slugify = (text) => {
    if (!text) return 'details';
    return text
        .toString()
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters except word, space, and hyphen
        .replace(/\s+/g, '-')     // Replace spaces with hyphens
        .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
        .trim();
};

export default async function sitemap() {
    const baseUrl = process.env.BASEURL || 'http://localhost:3000';

    // Static Links from Header/Footer/Nav
    const staticLinks = [
        { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 }
    ];

    // Dynamic Content: Recent News
    let newsLinks = [];
    try {
        const [news] = await db.query(
            'SELECT id, eng_title, effective_date FROM news WHERE published=1 AND NOW() BETWEEN effective_date AND expiry_date ORDER BY effective_date DESC LIMIT 1000'
        );
        newsLinks = news.map((post) => ({
            url: `${baseUrl}/news/${post.id}-${slugify(post.eng_title)}.html`,
            lastModified: post.effective_date,
            changeFrequency: 'monthly',
            priority: 0.6,
        }));
    } catch (error) {
        console.error('Sitemap Error (News):', error);
    }

    // Dynamic Content: Categories
    let categoryLinks = [];
    try {
        const [categories] = await db.query('SELECT id, name FROM category WHERE status=1');
        categoryLinks = categories.map((cat) => ({
            url: `${baseUrl}/category/${cat.id}-${slugify(cat.name)}.html`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
        }));
    } catch (error) {
        console.error('Sitemap Error (Categories):', error);
    }

    // Dynamic Content: Districts
    let districtLinks = [];
    try {
        const [districts] = await db.query('SELECT id, name FROM district');
        districtLinks = districts.map((dist) => ({
            url: `${baseUrl}/district/${dist.id}-${slugify(dist.name)}.html`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
        }));
    } catch (error) {
        console.error('Sitemap Error (Districts):', error);
    }

    return [...staticLinks, ...newsLinks, ...categoryLinks, ...districtLinks];
}
