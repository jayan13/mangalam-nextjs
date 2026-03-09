import VisualStoriesClient from './VisualStoriesClient';
import db from '../../../lib/db';
import { unstable_cache } from 'next/cache';

export const revalidate = 360;

async function getGalleryDetails(id, albumId) {
    return unstable_cache(
        async () => {
            try {
                console.log(`Fetching visual story details for ID: ${id}, Album: ${albumId}`);
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
                console.error('Database error in Visual Stories getGalleryDetails:', error);
                throw error;
            }
        },
        ['visual-stories-details', id, albumId || 'all'],
        { revalidate: parseInt(process.env.QUERY_REVALIDATE || '360'), tags: ['visual-stories-details'] }
    )();
}

export default async function VisualStoriesPage({ params, searchParams }) {
    const { slug } = await params;
    const { album } = await searchParams;

    if (!slug || slug.length === 0) return <div className="p-20 text-center">Story not found...</div>;

    const galleryId = slug[0].split('-')[0];
    const images = await getGalleryDetails(galleryId, album);

    if (!images || images.length === 0) return <div className="p-20 text-center">Story not found.</div>;

    const galleryName = images[0]?.gallery_ml_name || images[0]?.gallery_name || "Visual Story";

    return (
        <VisualStoriesClient
            images={images}
            galleryName={galleryName}
            galleryId={galleryId}
            currentAlbumId={album}
        />
    );
}
