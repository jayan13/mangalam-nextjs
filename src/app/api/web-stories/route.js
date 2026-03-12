import db from '@/lib/db';
import { unstable_cache } from 'next/cache';

const getWebStories = unstable_cache(
    async () => {
        try {
            const query = `
                SELECT 
                    photo_gallery.id as gallery_id,
                    photo_gallery.name as gallery_name,
                    photo_gallery.ml_name as gallery_ml_name,
                    photo_album.id as album_id,
                    photo_album.name as album_name,
                    photo_album.ml_name as album_ml_name,
                    (SELECT file_name FROM album_image 
                     WHERE photo_album_id = photo_album.id 
                     ORDER BY is_cover_image DESC, id ASC LIMIT 1) as image
                FROM photo_gallery
                JOIN photo_album ON photo_album.photo_gallery_id = photo_gallery.id
                WHERE photo_album.photo_gallery_id = 8 
                AND photo_album.promote_to_front_page = 1
                AND EXISTS (SELECT 1 FROM album_image WHERE photo_album_id = photo_album.id)
                ORDER BY photo_album.created_date DESC
                LIMIT 0, 12
            `;
            const [rows] = await db.query(query);

            const formattedRows = rows.map(row => {
                return {
                    album_id: row.album_id,
                    name: row.album_ml_name || row.album_name,
                    image: row.image,
                    url: `/web-stories?album=${row.album_id}`,
                };
            });

            return formattedRows;
        } catch (error) {
            console.error('Database error in getWebStories:', error);
            return [];
        }
    },
    ['web-stories-api'],
    { revalidate: parseInt(process.env.QUERY_REVALIDATE || '360'), tags: ['web-stories-api'] }
);

export async function GET() {
    try {
        const data = await getWebStories();
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Cache-Control': `public, s-maxage=${process.env.API_REVALIDATE || '360'}, stale-while-revalidate=60`,
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('API GET Error:', error);
        return new Response(JSON.stringify({ message: 'Error fetching web stories' }), { status: 500 });
    }
}
