import db from '../lib/db';
import categoriesData from '../data/categories.json';

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
    const flattenCategories = (cats) => {
        let links = [];
        cats.forEach((cat) => {
            links.push({
                url: `${baseUrl}${cat.link}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.5,
            });
            if (cat.children && cat.children.length > 0) {
                links = [...links, ...flattenCategories(cat.children)];
            }
        });
        return links;
    };

    const categoryLinks = flattenCategories(categoriesData);

    // Dynamic Content: Districts
    const districts = [
        { id: 12, name: 'Thiruvananthapuram', slug: '12-Thiruvananthapuram-India.html' },
        { id: 6, name: 'Kollam', slug: '6-Kollam-India.html' },
        { id: 11, name: 'Pathanamthitta', slug: '11-Pathanamthitta-India.html' },
        { id: 1, name: 'Alappuzha', slug: '1-Alappuzha-India.html' },
        { id: 7, name: 'Kottayam', slug: '7-Kottayam-India.html' },
        { id: 3, name: 'Idukki', slug: '3-Idukki-India.html' },
        { id: 2, name: 'Ernakulam', slug: '2-Ernakulam-India.html' },
        { id: 13, name: 'Thrissur', slug: '13-Thrissur-India.html' },
        { id: 10, name: 'Palakkad', slug: '10-Palakkad-India.html' },
        { id: 9, name: 'Malappuram', slug: '9-Malappuram-India.html' },
        { id: 8, name: 'Kozhikode', slug: '8-Kozhikode-India.html' },
        { id: 14, name: 'Vayanad', slug: '14-Vayanad-India.html' },
        { id: 4, name: 'Kannur', slug: '4-Kannur-India.html' },
        { id: 5, name: 'Kasaragod', slug: '5-Kasaragod-India.html' },
    ];

    const districtLinks = districts.map((dist) => ({
        url: `${baseUrl}/district/${dist.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.5,
    }));

    return [...staticLinks, ...newsLinks, ...categoryLinks, ...districtLinks];
}
