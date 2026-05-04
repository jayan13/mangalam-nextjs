import db from '@/lib/db';
import { unstable_cache } from 'next/cache';

const getBreakingNews = unstable_cache(
  async ({ limit }) => {
    try {
      const query = `
        SELECT
          id,
          title,
          image,
          target_url,
          is_special_page_banner,
          published,
          created_date,
          modified_date
        FROM breaking_news
        WHERE published = 1
        ORDER BY modified_date DESC, created_date DESC, id DESC
        LIMIT ?`;

      const [rows] = await db.query(query, [limit]);
      return rows || [];
    } catch (error) {
      console.error('Database error in getBreakingNews:', error);
      return [];
    }
  },
  ['breaking-news'],
  { revalidate: parseInt(process.env.QUERY_REVALIDATE || '360'), tags: ['breaking-news'] }
);

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limitRaw = searchParams.get('limit');
    const limit = Math.min(10, Math.max(1, Number.parseInt(limitRaw || '1', 10) || 1));

    const rows = await getBreakingNews({ limit });

    return new Response(JSON.stringify({ data: rows }), {
      status: 200,
      headers: {
        'Cache-Control': `public, s-maxage=${process.env.API_REVALIDATE || '360'}, stale-while-revalidate=60`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching breaking news:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch breaking news' }), { status: 500 });
  }
}
