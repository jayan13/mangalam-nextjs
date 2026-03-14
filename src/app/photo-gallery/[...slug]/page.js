import db from '../../../lib/db';
import PhotoGalleryClient from '../PhotoGalleryClient';

export const revalidate = 360;

async function getGalleryAlbums(galleryId, limit = 20, offset = 0) {
    try {
        const query = `
            SELECT 
                photo_album.id, 
                photo_album.name, 
                photo_album.ml_name, 
                photo_album.description,
                photo_gallery.name as gallery_name,
                photo_gallery.ml_name as gallery_ml_name,
                photo_gallery.id as gallery_id,
                (SELECT file_name FROM album_image 
                 WHERE photo_album_id = photo_album.id 
                 ORDER BY is_cover_image DESC, id ASC LIMIT 1) as thumbnail
            FROM photo_album
            JOIN photo_gallery ON photo_gallery.id = photo_album.photo_gallery_id
            WHERE photo_gallery.id = ?
            AND EXISTS (SELECT 1 FROM album_image WHERE photo_album_id = photo_album.id)
            ORDER BY photo_album.created_date DESC
            LIMIT ? OFFSET ?
        `;
        const [rows] = await db.query(query, [galleryId, limit, offset]);
        return rows;
    } catch (error) {
        console.error('Error in getGalleryAlbums:', error);
        return [];
    }
}

export default async function GalleryViewPage({ params, searchParams }) {
    const { slug } = await params;
    const { album } = await searchParams;

    if (!slug || slug.length === 0) return <div>Gallery not found.</div>;

    const galleryId = slug[0].split('-')[0];
    const albums = await getGalleryAlbums(galleryId);

    if (!albums || albums.length === 0) return <div className="p-20 text-center">No albums found in this gallery.</div>;

    const galleryName = albums[0]?.gallery_ml_name || albums[0]?.gallery_name || "Gallery";

    return (
        <div className="container mx-auto px-4 py-8 photo-gallery-container">
            <h1 className="text-4xl font-bold mb-8 text-center text-red-600 uppercase">{galleryName}</h1>
            <PhotoGalleryClient initialAlbums={albums} galleryId={galleryId} initialAlbumId={album} />
        </div>
    );
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const galleryId = slug[0].split('-')[0];

    try {
        const [rows] = await db.query('SELECT name, ml_name FROM photo_gallery WHERE id = ?', [galleryId]);
        const name = rows[0]?.ml_name || rows[0]?.name || "Gallery";
        return {
            title: `${name} | Photo Gallery | Mangalam`,
            description: `Browse photo albums from ${name} gallery.`,
        };
    } catch (e) {
        return { title: 'Photo Gallery | Mangalam' };
    }
}
