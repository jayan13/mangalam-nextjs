import db from '@/lib/db';
import { unstable_cache } from 'next/cache';

const getLiveUpdates = unstable_cache(
  async (display_from) => {
    try {
      

      const [posts] = await db.query(
        `select id,title,modified_date from news_on_live where id > ? order by modified_date desc limit 100`, [display_from]
      );

      if (!posts || posts.length === 0) return [];
      return posts;
    } catch (error) {
    console.error('Database error in getLiveUpdates:', error);
      return [];
    }
  },
  ['live-updates'],
  { revalidate: parseInt('120'), tags: ['live-updates'] }
);

export async function GET(req) {
  try {
    const display_from = req.nextUrl.searchParams.get('displayfrom') || 0;
    const updates = await getLiveUpdates(display_from);    
    return new Response(JSON.stringify({ updates }), {
      status: 200,
      headers: {
        'Cache-Control': `public, s-maxage=120, stale-while-revalidate=60`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('API GET Error:', error);
    return new Response(JSON.stringify({ message: 'Error fetching live updates' }), { status: 500 });
  }
}

