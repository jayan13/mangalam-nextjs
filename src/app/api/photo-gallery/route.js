import db from '@/lib/db';
import { unstable_cache } from 'next/cache';

const getGalleryAlbums = unstable_cache(
    async (galleryId, limit = 12, offset = 0, promotedOnly = false) => {
        try {
            let query = `
                SELECT 
                    photo_gallery.id as gallery_id,
                    photo_gallery.name as gallery_name,
                    photo_gallery.ml_name as gallery_ml_name,
                    photo_album.id as album_id,
                    photo_album.name as album_name,
                    photo_album.ml_name as album_ml_name,
                    photo_album.created_date,
                    (SELECT file_name FROM album_image 
                     WHERE photo_album_id = photo_album.id 
                     ORDER BY is_cover_image DESC, id ASC LIMIT 1) as image
                FROM photo_gallery
                JOIN photo_album ON photo_album.photo_gallery_id = photo_gallery.id
                WHERE EXISTS (SELECT 1 FROM album_image WHERE photo_album_id = photo_album.id)
            `;

            const params = [];
            if (galleryId) {
                query += ` AND photo_gallery.id = ?`;
                params.push(galleryId);
            } else {
                // If no specific gallery selected, exclude "Web Stories" (ID 8)
                query += ` AND photo_gallery.id != 8`;
            }

            if (promotedOnly) {
                query += ` AND photo_album.promote_to_front_page = 1`;
            }

            query += ` ORDER BY photo_album.created_date DESC LIMIT ? OFFSET ?`;
            params.push(parseInt(limit.toString()), parseInt(offset.toString()));

            const [rows] = await db.query(query, params);

            return rows.map(row => {
                const slug = row.gallery_name.toLowerCase().replace(/[^\w\s]/gi, '').replaceAll(' ', '-').replaceAll(/-+/gi, '-');
                return {
                    id: row.album_id,
                    name: row.album_ml_name || row.album_name,
                    thumbnail: row.image,
                    gallery_id: row.gallery_id,
                    gallery_name: row.gallery_ml_name || row.gallery_name,
                    album_id: row.album_id,
                    album_name: row.album_ml_name || row.album_name,
                    image: row.image,
                    url: `/photo-gallery/${row.gallery_id}-${slug}?album=${row.album_id}`,
                    gallery_url: `/photo-gallery/${row.gallery_id}-${slug}`
                };
            });
        } catch (error) {
            console.error('Database error in getGalleryAlbums:', error);
            return [];
        }
    },
    ['photo-gallery-api'],
    { revalidate: parseInt(process.env.QUERY_REVALIDATE || '360'), tags: ['photo-gallery'] }
);

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const galleryId = searchParams.get('galleryId');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = parseInt(searchParams.get('offset') || '0');
    const promoted = searchParams.get('promoted') === 'true';

    try {
        const data = await getGalleryAlbums(galleryId, limit, offset, promoted);
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Cache-Control': `public, s-maxage=${process.env.API_REVALIDATE || '360'}, stale-while-revalidate=60`,
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('API GET Error:', error);
        return new Response(JSON.stringify({ message: 'Error fetching gallery albums' }), { status: 500 });
    }
}
