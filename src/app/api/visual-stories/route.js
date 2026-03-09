import db from '@/lib/db';
import { unstable_cache } from 'next/cache';

const getVisualStories = unstable_cache(
    async () => {
        try {
            const query = `
                SELECT 
                    photo_gallery.id as gallery_id,
                    photo_gallery.name as gallery_name,
                    photo_gallery.ml_name as gallery_ml_name,
                    photo_album.id as album_id,
                    photo_album.name as album_name,
                    (SELECT file_name FROM album_image 
                     WHERE photo_album_id = photo_album.id 
                     ORDER BY is_cover_image DESC, id ASC LIMIT 1) as image
                FROM photo_gallery
                JOIN photo_album ON photo_album.photo_gallery_id = photo_gallery.id
                WHERE photo_album.promote_to_front_page = 1
                AND photo_album.id = (
                    SELECT id FROM photo_album 
                    WHERE photo_gallery_id = photo_gallery.id 
                    AND promote_to_front_page = 1 
                    ORDER BY id DESC LIMIT 1
                )
                ORDER BY photo_album.id DESC
                LIMIT 0, 12
            `;
            const [rows] = await db.query(query);

            const formattedRows = rows.map(row => {
                const slug = row.gallery_name.toLowerCase().replace(/[^\w\s]/gi, '').replaceAll(' ', '-').replaceAll(/-+/gi, '-');
                return {
                    gallery_id: row.gallery_id,
                    name: row.gallery_ml_name || row.gallery_name,
                    image: row.image,
                    url: `/visual-stories/${row.gallery_id}-${slug}?album=${row.album_id}`,
                };
            });

            return formattedRows;
        } catch (error) {
            console.error('Database error in getVisualStories:', error);
            return [];
        }
    },
    ['visual-stories'],
    { revalidate: parseInt(process.env.QUERY_REVALIDATE || '360'), tags: ['visual-stories'] }
);

export async function GET() {
    try {
        const data = await getVisualStories();
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Cache-Control': `public, s-maxage=${process.env.API_REVALIDATE || '360'}, stale-while-revalidate=60`,
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('API GET Error:', error);
        return new Response(JSON.stringify({ message: 'Error fetching visual stories' }), { status: 500 });
    }
}
