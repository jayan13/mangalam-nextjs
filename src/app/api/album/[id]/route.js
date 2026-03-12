import db from '../../../../lib/db';
import { unstable_cache } from 'next/cache';

async function getAlbumImages(albumId) {
    return unstable_cache(
        async () => {
            try {
                console.log(`Fetching images for album ID: ${albumId}`);
                const query = `
                    SELECT 
                        album_image.file_name as image, 
                        photo_album.name as album_name, 
                        photo_album.id as album_id,
                        photo_album.description as album_description,
                        photo_gallery.name as gallery_name,
                        photo_gallery.ml_name as gallery_ml_name,
                        photo_gallery.id as gallery_id,
                        photographer.name as photographer_name
                    FROM photo_album
                    JOIN album_image ON album_image.photo_album_id = photo_album.id
                    JOIN photo_gallery ON photo_gallery.id = photo_album.photo_gallery_id
                    LEFT JOIN photographer ON photographer.id = photo_album.photographer_id
                    WHERE photo_album.id = ?
                    ORDER BY album_image.is_cover_image DESC, album_image.id ASC
                `;

                const [rows] = await db.query(query, [albumId]);
                console.log(`Found ${rows.length} images for album ${albumId}`);
                return rows;
            } catch (error) {
                console.error('Database error in getAlbumImages:', error);
                throw error;
            }
        },
        ['album-images', albumId],
        { revalidate: parseInt(process.env.QUERY_REVALIDATE || '360'), tags: ['album-images'] }
    )();
}

export async function GET(req, { params }) {
    const { id } = await params;
    
    try {
        const images = await getAlbumImages(id);
        return new Response(JSON.stringify({ images }), {
            status: 200,
            headers: {
                'Cache-Control': 'public, s-maxage=360, stale-while-revalidate=60',
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('API Error in GET /api/album/[id]:', error);
        return new Response(JSON.stringify({ message: 'Error fetching album images', error: error.message }), { status: 500 });
    }
}
