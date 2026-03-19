import db from '@/lib/db';
import { unstable_cache } from 'next/cache';

const getLiveUpdates = unstable_cache(
  async () => {
    try {
      

      const [posts] = await db.query(
        `select id,title,modified_date from news_on_live order by modified_date desc limit 30`        
      );

      if (!posts || posts.length === 0) return [];
      return posts;
    } catch (error) {
    console.error('Database error in getLiveUpdates:', error);
      return [];
    }
  },
  ['live-updates'],
  { revalidate: parseInt(process.env.QUERY_REVALIDATE || '360'), tags: ['live-updates'] }
);

export async function GET(req) {
  try {
    const updates = await getLiveUpdates();

    return new Response(JSON.stringify({ updates }), {
      status: 200,
      headers: {
        'Cache-Control': `public, s-maxage=${process.env.API_REVALIDATE || '360'}, stale-while-revalidate=60`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('API GET Error:', error);
    return new Response(JSON.stringify({ message: 'Error fetching live updates' }), { status: 500 });
  }
}

