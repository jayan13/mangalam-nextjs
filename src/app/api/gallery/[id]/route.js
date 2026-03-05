import db from '../../../../lib/db';
import { unstable_cache } from 'next/cache';

async function getGalleryDetails(id, albumId) {
    return unstable_cache(
        async () => {
            try {
                console.log(`Fetching gallery details for ID: ${id}, Album: ${albumId}`);
                let query = `
                    SELECT 
                        album_image.file_name as image, 
                        photo_album.name as album_name, 
                        photo_album.id as album_id,
                        photo_album.description as album_description,
                        photo_gallery.name as gallery_name,
                        photo_gallery.ml_name as gallery_ml_name,
                        photo_gallery.id as gallery_id,
                        photographer.name as photographer_name
                    FROM photo_gallery
                    JOIN photo_album ON photo_album.photo_gallery_id = photo_gallery.id
                    JOIN album_image ON album_image.photo_album_id = photo_album.id
                    LEFT JOIN photographer ON photographer.id = photo_album.photographer_id
                    WHERE photo_gallery.id = ?
                `;

                const params = [id];
                if (albumId) {
                    query += ` AND photo_album.id = ?`;
                    params.push(albumId);
                }

                query += ` ORDER BY album_image.is_cover_image DESC, album_image.id ASC`;

                const [rows] = await db.query(query, params);
                console.log(`Found ${rows.length} images for gallery ${id}`);
                return rows;
            } catch (error) {
                console.error('Database error in getGalleryDetails:', error);
                throw error;
            }
        },
        ['gallery-details', id, albumId || 'all'],
        { revalidate: parseInt(process.env.QUERY_REVALIDATE || '360'), tags: ['gallery-details'] }
    )();
}

async function getGalleryAlbums(galleryId, limit = 20, offset = 0) {
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
    const { searchParams } = new URL(req.url);
    const albumId = searchParams.get('album');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    try {
        if (type === 'albums') {
            const albums = await getGalleryAlbums(id, limit, offset);
            return new Response(JSON.stringify({ albums }), {
                status: 200,
                headers: {
                    'Cache-Control': 'public, s-maxage=360, stale-while-revalidate=60',
                    'Content-Type': 'application/json',
                },
            });
        }

        const [images, albums] = await Promise.all([
            getGalleryDetails(id, albumId),
            getGalleryAlbums(id, limit, offset)
        ]);

        if (!images || images.length === 0) {
            console.warn(`No images found for gallery ${id} and album ${albumId}`);
            return new Response(JSON.stringify({ message: 'Gallery or Album not found', images: [], albums: [] }), {
                status: 200, // Return 200 with empty data to avoid fetch error, or 404 if preferred. But let's keep it consistent.
                statusText: 'Not Found'
            });
        }

        return new Response(JSON.stringify({ images, albums }), {
            status: 200,
            headers: {
                'Cache-Control': 'public, s-maxage=360, stale-while-revalidate=60',
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('API Error in GET /api/gallery/[id]:', error);
        return new Response(JSON.stringify({ message: 'Error fetching gallery details', error: error.message }), { status: 500 });
    }
}
