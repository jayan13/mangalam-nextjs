import db from '@/lib/db';
import { unstable_cache } from 'next/cache';

const getNews = unstable_cache(
  async (startIndex, limit) => {
    try {
      const query = `
        SELECT 
          news.id, 
          news.title, 
          news.eng_title, 
          CONVERT(news.news_details USING utf8) as news_details, 
          news_image.file_name, 
          IF(news_image.title, news_image.title, news.title) as alt, 
          "" as url 
        FROM news 
        LEFT JOIN news_image ON news_image.news_id = news.id 
        WHERE news.published = 1 
          AND NOW() BETWEEN news.effective_date AND news.expiry_date 
        GROUP BY news.id 
        ORDER BY news.effective_date DESC 
        LIMIT ?, ?`;

      const [rows] = await db.query(query, [startIndex, limit]);

      const processedRows = rows.map(post => {
        let url = post.id + '-news-details.html';
        if (post.eng_title) {
          const slug = post.eng_title
            .toString()
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_]+/g, '-')
            .replace(/^-+|-+$/g, '');
          url = post.id + '-' + slug + '.html';
        }
        return { ...post, url };
      });

      return processedRows;
    } catch (error) {
      console.error('Database error in getNews:', error);
      return [];
    }
  },
  ['all-news'],
  { revalidate: parseInt(process.env.QUERY_REVALIDATE || '360'), tags: ['all-news'] }
);

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    let limit = 10;
    let page = searchParams.get('page') ? searchParams.get('page') : 1;
    const startIndex = (page - 1) * limit;

    const rows = await getNews(startIndex, limit);
    return new Response(JSON.stringify({ data: rows }), {
      status: 200,
      headers: {
        'Cache-Control': `public, s-maxage=${process.env.API_REVALIDATE || '360'}, stale-while-revalidate=60`,
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error fetching data:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), { status: 500 });
  }
}