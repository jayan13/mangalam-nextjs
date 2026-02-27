import db from '../../../../lib/db';
import { unstable_cache } from 'next/cache';

const getGalleryDetails = unstable_cache(
    async (id) => {
        try {
            const query = `
        SELECT album_image.file_name as image, photo_album.name as album_name, 
               photo_album.id as album_id,
               photo_album.description as description, photo_gallery.name as gallery_name,
               photo_gallery.id as gallery_id
        FROM photo_gallery
        JOIN photo_album ON photo_album.photo_gallery_id = photo_gallery.id
        JOIN album_image ON album_image.photo_album_id = photo_album.id
        WHERE photo_gallery.id = ?
        ORDER BY album_image.is_cover_image DESC, album_image.id ASC
      `;
            const [rows] = await db.query(query, [id]);
            return rows;
        } catch (error) {
            console.error('Database error in getGalleryDetails:', error);
            return [];
        }
    },
    ['gallery-details'],
    { revalidate: parseInt(process.env.QUERY_REVALIDATE || '360'), tags: ['gallery-details'] }
);

export async function GET(req, { params }) {
    const { id } = await params;
    try {
        const data = await getGalleryDetails(id);
        if (!data || data.length === 0) {
            return new Response(JSON.stringify({ message: 'Gallery not found' }), { status: 404 });
        }
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Cache-Control': 'public, s-maxage=360, stale-while-revalidate=60',
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: 'Error fetching gallery details' }), { status: 500 });
    }
}
