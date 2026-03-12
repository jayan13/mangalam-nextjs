import db from '../../lib/db';
import PhotoGalleryClient from './PhotoGalleryClient';

export const revalidate = 360;

async function getAllAlbums(limit = 20, offset = 0) {
    try {
        const query = `
            SELECT 
                photo_album.id, 
                photo_album.name, 
                photo_album.ml_name, 
                photo_album.description,
                photo_gallery.name as gallery_name,
                photo_gallery.id as gallery_id,
                (SELECT file_name FROM album_image 
                 WHERE photo_album_id = photo_album.id 
                 ORDER BY is_cover_image DESC, id ASC LIMIT 1) as thumbnail
            FROM photo_album
            JOIN photo_gallery ON photo_gallery.id = photo_album.photo_gallery_id
            WHERE photo_gallery.id != 8
            AND EXISTS (SELECT 1 FROM album_image WHERE photo_album_id = photo_album.id)
            ORDER BY photo_album.created_date DESC
            LIMIT ? OFFSET ?
        `;
        const [rows] = await db.query(query, [limit, offset]);
        return rows;
    } catch (error) {
        console.error('Error in getAllAlbums:', error);
        return [];
    }
}

export default async function PhotoGalleryPage() {
    const albums = await getAllAlbums();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center text-red-600">PHOTO GALLERY</h1>
            <PhotoGalleryClient initialAlbums={albums} />
        </div>
    );
}

export async function generateMetadata() {
    return {
        title: 'Photo Gallery | Mangalam',
        description: 'Browse all photo albums and galleries from Mangalam.',
    };
}
