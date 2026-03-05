import db from '../../../../lib/db';
import { unstable_cache } from 'next/cache';

const getGalleryDetails = unstable_cache(
    async (id, albumId) => {
        try {
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
            return rows;
        } catch (error) {
            console.error('Database error in getGalleryDetails:', error);
            return [];
        }
    },
    ['gallery-details', id, albumId || 'all'],
    { revalidate: parseInt(process.env.QUERY_REVALIDATE || '360'), tags: ['gallery-details'] }
);

const getGalleryAlbums = unstable_cache(
    async (galleryId) => {
        try {
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
                ORDER BY created_date DESC
            `;
            const [rows] = await db.query(query, [galleryId]);
            return rows;
        } catch (error) {
            console.error('Database error in getGalleryAlbums:', error);
            return [];
        }
    },
    ['gallery-albums', galleryId],
    { revalidate: parseInt(process.env.QUERY_REVALIDATE || '360'), tags: ['gallery-albums'] }
);

export async function GET(req, { params }) {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const albumId = searchParams.get('album');

    try {
        const [images, albums] = await Promise.all([
            getGalleryDetails(id, albumId),
            getGalleryAlbums(id)
        ]);

        if (!images || images.length === 0) {
            return new Response(JSON.stringify({ message: 'Gallery or Album not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ images, albums }), {
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
