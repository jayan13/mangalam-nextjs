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
            'SELECT news.id, news.eng_title, news.effective_date, news_category.category_id FROM news LEFT JOIN news_category ON news_category.news_id = news.id WHERE news.published=1 AND NOW() > news.effective_date ORDER BY news.effective_date DESC LIMIT 1000'
        );
        const getCategoryById = (items, id) => {
            for (const item of items) {
                if (item.id === id) return item;
                if (item.children && item.children.length > 0) {
                    const found = getCategoryById(item.children, id);
                    if (found) return found;
                }
            }
            return null;
        };

        newsLinks = news.map((post) => {
            let categoryStr = '';
            if (post.category_id) {
                const categoryObj = getCategoryById(categoriesData, post.category_id);
                if (categoryObj && categoryObj.name) {
                    categoryStr = slugify(categoryObj.name) + '-';
                }
            }
            return {
                url: `${baseUrl}/news/detail/${post.id}-${categoryStr}${slugify(post.eng_title)}.html`,
                lastModified: post.effective_date,
                changeFrequency: 'monthly',
                priority: 0.6,
            };
        });
    } catch (error) {
        console.error('Sitemap Error (News):', error);
    }

    // Dynamic Content: Categories
    const categoryLinkOverrides = {
        2457: '/en-news',
        2458: '/en-news/category/2458-kerala.html',
        2460: '/en-news/category/2460-india.html',
        2461: '/en-news/category/2461-world.html',
        2462: '/en-news/category/2462-entertainment.html',
        2463: '/en-news/category/2463-sports.html',
        2466: '/en-news/category/2466-business.html',
        7697: '/en-news/category/7697-life-style.html',
    };

    const flattenCategories = (cats) => {
        let links = [];
        cats.forEach((cat) => {
            const resolvedLink = categoryLinkOverrides[cat.id] || cat.link;
            links.push({
                url: `${baseUrl}${resolvedLink}`,
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
