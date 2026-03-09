import db from '../../../../lib/db';
import { unstable_cache } from 'next/cache';

export async function getGalleryAlbums(galleryId, limit = 20, offset = 0) {
    return unstable_cache(
        async () => {
            try {
                console.log(`Fetching gallery albums for ID: ${galleryId}, Limit: ${limit}, Offset: ${offset}`);
                const query = `
                    SELECT 
                        photo_album.id, 
                        photo_album.name, 
                        photo_album.ml_name, 
                        photo_album.description,
                        (SELECT file_name FROM album_image 
                         WHERE photo_album_id = photo_album.id 
                         ORDER BY is_cover_image DESC, id ASC LIMIT 1) as thumbnail
                    FROM photo_album
                    WHERE photo_gallery_id = ?
                    AND EXISTS (SELECT 1 FROM album_image WHERE photo_album_id = photo_album.id)
                    ORDER BY created_date DESC
                    LIMIT ? OFFSET ?
                `;
                const [rows] = await db.query(query, [galleryId, parseInt(limit.toString()), parseInt(offset.toString())]);
                console.log(`Found ${rows.length} albums for gallery ${galleryId}`);
                return rows;
            } catch (error) {
                console.error('Database error in getGalleryAlbums:', error);
                throw error;
            }
        },
        ['gallery-albums', galleryId, limit.toString(), offset.toString()],
        { revalidate: parseInt(process.env.QUERY_REVALIDATE || '360'), tags: ['gallery-albums'] }
    )();
}

export async function GET(req, { params }) {
    const { id } = await params;
    console.log('API Request - Params:', id);
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    console.log('API Request - ID:', id, 'Limit:', limit, 'Offset:', offset);

    try {
        const albums = await getGalleryAlbums(id, limit, offset);
        console.log(`API Found ${albums?.length || 0} albums`);
        return new Response(JSON.stringify({ albums }), {
            status: 200,
            headers: {
                'Cache-Control': 'public, s-maxage=360, stale-while-revalidate=60',
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('API Error in GET /api/gallery/[id]:', error);
        return new Response(JSON.stringify({ message: 'Error fetching gallery albums', error: error.message }), { status: 500 });
    }
}
