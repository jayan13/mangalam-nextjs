import db from '../../lib/db';
import { unstable_cache } from 'next/cache';
import WebStoriesClient from './WebStoriesClient';

export const revalidate = 360;

const GALLEY_ID = 8; // Web Stories

async function getInitialAlbums() {
    return unstable_cache(
        async () => {
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
                    AND EXISTS (SELECT 1 FROM album_image WHERE photo_album_id = photo_album.id)
                    ORDER BY created_date DESC
                    LIMIT 20 OFFSET 0
                `;
                const [rows] = await db.query(query, [GALLEY_ID]);
                return rows;
            } catch (error) {
                console.error('Database error in getInitialAlbums:', error);
                return [];
            }
        },
        ['web-stories-initial-albums', GALLEY_ID],
        { revalidate: parseInt(process.env.QUERY_REVALIDATE || '360'), tags: ['gallery-albums'] }
    )();
}

async function getGalleryName() {
    return unstable_cache(
        async () => {
            try {
                const [rows] = await db.query('SELECT name, ml_name FROM photo_gallery WHERE id = ?', [GALLEY_ID]);
                return rows[0]?.ml_name || rows[0]?.name || "Web Stories";
            } catch (error) {
                return "Web Stories";
            }
        },
        ['gallery-name', GALLEY_ID],
        { revalidate: parseInt(process.env.QUERY_REVALIDATE || '360') }
    )();
}

export async function generateMetadata() {
    const galleryName = await getGalleryName();
    return {
        title: `${galleryName} | Mangalam`,
        description: `Explore the latest ${galleryName} from Mangalam.`,
    };
}

export default async function WebStoriesPage({ searchParams }) {
    const { album } = await searchParams;
    let albums = [];
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
            AND EXISTS (SELECT 1 FROM album_image WHERE photo_album_id = photo_album.id)
            ORDER BY created_date DESC
            LIMIT 20 OFFSET 0
        `;
        const [rows] = await db.query(query, [GALLEY_ID]);
        albums = rows;
    } catch (error) {
        console.error('Error in WebStoriesPage:', error);
    }

    let galleryName = "Web Stories";
    try {
        const [rows] = await db.query('SELECT name, ml_name FROM photo_gallery WHERE id = ?', [GALLEY_ID]);
        galleryName = rows[0]?.ml_name || rows[0]?.name || "Web Stories";
    } catch (error) { }

    return (
        <WebStoriesClient
            initialAlbums={albums}
            galleryId={GALLEY_ID}
            galleryName={galleryName}
            initialAlbumId={album}
        />
    );
}
